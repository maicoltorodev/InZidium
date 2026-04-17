"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { MOTION } from "./motion";
import { BRAND_ICON_STYLE } from "./BrandDefs";

export function OptionCard({
  icon: Icon,
  title,
  description,
  selected,
  onSelect,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onSelect}
      whileTap={{ scale: 0.98 }}
      transition={MOTION.tap}
      className={`relative w-full overflow-hidden rounded-2xl border px-5 py-4 text-left transition-all ${
        selected
          ? "border-[#a855f7]/40 bg-[linear-gradient(135deg,rgba(232,121,249,0.08)_0%,rgba(168,85,247,0.08)_50%,rgba(96,165,250,0.08)_100%)]"
          : "border-white/[0.07] bg-white/[0.02] hover:border-white/15"
      }`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition-colors ${
            selected
              ? "bg-[linear-gradient(135deg,rgba(232,121,249,0.14)_0%,rgba(168,85,247,0.14)_50%,rgba(96,165,250,0.14)_100%)]"
              : "bg-white/[0.04] text-white/40"
          }`}
        >
          <Icon className="h-5 w-5" style={selected ? BRAND_ICON_STYLE : undefined} />
        </div>
        <div className="flex-1 min-w-0 pt-0.5">
          <h3
            className={`text-sm font-black leading-tight ${
              selected
                ? "bg-[linear-gradient(90deg,#e879f9_0%,#a855f7_50%,#60a5fa_100%)] bg-clip-text text-transparent"
                : "text-white"
            }`}
          >
            {title}
          </h3>
          <p className="mt-1 text-[11px] leading-snug text-white/35">{description}</p>
        </div>
        {selected && (
          <motion.span
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={MOTION.reveal}
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#e879f9_0%,#a855f7_50%,#60a5fa_100%)] text-black shadow-[0_0_16px_-4px_rgba(168,85,247,0.8)]"
          >
            <Check className="h-3.5 w-3.5" strokeWidth={3} />
          </motion.span>
        )}
      </div>
    </motion.button>
  );
}
