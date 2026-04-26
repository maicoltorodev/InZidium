"use server";

import { validateAdminSession } from "@/lib/actions";
import { supabaseCrmAdmin } from "@/lib/supabase/crm/server";
import { revalidatePath } from "next/cache";
import { revalidateBotCache } from "../revalidate";
import { generateUniqueSlug, slugify } from "../slugify";
import type { Servicio, ServiceVariant, ServiceFaq, ActionResult } from "../types";

const REDIRECTS_TABLE = "service_slug_redirects";
const FAQS_TABLE = "service_faqs";
const TABLE = "services";

// Las imágenes de servicios se suben/borran vía `lib/storage/upload.client.ts`
// usando la policy 'service-image'. NO agregar funciones de upload acá.

export async function listServicios(): Promise<Servicio[]> {
    const session = await validateAdminSession();
    if (!session.valid) return [];
    const { data, error } = await supabaseCrmAdmin
        .from(TABLE)
        .select("*, service_variants(id,name,price,description,sort_order,active,created_at,service_id)")
        .order("category", { ascending: true, nullsFirst: false })
        .order("name", { ascending: true })
        .order("sort_order", { ascending: true, referencedTable: "service_variants" });
    if (error) {
        console.error("[servicios:list]", error);
        return [];
    }
    return (data ?? []) as Servicio[];
}

export async function getServiciosHomepage(): Promise<Servicio[]> {
    const { data, error } = await supabaseCrmAdmin
        .from(TABLE)
        .select("id,name,slug,description,price,category,service_type,image_url,sort_order,updated_at,service_variants(id,name,price,description,sort_order,active)")
        .eq("active", true)
        .order("sort_order", { ascending: true })
        .order("sort_order", { ascending: true, referencedTable: "service_variants" });
    if (error) {
        console.error("[servicios:homepage]", error);
        return [];
    }
    return (data ?? []) as Servicio[];
}

export async function getServicioBySlug(slug: string): Promise<Servicio | null> {
    const { data, error } = await supabaseCrmAdmin
        .from(TABLE)
        .select("*, service_variants(id,name,price,description,sort_order,active), service_faqs(id,service_id,question,answer,sort_order,active,created_at,updated_at)")
        .eq("slug", slug)
        .eq("active", true)
        .order("sort_order", { ascending: true, referencedTable: "service_variants" })
        .order("sort_order", { ascending: true, referencedTable: "service_faqs" })
        .maybeSingle();
    if (error) {
        console.error("[servicios:bySlug]", error);
        return null;
    }
    return data as Servicio | null;
}

export async function getServiceSlugRedirect(oldSlug: string): Promise<string | null> {
    const { data, error } = await supabaseCrmAdmin
        .from(REDIRECTS_TABLE)
        .select("service_id, services!inner(slug,active)")
        .eq("old_slug", oldSlug)
        .maybeSingle();
    if (error || !data) return null;
    const services = (data as unknown as { services: { slug: string; active: boolean } }).services;
    if (!services?.active) return null;
    return services.slug;
}

async function isSlugTaken(candidate: string): Promise<boolean> {
    const { count, error } = await supabaseCrmAdmin
        .from(TABLE)
        .select("id", { count: "exact", head: true })
        .eq("slug", candidate);
    if (error) {
        console.error("[servicios:slug-check]", error);
        return true;
    }
    return (count ?? 0) > 0;
}

export async function createServicio(input: {
    name: string;
    description?: string;
    details?: string | null;
    seo_title?: string | null;
    seo_description?: string | null;
    price?: number | null;
    category?: string;
    service_type?: "normal" | "general";
    image_url?: string | null;
}): Promise<ActionResult<Servicio>> {
    const session = await validateAdminSession();
    if (!session.valid) return { error: "NO AUTORIZADO." };

    const name = input.name?.trim();
    if (!name) return { error: "EL NOMBRE ES OBLIGATORIO." };

    const isGeneral = input.service_type === "general";
    const slug = await generateUniqueSlug(name, isSlugTaken);

    // Si el slug nuevo coincide con un old_slug en redirects, lo limpiamos.
    await supabaseCrmAdmin.from(REDIRECTS_TABLE).delete().eq("old_slug", slug);

    const { data, error } = await supabaseCrmAdmin
        .from(TABLE)
        .insert({
            name,
            slug,
            description: input.description?.trim() || null,
            details: input.details?.trim() || null,
            seo_title: input.seo_title?.trim() || null,
            seo_description: input.seo_description?.trim() || null,
            price: isGeneral ? null : (typeof input.price === "number" ? input.price : null),
            category: input.category?.trim() || null,
            service_type: input.service_type ?? "normal",
            image_url: input.image_url ?? null,
            active: true,
        })
        .select()
        .single();

    if (error || !data) {
        console.error("[servicios:create]", error);
        return { error: "NO SE PUDO CREAR EL SERVICIO." };
    }

    revalidatePath("/admin/servicios");
    revalidatePath("/");
    revalidatePath(`/servicios/${slug}`);
    revalidateBotCache("catalog");
    return { success: true, data: data as Servicio };
}

