"use client";

import { useEffect, useRef } from "react";
import { supabaseClient } from "@/lib/supabase/client";
import { publicEstudioId } from "@/lib/env";

export type RealtimeTable =
  | "clientes"
  | "proyectos"
  | "archivos"
  | "chat"
  | "administradores";

export type RealtimeEvent = {
  table: RealtimeTable;
  eventType: "INSERT" | "UPDATE" | "DELETE";
  /** Row post-change. Con REPLICA IDENTITY FULL trae todas las columnas. */
  new: Record<string, any>;
  /** Row pre-change (solo llena con REPLICA IDENTITY FULL en UPDATE/DELETE). */
  old: Record<string, any>;
};

/**
 * Suscribe a eventos postgres_changes en las tablas especificadas y llama al
 * callback con el payload.
 *
 * ## Flujo end-to-end
 *
 * ```
 * [server action] → Postgres → Supabase Realtime → handler aquí → callback
 * ```
 *
 * El callback recibe el `RealtimeEvent` con `payload.new` — el row
 * post-commit directo del replication stream de Postgres. No pasa por
 * pgbouncer. El consumidor puede usarlo para actualizar estado local sin
 * necesidad de hacer un SELECT (que por transaction pooling puede traer
 * snapshot stale).
 *
 * En eventos triggereados por `visibilitychange` (volver del background) el
 * callback se invoca SIN evento — el consumidor debe hacer refetch full en
 * ese caso.
 *
 * ## Refresh on visibility
 *
 * Supabase realtime no replaya eventos perdidos durante desconexiones
 * (tab oculto, red caída). Al volver la visibilidad disparamos el callback
 * una vez sin evento para que el consumidor se ponga al día con un refetch.
 *
 * ## Strict Mode
 *
 * Canal con nombre aleatorio por montaje: Strict Mode en dev monta-desmonta-
 * monta el componente; los dos canales no colisionan porque tienen nombres
 * únicos.
 */
export function useRealtimeRefresh(
  tables: RealtimeTable[],
  onRefresh: (event?: RealtimeEvent) => void,
  enabled = true,
) {
  const onRefreshRef = useRef(onRefresh);
  useEffect(() => {
    onRefreshRef.current = onRefresh;
  });

  useEffect(() => {
    if (!enabled) return;

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
          filter: `estudio_id=eq.${publicEstudioId}`,
        },
        (payload: any) => {
          if (isDev) {
            console.log(`[Realtime] Cambio en "${table}":`, payload.eventType);
          }
          onRefreshRef.current({
            table,
            eventType: payload.eventType,
            new: payload.new ?? {},
            old: payload.old ?? {},
          });
        },
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    const onVisible = () => {
      if (document.visibilityState === "visible") {
        onRefreshRef.current();
      }
    };

    document.addEventListener("visibilitychange", onVisible);

    return () => {
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [enabled]);
}

/**
 * Aplica los campos de `payload.new` (Postgres row post-commit, snake_case)
 * sobre un objeto proyecto camelCase preservando relaciones (cliente, chat,
 * archivos). Se usa en los consumidores del fast-path realtime.
 */
export function mergeProyectoPayload<T extends Record<string, any>>(
  prev: T,
  payloadNew: Record<string, any>,
): T {
  const pick = <K>(snake: string, fallback: K): K =>
    payloadNew[snake] !== undefined ? (payloadNew[snake] as K) : fallback;
  const pickDate = (snake: string, fallback: any) =>
    payloadNew[snake] ? new Date(payloadNew[snake]) : fallback;

  return {
    ...prev,
    onboardingData: pick("onboarding_data", prev.onboardingData),
    onboardingStep: pick("onboarding_step", prev.onboardingStep),
    fase: pick("fase", prev.fase),
    fechaEntrega: pickDate("fecha_entrega", prev.fechaEntrega),
    buildStartedAt: pickDate("build_started_at", prev.buildStartedAt),
    link: pick("link", prev.link),
    linkLocked: pick("link_locked", prev.linkLocked),
    plan: pick("plan", prev.plan),
    nombre: pick("nombre", prev.nombre),
    freezeMode: pick("freeze_mode", prev.freezeMode),
  };
}
