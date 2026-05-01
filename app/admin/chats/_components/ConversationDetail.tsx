"use client";

import { useEffect, useRef, useState } from "react";
import { Phone, Sparkles, Search, FileCode2 } from "lucide-react";
import { FilesButton } from "./files/FilesButton";
import type { ConversationWithContact, Message } from "@/lib/crm/types";
import { MessageBubble } from "./bubble/MessageBubble";
import { ChatInput } from "./ChatInput";
import { AIToggle } from "./AIToggle";
import { describe24hWindow } from "@/lib/crm/window";
import { useChatSearch } from "./search/useChatSearch";
import { SearchBar } from "./search/SearchBar";
import { SendTemplateModal } from "./templates/SendTemplateModal";
import type { TypingPayload } from "./typing/useTypingIndicator";
import { TypingBubble } from "./typing/TypingBubble";
import { AnimatePresence } from "framer-motion";

type Props = {
    conversation: ConversationWithContact;
    messages: Message[];
    loadingMessages: boolean;
    onSend: (text: string) => Promise<{ error?: string }>;
    onSendMedia?: (file: File, caption: string) => Promise<{ error?: string }>;
    onToggleAI: (contactId: string, enabled: boolean) => Promise<void>;
    replyingTo?: Message | null;
    onReply?: (msg: Message) => void;
    onCancelReply?: () => void;
    onReact?: (msg: Message, emoji: string) => void;
    typing?: TypingPayload | null;
    currentUser?: string | null;
};

export function ConversationDetail({
    conversation,
    messages,
    loadingMessages,
    onSend,
    onSendMedia,
    onToggleAI,
    replyingTo,
    onReply,
    onCancelReply,
    onReact,
    typing,
    currentUser,
}: Props) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const { contact } = conversation;
    const search = useChatSearch(messages);
    const [templateOpen, setTemplateOpen] = useState(false);

    useEffect(() => {
        // No auto-scroll mientras se está navegando una búsqueda (la búsqueda hace su propio scroll)
        if (search.open) return;
        const el = scrollRef.current;
        if (el) el.scrollTop = el.scrollHeight;
    }, [messages.length, conversation.id, search.open, typing]);

    // Cerrar búsqueda al cambiar de conversación
    useEffect(() => {
        search.close();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [conversation.id]);

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
                                : "linear-gradient(135deg, #22d3ee, #0891b2)",
                        }}
                    />
                    <div
                        className={`relative flex h-12 w-12 items-center justify-center rounded-full text-base font-black ${
                            contact.ai_enabled
                                ? "border border-white/[0.12] bg-white/[0.06] text-white"
                                : "border border-cyan-500/30 bg-cyan-500/[0.1] text-cyan-300"
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
                        <WindowBadge messages={messages} />
                    </div>
                </div>

                <FilesButton contactId={contact.id} contactName={displayName} />

                <button
                    onClick={() => setTemplateOpen(true)}
                    aria-label="Enviar plantilla de WhatsApp"
                    title="Enviar plantilla"
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.03] text-gray-400 transition hover:border-white/[0.12] hover:text-white"
                >
                    <FileCode2 className="h-4 w-4" />
                </button>

                <button
                    onClick={search.toggle}
                    aria-label="Buscar en la conversación"
                    title="Buscar"
                    className={`flex h-9 w-9 items-center justify-center rounded-xl border transition ${
                        search.open
                            ? "border-neon-cyan/40 bg-neon-cyan/10 text-neon-cyan"
                            : "border-white/[0.06] bg-white/[0.03] text-gray-400 hover:border-white/[0.12] hover:text-white"
                    }`}
                >
                    <Search className="h-4 w-4" />
                </button>
            </header>

            {search.open && (
                <SearchBar
                    query={search.query}
                    onQueryChange={search.setQuery}
                    matchesCount={search.matches.length}
                    currentIndex={search.currentIndex}
                    onPrev={search.prev}
                    onNext={search.next}
                    onClose={search.close}
                />
            )}

            {/* Mensajes */}
            <div
                ref={scrollRef}
                className="flex-1 min-h-0 overflow-y-auto px-6 py-6 lg:px-8"
                style={{ scrollbarGutter: "stable" }}
            >
                {loadingMessages && messages.length === 0 && (
                    <div className="flex h-full items-center justify-center">
                        <div className="flex items-center gap-2.5 text-gray-600">
                            <Sparkles className="h-4 w-4 animate-pulse text-neon-cyan" />
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
                                        "linear-gradient(135deg, rgba(34,211,238,0.06), rgba(168,85,247,0.06))",
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
                        <MessageBubble
                            key={m.id}
                            message={m}
                            onReply={onReply}
                            onReact={onReact}
                            searchQuery={search.open ? search.query : undefined}
                            isCurrentSearchMatch={search.currentMatchId === m.id}
                            currentUser={currentUser}
                        />
                    ))}
                    <AnimatePresence>
                        {typing?.typing && (
                            <TypingBubble key="typing" by={typing.by ?? "ai"} />
                        )}
                    </AnimatePresence>
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
                                background: "linear-gradient(135deg, #22d3ee, #a855f7)",
                                boxShadow: "0 0 10px rgba(34,211,238,0.6)",
                            }}
                        />
                        <p className="flex-1 text-xs leading-relaxed text-gray-400">
                            Izzy está respondiendo este chat.
                        </p>
                        <AIToggle
                            enabled={contact.ai_enabled}
                            onToggle={(enabled) => onToggleAI(contact.id, enabled)}
                        />
                    </div>
                ) : (
                    <div className="max-w-3xl mx-auto space-y-2">
                        <div className="flex justify-end">
                            <AIToggle
                                enabled={contact.ai_enabled}
                                onToggle={(enabled) => onToggleAI(contact.id, enabled)}
                            />
                        </div>
                        <ChatInput
                            onSend={onSend}
                            onSendMedia={onSendMedia}
                            replyingTo={replyingTo}
                            onCancelReply={onCancelReply}
                        />
                    </div>
                )}
            </div>

            <SendTemplateModal
                open={templateOpen}
                onClose={() => setTemplateOpen(false)}
                conversationId={conversation.id}
            />
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

/**
 * Badge de la ventana de 24h de Meta. Si la ventana está abierta muestra
 * tiempo restante; si está cerrada indica que solo se pueden enviar plantillas.
 */
function WindowBadge({ messages }: { messages: Message[] }) {
    // Último mensaje del cliente (role='user') determina la ventana de 24h
    let lastInboundAt: string | null = null;
    for (let i = messages.length - 1; i >= 0; i--) {
        if (messages[i].role === "user") {
            lastInboundAt = messages[i].sent_at;
            break;
        }
    }
    const w = describe24hWindow(lastInboundAt);
    return (
        <>
            <span className="text-gray-700">·</span>
            <span
                className="text-[10px] font-bold tracking-widest uppercase tabular-nums"
                style={{ color: w.open ? "#34d399" : "#fbbf24" }}
                title={
                    w.open
                        ? "Puedes enviar mensajes libres dentro de la ventana de 24h de Meta."
                        : "Fuera de la ventana de 24h. Solo se pueden enviar plantillas pre-aprobadas."
                }
            >
                {w.open ? `🟢 ${w.label}` : `🟡 24h cerrada`}
            </span>
        </>
    );
}
