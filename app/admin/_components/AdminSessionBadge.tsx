"use client";

import { useSession } from "next-auth/react";
import { UserCircle2 } from "lucide-react";

/**
 * Pildora compacta que muestra qué admin está logueado.
 * Se usa arriba del botón "Cerrar Sesión" en sidebar y mobile nav.
 */
export function AdminSessionBadge() {
    const { data: session, status } = useSession();
    if (status !== "authenticated") return null;

    const username =
        ((session?.user as any)?.username as string | undefined) ??
        ((session?.user as any)?.name as string | undefined) ??
        ((session?.user as any)?.email as string | undefined) ??
        "admin";

    return (
        <div
            className="flex items-center gap-2.5 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-4 py-2.5"
            title={`Sesión activa: ${username}`}
        >
            <div
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#FFD700]/30 bg-[#FFD700]/10"
                style={{ boxShadow: "0 0 12px rgba(255,215,0,0.15)" }}
            >
                <UserCircle2 className="h-4 w-4 text-[#FFD700]" />
            </div>
            <div className="min-w-0 flex-1">
                <p className="text-[9px] font-black uppercase tracking-[0.25em] text-gray-500 leading-none mb-0.5">
                    Sesión
                </p>
                <p className="truncate text-xs font-bold text-white leading-tight">
                    {username}
                </p>
            </div>
        </div>
    );
}
