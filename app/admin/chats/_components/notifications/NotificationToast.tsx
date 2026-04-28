"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { MessageSquare, X } from "lucide-react";

export type ToastData = {
    id: string;
    contactName: string;
    phone: string;
    preview: string;
    conversationId: string;
};

type Props = {
    toast: ToastData;
    onClick: () => void;
    onDismiss: () => void;
    autoDismissMs?: number;
};

export function NotificationToast({ toast, onClick, onDismiss, autoDismissMs = 6000 }: Props) {
    useEffect(() => {
        const t = setTimeout(onDismiss, autoDismissMs);
        return () => clearTimeout(t);
    }, [autoDismissMs, onDismiss]);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: 80, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 80, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto w-80"
        >
            <div
                className="group relative flex items-start gap-3 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0a0a0a]/95 p-3 shadow-2xl backdrop-blur-xl"
                style={{ boxShadow: "0 12px 48px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,215,0,0.08)" }}
            >
                {/* Glow ambiente */}
                <div
                    className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full blur-2xl opacity-30"
                    style={{ background: "radial-gradient(circle, #FFD700, transparent)" }}
                />

                <button
                    onClick={onClick}
                    className="relative flex flex-1 items-start gap-3 text-left"
                >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#FFD700]/30 bg-[#FFD700]/10">
                        <MessageSquare className="h-4 w-4 text-[#FFD700]" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="flex items-baseline justify-between gap-2">
                            <p className="truncate text-sm font-bold text-white">
                                {toast.contactName}
                            </p>
                            <span className="font-mono text-[9px] text-gray-600 shrink-0">
                                {toast.phone.slice(-4)}
                            </span>
                        </div>
                        <p className="mt-0.5 line-clamp-2 text-xs text-gray-300">{toast.preview}</p>
                    </div>
                </button>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDismiss();
                    }}
                    aria-label="Cerrar"
                    className="relative flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-gray-500 transition hover:bg-white/[0.06] hover:text-white"
                >
                    <X className="h-3 w-3" />
                </button>

                {/* Barra de progreso de auto-dismiss */}
                <motion.div
                    initial={{ scaleX: 1 }}
                    animate={{ scaleX: 0 }}
                    transition={{ duration: autoDismissMs / 1000, ease: "linear" }}
                    style={{
                        background: "linear-gradient(90deg, #FFD700, #ffffff)",
                        transformOrigin: "left",
                    }}
                    className="absolute inset-x-0 bottom-0 h-[2px] opacity-50"
                />
            </div>
        </motion.div>
    );
}
