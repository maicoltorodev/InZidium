import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { validateAdminSession } from "@/lib/actions";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function GET(request: NextRequest) {
    const session = await validateAdminSession();
    if (!session.valid) {
        return new Response("Unauthorized", { status: 401 });
    }

    const supabase = createClient(
        process.env.SUPABASE_CRM_URL!,
        process.env.SUPABASE_CRM_SERVICE_ROLE_KEY!,
    );

    const encoder = new TextEncoder();
    const channelId = crypto.randomUUID();

    const stream = new ReadableStream({
        start(controller) {
            const send = (event: string, data: unknown) => {
                try {
                    controller.enqueue(
                        encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`),
                    );
                } catch {
                    // stream ya cerrado
                }
            };

            const heartbeat = setInterval(() => {
                try {
                    controller.enqueue(encoder.encode(`: ping\n\n`));
                } catch {
                    clearInterval(heartbeat);
                }
            }, 25_000);

            const channel = supabase
                .channel(`sse-${channelId}`)
                .on("postgres_changes", { event: "INSERT", schema: "inzidium_crm", table: "messages" }, (payload) => {
                    send("message", payload.new);
                })
                .on("postgres_changes", { event: "UPDATE", schema: "inzidium_crm", table: "messages" }, (payload) => {
                    // Status changes, reactions, media_id attached
                    send("message_update", payload.new);
                })
                .on("postgres_changes", { event: "DELETE", schema: "inzidium_crm", table: "messages" }, (payload) => {
                    // Cap 500 trigger eliminó un mensaje viejo
                    send("message_delete", payload.old);
                })
                .on("postgres_changes", { event: "INSERT", schema: "inzidium_crm", table: "contact_media" }, (payload) => {
                    send("media_ready", payload.new);
                })
                .on("postgres_changes", { event: "UPDATE", schema: "inzidium_crm", table: "conversations" }, (payload) => {
                    send("conversation", payload.new);
                })
                .on("postgres_changes", { event: "UPDATE", schema: "inzidium_crm", table: "contacts" }, (payload) => {
                    send("contact", payload.new);
                })
                .subscribe();

            request.signal.addEventListener("abort", () => {
                clearInterval(heartbeat);
                supabase.removeChannel(channel).catch(() => {});
                try { controller.close(); } catch {}
            });
        },
    });

    return new Response(stream, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache, no-transform",
            Connection: "keep-alive",
            "X-Accel-Buffering": "no",
        },
    });
}
