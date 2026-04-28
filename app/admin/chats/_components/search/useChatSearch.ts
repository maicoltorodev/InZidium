"use client";

import { useEffect, useMemo, useState } from "react";
import type { Message } from "@/lib/crm/types";

/**
 * Hook que centraliza el estado de búsqueda dentro de una conversación.
 * - matches: ids de mensajes que matchean
 * - currentIndex: cuál estamos viendo
 * - prev/next: navegación
 * - currentId: para highlight visual del bubble actual
 */
export function useChatSearch(messages: Message[]) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);

    const matches = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q || !open) return [] as Message[];
        return messages.filter((m) => m.content?.toLowerCase().includes(q));
    }, [messages, query, open]);

    // Reset index cuando cambian los matches
    useEffect(() => {
        setCurrentIndex(0);
    }, [query, matches.length]);

    const currentMatch = matches[currentIndex] ?? null;

    // Auto-scroll al match actual
    useEffect(() => {
        if (!currentMatch) return;
        const el = document.querySelector(`[data-message-id="${currentMatch.id}"]`);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }, [currentMatch]);

    function next() {
        if (matches.length === 0) return;
        setCurrentIndex((i) => (i + 1) % matches.length);
    }
    function prev() {
        if (matches.length === 0) return;
        setCurrentIndex((i) => (i - 1 + matches.length) % matches.length);
    }
    function close() {
        setOpen(false);
        setQuery("");
        setCurrentIndex(0);
    }

    return {
        open,
        toggle: () => setOpen((v) => !v),
        close,
        query,
        setQuery,
        matches,
        currentIndex,
        currentMatchId: currentMatch?.id ?? null,
        next,
        prev,
    };
}
