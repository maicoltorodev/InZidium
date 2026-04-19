"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X } from "lucide-react";
import { Chat, type ChatVariant } from "./Chat";
import { usePrefersReducedMotion } from "./primitives/motion";

/**
 * FAB de soporte persistente en todo el portal.
 * - Desktop: al abrir muestra un side-sheet (400px) por la derecha — permite
 *   seguir viendo el contenido detrás con backdrop sutil.
 * - Mobile/tablet: fullscreen (como lo era la Mensajes section).
 *
 * Reemplaza la card "Mensajes" dentro del grid de secciones del hub: el chat
 * es un canal transversal, no una tarea con estado de completado.
 */
export function SupportFab({
    project,
    showToast,
    device,
    hasUnread,
}: {
    project: any;
    showToast: (msg: string, type: "success" | "error") => void;
    device: ChatVariant;
    hasUnread: boolean;
}) {
    const [open, setOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const reduced = usePrefersReducedMotion();

    useEffect(() => setMounted(true), []);

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open]);

    if (!mounted) return null;

    const isDesktop = device === "desktop";

    return createPortal(
        <>
            {/* Wrapper del FAB con float continuo + pulse ring para dar
                presencia visual sin costo de layout (solo transform/opacity
                animadas, GPU-friendly). */}
            <motion.div
                className="fixed bottom-6 right-6 z-[70]"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 260, damping: 20 }}
            >
                <motion.div
                    className="relative"
                    animate={!reduced && !open ? { y: [0, -5, 0] } : { y: 0 }}
                    transition={
                        !reduced && !open
                            ? { duration: 2.8, repeat: Infinity, ease: "easeInOut" }
                            : { duration: 0.3 }
                    }
                >
                    {/* Pulse rings — dos capas desfasadas para efecto de ondas
                        continuas. Solo cuando el FAB está cerrado. */}
                    {!open && !reduced && (
                        <>
                            <motion.span
                                aria-hidden
                                className="absolute inset-0 rounded-full bg-[#a855f7]/50"
                                initial={{ scale: 1, opacity: 0.55 }}
                                animate={{ scale: 1.7, opacity: 0 }}
                                transition={{
                                    duration: 2.2,
                                    repeat: Infinity,
                                    ease: "easeOut",
                                }}
                            />
                            <motion.span
                                aria-hidden
                                className="absolute inset-0 rounded-full bg-[#a855f7]/40"
                                initial={{ scale: 1, opacity: 0.45 }}
                                animate={{ scale: 1.7, opacity: 0 }}
                                transition={{
                                    duration: 2.2,
                                    repeat: Infinity,
                                    ease: "easeOut",
                                    delay: 1.1,
                                }}
                            />
                        </>
                    )}

                    <motion.button
                        type="button"
                        onClick={() => setOpen((v) => !v)}
                        whileTap={{ scale: 0.92 }}
                        whileHover={{ scale: 1.05 }}
                        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[linear-gradient(135deg,#e879f9_0%,#a855f7_50%,#22d3ee_100%)] text-white shadow-[0_8px_28px_-6px_rgba(168,85,247,0.7)] transition-shadow hover:shadow-[0_10px_36px_-6px_rgba(168,85,247,0.85)]"
                        aria-label={open ? "Cerrar mensajes" : "Abrir mensajes"}
                    >
                <AnimatePresence mode="wait" initial={false}>
                    {open ? (
                        <motion.span
                            key="close"
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                            transition={{ duration: 0.15 }}
                        >
                            <X className="h-6 w-6" strokeWidth={2.5} />
                        </motion.span>
                    ) : (
                        <motion.span
                            key="chat"
                            initial={{ rotate: 90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: -90, opacity: 0 }}
                            transition={{ duration: 0.15 }}
                        >
                            <MessageSquare className="h-6 w-6" strokeWidth={2.5} />
                        </motion.span>
                    )}
                </AnimatePresence>
                {hasUnread && !open && (
                    <motion.span
                        aria-hidden
                        initial={{ scale: 0 }}
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{
                            duration: 1.4,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-blue-400 ring-2 ring-[#060214]"
                    />
                )}
                    </motion.button>
                </motion.div>
            </motion.div>

            <AnimatePresence>
                {open && (
                    <>
                        <motion.div
                            key="fab-backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.18 }}
                            className="fixed inset-0 z-[75] bg-black/55 backdrop-blur-sm"
                            onClick={() => setOpen(false)}
                            aria-hidden
                        />
                        <motion.aside
                            key="fab-sheet"
                            initial={
                                isDesktop ? { x: "100%" } : { y: "100%" }
                            }
                            animate={isDesktop ? { x: 0 } : { y: 0 }}
                            exit={isDesktop ? { x: "100%" } : { y: "100%" }}
                            transition={{
                                duration: 0.28,
                                ease: [0.4, 0, 0.2, 1],
                            }}
                            className={
                                isDesktop
                                    ? "fixed right-0 top-0 bottom-0 z-[80] flex w-[min(440px,92vw)] flex-col border-l border-white/[0.06] bg-[#060214] shadow-[-8px_0_40px_rgba(0,0,0,0.5)]"
                                    : "fixed inset-0 z-[80] flex flex-col bg-[#060214]"
                            }
                            role="dialog"
                            aria-modal="true"
                            aria-label="Mensajes con el equipo"
                        >
                            <header className="flex shrink-0 items-center justify-between border-b border-white/[0.06] px-5 py-4">
                                <div className="flex items-center gap-2.5">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[linear-gradient(135deg,rgba(232,121,249,0.15)_0%,rgba(168,85,247,0.15)_50%,rgba(34,211,238,0.15)_100%)] ring-1 ring-[#a855f7]/30">
                                        <MessageSquare className="h-4 w-4 text-white/85" />
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-black uppercase tracking-[0.24em] text-white">
                                            Soporte
                                        </p>
                                        <p className="mt-0.5 flex items-center gap-1.5 text-[10px] text-emerald-400/80">
                                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                                            Equipo en línea
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setOpen(false)}
                                    aria-label="Cerrar"
                                    className="flex h-9 w-9 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/5 hover:text-white"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </header>
                            <div className="flex-1 overflow-hidden">
                                <Chat
                                    project={project}
                                    showToast={showToast}
                                    variant={device}
                                />
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>,
        document.body,
    );
}
