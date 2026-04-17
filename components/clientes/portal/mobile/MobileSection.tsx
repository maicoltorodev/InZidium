"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Check } from "lucide-react";
import type { Completion } from "../types";
import { MOTION, STAGGER, usePrefersReducedMotion } from "../shared/primitives/motion";
import { BRAND_ICON_STYLE } from "../shared/primitives/BrandDefs";

/**
 * Layout section para mobile: full-screen fixed con slide-in, header sticky arriba,
 * CTA sticky abajo. Se usa únicamente en el shell mobile.
 */
export function MobileSection({
  icon: Icon,
  title,
  subtitle,
  completion,
  onBack,
  children,
  hideBody = false,
  headerContent,
}: {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  completion: Completion;
  onBack: () => void;
  children: React.ReactNode;
  /** Cuando el contenido maneja su propio scroll y padding (ej. Mensajes fullHeight) */
  hideBody?: boolean;
  /** Reemplaza el chip "Guardado" centrado del header por contenido custom. */
  headerContent?: React.ReactNode;
}) {
  const reduced = usePrefersReducedMotion();
  const heroUsesGradient = completion !== "complete";
  const iconRing =
    completion === "complete"
      ? "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20"
      : completion === "partial"
      ? "bg-[linear-gradient(135deg,rgba(232,121,249,0.14)_0%,rgba(168,85,247,0.14)_50%,rgba(96,165,250,0.14)_100%)] ring-1 ring-[#a855f7]/30 shadow-[0_0_40px_-12px_rgba(168,85,247,0.55)]"
      : "bg-[linear-gradient(135deg,rgba(232,121,249,0.06)_0%,rgba(168,85,247,0.06)_50%,rgba(96,165,250,0.06)_100%)] ring-1 ring-white/[0.08]";

  const ctaStyle =
    completion === "complete"
      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
      : "border-white/[0.08] bg-white/[0.04] text-white/70 hover:bg-white/[0.06]";

  return (
    <motion.div
      initial={reduced ? { opacity: 0 } : { x: "100%", opacity: 0.6 }}
      animate={reduced ? { opacity: 1 } : { x: 0, opacity: 1 }}
      exit={reduced ? { opacity: 0 } : { x: "100%", opacity: 0.6 }}
      transition={MOTION.page}
      className="fixed inset-0 z-30 flex flex-col bg-[#060214] text-white"
    >
      <header className="relative flex h-14 shrink-0 items-center border-b border-white/[0.04] bg-[#060214]/85 px-3 backdrop-blur-md">
        <button
          type="button"
          onClick={onBack}
          aria-label="Volver al inicio"
          className="flex h-10 w-10 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/[0.05] hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center gap-1.5">
          {headerContent ?? (
            <>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[9px] font-bold uppercase tracking-[0.22em] text-white/40">
                Guardado
              </span>
            </>
          )}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        {hideBody ? (
          children
        ) : (
          <div className="mx-auto w-full max-w-[560px] px-4 pt-6 pb-28">
            <motion.div
              initial={reduced ? { opacity: 0 } : { y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={MOTION.reveal}
              className="mb-7 flex items-start gap-4"
            >
              <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl transition-colors ${iconRing}`}>
                <Icon className="h-6 w-6" style={heroUsesGradient ? BRAND_ICON_STYLE : undefined} />
              </div>
              <div className="flex-1 min-w-0 pt-0.5">
                <h1 className="text-2xl font-black leading-tight tracking-tight text-white">{title}</h1>
                <p className="mt-1 text-[13px] leading-relaxed text-white/40">{subtitle}</p>
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: {
                  transition: {
                    staggerChildren: reduced ? 0 : STAGGER.fields,
                    delayChildren: reduced ? 0 : 0.05,
                  },
                },
              }}
              className="space-y-5"
            >
              {children}
            </motion.div>
          </div>
        )}
      </div>

      {!hideBody && (
        <div
          className="shrink-0 border-t border-white/[0.04] bg-[#060214]/95 px-4 py-3 backdrop-blur-md"
          style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 12px)" }}
        >
          <button
            type="button"
            onClick={onBack}
            className={`flex h-12 w-full items-center justify-center gap-2 rounded-2xl border text-[12px] font-black uppercase tracking-[0.22em] transition-colors ${ctaStyle}`}
          >
            {completion === "complete" && <Check className="h-4 w-4" strokeWidth={3} />}
            {completion === "complete" ? "¡Listo! Volver al inicio" : "Volver al inicio"}
          </button>
        </div>
      )}
    </motion.div>
  );
}
