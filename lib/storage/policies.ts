// =============================================================
// FUENTE ÚNICA DE VERDAD para subidas a Supabase Storage.
//
// Toda función que sube archivos al storage pasa por este módulo
// y respeta una de las políticas declaradas acá. Si un archivo no
// cumple la política, se rechaza ANTES de llegar al bucket.
//
// Si vas a permitir un nuevo tipo de archivo o crear un nuevo
// destino, modificás este archivo y nada más.
// =============================================================

export type StorageClient = 'alianza' | 'crm';

export type PathBuilderInput = {
    file: File;
    ctx: Record<string, string>;
};

export type StoragePolicy = {
    bucket: string;
    client: StorageClient;
    /** Tamaño máximo del archivo final que llega al bucket. */
    maxBytes: number;
    /** Tamaño máximo del archivo original ANTES de optimizar (solo aplica si optimizeImages=true). */
    maxInputBytes?: number;
    /** Lista cerrada de MIME types aceptados. Cualquier otro = rechazo. */
    allowedMimeTypes: readonly string[];
    /** Si true, las imágenes JPEG/PNG/WebP se convierten a WebP optimizado en cliente. */
    optimizeImages: boolean;
    /** Función que construye el path dentro del bucket. */
    pathBuilder: (input: PathBuilderInput) => string;
    /** Si true, los archivos son públicos vía getPublicUrl (default true). */
    publicAccess?: boolean;
    /** Si true, server action exige sesión de admin válida antes de subir/borrar. */
    requiresAdmin?: boolean;
};

const ONE_MB = 1024 * 1024;

const IMAGE_TYPES_OPTIMIZABLE = ['image/jpeg', 'image/png', 'image/webp'] as const;
const IMAGE_TYPES_VECTOR_AND_ANIM = ['image/svg+xml', 'image/gif'] as const;
const DOCUMENT_TYPES = ['application/pdf'] as const;

export const ALL_PROJECT_FILE_TYPES = [
    ...IMAGE_TYPES_OPTIMIZABLE,
    ...IMAGE_TYPES_VECTOR_AND_ANIM,
    ...DOCUMENT_TYPES,
] as const;

export const SERVICE_IMAGE_TYPES = IMAGE_TYPES_OPTIMIZABLE;

// ─────────────────────────────────────────────────────────────
// Políticas
// ─────────────────────────────────────────────────────────────

export const POLICIES = {
    /**
     * Imágenes de servicios (catálogo público de InZidium).
     * Solo imágenes raster optimizables. Sin contexto necesario.
     */
    'service-image': {
        bucket: 'inzidium-service-images',
        client: 'crm',
        maxBytes: 4.5 * ONE_MB,
        maxInputBytes: 15 * ONE_MB,
        allowedMimeTypes: SERVICE_IMAGE_TYPES,
        optimizeImages: true,
        pathBuilder: ({ file }) => {
            const ext = file.name.split('.').pop()?.toLowerCase() ?? 'webp';
            const random = Math.random().toString(36).slice(2, 10);
            return `${Date.now()}-${random}.${ext}`;
        },
        publicAccess: true,
        requiresAdmin: true,
    },

    /**
     * Archivos de proyectos (catálogos, briefs, fotos del cliente, PDFs, etc).
     * Bucket de la alianza. Path organizado por estudio/proyecto para auditoría.
     * Requiere contexto: estudioId, proyectoId.
     */
    'project-file': {
        bucket: 'archivos',
        client: 'alianza',
        maxBytes: 4.5 * ONE_MB,
        maxInputBytes: 15 * ONE_MB,
        allowedMimeTypes: ALL_PROJECT_FILE_TYPES,
        optimizeImages: true,
        pathBuilder: ({ file, ctx }) => {
            if (!ctx.estudioId || !ctx.proyectoId) {
                throw new Error('project-file requiere ctx.estudioId y ctx.proyectoId');
            }
            return `${ctx.estudioId}/${ctx.proyectoId}/${Date.now()}-${file.name}`;
        },
        publicAccess: true,
    },
} as const satisfies Record<string, StoragePolicy>;

export type StoragePurpose = keyof typeof POLICIES;

export const ALL_PURPOSES = Object.keys(POLICIES) as StoragePurpose[];

// ─────────────────────────────────────────────────────────────
// Helpers públicos
// ─────────────────────────────────────────────────────────────

export function getPolicy(purpose: StoragePurpose): StoragePolicy {
    return POLICIES[purpose];
}

export function isImageMimeOptimizable(mime: string): boolean {
    return (IMAGE_TYPES_OPTIMIZABLE as readonly string[]).includes(mime);
}

export function isMimeAllowed(mime: string, purpose: StoragePurpose): boolean {
    return (POLICIES[purpose].allowedMimeTypes as readonly string[]).includes(mime);
}
