"use client";

import { useEffect, useRef } from "react";
import { allianceSupabaseClient } from "@/lib/alliance/supabase/client";

type EvictionOptions = {
    userId: string | null;
    /** Solo se soporta `clientes` — los admins viven en la DB del estudio
     *  y no se evictan desde el módulo Alliance. Si un estudio quiere
     *  single-session realtime para sus admins, lo implementa con un hook
     *  custom contra `supabaseClient` raíz. */
    table: "clientes";
    validate: () => Promise<{ valid: boolean }>;
    onEvicted: () => void;
};

/**
 * Escucha cambios en `active_session_id` de la fila del cliente actual.
 * Si otro dispositivo inicia sesión con la misma cuenta, el token en DB
 * cambia, este hook lo detecta vía Supabase Realtime y dispara `onEvicted()`.
 */
export function useSessionEviction({
    userId,
    table,
    validate,
    onEvicted,
}: EvictionOptions) {
    const onEvictedRef = useRef(onEvicted);
    useEffect(() => {
        onEvictedRef.current = onEvicted;
    });

    useEffect(() => {
        if (!userId) return;

        const channelName = `eviction-${table}-${userId}-${Math.random().toString(36).slice(2, 7)}`;
        const channel = allianceSupabaseClient.channel(channelName);

        channel.on(
            "postgres_changes" as any,
            {
                event: "UPDATE",
                schema: "public",
                table,
                filter: `id=eq.${userId}`,
            },
            async (payload: any) => {
                if (
                    payload.new?.active_session_id !==
                    payload.old?.active_session_id
                ) {
                    const { valid } = await validate();
                    if (!valid) {
                        onEvictedRef.current();
                    }
                }
            },
        );

        channel.subscribe();

        return () => {
            allianceSupabaseClient.removeChannel(channel);
        };
    }, [userId, table]);
}
