"use client";

import { Bot, User } from "lucide-react";
import { motion } from "framer-motion";

type Props = {
    by: "ai" | "human";
};

export function TypingBubble({ by }: Props) {
    const isAi = by === "ai";
    const label = isAi ? "Zid" : "Tú";

    return (
        <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.2 }}
            className="flex justify-end"
        >
            <div className="max-w-[75%] min-w-0">
                <div className="mb-1 flex items-center justify-end gap-1.5 px-1">
                    {isAi ? (
                        <Bot className="h-3 w-3 text-[#22d3ee]" />
                    ) : (
                        <User className="h-3 w-3 text-white" />
                    )}
                    <span
                        className="text-[9px] font-black uppercase tracking-[0.25em] font-[family-name:var(--font-orbitron)]"
                        style={{ color: isAi ? "#22d3ee" : "#ffffff" }}
                    >
                        {label}
                    </span>
                </div>

                <div
                    className="relative inline-flex items-center gap-1.5 overflow-hidden rounded-2xl rounded-tr-md border px-4 py-3"
                    style={{
                        borderColor: "rgba(34,211,238,0.2)",
                        background:
                            "linear-gradient(135deg, rgba(34,211,238,0.10), rgba(255,255,255,0.08))",
                        boxShadow: "0 4px 20px rgba(34,211,238,0.06)",
                    }}
                >
                    <div
                        className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full blur-2xl opacity-40"
                        style={{ background: "radial-gradient(circle, #22d3ee, transparent)" }}
                    />
                    <div className="relative flex items-center gap-1.5">
                        <Dot delay={0} />
                        <Dot delay={0.15} />
                        <Dot delay={0.3} />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

function Dot({ delay }: { delay: number }) {
    return (
        <motion.span
            animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
            transition={{
                duration: 0.9,
                repeat: Infinity,
                ease: "easeInOut",
                delay,
            }}
            className="block h-1.5 w-1.5 rounded-full bg-[#22d3ee]"
        />
    );
}
