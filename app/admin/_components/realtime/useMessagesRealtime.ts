"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ContactMedia, Message } from "@/lib/crm/types";
import { getConversationMessages, refreshMediaUrl } from "@/lib/crm/actions/chats";
import { useRealtime } from "./RealtimeProvider";

/**
 * Mensajes del chat abierto. Sincroniza:
 * - INSERT/UPDATE/DELETE en messages (filtrado por conversation_id)
 * - INSERT/UPDATE en contact_media (para vincular media descargado)
 * - broadcast `crm.reset`
 */
export function useMessagesRealtime(conversationId: string | null) {
    const { onTable, onReset } = useRealtime();
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);
    const inFlightRef = useRef(false);

    const refetch = useCallback(async () => {
        if (!conversationId) {
            setMessages([]);
            return;
        }
        if (inFlightRef.current) return;
        inFlightRef.current = true;
        setLoading(true);
        try {
            const data = await getConversationMessages(conversationId);
            setMessages(data);
        } finally {
            inFlightRef.current = false;
            setLoading(false);
        }
    }, [conversationId]);

    useEffect(() => {
        if (!conversationId) {
            setMessages([]);
            setLoading(false);
            return;
        }
        refetch();
    }, [conversationId, refetch]);

    useEffect(() => onReset(refetch), [onReset, refetch]);

    // MESSAGES: filtramos por conversationId
    useEffect(
        () =>
            onTable<Message>("messages", (e) => {
                if (!conversationId) return;
                if (e.eventType === "INSERT") {
                    if (e.new.conversation_id !== conversationId) return;
                    setMessages((prev) =>
                        prev.some((m) => m.id === e.new.id) ? prev : [...prev, e.new],
                    );
                } else if (e.eventType === "UPDATE") {
                    if (e.new.conversation_id !== conversationId) return;
                    setMessages((prev) =>
                        prev.map((m) => (m.id === e.new.id ? { ...m, ...e.new } : m)),
                    );
                } else if (e.eventType === "DELETE") {
                    const old = e.old as Partial<Message>;
                    if (!old?.id) return;
                    setMessages((prev) => prev.filter((m) => m.id !== old.id));
                }
            }),
        [onTable, conversationId],
    );

    // CONTACT_MEDIA: cuando se descarga un nuevo archivo, vincularlo al mensaje
    useEffect(
        () =>
            onTable<ContactMedia>("contact_media", async (e) => {
                if (e.eventType !== "INSERT" && e.eventType !== "UPDATE") return;
                try {
                    const media = e.new;
                    if (!media.wa_message_id) return;
                    const signed = await refreshMediaUrl(media.id);
                    const enriched: ContactMedia = { ...media, signed_url: signed };
                    setMessages((prev) =>
                        prev.map((m) =>
                            m.wa_message_id && m.wa_message_id === media.wa_message_id
                                ? {
                                      ...m,
                                      media: enriched,
                                      metadata: { ...(m.metadata ?? {}), media_status: "ready" },
                                  }
                                : m,
                        ),
                    );
                } catch (err) {
                    console.error("[useMessagesRealtime] contact_media enrich error", err);
                }
            }),
        [onTable],
    );

    return { messages, loading, refetch };
}
