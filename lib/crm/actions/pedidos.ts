"use server";

import { validateAdminSession } from "@/lib/actions";
import { supabaseCrmAdmin } from "@/lib/supabase/crm/server";
import { revalidatePath } from "next/cache";
import type {
    ActionResult,
    Order,
    OrderStatus,
    OrderWithContact,
} from "../types";

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

export async function deleteOrder(id: string): Promise<ActionResult> {
    const session = await validateAdminSession();
    if (!session.valid) return { error: "NO AUTORIZADO." };

    const { error } = await supabaseCrmAdmin.from(TABLE).delete().eq("id", id);

    if (error) {
        console.error("[pedidos:delete]", error);
        return { error: "NO SE PUDO ELIMINAR EL PEDIDO." };
    }

    revalidatePath("/admin/pedidos");
    return { success: true };
}
