"use server";

import { validateAdminSession } from "@/lib/alliance/actions";
import { supabaseCrmAdmin } from "@/lib/supabase/crm/server";
import type { Event, EventType, EventWithContact } from "../types";

export type LogEventInput = {
    type: EventType;
    actor: string;
    contactId?: string | null;
    conversationId?: string | null;
    targetId?: string | null;
    payload?: Record<string, unknown>;
};

/**
 * Inserta una fila en `events`. Fire-and-forget desde las actions que ya validaron sesión.
 * Si falla, solo logueamos en consola — no rompemos el flow del action principal.
 */
export async function logEvent(input: LogEventInput): Promise<void> {
    try {
        const { error } = await supabaseCrmAdmin.from("events").insert({
            type: input.type,
            actor: input.actor,
            contact_id: input.contactId ?? null,
            conversation_id: input.conversationId ?? null,
            target_id: input.targetId ?? null,
            payload: input.payload ?? {},
        });
        if (error) console.error("[events:log]", error.message, input.type);
    } catch (e: any) {
        console.error("[events:log] uncaught", e.message);
    }
}

/**
 * Lista los últimos eventos de un contacto (timeline en panel derecho).
 */
export async function listEventsForContact(
    contactId: string,
    limit: number = 100,
): Promise<Event[]> {
    const session = await validateAdminSession();
    if (!session.valid) return [];

    const { data, error } = await supabaseCrmAdmin
        .from("events")
        .select("*")
        .eq("contact_id", contactId)
        .order("created_at", { ascending: false })
        .limit(limit);
    if (error) {
        console.error("[events:contact]", error);
        return [];
    }
    return (data ?? []) as Event[];
}

export type EventsFilter = {
    actor?: string;
    type?: EventType;
    contactId?: string;
    fromDate?: string;
    limit?: number;
};

/**
 * Lista global de eventos para la página /admin/historial, con filtros opcionales.
 * Trae datos del contacto adjunto.
 */
export async function listEvents(filter: EventsFilter = {}): Promise<EventWithContact[]> {
    const session = await validateAdminSession();
    if (!session.valid) return [];

    let q = supabaseCrmAdmin
        .from("events")
        .select("*, contact:contacts(id, name, phone)");
    if (filter.actor) q = q.eq("actor", filter.actor);
    if (filter.type) q = q.eq("type", filter.type);
    if (filter.contactId) q = q.eq("contact_id", filter.contactId);
    if (filter.fromDate) q = q.gte("created_at", filter.fromDate);
    q = q.order("created_at", { ascending: false }).limit(filter.limit ?? 200);

    const { data, error } = await q;
    if (error) {
        console.error("[events:list]", error);
        return [];
    }
    return (data ?? []) as EventWithContact[];
}

/**
 * Devuelve la lista de actores distintos (usernames de admins) para poblar el filtro.
 */
export async function listEventActors(): Promise<string[]> {
    const session = await validateAdminSession();
    if (!session.valid) return [];

    const { data, error } = await supabaseCrmAdmin
        .from("events")
        .select("actor")
        .order("created_at", { ascending: false })
        .limit(1000);
    if (error) return [];
    const set = new Set<string>();
    for (const r of data ?? []) set.add((r as any).actor);
    return Array.from(set);
}
