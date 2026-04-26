"use server";

import { validateAdminSession } from "@/lib/actions";
import { supabaseCrmAdmin } from "@/lib/supabase/crm/server";
import { auth as getSession } from "@/auth";
import { revalidatePath } from "next/cache";
import type {
    ActionResult,
    Contact,
    Conversation,
    ConversationWithContact,
    Message,
} from "../types";

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
        .select("*")
        .eq("conversation_id", conversationId)
        .order("sent_at", { ascending: true })
        .limit(500);

    if (error) {
        console.error("[chats:messages]", error);
        return [];
    }
    return (data ?? []) as Message[];
}

export async function sendHumanMessage(
    conversationId: string,
    text: string,
): Promise<ActionResult<Message>> {
    const session = await validateAdminSession();
    if (!session.valid) return { error: "NO AUTORIZADO." };

    const content = text.trim();
    if (!content) return { error: "EL MENSAJE NO PUEDE ESTAR VACÍO." };

    const { data, error } = await supabaseCrmAdmin
        .from("messages")
        .insert({
            conversation_id: conversationId,
            role: "human",
            content,
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
                body: JSON.stringify({ to: phone, text: content }),
            }).catch((e) =>
                console.error("[chats:sendHuman] bot /send falló:", e.message),
            );
        }
    } else {
        console.warn("[chats:sendHuman] BOT_URL o REVALIDATE_SECRET no configurados — mensaje solo en DB");
    }

    revalidatePath("/admin/chats");
    return { success: true, data: data as Message };
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

    revalidatePath("/admin/chats");
    return { success: true, data: data as Conversation };
}
