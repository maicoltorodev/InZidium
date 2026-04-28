"use client";

import type { TypingState } from "./useGlobalTyping";

export type TypingPayload = TypingState & { typing: true };

/**
 * Selector puro: dado el map global y un conversation_id, devuelve el typing si lo hay.
 * Sin suscripción propia — confía en useGlobalTyping del consumidor (ChatsClient).
 */
export function selectTyping(
    map: Map<string, TypingState>,
    conversationId: string | null,
): TypingPayload | null {
    if (!conversationId) return null;
    const state = map.get(conversationId);
    return state ? { ...state, typing: true } : null;
}
