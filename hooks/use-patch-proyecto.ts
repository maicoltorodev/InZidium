"use client";

import { useCallback } from "react";
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
  return useCallback(
    async (patch: Record<string, any>) => {
      if (!project) return;

      // 1. Optimistic: mezclo localmente para feedback inmediato. El server
      // igual hará el merge autoritativo, así que cualquier desync se corrige
      // en el próximo realtime tick.
      const optimistic = { ...(project.onboardingData || {}), ...patch };
      if (Object.prototype.hasOwnProperty.call(patch, "dominioUno")) {
        optimistic.seoCanonicalUrl = patch.dominioUno
          ? `https://www.${patch.dominioUno}.com`
          : "";
      }
      setProject((prev) =>
        prev ? ({ ...prev, onboardingData: optimistic } as T) : prev,
      );

      try {
        await updateProyectoOnboarding(project.id, patch);
      } catch {
        onError?.("No se pudo guardar. Inténtalo de nuevo.");
      }
    },
    [project, setProject, onError],
  );
}
