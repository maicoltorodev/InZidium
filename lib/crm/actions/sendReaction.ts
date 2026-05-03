"use server";

import { validateAdminSession } from "@/lib/alliance/actions";
import { supabaseCrmAdmin } from "@/lib/supabase/crm/server";
import type { ActionResult } from "../types";
import { currentAdminId } from "./_helpers";

/**
 * Envía una reacción de emoji desde el agente humano hacia un mensaje específico.
 * - emoji='' (vacío) quita la reacción.
 * - El bot a su vez la transmite a Meta y la replica en messages.reactions.
 */
export async function sendHumanReaction(
    targetMessageId: string,
    emoji: string,
): Promise<ActionResult<{ emoji: string }>> {
    const session = await validateAdminSession();
    if (!session.valid) return { error: "NO AUTORIZADO." };

    // Lookup del mensaje para sacar wa_message_id + el phone del cliente
    const { data: msg, error: msgErr } = await supabaseCrmAdmin
        .from("messages")
        .select("wa_message_id, conversation:conversations(contact:contacts(phone))")
        .eq("id", targetMessageId)
        .maybeSingle();

    if (msgErr || !msg) return { error: "MENSAJE NO ENCONTRADO." };
    if (!msg.wa_message_id) return { error: "ESTE MENSAJE NO TIENE ID DE WHATSAPP TODAVÍA." };

    const convRaw = msg.conversation as unknown;
    const convNode = (Array.isArray(convRaw) ? convRaw[0] : convRaw) as
        | { contact?: { phone?: string } | { phone?: string }[] }
        | null
        | undefined;
    const contactRaw = convNode?.contact as unknown;
    const contactNode = (Array.isArray(contactRaw) ? contactRaw[0] : contactRaw) as
        | { phone?: string }
        | null
        | undefined;
    const phone = contactNode?.phone;
    if (!phone) return { error: "NO SE PUDO RESOLVER EL TELÉFONO." };

    const author = await currentAdminId();
    const BUSINESS = "business";

    // En WhatsApp solo hay UNA reacción por lado (cliente / business). Replazamos siempre la
    // del business — guardamos `by` con el username del admin para auditoría.
    const { data: current } = await supabaseCrmAdmin
        .from("messages")
        .select("reactions")
        .eq("id", targetMessageId)
        .single();

    const currentReactions = (current?.reactions ?? []) as Array<{ emoji: string; from: string; by?: string; at: string }>;
    const filtered = currentReactions.filter((r) => r.from !== BUSINESS);
    const next = emoji
        ? [...filtered, { emoji, from: BUSINESS, by: author, at: new Date().toISOString() }]
        : filtered;

    await supabaseCrmAdmin
        .from("messages")
        .update({ reactions: next })
        .eq("id", targetMessageId);

    // Disparar bot (fire-and-forget). El bot también update reactions, idempotente.
    const botUrl = process.env.BOT_URL;
    const secret = process.env.REVALIDATE_SECRET;
    if (botUrl && secret) {
        fetch(`${botUrl.replace(/\/$/, "")}/send-reaction`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Revalidate-Secret": secret,
            },
            body: JSON.stringify({
                to: phone,
                targetWaMessageId: msg.wa_message_id,
                emoji,
                from: BUSINESS,
                by: author,
            }),
        }).catch((e) => console.error("[sendHumanReaction] bot falló:", e.message));
    }

    return { success: true, data: { emoji } };
}
