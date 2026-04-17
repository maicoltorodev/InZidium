"use client";

import { motion } from "framer-motion";
import { MOTION } from "./motion";
import { BRAND_ICON_STYLE } from "./BrandDefs";

export function ToggleRow({
  title,
  description,
  checked,
  onChange,
  icon: Icon,
}: {
  title: string;
  description?: string;
  checked: boolean;
  onChange: (next: boolean) => void;
  icon?: React.ElementType;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex w-full items-center gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.02] px-4 py-3.5 text-left transition-colors active:bg-white/[0.04]"
      role="switch"
      aria-checked={checked}
    >
      {Icon && (
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors ${
            checked
              ? "bg-[linear-gradient(135deg,rgba(232,121,249,0.12)_0%,rgba(168,85,247,0.12)_50%,rgba(96,165,250,0.12)_100%)]"
              : "bg-white/[0.04] text-white/40"
          }`}
        >
          <Icon className="h-4 w-4" style={checked ? BRAND_ICON_STYLE : undefined} />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-bold text-white leading-tight">{title}</p>
        {description && (
          <p className="mt-0.5 text-[11px] leading-snug text-white/35">{description}</p>
        )}
      </div>
      <span
        className={`relative flex h-6 w-11 shrink-0 rounded-full transition-colors ${
          checked
            ? "bg-[linear-gradient(135deg,#e879f9_0%,#a855f7_50%,#60a5fa_100%)] shadow-[0_0_12px_-2px_rgba(168,85,247,0.6)]"
            : "bg-white/[0.1]"
        }`}
      >
        <motion.span
          layout
          transition={MOTION.micro}
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-md ${
            checked ? "right-0.5" : "left-0.5"
          }`}
        />
      </span>
    </button>
  );
}
