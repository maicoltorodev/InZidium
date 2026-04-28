import { auth as getSession } from "@/auth";

/**
 * Devuelve un identificador estable del admin actual para auditoría.
 * Prefiere `username`, cae a `id`, y si no hay sesión devuelve "admin".
 */
export async function currentAdminId(): Promise<string> {
    const userSession = await getSession();
    return (
        ((userSession?.user as any)?.username as string | undefined) ??
        ((userSession?.user as any)?.id as string | undefined) ??
        "admin"
    );
}
