"use client";

import { useCallback, useEffect, useState } from "react";
import type { ContactMedia } from "@/lib/crm/types";
import { listContactMedia, refreshMediaUrl } from "@/lib/crm/actions/chats";
import { useRealtime } from "./RealtimeProvider";

/**
 * Galería de archivos del contacto siempre actualizada.
 * Maneja INSERT/UPDATE/DELETE en contact_media filtrando por contact_id, y broadcast `crm.reset`.
 */
export function useContactMediaRealtime(contactId: string | null) {
    const { onTable, onReset } = useRealtime();
    const [items, setItems] = useState<ContactMedia[] | null>(null);

    const refetch = useCallback(async () => {
        if (!contactId) {
            setItems([]);
            return;
        }
        const data = await listContactMedia(contactId, { limit: 200 });
        setItems(data);
    }, [contactId]);

    useEffect(() => {
        if (!contactId) {
            setItems([]);
            return;
        }
        setItems(null);
        refetch();
    }, [contactId, refetch]);

    useEffect(() => onReset(refetch), [onReset, refetch]);

    useEffect(
        () =>
            onTable<ContactMedia>("contact_media", async (e) => {
                if (!contactId) return;
                if (e.eventType === "INSERT") {
                    if (e.new.contact_id !== contactId) return;
                    const signed = await refreshMediaUrl(e.new.id);
                    setItems((prev) =>
                        prev
                            ? [{ ...e.new, signed_url: signed }, ...prev.filter((m) => m.id !== e.new.id)]
                            : [{ ...e.new, signed_url: signed }],
                    );
                } else if (e.eventType === "UPDATE") {
                    if (e.new.contact_id !== contactId) return;
                    setItems((prev) =>
                        prev ? prev.map((m) => (m.id === e.new.id ? { ...m, ...e.new } : m)) : prev,
                    );
                } else if (e.eventType === "DELETE") {
                    const old = e.old as Partial<ContactMedia>;
                    if (!old?.id) return;
                    setItems((prev) => (prev ? prev.filter((m) => m.id !== old.id) : prev));
                }
            }),
        [onTable, contactId],
    );

    return { items, refetch };
}