export async function updateServicio(
    id: string,
    input: Partial<{
        name: string;
        slug: string;
        description: string | null;
        details: string | null;
        seo_title: string | null;
        seo_description: string | null;
        price: number | null;
        category: string | null;
        service_type: "normal" | "general";
        active: boolean;
        image_url: string | null;
    }>
): Promise<ActionResult<Servicio>> {
    const session = await validateAdminSession();
    if (!session.valid) return { error: "NO AUTORIZADO." };

    const patch: Record<string, unknown> = {};
    if (input.name !== undefined) {
        const n = input.name.trim();
        if (!n) return { error: "EL NOMBRE ES OBLIGATORIO." };
        patch.name = n;
    }
    if (input.description !== undefined)
        patch.description = input.description?.trim() || null;
    if (input.details !== undefined)
        patch.details = input.details?.trim() || null;
    if (input.seo_title !== undefined)
        patch.seo_title = input.seo_title?.trim() || null;
    if (input.seo_description !== undefined)
        patch.seo_description = input.seo_description?.trim() || null;
    if (input.service_type !== undefined) {
        patch.service_type = input.service_type;
        if (input.service_type === "general") patch.price = null;
    }
    if (input.price !== undefined && input.service_type !== "general")
        patch.price = input.price;
    if (input.category !== undefined)
        patch.category = input.category?.trim() || null;
    if (input.active !== undefined) patch.active = input.active;
    if (input.image_url !== undefined) patch.image_url = input.image_url;

    let oldSlugForRedirect: string | null = null;
    let revalidateOldPath: string | null = null;
    if (input.slug !== undefined) {
        const desired = slugify(input.slug);
        if (!desired) return { error: "EL SLUG NO PUEDE SER VACÍO." };

        const { data: current, error: currentErr } = await supabaseCrmAdmin
            .from(TABLE)
            .select("slug")
            .eq("id", id)
            .maybeSingle();
        if (currentErr || !current) return { error: "SERVICIO NO ENCONTRADO." };

        if (current.slug !== desired) {
            const { count } = await supabaseCrmAdmin
                .from(TABLE)
                .select("id", { count: "exact", head: true })
                .eq("slug", desired)
                .neq("id", id);
            if ((count ?? 0) > 0) return { error: "ESE SLUG YA ESTÁ EN USO POR OTRO SERVICIO." };

            oldSlugForRedirect = current.slug;
            revalidateOldPath = `/servicios/${current.slug}`;
            patch.slug = desired;
        }
    }

    if (Object.keys(patch).length === 0) {
        return { error: "NO HAY CAMBIOS PARA GUARDAR." };
    }

    const { data, error } = await supabaseCrmAdmin
        .from(TABLE)
        .update(patch)
        .eq("id", id)
        .select()
        .single();

    if (error || !data) {
        console.error("[servicios:update]", error);
        return { error: "NO SE PUDO ACTUALIZAR EL SERVICIO." };
    }

    const updated = data as Servicio;

    if (oldSlugForRedirect) {
        // Si el nuevo slug existía como old_slug de otra ruta, lo borramos para que el nuevo dueño se quede con la URL.
        await supabaseCrmAdmin.from(REDIRECTS_TABLE).delete().eq("old_slug", updated.slug);
        // Removemos cualquier redirect viejo con el mismo old_slug (stale) y lo creamos limpio.
        await supabaseCrmAdmin.from(REDIRECTS_TABLE).delete().eq("old_slug", oldSlugForRedirect);
        const { error: redirErr } = await supabaseCrmAdmin
            .from(REDIRECTS_TABLE)
            .insert({ old_slug: oldSlugForRedirect, service_id: id });
        if (redirErr) console.error("[servicios:redirect-log]", redirErr);
    }

    revalidatePath("/admin/servicios");
    revalidatePath("/");
    if (updated.slug) revalidatePath(`/servicios/${updated.slug}`);
    if (revalidateOldPath) revalidatePath(revalidateOldPath);
    revalidateBotCache("catalog");
    return { success: true, data: updated };
}

