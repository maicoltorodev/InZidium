// deno-lint-ignore-file no-explicit-any
/**
 * Edge function: notify-event
 *
 * Propósito: broadcast de push notifications vía FCM a todos los devices
 * registrados en `public.owner_devices` (la app personal de InZidium).
 *
 * Acepta dos formatos de payload:
 *
 * 1) Webhook format (disparado desde triggers SQL):
 *    { type: 'INSERT'|'UPDATE'|'DELETE', table: string, schema: string,
 *      record: {...NEW}, old_record: {...OLD} }
 *
 * 2) Custom format (disparado desde server actions de Next.js):
 *    { event: 'onboarding.started'|'onboarding.completed'|'pago.comprobante_subido'|...,
 *      record: {...},
 *      extra?: {...} }
 *
 * Para la primera forma, la función infiere el `event` a partir de `type + table`.
 *
 * Requiere env vars (secrets):
 *   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, FIREBASE_SERVICE_ACCOUNT (JSON).
 *
 * El formato del log de errores sigue el patrón
 *   "FCM send failed (<prefix_12>…): <status> <body>"
 * para que el cron `cleanup-dead-fcm-tokens` pueda parsear prefijos fallidos.
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

// ─── Tipos ───────────────────────────────────────────────────────────────────

type EventType =
    | "cliente.created"
    | "cliente.updated"
    | "cliente.deleted"
    | "proyecto.created"
    | "proyecto.deleted"
    | "plan.changed"
    | "chat.message"
    | "onboarding.started"
    | "onboarding.completed"
    | "pago.comprobante_subido";

type Payload = {
    event?: EventType;
    type?: "INSERT" | "UPDATE" | "DELETE";
    table?: string;
    schema?: string;
    record?: Record<string, any> | null;
    old_record?: Record<string, any> | null;
    extra?: Record<string, any>;
};

type Message = {
    title: string;
    body: string;
    data: Record<string, string>;
};

// ─── Mapeo event → kind (alineado con InAppNotificationKind de la app) ──────

function kindOf(event: EventType): string {
    switch (event) {
        case "cliente.created":
            return "CLIENTE";
        case "cliente.updated":
            return "CLIENTE_UPDATED";
        case "cliente.deleted":
            return "CLIENTE_DELETED";
        case "proyecto.created":
            return "PROYECTO";
        case "proyecto.deleted":
            return "PROYECTO_DELETED";
        case "plan.changed":
            return "PLAN_CHANGED";
        case "chat.message":
            return "CHAT";
        case "onboarding.started":
            return "ONBOARDING_STARTED";
        case "onboarding.completed":
            return "ONBOARDING_COMPLETED";
        case "pago.comprobante_subido":
            return "PAGO_COMPROBANTE";
    }
}

// ─── Mapeo webhook → event ───────────────────────────────────────────────────

function inferEvent(p: Payload): EventType | null {
    if (p.event) return p.event;
    if (!p.type || !p.table) return null;
    const key = `${p.table}:${p.type}`;
    switch (key) {
        case "clientes:INSERT":
            return "cliente.created";
        case "clientes:DELETE":
            return "cliente.deleted";
        case "proyectos:INSERT":
            return "proyecto.created";
        case "proyectos:DELETE":
            return "proyecto.deleted";
        case "chat:INSERT":
            return "chat.message";
    }
    return null;
}

// ─── Composición de notificaciones ───────────────────────────────────────────

function compose(event: EventType, p: Payload): Message {
    const r = (p.record ?? p.old_record ?? {}) as Record<string, any>;
    const extra = (p.extra ?? {}) as Record<string, any>;
    const kind = kindOf(event);

    // Shape canónico que espera la app Android (InZidiumMessagingService.parseNotification):
    //  kind (uppercase), title, body, estudio_id?, proyecto_id?, extras…
    //
    // Todo va en `data` (FCM "data-only") para que onMessageReceived siempre dispare
    // en foreground + background — la app arma su propia system notification desde ahí.
    const baseData = (proyectoId?: string | null): Record<string, string> => ({
        kind,
        type: event,
        estudio_id: String(r.estudio_id ?? ""),
        ...(proyectoId ? { proyecto_id: String(proyectoId) } : {}),
        ...(r.id ? { id: String(r.id) } : {}),
    });

    switch (event) {
        case "cliente.created":
            return {
                title: "Nuevo cliente",
                body: r.nombre ?? "Cliente sin nombre",
                data: baseData(),
            };
        case "cliente.updated": {
            const fields = Array.isArray(extra.fields) ? extra.fields.join(", ") : "datos";
            return {
                title: "Cliente editado",
                body: `${r.nombre ?? "Cliente"} · ${fields}`,
                data: baseData(),
            };
        }
        case "cliente.deleted":
            return {
                title: "Cliente eliminado",
                body: r.nombre ?? "Cliente",
                data: baseData(),
            };
        case "plan.changed":
            return {
                title: "Cambio de plan",
                body: `${r.nombre ?? "Proyecto"} · ${extra.from ?? "?"} → ${extra.to ?? "?"}`,
                data: baseData(r.id),
            };
        case "proyecto.created":
            return {
                title: "Nuevo proyecto",
                body: `${r.nombre ?? "Proyecto"} · ${r.plan ?? ""}`.trim(),
                data: baseData(r.id),
            };
        case "proyecto.deleted":
            return {
                title: "Proyecto eliminado",
                body: r.nombre ?? "Proyecto",
                data: baseData(r.id),
            };
        case "chat.message": {
            const autor = r.autor === "admin" ? "Admin" : "Cliente";
            const snippet = (r.contenido ?? "").slice(0, 80);
            return {
                title: `Mensaje · ${autor}`,
                body: snippet || "(sin contenido)",
                data: baseData(r.proyecto_id),
            };
        }
        case "onboarding.started":
            return {
                title: "Onboarding iniciado",
                body: `${r.nombre ?? "Un proyecto"} empezó a llenar el onboarding`,
                data: baseData(r.id),
            };
        case "onboarding.completed":
            return {
                title: "Onboarding completado · Countdown iniciado",
                body: `${r.nombre ?? "Proyecto"} terminó el onboarding — countdown en marcha`,
                data: baseData(r.id),
            };
        case "pago.comprobante_subido": {
            const tipo = extra.tipo === "entrega" ? "Pago de entrega" : "Pago de arranque";
            return {
                title: "Comprobante subido",
                body: `${r.nombre ?? "Proyecto"} · ${tipo}`,
                data: {
                    ...baseData(r.id),
                    tipo: String(extra.tipo ?? "arranque"),
                },
            };
        }
    }
}

// ─── FCM v1: OAuth token via service account ─────────────────────────────────

let cachedToken: { token: string; expiresAt: number } | null = null;

async function getFcmAccessToken(sa: any): Promise<string> {
    const now = Math.floor(Date.now() / 1000);
    if (cachedToken && cachedToken.expiresAt > now + 60) return cachedToken.token;

    const header = { alg: "RS256", typ: "JWT" };
    const claims = {
        iss: sa.client_email,
        scope: "https://www.googleapis.com/auth/firebase.messaging",
        aud: "https://oauth2.googleapis.com/token",
        exp: now + 3600,
        iat: now,
    };

    const enc = (o: any) =>
        btoa(JSON.stringify(o))
            .replace(/=/g, "")
            .replace(/\+/g, "-")
            .replace(/\//g, "_");
    const unsigned = `${enc(header)}.${enc(claims)}`;

    const pem = sa.private_key.replace(/\\n/g, "\n");
    const der = pemToDer(pem);
    const key = await crypto.subtle.importKey(
        "pkcs8",
        der,
        { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
        false,
        ["sign"],
    );
    const sig = await crypto.subtle.sign(
        "RSASSA-PKCS1-v1_5",
        key,
        new TextEncoder().encode(unsigned),
    );
    const sigB64 = btoa(String.fromCharCode(...new Uint8Array(sig)))
        .replace(/=/g, "")
        .replace(/\+/g, "-")
        .replace(/\//g, "_");
    const jwt = `${unsigned}.${sigB64}`;

    const res = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`,
    });
    if (!res.ok) throw new Error(`OAuth failed: ${res.status} ${await res.text()}`);
    const data = await res.json();
    cachedToken = {
        token: data.access_token,
        expiresAt: now + (data.expires_in ?? 3600),
    };
    return data.access_token;
}

function pemToDer(pem: string): ArrayBuffer {
    const b64 = pem
        .replace(/-----BEGIN PRIVATE KEY-----/, "")
        .replace(/-----END PRIVATE KEY-----/, "")
        .replace(/\s/g, "");
    const bin = atob(b64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return bytes.buffer;
}

// ─── Handler ─────────────────────────────────────────────────────────────────

Deno.serve(async (req) => {
    try {
        const payload: Payload = await req.json();
        const event = inferEvent(payload);
        if (!event) {
            return new Response(
                JSON.stringify({ ok: false, error: "Unknown event", payload }),
                { status: 400, headers: { "Content-Type": "application/json" } },
            );
        }

        const supabase = createClient(
            Deno.env.get("SUPABASE_URL")!,
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
        );

        const sa = JSON.parse(Deno.env.get("FIREBASE_SERVICE_ACCOUNT")!);

        // Tokens de la app personal InZidium
        const { data: devices, error } = await supabase
            .from("owner_devices")
            .select("fcm_token");

        if (error) {
            return new Response(
                JSON.stringify({ ok: false, error: error.message }),
                { status: 500, headers: { "Content-Type": "application/json" } },
            );
        }

        if (!devices || devices.length === 0) {
            return new Response(
                JSON.stringify({ ok: true, sent: 0, failed: 0, event, note: "No devices" }),
                { headers: { "Content-Type": "application/json" } },
            );
        }

        const accessToken = await getFcmAccessToken(sa);
        const msg = compose(event, payload);

        const results = await Promise.allSettled(
            devices.map(async (d: any) => {
                const token = d.fcm_token as string;
                const res = await fetch(
                    `https://fcm.googleapis.com/v1/projects/${sa.project_id}/messages:send`,
                    {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            message: {
                                token,
                                // Data-only push (sin `notification`): garantiza que la
                                // app controle el banner tanto en foreground como en
                                // background. Title/body van dentro de data para que
                                // el parser de InZidiumMessagingService los lea.
                                data: {
                                    ...msg.data,
                                    title: msg.title,
                                    body: msg.body,
                                },
                                android: {
                                    priority: "HIGH",
                                },
                            },
                        }),
                    },
                );
                if (!res.ok) {
                    const errBody = await res.text();
                    // Formato compatible con el cron `cleanup-dead-fcm-tokens`:
                    //   "FCM send failed (<prefix12>…): <status> <body>"
                    throw new Error(
                        `FCM send failed (${token.slice(0, 12)}…): ${res.status} ${errBody}`,
                    );
                }
            }),
        );

        const sent = results.filter((r) => r.status === "fulfilled").length;
        const failed = results.length - sent;
        const errors = results
            .filter((r): r is PromiseRejectedResult => r.status === "rejected")
            .map((r) => (r.reason as Error).message);

        return new Response(
            JSON.stringify({ ok: true, event, sent, failed, errors }),
            { headers: { "Content-Type": "application/json" } },
        );
    } catch (e) {
        return new Response(
            JSON.stringify({ ok: false, error: (e as Error).message }),
            { status: 500, headers: { "Content-Type": "application/json" } },
        );
    }
});
