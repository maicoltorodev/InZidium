"use client";

import { Bot, BotOff } from "lucide-react";
import type { ConversationWithContact } from "@/lib/crm/types";

type Props = {
    conversation: ConversationWithContact;
    selected: boolean;
    onClick: () => void;
};

export function ConversationItem({ conversation, selected, onClick }: Props) {
    const { contact, last_message_preview, last_message_role, last_message_at } = conversation;
    const displayName = contact.name?.trim() || contact.phone;
    const initial = displayName.charAt(0).toUpperCase();

    return (
        <button
            onClick={onClick}
            className={`group relative flex w-full items-start gap-3 overflow-hidden rounded-2xl px-3 py-3 text-left transition-all duration-200 ${
                selected
                    ? "bg-gradient-to-r from-[#a855f7]/[0.08] via-[#22d3ee]/[0.04] to-transparent"
                    : "hover:bg-white/[0.025]"
            }`}
        >
            {/* Indicador izquierdo selected */}
            {selected && (
                <div
                    className="absolute inset-y-2 left-0 w-[3px] rounded-r-full"
                    style={{
                        background:
                            "linear-gradient(to bottom, #e879f9, #a855f7, #22d3ee)",
                        boxShadow: "0 0 12px rgba(168,85,247,0.6)",
                    }}
                />
            )}

            {/* Avatar */}
            <div className="relative shrink-0">
                {/* Glow ring cuando seleccionado o hover */}
                <div
                    className={`absolute inset-0 rounded-full blur-md transition-opacity duration-300 ${
                        selected ? "opacity-60" : "opacity-0 group-hover:opacity-30"
                    }`}
                    style={{
                        background: contact.ai_enabled
                            ? "linear-gradient(135deg, #22d3ee, #a855f7)"
                            : "linear-gradient(135deg, #e879f9, #f59e0b)",
                    }}
                />
                <div
                    className={`relative flex h-11 w-11 items-center justify-center rounded-full text-sm font-black transition-transform group-hover:scale-105 ${
                        contact.ai_enabled
                            ? "border border-white/[0.1] bg-white/[0.04] text-gray-100"
                            : "border border-amber-500/30 bg-amber-500/[0.08] text-amber-300"
                    }`}
                    style={{
                        backdropFilter: "blur(8px)",
                    }}
                >
                    {initial}
                </div>

                {/* Status badge */}
                <div
                    className={`absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-[#0a0518] ${
                        contact.ai_enabled
                            ? "bg-gradient-to-br from-[#22d3ee] to-[#a855f7]"
                            : "bg-amber-500"
                    }`}
                    title={contact.ai_enabled ? "IA activa" : "Control manual"}
                >
                    {contact.ai_enabled ? (
                        <Bot className="h-2 w-2 text-white" strokeWidth={3} />
                    ) : (
                        <BotOff className="h-2 w-2 text-[#0a0518]" strokeWidth={3} />
                    )}
                </div>
            </div>

            {/* Contenido */}
            <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2 mb-0.5">
                    <h3
                        className={`truncate text-sm font-bold leading-snug transition-colors ${
                            selected ? "text-white" : "text-gray-200 group-hover:text-white"
                        }`}
                    >
                        {displayName}
                    </h3>
                    {last_message_at && (
                        <span
                            className={`shrink-0 font-mono text-[10px] tabular-nums transition-colors ${
                                selected ? "text-gray-300" : "text-gray-600"
                            }`}
                        >
                            {formatRelativeShort(new Date(last_message_at))}
                        </span>
                    )}
                </div>
                {contact.name && (
                    <p className="truncate font-mono text-[10px] text-gray-600 mb-1">
                        {contact.phone}
                    </p>
                )}
                {last_message_preview && (
                    <p
                        className={`truncate text-xs leading-relaxed ${
                            selected ? "text-gray-300" : "text-gray-500"
                        }`}
                    >
                        {last_message_role && (
                            <span
                                className={`font-semibold mr-1 ${
                                    last_message_role === "ai"
                                        ? "text-[#22d3ee]"
                                        : last_message_role === "human"
                                            ? "text-[#e879f9]"
                                            : "text-gray-600"
                                }`}
                            >
                                {rolePrefix(last_message_role)}
                            </span>
                        )}
                        {last_message_preview}
                    </p>
                )}
            </div>
        </button>
    );
}

function rolePrefix(role: "user" | "ai" | "human" | null): string {
    if (role === "ai") return "Izzy:";
    if (role === "human") return "Tú:";
    return "";
}

function formatRelativeShort(date: Date): string {
    const diff = Date.now() - date.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "ahora";
    if (mins < 60) return `${mins}m`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d`;
    return date.toLocaleDateString("es-CO", { day: "numeric", month: "short" });
}
