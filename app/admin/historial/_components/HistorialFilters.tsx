"use client";

import type { EventType } from "@/lib/crm/types";
import { EVENT_DESCRIPTORS } from "./eventDescriptors";

const ALL_TYPES: EventType[] = [
    "message.human_sent",
    "message.template_sent",
    "ai.toggled",
    "conversation.assigned",
    "conversation.status_changed",
    "order.created",
    "order.status_changed",
    "order.deleted",
    "contact.note_updated",
];

type Props = {
    actor: string;
    type: EventType | "";
    actors: string[];
    onActorChange: (a: string) => void;
    onTypeChange: (t: EventType | "") => void;
};

export function HistorialFilters({ actor, type, actors, onActorChange, onTypeChange }: Props) {
    return (
        <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
            <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                    Admin
                </span>
                <select
                    value={actor}
                    onChange={(e) => onActorChange(e.target.value)}
                    className="rounded-lg border border-white/[0.06] bg-white/[0.04] px-2.5 py-1.5 text-xs text-white focus:border-[#FFD700]/40 focus:outline-none"
                >
                    <option value="">Todos</option>
                    {actors.map((a) => (
                        <option key={a} value={a}>
                            {a}
                        </option>
                    ))}
                </select>
            </div>
            <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                    Tipo
                </span>
                <select
                    value={type}
                    onChange={(e) => onTypeChange(e.target.value as EventType | "")}
                    className="rounded-lg border border-white/[0.06] bg-white/[0.04] px-2.5 py-1.5 text-xs text-white focus:border-[#FFD700]/40 focus:outline-none"
                >
                    <option value="">Todos</option>
                    {ALL_TYPES.map((t) => (
                        <option key={t} value={t}>
                            {EVENT_DESCRIPTORS[t].label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}
