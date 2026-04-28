"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, RefreshCw, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { adoptCurrentSession, clearSessionGuard, type SessionMismatch } from "./useSessionGuard";

type Props = { mismatch: SessionMismatch };

/**
 * Aparece cuando se detecta que la sesión de la cookie cambió bajo esta pestaña.
 * Da dos opciones: continuar como el nuevo user (recargar) o cerrar sesión y volver al login.
 */
export function SessionMismatchModal({ mismatch }: Props) {
    const [mounted, setMounted] = useState(false);
    const [busy, setBusy] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    function handleAdopt() {
        if (busy) return;
        setBusy(true);
        adoptCurrentSession(mismatch.current);
        // Hard reload — todos los datos client se rehidratan con el nuevo user
        window.location.reload();
    }

    function handleLogout() {
        if (busy) return;
        setBusy(true);
        clearSessionGuard();
        signOut({ callbackUrl: "/admin/login" });
    }

    return createPortal(
        <AnimatePresence>
            <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/85 backdrop-blur-md"
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-amber-500/30 bg-[#0a0a0a]/95 shadow-2xl"
                    style={{ boxShadow: "0 0 80px rgba(245,158,11,0.25)" }}
                >
                    <div className="absolute -top-20 right-0 h-40 w-40 bg-amber-500/15 blur-[60px]" />

                    <div className="relative px-6 py-6">
                        <div className="flex items-start gap-4">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-500/10">
                                <ShieldAlert className="h-5 w-5 text-amber-400" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-400/80">
                                    Sesión cambiada
                                </p>
                                <h2 className="mt-1 text-lg font-black text-white leading-tight">
                                    Tu cuenta cambió en este navegador
                                </h2>
                            </div>
                        </div>

                        <p className="mt-4 text-xs leading-relaxed text-gray-400">
                            Esta pestaña abrió como{" "}
                            <span className="font-mono font-bold text-white">
                                {mismatch.previous}
                            </span>{" "}
                            pero la sesión activa ahora es{" "}
                            <span className="font-mono font-bold text-amber-300">
                                {mismatch.current}
                            </span>
                            . Otro inicio de sesión en este navegador pisó la cookie compartida.
                        </p>

                        <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                            <button
                                onClick={handleLogout}
                                disabled={busy}
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-xs font-bold uppercase tracking-widest text-gray-300 transition hover:border-white/[0.15] hover:bg-white/[0.06] hover:text-white disabled:opacity-40"
                            >
                                <LogOut className="h-3.5 w-3.5" />
                                Volver al login
                            </button>
                            <button
                                onClick={handleAdopt}
                                disabled={busy}
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-amber-500/40 bg-amber-500/15 px-4 py-3 text-xs font-black uppercase tracking-widest text-amber-200 transition hover:border-amber-500/60 hover:bg-amber-500/25 hover:text-amber-100 disabled:opacity-40"
                            >
                                <RefreshCw className="h-3.5 w-3.5" />
                                Continuar como {mismatch.current}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>,
        document.body,
    );
}
