"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Sparkles, Loader2 } from "lucide-react";
import type { Contact, OrderItem, OrderWithContact } from "@/lib/crm/types";
import { createOrder } from "@/lib/crm/actions/pedidos";
import { ContactPicker } from "./ContactPicker";
import { ItemEditor } from "./ItemEditor";

type Props = {
    open: boolean;
    onClose: () => void;
    onCreated: (order: OrderWithContact) => void;
};

export function CreateOrderModal({ open, onClose, onCreated }: Props) {
    const [contact, setContact] = useState<Contact | null>(null);
    const [items, setItems] = useState<OrderItem[]>([{ name: "", quantity: 1, price: 0 }]);
    const [notes, setNotes] = useState("");
    const [totalOverride, setTotalOverride] = useState<string>("");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!open) return;
        setContact(null);
        setItems([{ name: "", quantity: 1, price: 0 }]);
        setNotes("");
        setTotalOverride("");
        setError(null);
    }, [open]);

    const computedTotal = items.reduce(
        (sum, it) => sum + (it.quantity ?? 1) * (it.price ?? 0),
        0,
    );
    const finalTotal = totalOverride.trim() === "" ? computedTotal : Number(totalOverride);

    async function handleCreate() {
        if (saving) return;
        setError(null);
        if (!contact) {
            setError("Selecciona un contacto.");
            return;
        }
        const cleanItems = items.filter((it) => it.name?.trim());
        if (cleanItems.length === 0) {
            setError("Agrega al menos un ítem con nombre.");
            return;
        }
        setSaving(true);
        const res = await createOrder({
            contactId: contact.id,
            items: cleanItems,
            total: finalTotal || null,
            notes: notes || null,
        });
        setSaving(false);
        if ("error" in res) {
            setError(res.error);
            return;
        }
        if (res.data) onCreated(res.data);
        onClose();
    }

    if (!mounted || !open) return null;

    return createPortal(
        <AnimatePresence>
            <div className="fixed inset-0 z-[9000] flex items-center justify-center p-4">
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
                    className="relative z-10 flex w-full max-w-xl max-h-[90vh] flex-col overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0a0a0a]/95 shadow-2xl"
                >
                    <Header onClose={onClose} />

                    <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
                        <Section label="Cliente" icon={<Sparkles className="h-3 w-3 text-[#FFD700]" />}>
                            <ContactPicker selected={contact} onSelect={setContact} />
                        </Section>

                        <Section label="Ítems" icon={<Sparkles className="h-3 w-3 text-[#FFD700]" />}>
                            <ItemEditor items={items} onChange={setItems} />
                        </Section>

                        <Section label="Total" icon={<Sparkles className="h-3 w-3 text-[#FFD700]" />}>
                            <div className="flex items-center gap-3">
                                <input
                                    type="number"
                                    min={0}
                                    step={1000}
                                    value={totalOverride}
                                    onChange={(e) => setTotalOverride(e.target.value)}
                                    placeholder={String(computedTotal)}
                                    className="flex-1 rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2 text-sm text-white placeholder:text-gray-600 focus:border-[#FFD700]/40 focus:outline-none"
                                />
                                <span className="font-mono text-[10px] uppercase tracking-widest text-gray-500">
                                    Auto: ${computedTotal.toLocaleString("es-CO")}
                                </span>
                            </div>
                        </Section>

                        <Section label="Notas" icon={<Sparkles className="h-3 w-3 text-[#FFD700]" />}>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                rows={3}
                                placeholder="Notas internas (entrega, urgencia, requisitos especiales…)"
                                className="w-full resize-none rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2 text-sm text-white placeholder:text-gray-600 focus:border-[#FFD700]/40 focus:outline-none"
                            />
                        </Section>

                        {error && (
                            <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
                                {error}
                            </p>
                        )}
                    </div>

                    <Footer
                        saving={saving}
                        canSave={!!contact && items.some((it) => it.name?.trim())}
                        onCancel={onClose}
                        onCreate={handleCreate}
                    />
                </motion.div>
            </div>
        </AnimatePresence>,
        document.body,
    );
}

function Header({ onClose }: { onClose: () => void }) {
    return (
        <div className="flex items-center justify-between border-b border-white/[0.05] px-6 py-4">
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03]">
                    <ShoppingBag className="h-5 w-5 text-[#FFD700]" />
                </div>
                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 font-[family-name:var(--font-orbitron)]">
                        Nuevo
                    </p>
                    <h2 className="text-lg font-black text-white">Crear pedido</h2>
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
    );
}

function Section({
    label,
    icon,
    children,
}: {
    label: string;
    icon: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <div>
            <div className="mb-2 flex items-center gap-2">
                {icon}
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-500">
                    {label}
                </span>
            </div>
            {children}
        </div>
    );
}

function Footer({
    saving,
    canSave,
    onCancel,
    onCreate,
}: {
    saving: boolean;
    canSave: boolean;
    onCancel: () => void;
    onCreate: () => void;
}) {
    return (
        <div className="flex items-center justify-end gap-2 border-t border-white/[0.05] px-6 py-4">
            <button
                onClick={onCancel}
                disabled={saving}
                className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-2 text-xs font-bold uppercase tracking-widest text-gray-400 transition hover:bg-white/[0.06] hover:text-white disabled:opacity-40"
            >
                Cancelar
            </button>
            <button
                onClick={onCreate}
                disabled={!canSave || saving}
                className="relative inline-flex items-center gap-2 overflow-hidden rounded-xl px-5 py-2 text-xs font-black uppercase tracking-widest text-black transition disabled:cursor-not-allowed disabled:opacity-40"
                style={{
                    background: "linear-gradient(135deg, #FFD700, #ffffff, #FFD700)",
                }}
            >
                {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Crear"}
            </button>
        </div>
    );
}
