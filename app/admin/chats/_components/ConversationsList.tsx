"use client";

import { useMemo, useState } from "react";
import { MessageSquare } from "lucide-react";
import type { ConversationWithContact } from "@/lib/crm/types";
import { ConversationItem } from "./ConversationItem";

type Props = {
    conversations: ConversationWithContact[];
    selectedId: string | null;
    onSelect: (id: string) => void;
};

export function ConversationsList({ conversations, selectedId, onSelect }: Props) {
    const [search, setSearch] = useState("");

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return conversations;
        return conversations.filter(
            (c) =>
                c.contact.name?.toLowerCase().includes(q) ||
                c.contact.phone.includes(q) ||
                c.last_message_preview?.toLowerCase().includes(q),
        );
    }, [conversations, search]);

    return (
        <div className="flex flex-1 min-h-0 flex-col">
            {/* Buscador */}
            <div className="border-b border-white/[0.06] px-4 py-4">
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar nombre, teléfono…"
                    className="w-full bg-transparent text-sm text-white placeholder:text-gray-500 focus:outline-none"
                />
            </div>

            {/* Lista */}
            <div className="flex-1 overflow-y-auto">
                {filtered.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.02]">
                            <MessageSquare className="h-6 w-6 text-gray-700" />
                        </div>
                        <p className="text-sm leading-relaxed text-gray-600 max-w-[200px]">
                            {conversations.length === 0
                                ? "Cuando un cliente escriba al WhatsApp, aparecerá aquí."
                                : "Ninguna conversación coincide con el filtro."}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-0.5">
                        {filtered.map((c) => (
                            <ConversationItem
                                key={c.id}
                                conversation={c}
                                selected={c.id === selectedId}
                                onClick={() => onSelect(c.id)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
