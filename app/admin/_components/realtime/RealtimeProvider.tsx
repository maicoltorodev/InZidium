"use client";

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    type ReactNode,
} from "react";
import { supabaseCrmClient } from "@/lib/supabase/crm/client";
import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

const SCHEMA = process.env.NEXT_PUBLIC_SUPABASE_SCHEMA ?? "nexus_crm";

/** Tablas que el CRM consume en realtime. */
export type RealtimeTable =
    | "messages"
    | "conversations"
    | "contacts"
    | "contact_media"
    | "orders"
    | "events"
    | "services"
    | "service_variants";

type Row = { [key: string]: any };

export type TableEvent<T extends Row = Row> = RealtimePostgresChangesPayload<T>;

type TableListener<T extends Row = Row> = (event: TableEvent<T>) => void;

type RealtimeApi = {
    /** Devuelve un unsubscribe. */
    onTable: <T extends Row = Row>(
        table: RealtimeTable,
        listener: TableListener<T>,
    ) => () => void;
    /** Suscribe al evento global `crm.reset`. */
    onReset: (listener: () => void) => () => void;
    /** Emite el broadcast `crm.reset` desde el cliente (después de un reset masivo). */
    emitReset: () => Promise<void>;
};

const RealtimeContext = createContext<RealtimeApi | null>(null);

const TABLES: RealtimeTable[] = [
    "messages",
    "conversations",
    "contacts",
    "contact_media",
    "orders",
    "events",
    "services",
    "service_variants",
];

const CHANNEL_NAME = `crm:${SCHEMA}`;

/**
 * Provider único en el admin. Abre UN canal multi-tabla a Supabase Realtime y
 * distribuye eventos a los suscriptores registrados via context.
 */
export function RealtimeProvider({ children }: { children: ReactNode }) {
    const tableListenersRef = useRef<Record<RealtimeTable, Set<TableListener>>>({
        messages: new Set(),
        conversations: new Set(),
        contacts: new Set(),
        contact_media: new Set(),
        orders: new Set(),
        events: new Set(),
        services: new Set(),
        service_variants: new Set(),
    });
    const resetListenersRef = useRef<Set<() => void>>(new Set());
    const channelRef = useRef<ReturnType<typeof supabaseCrmClient.channel> | null>(null);

    useEffect(() => {
        let channel = supabaseCrmClient.channel(CHANNEL_NAME);

        for (const table of TABLES) {
            channel = channel.on(
                "postgres_changes" as any,
                { event: "*", schema: SCHEMA, table },
                (payload: TableEvent) => {
                    const listeners = tableListenersRef.current[table];
                    listeners.forEach((l) => {
                        try {
                            l(payload);
                        } catch (e) {
                            console.error(`[realtime:${table}] listener error`, e);
                        }
                    });
                },
            );
        }

        channel = channel.on("broadcast", { event: "reset" }, () => {
            resetListenersRef.current.forEach((l) => {
                try {
                    l();
                } catch (e) {
                    console.error("[realtime:reset] listener error", e);
                }
            });
        });

        channel.subscribe();
        channelRef.current = channel;

        return () => {
            supabaseCrmClient.removeChannel(channel).catch(() => { });
            channelRef.current = null;
        };
    }, []);

    const onTable = useCallback(
        <T extends Row = Row>(table: RealtimeTable, listener: TableListener<T>) => {
            const set = tableListenersRef.current[table];
            set.add(listener as TableListener);
            return () => {
                set.delete(listener as TableListener);
            };
        },
        [],
    );

    const onReset = useCallback((listener: () => void) => {
        resetListenersRef.current.add(listener);
        return () => {
            resetListenersRef.current.delete(listener);
        };
    }, []);

    const emitReset = useCallback(async () => {
        const ch = channelRef.current;
        if (!ch) return;
        try {
            await ch.send({
                type: "broadcast",
                event: "reset",
                payload: { at: Date.now() },
            });
        } catch (e) {
            console.warn("[realtime] emitReset falló", e);
        }
    }, []);

    return (
        <RealtimeContext.Provider value={{ onTable, onReset, emitReset }}>
            {children}
        </RealtimeContext.Provider>
    );
}

export function useRealtime(): RealtimeApi {
    const ctx = useContext(RealtimeContext);
    if (!ctx) {
        throw new Error("useRealtime debe usarse dentro de <RealtimeProvider>");
    }
    return ctx;
}
