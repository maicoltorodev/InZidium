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
 * data stale (pre-commit, pgbouncer snapshot, otra pestaña) pisa el optimistic
 * y causa flicker. Parches tipo `isPatching() + setTimeout` o "ventana de
 * protección por N segundos" atacan el síntoma, no la causa — y siempre hay
 * un timing que los rompe.
 *
 * Este hook los separa explícitamente:
 *
 * - `serverProject` (prop `project`) = lo que vino del server. Es la fuente
 *   autoritativa y puede ser stale; no importa.
 * - `pendings[]` = lista de patches que el user aplicó pero el server aún no
 *   confirmó.
 * - `displayedProject` = `serverProject` con cada pending mergeado arriba.
 *   Es lo que los componentes consumen.
 *
 * ### Flujo
 *
 * 1. Click → `savePatch(patch)` añade `{id, patch, at}` a `pendings`.
 *    `displayedProject` refleja el cambio inmediatamente.
 * 2. `await updateProyectoOnboarding(id, patch)` manda al server.
 * 3. Realtime event → `setServerProject(fresh)` (desde el consumidor).
 *    `displayedProject` sigue correcto: incluso si `fresh` está stale, las
 *    pendings siguen mergeadas arriba.
 * 4. Cuando `serverProject.onboardingData` ya tiene todos los values del
 *    patch aplicados (el server confirmó), el pending se limpia
 *    automáticamente. `displayedProject === serverProject` — sin flicker.
 * 5. Si el server falla (throw), la pending se descarta y disparamos
 *    `onError`.
 * 6. Safety net: pendings de más de 10s se descartan — si el server nunca
 *    converge, la UI no se queda pegada.
 *
 * Esto es el mismo patrón de TanStack Query, Redux Toolkit Query, tRPC.
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

  // displayedProject = serverProject con cada pending mergeado sobre
  // onboardingData. Los componentes hijos consumen este valor.
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

  // Cleanup: cuando cambia el serverProject, revisamos qué pendings ya están
  // confirmados (el server tiene el mismo valor para cada key del patch) y
  // los removemos de la queue.
  useEffect(() => {
    if (!serverProject || pendings.length === 0) return;
    const serverData = serverProject.onboardingData ?? {};
    setPendings((prev) => prev.filter((p) => !patchMatchesServer(p.patch, serverData)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverProject]);

  // Safety net: descartar pendings que lleven > 10s sin confirmarse. Evita
  // que un error del server o una race deje la UI pegada en un estado
  // optimistic para siempre.
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
      setPendings((prev) => [...prev, { id, patch, at: Date.now() }]);
      try {
        await updateProyectoOnboarding(serverProject.id, patch);
        // No removemos aquí — el cleanup (useEffect de arriba) lo hace cuando
        // el serverProject llegue con los valores confirmados. Si lo
        // removemos acá, `displayedProject` parpadea: sin pending y sin
        // server-refresh-aún, mostraría el valor previo.
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
 * ya aplicó la mutación → podemos descartar la pending.
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
