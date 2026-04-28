"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Contact, Conversation, ConversationWithContact, Message } from "@/lib/crm/types";
import { listConversations } from "@/lib/crm/actions/chats";
import { useRealtime } from "./RealtimeProvider";

/**
 * Lista de conversaciones siempre actualizada vía Supabase Realtime.
 * Maneja: INSERT/DELETE de conversations, UPDATE/INSERT/DELETE de contacts,
 * INSERT de messages para bumpear preview/unread, y broadcast `crm.reset`.
 */
export function useConversationsRealtime() {
    const { onTable, onReset } = useRealtime();
    const [conversations, setConversations] = useState<ConversationWithContact[]>([]);
    const [loading, setLoading] = useState(true);
    const inFlightRef = useRef(false);

    const refetch = useCallback(async () => {
        if (inFlightRef.current) return;
        inFlightRef.current = true;
        try {
            const data = await listConversations();
            setConversations(data);
        } finally {
            inFlightRef.current = false;
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refetch();
    }, [refetch]);

    // RESET → refetch full
    useEffect(() => onReset(refetch), [onReset, refetch]);

    // CONVERSATIONS: INSERT (conv nueva), UPDATE, DELETE
    useEffect(
        () =>
            onTable<Conversation>("conversations", (e) => {
                if (e.eventType === "INSERT") {
                    // Necesitamos el contact_id resuelto y preview → refetch puntual
                    refetch();
                } else if (e.eventType === "UPDATE") {
                    setConversations((prev) =>
                        prev.map((c) => (c.id === e.new.id ? { ...c, ...e.new } : c)),
                    );
                } else if (e.eventType === "DELETE") {
                    setConversations((prev) => prev.filter((c) => c.id !== (e.old as any)?.id));
                }
            }),
        [onTable, refetch],
    );

    // CONTACTS: UPDATE (cambio de nombre, ai_enabled, etc.); INSERT/DELETE → refetch
    useEffect(
        () =>
            onTable<Contact>("contacts", (e) => {
                if (e.eventType === "UPDATE") {
                    setConversations((prev) =>
                        prev.map((c) =>
                            c.contact.id === e.new.id
                                ? { ...c, contact: { ...c.contact, ...e.new } }
                                : c,
                        ),
                    );
                } else {
                    refetch();
                }
            }),
        [onTable, refetch],
    );

    // MESSAGES INSERT: bump preview + last_message_at; el unread_count viene del trigger
    useEffect(
        () =>
            onTable<Message>("messages", (e) => {
                if (e.eventType !== "INSERT") return;
                const msg = e.new;
                setConversations((prev) => {
                    const exists = prev.some((c) => c.id === msg.conversation_id);
                    if (!exists) {
                        // Conversación nueva → refetch para traerla con su contacto
                        refetch();
                        return prev;
                    }
                    return prev
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
                            const ta = a.last_message_at
                                ? new Date(a.last_message_at).getTime()
                                : 0;
                            const tb = b.last_message_at
                                ? new Date(b.last_message_at).getTime()
                                : 0;
                            return tb - ta;
                        });
                });
            }),
        [onTable, refetch],
    );

    return { conversations, loading, refetch };
}
