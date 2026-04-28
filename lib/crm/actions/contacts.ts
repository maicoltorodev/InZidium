"use server";

import { validateAdminSession } from "@/lib/actions";
import { supabaseCrmAdmin } from "@/lib/supabase/crm/server";
import type { Contact } from "../types";

/**
 * Busca contactos por nombre o teléfono. Devuelve hasta 20 resultados.
 */
export async function searchContacts(query: string): Promise<Contact[]> {
    const session = await validateAdminSession();
    if (!session.valid) return [];

    const q = query.trim();
    let req = supabaseCrmAdmin.from("contacts").select("*").limit(20);
    if (q) {
        req = req.or(`name.ilike.%${q}%,phone.ilike.%${q}%`);
    }
    req = req.order("updated_at", { ascending: false });

    const { data, error } = await req;
    if (error) {
        console.error("[contacts:search]", error);
        return [];
    }
    return (data ?? []) as Contact[];
}
