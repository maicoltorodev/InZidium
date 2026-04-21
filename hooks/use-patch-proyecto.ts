"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { updateProyectoOnboarding } from "@/lib/actions";

/**
 * Hook compartido entre el portal cliente y el admin para aplicar cambios al
 * `onboardingData` de un proyecto.
 *
 * ## Patrón: server state + pending mutations queue
 *
 * "UI state" y "server state" están separados:
 *
 * - `serverProject` (prop `project`) = lo que vino del server. Puede ser stale.
 * - `pendings[]` = patches que el user aplicó pero el server aún no confirmó.
 * - `displayedProject` = `serverProject` con cada pending mergeada arriba.
 *   Es lo que los componentes consumen.
 *
 * ### Por qué funciona sin parches ni serialización en cliente
 *
 * El server action `updateProyectoOnboarding` usa
 * `atomicPatchOnboarding` — un `read → merge → write` dentro de una
 * transacción con `SELECT FOR UPDATE`. Postgres serializa escrituras
 * concurrentes sobre el mismo proyecto automáticamente. Dos clientes (o un
 * cliente con clicks rápidos) nunca pueden pisarse: cada patch se aplica
 * sobre el estado más reciente.
 *
 * Con esa garantía del server, acá solo manejamos optimistic UI.
 *
 * ### Flujo
 *
 * 1. Click → `savePatch(patch)` añade a `pendings`. `displayedProject`
 *    refleja el cambio inmediatamente.
 * 2. `await updateProyectoOnboarding(id, patch)` manda al server.
 * 3. Evento realtime → el consumidor llama `setServerProject(fresh)`.
 *    `displayedProject` sigue correcto: las pendings se aplican arriba
 *    aunque `fresh` llegue stale.
 * 4. Cuando `serverProject.onboardingData` ya contiene el patch, la pending
 *    se limpia automáticamente. `displayedProject === serverProject`.
 * 5. Si el server falla, la pending se descarta y se dispara `onError`.
 * 6. Safety: pendings > 10s sin confirmarse se descartan.
 */

type PendingMutation = {
  id: string;
  patch: Record<string, any>;
  at: number;
};

const PENDING_TIMEOUT_MS = 10_000;

const GHOST_CLICK_WINDOW_MS = 150;

export function useProyectoPatcher<T extends { id: string; onboardingData?: any }>({
  project: serverProject,
  onError,
}: {
  project: T | null;
  onError?: (msg: string) => void;
}) {
  const [pendings, setPendings] = useState<PendingMutation[]>([]);
  // Guarda el último patch despachado + timestamp. Usado para dedupear
  // "ghost clicks" en touch devices (el browser sintetiza un `click` después
  // del `touchend`, y algunos layouts disparan el handler dos veces en <150ms).
  // Si llega el mismo patch dentro de esa ventana, se ignora.
  const recentPatchRef = useRef<{ hash: string; at: number } | null>(null);

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
    setPendings((prev) =>
      prev.filter((p) => !patchMatchesServer(p.patch, serverData)),
    );
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

      // Dedup ghost click: mismo patch exacto dentro de la ventana de
      // sintetización del browser (~150ms). El primer dispatch sigue su curso
      // normal, el duplicado se ignora silenciosamente.
      const hash = JSON.stringify(patch);
      const now = Date.now();
      const recent = recentPatchRef.current;
      if (recent && recent.hash === hash && now - recent.at < GHOST_CLICK_WINDOW_MS) {
        return;
      }
      recentPatchRef.current = { hash, at: now };

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
