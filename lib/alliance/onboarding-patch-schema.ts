/**
 * Allowlist + sanitizer para patches sobre `proyectos.onboardingData`.
 *
 * Corre después del auth gate en `updateProyectoOnboarding`. Bloquea:
 *   - Keys fuera de la allowlist (atacante sondeando o cliente con bug).
 *   - Types inválidos (ej: objeto donde esperamos string).
 *   - URLs con schemes peligrosos (`javascript:`, `data:`) → XSS vía `<a href>`
 *     en el sitio público.
 *   - Valores gigantes → DB bloat.
 *
 * Política:
 *   - Unknown key / invalid type / bad URL → drop esa key silenciosamente.
 *   - Valor excede cap → truncar (UX friendly).
 *   - Patch resultante vacío → el action puede skippear el write.
 */

const HTTPS_RE = /^https:\/\//;

type FieldRule =
    | { kind: "string"; max: number }
    | { kind: "url"; max: number }
    | { kind: "boolean" };

// Schemas de campos simples (string | url | boolean).
const SIMPLE: Record<string, FieldRule> = {
    // Identidad
    nombreComercial: { kind: "string", max: 80 },
    slogan: { kind: "string", max: 160 },
    logo: { kind: "url", max: 1000 },

    // Nosotros — textos cortos (150 chars) para que la Plantilla no se vea
    // cargada. El UI también usa maxLength={150}.
    descripcion: { kind: "string", max: 150 },
    mision: { kind: "string", max: 150 },
    diferencial: { kind: "string", max: 150 },
    imagenNosotros: { kind: "url", max: 1000 },

    // Ubicación
    direccion: { kind: "string", max: 300 },
    descripcionLocal: { kind: "string", max: 1000 },
    embedUrl: { kind: "url", max: 3000 },
    hoursMode: { kind: "string", max: 20 },

    // Contacto
    whatsapp: { kind: "string", max: 25 },
    telefono: { kind: "string", max: 25 },
    email: { kind: "string", max: 120 },
    textoFooter: { kind: "string", max: 500 },
    fabEnabled: { kind: "boolean" },
    fabPhone: { kind: "string", max: 25 },
    fabMessage: { kind: "string", max: 500 },
    fabPromptMessage: { kind: "string", max: 200 },
    catalogoWhatsappButton: { kind: "boolean" },

    // Colores (hex #RRGGBB / #RRGGBBAA, cap 10 cubre ambos)
    colorFondo: { kind: "string", max: 10 },
    colorPrimario: { kind: "string", max: 10 },
    colorAcento: { kind: "string", max: 10 },
    colorAcento2: { kind: "string", max: 10 },

    // Redes sociales
    instagram: { kind: "url", max: 300 },
    facebook: { kind: "url", max: 300 },
    tiktok: { kind: "url", max: 300 },
    twitter: { kind: "url", max: 300 },
    youtube: { kind: "url", max: 300 },
    whatsappUrl: { kind: "url", max: 300 },
    threads: { kind: "url", max: 300 },
    telegram: { kind: "url", max: 300 },
    waze: { kind: "url", max: 500 },

    // Avanzado / negocio
    fontPreset: { kind: "string", max: 30 },
    analyticsGAId: { kind: "string", max: 30 },
    tipoNegocio: { kind: "string", max: 30 },
    tipoCatalogo: { kind: "string", max: 30 },
    legalTemplate: { kind: "string", max: 30 },
    legalLastUpdated: { kind: "string", max: 30 },
    favicon: { kind: "url", max: 1000 },

    // Dominio
    dominioUno: { kind: "string", max: 50 },
    seoCanonicalUrl: { kind: "url", max: 500 },
    // Meta description SEO opcional (override de la computada). Cap 200 chars
    // porque Google corta en ~160 pero damos margen; si se pasa, layout.tsx
    // trunca visualmente al emitir el meta tag.
    seoDescripcion: { kind: "string", max: 200 },

    // Galería — toggle + textos. Las imágenes son array (galleryImages) y se
    // sanitizan aparte. Apagar el toggle NO borra los datos.
    galleryEnabled: { kind: "boolean" },
    galleryTitle: { kind: "string", max: 80 },
    galleryDescription: { kind: "string", max: 200 },
};

function sanitizeSimple(key: string, value: unknown): unknown {
    const rule = SIMPLE[key];
    if (!rule) return undefined;
    if (rule.kind === "boolean") {
        return typeof value === "boolean" ? value : undefined;
    }
    // Null/undefined → tratarlo como "" (clear operation válido).
    if (value === null || value === undefined) return "";
    if (typeof value !== "string") return undefined;
    if (value === "") return "";
    if (rule.kind === "url" && !HTTPS_RE.test(value)) return undefined;
    return value.slice(0, rule.max);
}

