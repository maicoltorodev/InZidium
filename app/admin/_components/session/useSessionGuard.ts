"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

const KEY = "inzidium.admin.tab.username";

export type SessionMismatch = {
    /** Username que esta pestaña vio al cargar. */
    previous: string;
    /** Username actual (cookie compartida pisada por otro login). */
    current: string;
};

/**
 * Detecta cambios de sesión bajo la pestaña actual.
 * - Al primer load, guarda el username en sessionStorage (key por-pestaña, NO se comparte).
 * - Si después useSession() devuelve otro username, exponemos `mismatch`.
 * - El SessionProvider hace refetch cada 30s y on focus → el cambio se detecta rápido.
 */
export function useSessionGuard(): SessionMismatch | null {
    const { data: session, status } = useSession();
    const [mismatch, setMismatch] = useState<SessionMismatch | null>(null);

    useEffect(() => {
        if (typeof window === "undefined") return;
        if (status !== "authenticated") return;

        const current =
            ((session?.user as any)?.username as string | undefined) ??
            ((session?.user as any)?.id as string | undefined) ??
            null;
        if (!current) return;

        const previous = sessionStorage.getItem(KEY);
        if (!previous) {
            // Primer load de esta pestaña → memorizamos
            sessionStorage.setItem(KEY, current);
            return;
        }
        if (previous !== current) {
            setMismatch({ previous, current });
        }
    }, [session, status]);

    return mismatch;
}

/**
 * Resetea el "memorizado" para que el SessionGuard deje de mostrar el modal
 * (cuando el usuario decide aceptar la nueva sesión).
 */
export function adoptCurrentSession(username: string) {
    if (typeof window === "undefined") return;
    sessionStorage.setItem(KEY, username);
}

/**
 * Limpia el memorizado (al hacer logout, sino la próxima sesión arranca con el viejo).
 */
export function clearSessionGuard() {
    if (typeof window === "undefined") return;
    sessionStorage.removeItem(KEY);
}
