"use client";

import { usePrefersReducedMotion } from "./motion";

/**
 * Línea divisoria con gradient fucsia -> purpura -> azul animado horizontalmente.
 * Usa background-size 200% + animación de background-position para mover
 * el gradient constantemente en loop. Se detiene con prefers-reduced-motion.
 */
export function BrandDivider({
  width = "w-16",
  className = "",
}: {
  /** Clase tailwind de ancho. Default: `w-16` (mobile). */
  width?: string;
  className?: string;
}) {
  const reduced = usePrefersReducedMotion();
  // Gradient repetitivo: los colores corren a lo largo de la línea (via
  // background-position) sin que el "hueco" de transparencia los interrumpa.
  // La máscara simula el fade en las puntas, permanece estática.
  const fadeMask =
    "linear-gradient(90deg, transparent 0%, #000 15%, #000 85%, transparent 100%)";
  return (
    <div
      aria-hidden
      className={`mx-auto h-px ${width} ${className}`}
      style={{
        backgroundImage:
          "linear-gradient(90deg, #e879f9 0%, #a855f7 25%, #22d3ee 50%, #a855f7 75%, #e879f9 100%)",
        backgroundSize: "200% 100%",
        backgroundRepeat: "repeat-x",
        WebkitMaskImage: fadeMask,
        maskImage: fadeMask,
        animation: reduced ? undefined : "brandDividerShift 4s linear infinite",
      }}
    />
  );
}
