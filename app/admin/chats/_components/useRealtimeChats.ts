"use client";

import { useEffect, useRef } from "react";
import type { Contact, ContactMedia, Conversation, Message } from "@/lib/crm/types";

type Callbacks = {
    onMessage?: (msg: Message) => void;
    onMessageUpdate?: (msg: Partial<Message> & { id: string; conversation_id: string }) => void;
    onMessageDelete?: (msg: { id: string; conversation_id: string }) => void;
    onMediaReady?: (media: ContactMedia) => void;
    onConversationUpdate?: (conv: Partial<Conversation> & { id: string }) => void;
    onContactUpdate?: (contact: Partial<Contact> & { id: string }) => void;
};

export function useRealtimeChats(callbacks: Callbacks) {
    const callbacksRef = useRef(callbacks);
    useEffect(() => {
        callbacksRef.current = callbacks;
    });

    useEffect(() => {
        const es = new EventSource("/api/chats/stream");

        const handlers: Array<[string, (e: MessageEvent) => void]> = [
            ["message", (e) => safeJson(e, callbacksRef.current.onMessage)],
            ["message_update", (e) => safeJson(e, callbacksRef.current.onMessageUpdate)],
            ["message_delete", (e) => safeJson(e, callbacksRef.current.onMessageDelete)],
            ["media_ready", (e) => safeJson(e, callbacksRef.current.onMediaReady)],
            ["conversation", (e) => safeJson(e, callbacksRef.current.onConversationUpdate)],
            ["contact", (e) => safeJson(e, callbacksRef.current.onContactUpdate)],
        ];

        for (const [event, handler] of handlers) {
            es.addEventListener(event, handler);
        }

        return () => {
            es.close();
        };
    }, []);
}

function safeJson<T>(e: MessageEvent, cb?: (data: T) => void) {
    if (!cb) return;
    try {
        cb(JSON.parse(e.data) as T);
    } catch {}
}
