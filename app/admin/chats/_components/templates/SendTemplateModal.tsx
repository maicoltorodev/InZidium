"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, FileCode2, Loader2, Sparkles } from "lucide-react";
import {
    listTemplates,
    sendTemplate,
    type WhatsAppTemplate,
} from "@/lib/crm/actions/templates";
import type { Message } from "@/lib/crm/types";
import { TemplatePicker } from "./TemplatePicker";
import { TemplateParameters } from "./TemplateParameters";
import { renderFullTemplate, countTemplateParams } from "./renderTemplate";

type Props = {
    open: boolean;
    onClose: () => void;
    conversationId: string;
    onSent?: (msg: Message) => void;
};

export function SendTemplateModal({ open, onClose, conversationId, onSent }: Props) {
    const [mounted, setMounted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [templates, setTemplates] = useState<WhatsAppTemplate[]>([]);
    const [selected, setSelected] = useState<WhatsAppTemplate | null>(null);
    const [params, setParams] = useState<string[]>([]);

    useEffect(() => setMounted(true), []);

    useEffect(() => {
        if (!open) return;
        setError(null);
        setSelected(null);
        setParams([]);
        setLoading(true);
        listTemplates().then((data) => {
            setTemplates(data);
            setLoading(false);
        });
    }, [open]);

    function handleSelect(t: WhatsAppTemplate) {
        setSelected(t);
        setParams(new Array(countTemplateParams(t)).fill(""));
    }

    async function handleSend() {
        if (!selected || sending) return;
        setError(null);
        const total = countTemplateParams(selected);
        if (total > 0 && params.some((p) => !p?.trim())) {
            setError("Completa todos los parámetros.");
            return;
        }
        setSending(true);
        const renderedText = renderFullTemplate(selected, params);
        const res = await sendTemplate({
            conversationId,
            templateName: selected.name,
            language: selected.language,
            parameters: params,
            renderedText,
        });
        setSending(false);
        if ("error" in res) {
            setError(res.error);
            return;
        }
        if (res.data && onSent) onSent(res.data);
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
                    className="relative z-10 flex w-full max-w-lg max-h-[90vh] flex-col overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0a0a0a]/95 shadow-2xl"
                >
                    <ModalHeader onClose={onClose} />

                    <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
                        <Section label="Plantilla" icon={<Sparkles className="h-3 w-3 text-[#22d3ee]" />}>
                            {loading ? (
                                <div className="flex items-center justify-center py-6">
                                    <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
                                </div>
                            ) : (
                                <TemplatePicker
                                    templates={templates}
                                    selected={selected}
                                    onSelect={handleSelect}
                                />
                            )}
                        </Section>

                        {selected && (
                            <>
                                <Section
                                    label="Parámetros"
                                    icon={<Sparkles className="h-3 w-3 text-[#22d3ee]" />}
                                >
                                    <TemplateParameters
                                        template={selected}
                                        params={params}
                                        onChange={setParams}
                                    />
                                </Section>

                                <Section
                                    label="Preview"
                                    icon={<Sparkles className="h-3 w-3 text-[#22d3ee]" />}
                                >
                                    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                                        <p className="whitespace-pre-wrap text-sm text-gray-200">
                                            {renderFullTemplate(selected, params)}
                                        </p>
                                    </div>
                                </Section>
                            </>
                        )}

                        {error && (
                            <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
                                {error}
                            </p>
                        )}
                    </div>

                    <ModalFooter
                        sending={sending}
                        canSend={!!selected && !sending}
                        onCancel={onClose}
                        onSend={handleSend}
                    />
                </motion.div>
            </div>
        </AnimatePresence>,
        document.body,
    );
}

function ModalHeader({ onClose }: { onClose: () => void }) {
    return (
        <div className="flex items-center justify-between border-b border-white/[0.05] px-6 py-4">
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03]">
                    <FileCode2 className="h-5 w-5 text-[#22d3ee]" />
                </div>
                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 font-[family-name:var(--font-orbitron)]">
                        WhatsApp
                    </p>
                    <h2 className="text-lg font-black text-white">Enviar plantilla</h2>
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

function ModalFooter({
    sending,
    canSend,
    onCancel,
    onSend,
}: {
    sending: boolean;
    canSend: boolean;
    onCancel: () => void;
    onSend: () => void;
}) {
    return (
        <div className="flex items-center justify-end gap-2 border-t border-white/[0.05] px-6 py-4">
            <button
                onClick={onCancel}
                disabled={sending}
                className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-2 text-xs font-bold uppercase tracking-widest text-gray-400 transition hover:bg-white/[0.06] hover:text-white disabled:opacity-40"
            >
                Cancelar
            </button>
            <button
                onClick={onSend}
                disabled={!canSend}
                className="relative inline-flex items-center gap-2 overflow-hidden rounded-xl px-5 py-2 text-xs font-black uppercase tracking-widest text-black transition disabled:cursor-not-allowed disabled:opacity-40"
                style={{ background: "linear-gradient(135deg, #22d3ee, #ffffff, #22d3ee)" }}
            >
                {sending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Enviar"}
            </button>
        </div>
    );
}
