"use client";

import { useMemo, useState } from "react";
import type { ConversationWithContact } from "@/lib/crm/types";

export type Filter = "all" | "ai" | "manual" | "unanswered" | "mine";

export type FilterCounts = Record<Filter, number>;

export function useConversationFilters(
    conversations: ConversationWithContact[],
    currentUser?: string | null,
) {
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState<Filter>("all");

    const counts: FilterCounts = useMemo(() => {
        return {
            all: conversations.length,
            ai: conversations.filter((c) => c.contact.ai_enabled).length,
            manual: conversations.filter((c) => !c.contact.ai_enabled).length,
            unanswered: conversations.filter((c) => c.last_message_role === "user").length,
            mine: currentUser
                ? conversations.filter((c) => c.assigned_to === currentUser).length
                : 0,
        };
    }, [conversations, currentUser]);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        return conversations.filter((c) => {
            if (filter === "ai" && !c.contact.ai_enabled) return false;
            if (filter === "manual" && c.contact.ai_enabled) return false;
            if (filter === "unanswered" && c.last_message_role !== "user") return false;
            if (filter === "mine" && c.assigned_to !== currentUser) return false;
            if (!q) return true;
            return (
                c.contact.name?.toLowerCase().includes(q) ||
                c.contact.phone.includes(q) ||
                c.last_message_preview?.toLowerCase().includes(q)
            );
        });
    }, [conversations, search, filter, currentUser]);

    return { search, setSearch, filter, setFilter, counts, filtered };
}
