"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageSquare, ArrowLeft, Zap, Bot, Clock } from "lucide-react";
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
        <div className="flex h-full min-h-0">
            {/* Columna izquierda — lista */}
            <aside
                className={`${selectedId ? "hidden lg:flex" : "flex"} h-full w-full shrink-0 flex-col border-r border-white/[0.06] lg:w-[400px]`}
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
                            key={selected.id}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.18 }}
                            className="flex h-full min-h-0 flex-col"
                        >
                            {/* Back button mobile */}
                            <div className="flex items-center border-b border-white/[0.06] lg:hidden">
                                <button
                                    onClick={() => setSelectedId(null)}
                                    className="flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white"
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
                            className="flex h-full items-center justify-center p-12"
                        >
                            <div className="max-w-lg w-full">
                                {/* Icono central */}
                                <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl border border-white/[0.06] bg-white/[0.02]">
                                    <MessageSquare className="h-11 w-11 text-gray-700" />
                                </div>

                                <h2 className="mb-4 text-center text-2xl font-bold text-white">
                                    Selecciona una conversación
                                </h2>
                                <p className="mb-10 text-center text-base leading-relaxed text-gray-500">
                                    Elige un chat de la lista para ver el historial completo, controlar la IA y responder manualmente al cliente.
                                </p>

                                {/* Tips */}
                                <div className="space-y-3">
                                    <Tip icon={<Zap className="h-4 w-4 text-[#FFD700]" />}>
                                        La IA responde automáticamente cuando está activa. Puedes tomar control en cualquier momento desde el toggle del chat.
                                    </Tip>
                                    <Tip icon={<Bot className="h-4 w-4 text-gray-400" />}>
                                        Los chats con IA apagada aparecen marcados con <span className="font-bold text-amber-400">Sin IA</span> en el filtro de la lista.
                                    </Tip>
                                    <Tip icon={<Clock className="h-4 w-4 text-gray-400" />}>
                                        Los mensajes se ordenan del más reciente al más antiguo. Los nuevos llegan en tiempo real.
                                    </Tip>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </section>

            {/* Columna derecha — perfil del contacto */}
            {selected && (
                <aside className="hidden xl:flex h-full w-72 shrink-0 flex-col border-l border-white/[0.06]">
                    <ContactProfile conversation={selected} />
                </aside>
            )}
        </div>
    );
}


function Tip({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
    return (
        <div className="flex items-start gap-3 rounded-xl border border-white/[0.04] bg-white/[0.02] px-4 py-3">
            <div className="mt-0.5 shrink-0">{icon}</div>
            <p className="text-sm leading-relaxed text-gray-500">{children}</p>
        </div>
    );
}
