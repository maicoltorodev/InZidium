"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Hammer } from "lucide-react";
import { MOTION } from "./motion";
import { BRAND_ICON_STYLE } from "./BrandDefs";

export function BuildModal({
  open,
  onClose,
  domain,
}: {
  open: boolean;
  onClose: () => void;
  domain?: string;
}) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

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
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/75 backdrop-blur-md"
            aria-hidden
          />
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.92, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={MOTION.page}
            role="dialog"
            aria-modal
            aria-label="Estamos trabajando en tu página"
            className="fixed left-1/2 top-1/2 z-50 w-[min(88vw,360px)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[2rem] border border-[#a855f7]/25 bg-[#0d0820] p-6 text-center shadow-[0_0_60px_-20px_rgba(168,85,247,0.7)]"
          >
            {/* Icono con halo */}
            <div className="relative mx-auto mb-4 h-16 w-16">
              <div className="absolute inset-0 rounded-full bg-[linear-gradient(135deg,#e879f9_0%,#a855f7_50%,#22d3ee_100%)] opacity-25 blur-xl" />
              <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-[#a855f7]/30 bg-[linear-gradient(135deg,rgba(232,121,249,0.12)_0%,rgba(168,85,247,0.12)_50%,rgba(34,211,238,0.12)_100%)]">
                <Hammer className="h-7 w-7" style={BRAND_ICON_STYLE} />
              </div>
            </div>

            <h2 className="text-[18px] font-black leading-tight text-white">
              Estamos trabajando en tu página
            </h2>
            <p className="mt-2 text-[12px] leading-relaxed text-white/55">
              Tan pronto esté lista, podrás visitarla desde este link.
            </p>

            {domain && (
              <div className="mt-4 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2">
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/35">
                  Tu dominio
                </p>
                <p className="mt-0.5 text-[13px] font-bold text-white/75 truncate">
                  www.{domain}.com
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={onClose}
              className="mt-5 w-full rounded-2xl bg-[linear-gradient(135deg,#e879f9_0%,#a855f7_50%,#22d3ee_100%)] py-3 text-[11px] font-black uppercase tracking-[0.24em] text-white shadow-[0_4px_16px_-4px_rgba(168,85,247,0.6)] transition-transform active:scale-[0.98]"
            >
              Entendido
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
