// Tokens de marca InZidium.
// Fondo oscuro con tinte violeta + gradient fucsia -> purpura -> cyan.
// Estos colores son globales del onboarding — independientes del estudio (Alkubo, Nexus, etc.).

export const BRAND = {
  // Fondos
  bg:         "#060214", // fondo principal — casi negro con toque violeta
  bgCard:     "#0d0820", // cards del hub / hero
  bgSurface:  "#13102a", // superficies secundarias
  bgElevated: "#180f33", // subsecciones elevadas

  // Acentos sólidos (stops del gradient por separado)
  magenta:    "#e879f9", // fuchsia-400 — top
  primary:    "#a855f7", // purple-500 — medio, color sólido principal
  cyan:       "#22d3ee", // cyan-400 — bottom
} as const;

// Gradient diagonal completo: fucsia -> purpura -> cyan
export const GRADIENT_BG = "bg-gradient-to-br from-[#e879f9] via-[#a855f7] to-[#22d3ee]";

// Gradient en texto
export const GRADIENT_TEXT =
  "bg-gradient-to-br from-[#e879f9] via-[#a855f7] to-[#22d3ee] bg-clip-text text-transparent";

// Gradient animado (para hero login-style)
export const GRADIENT_TEXT_ANIMATED =
  "bg-[linear-gradient(90deg,#e879f9_0%,#a855f7_50%,#22d3ee_100%)] bg-clip-text text-transparent";

// SVG stops reutilizables
export const SVG_GRADIENT_STOPS = [
  { offset: "0%",   color: "#e879f9" },
  { offset: "50%",  color: "#a855f7" },
  { offset: "100%", color: "#22d3ee" },
];
