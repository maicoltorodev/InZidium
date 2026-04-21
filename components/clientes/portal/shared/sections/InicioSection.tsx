"use client";

import { Sparkles } from "lucide-react";
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
          placeholder="Productos y servicios de calidad"
        />
        <p className="mt-1.5 text-[11px] text-white/25">
          Una frase corta que resuma tu negocio. Si lo dejás vacío, en tu sitio
          aparecerá este texto.
        </p>
      </FieldItem>

      <FieldItem>
        <label className={labelCls}>Logo</label>
        <p className="mb-3 text-[11px] text-white/25">
          Sube tu logo como lo tengas — nosotros lo adaptamos al sitio. Solo
          asegúrate que tenga buena calidad.
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

        {/* CTA para que el cliente cotice un diseño de logo con nosotros si
            aún no tiene uno — empuja upsell natural hacia el servicio de
            diseño gráfico del estudio sin ser invasivo. */}
        <div className="mt-4 flex items-start gap-3 rounded-2xl border border-[#a855f7]/25 bg-[linear-gradient(135deg,rgba(232,121,249,0.06)_0%,rgba(168,85,247,0.05)_50%,rgba(34,211,238,0.06)_100%)] p-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[linear-gradient(135deg,rgba(232,121,249,0.15)_0%,rgba(168,85,247,0.15)_50%,rgba(34,211,238,0.15)_100%)] ring-1 ring-[#a855f7]/30">
            <Sparkles className="h-4 w-4" style={{ stroke: "url(#brand-icon-gradient)" }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-bold leading-tight text-white">
              ¿Aún no tienes logo?
            </p>
            <p className="mt-1 text-[11px] leading-relaxed text-white/55">
              Diseñamos uno profesional y único para tu marca.{" "}
              <span className="font-semibold text-white/75">
                Escríbenos por el chat
              </span>{" "}
              y te cotizamos sin compromiso — máxima calidad, mismo estudio.
            </p>
          </div>
        </div>
      </FieldItem>
    </>
  );
}
