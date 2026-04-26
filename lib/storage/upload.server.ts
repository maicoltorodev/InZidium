'use server';

// =============================================================
// Server action única para subir archivos al storage.
// Toma una `purpose` (clave de POLICIES) y un FormData con `file`
// + ctx opcional. Valida MIME y tamaño según la policy. Sube al
// bucket correspondiente con el client correcto. Devuelve URL.
// =============================================================

import { supabaseAdmin } from '@/lib/supabase/server';
import { supabaseCrmAdmin } from '@/lib/supabase/crm/server';
import { validateAdminSession } from '@/lib/actions';
import { getPolicy, isMimeAllowed, type StoragePurpose, type StorageClient } from './policies';

export type UploadResult =
    | { success: true; url: string; storagePath: string; bucket: string }
    | { error: string };

function getClient(client: StorageClient) {
    return client === 'crm' ? supabaseCrmAdmin : supabaseAdmin;
}

/**
 * Sube `file` al bucket que dicte la policy `purpose`.
 *
 * El FormData debe contener:
 * - `file`: el File a subir.
 * - `ctx.<key>`: cada par key/value del contexto, prefijado con `ctx.`
 *   (ej. `ctx.estudioId`, `ctx.proyectoId`).
 */
export async function uploadFileAction(formData: FormData, purpose: StoragePurpose): Promise<UploadResult> {
    const file = formData.get('file');
    if (!(file instanceof File)) return { error: 'NO SE HA SELECCIONADO NINGÚN ARCHIVO.' };
    if (file.size === 0) return { error: 'EL ARCHIVO ESTÁ VACÍO.' };

    const policy = getPolicy(purpose);

    if (policy.requiresAdmin) {
        const session = await validateAdminSession();
        if (!session.valid) return { error: 'NO AUTORIZADO.' };
    }

    if (!isMimeAllowed(file.type, purpose)) {
        return { error: 'TIPO DE ARCHIVO NO PERMITIDO.' };
    }

    if (file.size > policy.maxBytes) {
        const mb = (policy.maxBytes / (1024 * 1024)).toFixed(1);
        return { error: `EL ARCHIVO SUPERA EL LÍMITE (${mb} MB).` };
    }

    const ctx: Record<string, string> = {};
    for (const [k, v] of formData.entries()) {
        if (typeof v === 'string' && k.startsWith('ctx.')) {
            ctx[k.slice(4)] = v;
        }
    }

    let storagePath: string;
    try {
        storagePath = policy.pathBuilder({ file, ctx });
    } catch (e) {
        return { error: e instanceof Error ? e.message : 'ERROR ARMANDO EL PATH DEL ARCHIVO.' };
    }

    const client = getClient(policy.client);
    const { error: uploadError } = await client.storage
        .from(policy.bucket)
        .upload(storagePath, file, { contentType: file.type, upsert: false });

    if (uploadError) {
        console.error(`[storage:upload:${purpose}]`, uploadError);
        return { error: uploadError.message };
    }

    const publicUrl = policy.publicAccess !== false
        ? client.storage.from(policy.bucket).getPublicUrl(storagePath).data.publicUrl
        : storagePath;

    return { success: true, url: publicUrl, storagePath, bucket: policy.bucket };
}

/**
 * Borra un archivo del storage usando la policy del purpose.
 * Acepta path (relativo al bucket) o URL pública.
 */
export async function deleteFileAction(purpose: StoragePurpose, pathOrUrl: string): Promise<{ success: true } | { error: string }> {
    const policy = getPolicy(purpose);

    if (policy.requiresAdmin) {
        const session = await validateAdminSession();
        if (!session.valid) return { error: 'NO AUTORIZADO.' };
    }

    const client = getClient(policy.client);

    const marker = `/object/public/${policy.bucket}/`;
    let path = pathOrUrl;
    const idx = pathOrUrl.indexOf(marker);
    if (idx !== -1) path = pathOrUrl.slice(idx + marker.length).split('?')[0];

    const { error } = await client.storage.from(policy.bucket).remove([path]);
    if (error) {
        console.error(`[storage:delete:${purpose}]`, error);
        return { error: error.message };
    }
    return { success: true };
}