export async function toggleServicioActive(
    id: string,
    active: boolean
): Promise<ActionResult<Servicio>> {
    return updateServicio(id, { active });
}

export async function deleteServicio(id: string): Promise<ActionResult> {
    const session = await validateAdminSession();
    if (!session.valid) return { error: "NO AUTORIZADO." };

    const { data: existing } = await supabaseCrmAdmin
        .from(TABLE)
        .select("slug")
        .eq("id", id)
        .maybeSingle();

    const { error } = await supabaseCrmAdmin.from(TABLE).delete().eq("id", id);

    if (error) {
        console.error("[servicios:delete]", error);
        return { error: "NO SE PUDO ELIMINAR EL SERVICIO." };
    }

    revalidatePath("/admin/servicios");
    revalidatePath("/");
    if (existing?.slug) revalidatePath(`/servicios/${existing.slug}`);
    revalidateBotCache("catalog");
    return { success: true };
}

// ── Variants ────────────────────────────────────────────────────────────────

const VARIANTS_TABLE = "service_variants";

export async function createVariant(
    serviceId: string,
    input: { name: string; price?: number | null; description?: string | null },
): Promise<ActionResult<ServiceVariant>> {
    const session = await validateAdminSession();
    if (!session.valid) return { error: "NO AUTORIZADO." };

    const name = input.name?.trim();
    if (!name) return { error: "EL NOMBRE ES OBLIGATORIO." };

    const { count } = await supabaseCrmAdmin
        .from(VARIANTS_TABLE)
        .select("*", { count: "exact", head: true })
        .eq("service_id", serviceId);

    const { data, error } = await supabaseCrmAdmin
        .from(VARIANTS_TABLE)
        .insert({
            service_id: serviceId,
            name,
            price: typeof input.price === "number" ? input.price : null,
            description: input.description?.trim() || null,
            sort_order: count ?? 0,
            active: true,
        })
        .select()
        .single();

    if (error || !data) {
        console.error("[variants:create]", error);
        return { error: "NO SE PUDO CREAR LA VARIANTE." };
    }

    revalidateBotCache("catalog");
    return { success: true, data: data as ServiceVariant };
}

export async function updateVariant(
    id: string,
    input: Partial<{ name: string; price: number | null; description: string | null; active: boolean }>,
): Promise<ActionResult<ServiceVariant>> {
    const session = await validateAdminSession();
    if (!session.valid) return { error: "NO AUTORIZADO." };

    const patch: Record<string, unknown> = {};
    if (input.name !== undefined) {
        const n = input.name.trim();
        if (!n) return { error: "EL NOMBRE ES OBLIGATORIO." };
        patch.name = n;
    }
    if (input.price !== undefined) patch.price = input.price;
    if (input.description !== undefined) patch.description = input.description?.trim() || null;
    if (input.active !== undefined) patch.active = input.active;

    if (Object.keys(patch).length === 0) return { error: "NO HAY CAMBIOS PARA GUARDAR." };

    const { data, error } = await supabaseCrmAdmin
        .from(VARIANTS_TABLE)
        .update(patch)
        .eq("id", id)
        .select()
        .single();

    if (error || !data) {
        console.error("[variants:update]", error);
        return { error: "NO SE PUDO ACTUALIZAR LA VARIANTE." };
    }

    revalidateBotCache("catalog");
    return { success: true, data: data as ServiceVariant };
}

export async function deleteVariant(id: string): Promise<ActionResult> {
    const session = await validateAdminSession();
    if (!session.valid) return { error: "NO AUTORIZADO." };

    const { error } = await supabaseCrmAdmin
        .from(VARIANTS_TABLE)
        .delete()
        .eq("id", id);

    if (error) {
        console.error("[variants:delete]", error);
        return { error: "NO SE PUDO ELIMINAR LA VARIANTE." };
    }

    revalidateBotCache("catalog");
    return { success: true };
}

