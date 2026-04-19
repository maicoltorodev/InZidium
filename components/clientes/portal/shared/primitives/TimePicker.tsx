"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock } from "lucide-react";

/**
 * TimePicker custom con popover — reemplaza `<input type="time">` nativo que
 * se ve feo y varía por browser/OS. Tres columnas en el popover: hora (1-12),
 * minuto (00/15/30/45) y AM/PM. Todo on-brand, mismo lenguaje visual del
 * resto del portal (glass card, gradient brand en seleccionados).
 *
 * Acepta/emite el valor en formato 24h "HH:mm" para mantener compatibilidad
 * con el resto del flujo (parse/serialize en DayScheduleInput).
 */

const HOURS_12 = Array.from({ length: 12 }, (_, i) => i + 1); // 1..12
const MINUTES = [0, 15, 30, 45];

function to12h(hhmm: string): {
    hour: number;
    minute: number;
    period: "AM" | "PM";
} {
    if (!hhmm) return { hour: 9, minute: 0, period: "AM" };
    const [h, m] = hhmm.split(":").map(Number);
    if (isNaN(h) || isNaN(m)) return { hour: 9, minute: 0, period: "AM" };
    const period: "AM" | "PM" = h >= 12 ? "PM" : "AM";
    const hour = h % 12 === 0 ? 12 : h % 12;
    return { hour, minute: m, period };
}

function to24h(hour: number, minute: number, period: "AM" | "PM"): string {
    let h = hour;
    if (period === "PM" && h !== 12) h += 12;
    if (period === "AM" && h === 12) h = 0;
    return `${h.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
}

function format12(hhmm: string): string {
    if (!hhmm) return "—";
    const { hour, minute, period } = to12h(hhmm);
    return `${hour}:${minute.toString().padStart(2, "0")} ${period}`;
}

export function TimePicker({
    value,
    onChange,
    placeholder = "—",
    "aria-label": ariaLabel,
}: {
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    "aria-label"?: string;
}) {
    const [open, setOpen] = useState(false);
    const rootRef = useRef<HTMLDivElement>(null);
    const { hour, minute, period } = to12h(value);

    // Click afuera cierra
    useEffect(() => {
        if (!open) return;
        const onDown = (e: MouseEvent) => {
            if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
        };
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };
        document.addEventListener("mousedown", onDown);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("mousedown", onDown);
            document.removeEventListener("keydown", onKey);
        };
    }, [open]);

    const update = (
        next: Partial<{ hour: number; minute: number; period: "AM" | "PM" }>,
    ) => {
        const merged = { hour, minute, period, ...next };
        onChange(to24h(merged.hour, merged.minute, merged.period));
    };

    return (
        <div ref={rootRef} className="relative">
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-label={ariaLabel}
                className={`flex w-full items-center gap-2 rounded-xl border bg-black/30 px-3 py-2.5 text-left text-sm transition-colors ${
                    open
                        ? "border-[#a855f7]/50 text-white"
                        : "border-white/[0.08] text-white hover:border-white/[0.15]"
                }`}
            >
                <Clock className="h-3.5 w-3.5 shrink-0 text-white/40" />
                <span className={value ? "text-white" : "text-white/30"}>
                    {value ? format12(value) : placeholder}
                </span>
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -4, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -4, scale: 0.98 }}
                        transition={{ duration: 0.14, ease: "easeOut" }}
                        className="absolute left-0 right-0 top-full z-50 mt-1.5 origin-top rounded-2xl border border-white/[0.1] bg-[#0d0820] p-3 shadow-[0_12px_40px_-10px_rgba(0,0,0,0.8)]"
                        role="dialog"
                    >
                        <div className="grid grid-cols-[1fr_1fr] gap-2">
                            <TimeColumn
                                label="Hora"
                                values={HOURS_12}
                                selected={hour}
                                onPick={(v) => update({ hour: v })}
                                formatValue={(v) => v.toString()}
                            />
                            <TimeColumn
                                label="Min"
                                values={MINUTES}
                                selected={minute}
                                onPick={(v) => update({ minute: v })}
                                formatValue={(v) => v.toString().padStart(2, "0")}
                            />
                        </div>
                        <div className="mt-2 flex gap-1.5 rounded-xl border border-white/[0.06] bg-black/20 p-1">
                            {(["AM", "PM"] as const).map((p) => {
                                const active = period === p;
                                return (
                                    <button
                                        key={p}
                                        type="button"
                                        onClick={() => update({ period: p })}
                                        className={`flex-1 rounded-lg py-1.5 text-[11px] font-black uppercase tracking-[0.22em] transition-colors ${
                                            active
                                                ? "bg-[linear-gradient(135deg,#e879f9_0%,#a855f7_50%,#22d3ee_100%)] text-white shadow-[0_2px_10px_-2px_rgba(168,85,247,0.6)]"
                                                : "text-white/40 hover:text-white/70"
                                        }`}
                                    >
                                        {p}
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function TimeColumn({
    label,
    values,
    selected,
    onPick,
    formatValue,
}: {
    label: string;
    values: number[];
    selected: number;
    onPick: (v: number) => void;
    formatValue: (v: number) => string;
}) {
    const listRef = useRef<HTMLDivElement>(null);

    // Centrar el valor seleccionado al abrir
    useEffect(() => {
        const el = listRef.current?.querySelector<HTMLButtonElement>(
            `[data-val="${selected}"]`,
        );
        el?.scrollIntoView({ block: "center" });
    }, [selected]);

    return (
        <div className="overflow-hidden rounded-xl border border-white/[0.06] bg-black/20">
            <p className="border-b border-white/[0.04] bg-white/[0.01] px-2 py-1 text-center text-[9px] font-black uppercase tracking-[0.24em] text-white/30">
                {label}
            </p>
            <div
                ref={listRef}
                className="max-h-40 overflow-y-auto py-1 scrollbar-thin"
            >
                {values.map((v) => {
                    const active = v === selected;
                    return (
                        <button
                            key={v}
                            data-val={v}
                            type="button"
                            onClick={() => onPick(v)}
                            className={`block w-full px-2 py-1.5 text-center text-sm font-bold transition-colors ${
                                active
                                    ? "bg-[#a855f7]/15 text-white"
                                    : "text-white/60 hover:bg-white/[0.04] hover:text-white"
                            }`}
                        >
                            {formatValue(v)}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
