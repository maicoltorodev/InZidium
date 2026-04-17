'use client';

import { STUDIO } from '@/lib/config';

/**
 * Hook trivial que devuelve los datos del estudio actual.
 * Existe solo para que los componentes cliente accedan a la config
 * sin importar el objeto raíz directamente.
 */
export function useBranding() {
  return {
    estudio: STUDIO.studio,
    assets: STUDIO.assets,
    partner: STUDIO.partner,
    tech: STUDIO.tech,
  };
}

export default useBranding;
