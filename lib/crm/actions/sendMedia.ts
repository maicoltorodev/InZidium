"use server";

import { validateAdminSession } from "@/lib/alliance/actions";
import { supabaseCrmAdmin } from "@/lib/supabase/crm/server";
import { revalidatePath } from "next/cache";
import type { ActionResult, MediaType, Message, WaMessageType } from "../types";
import { currentAdminId } from "./_helpers";
import { logEvent } from "./events";

const MEDIA_BUCKET = "inzidium-whatsapp-media";
const MAX_BYTES = 16 * 1024 * 1024; // 16 MB — coincide con límite WhatsApp para video/doc

/**
 * Detecta el tipo WA y MediaType a partir del mime.
 * Devuelve null si el mime no se mapea a un tipo soportado por WA outbound.
 */
function classifyMime(mime: string): { waType: WaMessageType; mediaType: MediaType } | null {
    const m = mime.toLowerCase();
    if (m.startsWith("image/")) {
        if (m.includes("webp")) return { waType: "sticker", mediaType: "sticker" };
        return { waType: "image", mediaType: "image" };
    }
    if (m.startsWith("audio/")) return { waType: "audio", mediaType: "audio" };
    if (m.startsWith("video/")) return { waType: "video", mediaType: "video" };
    if (
        m === "application/pdf" ||
        m.includes("officedocument") ||
        m.includes("msword") ||
        m.includes("excel") ||
        m.includes("spreadsheet") ||
        m.includes("powerpoint") ||
        m === "text/plain"
    ) {
        return { waType: "document", mediaType: "document" };
    }
    return null;
}

function safeFilename(name: string): string {
    return name
        .normalize("NFKD")
        .replace(/[^\w.\-]+/g, "_")
        .slice(0, 120);
}

/**
 * Server action: agente humano envía un archivo al cliente.
 * 1. Sube a Supabase Storage
 * 2. Inserta en contact_media
 * 3. Inserta en messages (status='pending')
 * 4. Llama al bot /send-media (fire-and-forget)
 *
 * El bot completa la firma de la URL, manda a WA y updatea status/wa_message_id.
 */
export async function sendHumanMedia(
    conversationId: string,
    file: File,
    caption?: string,
    replyToWaMessageId?: string,
): Promise<ActionResult<Message>> {
    const session = await validateAdminSession();
    if (!session.valid) return { error: "NO AUTORIZADO." };

    if (!file || file.size === 0) return { error: "ARCHIVO VACÍO." };
    if (file.size > MAX_BYTES) return { error: `MÁXIMO ${MAX_BYTES / 1024 / 1024}MB.` };

    const mime = file.type || "application/octet-stream";
    const classified = classifyMime(mime);
    if (!classified) return { error: `TIPO NO SOPORTADO POR WHATSAPP: ${mime}` };

    // Resolver contacto + phone via la conversación
    const { data: convRow, error: convErr } = await supabaseCrmAdmin
        .from("conversations")
        .select("id, contact:contacts(id, phone)")
        .eq("id", conversationId)
        .maybeSingle();

    if (convErr || !convRow) return { error: "CONVERSACIÓN NO ENCONTRADA." };
    const contactRaw = convRow.contact as unknown;
    const contact = (Array.isArray(contactRaw) ? contactRaw[0] : contactRaw) as
        | { id: string; phone: string }
        | null
        | undefined;
    if (!contact) return { error: "CONTACTO NO ENCONTRADO." };

    // 1) Upload a Storage
    const cleanName = safeFilename(file.name || `archivo.${classified.mediaType}`);
    const storagePath = `${contact.phone}/human_${Date.now()}_${cleanName}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const { error: upErr } = await supabaseCrmAdmin.storage
        .from(MEDIA_BUCKET)
        .upload(storagePath, buffer, { contentType: mime, upsert: false });

    if (upErr) {
        console.error("[sendHumanMedia:upload]", upErr);
        return { error: "NO SE PUDO SUBIR EL ARCHIVO." };
    }

    // 2) Insert en contact_media
    const { data: mediaRow, error: mediaErr } = await supabaseCrmAdmin
        .from("contact_media")
        .insert({
            contact_id: contact.id,
            phone: contact.phone,
            media_type: classified.mediaType,
            mime,
            storage_path: storagePath,
            size_bytes: file.size,
            original_filename: file.name || null,
            caption: caption ?? null,
        })
        .select()
        .single();

    if (mediaErr || !mediaRow) {
        console.error("[sendHumanMedia:contact_media]", mediaErr);
        await supabaseCrmAdmin.storage.from(MEDIA_BUCKET).remove([storagePath]);
        return { error: "NO SE PUDO REGISTRAR EL ARCHIVO." };
    }

    const author = await currentAdminId();

    // 3) Insert en messages (status pending hasta que el bot confirme)
    const { data: msgRow, error: msgErr } = await supabaseCrmAdmin
        .from("messages")
        .insert({
            conversation_id: conversationId,
            role: "human",
            content: caption ?? null,
            wa_type: classified.waType,
            status: "pending",
            media_id: mediaRow.id,
            reply_to_wa_id: replyToWaMessageId ?? null,
            metadata: file.name ? { original_filename: file.name } : {},
            created_by: author,
        })
        .select()
        .single();

    if (msgErr || !msgRow) {
        console.error("[sendHumanMedia:message]", msgErr);
        return { error: "NO SE PUDO REGISTRAR EL MENSAJE." };
    }

    await supabaseCrmAdmin
        .from("conversations")
        .update({ last_message_at: new Date().toISOString() })
        .eq("id", conversationId);

    logEvent({
        type: "message.human_sent",
        actor: author,
        contactId: contact.id,
        conversationId,
        targetId: msgRow.id,
        payload: {
            wa_type: classified.waType,
            filename: file.name ?? null,
            size: file.size,
            caption: caption?.slice(0, 80) ?? null,
        },
    });

    // 4) Disparar bot /send-media (fire-and-forget)
    const botUrl = process.env.BOT_URL;
    const secret = process.env.REVALIDATE_SECRET;
    if (botUrl && secret) {
        fetch(`${botUrl.replace(/\/$/, "")}/send-media`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Revalidate-Secret": secret,
            },
            body: JSON.stringify({
                to: contact.phone,
                mediaId: mediaRow.id,
                messageId: msgRow.id,
                type: classified.waType,
                caption: caption ?? undefined,
                filename: file.name ?? undefined,
                replyToWaMessageId: replyToWaMessageId ?? undefined,
            }),
        }).catch((e) =>
            console.error("[sendHumanMedia] bot /send-media falló:", e.message),
        );
    } else {
        console.warn("[sendHumanMedia] BOT_URL o REVALIDATE_SECRET no configurados");
    }

    revalidatePath("/admin/chats");

    // Devolvemos el mensaje + media + signed URL para optimistic UI
    const { data: signed } = await supabaseCrmAdmin.storage
        .from(MEDIA_BUCKET)
        .createSignedUrl(storagePath, 3600);

    const enriched: Message = {
        ...(msgRow as Message),
        media: { ...mediaRow, signed_url: signed?.signedUrl ?? null },
    };

    return { success: true, data: enriched };
}
