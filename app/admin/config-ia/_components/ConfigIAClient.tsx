"use client";

import { useMemo, useState } from "react";
import { Bot, Sparkles, Clock, FileText, Check } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import type { AIConfig } from "@/lib/crm/types";
import { updateAIConfig } from "@/lib/crm/actions/ai-config";

type Props = {
    initialConfig: AIConfig;
};

export function ConfigIAClient({ initialConfig }: Props) {
    const [prompt, setPrompt] = useState(initialConfig.prompt);
    const [persona, setPersona] = useState(initialConfig.persona);
    const [horarios, setHorarios] = useState(initialConfig.horarios);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lastSaved, setLastSaved] = useState<Date | null>(
        initialConfig.updated_at ? new Date(initialConfig.updated_at) : null,
    );
    const [savedBy, setSavedBy] = useState<string | null>(initialConfig.updated_by);

    const dirty = useMemo(
        () =>
            prompt !== initialConfig.prompt ||
            persona !== initialConfig.persona ||
            horarios !== initialConfig.horarios,
        [prompt, persona, horarios, initialConfig],
    );

    async function handleSave() {
        if (!dirty || saving) return;
        setSaving(true);
        setError(null);
        const res = await updateAIConfig({ prompt, persona, horarios });
        setSaving(false);
        if ("error" in res) {
            setError(res.error);
            return;
        }
        if (res.data) {
            setLastSaved(new Date(res.data.updated_at));
            setSavedBy(res.data.updated_by);
            initialConfig.prompt = res.data.prompt;
            initialConfig.persona = res.data.persona;
            initialConfig.horarios = res.data.horarios;
        }
    }

    return (
        <div className="min-h-full px-6 py-8 lg:px-12 lg:py-10">
            {/* Header */}
            <header className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <div className="mb-3 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.03]">
                            <Bot className="h-5 w-5" style={{ color: "#FFD700" }} />
                        </div>
                        <h1 className="text-3xl font-black tracking-tight text-white font-[family-name:var(--font-jost)]">
                            Config IA
                        </h1>
                    </div>
                    <p className="max-w-2xl text-sm leading-relaxed text-gray-400">
                        Identidad y comportamiento del bot de WhatsApp. Los cambios se propagan al motor en tiempo real.
                    </p>
                </div>

                <SaveStatus
                    dirty={dirty}
                    saving={saving}
                    lastSaved={lastSaved}
                    savedBy={savedBy}
                    onSave={handleSave}
                />
            </header>

            <div className="space-y-6">
                <Section
                    icon={FileText}
                    title="Prompt base"
                    description="Instrucciones principales. Qué es, qué hace, qué NO hace. La IA recibe esto como system prompt en cada conversación."
                    value={prompt}
                    onChange={setPrompt}
                    rows={12}
                    placeholder="Eres Izzy, la asistente oficial de InZidium. Atiendes por WhatsApp a estudios y clientes interesados en plataformas web, bots de WhatsApp con IA y soluciones digitales. Respondes breve, claro y en tono cercano. Si no sabes algo, derivas a un humano con la tool handoff_to_human…"
                />

                <Section
                    icon={Sparkles}
                    title="Persona"
                    description="Tono, estilo, modismos. Cómo suena cuando habla."
                    value={persona}
                    onChange={setPersona}
                    rows={6}
                    placeholder="Cercano, colombiano neutro. Usas 'usted' con clientes nuevos y 'tú' si el cliente lo usa primero. Emojis con moderación (solo ✅ y 📎 para confirmaciones/adjuntos). Evitas jerga técnica salvo que pregunten."
                />

                <Section
                    icon={Clock}
                    title="Horarios"
                    description="Cuándo respondes y qué dices fuera de horario."
                    value={horarios}
                    onChange={setHorarios}
                    rows={5}
                    placeholder={`Lun-Vie 9:00–18:00 (hora Colombia).\nSábados 10:00–14:00.\nFuera de horario: respondes con un mensaje automático avisando que te contestan al siguiente día hábil.`}
                />
            </div>

            {error && (
                <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/5 px-5 py-4">
                    <p className="text-xs font-bold uppercase tracking-widest text-red-400">
                        {error}
                    </p>
                </div>
            )}

            {/* Botón guardar sticky en mobile */}
            <div className="sticky bottom-6 mt-8 flex justify-end lg:hidden">
                <SaveButton dirty={dirty} saving={saving} onSave={handleSave} />
            </div>
        </div>
    );
}

