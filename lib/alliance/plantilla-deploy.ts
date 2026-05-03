"use server";

/**
 * Integración con la Plantilla Web (single deploy multi-tenant).
 *
 * Cuando cambia data de un proyecto en InZidium (onboarding edit, fase change,
 * toggle freeze, etc.), llamamos al endpoint `/api/revalidate` de la plantilla
 * para invalidar el cache de ese tenant — así el próximo visitante ve los
 * cambios al instante.
 *
 * Fire-and-forget: errores se loguean pero no rompen el flujo de la acción.
 */

const PLANTILLA_URL = process.env.PLANTILLA_URL;
const PLANTILLA_REVALIDATE_SECRET = process.env.PLANTILLA_REVALIDATE_SECRET;

export async function notifyPlantillaRevalidate(proyectoId: string) {
    if (!PLANTILLA_URL || !PLANTILLA_REVALIDATE_SECRET) {
        // Config incompleta — no abortamos, solo silenciamos.
        if (process.env.NODE_ENV === "development") {
            console.warn(
                "[plantilla-deploy] PLANTILLA_URL o PLANTILLA_REVALIDATE_SECRET no configurados",
            );
        }
        return;
    }
    try {
        const res = await fetch(`${PLANTILLA_URL}/api/revalidate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                secret: PLANTILLA_REVALIDATE_SECRET,
                proyectoId,
            }),
        });
        if (!res.ok) {
            console.error(
                "[plantilla-deploy] revalidate failed:",
                res.status,
                await res.text(),
            );
        }
    } catch (e) {
        console.error("[plantilla-deploy] revalidate threw:", (e as Error).message);
    }
}
