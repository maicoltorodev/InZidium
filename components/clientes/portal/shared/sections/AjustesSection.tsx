"use client";

import { LegalSection } from "./LegalSection";
import { AvanzadoSection } from "./AvanzadoSection";

/**
 * Ajustes avanzados — renderea Legal y Avanzado directamente inline.
 * Antes había un sub-hub con 2 cards que navegaba a cada uno como páginas
 * separadas, lo que obligaba a ir y volver. Ahora todo vive en la misma
 * vista, el cliente hace scroll y configura todo de corrido.
 */
export function AjustesSection({
  d,
  savePatch,
  uploadingFavicon,
  onUploadFavicon,
}: {
  d: any;
  savePatch: (patch: any) => void;
  uploadingFavicon: boolean;
  onUploadFavicon: (file: File) => void;
}) {
  return (
    <>
      <LegalSection d={d} />
      <AvanzadoSection
        d={d}
        savePatch={savePatch}
        uploadingFavicon={uploadingFavicon}
        onUploadFavicon={onUploadFavicon}
      />
    </>
  );
}
