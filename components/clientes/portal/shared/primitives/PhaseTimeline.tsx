"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import type { ProjectFase } from "@/lib/data/types";
import { MOTION, usePrefersReducedMotion } from "./motion";

/**
 * Barra horizontal con las 3 fases del proyecto. Da contexto global de dónde
 * está el cliente en el journey: Onboarding → Construcción → Publicado.
 *
 * - Fases ya superadas se muestran con check.
 * - La fase actual pulsa y opcionalmente muestra un sublabel (ej: "5 de 8").
 * - Fases futuras se muestran apagadas.
 */

type Phase = {
    key: ProjectFase;
    label: string;
};

const PHASES: Phase[] = [
    { key: "onboarding", label: "Onboarding" },
    { key: "construccion", label: "Construcción" },
    { key: "publicado", label: "Publicado" },
];

function phaseIndex(fase: ProjectFase): number {
    return PHASES.findIndex((p) => p.key === fase);
}

export function PhaseTimeline({
    fase,
    activeSubtitle,
}: {
    fase: ProjectFase;
    /** Sub-texto bajo el step activo — ej. "5 de 8 secciones". */
    activeSubtitle?: string;
}) {
    const reduced = usePrefersReducedMotion();
    const currentIdx = phaseIndex(fase);

    return (
        <motion.div
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={MOTION.reveal}
            className="relative mb-10 w-full"
        >
            {/* Línea base */}
            <div className="absolute left-0 right-0 top-5 h-px bg-white/[0.06]" />
            {/* Línea de progreso */}
            <motion.div
                aria-hidden
                initial={{ width: 0 }}
                animate={{
                    width:
                        currentIdx === 0
                            ? "16.66%"
                            : currentIdx === 1
                              ? "50%"
                              : "83.33%",
                }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="absolute left-0 top-5 h-px bg-[linear-gradient(90deg,#e879f9_0%,#a855f7_50%,#60a5fa_100%)]"
            />

            <div className="relative grid grid-cols-3 gap-4">
                {PHASES.map((phase, idx) => {
                    const done = idx < currentIdx;
                    const active = idx === currentIdx;
                    const upcoming = idx > currentIdx;
                    return (
                        <div
                            key={phase.key}
                            className="flex flex-col items-center gap-3"
                        >
                            <motion.div
                                initial={reduced ? false : { scale: 0.7, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{
                                    ...MOTION.reveal,
                                    delay: reduced ? 0 : 0.1 + idx * 0.08,
                                }}
                                className={`relative flex h-10 w-10 items-center justify-center rounded-full border transition-all ${
                                    done
                                        ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                                        : active
                                          ? "border-[#a855f7]/50 bg-[#0d0820] text-white shadow-[0_0_28px_-4px_rgba(168,85,247,0.65)]"
                                          : "border-white/10 bg-white/[0.02] text-white/25"
                                }`}
                            >
                                {done ? (
                                    <Check className="h-4 w-4" strokeWidth={3} />
                                ) : (
                                    <span className="text-[11px] font-black">
                                        {idx + 1}
                                    </span>
                                )}
                                {active && !reduced && (
                                    <motion.span
                                        aria-hidden
                                        className="absolute inset-0 rounded-full ring-2 ring-[#a855f7]/40"
                                        initial={{ scale: 1, opacity: 0.6 }}
                                        animate={{ scale: 1.35, opacity: 0 }}
                                        transition={{
                                            duration: 1.6,
                                            repeat: Infinity,
                                            ease: "easeOut",
                                        }}
                                    />
                                )}
                            </motion.div>
                            <div className="text-center">
                                <p
                                    className={`text-[10px] font-black uppercase tracking-[0.22em] ${
                                        done
                                            ? "text-emerald-400/80"
                                            : active
                                              ? "bg-[linear-gradient(90deg,#e879f9_0%,#a855f7_50%,#60a5fa_100%)] bg-clip-text text-transparent"
                                              : upcoming
                                                ? "text-white/20"
                                                : "text-white/60"
                                    }`}
                                >
                                    {phase.label}
                                </p>
                                {active && activeSubtitle && (
                                    <p className="mt-1 text-[10px] text-white/40">
                                        {activeSubtitle}
                                    </p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </motion.div>
    );
}
