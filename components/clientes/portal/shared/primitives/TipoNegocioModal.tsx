"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, Store, UtensilsCrossed, Check } from "lucide-react";
import { MOTION } from "./motion";
import { BRAND_ICON_STYLE } from "./BrandDefs";

export type TipoNegocio = "servicios" | "comercio" | "gastronomia";

/** Derivaciones a partir del tipo de negocio. */
export const TIPO_NEGOCIO_MAP: Record<TipoNegocio, {
  label: string;
  description: string;
  icon: React.ElementType;
  tipoCatalogo: "servicios" | "productos" | "menu";
  legalTemplate: TipoNegocio;
  catalogoNoun: { singular: string; plural: string };
}> = {
  servicios: {
    label: "Servicios profesionales",
    description: "Consultoría, agencias, desarrollos, salud, educación.",
    icon: Briefcase,
    tipoCatalogo: "servicios",
    legalTemplate: "servicios",
    catalogoNoun: { singular: "servicio", plural: "servicios" },
  },
  comercio: {
    label: "Comercio o tienda",
    description: "Venta de productos físicos o digitales.",
    icon: Store,
    tipoCatalogo: "productos",
    legalTemplate: "comercio",
    catalogoNoun: { singular: "producto", plural: "productos" },
  },
  gastronomia: {
    label: "Gastronomía o restaurante",
    description: "Restaurantes, cafés, bares, panaderías.",
    icon: UtensilsCrossed,
    tipoCatalogo: "menu",
    legalTemplate: "gastronomia",
    catalogoNoun: { singular: "platillo", plural: "platillos" },
  },
};

