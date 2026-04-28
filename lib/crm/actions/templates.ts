"use server";

import { validateAdminSession } from "@/lib/actions";
import { supabaseCrmAdmin } from "@/lib/supabase/crm/server";
import type { ActionResult, Message } from "../types";
import { currentAdminId } from "./_helpers";
import { logEvent } from "./events";

export type TemplateComponent = {
    type: "BODY" | "HEADER" | "FOOTER" | "BUTTONS" | string;
    text?: string;
    format?: string;
    example?: { body_text?: string[][]; header_text?: string[] };
    buttons?: Array<{ type: string; text: string }>;
};

export type WhatsAppTemplate = {
    id?: string;
    name: string;
    language: string;
    status: string; // 'APPROVED'
    category: string;
    components: TemplateComponent[];
};

/**
 * Lista templates aprobados desde el bot (proxy a Meta WABA).
 */
export async function listTemplates(): Promise<WhatsAppTemplate[]> {
    const session = await validateAdminSession();
    if (!session.valid) return [];

    const botUrl = process.env.BOT_URL;
    const secret = process.env.REVALIDATE_SECRET;
    if (!botUrl || !secret) return [];

    try {
        const res = await fetch(`${botUrl.replace(/\/$/, "")}/templates`, {
            headers: { "X-Revalidate-Secret": secret },
            cache: "no-store",
        });
        if (!res.ok) return [];
        const data = await res.json();
        return (data.templates ?? []) as WhatsAppTemplate[];
    } catch (e) {
        console.error("[templates:list]", e);
        return [];
    }
}

export type SendTemplateInput = {
    conversationId: string;
    templateName: string;
    language: string;
    parameters: string[];
    /** Texto ya renderizado del template para mostrar en el CRM. */
    renderedText: string;
};

/**
 * Envía un template al cliente. Inserta la fila messages localmente con status='pending',
 * el bot la actualiza con wa_message_id + status real.
 */
export async function sendTemplate(input: SendTemplateInput): Promise<ActionResult<Message>> {
    const session = await validateAdminSession();
    if (!session.valid) return { error: "NO AUTORIZADO." };

    if (!input.conversationId) return { error: "FALTA CONVERSACIÓN." };
    if (!input.templateName) return { error: "FALTA NOMBRE DEL TEMPLATE." };

    // Lookup phone
    const { data: conv } = await supabaseCrmAdmin
        .from("conversations")
        .select("contact:contacts(phone)")
        .eq("id", input.conversationId)
        .maybeSingle();
    const contactRaw = (conv as any)?.contact;
    const contact = (Array.isArray(contactRaw) ? contactRaw[0] : contactRaw) as
        | { phone?: string }
        | null
        | undefined;
    const phone = contact?.phone;
    if (!phone) return { error: "NO SE PUDO RESOLVER EL TELÉFONO." };

    const author = await currentAdminId();

    // Insert local con status pending
    const { data: msgRow, error: msgErr } = await supabaseCrmAdmin
        .from("messages")
        .insert({
            conversation_id: input.conversationId,
            role: "human",
            content: input.renderedText,
            wa_type: "template",
            status: "pending",
            created_by: author,
            metadata: {
                template_name: input.templateName,
                template_language: input.language,
                template_parameters: input.parameters,
            },
        })
        .select()
        .single();

    if (msgErr || !msgRow) return { error: "NO SE PUDO REGISTRAR EL MENSAJE." };

    await supabaseCrmAdmin
        .from("conversations")
        .update({ last_message_at: new Date().toISOString() })
        .eq("id", input.conversationId);

    // Trazabilidad: lookup contact_id
    const { data: convForEvent } = await supabaseCrmAdmin
        .from("conversations")
        .select("contact_id")
        .eq("id", input.conversationId)
        .maybeSingle();
    logEvent({
        type: "message.template_sent",
        actor: author,
        contactId: convForEvent?.contact_id ?? null,
        conversationId: input.conversationId,
        targetId: msgRow.id,
        payload: {
            template_name: input.templateName,
            language: input.language,
            params: input.parameters,
        },
    });

    // Disparar bot (fire-and-forget)
    const botUrl = process.env.BOT_URL;
    const secret = process.env.REVALIDATE_SECRET;
    if (botUrl && secret) {
        fetch(`${botUrl.replace(/\/$/, "")}/templates/send`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Revalidate-Secret": secret,
            },
            body: JSON.stringify({
                to: phone,
                templateName: input.templateName,
                language: input.language,
                parameters: input.parameters,
                messageId: msgRow.id,
            }),
        }).catch((e) => console.error("[sendTemplate] bot falló:", e.message));
    }

    return { success: true, data: msgRow as Message };
}
