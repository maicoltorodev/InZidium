"use client";

import { Check, MessageSquare, ShieldCheck } from "lucide-react";
import { FieldItem } from "../primitives/FieldItem";
import { BRAND_ICON_STYLE } from "../primitives/BrandDefs";
import { TIPO_NEGOCIO_MAP, type TipoNegocio } from "../primitives/TipoNegocioModal";

function formatDisplayDate(iso: string | undefined): string {
  if (!iso) return "";
  const d = new Date(iso + "T12:00:00");
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function LegalSection({ d }: { d: any }) {
  const tipoNegocio = (d?.tipoNegocio ?? d?.legalTemplate) as TipoNegocio | undefined;
  const cfg = tipoNegocio ? TIPO_NEGOCIO_MAP[tipoNegocio] : null;

  return (
    <>
      {/* Rubro actual (deriva del tipo de negocio) */}
      <FieldItem>
        <div className="rounded-[2rem] border border-[#a855f7]/20 bg-[linear-gradient(135deg,rgba(232,121,249,0.04)_0%,rgba(168,85,247,0.04)_50%,rgba(34,211,238,0.04)_100%)] p-5">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(232,121,249,0.12)_0%,rgba(168,85,247,0.12)_50%,rgba(34,211,238,0.12)_100%)] ring-1 ring-[#a855f7]/25">
              <ShieldCheck className="h-5 w-5" style={BRAND_ICON_STYLE} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[9px] font-black uppercase tracking-[0.28em]">
                <span className="bg-[linear-gradient(90deg,#e879f9_0%,#a855f7_50%,#22d3ee_100%)] bg-clip-text text-transparent">
                  Tu rubro
                </span>
              </p>
              <h3 className="mt-0.5 text-[15px] font-black leading-tight text-white">
                {cfg ? cfg.label : "Pendiente de definir"}
              </h3>
            </div>
          </div>
          <p className="text-[12px] leading-relaxed text-white/50">
            Generamos las páginas legales (Términos y Privacidad) adaptadas automáticamente a este rubro.
          </p>

          {/* Fecha registrada */}
          {d?.legalLastUpdated && (
            <div className="mt-4 flex items-start gap-3 rounded-2xl border border-emerald-500/15 bg-emerald-500/[0.04] px-4 py-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
                <Check className="h-3 w-3" strokeWidth={3} />
              </span>
              <div className="flex-1 min-w-0 text-[12px] leading-relaxed text-white/65">
                Última actualización registrada:{" "}
                <span className="font-semibold text-white/85">{formatDisplayDate(d.legalLastUpdated)}</span>
              </div>
            </div>
          )}
        </div>
      </FieldItem>

      {/* Hint chat */}
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
