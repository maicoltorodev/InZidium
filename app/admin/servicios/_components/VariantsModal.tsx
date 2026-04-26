"use client";

import { useEffect, useState, useTransition } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X, Plus, Pencil, Power, Trash2, Check } from "lucide-react";
import type { Servicio, ServiceVariant } from "@/lib/crm/types";
import {
    createVariant,
    updateVariant,
    deleteVariant,
} from "@/lib/crm/actions/servicios";

const COP = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
});

type Props = {
    open: boolean;
    servicio: Servicio | null;
    onClose: () => void;
    onVariantCreated: (v: ServiceVariant) => void;
    onVariantUpdated: (v: ServiceVariant) => void;
    onVariantDeleted: (variantId: string) => void;
};

export function VariantsModal({
    open,
    servicio,
    onClose,
    onVariantCreated,
    onVariantUpdated,
    onVariantDeleted,
}: Props) {
    const [editing, setEditing] = useState<null | "new" | string>(null);
    const [mounted, setMounted] = useState(false);
    const [, startTransition] = useTransition();

    useEffect(() => setMounted(true), []);
    useEffect(() => { if (!open) setEditing(null); }, [open]);

    const variants = (servicio?.service_variants ?? []).sort(
        (a, b) => a.sort_order - b.sort_order,
    );

    if (!mounted) return null;

    return createPortal(
        <AnimatePresence>
            {open && servicio && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-md"
                    />

                    {/* Panel */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.96, y: 16 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: 16 }}
                        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        className="relative z-10 flex w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[#080808] shadow-2xl"
                        style={{ maxHeight: "85vh" }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-white/[0.06] px-7 py-5">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600">
                                    Variantes
                                </p>
                                <h2 className="mt-0.5 text-lg font-black tracking-tight text-white">
                                    {servicio.name}
                                </h2>
                            </div>
                            <button
                                onClick={onClose}
                                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.03] text-gray-500 transition hover:border-white/[0.12] hover:text-white"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        {/* Lista de variantes */}
                        <div className="flex-1 overflow-y-auto">
                            {variants.length === 0 && editing !== "new" && (
                                <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                                    <p className="text-sm text-gray-600">
                                        Sin variantes todav&iacute;a.
                                    </p>
                                </div>
                            )}

                            <div className="divide-y divide-white/[0.04]">
                                {variants.map((v) =>
                                    editing === v.id ? (
                                        <VariantForm
                                            key={v.id}
                                            initial={v}
                                            onSave={async (input) => {
                                                const res = await updateVariant(v.id, input);
                                                if ("success" in res && res.data) {
                                                    onVariantUpdated(res.data);
                                                    setEditing(null);
                                                }
                                                return res;
                                            }}
                                            onCancel={() => setEditing(null)}
                                        />
                                    ) : (
                                        <VariantRow
                                            key={v.id}
                                            variant={v}
                                            onEdit={() => setEditing(v.id)}
                                            onToggle={() =>
                                                startTransition(async () => {
                                                    const res = await updateVariant(v.id, {
                                                        active: !v.active,
                                                    });
                                                    if ("success" in res && res.data)
                                                        onVariantUpdated(res.data);
                                                })
                                            }
                                            onDelete={() =>
                                                startTransition(async () => {
                                                    const res = await deleteVariant(v.id);
                                                    if ("success" in res) onVariantDeleted(v.id);
                                                })
                                            }
                                        />
                                    ),
                                )}

                                {editing === "new" && (
                                    <VariantForm
                                        onSave={async (input) => {
                                            const res = await createVariant(servicio.id, input);
                                            if ("success" in res && res.data) {
                                                onVariantCreated(res.data);
                                                setEditing(null);
                                            }
                                            return res;
                                        }}
                                        onCancel={() => setEditing(null)}
                                    />
                                )}
                            </div>
                        </div>

                        {/* Footer — botón agregar */}
                        {editing !== "new" && (
                            <div className="border-t border-white/[0.06] px-7 py-4">
                                <button
                                    onClick={() => setEditing("new")}
                                    className="inline-flex items-center gap-2 rounded-xl bg-[#FFD700] px-5 py-2.5 text-xs font-black uppercase tracking-widest text-black transition hover:bg-[#FFD700]/90"
                                >
                                    <Plus className="h-4 w-4" />
                                    Agregar variante
                                </button>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body,
    );
}

// ── Fila de variante ───────────────────────────────────────────────────────

function VariantRow({
    variant,
    onEdit,
    onToggle,
    onDelete,
}: {
    variant: ServiceVariant;
    onEdit: () => void;
    onToggle: () => void;
    onDelete: () => void;
}) {
    const [confirmDelete, setConfirmDelete] = useState(false);

    return (
        <div
            className={`group/v flex items-center gap-4 px-7 py-4 transition-opacity ${
                !variant.active ? "opacity-40 hover:opacity-70" : ""
            }`}
        >
            {/* Dot */}
            <div
                className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                    variant.active ? "bg-emerald-400/70" : "bg-white/15"
                }`}
            />

            {/* Info */}
            <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-white">
                    {variant.name}
                </p>
                {variant.description && (
                    <p className="mt-0.5 truncate text-xs text-gray-600">
                        {variant.description}
                    </p>
                )}
            </div>

            {/* Precio */}
            <span className="shrink-0 text-sm font-bold tabular-nums text-[#FFD700]/70">
                {variant.price !== null ? COP.format(variant.price) : <span className="text-gray-600 text-xs font-normal">Cotizar</span>}
            </span>

            {/* Acciones */}
            {!confirmDelete ? (
                <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover/v:opacity-100">
                    <ActionBtn onClick={onToggle} title={variant.active ? "Desactivar" : "Activar"} gold={variant.active}>
                        <Power className="h-3.5 w-3.5" />
                    </ActionBtn>
                    <ActionBtn onClick={onEdit} title="Editar">
                        <Pencil className="h-3.5 w-3.5" />
                    </ActionBtn>
                    <ActionBtn onClick={() => setConfirmDelete(true)} title="Eliminar" danger>
                        <Trash2 className="h-3.5 w-3.5" />
                    </ActionBtn>
                </div>
            ) : (
                <div className="flex shrink-0 items-center gap-1 rounded-xl border border-red-500/20 bg-red-500/5 px-2 py-1">
                    <button
                        onClick={() => setConfirmDelete(false)}
                        className="flex h-6 w-6 items-center justify-center text-gray-500 transition hover:text-white"
                    >
                        <X className="h-3.5 w-3.5" />
                    </button>
                    <button
                        onClick={onDelete}
                        className="flex h-6 w-6 items-center justify-center text-red-400 transition hover:text-red-300"
                    >
                        <Check className="h-3.5 w-3.5" />
                    </button>
                </div>
            )}
        </div>
    );
}

function ActionBtn({
    children,
    onClick,
    title,
    danger,
    gold,
}: {
    children: React.ReactNode;
    onClick: () => void;
    title: string;
    danger?: boolean;
    gold?: boolean;
}) {
    const cls = danger
        ? "text-gray-600 hover:text-red-400"
        : gold
        ? "text-[#FFD700]/50 hover:text-[#FFD700]"
        : "text-gray-600 hover:text-gray-300";
    return (
        <button
            onClick={onClick}
            title={title}
            className={`flex h-7 w-7 items-center justify-center rounded-lg transition-colors ${cls}`}
        >
            {children}
        </button>
    );
}

// ── Formulario de variante ─────────────────────────────────────────────────

type VariantFormInput = { name: string; price: number | null; description?: string | null };

function VariantForm({
    initial,
    onSave,
    onCancel,
}: {
    initial?: ServiceVariant;
    onSave: (input: VariantFormInput) => Promise<unknown>;
    onCancel: () => void;
}) {
    const [name, setName] = useState(initial?.name ?? "");
    const [price, setPrice] = useState(
        initial?.price != null ? String(initial.price) : "",
    );
    const [description, setDescription] = useState(initial?.description ?? "");
    const [saving, setSaving] = useState(false);

    async function handleSave() {
        if (!name.trim() || saving) return;
        const parsed =
            price.trim() === ""
                ? null
                : Number(price.replace(/\./g, "").replace(/,/g, "."));
        setSaving(true);
        await onSave({
            name: name.trim(),
            price: Number.isFinite(parsed) ? parsed : null,
            description: description.trim() || null,
        });
        setSaving(false);
    }

    const onKey = (e: React.KeyboardEvent) => {
        if (e.key === "Escape") onCancel();
        if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSave(); }
    };

    return (
        <div className="space-y-2.5 bg-white/[0.02] px-7 py-5">
            <div className="flex items-center gap-2.5">
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={onKey}
                    placeholder="Nombre de la variante"
                    autoFocus
                    className="min-w-0 flex-1 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-2.5 text-sm text-white placeholder:text-gray-600 focus:border-[#FFD700]/40 focus:outline-none"
                />
                <input
                    value={price}
                    onChange={(e) => setPrice(e.target.value.replace(/[^0-9.,]/g, ""))}
                    onKeyDown={onKey}
                    placeholder="Precio"
                    inputMode="decimal"
                    className="w-28 shrink-0 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-2.5 text-sm text-white placeholder:text-gray-600 focus:border-[#FFD700]/40 focus:outline-none"
                />
            </div>
            <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onKeyDown={onKey}
                placeholder="Descripción opcional"
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-2.5 text-sm text-white placeholder:text-gray-600 focus:border-[#FFD700]/40 focus:outline-none"
            />
            <div className="flex justify-end gap-2 pt-1">
                <button
                    onClick={onCancel}
                    className="rounded-xl border border-white/[0.06] px-4 py-2 text-xs font-bold uppercase tracking-widest text-gray-500 transition hover:text-white"
                >
                    Cancelar
                </button>
                <button
                    onClick={handleSave}
                    disabled={!name.trim() || saving}
                    className="rounded-xl bg-[#FFD700] px-5 py-2 text-xs font-black uppercase tracking-widest text-black transition hover:bg-[#FFD700]/90 disabled:opacity-40"
                >
                    {saving ? "Guardando…" : initial ? "Guardar" : "Agregar"}
                </button>
            </div>
        </div>
    );
}
