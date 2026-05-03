"use client";

import { motion } from "framer-motion";

type Props = { by: "ai" | "human" };

/**
 * Tres dots animados inline para mostrar typing dentro de la card de la lista.
 * Reemplaza el preview cuando hay typing activo en esa conversación.
 */
export function TypingDots({ by }: Props) {
    const color = by === "ai" ? "#22d3ee" : "#ffffff";
    const label = by === "ai" ? "Zid escribiendo" : "Escribiendo";
    return (
        <span className="inline-flex items-center gap-1.5">
            <span
                className="text-[10px] font-bold uppercase tracking-widest"
                style={{ color }}
            >
                {label}
            </span>
            <span className="inline-flex items-center gap-0.5">
                <Dot color={color} delay={0} />
                <Dot color={color} delay={0.15} />
                <Dot color={color} delay={0.3} />
            </span>
        </span>
    );
}

function Dot({ color, delay }: { color: string; delay: number }) {
    return (
        <motion.span
            animate={{ y: [0, -2, 0], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut", delay }}
            className="block h-1 w-1 rounded-full"
            style={{ background: color }}
        />
    );
}
