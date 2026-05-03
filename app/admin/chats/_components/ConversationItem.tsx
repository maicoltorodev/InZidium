"use client";

import { Bot, BotOff } from "lucide-react";
import type { ConversationWithContact } from "@/lib/crm/types";
import { UnreadBadge } from "./list/UnreadBadge";
import { TypingDots } from "./list/TypingDots";
import type { TypingState } from "./typing/useGlobalTyping";

type Props = {
    conversation: ConversationWithContact;
    selected: boolean;
    onClick: () => void;
    typing?: TypingState;
};

export function ConversationItem({ conversation, selected, onClick, typing }: Props) {
    const { contact, last_message_preview, last_message_role, last_message_at, unread_count } =
        conversation;
    const displayName = contact.name?.trim() || contact.phone;
    const initial = displayName.charAt(0).toUpperCase();
    const hasUnread = (unread_count ?? 0) > 0 && !selected;

    return (
        <button
            onClick={onClick}
            className={`group relative flex w-full items-start gap-3 overflow-hidden rounded-2xl px-3 py-3 text-left transition-all duration-200 ${
                selected
                    ? "bg-gradient-to-r from-[#ffffff]/[0.08] via-[#22d3ee]/[0.04] to-transparent"
                    : hasUnread
                        ? "bg-[#22d3ee]/[0.03] hover:bg-[#22d3ee]/[0.05]"
                        : "hover:bg-white/[0.025]"
            }`}
        >
            {selected && (
                <div
                    className="absolute inset-y-2 left-0 w-[3px] rounded-r-full"
                    style={{
                        background: "linear-gradient(to bottom, #22d3ee, #a855f7, #22d3ee)",
                        boxShadow: "0 0 12px rgba(255,255,255,0.6)",
                    }}
                />
            )}

            <Avatar initial={initial} aiEnabled={contact.ai_enabled} selected={selected} />

            <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2 mb-0.5">
                    <h3
                        className={`truncate text-sm leading-snug transition-colors ${
                            hasUnread
                                ? "font-black text-white"
                                : selected
                                    ? "font-bold text-white"
                                    : "font-bold text-gray-200 group-hover:text-white"
                        }`}
                    >
                        {displayName}
                    </h3>
                    {last_message_at && (
                        <span
                            className={`shrink-0 font-mono text-[10px] tabular-nums transition-colors ${
                                hasUnread ? "text-[#22d3ee]" : selected ? "text-gray-300" : "text-gray-600"
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
                <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0 flex-1">
                        {typing ? (
                            <TypingDots by={typing.by} />
                        ) : last_message_preview ? (
                            <p
                                className={`truncate text-xs leading-relaxed ${
                                    hasUnread
                                        ? "font-semibold text-gray-200"
                                        : selected
                                            ? "text-gray-300"
                                            : "text-gray-500"
                                }`}
                            >
                                {last_message_role && (
                                    <span
                                        className={`font-semibold mr-1 ${
                                            last_message_role === "ai"
                                                ? "text-[#22d3ee]"
                                                : last_message_role === "human"
                                                    ? "text-white"
                                                    : "text-gray-600"
                                        }`}
                                    >
                                        {rolePrefix(last_message_role)}
                                    </span>
                                )}
                                {last_message_preview}
                            </p>
                        ) : null}
                    </div>
                    {hasUnread && <UnreadBadge count={unread_count} />}
                </div>
            </div>
        </button>
    );
}

function Avatar({
    initial,
    aiEnabled,
    selected,
}: {
    initial: string;
    aiEnabled: boolean;
    selected: boolean;
}) {
    return (
        <div className="relative shrink-0">
            <div
                className={`absolute inset-0 rounded-full blur-md transition-opacity duration-300 ${
                    selected ? "opacity-60" : "opacity-0 group-hover:opacity-30"
                }`}
                style={{
                    background: aiEnabled
                        ? "linear-gradient(135deg, #22d3ee, #a855f7)"
                        : "linear-gradient(135deg, #22d3ee, #f59e0b)",
                }}
            />
            <div
                className={`relative flex h-11 w-11 items-center justify-center rounded-full text-sm font-black transition-transform group-hover:scale-105 ${
                    aiEnabled
                        ? "border border-white/[0.1] bg-white/[0.04] text-gray-100"
                        : "border border-amber-500/30 bg-amber-500/[0.08] text-amber-300"
                }`}
                style={{ backdropFilter: "blur(8px)" }}
            >
                {initial}
            </div>
            <div
                className={`absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-[#0a0a0a] ${
                    aiEnabled
                        ? "bg-gradient-to-br from-[#22d3ee] to-[#a855f7]"
                        : "bg-amber-500"
                }`}
                title={aiEnabled ? "IA activa" : "Control manual"}
            >
                {aiEnabled ? (
                    <Bot className="h-2 w-2 text-white" strokeWidth={3} />
                ) : (
                    <BotOff className="h-2 w-2 text-[#0a0a0a]" strokeWidth={3} />
                )}
            </div>
        </div>
    );
}

function rolePrefix(role: "user" | "ai" | "human" | null): string {
    if (role === "ai") return "Zid:";
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
