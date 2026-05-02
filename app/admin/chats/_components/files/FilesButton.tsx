"use client";

import { useState } from "react";
import { FolderOpen } from "lucide-react";
import { ContactFilesModal } from "./ContactFilesModal";

type Props = { contactId: string; contactName: string };

/**
 * Botón con icono de archivos en el header del ContactProfile.
 * Click → abre modal con todos los archivos del contacto.
 */
export function FilesButton({ contactId, contactName }: Props) {
    const [open, setOpen] = useState(false);
    return (
        <>
            <button
                onClick={() => setOpen(true)}
                aria-label="Archivos del contacto"
                title="Archivos"
                className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.03] text-gray-400 transition hover:border-[#22d3ee]/30 hover:bg-[#22d3ee]/[0.06] hover:text-[#22d3ee]"
            >
                <FolderOpen className="h-4 w-4" />
            </button>
            <ContactFilesModal
                open={open}
                onClose={() => setOpen(false)}
                contactId={contactId}
                contactName={contactName}
            />
        </>
    );
}
