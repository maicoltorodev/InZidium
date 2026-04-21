"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { updateProyectoOnboarding } from "@/lib/actions";

/**
 * Hook compartido entre el portal cliente y el admin para aplicar cambios al
 * `onboardingData` de un proyecto.
 *
 * ## Patrón: server state + pending mutations queue
 *
 * El problema clásico del optimistic update es que "UI state" y "server state"
 * viven en la misma variable, y cualquier refresh que llegue del server con
 * data stale pisa el optimistic. Este hook los separa:
 *
 * - `serverProject` (prop `project`) = lo que vino del server. Puede ser stale.
 * - `pendings[]` = patches que el user aplicó pero el server aún no confirmó.
 * - `displayedProject` = `serverProject` con cada pending mergeada arriba. Es
 *   lo que los componentes consumen.
 *
 * ### Flujo
 *
 * 1. Click → `savePatch(patch)` añade a `pendings`. `displayedProject` refleja
 *    el cambio inmediatamente.
 * 2. `await updateProyectoOnboarding(id, patch)` manda al server.
 * 3. Realtime event → `setServerProject(fresh)` (desde el consumidor).
 *    `displayedProject` sigue correcto: las pendings se aplican arriba aunque
 *    `fresh` esté stale.
 * 4. Cuando `serverProject.onboardingData` contiene el patch aplicado, la
 *    pending se limpia. `displayedProject === serverProject`.
 * 5. Si el server falla, la pending se descarta y disparamos `onError`.
 * 6. Safety: pendings > 10s sin confirmarse se descartan.
 */

type PendingMutation = {
  id: string;
  patch: Record<string, any>;
  at: number;
};

const PENDING_TIMEOUT_MS = 10_000;

export function useProyectoPatcher<T extends { id: string; onboardingData?: any }>({
  project: serverProject,
  onError,
}: {
  project: T | null;
  onError?: (msg: string) => void;
}) {
  const [pendings, setPendings] = useState<PendingMutation[]>([]);

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

  // Cuando cambia serverProject, removemos pendings ya aplicadas.
  useEffect(() => {
    if (!serverProject) return;
    const serverData = serverProject.onboardingData ?? {};
    // [HORARIOS] DEBUG — borrar cuando se confirme el bug
    if (serverData.hours) {
      console.log(
        `[HORARIOS] serverProject changed, serverData.hours:`,
        JSON.stringify(serverData.hours),
      );
    }
    setPendings((prev) => {
      const next = prev.filter((p) => !patchMatchesServer(p.patch, serverData));
      // [HORARIOS] DEBUG
      if (prev.length !== next.length) {
        const removed = prev.filter((p) => !next.includes(p));
        const removedHasHours = removed.some((p) => p.patch.hours);
        if (removedHasHours) {
          console.log(
            `[HORARIOS] pending(s) with hours confirmed & removed:`,
            removed.map((p) => ({ patch_hours: p.patch.hours, patch_hoursMode: p.patch.hoursMode })),
          );
        }
      }
      return next;
    });
  }, [serverProject]);

  // Safety net: descartar pendings que lleven > 10s sin confirmarse.
  useEffect(() => {
    if (pendings.length === 0) return;
    const earliestAt = Math.min(...pendings.map((p) => p.at));
    const timer = setTimeout(
      () => {
        const now = Date.now();
        setPendings((prev) =>
          prev.filter((p) => now - p.at < PENDING_TIMEOUT_MS),
        );
      },
      Math.max(0, PENDING_TIMEOUT_MS - (Date.now() - earliestAt)),
    );
    return () => clearTimeout(timer);
  }, [pendings]);

  const savePatch = useCallback(
    async (patch: Record<string, any>) => {
      if (!serverProject) return;
      const id = Math.random().toString(36).slice(2);
      // [HORARIOS] DEBUG — borrar cuando se confirme el bug
      if (patch.hours || patch.hoursMode !== undefined) {
        console.log(
          `[HORARIOS] savePatch: hours=${JSON.stringify(patch.hours)} hoursMode=${patch.hoursMode}`,
        );
      }
      setPendings((prev) => [...prev, { id, patch, at: Date.now() }]);
      try {
        await updateProyectoOnboarding(serverProject.id, patch);
        // [HORARIOS] DEBUG
        if (patch.hours || patch.hoursMode !== undefined) {
          console.log(`[HORARIOS] server action resolved for id=${id}`);
        }
      } catch {
        setPendings((prev) => prev.filter((p) => p.id !== id));
        onError?.("No se pudo guardar. Inténtalo de nuevo.");
      }
    },
    [serverProject, onError],
  );

  return { savePatch, displayedProject };
}

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
