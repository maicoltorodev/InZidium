/**
 * Utilidades para la ventana de 24h de Meta (WhatsApp Business API).
 * La ventana se abre cuando el cliente envía un mensaje y dura 24h.
 * Dentro de ese periodo se pueden enviar mensajes libres; fuera, solo plantillas.
 */

const TWENTYFOUR_HOURS_MS = 24 * 60 * 60 * 1000;

/** ¿Está la ventana de 24h abierta? */
export function is24hWindowOpen(lastInboundAt: string | null | undefined): boolean {
    if (!lastInboundAt) return false;
    const t = new Date(lastInboundAt).getTime();
    if (!Number.isFinite(t)) return false;
    return Date.now() - t < TWENTYFOUR_HOURS_MS;
}

/** Calcula tiempo restante de la ventana en milisegundos (0 si está cerrada). */
export function windowTimeRemainingMs(lastInboundAt: string | null | undefined): number {
    if (!lastInboundAt) return 0;
    const t = new Date(lastInboundAt).getTime();
    if (!Number.isFinite(t)) return 0;
    return Math.max(0, TWENTYFOUR_HOURS_MS - (Date.now() - t));
}

/** Devuelve un label amigable: "18h restantes" / "Ventana cerrada · solo plantillas". */
export function describe24hWindow(lastInboundAt: string | null | undefined): {
    open: boolean;
    label: string;
} {
    const remaining = windowTimeRemainingMs(lastInboundAt);
    if (remaining <= 0) return { open: false, label: "Ventana cerrada · solo plantillas" };
    const hours = Math.floor(remaining / (60 * 60 * 1000));
    const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
    if (hours >= 1) return { open: true, label: `${hours}h restantes` };
    return { open: true, label: `${minutes}min restantes` };
}
