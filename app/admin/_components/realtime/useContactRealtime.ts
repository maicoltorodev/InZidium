"use client";

import { useEffect, useState } from "react";
import type { Contact } from "@/lib/crm/types";
import { useRealtime } from "./RealtimeProvider";

/**
 * Mantiene el state de UN contacto sincronizado. Se inicializa con el snapshot
 * provisto por el padre (que ya lo tiene de otro hook tipo conversaciones) y
 * escucha UPDATE en contacts para reaccionar a cambios (nombre, ai_enabled, notes...).
 */
export function useContactRealtime(initial: Contact): Contact {
    const { onTable } = useRealtime();
    const [contact, setContact] = useState<Contact>(initial);

    useEffect(() => {
        setContact(initial);
    }, [initial.id]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(
        () =>
            onTable<Contact>("contacts", (e) => {
                if (e.eventType === "UPDATE" && e.new.id === contact.id) {
                    setContact((prev) => ({ ...prev, ...e.new }));
                }
            }),
        [onTable, contact.id],
    );

    return contact;
}
