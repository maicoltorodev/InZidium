import { getSectionCompletion } from "@/components/clientes/portal/types";

/**
 * Las 7 secciones scoreables del hub mobile (sin 'legal' que está en ajustes avanzados).
 * Si cambia la lista en el hub, actualizar acá también.
 */
const SCORED_SECTIONS = [
    "inicio",
    "nosotros",
    "catalogo",
    "contacto",
    "digital",
    "social",
    "colores",
] as const;

/**
 * True cuando el cliente completó las 7 secciones scoreables + el dominio.
 * Disparador de la transición automática a fase `construccion`.
 */
export function isOnboardingComplete(d: any): boolean {
    if (!d) return false;
    const sectionsDone = SCORED_SECTIONS.every(
        (k) => getSectionCompletion(k, d) === "complete"
    );
    const domainDone = !!(d.dominioUno && String(d.dominioUno).trim().length > 0);
    return sectionsDone && domainDone;
}
