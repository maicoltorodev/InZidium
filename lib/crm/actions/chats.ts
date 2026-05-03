"use server";

import { validateAdminSession } from "@/lib/alliance/actions";
import { supabaseCrmAdmin } from "@/lib/supabase/crm/server";
import { auth as getSession } from "@/auth";
import { revalidatePath } from "next/cache";
import type {
    ActionResult,
    Contact,
    ContactMedia,
    Conversation,
    ConversationWithContact,
    MediaType,
    Message,
} from "../types";
import { currentAdminId } from "./_helpers";
import { logEvent } from "./events";

const MEDIA_BUCKET = "inzidium-whatsapp-media";
const SIGNED_URL_TTL = 60 * 60; // 1h

async function signMediaUrl(storagePath: string): Promise<string | null> {
    const { data, error } = await supabaseCrmAdmin.storage
        .from(MEDIA_BUCKET)
        .createSignedUrl(storagePath, SIGNED_URL_TTL);
    if (error || !data) return null;
    return data.signedUrl;
}

/**
 * Lista conversations (status=open) con datos del contacto y preview del último mensaje.
 *
 * 2 queries: conversations+contact, últimos N mensajes. Asocia en JS.
 * Para v1 con <100 convs activas es suficiente; escalamos con RPC si hace falta.
 */
export async function listConversations(): Promise<ConversationWithContact[]> {
    const session = await validateAdminSession();
    if (!session.valid) return [];

    const { data: convs, error } = await supabaseCrmAdmin
        .from("conversations")
        .select("*, contact:contacts(*)")
        .eq("status", "open")
        .order("last_message_at", { ascending: false, nullsFirst: false })
        .limit(200);

    if (error) {
        console.error("[chats:list]", error);
        return [];
    }
    if (!convs || convs.length === 0) return [];

    const convIds = convs.map((c: any) => c.id);
    const { data: lastMsgs } = await supabaseCrmAdmin
        .from("messages")
        .select("conversation_id, content, role, sent_at")
        .in("conversation_id", convIds)
        .order("sent_at", { ascending: false })
        .limit(2000);

    const byConv = new Map<string, { content: string | null; role: Message["role"] }>();
    for (const m of lastMsgs ?? []) {
        if (!byConv.has(m.conversation_id)) {
            byConv.set(m.conversation_id, { content: m.content, role: m.role });
        }
    }

    return convs.map((c: any) => ({
        ...c,
        last_message_preview: byConv.get(c.id)?.content ?? null,
        last_message_role: byConv.get(c.id)?.role ?? null,
    })) as ConversationWithContact[];
}

export async function getConversationMessages(
    conversationId: string,
): Promise<Message[]> {
    const session = await validateAdminSession();
    if (!session.valid) return [];

    const { data, error } = await supabaseCrmAdmin
        .from("messages")
        .select("*, media:contact_media(*)")
        .eq("conversation_id", conversationId)
        .order("sent_at", { ascending: true })
        .order("seq", { ascending: true })
        .limit(500);

    if (error) {
        console.error("[chats:messages]", error);
        return [];
    }

    const rows = (data ?? []) as Message[];

    // Adjuntar signed URLs a media + reply_preview lookups
    const replyTargets = Array.from(
        new Set(rows.map((r) => r.reply_to_wa_id).filter(Boolean) as string[]),
    );
    let replyMap = new Map<string, { role: Message["role"]; content: string | null; wa_type: Message["wa_type"] }>();
    if (replyTargets.length > 0) {
        const { data: parents } = await supabaseCrmAdmin
            .from("messages")
            .select("wa_message_id, role, content, wa_type")
            .in("wa_message_id", replyTargets);
        for (const p of parents ?? []) {
            if (p.wa_message_id) {
                replyMap.set(p.wa_message_id, { role: p.role, content: p.content, wa_type: p.wa_type });
            }
        }
    }

    const enriched = await Promise.all(
        rows.map(async (m) => {
            const media = (m as any).media as ContactMedia | null;
            let signedUrl: string | null = null;
            if (media?.storage_path) signedUrl = await signMediaUrl(media.storage_path);
            const reply_preview = m.reply_to_wa_id ? replyMap.get(m.reply_to_wa_id) ?? null : null;
            return {
                ...m,
                media: media ? { ...media, signed_url: signedUrl } : null,
                reply_preview,
            } as Message;
        }),
    );

    return enriched;
}

/**
 * Devuelve un signed URL fresco para una pieza de media.
 * El cliente lo llama bajo demanda (lightbox, audio play) si la URL expiró.
 */
export async function refreshMediaUrl(mediaId: string): Promise<string | null> {
    const session = await validateAdminSession();
    if (!session.valid) return null;
    const { data, error } = await supabaseCrmAdmin
        .from("contact_media")
        .select("storage_path")
        .eq("id", mediaId)
        .maybeSingle();
    if (error || !data) return null;
    return await signMediaUrl(data.storage_path);
}

/**
 * Galería completa de media de un contacto, opcionalmente filtrada por tipo.
 */
export async function listContactMedia(
    contactId: string,
    opts: { type?: MediaType; limit?: number } = {},
): Promise<ContactMedia[]> {
    const session = await validateAdminSession();
    if (!session.valid) return [];

    let q = supabaseCrmAdmin.from("contact_media").select("*").eq("contact_id", contactId);
    if (opts.type) q = q.eq("media_type", opts.type);
    q = q.order("created_at", { ascending: false }).limit(opts.limit ?? 200);
    const { data, error } = await q;
    if (error) {
        console.error("[chats:gallery]", error);
        return [];
    }
    const rows = (data ?? []) as ContactMedia[];
    const withUrls = await Promise.all(
        rows.map(async (r) => ({ ...r, signed_url: await signMediaUrl(r.storage_path) })),
    );
    return withUrls;
}

