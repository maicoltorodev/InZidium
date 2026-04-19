"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock } from "lucide-react";
import { MOTION } from "./motion";
import { BRAND_ICON_STYLE } from "./BrandDefs";

// ─── Parse / serialize helpers ───────────────────────────────────────────────
// Formato consumido por Plantilla Web:
//   Un turno: "9:00 AM - 6:00 PM"
//   Turno partido: "9:00 AM - 12:00 PM - 2:00 PM - 6:00 PM"
//   Cerrado: "closed" | "cerrado" | ""

export type DaySchedule =
  | { closed: true }
  | {
      closed: false;
      split: false;
      open: string;  // "HH:mm" en 24h
      close: string;
    }
  | {
      closed: false;
      split: true;
      openAm: string;
      closeAm: string;
      openPm: string;
      closePm: string;
    };

function to12h(hhmm: string): string {
  if (!hhmm) return "";
  const [h, m] = hhmm.split(":").map(Number);
  if (isNaN(h) || isNaN(m)) return "";
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${m.toString().padStart(2, "0")} ${period}`;
}

function to24h(display: string): string {
  if (!display) return "";
  const trimmed = display.trim().toUpperCase();
  const m = trimmed.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!m) {
    const plain = trimmed.match(/^(\d{1,2}):(\d{2})$/);
    if (plain) {
      const h = Number(plain[1]);
      const min = plain[2];
      return `${h.toString().padStart(2, "0")}:${min}`;
    }
    return "";
  }
  let h = Number(m[1]);
  const min = m[2];
  const period = m[3].toUpperCase();
  if (period === "PM" && h !== 12) h += 12;
  if (period === "AM" && h === 12) h = 0;
  return `${h.toString().padStart(2, "0")}:${min}`;
}

export function parseSchedule(raw: string | undefined): DaySchedule {
  const v = (raw ?? "").trim().toLowerCase();
  if (!v || v === "closed" || v === "cerrado") return { closed: true };
  // Divide por " - " o " – "
  const parts = raw!.split(/\s*[–-]\s*/).map((p) => p.trim()).filter(Boolean);
  if (parts.length >= 4) {
    return {
      closed: false,
      split: true,
      openAm: to24h(parts[0]),
      closeAm: to24h(parts[1]),
      openPm: to24h(parts[2]),
      closePm: to24h(parts[3]),
    };
  }
  if (parts.length >= 2) {
    return {
      closed: false,
      split: false,
      open: to24h(parts[0]),
      close: to24h(parts[1]),
    };
  }
  return { closed: true };
}

export function serializeSchedule(s: DaySchedule): string {
  if (s.closed) return "closed";
  if (s.split) {
    if (!s.openAm || !s.closeAm || !s.openPm || !s.closePm) return "";
    return `${to12h(s.openAm)} - ${to12h(s.closeAm)} - ${to12h(s.openPm)} - ${to12h(s.closePm)}`;
  }
  if (!s.open || !s.close) return "";
  return `${to12h(s.open)} - ${to12h(s.close)}`;
}

// ─── Component ────────────────────────────────────────────────────────────────

const timeInputCls =
  "w-full rounded-xl border border-white/[0.08] bg-black/30 px-3 py-2.5 text-sm text-white outline-none focus:border-[#a855f7]/50 transition-colors";

export function DayScheduleInput({
  label,
  value,
  onSave,
}: {
  label: string;
  value: string;
  onSave: (v: string) => void;
}) {
  const schedule = useMemo(() => parseSchedule(value), [value]);
  const closed = schedule.closed;
  const split = !schedule.closed && (schedule as any).split;

  const setClosed = (c: boolean) => {
    if (c) return onSave("closed");
    onSave(serializeSchedule({ closed: false, split: false, open: "09:00", close: "18:00" }));
  };

  const setSplit = (s: boolean) => {
    if (closed) return;
    if (s) {
      const current = schedule as { closed: false; split: false; open: string; close: string };
      onSave(
        serializeSchedule({
          closed: false,
          split: true,
          openAm: current.open || "09:00",
          closeAm: "12:00",
          openPm: "14:00",
          closePm: current.close || "18:00",
        })
      );
    } else {
      const current = schedule as { closed: false; split: true; openAm: string; closePm: string };
      onSave(
        serializeSchedule({
          closed: false,
          split: false,
          open: current.openAm || "09:00",
          close: current.closePm || "18:00",
        })
      );
    }
  };

  const updateSingle = (key: "open" | "close", v: string) => {
    if (closed || split) return;
    const cur = schedule as { closed: false; split: false; open: string; close: string };
    onSave(serializeSchedule({ ...cur, [key]: v }));
  };

  const updateSplit = (
    key: "openAm" | "closeAm" | "openPm" | "closePm",
    v: string
  ) => {
    if (closed || !split) return;
    const cur = schedule as {
      closed: false; split: true;
      openAm: string; closeAm: string; openPm: string; closePm: string;
    };
    onSave(serializeSchedule({ ...cur, [key]: v }));
  };

  return (
    <div
      className={`rounded-2xl border px-4 py-3 transition-colors ${
        closed
          ? "border-white/[0.05] bg-white/[0.01]"
          : "border-white/[0.07] bg-white/[0.02]"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
              closed
                ? "bg-white/[0.03] text-white/20"
                : "bg-[linear-gradient(135deg,rgba(232,121,249,0.1)_0%,rgba(168,85,247,0.1)_50%,rgba(34,211,238,0.1)_100%)]"
            }`}
          >
            <Clock className="h-3.5 w-3.5" style={closed ? undefined : BRAND_ICON_STYLE} />
          </div>
          <span
            className={`text-[13px] font-bold ${closed ? "text-white/30" : "text-white"}`}
          >
            {label}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setClosed(!closed)}
          className={`shrink-0 rounded-lg px-2.5 py-1 text-[9px] font-black uppercase tracking-widest transition-colors ${
            closed
              ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
              : "bg-white/[0.04] text-white/40 hover:bg-red-500/10 hover:text-red-400"
          }`}
        >
          {closed ? "Abrir" : "Cerrar"}
        </button>
      </div>

      <AnimatePresence initial={false}>
        {!closed && (
          <motion.div
            key="open"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={MOTION.reveal}
            className="overflow-hidden"
          >
            <div className="pt-3 space-y-2.5">
              {!split ? (
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="time"
                    value={(schedule as any).open ?? ""}
                    onChange={(e) => updateSingle("open", e.target.value)}
                    className={timeInputCls}
                    aria-label="Hora de apertura"
                  />
                  <input
                    type="time"
                    value={(schedule as any).close ?? ""}
                    onChange={(e) => updateSingle("close", e.target.value)}
                    className={timeInputCls}
                    aria-label="Hora de cierre"
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <div>
                    <p className="mb-1 text-[9px] font-black uppercase tracking-[0.18em] text-white/25">Mañana</p>
                    <div className="grid grid-cols-2 gap-2">
                      <input type="time" value={(schedule as any).openAm ?? ""} onChange={(e) => updateSplit("openAm", e.target.value)} className={timeInputCls} />
                      <input type="time" value={(schedule as any).closeAm ?? ""} onChange={(e) => updateSplit("closeAm", e.target.value)} className={timeInputCls} />
                    </div>
                  </div>
                  <div>
                    <p className="mb-1 text-[9px] font-black uppercase tracking-[0.18em] text-white/25">Tarde</p>
                    <div className="grid grid-cols-2 gap-2">
                      <input type="time" value={(schedule as any).openPm ?? ""} onChange={(e) => updateSplit("openPm", e.target.value)} className={timeInputCls} />
                      <input type="time" value={(schedule as any).closePm ?? ""} onChange={(e) => updateSplit("closePm", e.target.value)} className={timeInputCls} />
                    </div>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={() => setSplit(!split)}
                className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/30 hover:text-[#a855f7] transition-colors"
              >
                {split ? "— Quitar turno partido" : "+ Turno partido"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