// ── FAQs ────────────────────────────────────────────────────────────────────

export async function listServiceFaqs(serviceId: string): Promise<ServiceFaq[]> {
    const { data, error } = await supabaseCrmAdmin
        .from(FAQS_TABLE)
        .select("*")
        .eq("service_id", serviceId)
        .order("sort_order", { ascending: true });
    if (error) {
        console.error("[faqs:list]", error);
        return [];
    }
    return (data ?? []) as ServiceFaq[];
}

async function revalidateForService(serviceId: string) {
    const { data } = await supabaseCrmAdmin
        .from(TABLE)
        .select("slug")
        .eq("id", serviceId)
        .maybeSingle();
    if (data?.slug) revalidatePath(`/servicios/${data.slug}`);
}

export async function createServiceFaq(
    serviceId: string,
    input: { question: string; answer: string },
): Promise<ActionResult<ServiceFaq>> {
    const session = await validateAdminSession();
    if (!session.valid) return { error: "NO AUTORIZADO." };

    const question = input.question?.trim();
    const answer = input.answer?.trim();
    if (!question || !answer) return { error: "PREGUNTA Y RESPUESTA SON OBLIGATORIAS." };

    const { count } = await supabaseCrmAdmin
        .from(FAQS_TABLE)
        .select("*", { count: "exact", head: true })
        .eq("service_id", serviceId);

    const { data, error } = await supabaseCrmAdmin
        .from(FAQS_TABLE)
        .insert({
            service_id: serviceId,
            question,
            answer,
            sort_order: count ?? 0,
            active: true,
        })
        .select()
        .single();

    if (error || !data) {
        console.error("[faqs:create]", error);
        return { error: "NO SE PUDO CREAR LA FAQ." };
    }

    await revalidateForService(serviceId);
    revalidatePath("/admin/servicios");
    return { success: true, data: data as ServiceFaq };
}

export async function updateServiceFaq(
    id: string,
    input: Partial<{ question: string; answer: string; active: boolean; sort_order: number }>,
): Promise<ActionResult<ServiceFaq>> {
    const session = await validateAdminSession();
    if (!session.valid) return { error: "NO AUTORIZADO." };

    const patch: Record<string, unknown> = {};
    if (input.question !== undefined) {
        const q = input.question.trim();
        if (!q) return { error: "LA PREGUNTA ES OBLIGATORIA." };
        patch.question = q;
    }
    if (input.answer !== undefined) {
        const a = input.answer.trim();
        if (!a) return { error: "LA RESPUESTA ES OBLIGATORIA." };
        patch.answer = a;
    }
    if (input.active !== undefined) patch.active = input.active;
    if (input.sort_order !== undefined) patch.sort_order = input.sort_order;

    if (Object.keys(patch).length === 0) return { error: "NO HAY CAMBIOS PARA GUARDAR." };

    const { data, error } = await supabaseCrmAdmin
        .from(FAQS_TABLE)
        .update(patch)
        .eq("id", id)
        .select()
        .single();

    if (error || !data) {
        console.error("[faqs:update]", error);
        return { error: "NO SE PUDO ACTUALIZAR LA FAQ." };
    }

    await revalidateForService((data as ServiceFaq).service_id);
    revalidatePath("/admin/servicios");
    return { success: true, data: data as ServiceFaq };
}

export async function deleteServiceFaq(id: string): Promise<ActionResult> {
    const session = await validateAdminSession();
    if (!session.valid) return { error: "NO AUTORIZADO." };

    const { data: existing } = await supabaseCrmAdmin
        .from(FAQS_TABLE)
        .select("service_id")
        .eq("id", id)
        .maybeSingle();

    const { error } = await supabaseCrmAdmin.from(FAQS_TABLE).delete().eq("id", id);
    if (error) {
        console.error("[faqs:delete]", error);
        return { error: "NO SE PUDO ELIMINAR LA FAQ." };
    }

    if (existing?.service_id) await revalidateForService(existing.service_id);
    revalidatePath("/admin/servicios");
    return { success: true };
}
