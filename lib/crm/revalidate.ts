// Invalidación push-based hacia el bot InZidium IA (Hetzner VPS).
// Fire-and-forget: si el bot está caído o no configurado, el cambio en DB se persiste igual;
// el bot rehidrata su cache en el próximo `/revalidate` o al reiniciar.

type RevalidateTarget = "catalog" | "ai_config";

export async function revalidateBotCache(target: RevalidateTarget): Promise<void> {
    const url = process.env.BOT_URL;
    const secret = process.env.REVALIDATE_SECRET;

    if (!url || !secret) {
        console.warn(`[bot-revalidate:${target}] BOT_URL o REVALIDATE_SECRET no configurados — skip`);
        return;
    }

    try {
        const res = await fetch(`${url.replace(/\/$/, "")}/revalidate`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Revalidate-Secret": secret,
            },
            body: JSON.stringify({ target }),
        });
        if (!res.ok) {
            console.error(`[bot-revalidate:${target}] bot respondió ${res.status}`);
        }
    } catch (e) {
        console.error(`[bot-revalidate:${target}] fire failed:`, (e as Error).message);
    }
}
