"use client";

import { useEffect, useRef } from "react";
import { Phone, Sparkles } from "lucide-react";
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
    const initial = displayName.charAt(0).toUpperCase();

    return (
        <div className="flex h-full min-h-0 flex-col">
            {/* Header */}
            <header className="relative flex shrink-0 items-center gap-4 border-b border-white/[0.05] px-6 py-4">
                {/* Avatar */}
                <div className="relative shrink-0">
                    <div
                        className="absolute inset-0 rounded-full blur-md opacity-50"
                        style={{
                            background: contact.ai_enabled
                                ? "linear-gradient(135deg, #22d3ee, #a855f7)"
                                : "linear-gradient(135deg, #e879f9, #f59e0b)",
                        }}
                    />
                    <div
                        className={`relative flex h-12 w-12 items-center justify-center rounded-full text-base font-black ${
                            contact.ai_enabled
                                ? "border border-white/[0.12] bg-white/[0.06] text-white"
                                : "border border-amber-500/30 bg-amber-500/[0.1] text-amber-300"
                        }`}
                        style={{ backdropFilter: "blur(8px)" }}
                    >
                        {initial}
                    </div>
                </div>

                <div className="min-w-0 flex-1">
                    <h2 className="truncate text-base font-bold text-white leading-snug">
                        {displayName}
                    </h2>
                    <div className="flex items-center gap-2 mt-0.5">
                        <Phone className="h-3 w-3 text-gray-600 shrink-0" />
                        <span className="font-mono text-xs text-gray-500">
                            {contact.phone}
                        </span>
                        {conversation.last_message_at && (
                            <>
                                <span className="text-gray-700">·</span>
                                <span className="text-xs text-gray-600">
                                    {formatRelative(new Date(conversation.last_message_at))}
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
            <div
                ref={scrollRef}
                className="flex-1 min-h-0 overflow-y-auto px-6 py-6 lg:px-8"
                style={{ scrollbarGutter: "stable" }}
            >
                {loadingMessages && messages.length === 0 && (
                    <div className="flex h-full items-center justify-center">
                        <div className="flex items-center gap-2.5 text-gray-600">
                            <Sparkles className="h-4 w-4 animate-pulse text-[#22d3ee]" />
                            <p className="font-mono text-xs uppercase tracking-widest">
                                Cargando mensajes…
                            </p>
                        </div>
                    </div>
                )}
                {!loadingMessages && messages.length === 0 && (
                    <div className="flex h-full items-center justify-center">
                        <div className="text-center">
                            <div
                                className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.06]"
                                style={{
                                    background:
                                        "linear-gradient(135deg, rgba(232,121,249,0.06), rgba(34,211,238,0.06))",
                                }}
                            >
                                <Sparkles className="h-6 w-6 text-gray-600" />
                            </div>
                            <p className="text-xs text-gray-600">Sin mensajes todavía.</p>
                        </div>
                    </div>
                )}
                <div className="space-y-3 max-w-3xl mx-auto">
                    {messages.map((m) => (
                        <MessageBubble key={m.id} message={m} />
                    ))}
                </div>
            </div>

            {/* Input */}
            <div className="shrink-0 border-t border-white/[0.05] px-6 py-4 lg:px-8">
                {contact.ai_enabled ? (
                    <div
                        className="flex items-center gap-3 rounded-2xl border px-5 py-3.5 max-w-3xl mx-auto"
                        style={{
                            borderColor: "rgba(34,211,238,0.2)",
                            background:
                                "linear-gradient(135deg, rgba(34,211,238,0.05), rgba(168,85,247,0.05))",
                            backdropFilter: "blur(8px)",
                        }}
                    >
                        <div
                            className="h-2 w-2 animate-pulse rounded-full shrink-0"
                            style={{
                                background:
                                    "linear-gradient(135deg, #22d3ee, #a855f7)",
                                boxShadow: "0 0 10px rgba(168,85,247,0.6)",
                            }}
                        />
                        <p className="text-xs leading-relaxed text-gray-400">
                            Izzy está respondiendo este chat. Toma control con el toggle{" "}
                            <span className="font-bold text-white">IA activa</span>.
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
