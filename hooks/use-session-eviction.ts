"use client";

import { useEffect, useRef } from "react";
import { supabaseClient } from "@/lib/supabase/client";
import { validateClienteSession } from "@/lib/actions";

/**
 * Escucha cambios en active_session_id del cliente actual.
 * Si otro dispositivo inicia sesión, el token cambia en DB y onEvicted() se dispara.
 */
export function useSessionEviction(
  clienteId: string | null,
  onEvicted: () => void
) {
  const onEvictedRef = useRef(onEvicted);
  useEffect(() => {
    onEvictedRef.current = onEvicted;
  });

  useEffect(() => {
    if (!clienteId) return;

    const channelName = `eviction-${clienteId}-${Math.random().toString(36).slice(2, 7)}`;
    const channel = supabaseClient.channel(channelName);

    channel.on(
      "postgres_changes" as any,
      {
        event: "UPDATE",
        schema: "public",
        table: "clientes",
        filter: `id=eq.${clienteId}`,
      },
      async (payload: any) => {
        if (payload.new?.active_session_id !== payload.old?.active_session_id) {
          const { valid } = await validateClienteSession();
          if (!valid) {
            onEvictedRef.current();
          }
        }
      }
    );

    channel.subscribe();

    return () => {
      supabaseClient.removeChannel(channel);
    };
  }, [clienteId]);
}
