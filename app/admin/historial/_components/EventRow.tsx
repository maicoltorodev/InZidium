"use client";

import Link from "next/link";
import type { Event, EventType, EventWithContact } from "@/lib/crm/types";
import { EVENT_DESCRIPTORS } from "./eventDescriptors";

type Props = {
    event: Event | EventWithContact;
    /** Cuando se renderiza en una vista por contacto, no mostramos el nombre del contacto. */
    showContact?: boolean;
};

export function EventRow({ event, showContact = false }: Props) {
    const descriptor = EVENT_DESCRIPTORS[event.type as EventType];
    if (!descriptor) return null;
    const Icon = descriptor.icon;
    const contactName =
        showContact && "contact" in event && event.contact
            ? event.contact.name?.trim() || event.contact.phone
            : null;

    return (
        <div className="group relative flex items-start gap-3 rounded-xl border border-white/[0.04] bg-white/[0.02] px-3 py-2.5 transition hover:border-white/[0.08] hover:bg-white/[0.04]">
            <div
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-white/[0.06]"
                style={{
                    background: `${descriptor.color}1A`,
                    boxShadow: `0 0 12px ${descriptor.color}22`,
                }}
            >
                <Icon className="h-3.5 w-3.5" style={{ color: descriptor.color }} />
            </div>

            <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                    <p className="text-xs leading-snug text-gray-200">
                        <span
                            className="font-bold"
                            style={{ color: descriptor.color }}
                        >
                            {event.actor}
                        </span>{" "}
                        <span className="text-gray-400">{descriptor.describe(event)}</span>
                    </p>
                    <span className="shrink-0 font-mono text-[10px] tabular-nums text-gray-600">
                        {formatTime(new Date(event.created_at))}
                    </span>
                </div>
                {contactName && event.contact_id && (
                    <Link
                        href={`/admin/chats?c=${event.contact_id}`}
                        className="mt-1 inline-flex items-center gap-1 rounded-md border border-white/[0.06] bg-white/[0.02] px-2 py-0.5 text-[10px] text-gray-400 transition hover:border-[#22d3ee]/30 hover:text-[#22d3ee]"
                    >
                        {contactName}
                    </Link>
                )}
            </div>
        </div>
    );
}

function formatTime(date: Date): string {
    const diff = Date.now() - date.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "ahora";
    if (mins < 60) return `${mins}m`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d`;
    return date.toLocaleDateString("es-CO", { day: "numeric", month: "short" });
}
