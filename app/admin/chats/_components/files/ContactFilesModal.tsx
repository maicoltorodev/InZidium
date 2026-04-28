"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, FolderOpen } from "lucide-react";
import { ContactFilesGrid } from "./ContactFilesGrid";

type Props = {
    open: boolean;
    onClose: () => void;
    contactId: string;
    contactName: string;
};

export function ContactFilesModal({ open, onClose, contactId, contactName }: Props) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", onKey);
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = "";
        };
    }, [open, onClose]);

    if (!mounted || !open) return null;

    return createPortal(
        <AnimatePresence>
            <div className="fixed inset-0 z-[9000] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/85 backdrop-blur-md"
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative z-10 flex w-full max-w-2xl max-h-[85vh] flex-col overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0a0a0a]/95 shadow-2xl"
                >
                    <div className="flex items-center justify-between border-b border-white/[0.05] px-6 py-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03]">
                                <FolderOpen className="h-5 w-5 text-[#FFD700]" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 font-[family-name:var(--font-orbitron)]">
                                    Archivos
                                </p>
                                <h2 className="truncate text-base font-bold text-white">
                                    {contactName}
                                </h2>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            aria-label="Cerrar"
                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.03] text-gray-400 transition hover:bg-white/[0.06] hover:text-white"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto px-6 py-5">
                        <ContactFilesGrid contactId={contactId} />
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>,
        document.body,
    );
}
