"use client";

import { useState } from "react";
import { Bomb } from "lucide-react";
import { ResetConfirmModal } from "./ResetConfirmModal";

/**
 * Boton temporal para QA/testing: borra TODO el CRM.
 * Mantenerlo visible solo mientras se necesite resetear datos de prueba.
 */
export function ResetButton() {
    const [open, setOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                title="Resetear TODO el CRM"
                aria-label="Resetear TODO el CRM"
                className="flex h-8 w-8 items-center justify-center rounded-xl border border-red-500/30 bg-red-500/[0.08] text-red-400 transition hover:border-red-500/60 hover:bg-red-500/15 hover:text-red-300 active:scale-95"
            >
                <Bomb className="h-3.5 w-3.5" />
            </button>

            {open && <ResetConfirmModal onClose={() => setOpen(false)} />}
        </>
    );
}
