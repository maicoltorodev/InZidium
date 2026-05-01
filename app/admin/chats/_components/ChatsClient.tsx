"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";
import type { Message } from "@/lib/crm/types";
import {
    markConversationRead,
    sendHumanMessage,
    toggleAIForContact,
} from "@/lib/crm/actions/chats";
import { sendHumanMedia } from "@/lib/crm/actions/sendMedia";
import { sendHumanReaction } from "@/lib/crm/actions/sendReaction";
import { useChatNotifications } from "./notifications/useChatNotifications";
import { ToastStack } from "./notifications/ToastStack";
import { useGlobalTyping } from "./typing/useGlobalTyping";
import { selectTyping } from "./typing/useTypingIndicator";
import { ConversationsList } from "./ConversationsList";
import { ConversationDetail } from "./ConversationDetail";
import { ContactProfile } from "./ContactProfile";
import { ChatsEmptyState } from "./ChatsEmptyState";
import { AdminLoading } from "@/lib/ui/AdminLoading";
import { useRealtime } from "@/app/admin/_components/realtime/RealtimeProvider";
import { useConversationsRealtime } from "@/app/admin/_components/realtime/useConversationsRealtime";
import { useMessagesRealtime } from "@/app/admin/_components/realtime/useMessagesRealtime";

export function ChatsClient() {
    const { onTable } = useRealtime();
    const { conversations, loading } = useConversationsRealtime();
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const { messages, loading: loadingMessages } = useMessagesRealtime(selectedId);
    const [replyingTo, setReplyingTo] = useState<Message | null>(null);
    const notifications = useChatNotifications();
    const conversationsRef = useRef(conversations);
    const selectedIdRef = useRef(selectedId);
    const notifyRef = useRef(notifications.notify);
    const typingMap = useGlobalTyping();
    const { data: session } = useSession();
    const sessionUser = session?.user as { username?: string; id?: string } | undefined;
    const currentUser =
        sessionUser?.username ??
        sessionUser?.id ??
        "admin";

    const selected = useMemo(
        () => conversations.find((c) => c.id === selectedId) ?? null,
        [conversations, selectedId],
    );

    useEffect(() => {
        conversationsRef.current = conversations;
    }, [conversations]);

    useEffect(() => {
        selectedIdRef.current = selectedId;
    }, [selectedId]);

    useEffect(() => {
        notifyRef.current = notifications.notify;
    }, [notifications.notify]);

    // Marcar como leído al abrir + reset replyingTo + reset title badge
    useEffect(() => {
        setReplyingTo(null);
        if (!selectedId) return;
        notifications.resetTitleBadge();
        markConversationRead(selectedId).catch(() => { });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedId]);

    // Notificaciones in-app: escucha todos los INSERT de mensajes mientras /admin/chats está montado.
    useEffect(
        () =>
            onTable<Message>("messages", (e) => {
                if (e.eventType !== "INSERT") return;
                const msg = e.new;
                if (msg.role !== "user") return;

                const currentSelectedId = selectedIdRef.current;
                const conv =
                    conversationsRef.current.find((c) => c.id === msg.conversation_id) ?? null;

                notifyRef.current(msg, conv, msg.conversation_id === currentSelectedId);
            }),
        [onTable],
    );

    if (loading) return <AdminLoading />;

    async function handleSend(text: string): Promise<{ error?: string }> {
        if (!selectedId) return { error: "Ninguna conversación seleccionada." };
        const replyToWa = replyingTo?.wa_message_id ?? undefined;
        const res = await sendHumanMessage(selectedId, text, replyToWa);
        setReplyingTo(null);
        if ("error" in res) return { error: res.error };
        return {};
    }

    async function handleSendMedia(file: File, caption: string): Promise<{ error?: string }> {
        if (!selectedId) return { error: "Ninguna conversación seleccionada." };
        const replyToWa = replyingTo?.wa_message_id ?? undefined;
        const res = await sendHumanMedia(selectedId, file, caption || undefined, replyToWa);
        setReplyingTo(null);
        if ("error" in res) return { error: res.error };
        return {};
    }

    async function handleReact(msg: Message, emoji: string) {
        // Optimistic UI: la fila real se sincroniza vía realtime cuando server confirme.
        await sendHumanReaction(msg.id, emoji);
    }

    async function handleToggleAI(contactId: string, enabled: boolean) {
        await toggleAIForContact(contactId, enabled);
    }

    return (
        <div className="relative h-full p-3 sm:p-4 lg:p-6">
            <div
                className="pointer-events-none absolute inset-0 -z-10 opacity-60"
                style={{
                    background:
                        "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(255,255,255,0.15), transparent), radial-gradient(ellipse 60% 50% at 100% 100%, rgba(255,215,0,0.10), transparent)",
                }}
            />

            <div className="relative flex h-full min-h-0 overflow-hidden rounded-3xl border border-white/[0.06] bg-[#0a0518]/60 backdrop-blur-2xl shadow-[0_0_60px_rgba(255,255,255,0.08)]">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] overflow-hidden rounded-t-3xl">
                    <div
                        className="absolute inset-0 opacity-60"
                        style={{
                            background:
                                "linear-gradient(90deg, transparent, #22d3ee, #a855f7, #22d3ee, transparent)",
                            backgroundSize: "200% 100%",
                            animation: "gradient 8s linear infinite",
                        }}
                    />
                </div>

                <aside
                    className={`${selectedId ? "hidden lg:flex" : "flex w-full"} h-full flex-col border-r border-white/[0.05] lg:flex lg:w-1/4 lg:shrink-0`}
                >
                    <ConversationsList
                        conversations={conversations}
                        selectedId={selectedId}
                        onSelect={setSelectedId}
                        typingMap={typingMap}
                    />
                </aside>

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
                                    onSendMedia={handleSendMedia}
                                    onToggleAI={handleToggleAI}
                                    replyingTo={replyingTo}
                                    onReply={setReplyingTo}
                                    onCancelReply={() => setReplyingTo(null)}
                                    onReact={handleReact}
                                    typing={selectTyping(typingMap, selectedId)}
                                    currentUser={currentUser}
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
                                <ChatsEmptyState />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </section>

                {selected && (
                    <aside className="hidden lg:flex h-full lg:w-1/4 lg:shrink-0 flex-col border-l border-white/[0.05]">
                        <ContactProfile conversation={selected} />
                    </aside>
                )}
            </div>

            <ToastStack
                toasts={notifications.toasts}
                onDismiss={notifications.dismissToast}
                onClick={(t) => setSelectedId(t.conversationId)}
            />
        </div>
    );
}
