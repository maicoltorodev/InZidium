"use client";

import { Phone, Bot, BotOff, Tag, FileText, Calendar, User, Hash, Sparkles } from "lucide-react";
import type { ConversationWithContact } from "@/lib/crm/types";

type Props = {
    conversation: ConversationWithContact;
};

export function ContactProfile({ conversation }: Props) {
    const { contact } = conversation;
    const displayName = contact.name?.trim() || contact.phone;
    const initial = displayName.charAt(0).toUpperCase();
    const prefEntries = Object.entries(contact.preferences ?? {}).filter(
        ([, v]) => v !== null && v !== undefined && v !== "",
    );

    return (
        <div className="flex h-full flex-col">
            {/* Header de columna */}
            <div className="shrink-0 border-b border-white/[0.05] px-5 py-5">
                <div className="flex items-center gap-2.5">
                    <div
                        className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/[0.08]"
                        style={{
                            background:
                                "linear-gradient(135deg, rgba(232,121,249,0.12), rgba(34,211,238,0.12))",
                        }}
                    >
                        <User className="h-4 w-4 text-white" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 font-[family-name:var(--font-orbitron)]">
                            Profile
                        </p>
                        <p className="text-sm font-bold text-white leading-tight">
                            Cliente
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                {/* Avatar + nombre */}
                <div
                    className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] px-4 py-6 text-center"
                    style={{ backdropFilter: "blur(8px)" }}
                >
                    {/* Glow ambient */}
                    <div
                        className="pointer-events-none absolute -top-12 left-1/2 h-24 w-32 -translate-x-1/2 rounded-full blur-2xl opacity-40"
                        style={{
                            background: contact.ai_enabled
                                ? "radial-gradient(circle, #22d3ee, transparent)"
                                : "radial-gradient(circle, #f59e0b, transparent)",
                        }}
                    />

                    <div className="relative">
                        {/* Avatar con glow */}
                        <div className="relative mx-auto mb-4 h-16 w-16">
                            <div
                                className="absolute inset-0 rounded-full blur-md opacity-60"
                                style={{
                                    background: contact.ai_enabled
                                        ? "linear-gradient(135deg, #22d3ee, #a855f7)"
                                        : "linear-gradient(135deg, #e879f9, #f59e0b)",
                                }}
                            />
                            <div
                                className={`relative flex h-full w-full items-center justify-center rounded-full text-xl font-black ${
                                    contact.ai_enabled
                                        ? "border border-white/[0.12] bg-white/[0.06] text-white"
                                        : "border border-amber-500/30 bg-amber-500/[0.1] text-amber-300"
                                }`}
                                style={{ backdropFilter: "blur(8px)" }}
                            >
                                {initial}
                            </div>
                        </div>

                        <h3 className="text-sm font-bold text-white leading-snug truncate px-2">
                            {displayName}
                        </h3>
                        {contact.name && (
                            <p className="mt-1 font-mono text-[10px] text-gray-500">
                                {contact.phone}
                            </p>
                        )}

                        {/* Status badge */}
                        <div
                            className="mt-4 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.15em]"
                            style={
                                contact.ai_enabled
                                    ? {
                                          borderColor: "rgba(34,211,238,0.3)",
                                          background:
                                              "linear-gradient(135deg, rgba(34,211,238,0.08), rgba(168,85,247,0.08))",
                                          color: "#22d3ee",
                                      }
                                    : {
                                          borderColor: "rgba(245,158,11,0.3)",
                                          background: "rgba(245,158,11,0.08)",
                                          color: "#fbbf24",
                                      }
                            }
                        >
                            {contact.ai_enabled ? (
                                <Bot className="h-3 w-3" />
                            ) : (
                                <BotOff className="h-3 w-3" />
                            )}
                            {contact.ai_enabled ? "IA activa" : "Manual"}
                        </div>
                    </div>
                </div>

                {/* Etiquetas */}
                {contact.tags && contact.tags.length > 0 && (
                    <Section icon={Tag} label="Etiquetas" accent="#e879f9">
                        <div className="flex flex-wrap gap-1.5">
                            {contact.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-[10px] font-medium text-gray-300"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </Section>
                )}

                {/* Preferencias guardadas por la IA */}
                {prefEntries.length > 0 && (
                    <Section icon={Sparkles} label="Datos de Izzy" accent="#22d3ee">
                        <div className="space-y-2.5">
                            {prefEntries.map(([key, value]) => (
                                <div
                                    key={key}
                                    className="flex items-start justify-between gap-3"
                                >
                                    <span className="text-[10px] uppercase tracking-wider text-gray-600 shrink-0 font-bold">
                                        {formatKey(key)}
                                    </span>
                                    <span className="text-right text-xs font-medium text-gray-200 break-all">
                                        {String(value)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </Section>
                )}

                {/* Notas */}
                {contact.notes && (
                    <Section icon={FileText} label="Notas" accent="#a855f7">
                        <p className="text-xs leading-relaxed text-gray-400 whitespace-pre-wrap">
                            {contact.notes}
                        </p>
                    </Section>
                )}

                {/* Info de la conversación */}
                <Section icon={Hash} label="Conversación" accent="#22d3ee">
                    <div className="space-y-2.5">
                        <Row label="Estado">
                            <StatusPill status={conversation.status} />
                        </Row>
                        <Row label="Inicio">
                            <span className="text-xs text-gray-300">
                                {formatDate(new Date(conversation.created_at))}
                            </span>
                        </Row>
                        {conversation.assigned_to && (
                            <Row label="Asignado a">
                                <span className="text-xs font-medium text-gray-200">
                                    {conversation.assigned_to}
                                </span>
                            </Row>
                        )}
                    </div>
                </Section>

                {/* Cliente desde */}
                <Section icon={Calendar} label="Cliente desde" accent="#e879f9">
                    <div className="flex items-center gap-2">
                        <Phone className="h-3 w-3 text-gray-600" />
                        <p className="text-xs text-gray-300">
                            {formatDate(new Date(contact.created_at))}
                        </p>
                    </div>
                </Section>
            </div>
        </div>
    );
}

function Section({
    icon: Icon,
    label,
    accent,
    children,
}: {
    icon: typeof Tag;
    label: string;
    accent: string;
    children: React.ReactNode;
}) {
    return (
        <div
            className="rounded-2xl border border-white/[0.06] bg-white/[0.02] px-4 py-3.5"
            style={{ backdropFilter: "blur(8px)" }}
        >
            <div className="mb-3 flex items-center gap-2">
                <div
                    className="flex h-6 w-6 items-center justify-center rounded-lg border border-white/[0.06]"
                    style={{
                        background: `linear-gradient(135deg, ${accent}1A, transparent)`,
                    }}
                >
                    <Icon className="h-3 w-3" style={{ color: accent }} />
                </div>
                <span className="text-[9px] font-black uppercase tracking-[0.25em] text-gray-500 font-[family-name:var(--font-orbitron)]">
                    {label}
                </span>
            </div>
            {children}
        </div>
    );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="flex items-center justify-between gap-3">
            <span className="text-[10px] uppercase tracking-wider text-gray-600 shrink-0 font-bold">
                {label}
            </span>
            {children}
        </div>
    );
}

function StatusPill({ status }: { status: "open" | "closed" | "archived" }) {
    const cfg = {
        open: { color: "#34d399", label: "Abierta" },
        closed: { color: "#94a3b8", label: "Cerrada" },
        archived: { color: "#fbbf24", label: "Archivada" },
    }[status];
    return (
        <span
            className="inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-black uppercase tracking-widest"
            style={{
                borderColor: `${cfg.color}40`,
                background: `${cfg.color}15`,
                color: cfg.color,
            }}
        >
            <span
                className="h-1 w-1 rounded-full"
                style={{ background: cfg.color }}
            />
            {cfg.label}
        </span>
    );
}

function formatKey(key: string): string {
    return key.replace(/_/g, " ");
}

function formatDate(date: Date): string {
    return date.toLocaleDateString("es-CO", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}
