"use client";

import { MessageSquare } from "lucide-react";
import { LegalSection } from "./LegalSection";
import { AvanzadoSection } from "./AvanzadoSection";
import { FieldItem } from "../primitives/FieldItem";

/**
 * Ajustes avanzados — renderea Legal y Avanzado directamente inline.
 * Antes había un sub-hub con 2 cards que navegaba a cada uno como páginas
 * separadas, lo que obligaba a ir y volver. Ahora todo vive en la misma
 * vista, el cliente hace scroll y configura todo de corrido.
 *
 * El hint de "Necesitas personalizar páginas legales?" vive al final de todo
 * para que aparezca después de que el cliente vio el rubro, eligió tipo de
 * negocio, y terminó de configurar avanzados. Funciona como footer del tab.
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

      {/* Hint chat — al final de todos los ajustes avanzados. */}
      <FieldItem>
        <div className="flex items-start gap-3 rounded-2xl border border-white/[0.05] bg-white/[0.015] px-4 py-3.5">
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/[0.04]">
            <MessageSquare className="h-4 w-4 text-white/60" />
          </span>
          <p className="flex-1 min-w-0 text-[12px] leading-relaxed text-white/55">
            ¿Necesitas personalizar tus páginas legales? Avísanos por el{" "}
            <span className="font-semibold text-white/85">chat</span> y te ayudamos.
          </p>
        </div>
      </FieldItem>
    </>
  );
}
