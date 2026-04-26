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
            className={`group relative flex w-full items-start gap-3.5 overflow-hidden px-4 py-4 text-left transition-all duration-150 ${
                selected
                    ? "bg-[#FFD700]/[0.07] border-y border-[#FFD700]/20"
                    : "border-y border-transparent hover:bg-white/[0.03]"
            }`}
        >
            {selected && (
                <div className="absolute inset-y-0 right-0 w-[2px] bg-[#FFD700]" />
            )}

            {/* Avatar */}
            <div className="relative shrink-0">
                <div
                    className={`flex h-11 w-11 items-center justify-center rounded-full text-sm font-black ${
                        contact.ai_enabled
                            ? "bg-white/[0.05] border border-white/[0.08] text-gray-300"
                            : "bg-[#FFD700]/10 border border-[#FFD700]/25 text-[#FFD700]"
                    }`}
                >
                    {initial}
                </div>
                <div
                    className={`absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full border-2 ${
                        selected ? "border-[#0a0a0a]" : "border-[#0a0a0a]"
                    } ${contact.ai_enabled ? "bg-[#FFD700]" : "bg-amber-500"}`}
                >
                    {contact.ai_enabled
                        ? <Bot className="h-2 w-2 text-black" />
                        : <BotOff className="h-2 w-2 text-black" />
                    }
                </div>
            </div>

            {/* Contenido */}
            <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2 mb-0.5">
                    <h3 className={`truncate text-sm font-bold leading-snug ${selected ? "text-white" : "text-gray-200"}`}>
                        {displayName}
                    </h3>
                    {last_message_at && (
                        <span className="shrink-0 font-mono text-xs text-gray-600">
                            {formatRelativeShort(new Date(last_message_at))}
                        </span>
                    )}
                </div>
                {contact.name && (
                    <p className="truncate font-mono text-xs text-gray-600 mb-1">{contact.phone}</p>
                )}
                {last_message_preview && (
                    <p className={`truncate text-sm leading-relaxed ${selected ? "text-gray-400" : "text-gray-500"}`}>
                        <span className={`font-semibold ${last_message_role === "ai" ? "text-[#FFD700]/70" : last_message_role === "human" ? "text-gray-400" : ""}`}>
                            {rolePrefix(last_message_role)}
                        </span>
                        {last_message_preview}
                    </p>
                )}
            </div>
        </button>
    );
}

function rolePrefix(role: "user" | "ai" | "human" | null): string {
    if (role === "ai") return "IA: ";
    if (role === "human") return "Tú: ";
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
