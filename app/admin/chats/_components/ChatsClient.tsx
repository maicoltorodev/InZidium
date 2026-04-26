"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageSquare, ArrowLeft, Sparkles, Bot, Zap, Radio } from "lucide-react";
import type {
    Contact,
    Conversation,
    ConversationWithContact,
    Message,
} from "@/lib/crm/types";
import {
    getConversationMessages,
    listConversations,
    sendHumanMessage,
    toggleAIForContact,
} from "@/lib/crm/actions/chats";
import { ConversationsList } from "./ConversationsList";
import { ConversationDetail } from "./ConversationDetail";
import { ContactProfile } from "./ContactProfile";
import { useRealtimeChats } from "./useRealtimeChats";
import { AdminLoading } from "@/lib/ui/AdminLoading";

export function ChatsClient() {
    const [cargando, setCargando] = useState(true);
    const [conversations, setConversations] = useState<ConversationWithContact[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [loadingMessages, setLoadingMessages] = useState(false);

    useEffect(() => {
        listConversations().then((data) => {
            setConversations(data);
            setCargando(false);
        });
    }, []);

    const selected = useMemo(
        () => conversations.find((c) => c.id === selectedId) ?? null,
        [conversations, selectedId],
    );

    useEffect(() => {
        if (!selectedId) {
            setMessages([]);
            return;
        }
        let cancelled = false;
        // Limpiar mensajes viejos al cambiar de conversación para evitar flash.
        setMessages([]);
        setLoadingMessages(true);
        getConversationMessages(selectedId).then((msgs) => {
            if (!cancelled) {
                setMessages(msgs);
                setLoadingMessages(false);
            }
        });
        return () => {
            cancelled = true;
        };
    }, [selectedId]);

    useRealtimeChats({
        onMessage: useCallback((msg: Message) => {
            setMessages((prev) => {
                if (msg.conversation_id !== selectedId) return prev;
                if (prev.some((m) => m.id === msg.id)) return prev;
                return [...prev, msg];
            });

            setConversations((prev) =>
                prev
                    .map((c) =>
                        c.id === msg.conversation_id
                            ? {
                                  ...c,
                                  last_message_preview: msg.content,
                                  last_message_role: msg.role,
                                  last_message_at: msg.sent_at,
                              }
                            : c,
                    )
                    .sort((a, b) => {
                        const ta = a.last_message_at ? new Date(a.last_message_at).getTime() : 0;
                        const tb = b.last_message_at ? new Date(b.last_message_at).getTime() : 0;
                        return tb - ta;
                    }),
            );
        }, [selectedId]),
        onConversationUpdate: useCallback((update: Partial<Conversation> & { id: string }) => {
            setConversations((prev) =>
                prev.map((c) => (c.id === update.id ? { ...c, ...update } : c)),
            );
        }, []),
        onContactUpdate: useCallback((update: Partial<Contact> & { id: string }) => {
            setConversations((prev) =>
                prev.map((c) =>
                    c.contact.id === update.id
                        ? { ...c, contact: { ...c.contact, ...update } }
                        : c,
                ),
            );
        }, []),
    });

    if (cargando) return <AdminLoading />;

    async function handleSend(text: string): Promise<{ error?: string }> {
        if (!selectedId) return { error: "Ninguna conversación seleccionada." };
        const res = await sendHumanMessage(selectedId, text);
        if ("error" in res) return { error: res.error };
        if (res.data) {
            setMessages((prev) =>
                prev.some((m) => m.id === res.data!.id) ? prev : [...prev, res.data!],
            );
        }
        return {};
    }

    async function handleToggleAI(contactId: string, enabled: boolean) {
        const res = await toggleAIForContact(contactId, enabled);
        if ("success" in res && res.data) {
            setConversations((prev) =>
                prev.map((c) =>
                    c.contact.id === contactId ? { ...c, contact: res.data! } : c,
                ),
            );
        }
    }

    return (
        <div className="relative h-full p-3 sm:p-4 lg:p-6">
            {/* Glow ambient de fondo */}
            <div
                className="pointer-events-none absolute inset-0 -z-10 opacity-60"
                style={{
                    background:
                        "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(168,85,247,0.15), transparent), radial-gradient(ellipse 60% 50% at 100% 100%, rgba(34,211,238,0.10), transparent)",
                }}
            />

            <div className="relative flex h-full min-h-0 overflow-hidden rounded-3xl border border-white/[0.06] bg-[#0a0518]/60 backdrop-blur-2xl shadow-[0_0_60px_rgba(168,85,247,0.08)]">
                {/* Línea de energía superior */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] overflow-hidden rounded-t-3xl">
                    <div
                        className="absolute inset-0 opacity-60"
                        style={{
                            background:
                                "linear-gradient(90deg, transparent, #e879f9, #a855f7, #22d3ee, transparent)",
                            backgroundSize: "200% 100%",
                            animation: "gradient 8s linear infinite",
                        }}
                    />
                </div>

                {/* Columna izquierda — lista */}
                <aside
                    className={`${selectedId ? "hidden lg:flex" : "flex w-full"} h-full flex-col border-r border-white/[0.05] lg:flex lg:w-1/4 lg:shrink-0`}
                >
                    <ConversationsList
                        conversations={conversations}
                        selectedId={selectedId}
                        onSelect={setSelectedId}
                    />
                </aside>

                {/* Columna centro — detalle */}
                <section
                    className={`${selectedId ? "flex" : "hidden lg:flex"} h-full min-w-0 flex-1 flex-col`}
                >
                    <AnimatePresence mode="wait">
                        {selected ? (
                            <motion.div
                                key="detail"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.15 }}
                                className="flex h-full min-h-0 flex-col"
                            >
                                {/* Back button mobile */}
                                <div className="flex items-center border-b border-white/[0.05] lg:hidden">
                                    <button
                                        onClick={() => setSelectedId(null)}
                                        className="flex items-center gap-2 px-4 py-3 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-white transition"
                                    >
                                        <ArrowLeft className="h-4 w-4" />
                                        Volver
                                    </button>
                                </div>
                                <ConversationDetail
                                    conversation={selected}
                                    messages={messages}
                                    loadingMessages={loadingMessages}
                                    onSend={handleSend}
                                    onToggleAI={handleToggleAI}
                                />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex h-full items-center justify-center p-8 lg:p-12"
                            >
                                <EmptyState />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </section>

                {/* Columna derecha — perfil del contacto */}
                {selected && (
                    <aside className="hidden lg:flex h-full lg:w-1/4 lg:shrink-0 flex-col border-l border-white/[0.05]">
                        <ContactProfile conversation={selected} />
                    </aside>
                )}
            </div>
        </div>
    );
}

function EmptyState() {
    return (
        <div className="max-w-md w-full text-center">
            {/* Icono central con glow */}
            <div className="relative mx-auto mb-10 h-28 w-28">
                <div
                    className="absolute inset-0 rounded-[2rem] blur-2xl opacity-50"
                    style={{
                        background:
                            "linear-gradient(135deg, #e879f9, #a855f7, #22d3ee)",
                    }}
                />
                <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="relative flex h-full w-full items-center justify-center rounded-[2rem] border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl"
                >
                    <MessageSquare className="h-12 w-12 text-white" strokeWidth={1.5} />
                </motion.div>
            </div>

            {/* Eyebrow */}
            <div className="flex items-center justify-center gap-3 mb-4 text-[#22d3ee]">
                <Sparkles className="h-4 w-4 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] font-[family-name:var(--font-orbitron)]">
                    Centro de chats
                </span>
            </div>

            {/* Titulo gradient */}
            <h2 className="mb-4 text-2xl sm:text-3xl font-black tracking-tighter text-white">
                Selecciona una{" "}
                <span
                    className="bg-clip-text text-transparent bg-[length:200%_auto]"
                    style={{
                        backgroundImage:
                            "linear-gradient(90deg, #e879f9, #a855f7, #22d3ee, #a855f7, #e879f9)",
                        animation: "gradient 4s linear infinite",
                    }}
                >
                    conversación
                </span>
            </h2>

            <p className="mb-10 text-sm leading-relaxed text-gray-500">
                Elige un chat de la lista para ver el historial completo, controlar a
                Izzy y responder manualmente al cliente.
            </p>

            {/* Tips */}
            <div className="space-y-2.5">
                <Tip
                    icon={<Zap className="h-4 w-4" />}
                    accent="#22d3ee"
                    title="IA en tiempo real"
                    body="Izzy responde automáticamente cuando está activa. Toma control desde el toggle del chat cuando quieras."
                />
                <Tip
                    icon={<Bot className="h-4 w-4" />}
                    accent="#e879f9"
                    title="Filtros inteligentes"
                    body="Filtra por estado de IA, busca por nombre o teléfono."
                />
                <Tip
                    icon={<Radio className="h-4 w-4" />}
                    accent="#a855f7"
                    title="Sincronización viva"
                    body="Mensajes nuevos llegan instantáneamente sin recargar."
                />
            </div>
        </div>
    );
}

function Tip({
    icon,
    accent,
    title,
    body,
}: {
    icon: React.ReactNode;
    accent: string;
    title: string;
    body: string;
}) {
    return (
        <div className="group flex items-start gap-3 rounded-2xl border border-white/[0.05] bg-white/[0.02] backdrop-blur-sm px-4 py-3.5 transition-all hover:border-white/[0.1] hover:bg-white/[0.03]">
            <div
                className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.03] transition-all group-hover:scale-110"
                style={{ color: accent }}
            >
                {icon}
            </div>
            <div className="min-w-0 flex-1 text-left">
                <p className="text-xs font-bold text-gray-300 mb-0.5">{title}</p>
                <p className="text-xs leading-relaxed text-gray-500">{body}</p>
            </div>
        </div>
    );
}
