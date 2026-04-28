"use server";

import { auth as getSession } from "@/auth";
import { validateAdminSession } from "@/lib/actions";
import { supabaseCrmAdmin } from "@/lib/supabase/crm/server";
import { revalidatePath } from "next/cache";
import type {
    ActionResult,
    Order,
    OrderItem,
    OrderStatus,
    OrderWithContact,
} from "../types";
import { currentAdminId } from "./_helpers";
import { logEvent } from "./events";

const TABLE = "orders";

export async function listOrders(): Promise<OrderWithContact[]> {
    const session = await validateAdminSession();
    if (!session.valid) return [];

    const { data, error } = await supabaseCrmAdmin
        .from(TABLE)
        .select("*, contact:contacts(id, name, phone)")
        .order("created_at", { ascending: false })
        .limit(500);

    if (error) {
        console.error("[pedidos:list]", error);
        return [];
    }
    return (data ?? []) as OrderWithContact[];
}

export async function updateOrderStatus(
    id: string,
    status: OrderStatus,
): Promise<ActionResult<Order>> {
    const session = await validateAdminSession();
    if (!session.valid) return { error: "NO AUTORIZADO." };

    const { data, error } = await supabaseCrmAdmin
        .from(TABLE)
        .update({ status })
        .eq("id", id)
        .select()
        .single();

    if (error || !data) {
        console.error("[pedidos:updateStatus]", error);
        return { error: "NO SE PUDO CAMBIAR EL ESTADO." };
    }

    const actor = await currentAdminId();
    logEvent({
        type: "order.status_changed",
        actor,
        contactId: data.contact_id,
        targetId: data.id,
        payload: { status },
    });

    revalidatePath("/admin/pedidos");
    return { success: true, data: data as Order };
}

export async function updateOrderDetails(
    id: string,
    patch: { total?: number | null; notes?: string | null },
): Promise<ActionResult<Order>> {
    const session = await validateAdminSession();
    if (!session.valid) return { error: "NO AUTORIZADO." };

    const update: Record<string, unknown> = {};
    if (patch.total !== undefined) update.total = patch.total;
    if (patch.notes !== undefined) update.notes = patch.notes?.trim() || null;

    if (Object.keys(update).length === 0) {
        return { error: "NO HAY CAMBIOS PARA GUARDAR." };
    }

    const { data, error } = await supabaseCrmAdmin
        .from(TABLE)
        .update(update)
        .eq("id", id)
        .select()
        .single();

    if (error || !data) {
        console.error("[pedidos:updateDetails]", error);
        return { error: "NO SE PUDO ACTUALIZAR EL PEDIDO." };
    }

    revalidatePath("/admin/pedidos");
    return { success: true, data: data as Order };
}

export type CreateOrderInput = {
    contactId: string;
    items: OrderItem[];
    total?: number | null;
    notes?: string | null;
    status?: OrderStatus;
};

export async function createOrder(input: CreateOrderInput): Promise<ActionResult<OrderWithContact>> {
    const session = await validateAdminSession();
    if (!session.valid) return { error: "NO AUTORIZADO." };

    if (!input.contactId) return { error: "SELECCIONA UN CONTACTO." };
    if (!input.items || input.items.length === 0) {
        return { error: "AGREGA AL MENOS UN ÍTEM." };
    }
    const cleanItems = input.items.filter((it) => it.name?.trim());
    if (cleanItems.length === 0) return { error: "LOS ÍTEMS NECESITAN NOMBRE." };

    const userSession = await getSession();
    const createdBy =
        ((userSession?.user as any)?.username as string | undefined) ??
        ((userSession?.user as any)?.id as string | undefined) ??
        "admin";

    const { data, error } = await supabaseCrmAdmin
        .from(TABLE)
        .insert({
            contact_id: input.contactId,
            items: cleanItems,
            total: input.total ?? null,
            notes: input.notes?.trim() || null,
            status: input.status ?? "new",
            created_by: createdBy,
        })
        .select("*, contact:contacts(id, name, phone)")
        .single();

    if (error || !data) {
        console.error("[pedidos:create]", error);
        return { error: "NO SE PUDO CREAR EL PEDIDO." };
    }

    logEvent({
        type: "order.created",
        actor: createdBy,
        contactId: input.contactId,
        targetId: data.id,
        payload: {
            items_count: cleanItems.length,
            total: input.total ?? null,
            status: input.status ?? "new",
        },
    });

    revalidatePath("/admin/pedidos");
    return { success: true, data: data as OrderWithContact };
}

export async function deleteOrder(id: string): Promise<ActionResult> {
    const session = await validateAdminSession();
    if (!session.valid) return { error: "NO AUTORIZADO." };

    // Lookup contact_id antes de borrar para el event log
    const { data: orderRow } = await supabaseCrmAdmin
        .from(TABLE)
        .select("contact_id")
        .eq("id", id)
        .maybeSingle();

    const { error } = await supabaseCrmAdmin.from(TABLE).delete().eq("id", id);

    if (error) {
        console.error("[pedidos:delete]", error);
        return { error: "NO SE PUDO ELIMINAR EL PEDIDO." };
    }

    const actor = await currentAdminId();
    logEvent({
        type: "order.deleted",
        actor,
        contactId: orderRow?.contact_id ?? null,
        targetId: id,
        payload: {},
    });

    revalidatePath("/admin/pedidos");
    return { success: true };
}
