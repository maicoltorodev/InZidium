"use client";

import { useState, useTransition } from "react";
import { Bot, BotOff } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

type Props = {
    enabled: boolean;
    onToggle: (enabled: boolean) => Promise<void>;
};

export function AIToggle({ enabled, onToggle }: Props) {
    const [isPending, startTransition] = useTransition();
    const [confirmingDisable, setConfirmingDisable] = useState(false);

    function handleClick() {
        if (enabled) {
            setConfirmingDisable(true);
            return;
        }
        startTransition(async () => {
            await onToggle(true);
        });
    }

    function confirmDisable() {
        setConfirmingDisable(false);
        startTransition(async () => {
            await onToggle(false);
        });
    }

    return (
        <AnimatePresence mode="wait" initial={false}>
            {confirmingDisable ? (
                <motion.div
                    key="confirm"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.15 }}
                    className="flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/5 px-2 py-1.5"
                >
                    <span className="px-2 text-[10px] font-black uppercase tracking-[0.15em] text-amber-400">
                        ¿Tomar control?
                    </span>
                    <button
                        onClick={() => setConfirmingDisable(false)}
                        className="rounded-lg px-2 py-1 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition"
                    >
                        No
                    </button>
                    <button
                        onClick={confirmDisable}
                        className="rounded-lg bg-amber-500 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[#0a0518] hover:bg-amber-400 active:scale-95 transition"
                    >
                        Sí
                    </button>
                </motion.div>
            ) : (
                <motion.button
                    key="toggle"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.15 }}
                    onClick={handleClick}
                    disabled={isPending}
                    className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl border px-3 py-2 text-[10px] font-black uppercase tracking-[0.15em] transition-all disabled:opacity-50"
                    style={
                        enabled
                            ? {
                                  borderColor: "rgba(34,211,238,0.3)",
                                  background:
                                      "linear-gradient(135deg, rgba(34,211,238,0.1), rgba(168,85,247,0.1))",
                                  color: "#22d3ee",
                              }
                            : {
                                  borderColor: "rgba(245,158,11,0.3)",
                                  background: "rgba(245,158,11,0.08)",
                                  color: "#fbbf24",
                              }
                    }
                    title={
                        enabled
                            ? "IA respondiendo — click para tomar control"
                            : "Humano al control — click para reactivar IA"
                    }
                >
                    {/* Glow ambient cuando IA activa */}
                    {enabled && (
                        <div
                            className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                            style={{
                                background:
                                    "linear-gradient(135deg, rgba(34,211,238,0.05), rgba(168,85,247,0.05))",
                            }}
                        />
                    )}
                    <span className="relative flex items-center gap-1.5">
                        {enabled ? (
                            <>
                                <Bot className="h-3.5 w-3.5" />
                                IA activa
                                <span
                                    className="ml-1 h-1.5 w-1.5 animate-pulse rounded-full"
                                    style={{
                                        background:
                                            "linear-gradient(135deg, #22d3ee, #a855f7)",
                                        boxShadow:
                                            "0 0 6px rgba(168,85,247,0.7)",
                                    }}
                                />
                            </>
                        ) : (
                            <>
                                <BotOff className="h-3.5 w-3.5" />
                                Humano
                            </>
                        )}
                    </span>
                </motion.button>
            )}
        </AnimatePresence>
    );
}
