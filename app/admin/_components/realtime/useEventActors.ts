"use client";

import { useCallback, useEffect, useState } from "react";
import { listEventActors } from "@/lib/crm/actions/events";
import type { Event } from "@/lib/crm/types";
import { useRealtime } from "./RealtimeProvider";

/**
 * Lista de actores únicos que han generado eventos. Usado para poblar el dropdown
 * de filtro en /admin/historial. Se mantiene sincronizado: si llega un evento de
 * un actor nuevo, se agrega al set; con `crm:reset` se refetchea entero.
 */
export function useEventActors() {
    const { onTable, onReset } = useRealtime();
    const [actors, setActors] = useState<string[]>([]);

    const refetch = useCallback(async () => {
        const data = await listEventActors();
        setActors(data);
    }, []);

    useEffect(() => {
        refetch();
    }, [refetch]);

    useEffect(() => onReset(refetch), [onReset, refetch]);

    useEffect(
        () =>
            onTable<Event>("events", (e) => {
                if (e.eventType !== "INSERT") return;
                const actor = e.new.actor;
                if (!actor) return;
                setActors((prev) => (prev.includes(actor) ? prev : [...prev, actor]));
            }),
        [onTable],
    );

    return actors;
}