type SectionProps = {
    icon: typeof FileText;
    title: string;
    description: string;
    value: string;
    onChange: (v: string) => void;
    rows: number;
    placeholder: string;
};

function Section({
    icon: Icon,
    title,
    description,
    value,
    onChange,
    rows,
    placeholder,
}: SectionProps) {
    return (
        <section className="overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02]">
            <div className="border-b border-white/[0.06] px-6 py-4">
                <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4" style={{ color: "#FFD700" }} />
                    <h2 className="text-base font-bold tracking-tight text-white">
                        {title}
                    </h2>
                    <span className="ml-auto font-mono text-[10px] font-medium text-gray-600">
                        {value.length} chars
                    </span>
                </div>
                <p className="mt-1.5 pl-7 text-sm leading-relaxed text-gray-500">
                    {description}
                </p>
            </div>
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                rows={rows}
                placeholder={placeholder}
                className="block w-full resize-y bg-transparent px-6 py-5 font-mono text-sm leading-relaxed text-white placeholder:text-gray-700 focus:outline-none"
            />
        </section>
    );
}

type SaveStatusProps = {
    dirty: boolean;
    saving: boolean;
    lastSaved: Date | null;
    savedBy: string | null;
    onSave: () => void;
};

function SaveStatus({
    dirty,
    saving,
    lastSaved,
    savedBy,
    onSave,
}: SaveStatusProps) {
    return (
        <div className="hidden items-center gap-4 lg:flex">
            <div className="text-right">
                <AnimatePresence mode="wait">
                    {dirty ? (
                        <motion.div
                            key="dirty"
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 4 }}
                            className="flex items-center justify-end gap-2"
                        >
                            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#FFD700]" />
                            <span className="text-xs font-bold uppercase tracking-widest text-[#FFD700]">
                                Cambios sin guardar
                            </span>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="clean"
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 4 }}
                            className="flex items-center justify-end gap-2"
                        >
                            <Check className="h-3 w-3" style={{ color: "#FFD700" }} />
                            <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
                                Sincronizado
                            </span>
                        </motion.div>
                    )}
                </AnimatePresence>
                {lastSaved && (
                    <p className="mt-1 text-xs text-gray-600">
                        Última edición {formatRelative(lastSaved)}
                        {savedBy && <> · <span className="text-gray-500">{savedBy}</span></>}
                    </p>
                )}
            </div>
            <SaveButton dirty={dirty} saving={saving} onSave={onSave} />
        </div>
    );
}

function SaveButton({
    dirty,
    saving,
    onSave,
}: {
    dirty: boolean;
    saving: boolean;
    onSave: () => void;
}) {
    return (
        <button
            onClick={onSave}
            disabled={!dirty || saving}
            className="rounded-xl bg-[#FFD700] px-6 py-2.5 text-xs font-black uppercase tracking-widest text-black transition hover:bg-[#FFD700]/90 disabled:cursor-not-allowed disabled:opacity-40"
        >
            {saving ? "Guardando…" : dirty ? "Guardar cambios" : "Guardado"}
        </button>
    );
}

function formatRelative(date: Date): string {
    const diff = Date.now() - date.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "hace instantes";
    if (mins < 60) return `hace ${mins} min`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `hace ${hours} h`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `hace ${days} d`;
    return date.toLocaleDateString("es-CO", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}
