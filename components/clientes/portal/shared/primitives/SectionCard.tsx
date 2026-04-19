"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { Check, ChevronRight } from "lucide-react";
import type { Completion } from "../../types";
import { MOTION } from "./motion";
import { BRAND_ICON_STYLE } from "./BrandDefs";

type Status =
  | { kind: "progress"; completion: Completion; subtitle: string }
  | { kind: "messages"; unread: boolean; preview?: string };

export const SectionCard = memo(function SectionCard({
  icon: Icon,
  title,
  description,
  status,
  onPress,
  celebrate = false,
  delay = 0,
  disabled = false,
  published = false,
  isNext = false,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  status: Status;
  onPress: () => void;
  celebrate?: boolean;
  delay?: number;
  disabled?: boolean;
  published?: boolean;
  /** Marca la sección como "próximo paso" durante onboarding. */
  isNext?: boolean;
}) {
  const completion = status.kind === "progress" ? status.completion : "empty";
  const publishedComplete = published && completion === "complete";
  const useBrandGradient = publishedComplete || completion === "partial" || (status.kind === "messages" && status.unread);
  const badgeStyle = publishedComplete
    ? "bg-[linear-gradient(135deg,rgba(232,121,249,0.15)_0%,rgba(168,85,247,0.15)_50%,rgba(96,165,250,0.15)_100%)] ring-1 ring-[#a855f7]/40 shadow-[0_0_24px_-8px_rgba(168,85,247,0.6)]"
    : completion === "complete"
      ? "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20"
      : completion === "partial"
      ? "bg-[linear-gradient(135deg,rgba(232,121,249,0.12)_0%,rgba(168,85,247,0.12)_50%,rgba(96,165,250,0.12)_100%)] ring-1 ring-[#a855f7]/25 shadow-[0_0_24px_-8px_rgba(168,85,247,0.55)]"
      : "bg-white/[0.04] text-white/30 ring-1 ring-white/[0.05]";

  return (
    <motion.button
      type="button"
      onClick={disabled ? undefined : onPress}
      whileTap={disabled ? undefined : { scale: 0.98 }}
      transition={MOTION.tap}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: disabled ? 0.4 : 1, y: 0 }}
      exit={{ opacity: 0 }}
      style={{ transitionDelay: `${delay}ms` }}
      disabled={disabled}
      aria-disabled={disabled}
      className={`relative w-full overflow-hidden rounded-[1.75rem] border bg-[#0d0820] px-5 py-4 text-left transition-colors ${
        publishedComplete
          ? "border-[#a855f7]/30 shadow-[0_0_32px_-12px_rgba(168,85,247,0.45)]"
          : isNext
            ? "border-[#a855f7]/40 shadow-[0_0_32px_-14px_rgba(168,85,247,0.55)]"
            : "border-white/[0.06]"
      } ${disabled ? "cursor-not-allowed" : "active:bg-white/[0.02]"}`}
    >
      {isNext && !disabled && (
        <>
          <span className="absolute right-3 top-3 z-10 flex items-center gap-1 rounded-full border border-[#a855f7]/40 bg-[#a855f7]/15 px-2 py-0.5 text-[8px] font-black uppercase tracking-[0.22em] text-white backdrop-blur">
            <span className="h-1 w-1 rounded-full bg-[#a855f7]" />
            Siguiente
          </span>
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[1.75rem] ring-1 ring-[#a855f7]/50"
            initial={{ opacity: 0.4 }}
            animate={{ opacity: [0.4, 0.1, 0.4] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          />
        </>
      )}
      {/* Shimmer celebration overlay */}
      {celebrate && (
        <motion.span
          aria-hidden
          initial={{ x: "-120%" }}
          animate={{ x: "120%" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="pointer-events-none absolute inset-y-0 w-1/2 bg-[linear-gradient(90deg,transparent_0%,rgba(232,121,249,0.18)_25%,rgba(168,85,247,0.25)_50%,rgba(96,165,250,0.18)_75%,transparent_100%)]"
        />
      )}
      <div className="relative flex items-center gap-4">
        <motion.div
          layout
          className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition-colors ${badgeStyle}`}
        >
          <Icon className="h-5 w-5" style={useBrandGradient ? BRAND_ICON_STYLE : undefined} />
          {completion === "complete" && (
            <motion.span
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={MOTION.reveal}
              className={`absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full ring-2 ring-[#0d0820] ${
                publishedComplete
                  ? "bg-[linear-gradient(135deg,#e879f9_0%,#a855f7_50%,#60a5fa_100%)] text-white"
                  : "bg-emerald-500 text-black"
              }`}
            >
              <Check className="h-2.5 w-2.5" strokeWidth={3.5} />
            </motion.span>
          )}
          {status.kind === "messages" && status.unread && (
            <motion.span
              aria-hidden
              initial={{ scale: 0 }}
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-blue-400 ring-2 ring-[#0d0820]"
            />
          )}
        </motion.div>

        <div className="flex-1 min-w-0">
          <h3 className="text-[15px] font-black leading-tight text-white">{title}</h3>
          <p className="mt-0.5 text-[11px] leading-snug text-white/35 truncate">{description}</p>
          {status.kind === "progress" && (
            <p
              className={`mt-1.5 text-[10px] font-bold uppercase tracking-[0.18em] ${
                publishedComplete
                  ? "bg-[linear-gradient(90deg,#e879f9_0%,#a855f7_50%,#60a5fa_100%)] bg-clip-text text-transparent"
                  : completion === "complete"
                  ? "text-emerald-400/80"
                  : completion === "partial"
                  ? "bg-[linear-gradient(90deg,#e879f9_0%,#a855f7_50%,#60a5fa_100%)] bg-clip-text text-transparent"
                  : "text-white/25"
              }`}
            >
              {status.subtitle}
            </p>
          )}
          {status.kind === "messages" && status.preview && (
            <p className="mt-1.5 text-[11px] text-white/40 truncate italic">
              “{status.preview}”
            </p>
          )}
        </div>

        {!disabled && <ChevronRight className="h-4 w-4 shrink-0 text-white/20" />}
      </div>
    </motion.button>
  );
});
