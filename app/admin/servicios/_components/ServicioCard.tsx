"use client";

import { useState } from "react";
import { Pencil, Power, Trash2, Check, X, MessageSquare } from "lucide-react";
import Image from "next/image";
import type { Servicio } from "@/lib/crm/types";

const COP = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
});

type Props = {
    servicio: Servicio;
    onEdit: () => void;
    onToggle: () => void;
    onDelete: () => void;
    onOpenVariants: () => void;
    onOpenFaqs: () => void;
};

export function ServicioCard({ servicio, onEdit, onToggle, onDelete, onOpenVariants, onOpenFaqs }: Props) {
    const [confirmDelete, setConfirmDelete] = useState(false);
    const isGeneral = servicio.service_type === "general";
    const variants = servicio.service_variants ?? [];
    const activeVariants = variants.filter((v) => v.active).length;

    return (
        <div
            className={`group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0d0d0d] transition-all duration-300 hover:border-white/[0.10] hover:shadow-[0_8px_40px_rgba(0,0,0,0.6)] ${
                !servicio.active ? "opacity-50 hover:opacity-75" : ""
            }`}
        >
            {/* ── Zona imagen ── */}
            <div className="relative aspect-[4/3] overflow-hidden bg-white/[0.02]">
                {servicio.image_url ? (
                    <Image
                        src={servicio.image_url}
                        alt={servicio.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    />
                ) : (
                    <Image
                        src="/service-placeholder.svg"
                        alt="Sin imagen"
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    />
                )}

                {/* Dot estado */}
                <div
                    className={`absolute left-3 top-3 h-2 w-2 rounded-full shadow-lg ring-2 ring-black/50 transition-colors ${
                        servicio.active ? "bg-emerald-400" : "bg-white/20"
                    }`}
                />

                {/* Overlay de acciones — aparece en hover */}
                <AnimatePresence>
                    {!confirmDelete ? (
                        <motion.div
                            key="actions"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            className="absolute inset-0 hidden items-center justify-center gap-2.5 bg-black/55 backdrop-blur-[3px] group-hover:flex"
                        >
                            <OverlayBtn onClick={onEdit} title="Editar">
                                <Pencil className="h-4 w-4" />
                            </OverlayBtn>
                            <OverlayBtn onClick={onOpenFaqs} title="FAQs SEO">
                                <MessageSquare className="h-4 w-4" />
                            </OverlayBtn>
                            <OverlayBtn
                                onClick={onToggle}
                                title={servicio.active ? "Desactivar" : "Activar"}
                                variant={servicio.active ? "gold" : "default"}
                            >
                                <Power className="h-4 w-4" />
                            </OverlayBtn>
                            <OverlayBtn
                                onClick={() => setConfirmDelete(true)}
                                title="Eliminar"
                                variant="danger"
                            >
                                <Trash2 className="h-4 w-4" />
                            </OverlayBtn>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="confirm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/75 backdrop-blur-[3px]"
                        >
                            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/70">
                                &iquest;Eliminar servicio?
                            </p>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setConfirmDelete(false)}
                                    className="flex items-center gap-1.5 rounded-xl border border-white/[0.12] bg-white/[0.06] px-4 py-2 text-xs font-bold text-gray-300 transition hover:text-white"
                                >
                                    <X className="h-3.5 w-3.5" /> Cancelar
                                </button>
                                <button
                                    onClick={onDelete}
                                    className="flex items-center gap-1.5 rounded-xl bg-red-600 px-4 py-2 text-xs font-black uppercase tracking-widest text-white transition hover:bg-red-500"
                                >
                                    <Check className="h-3.5 w-3.5" /> Eliminar
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* ── Zona info ── */}
            <div className="p-4 text-center">
                <h3 className="truncate text-sm font-bold leading-snug tracking-tight text-white">
                    {servicio.name}
                </h3>
                {servicio.category && (
                    <p className="mt-0.5 truncate text-[11px] text-gray-600">
                        {servicio.category}
                    </p>
                )}

                <div className="mt-3.5 flex h-8 items-center justify-center">
                    {isGeneral ? (
                        <button
                            onClick={onOpenVariants}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-[#FFD700]/20 bg-[#FFD700]/5 px-2.5 py-1.5 text-[10px] font-black uppercase tracking-widest text-[#FFD700] transition hover:border-[#FFD700]/40 hover:bg-[#FFD700]/10"
                        >
                            {variants.length} variante{variants.length !== 1 ? "s" : ""}
                            {variants.length > 0 && activeVariants < variants.length && (
                                <span className="text-[#FFD700]/40">
                                    &nbsp;&middot;&nbsp;{activeVariants} activa{activeVariants !== 1 ? "s" : ""}
                                </span>
                            )}
                        </button>
                    ) : (
                        <div className="flex items-center gap-2">
                            {servicio.price !== null && (
                                <span className="text-sm font-bold tabular-nums text-[#FFD700]/80">
                                    {COP.format(servicio.price)}
                                </span>
                            )}
                            <span className="rounded-lg border border-white/[0.06] px-2.5 py-1.5 text-[10px] font-black uppercase tracking-widest text-gray-600">
                                Normal
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// ── Botón overlay ──────────────────────────────────────────────────────────

import { AnimatePresence, motion } from "framer-motion";

function OverlayBtn({
    children,
    onClick,
    title,
    variant = "default",
}: {
    children: React.ReactNode;
    onClick: () => void;
    title: string;
    variant?: "default" | "gold" | "danger";
}) {
    const styles = {
        default: "border-white/[0.15] bg-white/[0.08] text-white hover:bg-white/[0.16]",
        gold: "border-[#FFD700]/30 bg-[#FFD700]/10 text-[#FFD700] hover:bg-[#FFD700]/20",
        danger: "border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/25 hover:text-red-300",
    };
    return (
        <button
            onClick={onClick}
            title={title}
            className={`flex h-10 w-10 items-center justify-center rounded-xl border backdrop-blur-sm transition-all ${styles[variant]}`}
        >
            {children}
        </button>
    );
}
