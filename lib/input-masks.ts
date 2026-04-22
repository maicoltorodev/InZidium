/**
 * Input masks — separación parse/display para inputs enmascarados en vivo.
 *
 * El problema de usar un único `format(raw) -> string` en un input live es que
 * el formatter debe ser idempotente sobre su propia salida. Si no lo es, cada
 * keystroke re-consume los chars que el mask insertó y aparecen duplicaciones.
 *
 * La solución es separar responsabilidades:
 *   - `parse(raw)`    → dígitos / texto canónico (limpia TODO ruido del DOM,
 *                        incluyendo artefactos del mask como el prefijo "+57").
 *   - `display(canon)`→ arma el string enmascarado a partir del canónico.
 *
 * Invariante: `parse(display(x)) === x` para cualquier canónico válido `x`,
 * y `parse(parse(y)) === parse(y)` (idempotencia del parse). Esto garantiza
 * que `display(parse(raw))` converge en 1 paso — sin conflictos.
 */

export interface InputMask {
    /** Extrae el valor canónico del raw del DOM (incluye artefactos del mask). */
    parse: (raw: string) => string;
    /** Arma el string display desde el canónico. */
    display: (canonical: string) => string;
}

// ─── Phone Colombia (celular) ────────────────────────────────────────────────

/**
 * Canónico = 10 dígitos nacionales (sin código de país).
 * Display  = "+57 300 123 45 67" (grupos 3-3-2-2 con prefijo fijo).
 *
 * El parse strippea el prefijo "57" SIEMPRE que aparezca al inicio. Seguro
 * porque los celulares CO empiezan por 3 — "57" nunca es parte del número.
 */
export const phoneMaskCO: InputMask = {
    parse: (raw) => {
        let digits = raw.replace(/\D/g, "");
        if (digits.startsWith("57")) digits = digits.slice(2);
        return digits.slice(0, 10);
    },
    display: (digits) => {
        const d = digits.replace(/\D/g, "").slice(0, 10);
        if (d.length === 0) return "";
        const groups: string[] = [];
        groups.push(d.slice(0, 3));
        if (d.length > 3) groups.push(d.slice(3, 6));
        if (d.length > 6) groups.push(d.slice(6, 8));
        if (d.length > 8) groups.push(d.slice(8, 10));
        return "+57 " + groups.join(" ");
    },
};

// ─── Email ──────────────────────────────────────────────────────────────────

/** Canónico = display. Solo trim + lowercase. */
export const emailMask: InputMask = {
    parse: (raw) => raw.trim().toLowerCase(),
    display: (canon) => canon,
};

// ─── Social handle (factory por network) ─────────────────────────────────────

/**
 * Mask para handles de redes sociales. Dado un `prefix` fijo (ej:
 * `https://waze.com/`), strippea en vivo al tipear/pegar:
 *
 *   1. Prefix completo: `https://waze.com/ul?...` → `ul?...`
 *   2. Bare host: `waze.com/ul?...` → `ul?...`
 *   3. Bare host con www: `www.waze.com/ul?...` → `ul?...`
 *   4. Leading `@`: `@mangiare` → `mangiare`
 *
 * Edge case: URL absoluta con subdominio distinto (ej: `https://ul.waze.com/...`)
 * NO se strippea, se devuelve la URL completa. El `updateNetwork` del caller
 * la detecta y la guarda as-is sin prepend. Cubre el caso real del share
 * button de la app de Waze que usa un subdominio.
 *
 * Why: el cliente copia la URL completa de la barra del browser o del share
 * button. Sin la mask, al pegar veía el texto crudo mezclado con el prefix
 * visual (`waze.com/ https://waze.com/ul?...`) → feo. Ahora strippea instant.
 */
export function socialHandleMask(prefix: string): InputMask {
    let host = "";
    try {
        host = new URL(prefix.endsWith("/") ? prefix : `${prefix}/`).hostname;
    } catch {
        // Prefix no parseable → el mask queda como passthrough abajo.
    }
    const prefixLower = prefix.toLowerCase();
    const hostPatterns = host
        ? [`${host}/`.toLowerCase(), `www.${host}/`.toLowerCase()]
        : [];

    return {
        parse: (raw) => {
            const trimmed = raw.trim();
            if (!trimmed) return "";

            // 1) Match exacto del prefix completo (con scheme).
            const lower = trimmed.toLowerCase();
            if (lower.startsWith(prefixLower)) {
                return trimmed.slice(prefix.length).replace(/^@/, "");
            }

            // 2) URL absoluta con scheme pero distinto host (ej: subdominio).
            //    Respetar como absoluta → NO strippear prefix.
            if (/^https?:\/\//i.test(trimmed)) {
                return trimmed;
            }

            // 3) Sin scheme pero empieza con el host del prefix.
            for (const pat of hostPatterns) {
                if (lower.startsWith(pat)) {
                    return trimmed.slice(pat.length).replace(/^@/, "");
                }
            }

            // 4) Handle relativo normal.
            return trimmed.replace(/^@/, "");
        },
        display: (canonical) => canonical,
    };
}
