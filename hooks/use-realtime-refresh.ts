"use client";

import { useEffect, useRef } from "react";
import { supabaseClient } from "@/lib/supabase/client";
import { publicEstudioId } from "@/lib/env";

type RealtimeTable =
  | "clientes"
  | "proyectos"
  | "archivos"
  | "chat"
  | "administradores";

/**
 * Mantiene una vista del cliente sincronizada con la DB en tiempo real.
 *
 * ## Flujo end-to-end
 *
 * ```
 * [server action]
 *       │  proyectos.update() ... chat.add() ... archivos.delete() ...
 *       ▼
 * [Postgres]  ─── trigger publicación realtime ──▶  [Supabase Realtime]
 *                                                         │
 *                                                         │  postgres_changes
 *                                                         │  filter: estudio_id
 *                                                         ▼
 *                                            [useRealtimeRefresh en el cliente]
 *                                                         │
 *                                                         ▼
 *                                                  onRefresh() → recarga data
 * ```
 *
 * Cada consumidor le pasa:
 *  - `tables` → qué tablas observar ("proyectos" | "chat" | "archivos" etc).
 *  - `onRefresh` → callback idempotente que recarga su data (ej. `loadProject()`).
 *  - `enabled` → habilita/deshabilita la suscripción (ej. apagar mientras no hay sesión).
 *
 * ## Por qué el ref del callback
 *
 * `onRefreshRef` permite cambiar el callback entre renders (closure capturando
 * state fresco) sin re-suscribir el canal. Si no usáramos ref, cada render con
 * un callback nuevo rompería y recrearía el canal → eventos duplicados / perdidos.
 *
 * ## Refresh on visibility
 *
 * Supabase realtime **no replaya eventos** que ocurrieron mientras el tab
 * estuvo offline (laptop dormido, pérdida de red, tab oculto >30s). Cuando el
 * tab vuelve a ser visible, disparamos `onRefresh()` una vez para "ponernos al
 * día" con el estado del server. Esto convierte el hook en algo robusto a
 * desconexiones cortas sin necesidad de event-replay infrastructure.
 *
 * ## Strict Mode
 *
 * Nombre de canal aleatorio por montaje: si Strict Mode monta-desmonta-monta
 * el componente (en dev), los dos canales no colisionan.
 *
 * ## Limitaciones conocidas
 *
 * - Sin heartbeat custom: dependemos del reconnect automático del cliente JS.
 * - Sin debounce en cascada: N cambios rápidos generan N callbacks. Los
 *   callbacks son idempotentes y los fetches son baratos al scale actual.
 * - Filtro sólo por `estudio_id`: recibís eventos de proyectos ajenos dentro
 *   del mismo estudio. Si alguna vez hay 100+ proyectos por estudio esto
 *   puede valer la pena filtrar, pero hoy no.
 */
export function useRealtimeRefresh(
  tables: RealtimeTable[],
  onRefresh: () => void,
  enabled = true,
) {
  // Ref para siempre tener la versión más reciente de onRefresh sin re-suscribir.
  const onRefreshRef = useRef(onRefresh);
  useEffect(() => {
    onRefreshRef.current = onRefresh;
  });

  // Canal Postgres → callbacks
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
          onRefreshRef.current();
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

  // Refresh on visibility: cuando el tab vuelve del background, ponemos al día
  // el estado por si hubo eventos durante el gap (realtime no los replaya).
  //
  // IMPORTANTE: usamos SOLO `visibilitychange`, no `window.focus`. `focus` se
  // dispara en casos espurios (volver del devtools, cambios de foco internos
  // en algunos browsers) y eso mete refetches en mitad del tipeo del usuario.
  // `visibilitychange` solo dispara cuando el tab cambia de hidden→visible,
  // que es exactamente el caso que queremos cubrir.
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
