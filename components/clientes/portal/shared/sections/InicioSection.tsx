"use client";

import { AutoField, ImageField } from "../../fields";
import { labelCls } from "../../styles";
import { FieldItem } from "../primitives/FieldItem";

export function InicioSection({
  d,
  savePatch,
  uploadingLogo,
  onUploadLogo,
}: {
  d: any;
  savePatch: (patch: any) => void;
  uploadingLogo: boolean;
  onUploadLogo: (file: File) => void;
}) {
  return (
    <>
      <FieldItem>
        <label className={labelCls}>Nombre del negocio</label>
        <AutoField
          value={d.nombreComercial}
          onSave={(v) => savePatch({ nombreComercial: v })}
          placeholder="Ej. Alkubo Soluciones"
        />
        <p className="mt-1.5 text-[11px] text-white/25">
          Aparece en el encabezado y en todas las páginas.
        </p>
      </FieldItem>

      <FieldItem>
        <label className={labelCls}>Slogan</label>
        <AutoField
          value={d.slogan}
          onSave={(v) => savePatch({ slogan: v })}
          placeholder="Ej. Creamos experiencias visuales"
        />
        <p className="mt-1.5 text-[11px] text-white/25">
          Una frase corta que resuma tu negocio.
        </p>
      </FieldItem>

      <FieldItem>
        <label className={labelCls}>Logo</label>
        <p className="mb-3 text-[11px] text-white/25">
          PNG o SVG con fondo transparente, recomendado.
        </p>
        <div className="flex justify-center">
          <div className="aspect-square w-52">
            <ImageField
              value={d.logo}
              uploading={uploadingLogo}
              square
              large
              onUpload={onUploadLogo}
            />
          </div>
        </div>
      </FieldItem>
    </>
  );
}
