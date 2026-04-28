"use client";

import { useSessionGuard } from "./useSessionGuard";
import { SessionMismatchModal } from "./SessionMismatchModal";

/**
 * Monta un único guard global del admin. Insertado en `app/admin/layout.tsx`.
 * Si detecta que la sesión cambió en otra pestaña → muestra modal bloqueante.
 */
export function SessionGuard() {
    const mismatch = useSessionGuard();
    if (!mismatch) return null;
    return <SessionMismatchModal mismatch={mismatch} />;
}