export async function sendHumanMessage(
    conversationId: string,
    text: string,
    replyToWaMessageId?: string,
): Promise<ActionResult<Message>> {
    const session = await validateAdminSession();
    if (!session.valid) return { error: "NO AUTORIZADO." };

    const content = text.trim();
    if (!content) return { error: "EL MENSAJE NO PUEDE ESTAR VACÍO." };

    const author = await currentAdminId();

    // Insert con status='pending' para que el CRM muestre "enviando..." al instante.
    // El bot (vía POST /send) lo actualiza a 'sent'/'failed' con el wa_message_id real.
    const { data, error } = await supabaseCrmAdmin
        .from("messages")
        .insert({
            conversation_id: conversationId,
            role: "human",
            content,
            wa_type: "text",
            status: "pending",
            reply_to_wa_id: replyToWaMessageId ?? null,
            created_by: author,
        })
        .select()
        .single();

    if (error || !data) {
        console.error("[chats:sendHuman]", error);
        return { error: "NO SE PUDO GUARDAR EL MENSAJE." };
    }

    await supabaseCrmAdmin
        .from("conversations")
        .update({ last_message_at: new Date().toISOString() })
        .eq("id", conversationId);

    const botUrl = process.env.BOT_URL;
    const secret = process.env.REVALIDATE_SECRET;
    if (botUrl && secret) {
        const { data: conv } = await supabaseCrmAdmin
            .from("conversations")
            .select("contact:contacts(phone)")
            .eq("id", conversationId)
            .single();

        const phone = (conv?.contact as any)?.phone as string | undefined;
        if (phone) {
            fetch(`${botUrl.replace(/\/$/, "")}/send`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Revalidate-Secret": secret,
                },
                body: JSON.stringify({
                    to: phone,
                    text: content,
                    messageId: data.id,
                    replyToWaMessageId: replyToWaMessageId ?? undefined,
                }),
            }).catch((e) =>
                console.error("[chats:sendHuman] bot /send falló:", e.message),
            );
        }
    } else {
        console.warn("[chats:sendHuman] BOT_URL o REVALIDATE_SECRET no configurados — mensaje solo en DB");
    }

    // Trazabilidad
    const { data: contactRow } = await supabaseCrmAdmin
        .from("conversations")
        .select("contact_id")
        .eq("id", conversationId)
        .maybeSingle();
    logEvent({
        type: "message.human_sent",
        actor: author,
        contactId: contactRow?.contact_id ?? null,
        conversationId,
        targetId: data.id,
        payload: { wa_type: "text", preview: content.slice(0, 80) },
    });

    revalidatePath("/admin/chats");
    return { success: true, data: data as Message };
}

/**
 * Marca todos los mensajes nuevos de la conversación como vistos (unread_count=0).
 * El trigger de DB ya lo resetea al insertar respuesta de IA/humano, pero esto sirve
 * para cuando un admin abre el chat sin responder (lectura pasiva).
 */
export async function markConversationRead(
    conversationId: string,
): Promise<ActionResult<{ id: string }>> {
    const session = await validateAdminSession();
    if (!session.valid) return { error: "NO AUTORIZADO." };

    const { error } = await supabaseCrmAdmin
        .from("conversations")
        .update({ unread_count: 0 })
        .eq("id", conversationId);

    if (error) {
        console.error("[chats:markRead]", error);
        return { error: "NO SE PUDO MARCAR COMO LEÍDO." };
    }
    return { success: true, data: { id: conversationId } };
}

export async function toggleAIForContact(
    contactId: string,
    enabled: boolean,
): Promise<ActionResult<Contact>> {
    const session = await validateAdminSession();
    if (!session.valid) return { error: "NO AUTORIZADO." };

    const { data, error } = await supabaseCrmAdmin
        .from("contacts")
        .update({ ai_enabled: enabled })
        .eq("id", contactId)
        .select()
        .single();

    if (error || !data) {
        console.error("[chats:toggleAI]", error);
        return { error: "NO SE PUDO ACTUALIZAR." };
    }

    const author = await currentAdminId();
    logEvent({
        type: "ai.toggled",
        actor: author,
        contactId,
        targetId: contactId,
        payload: { enabled },
    });

    revalidatePath("/admin/chats");
    return { success: true, data: data as Contact };
}

export async function assignConversationToMe(
    conversationId: string,
): Promise<ActionResult<Conversation>> {
    const session = await validateAdminSession();
    if (!session.valid) return { error: "NO AUTORIZADO." };

    const userSession = await getSession();
    const assignee =
        ((userSession?.user as any)?.username as string | undefined) ??
        ((userSession?.user as any)?.id as string | undefined) ??
        null;

    const { data, error } = await supabaseCrmAdmin
        .from("conversations")
        .update({ assigned_to: assignee })
        .eq("id", conversationId)
        .select()
        .single();

    if (error || !data) {
        console.error("[chats:assign]", error);
        return { error: "NO SE PUDO ASIGNAR." };
    }

    logEvent({
        type: "conversation.assigned",
        actor: assignee ?? "admin",
        contactId: data.contact_id,
        conversationId,
        targetId: conversationId,
        payload: { assignee },
    });

    revalidatePath("/admin/chats");
    return { success: true, data: data as Conversation };
}
