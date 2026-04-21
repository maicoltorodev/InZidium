"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { Loader2, PartyPopper, Globe } from "lucide-react";
import { MOTION } from "./motion";
import { BRAND_ICON_STYLE } from "./BrandDefs";

/**
 * Modal "felicidades — terminaste el onboarding". Aparece cuando el cliente
 * vuelve al hub habiendo completado el 100% (en fase `onboarding`). Refuerza
 * la importancia del dominio antes de disparar la construcción.
 *
 * Variantes según `linkLocked`:
 *  - false → "Si querés cambiarlo después, tendrás que pagarlo aparte"
 *  - true  → "Si deseas uno diferente, tendrás que pagarlo aparte"
 *
 * NO se puede cerrar sin confirmar — sin X, sin backdrop dismiss, sin "Volver".
 * El único camino para cerrarlo es "Aceptar" → dispara la transición a fase
 * construccion. Forzamos al cliente a tomar la decisión informada.
 */
export function OnboardingCompleteModal({
  open,
  onConfirm,
  domain,
  linkLocked,
}: {
  open: boolean;
  onConfirm: () => Promise<void> | void;
  /** URL completa a mostrar (ej: "www.tudominio.com" o link admin). */
  domain: string;
  linkLocked?: boolean;
}) {
  const [confirming, setConfirming] = useState(false);

  if (typeof document === "undefined") return null;

  const handleConfirm = async () => {
    if (confirming) return;
    setConfirming(true);
    try {
      await onConfirm();
    } finally {
      setConfirming(false);
    }
  };

  const subtitleCopy = linkLocked
    ? "Este será tu dominio. Si en el futuro deseas uno diferente, tendrás que pagarlo aparte."
    : "Este será tu dominio. Recordá que si más adelante querés cambiarlo, tendrás que pagarlo aparte.";

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="onboarding-complete-title"
        >
          {/* Backdrop sin onClick — modal forzado, no se cierra haciendo tap fuera. */}
          <div
            aria-hidden
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={MOTION.reveal}
            className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-[#a855f7]/30 bg-[#0a0617] p-7 shadow-[0_24px_60px_-12px_rgba(168,85,247,0.5)]"
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-60"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 0%, rgba(168,85,247,0.18), transparent 60%)",
              }}
            />

            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(232,121,249,0.18)_0%,rgba(168,85,247,0.18)_50%,rgba(34,211,238,0.18)_100%)] ring-1 ring-[#a855f7]/40">
                <PartyPopper className="h-6 w-6" style={BRAND_ICON_STYLE} />
              </div>

              <p className="mt-4 inline-block bg-[linear-gradient(90deg,#e879f9_0%,#a855f7_50%,#22d3ee_100%)] bg-clip-text text-[10px] font-black uppercase tracking-[0.32em] text-transparent">
                100% completado
              </p>
              <h2
                id="onboarding-complete-title"
                className="mt-2 text-[22px] font-black leading-tight text-white"
              >
                ¡Felicidades, ya terminaste!
              </h2>
              <p className="mt-2 text-[13px] leading-relaxed text-white/55">
                {subtitleCopy}
              </p>

              {/* Dominio destacado */}
              <div className="mt-5 w-full overflow-hidden rounded-2xl border border-[#a855f7]/25 bg-white/[0.02] p-4">
                <div className="flex items-center justify-center gap-2">
                  <Globe className="h-3.5 w-3.5" style={BRAND_ICON_STYLE} />
                  <span className="text-[9px] font-black uppercase tracking-[0.28em] text-white/40">
                    Tu dominio
                  </span>
                </div>
                <p className="mt-2 break-all text-center text-[16px] font-black leading-tight">
                  <span className="bg-[linear-gradient(90deg,#e879f9_0%,#a855f7_50%,#22d3ee_100%)] bg-clip-text text-transparent">
                    {domain || "—"}
                  </span>
                </p>
              </div>

              <button
                type="button"
                onClick={handleConfirm}
                disabled={confirming}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#e879f9_0%,#a855f7_50%,#22d3ee_100%)] py-3.5 text-[11px] font-black uppercase tracking-[0.24em] text-white shadow-[0_8px_28px_-6px_rgba(168,85,247,0.65)] transition-transform hover:scale-[1.02] disabled:opacity-60"
              >
                {confirming ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Iniciando…
                  </>
                ) : (
                  "Aceptar"
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
