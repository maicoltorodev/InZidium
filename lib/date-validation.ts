/**
 * Validación centralizada para fechas de entrega de proyectos.
 *
 * Rangos aceptados:
 *  - **Mínimo:** hoy (día actual). No tiene sentido prometer una entrega pasada.
 *  - **Máximo:** 1 año al futuro. Proyectos web típicos nunca llegan tan lejos;
 *    si aparece un caso legítimo se sube el `MAX_DAYS_AHEAD`.
 *
 * Usar tanto en client (bloquear UI) como en server action (fallback de seguridad
 * si alguien manipula el DOM o llama el action directo).
 */

const MAX_DAYS_AHEAD = 365;

export type ValidationResult =
    | { ok: true }
    | { ok: false; reason: string };

export function isValidDeliveryDate(input: Date | string): ValidationResult {
    const d = typeof input === "string" ? new Date(input) : input;
    if (isNaN(d.getTime())) return { ok: false, reason: "Fecha inválida." };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const max = new Date(today);
    max.setDate(max.getDate() + MAX_DAYS_AHEAD);

    // Normalizar la fecha recibida para comparar por día, no por hora.
    const dDay = new Date(d);
    dDay.setHours(0, 0, 0, 0);

    if (dDay < today) {
        return { ok: false, reason: "La fecha de entrega no puede ser anterior a hoy." };
    }
    if (dDay > max) {
        return { ok: false, reason: "La fecha de entrega no puede estar a más de 1 año." };
    }
    return { ok: true };
}

/** Hoy en formato `YYYY-MM-DD` para pasar a `<input type="date" min={...}>`. */
export function todayIsoDate(): string {
    return new Date().toISOString().slice(0, 10);
}

/** Hoy + 1 año en formato `YYYY-MM-DD` — para el `max` attr del input. */
export function maxDeliveryIsoDate(): string {
    const d = new Date();
    d.setDate(d.getDate() + MAX_DAYS_AHEAD);
    return d.toISOString().slice(0, 10);
}
