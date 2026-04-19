"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Hammer, MessageSquare } from "lucide-react";
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

function toMs(value: Date | string | null | undefined): number | null {
  if (value == null) return null;
  if (value instanceof Date) return value.getTime();
  const parsed = new Date(value).getTime();
  return Number.isFinite(parsed) ? parsed : null;
}

/**
 * Card del cliente durante la fase de construcción: countdown hasta fechaEntrega
 * + barra de progreso derivada del tiempo transcurrido. El porcentaje no es
 * manual — refleja qué tan avanzado está el plazo. fechaEntrega es la única
 * fuente de verdad del deadline (viene del servidor).
 */
export function CountdownCard({
  buildStartedAt,
  fechaEntrega,
  chat,
}: {
  buildStartedAt: Date | string | null;
  fechaEntrega: Date | string | null;
  chat?: any[];
}) {
  const startMs = toMs(buildStartedAt);
  const endMs = toMs(fechaEntrega);
  const totalMs = startMs != null && endMs != null ? Math.max(1, endMs - startMs) : 0;

  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const remaining = endMs != null ? endMs - now : 0;
  const { hh, mm, ss, done } = formatRemaining(remaining);

  const elapsed = startMs != null ? Math.max(0, now - startMs) : 0;
  const pct = totalMs > 0
    ? Math.max(0, Math.min(100, Math.round((elapsed / totalMs) * 100)))
    : 0;

  // Señal de actividad: timestamp del último mensaje del admin, para que el
  // cliente sienta que el estudio está trabajando. Se recalcula con `chat`.
  const adminActivity = useMemo(() => {
    const msgs = chat ?? [];
    const lastAdmin = [...msgs]
      .reverse()
      .find((m: any) => m?.autor && m.autor !== "cliente" && m.createdAt);
    if (!lastAdmin) return null;
    const ts = toMs(lastAdmin.createdAt);
    if (ts == null) return null;
    return relativeTimeEs(now - ts);
  }, [chat, now]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...MOTION.reveal, delay: 0.08 }}
      className="relative mb-6 overflow-hidden rounded-[2rem] border border-[#a855f7]/25 bg-[linear-gradient(135deg,rgba(232,121,249,0.06)_0%,rgba(168,85,247,0.05)_50%,rgba(34,211,238,0.06)_100%)] p-5 shadow-[0_0_40px_-14px_rgba(168,85,247,0.5)]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-20 h-56 w-56 rounded-full bg-[#a855f7] opacity-[0.12] blur-[90px]"
      />

      <div className="relative">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(232,121,249,0.14)_0%,rgba(168,85,247,0.14)_50%,rgba(34,211,238,0.14)_100%)] ring-1 ring-[#a855f7]/25">
            <Hammer className="h-4 w-4" style={BRAND_ICON_STYLE} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-white/45">
              Construyendo tu sitio
            </p>
            <p className="text-[11px] text-white/40">
              {done ? "Plazo vencido — publicación inminente" : "Tiempo restante"}
            </p>
          </div>
        </div>

        {/* Timer */}
        <div className="mb-4 flex items-baseline justify-center gap-1 font-mono tracking-tight">
          <TimeUnit value={hh} unit="h" done={done} />
          <Colon done={done} />
          <TimeUnit value={mm} unit="m" done={done} />
          <Colon done={done} />
          <TimeUnit value={ss} unit="s" done={done} />
        </div>

        {/* Progress bar — derivada del tiempo transcurrido */}
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/35">
              Progreso estimado
            </p>
            <p className="text-[13px] font-black tabular-nums">
              <span className="bg-[linear-gradient(90deg,#e879f9_0%,#a855f7_50%,#22d3ee_100%)] bg-clip-text text-transparent">
                {pct}%
              </span>
            </p>
          </div>
          <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
            <motion.div
              initial={false}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-y-0 left-0 rounded-full bg-[linear-gradient(90deg,#e879f9_0%,#a855f7_50%,#22d3ee_100%)]"
            />
          </div>
        </div>

        {adminActivity && (
          <div className="mt-4 flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-1.5 text-[10px] text-white/55">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            <MessageSquare className="h-3 w-3 text-white/40" />
            <span className="font-medium">Última actividad del estudio:</span>
            <span className="font-black text-white/75">{adminActivity}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function TimeUnit({ value, unit, done }: { value: string; unit: string; done: boolean }) {
  return (
    <span className="inline-flex items-baseline gap-0.5">
      <span
        className={`bg-clip-text text-[44px] font-black leading-none text-transparent tabular-nums ${
          done
            ? "bg-[linear-gradient(135deg,#ef4444_0%,#f87171_100%)] animate-pulse"
            : "bg-[linear-gradient(135deg,#e879f9_0%,#a855f7_50%,#22d3ee_100%)]"
        }`}
      >
        {value}
      </span>
      <span className={`text-[11px] font-bold ${done ? "text-red-400/60" : "text-white/35"}`}>{unit}</span>
    </span>
  );
}

function Colon({ done }: { done: boolean }) {
  return (
    <span
      className={`mx-1 text-[32px] font-black leading-none animate-pulse ${
        done ? "text-red-400/70" : "text-white/25"
      }`}
    >
      :
    </span>
  );
}

function relativeTimeEs(deltaMs: number): string {
  if (deltaMs < 60_000) return "hace un momento";
  const mins = Math.floor(deltaMs / 60_000);
  if (mins < 60) return `hace ${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `hace ${hrs}h`;
  const days = Math.floor(hrs / 24);
  return `hace ${days}d`;
}
