"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X, Plus, Trash2, Loader2, Check } from "lucide-react";
import type { Servicio, ServiceFaq } from "@/lib/crm/types";
import {
    listServiceFaqs,
    createServiceFaq,
    updateServiceFaq,
    deleteServiceFaq,
} from "@/lib/crm/actions/servicios";

type Props = {
    open: boolean;
    servicio: Servicio | null;
    onClose: () => void;
};

export function FaqsModal({ open, servicio, onClose }: Props) {
    const [mounted, setMounted] = useState(false);
    const [faqs, setFaqs] = useState<ServiceFaq[]>([]);
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState<string | "new" | null>(null);
    const [draft, setDraft] = useState({ question: "", answer: "" });
    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => setMounted(true), []);

    useEffect(() => {
        if (!open || !servicio) return;
        setLoading(true);
        listServiceFaqs(servicio.id)
            .then(setFaqs)
            .finally(() => setLoading(false));
        setEditingId(null);
        setDraft({ question: "", answer: "" });
        setError(null);
    }, [open, servicio?.id]);

    function startEdit(faq: ServiceFaq) {
        setEditingId(faq.id);
        setDraft({ question: faq.question, answer: faq.answer });
        setError(null);
    }

    function startNew() {
        setEditingId("new");
        setDraft({ question: "", answer: "" });
        setError(null);
    }

    function cancelEdit() {
        setEditingId(null);
        setDraft({ question: "", answer: "" });
        setError(null);
    }

    async function save() {
        if (!servicio) return;
        if (!draft.question.trim() || !draft.answer.trim()) {
            setError("PREGUNTA Y RESPUESTA SON OBLIGATORIAS.");
            return;
        }
        setSaving(true);
        setError(null);
        if (editingId === "new") {
            const res = await createServiceFaq(servicio.id, draft);
            if ("error" in res) setError(res.error);
            else if (res.data) {
                setFaqs((prev) => [...prev, res.data!]);
                cancelEdit();
            }
        } else if (editingId) {
            const res = await updateServiceFaq(editingId, draft);
            if ("error" in res) setError(res.error);
            else if (res.data) {
                setFaqs((prev) => prev.map((f) => (f.id === res.data!.id ? res.data! : f)));
                cancelEdit();
            }
        }
        setSaving(false);
    }

    async function remove(id: string) {
        if (!confirm("¿Eliminar esta FAQ?")) return;
        const res = await deleteServiceFaq(id);
        if ("success" in res) setFaqs((prev) => prev.filter((f) => f.id !== id));
    }

    if (!mounted) return null;

    return createPortal(
        <AnimatePresence>
            {open && servicio && (
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
                        className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/[0.08] bg-[#080808] shadow-2xl"
                    >
                        <div className="flex items-center justify-between border-b border-white/[0.06] px-8 py-6">
                            <div>
                                <h2 className="text-xl font-black tracking-tight text-white">FAQs</h2>
                                <p className="mt-0.5 text-xs text-gray-500">
                                    {servicio.name} — preguntas frecuentes para SEO y la IA
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.03] text-gray-400 transition hover:border-white/[0.12] hover:text-white"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="space-y-4 px-8 py-6">
                            {loading ? (
                                <div className="flex justify-center py-12">
                                    <Loader2 className="h-6 w-6 animate-spin text-[#FFD700]" />
                                </div>
                            ) : (
                                <>
                                    {faqs.length === 0 && editingId !== "new" && (
                                        <div className="rounded-xl border border-dashed border-white/[0.08] bg-white/[0.02] py-10 text-center">
                                            <p className="mb-2 text-sm text-gray-500">Sin FAQs todavía</p>
                                            <p className="text-xs text-gray-600">
                                                Agregá preguntas frecuentes para mejorar el SEO con FAQ rich snippets.
                                            </p>
                                        </div>
                                    )}

                                    <div className="space-y-3">
                                        {faqs.map((faq) =>
                                            editingId === faq.id ? (
                                                <FaqEditor
                                                    key={faq.id}
                                                    draft={draft}
                                                    setDraft={setDraft}
                                                    onSave={save}
                                                    onCancel={cancelEdit}
                                                    saving={saving}
                                                />
                                            ) : (
                                                <div
                                                    key={faq.id}
                                                    className="group rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition hover:border-white/[0.12]"
                                                >
                                                    <div className="flex items-start justify-between gap-4">
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="text-sm font-black text-white mb-1">{faq.question}</h4>
                                                            <p className="text-xs text-gray-500 line-clamp-2 whitespace-pre-line">
                                                                {faq.answer}
                                                            </p>
                                                        </div>
                                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                                            <button
                                                                onClick={() => startEdit(faq)}
                                                                className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-[#FFD700] px-2 py-1"
                                                            >
                                                                Editar
                                                            </button>
                                                            <button
                                                                onClick={() => remove(faq.id)}
                                                                className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-500 hover:bg-red-500/10 hover:text-red-400"
                                                            >
                                                                <Trash2 className="h-3.5 w-3.5" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ),
                                        )}
                                    </div>

                                    {editingId === "new" && (
                                        <FaqEditor
                                            draft={draft}
                                            setDraft={setDraft}
                                            onSave={save}
                                            onCancel={cancelEdit}
                                            saving={saving}
                                        />
                                    )}

                                    {editingId === null && (
                                        <button
                                            onClick={startNew}
                                            className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-white/[0.08] bg-white/[0.02] py-4 text-xs font-black uppercase tracking-widest text-gray-500 transition hover:border-[#FFD700]/30 hover:text-[#FFD700]"
                                        >
                                            <Plus className="h-3.5 w-3.5" />
                                            Agregar FAQ
                                        </button>
                                    )}

                                    {error && (
                                        <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3">
                                            <p className="text-xs font-bold uppercase tracking-widest text-red-400">{error}</p>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body,
    );
}

function FaqEditor({
    draft,
    setDraft,
    onSave,
    onCancel,
    saving,
}: {
    draft: { question: string; answer: string };
    setDraft: (d: { question: string; answer: string }) => void;
    onSave: () => void;
    onCancel: () => void;
    saving: boolean;
}) {
    return (
        <div className="rounded-xl border border-[#FFD700]/30 bg-[#FFD700]/[0.03] p-4 space-y-3">
            <input
                value={draft.question}
                onChange={(e) => setDraft({ ...draft, question: e.target.value })}
                placeholder="Pregunta (Ej: ¿Cuánto demora la entrega?)"
                className="w-full rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2 text-sm font-black text-white placeholder:text-gray-600 focus:border-[#FFD700]/40 focus:outline-none"
                autoFocus
            />
            <textarea
                value={draft.answer}
                onChange={(e) => setDraft({ ...draft, answer: e.target.value })}
                rows={4}
                placeholder="Respuesta detallada. Acepta saltos de línea."
                className="w-full resize-none rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2 text-sm text-gray-300 placeholder:text-gray-600 focus:border-[#FFD700]/40 focus:outline-none"
            />
            <div className="flex justify-end gap-2">
                <button
                    onClick={onCancel}
                    disabled={saving}
                    className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white disabled:opacity-50"
                >
                    Cancelar
                </button>
                <button
                    onClick={onSave}
                    disabled={saving}
                    className="flex items-center gap-1.5 rounded-lg bg-[#FFD700] px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-black hover:bg-[#FFD700]/90 disabled:opacity-50"
                >
                    {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
                    Guardar
                </button>
            </div>
        </div>
    );
}
