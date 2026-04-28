"use client";

import { MessageSquare, Search, Bot, BotOff, Inbox, MessageCircle, UserCheck } from "lucide-react";
import { useSession } from "next-auth/react";
import type { ConversationWithContact } from "@/lib/crm/types";
import { ConversationItem } from "./ConversationItem";
import { FilterChip } from "./list/FilterChip";
import { useConversationFilters } from "./list/useConversationFilters";
import type { TypingState } from "./typing/useGlobalTyping";

type Props = {
    conversations: ConversationWithContact[];
    selectedId: string | null;
    onSelect: (id: string) => void;
    typingMap?: Map<string, TypingState>;
};

export function ConversationsList({ conversations, selectedId, onSelect, typingMap }: Props) {
    const { data: session } = useSession();
    const currentUser =
        ((session?.user as any)?.username as string | undefined) ??
        ((session?.user as any)?.id as string | undefined) ??
        null;

    const { search, setSearch, filter, setFilter, counts, filtered } =
        useConversationFilters(conversations, currentUser);

    return (
        <div className="flex flex-1 min-h-0 flex-col">
            <ListHeader total={counts.all} />

            <div className="shrink-0 px-5 pb-4">
                <SearchInput value={search} onChange={setSearch} />

                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                    <FilterChip
                        active={filter === "all"}
                        onClick={() => setFilter("all")}
                        label="Todos"
                        count={counts.all}
                    />
                    <FilterChip
                        active={filter === "unanswered"}
                        onClick={() => setFilter("unanswered")}
                        label="Sin responder"
                        count={counts.unanswered}
                        icon={<MessageCircle className="h-3 w-3" />}
                        accent="#34d399"
                    />
                    <FilterChip
                        active={filter === "ai"}
                        onClick={() => setFilter("ai")}
                        label="IA"
                        count={counts.ai}
                        icon={<Bot className="h-3 w-3" />}
                        accent="#FFD700"
                    />
                    <FilterChip
                        active={filter === "manual"}
                        onClick={() => setFilter("manual")}
                        label="Manual"
                        count={counts.manual}
                        icon={<BotOff className="h-3 w-3" />}
                        accent="#fbbf24"
                    />
                    {currentUser && (
                        <FilterChip
                            active={filter === "mine"}
                            onClick={() => setFilter("mine")}
                            label="Mías"
                            count={counts.mine}
                            icon={<UserCheck className="h-3 w-3" />}
                            accent="#a78bfa"
                        />
                    )}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-2 py-2">
                {filtered.length === 0 ? (
                    <ListEmptyState hasConversations={conversations.length > 0} />
                ) : (
                    <div className="space-y-1">
                        {filtered.map((c) => (
                            <ConversationItem
                                key={c.id}
                                conversation={c}
                                selected={c.id === selectedId}
                                onClick={() => onSelect(c.id)}
                                typing={typingMap?.get(c.id)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function ListHeader({ total }: { total: number }) {
    return (
        <div className="shrink-0 border-b border-white/[0.05] px-5 pt-5 pb-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <div
                        className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/[0.08]"
                        style={{
                            background:
                                "linear-gradient(135deg, rgba(255,215,0,0.12), rgba(255,215,0,0.12))",
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
                <div className="flex items-center gap-1.5">
                    <div className="rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-1">
                        <span className="text-[10px] font-black tracking-widest text-gray-300 font-mono">
                            {total}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SearchInput({
    value,
    onChange,
}: {
    value: string;
    onChange: (v: string) => void;
}) {
    return (
        <div className="group relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-600 transition-colors group-focus-within:text-[#FFD700]" />
            <input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Buscar nombre, teléfono…"
                className="w-full rounded-xl border border-white/[0.06] bg-white/[0.02] pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-gray-600 focus:border-[#FFD700]/40 focus:bg-white/[0.04] focus:outline-none transition-all"
            />
        </div>
    );
}

function ListEmptyState({ hasConversations }: { hasConversations: boolean }) {
    return (
        <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
            <div
                className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.06]"
                style={{
                    background: "linear-gradient(135deg, rgba(255,215,0,0.06), rgba(255,215,0,0.06))",
                }}
            >
                <MessageSquare className="h-6 w-6 text-gray-600" />
            </div>
            <p className="text-xs leading-relaxed text-gray-600 max-w-[200px]">
                {hasConversations
                    ? "Ninguna conversación coincide con el filtro."
                    : "Cuando un cliente escriba al WhatsApp, aparecerá aquí."}
            </p>
        </div>
    );
}
