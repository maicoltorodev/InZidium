"use client";

import { WhatsAppIcon } from "@/lib/icons/WhatsAppIcon";
import { ESTUDIO_CONFIG } from "@/lib/config";

/**
 * FAB de WhatsApp para la pantalla de login del portal cliente.
 *
 * Usa el MISMO look que el `FabWhatsApp` de la landing pública (glassmorphism
 * blur + animación ping), con el número del estudio. Si el user ya escribió
 * cédula pero no se logueó, se prefill el mensaje con ella para que el estudio
 * pueda ayudarlo más rápido.
 *
 * Solo aparece en el login — dentro del portal logueado NO se muestra (decisión
 * del owner: el FAB se siente invasivo cuando el cliente ya está trabajando en
 * su proyecto).
 */
export function LoginSupportFab({ cedula }: { cedula?: string }) {
    const raw = ESTUDIO_CONFIG.whatsapp ?? ESTUDIO_CONFIG.telefono ?? "";
    const phone = raw.replace(/\D/g, "");
    if (!phone) return null;

    const prefill = [
        `Hola, necesito ayuda para ingresar a mi proyecto en ${ESTUDIO_CONFIG.nombre}.`,
        cedula ? `Mi cédula: ${cedula}.` : null,
    ]
        .filter(Boolean)
        .join(" ");
    const href = `https://wa.me/${phone}?text=${encodeURIComponent(prefill)}`;

    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-5 right-5 sm:bottom-8 sm:right-8 z-40 group transition-all duration-300"
            aria-label="Contactar por WhatsApp"
        >
            <div className="relative w-16 h-16 sm:w-24 sm:h-24 border border-white/[0.08] bg-white/5 backdrop-blur-2xl rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-300 hover:scale-110 hover:shadow-[0_12px_40px_rgba(0,0,0,0.6)]">
                <div className="absolute top-1/2 left-1/2 w-9 h-9 sm:w-14 sm:h-14 -translate-x-1/2 -translate-y-1/2 text-white">
                    <WhatsAppIcon className="w-full h-full" />
                </div>
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/[0.02] via-transparent to-white/[0.02] pointer-events-none" />
                <div className="absolute inset-0 rounded-full bg-white/10 animate-ping opacity-20" />
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/10 via-white/5 to-white/10 opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
            </div>

            <div className="absolute bottom-full right-0 mb-3 px-4 py-2 border border-white/[0.08] bg-white/5 backdrop-blur-2xl text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap pointer-events-none group-hover:translate-x-0 translate-x-2 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/[0.02] via-transparent to-white/[0.02] pointer-events-none" />
                <span className="absolute bottom-0 right-6 w-2 h-2 translate-y-1/2 rotate-45 border border-white/[0.08] bg-white/5 backdrop-blur-2xl"></span>
                <span className="relative z-10">Contáctanos por WhatsApp</span>
            </div>
        </a>
    );
}
