"use client";

import { Phone, Bot, BotOff, Tag, FileText, Calendar, User, Hash } from "lucide-react";
import type { ConversationWithContact } from "@/lib/crm/types";

type Props = {
    conversation: ConversationWithContact;
};

export function ContactProfile({ conversation }: Props) {
    const { contact } = conversation;
    const displayName = contact.name?.trim() || contact.phone;
    const prefEntries = Object.entries(contact.preferences ?? {}).filter(
        ([, v]) => v !== null && v !== undefined && v !== "",
    );

    return (
        <div className="flex h-full flex-col">
            {/* Header de la columna */}
            <div className="shrink-0 border-b border-white/[0.06] px-5 py-5">
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-600">
                    Perfil del cliente
                </p>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                {/* Avatar + nombre */}
                <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] px-4 py-5 text-center">
                    <div
                        className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full text-lg font-black ${
                            contact.ai_enabled
                                ? "border border-white/[0.08] bg-white/[0.04] text-gray-300"
                                : "border border-[#FFD700]/25 bg-[#FFD700]/10 text-[#FFD700]"
                        }`}
                    >
                        {displayName.charAt(0).toUpperCase()}
                    </div>
                    <h3 className="text-sm font-bold text-white leading-snug">{displayName}</h3>
                    {contact.name && (
                        <p className="mt-1 font-mono text-xs text-gray-500">{contact.phone}</p>
                    )}
                    <div
                        className={`mt-3 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${
                            contact.ai_enabled
                                ? "border-[#FFD700]/20 bg-[#FFD700]/[0.07] text-[#FFD700]"
                                : "border-amber-500/20 bg-amber-500/[0.07] text-amber-400"
                        }`}
                    >
                        {contact.ai_enabled
                            ? <Bot className="h-3 w-3" />
                            : <BotOff className="h-3 w-3" />
                        }
                        {contact.ai_enabled ? "IA activa" : "Control manual"}
                    </div>
                </div>

                {/* Etiquetas */}
                {contact.tags && contact.tags.length > 0 && (
                    <Section icon={Tag} label="Etiquetas">
                        <div className="flex flex-wrap gap-1.5">
                            {contact.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-xs text-gray-400"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </Section>
                )}

                {/* Preferencias guardadas por la IA */}
                {prefEntries.length > 0 && (
                    <Section icon={User} label="Datos recopilados">
                        <div className="space-y-2.5">
                            {prefEntries.map(([key, value]) => (
                                <div key={key} className="flex items-start justify-between gap-3">
                                    <span className="text-xs text-gray-600 shrink-0">
                                        {formatKey(key)}
                                    </span>
                                    <span className="text-right text-xs font-medium text-gray-300 break-all">
                                        {String(value)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </Section>
                )}

                {/* Notas */}
                {contact.notes && (
                    <Section icon={FileText} label="Notas">
                        <p className="text-xs leading-relaxed text-gray-400 whitespace-pre-wrap">
                            {contact.notes}
                        </p>
                    </Section>
                )}

                {/* Info de la conversación */}
                <Section icon={Hash} label="Conversación">
                    <div className="space-y-2.5">
                        <Row label="Estado">
                            <span
                                className={`text-xs font-bold ${
                                    conversation.status === "open"
                                        ? "text-emerald-400"
                                        : conversation.status === "closed"
                                            ? "text-gray-500"
                                            : "text-amber-400"
                                }`}
                            >
                                {conversation.status === "open"
                                    ? "Abierta"
                                    : conversation.status === "closed"
                                        ? "Cerrada"
                                        : "Archivada"}
                            </span>
                        </Row>
                        <Row label="Inicio">
                            <span className="text-xs text-gray-400">
                                {formatDate(new Date(conversation.created_at))}
                            </span>
                        </Row>
                        {conversation.assigned_to && (
                            <Row label="Asignado a">
                                <span className="text-xs font-medium text-gray-300">
                                    {conversation.assigned_to}
                                </span>
                            </Row>
                        )}
                    </div>
                </Section>

                {/* Cliente desde */}
                <Section icon={Calendar} label="Cliente desde">
                    <p className="text-xs text-gray-400">
                        {formatDate(new Date(contact.created_at))}
                    </p>
                </Section>
            </div>
        </div>
    );
}

function Section({
    icon: Icon,
    label,
    children,
}: {
    icon: typeof Tag;
    label: string;
    children: React.ReactNode;
}) {
    return (
        <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] px-4 py-3.5">
            <div className="mb-3 flex items-center gap-2">
                <Icon className="h-3.5 w-3.5 shrink-0" style={{ color: "#FFD700" }} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
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
            <span className="text-xs text-gray-600 shrink-0">{label}</span>
            {children}
        </div>
    );
}

function formatKey(key: string): string {
    return key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatDate(date: Date): string {
    return date.toLocaleDateString("es-CO", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}
