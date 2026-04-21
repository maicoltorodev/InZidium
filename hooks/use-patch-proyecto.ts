"use client";

import { useCallback, useRef } from "react";
import { updateProyectoOnboarding } from "@/lib/actions";

/**
 * Hook compartido entre el portal cliente y el admin para aplicar cambios al
 * `onboardingData` de un proyecto.
 *
 * Flujo:
 *  1. Optimistic update local (UI responde al toque).
 *  2. Server action recibe sólo el patch — el merge definitivo ocurre del
 *     lado del server, leyendo el estado DB y mezclándolo atómicamente.
 *  3. Cuando el DB se actualiza, Supabase realtime dispara un refresh en el
 *     otro lado (admin ↔ cliente) y la pantalla se sincroniza automáticamente.
 *
 * **Por qué el server merge:** si cliente y admin editan campos distintos en
 * simultáneo, cada uno manda sólo su delta. El server reconcilia contra el
 * estado actual, así ninguno pisa cambios del otro.
 *
 * **Por qué `isPatching`:** los eventos realtime de otras tablas (chat,
 * archivos, otro proyecto del mismo estudio) pueden disparar `refreshData()`
 * mientras un `updateProyectoOnboarding` está en vuelo. El SELECT trae
 * estado stale (antes del commit) y pisa el optimistic — causando "clickeo
 * cerrado, se ve cerrado, vuelve a abierto, vuelve a cerrado". El consumidor
 * debe postergar el refresh si `isPatching()` devuelve true.
 */
export function useProyectoPatcher<T extends { id: string; onboardingData?: any }>({
  project,
  setProject,
  onError,
}: {
  project: T | null;
  setProject: (updater: (prev: T | null) => T | null) => void;
  onError?: (msg: string) => void;
}) {
  const inFlightRef = useRef(0);

  const savePatch = useCallback(
    async (patch: Record<string, any>) => {
      if (!project) return;

      // 1. Optimistic: mezclamos contra `prev` (estado fresco) y no contra
      // `project` (closure del render). Dos savePatch seguidos en el mismo
      // tick veían el mismo closure y el segundo pisaba al primero — por eso
      // clickear varias redes sociales seguidas generaba el efecto "se
      // desactivan/reactivan raro". El merge server-side autoritativo sigue
      // reconciliando en el siguiente realtime tick.
      setProject((prev) => {
        if (!prev) return prev;
        const merged = { ...(prev.onboardingData || {}), ...patch };
        if (Object.prototype.hasOwnProperty.call(patch, "dominioUno")) {
          merged.seoCanonicalUrl = patch.dominioUno
            ? `https://www.${patch.dominioUno}.com`
            : "";
        }
        return { ...prev, onboardingData: merged } as T;
      });

      inFlightRef.current += 1;
      try {
        await updateProyectoOnboarding(project.id, patch);
      } catch {
        onError?.("No se pudo guardar. Inténtalo de nuevo.");
      } finally {
        // Buffer de 250ms antes de liberar el flag: el evento realtime del
        // propio commit tarda ~50-150ms en llegar, y queremos que para ese
        // momento cualquier refresh que se haya retrasado pueda correr y ver
        // ya el estado nuevo.
        setTimeout(() => {
          inFlightRef.current = Math.max(0, inFlightRef.current - 1);
        }, 250);
      }
    },
    [project, setProject, onError],
  );

  const isPatching = useCallback(() => inFlightRef.current > 0, []);

  return { savePatch, isPatching };
}
