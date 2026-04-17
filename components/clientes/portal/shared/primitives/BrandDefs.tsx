"use client";

/**
 * Defs SVG invisibles con los gradients de marca InZidium.
 * Se monta una vez en MobileOnboarding; cualquier <Icon> descendente
 * puede referenciar los IDs via `style={{ stroke: "url(#inzidium-brand)" }}`.
 */
export function BrandDefs() {
  return (
    <svg
      width="0"
      height="0"
      aria-hidden
      className="pointer-events-none absolute"
      style={{ position: "absolute" }}
    >
      <defs>
        {/* Diagonal: fucsia -> purpura -> azul (uso general en iconos lineales) */}
        <linearGradient id="inzidium-brand" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"   stopColor="#e879f9" />
          <stop offset="50%"  stopColor="#a855f7" />
          <stop offset="100%" stopColor="#60a5fa" />
        </linearGradient>

        {/* Variante vertical (para texto / glyphs altos) */}
        <linearGradient id="inzidium-brand-v" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#e879f9" />
          <stop offset="50%"  stopColor="#a855f7" />
          <stop offset="100%" stopColor="#60a5fa" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/** Estilo inline para aplicar el gradient al stroke de un icono lucide. */
export const BRAND_ICON_STYLE = { stroke: "url(#inzidium-brand)" } as const;
