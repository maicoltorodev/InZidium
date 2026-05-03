"use server";

import { validateAdminSession } from "@/lib/actions";
import { supabaseCrmAdmin } from "@/lib/supabase/crm/server";
import { revalidatePath } from "next/cache";
import type { ActionResult } from "../types";

const MEDIA_BUCKET = "inzidium-whatsapp-media";
const CONFIRM_TOKEN = "RESET";

type ResetCounts = {
    messages: number;
    contactMedia: number;
    conversations: number;
    contacts: number;
    storageFiles: number;
};

/**
 * 🚨 TEMPORAL — borra todos los chats, contactos y archivos del CRM.
 * Debe pasarse `confirmation = "RESET"` literal para evitar disparos accidentales.
 *
 * Orden de borrado por dependencias FK:
 *   messages → contact_media → conversations → contacts
 *
 * Después limpia el bucket de Storage.
 */
export async function resetAllCrmData(confirmation: string): Promise<ActionResult<ResetCounts>> {
    const session = await validateAdminSession();
    if (!session.valid) return { error: "NO AUTORIZADO." };

    if (confirmation.trim().toUpperCase() !== CONFIRM_TOKEN) {
        return { error: `Confirmación inválida. Escribí ${CONFIRM_TOKEN}.` };
    }

    const counts: ResetCounts = {
        messages: 0,
        contactMedia: 0,
        conversations: 0,
        contacts: 0,
        storageFiles: 0,
    };

    try {
        // 1) DB en orden de dependencias inversas
        const tables = [
            { name: "messages", key: "messages" as const },
            { name: "contact_media", key: "contactMedia" as const },
            { name: "conversations", key: "conversations" as const },
            { name: "contacts", key: "contacts" as const },
        ];
        for (const t of tables) {
            // Filtro universal: todas las tablas tienen `id` UUID NOT NULL.
            // No usamos `created_at` porque `messages` tiene `sent_at` en su lugar.
            const { count, error } = await supabaseCrmAdmin
                .from(t.name)
                .delete({ count: "exact" })
                .not("id", "is", null);
            if (error) throw new Error(`${t.name}: ${error.message}`);
            counts[t.key] = count ?? 0;
        }

        // 2) Storage — listar carpetas (cada phone es una carpeta) y borrar archivos dentro
        const { data: rootFolders, error: listErr } = await supabaseCrmAdmin.storage
            .from(MEDIA_BUCKET)
            .list("", { limit: 1000 });
        if (!listErr && rootFolders) {
            for (const folder of rootFolders) {
                if (folder.id) continue; // es file en root, no carpeta
                const { data: files } = await supabaseCrmAdmin.storage
                    .from(MEDIA_BUCKET)
                    .list(folder.name, { limit: 10000 });
                if (files && files.length > 0) {
                    const paths = files.map((f) => `${folder.name}/${f.name}`);
                    const { error: rmErr } = await supabaseCrmAdmin.storage
                        .from(MEDIA_BUCKET)
                        .remove(paths);
                    if (!rmErr) counts.storageFiles += paths.length;
                }
            }
        }

        revalidatePath("/admin/chats");
        return { success: true, data: counts };
    } catch (e: any) {
        console.error("[reset]", e);
        return { error: e.message?.slice(0, 200) ?? "Error desconocido" };
    }
}
