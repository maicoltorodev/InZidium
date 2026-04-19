"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Check } from "lucide-react";
import type { Completion } from "../types";
import { MOTION, STAGGER, usePrefersReducedMotion } from "../shared/primitives/motion";
import { BRAND_ICON_STYLE } from "../shared/primitives/BrandDefs";

/**
 * Layout section para tablet: full-screen slide, similar a mobile pero más ancho
 * (`max-w-2xl`), con más padding y hero más grande.
 */
export function TabletSection({
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
  hideBody?: boolean;
  headerContent?: React.ReactNode;
}) {
  const reduced = usePrefersReducedMotion();
  const heroUsesGradient = completion !== "complete";
  const iconRing =
    completion === "complete"
      ? "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20"
      : completion === "partial"
      ? "bg-[linear-gradient(135deg,rgba(232,121,249,0.14)_0%,rgba(168,85,247,0.14)_50%,rgba(34,211,238,0.14)_100%)] ring-1 ring-[#a855f7]/30 shadow-[0_0_50px_-14px_rgba(168,85,247,0.6)]"
      : "bg-[linear-gradient(135deg,rgba(232,121,249,0.06)_0%,rgba(168,85,247,0.06)_50%,rgba(34,211,238,0.06)_100%)] ring-1 ring-white/[0.08]";

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
      <header className="relative flex h-16 shrink-0 items-center border-b border-white/[0.04] bg-[#060214]/85 px-5 backdrop-blur-md">
        <button
          type="button"
          onClick={onBack}
          aria-label="Volver al inicio"
          className="flex h-11 w-11 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/[0.05] hover:text-white"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center gap-1.5">
          {headerContent ?? (
            <>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/40">
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
          <div className="mx-auto w-full max-w-2xl px-8 pt-10 pb-32">
            <motion.div
              initial={reduced ? { opacity: 0 } : { y: 18, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={MOTION.reveal}
              className="mb-9 flex items-start gap-5"
            >
              <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl transition-colors ${iconRing}`}>
                <Icon className="h-7 w-7" style={heroUsesGradient ? BRAND_ICON_STYLE : undefined} />
              </div>
              <div className="flex-1 min-w-0 pt-0.5">
                <h1 className="text-3xl font-black leading-tight tracking-tight text-white">{title}</h1>
                <p className="mt-1.5 text-[14px] leading-relaxed text-white/45">{subtitle}</p>
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
              className="space-y-6"
            >
              {children}
            </motion.div>
          </div>
        )}
      </div>

      {!hideBody && (
        <div
          className="shrink-0 border-t border-white/[0.04] bg-[#060214]/95 px-6 py-4 backdrop-blur-md"
          style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 16px)" }}
        >
          <div className="mx-auto w-full max-w-2xl">
            <button
              type="button"
              onClick={onBack}
              className={`flex h-13 w-full items-center justify-center gap-2 rounded-2xl border py-3.5 text-[12px] font-black uppercase tracking-[0.24em] transition-colors ${ctaStyle}`}
            >
              {completion === "complete" && <Check className="h-4 w-4" strokeWidth={3} />}
              {completion === "complete" ? "¡Listo! Volver al inicio" : "Volver al inicio"}
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