function todayISO(): string {
  const d = new Date();
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/**
 * Modal bloqueante que se muestra la primera vez que el cliente entra al hub,
 * si todavía no definió `tipoNegocio`. Sin backdrop-dismiss ni botón X —
 * sólo se cierra al elegir una opción.
 */
export function TipoNegocioModal({
  open,
  clientName,
  onSelect,
}: {
  open: boolean;
  clientName: string;
  onSelect: (tipo: TipoNegocio) => void;
}) {
  const firstName = clientName.split(" ")[0] || "";
  const [selected, setSelected] = useState<TipoNegocio | null>(null);

  // Reset al abrir — evita que una selección previa se quede pegada si el modal
  // se remonta por cualquier razón.
  useEffect(() => {
    if (open) setSelected(null);
  }, [open]);

  const handleConfirm = () => {
    if (!selected) return;
    onSelect(selected);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={MOTION.micro}
            className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md"
            aria-hidden
          />
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.92, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 6 }}
            transition={MOTION.page}
            role="dialog"
            aria-modal
            aria-label="Elige tu tipo de negocio"
            className="fixed left-1/2 top-1/2 z-[70] w-[min(92vw,480px)] max-h-[90dvh] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[2rem] border border-[#a855f7]/25 bg-[#0d0820] p-6 shadow-[0_0_80px_-20px_rgba(168,85,247,0.7)]"
          >
            <div className="mb-6 text-center">
              <p className="bg-[linear-gradient(90deg,#e879f9_0%,#a855f7_50%,#22d3ee_100%)] bg-clip-text text-[10px] font-black uppercase tracking-[0.32em] text-transparent">
                {firstName ? `Hola, ${firstName}` : "Bienvenido"}
              </p>
              <h2 className="mt-3 text-[22px] font-black leading-tight text-white">
                ¿Qué tipo de negocio tienes?
              </h2>
              <p className="mt-2 text-[12px] leading-relaxed text-white/50">
                Con esto configuramos tu catálogo y páginas legales automáticamente.
              </p>
            </div>

            <div className="space-y-2.5">
              {(Object.keys(TIPO_NEGOCIO_MAP) as TipoNegocio[]).map((key) => {
                const cfg = TIPO_NEGOCIO_MAP[key];
                const Icon = cfg.icon;
                const isActive = selected === key;
                return (
                  <motion.button
                    key={key}
                    type="button"
                    onClick={() => setSelected(key)}
                    whileTap={{ scale: 0.98 }}
                    transition={MOTION.tap}
                    aria-pressed={isActive}
                    className={`group relative flex w-full items-center gap-4 overflow-hidden rounded-2xl border px-5 py-4 text-left transition-all ${
                      isActive
                        ? "border-[#a855f7]/50 bg-[linear-gradient(135deg,rgba(232,121,249,0.08)_0%,rgba(168,85,247,0.08)_50%,rgba(34,211,238,0.08)_100%)] shadow-[0_0_32px_-10px_rgba(168,85,247,0.55)]"
                        : "border-white/[0.07] bg-white/[0.02] hover:border-white/20"
                    }`}
                  >
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ring-1 transition-all ${
                        isActive
                          ? "bg-[linear-gradient(135deg,rgba(232,121,249,0.18)_0%,rgba(168,85,247,0.18)_50%,rgba(34,211,238,0.18)_100%)] ring-[#a855f7]/40 scale-105"
                          : "bg-[linear-gradient(135deg,rgba(232,121,249,0.08)_0%,rgba(168,85,247,0.08)_50%,rgba(34,211,238,0.08)_100%)] ring-[#a855f7]/15"
                      }`}
                    >
                      <Icon className="h-5 w-5" style={BRAND_ICON_STYLE} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3
                        className={`text-[14px] font-black leading-tight ${
                          isActive
                            ? "bg-[linear-gradient(90deg,#e879f9_0%,#a855f7_50%,#22d3ee_100%)] bg-clip-text text-transparent"
                            : "text-white"
                        }`}
                      >
                        {cfg.label}
                      </h3>
                      <p className="mt-0.5 text-[11px] leading-snug text-white/45">
                        {cfg.description}
                      </p>
                    </div>
                    <AnimatePresence>
                      {isActive && (
                        <motion.span
                          initial={{ scale: 0, rotate: -45 }}
                          animate={{ scale: 1, rotate: 0 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={MOTION.reveal}
                          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#e879f9_0%,#a855f7_50%,#22d3ee_100%)] text-white shadow-[0_0_16px_-4px_rgba(168,85,247,0.8)]"
                        >
                          <Check className="h-3.5 w-3.5" strokeWidth={3} />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                );
              })}
            </div>

            {/* Botón confirmar */}
            <button
              type="button"
              onClick={handleConfirm}
              disabled={!selected}
              className={`mt-5 flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-[11px] font-black uppercase tracking-[0.24em] transition-all ${
                selected
                  ? "bg-[linear-gradient(135deg,#e879f9_0%,#a855f7_50%,#22d3ee_100%)] text-white shadow-[0_4px_20px_-4px_rgba(168,85,247,0.7)] active:scale-[0.98]"
                  : "cursor-not-allowed bg-white/[0.04] text-white/30"
              }`}
            >
              {selected ? "Confirmar" : "Elige una opción"}
            </button>

            <p className="mt-4 text-center text-[10px] leading-relaxed text-white/30">
              Podrás cambiarlo después escribiéndonos por el chat.
            </p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/**
 * Construye el patch que se aplica al seleccionar un tipo de negocio.
 * Actualiza `tipoNegocio` y deriva `tipoCatalogo` + `legalTemplate` + `legalLastUpdated`.
 */
export function buildTipoNegocioPatch(tipo: TipoNegocio, existingLegalDate?: string) {
  const cfg = TIPO_NEGOCIO_MAP[tipo];
  return {
    tipoNegocio: tipo,
    tipoCatalogo: cfg.tipoCatalogo,
    legalTemplate: cfg.legalTemplate,
    legalLastUpdated: existingLegalDate || todayISO(),
  };
}

/**
 * Backfill: si el proyecto tiene `tipoCatalogo` o `legalTemplate` pero no
 * `tipoNegocio`, inferirlo. Devuelve null si no se puede inferir.
 */
export function inferTipoNegocio(d: any): TipoNegocio | null {
  if (d?.tipoNegocio) return d.tipoNegocio as TipoNegocio;
  if (d?.legalTemplate && ["servicios", "comercio", "gastronomia"].includes(d.legalTemplate)) {
    return d.legalTemplate as TipoNegocio;
  }
  if (d?.tipoCatalogo) {
    if (d.tipoCatalogo === "productos") return "comercio";
    if (d.tipoCatalogo === "menu") return "gastronomia";
    if (d.tipoCatalogo === "servicios") return "servicios";
  }
  return null;
}
