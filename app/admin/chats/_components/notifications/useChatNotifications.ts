"use client";

import { useCallback, useState } from "react";
import type { ConversationWithContact, Message } from "@/lib/crm/types";
import { playBeep } from "./playBeep";
import { useTitleBadge } from "./useTitleBadge";
import type { ToastData } from "./NotificationToast";

const MAX_TOASTS = 3;

const TYPE_PREVIEW: Record<string, string> = {
    image: "📷 Envió una imagen",
    video: "🎬 Envió un video",
    audio: "🎵 Envió un audio",
    document: "📄 Envió un documento",
    sticker: "✨ Envió un sticker",
    location: "📍 Envió ubicación",
    contacts: "👤 Compartió un contacto",
    interactive: "🔘 Respondió un botón",
    reaction: "💬 Reaccionó a un mensaje",
};

/**
 * Orquesta las notificaciones in-app del CRM:
 *  - Beep + toast cuando entra mensaje del cliente Y NO está mirando ese chat
 *  - Title badge "(N)" cuando la pestaña está blurred
 *  - Reset automático al volver el foco
 *
 * El consumer llama `notify(message, conversation, isFocusedOnChat)` cada vez que llega un msg via realtime.
 */
export function useChatNotifications() {
    const titleBadge = useTitleBadge();
    const [toasts, setToasts] = useState<ToastData[]>([]);

    const notify = useCallback(
        (msg: Message, conversation: ConversationWithContact | null, isFocusedOnChat: boolean) => {
            // Solo nos importa el mensaje del cliente. AI/human outbound no son alertas.
            if (msg.role !== "user") return;
            // Si ya estás mirando ese chat con el tab enfocado, no molestamos.
            if (isFocusedOnChat && typeof document !== "undefined" && !document.hidden) return;

            const contactName = conversation?.contact?.name?.trim() ||
                conversation?.contact?.phone ||
                "Cliente";
            const phone = conversation?.contact?.phone ?? "";
            const preview = msg.content?.trim() ||
                TYPE_PREVIEW[msg.wa_type] ||
                "(nuevo mensaje)";

            const toast: ToastData = {
                id: `${msg.id}-${Date.now()}`,
                contactName,
                phone,
                preview,
                conversationId: msg.conversation_id,
            };

            setToasts((prev) => {
                const next = [...prev, toast];
                // Cap a MAX_TOASTS — descartamos los más viejos
                return next.length > MAX_TOASTS ? next.slice(-MAX_TOASTS) : next;
            });

            playBeep();
            titleBadge.bump();
        },
        [titleBadge],
    );

    const dismissToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return {
        toasts,
        notify,
        dismissToast,
        titleBadgeCount: titleBadge.count,
        resetTitleBadge: titleBadge.reset,
    };
}
