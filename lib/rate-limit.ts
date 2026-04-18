import { headers } from "next/headers";

/**
 * Rate limit in-memory muy simple, pensado para mitigar brute-force sobre los
 * endpoints públicos (login cliente, búsqueda por cédula, login admin).
 *
 * Limitaciones:
 *  - In-memory: no se comparte entre instancias del runtime serverless.
 *    Para producción con múltiples instancias esto se upgradeable a Upstash
 *    Redis (https://upstash.com) cambiando sólo este archivo.
 *  - El contador se reinicia si el proceso se reinicia.
 *  - Razonable para ataques automáticos; no pretende bloquear un humano motivado.
 */

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

// Limpieza periódica de buckets vencidos para evitar fuga de memoria.
if (typeof setInterval !== "undefined") {
    const id = setInterval(() => {
        const now = Date.now();
        for (const [k, v] of buckets) {
            if (v.resetAt < now) buckets.delete(k);
        }
    }, 5 * 60 * 1000);
    (id as any)?.unref?.();
}

export async function getClientIp(): Promise<string> {
    const h = await headers();
    const xff = h.get("x-forwarded-for");
    if (xff) return xff.split(",")[0].trim();
    return h.get("x-real-ip") ?? "unknown";
}

export type RateLimitResult = {
    ok: boolean;
    remaining: number;
    resetInSec: number;
};

export async function rateLimit(
    key: string,
    opts: { max: number; windowMs: number },
): Promise<RateLimitResult> {
    const now = Date.now();
    const existing = buckets.get(key);

    if (!existing || existing.resetAt <= now) {
        buckets.set(key, { count: 1, resetAt: now + opts.windowMs });
        return { ok: true, remaining: opts.max - 1, resetInSec: Math.ceil(opts.windowMs / 1000) };
    }

    if (existing.count >= opts.max) {
        return {
            ok: false,
            remaining: 0,
            resetInSec: Math.ceil((existing.resetAt - now) / 1000),
        };
    }

    existing.count++;
    return {
        ok: true,
        remaining: opts.max - existing.count,
        resetInSec: Math.ceil((existing.resetAt - now) / 1000),
    };
}
