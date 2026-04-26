// =============================================================
// API cliente única para subir archivos al storage.
//
// Uso:
//   import { uploadFile } from '@/lib/storage/upload.client';
//   const res = await uploadFile(file, 'service-image');
//   if (res.success) setUrl(res.url);
//
// Internamente:
// 1. Valida MIME contra la policy.
// 2. Valida tamaño de input.
// 3. Si es imagen optimizable y la policy lo pide, optimiza a WebP.
// 4. Llama al server action `uploadFileAction(formData, purpose)`.
//
// Cualquier nuevo destino se agrega en `policies.ts` y queda
// automáticamente disponible acá.
// =============================================================

import { getPolicy, isImageMimeOptimizable, isMimeAllowed, type StoragePurpose } from './policies';
import { optimizeImageFile } from './optimize.client';
import { uploadFileAction, deleteFileAction } from './upload.server';

export type UploadResult =
    | { success: true; url: string; storagePath: string; bucket: string }
    | { success: false; error: string };

export type UploadOptions = {
    /** Contexto requerido por algunas policies (ej. project-file → estudioId, proyectoId). */
    ctx?: Record<string, string>;
    /** Saltea la optimización aunque la policy la pida. Útil para favicons (PNG → next/og). */
    preserveFormat?: boolean;
};

export async function uploadFile(
    file: File,
    purpose: StoragePurpose,
    options: UploadOptions = {},
): Promise<UploadResult> {
    const policy = getPolicy(purpose);

    if (!isMimeAllowed(file.type, purpose)) {
        return { success: false, error: 'TIPO DE ARCHIVO NO PERMITIDO.' };
    }

    const willOptimize = policy.optimizeImages
        && !options.preserveFormat
        && isImageMimeOptimizable(file.type);

    if (willOptimize && policy.maxInputBytes && file.size > policy.maxInputBytes) {
        const mb = (policy.maxInputBytes / (1024 * 1024)).toFixed(0);
        return { success: false, error: `LA IMAGEN ORIGINAL ES DEMASIADO GRANDE (>${mb}MB).` };
    }

    if (!willOptimize && file.size > policy.maxBytes) {
        const mb = (policy.maxBytes / (1024 * 1024)).toFixed(1);
        return { success: false, error: `EL ARCHIVO ES DEMASIADO GRANDE (>${mb}MB).` };
    }

    let prepared: File;
    try {
        prepared = willOptimize ? await optimizeImageFile(file, policy.maxBytes) : file;
    } catch (e) {
        return { success: false, error: e instanceof Error ? e.message : 'ERROR PROCESANDO LA IMAGEN.' };
    }

    if (prepared.size > policy.maxBytes) {
        const mb = (policy.maxBytes / (1024 * 1024)).toFixed(1);
        return { success: false, error: `EL ARCHIVO SIGUE SUPERANDO EL LÍMITE (>${mb}MB) AL OPTIMIZAR.` };
    }

    const formData = new FormData();
    formData.append('file', prepared);
    if (options.ctx) {
        for (const [k, v] of Object.entries(options.ctx)) {
            formData.append(`ctx.${k}`, v);
        }
    }

    const result = await uploadFileAction(formData, purpose);
    if ('error' in result) return { success: false, error: result.error };
    return { success: true, url: result.url, storagePath: result.storagePath, bucket: result.bucket };
}

export async function deleteFile(purpose: StoragePurpose, pathOrUrl: string): Promise<{ success: boolean; error?: string }> {
    const result = await deleteFileAction(purpose, pathOrUrl);
    if ('error' in result) return { success: false, error: result.error };
    return { success: true };
}