function sanitizeHours(value: unknown): Record<string, string> | undefined {
    if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
    const out: Record<string, string> = {};
    let count = 0;
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
        if (count >= 14) break;
        if (typeof k !== "string" || k.length > 40) continue;
        if (typeof v !== "string") continue;
        out[k.slice(0, 40)] = v.slice(0, 100);
        count++;
    }
    return out;
}

function sanitizeStatsItem(item: unknown): { value: string; label: string } | null {
    if (!item || typeof item !== "object" || Array.isArray(item)) return null;
    const i = item as Record<string, unknown>;
    return {
        value: typeof i.value === "string" ? i.value.slice(0, 30) : "",
        label: typeof i.label === "string" ? i.label.slice(0, 60) : "",
    };
}

function sanitizeStats(value: unknown): Array<{ value: string; label: string }> | undefined {
    if (!Array.isArray(value)) return undefined;
    return value
        .slice(0, 10)
        .map(sanitizeStatsItem)
        .filter((v): v is { value: string; label: string } => v !== null);
}

function sanitizeCatalogoItem(item: unknown): Record<string, any> | null {
    if (!item || typeof item !== "object" || Array.isArray(item)) return null;
    const i = item as Record<string, unknown>;
    const imagen = typeof i.imagen === "string" && (i.imagen === "" || HTTPS_RE.test(i.imagen))
        ? i.imagen.slice(0, 1000)
        : "";
    const out: Record<string, any> = {
        id: typeof i.id === "string" ? i.id.slice(0, 50) : "",
        titulo: typeof i.titulo === "string" ? i.titulo.slice(0, 120) : "",
        descripcion: typeof i.descripcion === "string" ? i.descripcion.slice(0, 500) : "",
        precio: typeof i.precio === "string" ? i.precio.slice(0, 40) : "",
        categoria: typeof i.categoria === "string" ? i.categoria.slice(0, 60) : "",
        imagen,
        features: Array.isArray(i.features)
            ? i.features
                  .filter((f): f is string => typeof f === "string")
                  .map((f) => f.slice(0, 120))
                  .slice(0, 20)
            : [],
    };
    if (typeof i.disabled === "boolean") out.disabled = i.disabled;
    return out;
}

function sanitizeCategorias(value: unknown): string[] | undefined {
    if (!Array.isArray(value)) return undefined;
    return value
        .filter((v): v is string => typeof v === "string")
        .map((v) => v.slice(0, 60))
        .slice(0, 50);
}

// Cap duro de 10 imágenes — el toggle de "Activar galería" en el portal usa
// este número como límite visible al cliente. Más imágenes saturan visualmente
// el sitio público y la grilla pierde balance.
const GALLERY_MAX_IMAGES = 10;

function sanitizeGalleryImage(item: unknown): Record<string, any> | null {
    if (!item || typeof item !== "object" || Array.isArray(item)) return null;
    const i = item as Record<string, unknown>;
    const src = typeof i.src === "string" && (i.src === "" || HTTPS_RE.test(i.src))
        ? i.src.slice(0, 1000)
        : "";
    if (!src) return null; // imagen sin src no tiene sentido
    return {
        id: typeof i.id === "string" ? i.id.slice(0, 50) : "",
        src,
        alt: typeof i.alt === "string" ? i.alt.slice(0, 200) : "",
        caption: typeof i.caption === "string" ? i.caption.slice(0, 200) : "",
    };
}

export function sanitizeOnboardingPatch(patch: unknown): Record<string, any> {
    if (!patch || typeof patch !== "object" || Array.isArray(patch)) return {};
    const out: Record<string, any> = {};

    for (const [key, value] of Object.entries(patch as Record<string, unknown>)) {
        if (key in SIMPLE) {
            const v = sanitizeSimple(key, value);
            if (v !== undefined) out[key] = v;
            continue;
        }
        if (key === "hours") {
            const v = sanitizeHours(value);
            if (v !== undefined) out.hours = v;
            continue;
        }
        if (key === "stats") {
            const v = sanitizeStats(value);
            if (v !== undefined) out.stats = v;
            continue;
        }
        if (key === "catalogo") {
            if (Array.isArray(value)) {
                out.catalogo = value
                    .slice(0, 200)
                    .map(sanitizeCatalogoItem)
                    .filter((v): v is Record<string, any> => v !== null);
            }
            continue;
        }
        if (key === "categorias") {
            const v = sanitizeCategorias(value);
            if (v !== undefined) out.categorias = v;
            continue;
        }
        if (key === "galleryImages") {
            if (Array.isArray(value)) {
                out.galleryImages = value
                    .slice(0, GALLERY_MAX_IMAGES)
                    .map(sanitizeGalleryImage)
                    .filter((v): v is Record<string, any> => v !== null);
            }
            continue;
        }
        // Unknown key → drop silencioso.
    }

    return out;
}
