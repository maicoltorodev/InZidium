"use client";

import { useEffect, useState } from "react";

// ─── Motion tokens ────────────────────────────────────────────────────────────
// Duraciones y easings compartidos por todo el onboarding mobile.
// "Profesional, dinamico, vivo, pero fluido en cualquier dispositivo."

export const EASE_OUT_EXPO = [0.22, 1, 0.36, 1] as const;
export const EASE_OUT = [0.33, 1, 0.68, 1] as const;

export const MOTION = {
  micro:      { duration: 0.15, ease: EASE_OUT },
  tap:        { duration: 0.12, ease: EASE_OUT },
  reveal:     { duration: 0.25, ease: EASE_OUT_EXPO },
  page:       { duration: 0.3,  ease: EASE_OUT_EXPO },
  celebrate:  { duration: 0.8,  ease: EASE_OUT },
} as const;

export const STAGGER = {
  fields: 0.02,
  cards:  0.04,
};

// ─── Reduced-motion hook ──────────────────────────────────────────────────────

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, []);
  return reduced;
}

// ─── Haptic helper ────────────────────────────────────────────────────────────

export function haptic(ms = 8) {
  if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
    try { navigator.vibrate(ms); } catch {}
  }
}
