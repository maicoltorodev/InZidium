"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { updateProyectoOnboarding } from "@/lib/actions";

/**
 * Hook compartido entre el portal cliente y el admin para aplicar cambios al
 * `onboardingData` de un proyecto.
 *
 * ## Patrón: server state + pending mutations queue con cooldown
 *
 * El problema clásico del optimistic update es que "UI state" y "server state"
 * viven en la misma variable, y cualquier refresh que llegue del server con
 * data stale (pre-commit, pgbouncer snapshot, otra pestaña) pisa el optimistic
 * y causa flicker. Este hook los separa explícitamente:
 *
 * - `serverProject` (prop `project`) = lo que vino del server. Es la fuente
 *   autoritativa y puede ser stale.
 * - `pendings[]` = lista de patches que el user aplicó. Cada uno tiene un
 *   `confirmedAt?` que se marca cuando el `serverProject` llega ya con ese
 *   patch aplicado.
 * - `displayedProject` = `serverProject` con cada pending (confirmed o no)
 *   mergeada arriba. Es lo que los componentes consumen.
 *
 * ### Por qué el cooldown (no filtrar confirmed inmediatamente)
 *
 * El supabase-js va a través de pgbouncer (transaction pooling): un SELECT
 * justo después de un COMMIT puede ir por una conexión distinta que todavía
 * no vio el commit y devolver estado stale. Esto genera el escenario:
 *
 * 1. User clickea "Cerrado" → pending agregada → UI closed ✓
 * 2. Server commit → evento realtime → refresh #1 trae correcto → pending
 *    se confirma ✓
 * 3. Otro evento realtime (chat/archivo) dispara refresh #2 — pgbouncer lo
 *    rutea por una conexión vieja que no ve el commit → setServerProject
 *    con estado pre-commit → **UI brinca a "abierto"** ⚠️
 * 4. Refresh #3 llega con estado correcto → UI vuelve a "cerrado"
 *
 * Manteniendo la pending confirmed durante 3s, el displayedProject sigue
 * incluyendo el valor post-commit aunque el server temporalmente lo
 * "retroceda". Pasados los 3s, el server debería estar estabilizado.
 *
 * ### Safety net
 *
 * Pendings que lleven > 10s sin confirmarse se descartan. Evita que un error
 * del server o una race deje la UI pegada en un estado optimistic para
 * siempre.
 *
 * Es el mismo patrón de TanStack Query, Redux Toolkit Query, tRPC.
 */

type PendingMutation = {
  id: string;
  patch: Record<string, any>;
  at: number;
  /** Cuando el serverProject llega con el patch aplicado, se marca este
   *  timestamp. La pending sigue protegiendo displayedProject hasta que
   *  pasen `CONFIRMED_COOLDOWN_MS` desde este momento. */
  confirmedAt?: number;
};

const CONFIRMED_COOLDOWN_MS = 3_000;
const PENDING_TIMEOUT_MS = 10_000;

export function useProyectoPatcher<T extends { id: string; onboardingData?: any }>({
  project: serverProject,
  onError,
}: {
  project: T | null;
  onError?: (msg: string) => void;
}) {
  const [pendings, setPendings] = useState<PendingMutation[]>([]);

  // displayedProject = serverProject con cada pending (confirmed o no)
  // mergeada sobre onboardingData. Los componentes hijos consumen este valor.
  const displayedProject = useMemo<T | null>(() => {
    if (!serverProject) return null;
    if (pendings.length === 0) return serverProject;

    let onboardingData: Record<string, any> = {
      ...(serverProject.onboardingData || {}),
    };
    for (const p of pendings) {
      onboardingData = { ...onboardingData, ...p.patch };
      if (Object.prototype.hasOwnProperty.call(p.patch, "dominioUno")) {
        onboardingData.seoCanonicalUrl = p.patch.dominioUno
          ? `https://www.${p.patch.dominioUno}.com`
          : "";
      }
    }
    return { ...serverProject, onboardingData } as T;
  }, [serverProject, pendings]);

  // Cuando cambia el serverProject, marcamos pendings como confirmed (no las
  // borramos todavía — el cooldown las mantiene protegiendo el
  // displayedProject hasta que el server se estabilice).
  useEffect(() => {
    if (!serverProject) return;
    const serverData = serverProject.onboardingData ?? {};
    setPendings((prev) => {
      let changed = false;
      const next = prev.map((p) => {
        if (p.confirmedAt) return p;
        if (patchMatchesServer(p.patch, serverData)) {
          changed = true;
          return { ...p, confirmedAt: Date.now() };
        }
        return p;
      });
      return changed ? next : prev;
    });
  }, [serverProject]);

  // Limpieza temporal: removemos pendings ya confirmed después del cooldown
  // y pendings no confirmed que hayan timed out (10s).
  useEffect(() => {
    if (pendings.length === 0) return;
    const now = Date.now();
    const soonestExpiry = Math.min(
      ...pendings.map((p) => {
        if (p.confirmedAt) return p.confirmedAt + CONFIRMED_COOLDOWN_MS;
        return p.at + PENDING_TIMEOUT_MS;
      }),
    );
    const delay = Math.max(0, soonestExpiry - now);
    const timer = setTimeout(() => {
      const now2 = Date.now();
      setPendings((prev) =>
        prev.filter((p) => {
          if (p.confirmedAt) return now2 - p.confirmedAt < CONFIRMED_COOLDOWN_MS;
          return now2 - p.at < PENDING_TIMEOUT_MS;
        }),
      );
    }, delay);
    return () => clearTimeout(timer);
  }, [pendings]);

  const savePatch = useCallback(
    async (patch: Record<string, any>) => {
      if (!serverProject) return;
      const id = Math.random().toString(36).slice(2);
      setPendings((prev) => [...prev, { id, patch, at: Date.now() }]);
      try {
        await updateProyectoOnboarding(serverProject.id, patch);
      } catch {
        setPendings((prev) => prev.filter((p) => p.id !== id));
        onError?.("No se pudo guardar. Inténtalo de nuevo.");
      }
    },
    [serverProject, onError],
  );

  return { savePatch, displayedProject };
}

/**
 * ¿Cada key del patch tiene el mismo valor en serverData? Si sí, el server
 * ya aplicó la mutación → la pending pasa a confirmed.
 */
function patchMatchesServer(
  patch: Record<string, any>,
  serverData: Record<string, any>,
): boolean {
  for (const key of Object.keys(patch)) {
    if (!deepEqual(patch[key], serverData[key])) return false;
  }
  return true;
}

function deepEqual(a: any, b: any): boolean {
  if (Object.is(a, b)) return true;
  if (typeof a !== typeof b) return false;
  if (a === null || b === null) return false;
  if (typeof a !== "object") return false;
  if (Array.isArray(a)) {
    if (!Array.isArray(b) || a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) return false;
    }
    return true;
  }
  if (Array.isArray(b)) return false;
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  for (const k of keysA) {
    if (!deepEqual(a[k], b[k])) return false;
  }
  return true;
}
