"use client";

import { useCallback, useEffect, useState } from "react";
import type { EventType, EventWithContact } from "@/lib/crm/types";
import { listEvents, type EventsFilter } from "@/lib/crm/actions/events";
import { useRealtime } from "./RealtimeProvider";

/**
 * Historial global de eventos. Aplica filtros server-side; los nuevos eventos
 * que matchean el filtro se prependen al list. Reset → refetch.
 */
export function useEventsRealtime(filter: EventsFilter = {}) {
    const { onTable, onReset } = useRealtime();
    const [events, setEvents] = useState<EventWithContact[] | null>(null);

    const refetch = useCallback(async () => {
        const data = await listEvents(filter);
        setEvents(data);
    }, [filter.actor, filter.type, filter.contactId, filter.fromDate, filter.limit]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        setEvents(null);
        refetch();
    }, [refetch]);

    useEffect(() => onReset(refetch), [onReset, refetch]);

    useEffect(
        () =>
            onTable<EventWithContact>("events", (e) => {
                if (e.eventType === "INSERT") {
                    const ev = e.new;
                    // Filtros client-side (no podemos hacer un join contacto al instante)
                    if (filter.actor && ev.actor !== filter.actor) return;
                    if (filter.type && ev.type !== (filter.type as EventType)) return;
                    if (filter.contactId && ev.contact_id !== filter.contactId) return;
                    setEvents((prev) =>
                        prev
                            ? [ev, ...prev.filter((x) => x.id !== ev.id)].slice(0, filter.limit ?? 200)
                            : [ev],
                    );
                } else if (e.eventType === "DELETE") {
                    const old = e.old as Partial<EventWithContact>;
                    if (!old?.id) return;
                    setEvents((prev) => (prev ? prev.filter((x) => x.id !== old.id) : prev));
                }
            }),
        [onTable, filter.actor, filter.type, filter.contactId, filter.limit],
    );

    return { events, refetch };
}
