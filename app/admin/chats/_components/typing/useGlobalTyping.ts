"use client";

import { useEffect, useRef, useState } from "react";
import { supabaseCrmClient } from "@/lib/supabase/crm/client";

const SCHEMA = process.env.NEXT_PUBLIC_SUPABASE_SCHEMA ?? "inzidium_crm";
const TYPING_TOPIC = `typing:${SCHEMA}`;
const STALE_AFTER_MS = 15_000;

export type TypingState = { by: "ai" | "human"; at: number };

/**
 * Suscripción única al canal global de typing del schema.
 * Devuelve un Map<conversationId, TypingState> con todas las conversaciones
 * que actualmente tienen typing activo.
 */
export function useGlobalTyping() {
    const [typingMap, setTypingMap] = useState<Map<string, TypingState>>(new Map());
    const staleTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

    useEffect(() => {
        const channel = supabaseCrmClient.channel(TYPING_TOPIC);
        channel
            .on("broadcast", { event: "typing" }, ({ payload }) => {
                const convId = payload?.conversation_id as string | undefined;
                if (!convId) return;
                const isTyping = !!payload?.typing;
                const by = (payload?.by as "ai" | "human") ?? "ai";

                setTypingMap((prev) => {
                    const next = new Map(prev);
                    if (isTyping) next.set(convId, { by, at: Date.now() });
                    else next.delete(convId);
                    return next;
                });

                // Stale protection: si el bot no apaga, lo limpiamos solos
                const existing = staleTimers.current.get(convId);
                if (existing) {
                    clearTimeout(existing);
                    staleTimers.current.delete(convId);
                }
                if (isTyping) {
                    const t = setTimeout(() => {
                        setTypingMap((prev) => {
                            const next = new Map(prev);
                            next.delete(convId);
                            return next;
                        });
                        staleTimers.current.delete(convId);
                    }, STALE_AFTER_MS);
                    staleTimers.current.set(convId, t);
                }
            })
            .subscribe();

        return () => {
            staleTimers.current.forEach((t) => clearTimeout(t));
            staleTimers.current.clear();
            supabaseCrmClient.removeChannel(channel);
        };
    }, []);

    return typingMap;
}
