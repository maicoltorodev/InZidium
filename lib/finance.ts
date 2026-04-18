/**
 * Modelo de pagos entre estudio e InZidium.
 *
 * Flujo real:
 *   - Cliente le paga al estudio offline (no se trackea).
 *   - Estudio registra el cliente/proyecto en la plataforma cuando ya tiene la
 *     plata. La existencia del proyecto implica que hay cobro.
 *   - Estudio gira a InZidium el % correspondiente (80%) para habilitar compra
 *     de dominio, infra, etc.
 *   - Plan estándar: 1 solo pago (80% del total).
 *   - Plan a la medida: 2 pagos del 80%, partidos 50/50. El de arranque se
 *     pide al crear el proyecto; el de entrega se habilita cuando
 *     `project.fase === "publicado"`.
 *
 * Se guarda como `onboardingData.pagos: Pago[]` — sin tocar schema.
 */

export const PRECIO_TOTAL_ESTANDAR = 499_000;
export const PCT_INZIDIUM = 0.8;
export const PCT_ESTUDIO = 0.2;

export const PLAN_ESTANDAR_TITLE = "Plan Estándar";
export const PLAN_ALA_MEDIDA_TITLE = "A la medida";

export type PagoTipo = "arranque" | "entrega";

export type PagoStatus = "pendiente" | "enviado" | "aprobado" | "rechazado";

export type Pago = {
    tipo: PagoTipo;
    monto: number;
    comprobanteUrl?: string;
    uploadedAt?: string; // ISO
    approvedAt?: string;
    rejectedAt?: string;
    rejectionReason?: string;
};

export function getPagoStatus(pago: Pago): PagoStatus {
    if (pago.approvedAt) return "aprobado";
    if (pago.rejectedAt) return "rechazado";
    if (pago.uploadedAt || pago.comprobanteUrl) return "enviado";
    return "pendiente";
}

export function getPrecioTotal(project: {
    plan: string;
    onboardingData?: any;
}): number | null {
    if (project.plan === PLAN_ESTANDAR_TITLE) return PRECIO_TOTAL_ESTANDAR;
    if (project.plan === PLAN_ALA_MEDIDA_TITLE) {
        const v = project.onboardingData?.precioCustom;
        return typeof v === "number" && v > 0 ? v : null;
    }
    return null;
}

/**
 * Devuelve la lista ESPERADA de cuotas según el plan (con montos calculados).
 * No lee `onboardingData.pagos` — eso lo hace `getPagos` que mergea ambos.
 */
export function getExpectedPagos(project: {
    plan: string;
    onboardingData?: any;
}): Pago[] {
    const total = getPrecioTotal(project);
    if (!total) return [];
    const montoInzidium = Math.round(total * PCT_INZIDIUM);

    if (project.plan === PLAN_ESTANDAR_TITLE) {
        return [{ tipo: "arranque", monto: montoInzidium }];
    }
    if (project.plan === PLAN_ALA_MEDIDA_TITLE) {
        const half = Math.round(montoInzidium / 2);
        return [
            { tipo: "arranque", monto: half },
            { tipo: "entrega", monto: montoInzidium - half },
        ];
    }
    return [];
}

/**
 * Devuelve la lista efectiva de cuotas: esperadas con el estado actual mezclado.
 * Mantiene compat con proyectos viejos que sólo usan `onboardingData.pagoRecibido`.
 */
export function getPagos(project: any): Pago[] {
    const data = project?.onboardingData ?? {};
    const existing: Pago[] = Array.isArray(data.pagos) ? data.pagos : [];
    const expected = getExpectedPagos(project);

    // Legacy: si hay `pagoRecibido: true` y no hay cuotas en la nueva estructura,
    // tratamos el pago de arranque como aprobado con la fecha del proyecto.
    if (existing.length === 0 && data.pagoRecibido === true) {
        const fallbackDate = project?.createdAt ?? new Date().toISOString();
        return expected.map((e, i) =>
            i === 0 ? { ...e, approvedAt: fallbackDate } : e,
        );
    }

    return expected.map((e) => {
        const match = existing.find((p) => p.tipo === e.tipo);
        return match ? { ...e, ...match, monto: e.monto } : e;
    });
}

/**
 * La cuota de entrega (a la medida) sólo se habilita cuando el proyecto está
 * publicado. Antes de eso mostramos la card como bloqueada.
 */
export function isPagoUnlocked(
    pago: Pago,
    project: { fase?: string },
): boolean {
    if (pago.tipo === "arranque") return true;
    return project.fase === "publicado";
}
