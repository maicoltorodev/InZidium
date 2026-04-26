"use client";

import { useMemo, useState } from "react";
import { MessageSquare, Search, Bot, BotOff, Inbox } from "lucide-react";
import type { ConversationWithContact } from "@/lib/crm/types";
import { ConversationItem } from "./ConversationItem";

type Props = {
    conversations: ConversationWithContact[];
    selectedId: string | null;
    onSelect: (id: string) => void;
};

type Filter = "all" | "ai" | "manual";

export function ConversationsList({ conversations, selectedId, onSelect }: Props) {
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState<Filter>("all");

    const counts = useMemo(() => {
        return {
            all: conversations.length,
            ai: conversations.filter((c) => c.contact.ai_enabled).length,
            manual: conversations.filter((c) => !c.contact.ai_enabled).length,
        };
    }, [conversations]);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        return conversations.filter((c) => {
            if (filter === "ai" && !c.contact.ai_enabled) return false;
            if (filter === "manual" && c.contact.ai_enabled) return false;
            if (!q) return true;
            return (
                c.contact.name?.toLowerCase().includes(q) ||
                c.contact.phone.includes(q) ||
                c.last_message_preview?.toLowerCase().includes(q)
            );
        });
    }, [conversations, search, filter]);

    return (
        <div className="flex flex-1 min-h-0 flex-col">
            {/* Header con título + contador */}
            <div className="shrink-0 border-b border-white/[0.05] px-5 pt-5 pb-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                        <div
                            className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/[0.08]"
                            style={{
                                background:
                                    "linear-gradient(135deg, rgba(232,121,249,0.12), rgba(34,211,238,0.12))",
                            }}
                        >
                            <Inbox className="h-4 w-4 text-white" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 font-[family-name:var(--font-orbitron)]">
                                Inbox
                            </p>
                            <p className="text-sm font-bold text-white leading-tight">
                                Conversaciones
                            </p>
                        </div>
                    </div>
                    <div className="rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-1">
                        <span className="text-[10px] font-black tracking-widest text-gray-300 font-mono">
                            {counts.all}
                        </span>
                    </div>
                </div>

                {/* Buscador */}
                <div className="group relative mb-3">
                    <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-600 transition-colors group-focus-within:text-[#22d3ee]" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Buscar nombre, teléfono…"
                        className="w-full rounded-xl border border-white/[0.06] bg-white/[0.02] pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-gray-600 focus:border-[#22d3ee]/40 focus:bg-white/[0.04] focus:outline-none transition-all"
                    />
                </div>

                {/* Filtros */}
                <div className="flex items-center gap-1.5">
                    <FilterChip
                        active={filter === "all"}
                        onClick={() => setFilter("all")}
                        label="Todos"
                        count={counts.all}
                    />
                    <FilterChip
                        active={filter === "ai"}
                        onClick={() => setFilter("ai")}
                        label="IA"
                        count={counts.ai}
                        icon={<Bot className="h-3 w-3" />}
                        accent="#22d3ee"
                    />
                    <FilterChip
                        active={filter === "manual"}
                        onClick={() => setFilter("manual")}
                        label="Manual"
                        count={counts.manual}
                        icon={<BotOff className="h-3 w-3" />}
                        accent="#e879f9"
                    />
                </div>
            </div>

            {/* Lista */}
            <div className="flex-1 overflow-y-auto px-2 py-2">
                {filtered.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
                        <div
                            className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.06]"
                            style={{
                                background:
                                    "linear-gradient(135deg, rgba(232,121,249,0.06), rgba(34,211,238,0.06))",
                            }}
                        >
                            <MessageSquare className="h-6 w-6 text-gray-600" />
                        </div>
                        <p className="text-xs leading-relaxed text-gray-600 max-w-[200px]">
                            {conversations.length === 0
                                ? "Cuando un cliente escriba al WhatsApp, aparecerá aquí."
                                : "Ninguna conversación coincide con el filtro."}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-1">
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

function FilterChip({
    active,
    onClick,
    label,
    count,
    icon,
    accent,
}: {
    active: boolean;
    onClick: () => void;
    label: string;
    count: number;
    icon?: React.ReactNode;
    accent?: string;
}) {
    return (
        <button
            onClick={onClick}
            className={`group inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[10px] font-black uppercase tracking-[0.15em] transition-all ${
                active
                    ? "text-white"
                    : "border-white/[0.06] bg-white/[0.02] text-gray-500 hover:bg-white/[0.04] hover:text-gray-300"
            }`}
            style={
                active
                    ? {
                          borderColor: accent ? `${accent}40` : "rgba(168,85,247,0.4)",
                          background: accent
                              ? `${accent}1A`
                              : "rgba(168,85,247,0.1)",
                      }
                    : undefined
            }
        >
            {icon && (
                <span style={{ color: active && accent ? accent : undefined }}>
                    {icon}
                </span>
            )}
            <span style={{ color: active && accent ? accent : undefined }}>
                {label}
            </span>
            <span
                className={`font-mono ${active ? "" : "text-gray-600"}`}
                style={{
                    color: active ? (accent ? accent : "#fff") : undefined,
                    opacity: active ? 0.7 : 1,
                }}
            >
                {count}
            </span>
        </button>
    );
}
