"use client";

import { motion } from "framer-motion";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import { ESTUDIO_CONFIG } from "@/lib/config";

/**
 * FAB de WhatsApp para la pantalla de login del portal cliente.
 *
 * Usa el MISMO look que el `WhatsAppFAB` de la landing pública (holographic
 * body + cosmic glow + tooltip ONLINE). No incluye el IntersectionObserver
 * del hero porque en el portal no hay sección #inicio para trackear.
 *
 * El número y mensaje usan `ESTUDIO_CONFIG`. Si el user ya escribió cédula
 * pero no se logueó, se prefill el mensaje con ella.
 *
 * Solo aparece en el login — dentro del portal logueado NO se muestra.
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
            className="fixed bottom-8 right-8 z-50 group mb-[env(safe-area-inset-bottom)]"
            aria-label="Contactar por WhatsApp"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-[#a855f7] via-transparent to-[#22d3ee] opacity-30 blur-3xl group-hover:opacity-60 transition-opacity duration-700 animate-pulse hide-on-mobile" />

            <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="relative will-change-transform"
            >
                <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full flex items-center justify-center relative overflow-hidden border border-white/20 bg-white/[0.03] backdrop-blur-lg md:backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] group-hover:border-white/50 transition-colors duration-500 will-change-transform translate-z-0 backface-hidden">

                    <motion.div
                        animate={{ rotate: [0, 360], scale: [1, 1.3, 1] }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-[-60%] bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.3)_0%,transparent_50%),radial-gradient(circle_at_center,rgba(34,211,238,0.3)_0%,transparent_70%)] opacity-40 blur-2xl mix-blend-screen group-hover:opacity-60"
                    />

                    <div className="absolute inset-0 rounded-full border border-white/10 opacity-50 group-hover:opacity-100">
                        <div className="absolute inset-[-2px] rounded-full bg-gradient-to-r from-transparent via-white/40 to-transparent rotate-45 group-hover:animate-[spin_1.5s_linear_infinite] opacity-0 group-hover:opacity-100" />
                    </div>

                    <WhatsAppIcon className="h-8 w-8 sm:h-10 sm:w-10 text-white/90 relative z-10 transition-all duration-500 group-hover:scale-110 group-hover:drop-shadow-[0_0_15px_rgba(255,255,255,1)]" />

                    <div className="absolute top-0 left-[-100%] h-full w-[200%] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-25deg] group-hover:animate-[shine_2s_infinite_linear]" />
                </div>

                <div className="absolute right-full mr-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 translate-x-10 group-hover:translate-x-0 transition-all duration-500 pointer-events-none hidden md:block">
                    <div className="relative overflow-hidden px-8 py-3 rounded-2xl border-l-[3px] border-neon-cyan bg-[#030014]/70 backdrop-blur-3xl shadow-2xl">
                        <p className="text-[11px] font-orbitron font-bold tracking-[0.6em] text-white uppercase flex items-center gap-5">
                            <span className="flex h-2.5 w-2.5 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-cyan opacity-80"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-neon-cyan shadow-[0_0_10px_#22d3ee]"></span>
                            </span>
                            ONLINE
                        </p>
                        <div className="absolute inset-0 bg-gradient-to-r from-neon-purple/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                </div>
            </motion.div>
        </a>
    );
}
