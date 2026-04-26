"use client";

import { useEffect, useRef } from "react";
import type { Contact, Conversation, Message } from "@/lib/crm/types";

type Callbacks = {
    onMessage?: (msg: Message) => void;
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

        es.addEventListener("message", (e) => {
            try {
                callbacksRef.current.onMessage?.(JSON.parse(e.data) as Message);
            } catch {}
        });

        es.addEventListener("conversation", (e) => {
            try {
                callbacksRef.current.onConversationUpdate?.(JSON.parse(e.data));
            } catch {}
        });

        es.addEventListener("contact", (e) => {
            try {
                callbacksRef.current.onContactUpdate?.(JSON.parse(e.data));
            } catch {}
        });

        return () => {
            es.close();
        };
    }, []);
}
