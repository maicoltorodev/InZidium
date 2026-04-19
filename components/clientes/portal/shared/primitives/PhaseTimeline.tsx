"use client";

import { Fragment } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import type { ProjectFase } from "@/lib/data/types";
import { MOTION, usePrefersReducedMotion } from "./motion";

/**
 * Barra horizontal con las 3 fases del proyecto. Da contexto global de dónde
 * está el cliente en el journey: Preparación → Construcción → Publicado.
 *
 * Layout: íconos + segmentos de línea intercalados (icono — línea — icono —
 * línea — icono). La línea SOLO vive entre íconos, nunca los atraviesa ni se
 * extiende hacia los bordes.
 */

type Phase = {
    key: ProjectFase;
    label: string;
};

const PHASES: Phase[] = [
    { key: "onboarding", label: "Preparación" },
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
            className="mb-10 w-full"
        >
            {/* Fila con íconos y segmentos de línea alternados. El line-segment
                está alineado verticalmente al centro del ícono (h-10 icon →
                top/bottom margin 20px). */}
            <div className="flex items-center px-2">
                {PHASES.map((phase, idx) => {
                    const done = idx < currentIdx;
                    const active = idx === currentIdx;
                    const isLast = idx === PHASES.length - 1;
                    // Segmento DESPUÉS de este ícono → completado si la fase
                    // actual ya está más adelante (línea consolidada entre
                    // hitos superados).
                    const segmentDone = idx < currentIdx;
                    return (
                        <Fragment key={phase.key}>
                            <PhaseNode
                                idx={idx}
                                done={done}
                                active={active}
                                reduced={reduced}
                            />
                            {!isLast && (
                                <div className="relative mx-1 h-px flex-1 bg-white/[0.06]">
                                    <motion.div
                                        aria-hidden
                                        initial={{ scaleX: 0 }}
                                        animate={{ scaleX: segmentDone ? 1 : 0 }}
                                        transition={{ duration: 0.5, ease: "easeOut" }}
                                        style={{ transformOrigin: "left" }}
                                        className="absolute inset-0 h-px bg-[linear-gradient(90deg,#e879f9_0%,#a855f7_50%,#60a5fa_100%)]"
                                    />
                                </div>
                            )}
                        </Fragment>
                    );
                })}
            </div>

            {/* Labels debajo de cada ícono. Grid 3-col para alinear con las
                posiciones naturales de los íconos (que están en los extremos
                y centro de la fila flex). */}
            <div className="mt-3 grid grid-cols-3 gap-2">
                {PHASES.map((phase, idx) => {
                    const done = idx < currentIdx;
                    const active = idx === currentIdx;
                    const upcoming = idx > currentIdx;
                    return (
                        <div key={phase.key} className="text-center">
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
                    );
                })}
            </div>
        </motion.div>
    );
}

// Nodo circular de cada fase — bg opaco matching el hub (#060214) para que,
// aunque pasara una línea por detrás, no se viera a través del ícono.
function PhaseNode({
    idx,
    done,
    active,
    reduced,
}: {
    idx: number;
    done: boolean;
    active: boolean;
    reduced: boolean;
}) {
    return (
        <motion.div
            initial={reduced ? false : { scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
                ...MOTION.reveal,
                delay: reduced ? 0 : 0.1 + idx * 0.08,
            }}
            className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-all ${
                done
                    ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-400"
                    : active
                      ? "border-[#a855f7]/50 bg-[#0d0820] text-white shadow-[0_0_28px_-4px_rgba(168,85,247,0.65)]"
                      : "border-white/10 bg-[#060214] text-white/25"
            }`}
        >
            {done ? (
                <Check className="h-4 w-4" strokeWidth={3} />
            ) : (
                <span className="text-[11px] font-black">{idx + 1}</span>
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
    );
}
