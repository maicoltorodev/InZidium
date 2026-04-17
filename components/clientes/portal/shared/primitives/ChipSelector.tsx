"use client";

import { motion } from "framer-motion";
import { MOTION } from "./motion";

export type Chip = { value: string; label: string; icon?: React.ElementType };

export function ChipSelector({
  chips,
  value,
  onChange,
  size = "md",
}: {
  chips: Chip[];
  value: string | null;
  onChange: (v: string) => void;
  size?: "sm" | "md";
}) {
  const paddingCls = size === "sm" ? "px-2.5 py-1.5 text-[10px]" : "px-3 py-2 text-[11px]";
  return (
    <div className="flex flex-wrap gap-2">
      {chips.map((chip) => {
        const active = chip.value === value;
        const Icon = chip.icon;
        return (
          <motion.button
            key={chip.value}
            type="button"
            onClick={() => onChange(chip.value)}
            whileTap={{ scale: 0.94 }}
            transition={MOTION.tap}
            className={`flex items-center gap-1.5 rounded-full border font-bold uppercase tracking-[0.16em] transition-colors ${paddingCls} ${
              active
                ? "border-[#a855f7]/40 bg-[#a855f7]/[0.1] text-[#a855f7]"
                : "border-white/[0.08] bg-white/[0.02] text-white/40 hover:border-white/15 hover:text-white/60"
            }`}
          >
            {Icon && <Icon className="h-3 w-3" />}
            {chip.label}
          </motion.button>
        );
      })}
    </div>
  );
}
