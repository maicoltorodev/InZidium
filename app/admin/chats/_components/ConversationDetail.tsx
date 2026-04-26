"use client";

import { useEffect, useRef } from "react";
import { Phone } from "lucide-react";
import type { ConversationWithContact, Message } from "@/lib/crm/types";
import { MessageBubble } from "./MessageBubble";
import { ChatInput } from "./ChatInput";
import { AIToggle } from "./AIToggle";

type Props = {
    conversation: ConversationWithContact;
    messages: Message[];
    loadingMessages: boolean;
    onSend: (text: string) => Promise<{ error?: string }>;
    onToggleAI: (contactId: string, enabled: boolean) => Promise<void>;
};

export function ConversationDetail({
    conversation,
    messages,
    loadingMessages,
    onSend,
    onToggleAI,
}: Props) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const { contact } = conversation;

    useEffect(() => {
        const el = scrollRef.current;
        if (el) el.scrollTop = el.scrollHeight;
    }, [messages.length, conversation.id]);

    const displayName = contact.name?.trim() || contact.phone;

    return (
        <div className="flex h-full min-h-0 flex-col">
            {/* Header */}
            <header className="flex shrink-0 items-center gap-4 border-b border-white/[0.06] px-6 py-4">
                <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border text-sm font-black ${
                        contact.ai_enabled
                            ? "border-white/[0.08] bg-white/[0.04] text-gray-300"
                            : "border-[#FFD700]/25 bg-[#FFD700]/10 text-[#FFD700]"
                    }`}
                >
                    {displayName.charAt(0).toUpperCase()}
                </div>

                <div className="min-w-0 flex-1">
                    <h2 className="truncate text-base font-bold text-white leading-snug">
                        {displayName}
                    </h2>
                    <div className="flex items-center gap-2 mt-0.5">
                        <Phone className="h-3 w-3 text-gray-600 shrink-0" />
                        <span className="font-mono text-xs text-gray-500">{contact.phone}</span>
                        {conversation.last_message_at && (
                            <>
                                <span className="text-gray-700">·</span>
                                <span className="text-xs text-gray-600">
                                    Último mensaje {formatRelative(new Date(conversation.last_message_at))}
                                </span>
                            </>
                        )}
                    </div>
                </div>

                <AIToggle
                    enabled={contact.ai_enabled}
                    onToggle={(enabled) => onToggleAI(contact.id, enabled)}
                />
            </header>

            {/* Mensajes */}
            <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto px-8 py-6">
                {loadingMessages && messages.length === 0 && (
                    <div className="flex h-full items-center justify-center">
                        <p className="font-mono text-xs text-gray-600 animate-pulse">Cargando mensajes…</p>
                    </div>
                )}
                {!loadingMessages && messages.length === 0 && (
                    <div className="flex h-full items-center justify-center">
                        <p className="text-xs text-gray-600">Sin mensajes todavía.</p>
                    </div>
                )}
                <div className="space-y-4 max-w-3xl mx-auto">
                    {messages.map((m) => (
                        <MessageBubble key={m.id} message={m} />
                    ))}
                </div>
            </div>

            {/* Input */}
            <div className="shrink-0 border-t border-white/[0.06] px-8 py-4">
                {contact.ai_enabled ? (
                    <div className="flex items-center gap-3 rounded-xl border border-[#FFD700]/15 bg-[#FFD700]/[0.04] px-5 py-3.5 max-w-3xl mx-auto">
                        <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#FFD700] shrink-0" />
                        <p className="text-xs leading-relaxed text-gray-500">
                            La IA está respondiendo este chat. Usa el toggle <span className="font-bold text-gray-400">IA activa</span> para tomar control.
                        </p>
                    </div>
                ) : (
                    <div className="max-w-3xl mx-auto">
                        <ChatInput onSend={onSend} />
                    </div>
                )}
            </div>
        </div>
    );
}

function formatRelative(date: Date): string {
    const diff = Date.now() - date.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "ahora";
    if (mins < 60) return `hace ${mins}m`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `hace ${hours}h`;
    return `el ${date.toLocaleDateString("es-CO", { day: "numeric", month: "short" })}`;
}
