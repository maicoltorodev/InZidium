"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Hammer } from "lucide-react";
import { BUILD_DURATION_HOURS, getProgressLabel } from "@/lib/constants";
import { MOTION } from "./motion";
import { BRAND_ICON_STYLE } from "./BrandDefs";

function formatRemaining(ms: number): { hh: string; mm: string; ss: string; done: boolean } {
  if (ms <= 0) return { hh: "00", mm: "00", ss: "00", done: true };
  const totalSeconds = Math.floor(ms / 1000);
  const hh = Math.floor(totalSeconds / 3600).toString().padStart(2, "0");
  const mm = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, "0");
  const ss = Math.floor(totalSeconds % 60).toString().padStart(2, "0");
  return { hh, mm, ss, done: false };
}

export function CountdownCard({
  buildStartedAt,
  progreso,
}: {
  buildStartedAt: Date | string | null;
  progreso: number;
}) {
  const startMs = buildStartedAt
    ? (typeof buildStartedAt === "string"
        ? new Date(buildStartedAt).getTime()
        : buildStartedAt.getTime())
    : null;
  const endMs = startMs != null ? startMs + BUILD_DURATION_HOURS * 3600 * 1000 : null;

  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const remaining = endMs != null ? endMs - now : 0;
  const { hh, mm, ss, done } = formatRemaining(remaining);

  const pct = Math.max(0, Math.min(100, progreso));
  const label = getProgressLabel(pct);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...MOTION.reveal, delay: 0.08 }}
      className="relative mb-6 overflow-hidden rounded-[2rem] border border-[#a855f7]/25 bg-[linear-gradient(135deg,rgba(232,121,249,0.06)_0%,rgba(168,85,247,0.05)_50%,rgba(96,165,250,0.06)_100%)] p-5 shadow-[0_0_40px_-14px_rgba(168,85,247,0.5)]"
    >
      {/* Ambient overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-20 h-56 w-56 rounded-full bg-[#a855f7] opacity-[0.12] blur-[90px]"
      />

      <div className="relative">
        {/* Header */}
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(232,121,249,0.14)_0%,rgba(168,85,247,0.14)_50%,rgba(96,165,250,0.14)_100%)] ring-1 ring-[#a855f7]/25">
            <Hammer className="h-4 w-4" style={BRAND_ICON_STYLE} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-white/45">
              Construyendo tu sitio
            </p>
            <p className="text-[11px] text-white/40">
              {done ? "Dando los toques finales" : "Tiempo restante"}
            </p>
          </div>
        </div>

        {/* Timer */}
        {done ? (
          <div className="mb-4 py-2 text-center">
            <p className="bg-[linear-gradient(90deg,#e879f9_0%,#a855f7_50%,#60a5fa_100%)] bg-clip-text text-[22px] font-black leading-none tracking-tight text-transparent">
              Dando los toques finales
            </p>
            <p className="mt-2 text-[11px] text-white/40">
              Tu sitio estará listo muy pronto.
            </p>
          </div>
        ) : (
          <div className="mb-4 flex items-baseline justify-center gap-1 font-mono tracking-tight">
            <TimeUnit value={hh} unit="h" />
            <Colon />
            <TimeUnit value={mm} unit="m" />
            <Colon />
            <TimeUnit value={ss} unit="s" />
          </div>
        )}

        {/* Progress bar */}
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/35">
              {label}
            </p>
            <p className="text-[13px] font-black tabular-nums">
              <span className="bg-[linear-gradient(90deg,#e879f9_0%,#a855f7_50%,#60a5fa_100%)] bg-clip-text text-transparent">
                {pct}%
              </span>
            </p>
          </div>
          <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
            <motion.div
              initial={false}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-y-0 left-0 rounded-full bg-[linear-gradient(90deg,#e879f9_0%,#a855f7_50%,#60a5fa_100%)]"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function TimeUnit({ value, unit }: { value: string; unit: string }) {
  return (
    <span className="inline-flex items-baseline gap-0.5">
      <span className="bg-[linear-gradient(135deg,#e879f9_0%,#a855f7_50%,#60a5fa_100%)] bg-clip-text text-[44px] font-black leading-none text-transparent tabular-nums">
        {value}
      </span>
      <span className="text-[11px] font-bold text-white/35">{unit}</span>
    </span>
  );
}

function Colon() {
  return (
    <span className="mx-1 text-[32px] font-black leading-none text-white/25 animate-pulse">
      :
    </span>
  );
}
