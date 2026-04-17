"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { MOTION } from "./motion";

export type Palette = {
  id: string;
  name: string;
  fondo: string;
  primario: string;
  acento: string;
};

export const PALETTES: Palette[] = [
  { id: "elegante",    name: "Elegante",    fondo: "#0a0a0a", primario: "#E8AA14", acento: "#f5f5f5" },
  { id: "vibrante",    name: "Vibrante",    fondo: "#111827", primario: "#f43f5e", acento: "#22d3ee" },
  { id: "minimalista", name: "Minimalista", fondo: "#ffffff", primario: "#111111", acento: "#9ca3af" },
  { id: "corporativo", name: "Corporativo", fondo: "#0f172a", primario: "#3b82f6", acento: "#e2e8f0" },
  { id: "natural",     name: "Natural",     fondo: "#fafaf5", primario: "#15803d", acento: "#78716c" },
  { id: "calido",      name: "Cálido",      fondo: "#1c1412", primario: "#f97316", acento: "#fde68a" },
];

export function PalettePresetGrid({
  activeId,
  onApply,
}: {
  activeId: string | null;
  onApply: (p: Palette) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2.5">
      {PALETTES.map((p) => {
        const active = p.id === activeId;
        return (
          <motion.button
            key={p.id}
            type="button"
            onClick={() => onApply(p)}
            whileTap={{ scale: 0.96 }}
            transition={MOTION.tap}
            className={`relative flex flex-col gap-2 rounded-2xl border p-3 text-left transition-colors ${
              active
                ? "border-[#a855f7]/40 bg-[#a855f7]/[0.06]"
                : "border-white/[0.07] bg-white/[0.02] hover:border-white/15"
            }`}
          >
            <div className="flex gap-1.5">
              <span className="h-7 flex-1 rounded-lg border border-white/10" style={{ background: p.fondo }} />
              <span className="h-7 flex-1 rounded-lg border border-white/10" style={{ background: p.primario }} />
              <span className="h-7 flex-1 rounded-lg border border-white/10" style={{ background: p.acento }} />
            </div>
            <div className="flex items-center justify-between">
              <span className={`text-[11px] font-bold ${active ? "text-[#a855f7]" : "text-white/70"}`}>
                {p.name}
              </span>
              {active && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={MOTION.reveal}
                  className="flex h-4 w-4 items-center justify-center rounded-full bg-[linear-gradient(135deg,#e879f9_0%,#a855f7_50%,#60a5fa_100%)] text-white"
                >
                  <Check className="h-2.5 w-2.5" strokeWidth={3.5} />
                </motion.span>
              )}
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}

export function matchPaletteId(
  fondo?: string, primario?: string, acento?: string
): string | null {
  const lower = (v?: string) => (v ?? "").toLowerCase();
  for (const p of PALETTES) {
    if (
      lower(p.fondo) === lower(fondo) &&
      lower(p.primario) === lower(primario) &&
      lower(p.acento) === lower(acento)
    ) return p.id;
  }
  return null;
}
