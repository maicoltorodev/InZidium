"use client";

import { useEffect, useRef } from "react";
import { supabaseClient } from "@/lib/supabase/client";

type EvictionOptions = {
    userId: string | null;
    table: "clientes" | "administradores";
    validate: () => Promise<{ valid: boolean }>;
    onEvicted: () => void;
};

/**
 * Escucha cambios en `active_session_id` de la fila del usuario actual.
 * Si otro dispositivo inicia sesión con la misma cuenta, el token en DB
 * cambia, este hook lo detecta vía Supabase Realtime y dispara `onEvicted()`.
 *
 * Aplica a ambos roles: administradores y clientes — pasar `table` y
 * `validate` correspondientes.
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
        const channel = supabaseClient.channel(channelName);

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
            supabaseClient.removeChannel(channel);
        };
    }, [userId, table]);
}
