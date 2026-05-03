"use client";

import { MessageSquare, Search, Bot, BotOff, Inbox, MessageCircle, UserCheck, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import type { ConversationWithContact } from "@/lib/crm/types";
import { ConversationItem } from "./ConversationItem";
import { useConversationFilters, type Filter, type FilterCounts } from "./list/useConversationFilters";
import { ResetButton } from "./dev/ResetButton";
import type { TypingState } from "./typing/useGlobalTyping";

type Props = {
    conversations: ConversationWithContact[];
    selectedId: string | null;
    onSelect: (id: string) => void;
    typingMap?: Map<string, TypingState>;
};

export function ConversationsList({ conversations, selectedId, onSelect, typingMap }: Props) {
    const { data: session } = useSession();
    const sessionUser = session?.user as { username?: string; id?: string } | undefined;
    const currentUser =
        sessionUser?.username ??
        sessionUser?.id ??
        null;

    const { search, setSearch, filter, setFilter, counts, filtered } =
        useConversationFilters(conversations, currentUser);

    return (
        <div className="flex flex-1 min-h-0 flex-col">
            <ListHeader total={counts.all} />

            <div className="shrink-0 px-5 pt-4 pb-4">
                <SearchInput value={search} onChange={setSearch} />

                <div className="mt-3">
                    <FilterCycler
                        filter={filter}
                        setFilter={setFilter}
                        counts={counts}
                        currentUser={currentUser}
                    />
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

// ─── Filter cycler ────────────────────────────────────────────────────────────

type FilterDef = {
    key: Filter;
    label: string;
    accent: string;
    icon: React.ReactNode;
};

const ALL_FILTERS: FilterDef[] = [
    { key: "attention",  label: "Requieren atención", accent: "#f87171",               icon: <AlertCircle className="h-3 w-3" /> },
    { key: "all",        label: "Todos",              accent: "rgba(255,255,255,0.55)", icon: <Inbox className="h-3 w-3" /> },
    { key: "unanswered", label: "Sin responder",      accent: "#34d399",               icon: <MessageCircle className="h-3 w-3" /> },
    { key: "ai",         label: "IA",                 accent: "#22d3ee",               icon: <Bot className="h-3 w-3" /> },
    { key: "manual",     label: "Manual",             accent: "#a855f7",               icon: <BotOff className="h-3 w-3" /> },
    { key: "mine",       label: "Mías",               accent: "#a78bfa",               icon: <UserCheck className="h-3 w-3" /> },
];

function FilterCycler({
    filter,
    setFilter,
    counts,
    currentUser,
}: {
    filter: Filter;
    setFilter: (f: Filter) => void;
    counts: FilterCounts;
    currentUser: string | null;
}) {
    const filters = currentUser ? ALL_FILTERS : ALL_FILTERS.filter((f) => f.key !== "mine");
    const idx = filters.findIndex((f) => f.key === filter);
    const current = filters[idx] ?? filters[0];
    const accent = current.accent;

    function prev() {
        setFilter(filters[(idx - 1 + filters.length) % filters.length].key);
    }
    function next() {
        setFilter(filters[(idx + 1) % filters.length].key);
    }

    return (
        <div className="flex items-center gap-2">
            <button
                onClick={prev}
                aria-label="Filtro anterior"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.02] text-gray-500 transition hover:border-white/[0.1] hover:text-gray-300 active:scale-95"
            >
                <ChevronLeft className="h-4 w-4" />
            </button>

            <div
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border px-3 py-2 transition-all duration-200"
                style={{
                    borderColor: `color-mix(in srgb, ${accent} 25%, transparent)`,
                    background: `color-mix(in srgb, ${accent} 8%, transparent)`,
                }}
            >
                <span style={{ color: accent }}>{current.icon}</span>
                <span
                    className="text-[10px] font-black uppercase tracking-[0.15em]"
                    style={{ color: accent }}
                >
                    {current.label}
                </span>
                <span
                    className="font-mono text-[10px] font-bold tabular-nums"
                    style={{ color: accent, opacity: 0.6 }}
                >
                    {counts[current.key]}
                </span>
            </div>

            <button
                onClick={next}
                aria-label="Filtro siguiente"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.02] text-gray-500 transition hover:border-white/[0.1] hover:text-gray-300 active:scale-95"
            >
                <ChevronRight className="h-4 w-4" />
            </button>
        </div>
    );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ListHeader({ total }: { total: number }) {
    return (
        <div className="shrink-0 border-b border-white/[0.05] px-5 pt-5 pb-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <div
                        className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/[0.08]"
                        style={{
                            background:
                                "linear-gradient(135deg, rgba(34,211,238,0.12), rgba(168,85,247,0.12))",
                        }}
                    >
                        <Inbox className="h-4 w-4 text-white" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">
                        Bandeja
                    </p>
                </div>
                <div className="flex items-center gap-1.5">
                    <ResetButton />
                    <div
                        className="relative flex h-8 w-8 items-center justify-center rounded-xl"
                        style={{
                            background: "linear-gradient(135deg, rgba(34,211,238,0.15), rgba(168,85,247,0.06))",
                            border: "1px solid rgba(34,211,238,0.25)",
                            boxShadow: "0 0 12px rgba(34,211,238,0.15), inset 0 1px 0 rgba(34,211,238,0.1)",
                        }}
                    >
                        <span className="text-xs font-black tabular-nums text-neon-cyan">
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
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-600 transition-colors group-focus-within:text-neon-cyan" />
            <input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Buscar nombre, teléfono…"
                className="w-full rounded-xl border border-white/[0.06] bg-white/[0.02] pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-gray-600 focus:border-neon-cyan/40 focus:bg-white/[0.04] focus:outline-none transition-all"
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
                    background: "linear-gradient(135deg, rgba(34,211,238,0.06), rgba(168,85,247,0.06))",
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
