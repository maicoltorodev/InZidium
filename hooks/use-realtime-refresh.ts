"use client";

import { useEffect, useRef } from "react";
import { supabaseClient } from "@/lib/supabase/client";
import { publicEstudioId } from "@/lib/env";

type RealtimeTable = "clientes" | "proyectos" | "archivos" | "chat" | "administradores";

/**
 * Escucha cambios en Supabase Realtime y llama onRefresh() automáticamente.
 * - Usa useRef para siempre llamar la versión más reciente de onRefresh
 * - Genera un nombre de canal único por montaje para evitar conflictos en Strict Mode
 * - Loguea el estado de la suscripción para facilitar debugging
 */
export function useRealtimeRefresh(
  tables: RealtimeTable[],
  onRefresh: () => void,
  enabled = true
) {
  // Ref para siempre tener la versión más reciente de onRefresh sin re-suscribir
  const onRefreshRef = useRef(onRefresh);
  useEffect(() => {
    onRefreshRef.current = onRefresh;
  });

  useEffect(() => {
    if (!enabled) return;

    // Nombre único por montaje para evitar conflictos entre renders de Strict Mode
    const channelName = `rt-${tables.join("-")}-${Math.random().toString(36).slice(2, 7)}`;
    const channel = supabaseClient.channel(channelName);

    const isDev = process.env.NODE_ENV === "development";

    tables.forEach((table) => {
      channel.on(
        "postgres_changes" as any,
        {
          event: "*",
          schema: "public",
          table,
          // Filtro por tenant: el cliente sólo recibe eventos de su estudio.
          // Evita re-renders innecesarios por actividad de otros tenants.
          filter: `estudio_id=eq.${publicEstudioId}`,
        },
        (payload: any) => {
          if (isDev) {
            console.log(`[Realtime] Cambio en "${table}":`, payload.eventType);
          }
          onRefreshRef.current();
        }
      );
    });

    channel.subscribe((status: string, error?: Error) => {
      if (!isDev) return;
      if (status === "SUBSCRIBED") {
        console.log(`[Realtime] ✅ Suscrito a: ${tables.join(", ")}`);
      } else if (status === "CHANNEL_ERROR") {
        console.error(`[Realtime] ❌ Error en canal "${channelName}":`, error);
      } else if (status === "TIMED_OUT") {
        console.warn(`[Realtime] ⚠️ Timeout en canal "${channelName}"`);
      }
    });

    return () => {
      supabaseClient.removeChannel(channel);
    };
  }, [enabled]);
}
