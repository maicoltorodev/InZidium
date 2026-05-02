"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X, Package, MessageSquare, Phone, Trash2, Hash } from "lucide-react";
import type {
    ActionResult,
    OrderStatus,
    OrderWithContact,
} from "@/lib/crm/types";
import { STATUS_META, STATUS_ORDER, StatusPill } from "./StatusPill";

const COP = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
});

type Props = {
    open: boolean;
    order: OrderWithContact | null;
    onClose: () => void;
    onChangeStatus: (status: OrderStatus) => Promise<ActionResult>;
    onSaveDetails: (input: {
        total: number | null;
        notes: string;
    }) => Promise<ActionResult>;
    onDelete: () => Promise<ActionResult>;
};

export function PedidoDetailModal({
    open,
    order,
    onClose,
    onChangeStatus,
    onSaveDetails,
    onDelete,
}: Props) {
    const [total, setTotal] = useState("");
    const [notes, setNotes] = useState("");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    useEffect(() => {
        if (!open || !order) return;
        setTotal(order.total !== null ? String(order.total) : "");
        setNotes(order.notes ?? "");
        setError(null);
        setConfirmDelete(false);
    }, [open, order]);

    if (!mounted || !order) return null;

    const contactName = order.contact?.name?.trim() || order.contact?.phone || "Sin cliente";

    async function handleStatusClick(status: OrderStatus) {
        if (!order || status === order.status || saving) return;
        setSaving(true);
        setError(null);
        const res = await onChangeStatus(status);
        setSaving(false);
        if ("error" in res) setError(res.error);
    }

    async function handleSave() {
        if (saving) return;
        setSaving(true);
        setError(null);
        const parsedTotal =
            total.trim() === ""
                ? null
                : Number(total.replace(/\./g, "").replace(/,/g, "."));
        if (parsedTotal !== null && (!Number.isFinite(parsedTotal) || parsedTotal < 0)) {
            setError("EL TOTAL DEBE SER UN NÚMERO VÁLIDO.");
            setSaving(false);
            return;
        }
        const res = await onSaveDetails({ total: parsedTotal, notes });
        setSaving(false);
        if ("error" in res) setError(res.error);
    }

    async function handleDelete() {
        if (saving) return;
        setSaving(true);
        const res = await onDelete();
        setSaving(false);
        if ("error" in res) {
            setError(res.error);
            setConfirmDelete(false);
            return;
        }
        onClose();
    }

    return createPortal(
        <AnimatePresence>
            {open && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-md"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        className="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl border border-white/[0.08] bg-[#080808] shadow-2xl"
                    >
                        {/* Header */}
                        <div className="flex items-start justify-between gap-4 border-b border-white/[0.06] px-8 py-6">
                            <div>
                                <div className="mb-2 flex items-center gap-2 text-xs font-medium text-gray-600">
                                    <Hash className="h-3 w-3" />
                                    <span className="font-mono">{order.id.slice(0, 8)}…</span>
                                </div>
                                <h2 className="text-lg font-black tracking-tight text-white">
                                    {contactName}
                                </h2>
                                {order.contact?.phone && (
                                    <a
                                        href={`/admin/chats`}
                                        className="mt-1 inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 transition hover:text-[#22d3ee]"
                                    >
                                        <Phone className="h-3 w-3" />
                                        {order.contact.phone}
                                    </a>
                                )}
                            </div>
                            <button
                                onClick={onClose}
                                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.03] text-gray-400 transition hover:border-white/[0.12] hover:text-white"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="max-h-[70vh] overflow-y-auto px-8 py-6">
                            {/* Status selector */}
                            <section className="mb-8">
                                <SectionLabel icon={Package}>Estado del pedido</SectionLabel>
                                <div className="flex flex-wrap gap-2">
                                    {STATUS_ORDER.map((s) => {
                                        const active = s === order.status;
                                        const meta = STATUS_META[s];
                                        return (
                                            <button
                                                key={s}
                                                onClick={() => handleStatusClick(s)}
                                                disabled={saving || active}
                                                className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-black uppercase tracking-widest transition disabled:cursor-not-allowed ${
                                                    active
                                                        ? "opacity-100"
                                                        : "border-white/[0.06] bg-white/[0.02] text-gray-500 opacity-60 hover:border-white/[0.12] hover:opacity-100"
                                                }`}
                                                style={
                                                    active
                                                        ? {
                                                              color: meta.color,
                                                              backgroundColor: meta.bg,
                                                              borderColor: meta.border,
                                                          }
                                                        : undefined
                                                }
                                            >
                                                <meta.Icon className="h-3 w-3" />
                                                {meta.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </section>

                            {/* Items (read-only) */}
                            <section className="mb-8">
                                <SectionLabel icon={Package}>Items</SectionLabel>
                                {Array.isArray(order.items) && order.items.length > 0 ? (
                                    <div className="space-y-2">
                                        {order.items.map((it, idx) => (
                                            <div
                                                key={idx}
                                                className="flex items-start justify-between gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3"
                                            >
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-baseline gap-2">
                                                        {it.quantity && (
                                                            <span className="text-xs font-black text-[#22d3ee]">
                                                                {it.quantity}×
                                                            </span>
                                                        )}
                                                        <span className="truncate text-sm font-bold text-white">
                                                            {it.name || "Sin nombre"}
                                                        </span>
                                                    </div>
                                                    {it.notes && (
                                                        <p className="mt-1 text-xs text-gray-500">
                                                            {it.notes}
                                                        </p>
                                                    )}
                                                </div>
                                                {it.price !== undefined && it.price !== null && (
                                                    <span className="shrink-0 text-xs font-bold text-gray-400">
                                                        {COP.format(it.price)}
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 text-xs text-gray-600">
                                        Sin ítems cargados. Puedes editarlos desde la DB por ahora.
                                    </p>
                                )}
                            </section>

                            {/* Total editable */}
                            <section className="mb-6">
                                <SectionLabel icon={Hash}>Total (COP)</SectionLabel>
                                <input
                                    value={total}
                                    onChange={(e) =>
                                        setTotal(e.target.value.replace(/[^0-9.,]/g, ""))
                                    }
                                    placeholder="0"
                                    inputMode="decimal"
                                    className="w-full rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3 text-sm font-bold text-white placeholder:text-gray-600 focus:border-[#22d3ee]/40 focus:outline-none"
                                />
                            </section>

                            {/* Notes editable */}
                            <section className="mb-6">
                                <SectionLabel icon={MessageSquare}>Notas</SectionLabel>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    rows={4}
                                    placeholder="Urgencia, dirección de envío, detalles adicionales…"
                                    className="w-full resize-none rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:border-[#22d3ee]/40 focus:outline-none"
                                />
                            </section>

                            {error && (
                                <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3">
                                    <p className="text-xs font-bold uppercase tracking-widest text-red-400">
                                        {error}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between gap-3 border-t border-white/[0.06] px-8 py-5">
                            {!confirmDelete ? (
                                <button
                                    onClick={() => setConfirmDelete(true)}
                                    className="inline-flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-2 text-xs font-bold uppercase tracking-widest text-gray-500 transition hover:border-red-500/20 hover:text-red-400"
                                >
                                    <Trash2 className="h-3 w-3" />
                                    Eliminar
                                </button>
                            ) : (
                                <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/5 px-2 py-1">
                                    <span className="px-2 text-xs font-bold uppercase tracking-widest text-red-400">
                                        ¿Eliminar?
                                    </span>
                                    <button
                                        onClick={() => setConfirmDelete(false)}
                                        className="rounded-lg px-2 py-1 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white"
                                    >
                                        No
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        className="rounded-lg bg-red-600 px-3 py-1 text-xs font-black uppercase tracking-widest text-white hover:bg-red-700"
                                    >
                                        Sí
                                    </button>
                                </div>
                            )}

                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                    <StatusPill status={order.status} size="md" />
                                </div>
                                <button
                                    type="button"
                                    onClick={onClose}
                                    disabled={saving}
                                    className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-gray-400 transition hover:border-white/[0.12] hover:text-white disabled:opacity-50"
                                >
                                    Cerrar
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="rounded-xl bg-[#22d3ee] px-6 py-2.5 text-xs font-black uppercase tracking-widest text-black transition hover:bg-[#22d3ee]/90 disabled:opacity-50"
                                >
                                    {saving ? "Guardando…" : "Guardar"}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body,
    );
}

function SectionLabel({
    icon: Icon,
    children,
}: {
    icon: typeof Package;
    children: React.ReactNode;
}) {
    return (
        <div className="mb-3 flex items-center gap-2">
            <Icon className="h-3.5 w-3.5" style={{ color: "#22d3ee" }} />
            <span className="text-xs font-black uppercase tracking-[0.25em] text-gray-400">
                {children}
            </span>
        </div>
    );
}
