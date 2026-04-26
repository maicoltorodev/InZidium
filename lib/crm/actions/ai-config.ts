"use server";

import { validateAdminSession } from "@/lib/actions";
import { supabaseCrmAdmin } from "@/lib/supabase/crm/server";
import { auth as getSession } from "@/auth";
import { revalidatePath } from "next/cache";
import { revalidateBotCache } from "../revalidate";
import type { AIConfig, AIConfigInput, ActionResult } from "../types";

const TABLE = "ai_config";
const SINGLETON_ID = 1;

const EMPTY: AIConfig = {
    id: SINGLETON_ID,
    prompt: "",
    persona: "",
    horarios: "",
    updated_by: null,
    updated_at: new Date().toISOString(),
};

export async function getAIConfig(): Promise<AIConfig> {
    const session = await validateAdminSession();
    if (!session.valid) return EMPTY;

    const { data, error } = await supabaseCrmAdmin
        .from(TABLE)
        .select("*")
        .eq("id", SINGLETON_ID)
        .maybeSingle();

    if (error) {
        console.error("[ai-config:get]", error);
        return EMPTY;
    }
    return (data as AIConfig | null) ?? EMPTY;
}

export async function updateAIConfig(
    input: AIConfigInput,
): Promise<ActionResult<AIConfig>> {
    const session = await validateAdminSession();
    if (!session.valid) return { error: "NO AUTORIZADO." };

    const userSession = await getSession();
    const updatedBy =
        ((userSession?.user as any)?.username as string | undefined) ??
        ((userSession?.user as any)?.id as string | undefined) ??
        null;

    const { data, error } = await supabaseCrmAdmin
        .from(TABLE)
        .upsert(
            {
                id: SINGLETON_ID,
                prompt: input.prompt ?? "",
                persona: input.persona ?? "",
                horarios: input.horarios ?? "",
                updated_by: updatedBy,
            },
            { onConflict: "id" },
        )
        .select()
        .single();

    if (error || !data) {
        console.error("[ai-config:update]", error);
        return { error: "NO SE PUDO GUARDAR LA CONFIGURACIÓN." };
    }

    revalidatePath("/admin/config-ia");
    revalidateBotCache("ai_config");
    return { success: true, data: data as AIConfig };
}
