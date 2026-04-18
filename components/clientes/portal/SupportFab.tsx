"use client";

import { MessageCircle } from "lucide-react";
import { ESTUDIO_CONFIG } from "@/lib/config";

/**
 * Botón flotante de soporte vía WhatsApp. Usa el número configurado en
 * `ESTUDIO_CONFIG.whatsapp`. Si no está definido, no renderiza nada.
 */
export function SupportFab({
    cedula,
    clienteNombre,
}: {
    cedula?: string;
    clienteNombre?: string;
}) {
    const raw = ESTUDIO_CONFIG.whatsapp ?? ESTUDIO_CONFIG.telefono ?? "";
    const phone = raw.replace(/\D/g, "");
    if (!phone) return null;

    const prefill = [
        `Hola, necesito ayuda con mi proyecto en ${ESTUDIO_CONFIG.nombre}.`,
        clienteNombre ? `Soy ${clienteNombre}.` : null,
        cedula ? `Mi cédula: ${cedula}.` : null,
    ]
        .filter(Boolean)
        .join(" ");
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(prefill)}`;

    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Soporte por WhatsApp"
            className="fixed bottom-5 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[#25d366] text-white shadow-[0_10px_30px_rgba(37,211,102,0.4)] hover:scale-105 active:scale-95 transition-transform"
        >
            <MessageCircle className="h-5 w-5" fill="currentColor" />
        </a>
    );
}
