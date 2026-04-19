"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Check } from "lucide-react";
import type { Completion } from "../types";
import { MOTION, STAGGER, usePrefersReducedMotion } from "../shared/primitives/motion";
import { BRAND_ICON_STYLE } from "../shared/primitives/BrandDefs";
import { BrandDivider } from "../shared/primitives/BrandDivider";

/**
 * Layout de sección para desktop — full screen, single column, con ambient
 * glows + hero centrado estilo hub. Sin subnav: la lista vertical de fields
 * es suficiente y más fluida para el cliente.
 */
export function DesktopSection({
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
            ? "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/25 shadow-[0_0_40px_-12px_rgba(16,185,129,0.5)]"
            : completion === "partial"
              ? "bg-[linear-gradient(135deg,rgba(232,121,249,0.18)_0%,rgba(168,85,247,0.18)_50%,rgba(34,211,238,0.18)_100%)] ring-1 ring-[#a855f7]/40 shadow-[0_0_50px_-14px_rgba(168,85,247,0.6)]"
              : "bg-[linear-gradient(135deg,rgba(232,121,249,0.1)_0%,rgba(168,85,247,0.1)_50%,rgba(34,211,238,0.1)_100%)] ring-1 ring-white/[0.1]";

    const ctaBase =
        "flex h-12 w-full items-center justify-center gap-2 rounded-2xl text-[12px] font-black uppercase tracking-[0.24em] transition-all";
    const ctaStyle =
        completion === "complete"
            ? "bg-[linear-gradient(135deg,#10b981_0%,#059669_100%)] text-white shadow-[0_8px_28px_-6px_rgba(16,185,129,0.55)] hover:scale-[1.01]"
            : "bg-[linear-gradient(135deg,#e879f9_0%,#a855f7_50%,#22d3ee_100%)] text-white shadow-[0_8px_28px_-6px_rgba(168,85,247,0.6)] hover:scale-[1.01]";

    return (
        <motion.div
            initial={reduced ? { opacity: 0 } : { x: "100%", opacity: 0.6 }}
            animate={reduced ? { opacity: 1 } : { x: 0, opacity: 1 }}
            exit={reduced ? { opacity: 0 } : { x: "100%", opacity: 0.6 }}
            transition={MOTION.page}
            className="fixed inset-0 z-30 flex flex-col overflow-hidden bg-[#060214] text-white"
        >
            {/* Ambient glows — mismos que el hub para continuidad visual */}
            <motion.div
                aria-hidden
                className="pointer-events-none absolute -top-48 -left-40 h-[560px] w-[560px] rounded-full bg-[#e879f9] blur-[160px]"
                initial={{ opacity: 0.1 }}
                animate={
                    reduced
                        ? { opacity: 0.1 }
                        : {
                              x: [0, 140, -80, 60, 0],
                              y: [0, -100, 80, -40, 0],
                              opacity: [0.1, 0.14, 0.08, 0.12, 0.1],
                          }
                }
                transition={
                    reduced
                        ? undefined
                        : { duration: 26, repeat: Infinity, ease: "easeInOut" }
                }
            />
            <motion.div
                aria-hidden
                className="pointer-events-none absolute top-[35%] -right-44 h-[620px] w-[620px] rounded-full bg-[#22d3ee] blur-[180px]"
                initial={{ opacity: 0.08 }}
                animate={
                    reduced
                        ? { opacity: 0.08 }
                        : {
                              x: [0, -180, 120, -60, 0],
                              y: [0, 140, -90, 40, 0],
                              opacity: [0.08, 0.13, 0.06, 0.1, 0.08],
                          }
                }
                transition={
                    reduced
                        ? undefined
                        : {
                              duration: 32,
                              repeat: Infinity,
                              ease: "easeInOut",
                              delay: 4,
                          }
                }
            />
            <motion.div
                aria-hidden
                className="pointer-events-none absolute -bottom-40 left-[25%] h-[520px] w-[520px] rounded-full bg-[#a855f7] blur-[160px]"
                initial={{ opacity: 0.08 }}
                animate={
                    reduced
                        ? { opacity: 0.08 }
                        : {
                              x: [0, 120, -160, 80, 0],
                              y: [0, -80, 110, -50, 0],
                              opacity: [0.08, 0.12, 0.05, 0.1, 0.08],
                          }
                }
                transition={
                    reduced
                        ? undefined
                        : {
                              duration: 29,
                              repeat: Infinity,
                              ease: "easeInOut",
                              delay: 8,
                          }
                }
            />

            {/* Header */}
            <header className="relative z-10 flex h-16 shrink-0 items-center border-b border-white/[0.04] bg-[#060214]/80 px-6 backdrop-blur-xl">
                <button
                    type="button"
                    onClick={onBack}
                    aria-label="Volver al inicio"
                    className="flex h-11 w-11 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/[0.05] hover:text-white"
                >
                    <ArrowLeft className="h-5 w-5" />
                </button>
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center gap-2">
                    {headerContent ?? (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/[0.06] px-3 py-1 text-[9px] font-black uppercase tracking-[0.26em] text-emerald-400">
                            <span className="relative flex h-1.5 w-1.5">
                                <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400 opacity-70" />
                                <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-400" />
                            </span>
                            Guardado
                        </span>
                    )}
                </div>
            </header>

            {/* Body */}
            <div className="relative z-10 flex-1 overflow-y-auto">
                {hideBody ? (
                    children
                ) : (
                    <div className="mx-auto w-full max-w-[720px] px-8 pt-14 pb-32">
                        {/* Hero — matching visual rhythm del hub */}
                        <motion.div
                            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={MOTION.reveal}
                            className="mb-10 flex flex-col items-center text-center"
                        >
                            <div
                                className={`flex h-16 w-16 items-center justify-center rounded-2xl transition-colors ${iconRing}`}
                            >
                                <Icon
                                    className="h-7 w-7"
                                    style={
                                        heroUsesGradient
                                            ? BRAND_ICON_STYLE
                                            : undefined
                                    }
                                />
                            </div>
                            <h1 className="mt-6 bg-[linear-gradient(135deg,#f5e7ff_0%,#ffffff_40%,#d6e9ff_100%)] bg-clip-text text-4xl font-black leading-[1.05] tracking-tight text-transparent">
                                {title}
                            </h1>
                            <BrandDivider width="w-16" className="mt-5" />
                            <p className="mt-5 max-w-[520px] text-[13px] leading-relaxed text-white/50">
                                {subtitle}
                            </p>
                        </motion.div>

                        {/* Fields container — glass card sutil que encuadra los inputs y
                            los separa del glow de fondo. */}
                        <motion.div
                            initial="hidden"
                            animate="show"
                            variants={{
                                hidden: {},
                                show: {
                                    transition: {
                                        staggerChildren: reduced
                                            ? 0
                                            : STAGGER.fields,
                                        delayChildren: reduced ? 0 : 0.05,
                                    },
                                },
                            }}
                            className="rounded-[2rem] border border-white/[0.06] bg-white/[0.02] p-7 backdrop-blur-sm space-y-7 shadow-[0_0_60px_-20px_rgba(168,85,247,0.15)]"
                        >
                            {children}
                        </motion.div>
                    </div>
                )}
            </div>

            {/* CTA */}
            {!hideBody && (
                <div className="relative z-10 shrink-0 border-t border-white/[0.04] bg-[#060214]/95 px-8 py-4 backdrop-blur-md">
                    <div className="mx-auto w-full max-w-[720px]">
                        <motion.button
                            type="button"
                            onClick={onBack}
                            whileTap={{ scale: 0.99 }}
                            className={`${ctaBase} ${ctaStyle}`}
                        >
                            {completion === "complete" && (
                                <Check className="h-4 w-4" strokeWidth={3} />
                            )}
                            {completion === "complete"
                                ? "¡Listo! Volver al inicio"
                                : "Volver al inicio"}
                        </motion.button>
                    </div>
                </div>
            )}
        </motion.div>
    );
}
