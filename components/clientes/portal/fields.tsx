"use client";

import { useState, useEffect, useRef } from "react";
import {
  Check,
  Loader2,
  Plus,
  Upload,
  X,
} from "lucide-react";
import { inputCls, labelCls } from "./styles";
import type { HoraItem } from "./types";

// ─── AutoField ───────────────────────────────────────────────────────────────

// Patrón focus-aware: mientras el input está focused, el usuario es dueño
// absoluto del valor local. El sync desde `value` (que puede cambiar por un
// evento realtime o por un optimistic update) solo se aplica cuando el input
// NO está focused. Así ningún refresh externo puede pisar el tipeo en curso.
// Save on blur preserva la semántica existente.
export function AutoField({
  value = "",
  onSave,
  format,
  className,
  ...rest
}: {
  value?: string;
  onSave: (v: string) => void;
  /** Sanitiza el input mientras el user escribe (ej: `formatPhoneDisplayCO`). */
  format?: (raw: string) => string;
  className?: string;
  [k: string]: any;
}) {
  const [local, setLocal] = useState(value);
  const focusedRef = useRef(false);
  useEffect(() => {
    if (!focusedRef.current) setLocal(value);
  }, [value]);
  return (
    <input
      value={local}
      onChange={(e) =>
        setLocal(format ? format(e.target.value) : e.target.value)
      }
      onFocus={() => { focusedRef.current = true; }}
      onBlur={() => {
        focusedRef.current = false;
        if (local !== value) onSave(local);
      }}
      className={className ?? inputCls}
      {...rest}
    />
  );
}

// ─── AutoTextarea ────────────────────────────────────────────────────────────

export function AutoTextarea({
  value = "",
  onSave,
  className,
  ...rest
}: {
  value?: string;
  onSave: (v: string) => void;
  className?: string;
  [k: string]: any;
}) {
  const [local, setLocal] = useState(value);
  const focusedRef = useRef(false);
  useEffect(() => {
    if (!focusedRef.current) setLocal(value);
  }, [value]);
  return (
    <textarea
      value={local}
      onChange={(e) => setLocal(e.target.value)}
      onFocus={() => { focusedRef.current = true; }}
      onBlur={() => {
        focusedRef.current = false;
        if (local !== value) onSave(local);
      }}
      className={className ?? `${inputCls} resize-none`}
      {...rest}
    />
  );
}

// ─── DomainField ─────────────────────────────────────────────────────────────

export function DomainField({
  value = "",
  onSave,
}: {
  value?: string;
  onSave: (v: string) => void;
}) {
  const [local, setLocal] = useState(value);
  const [checking, setChecking] = useState(false);
  const [availability, setAvailability] = useState<{ available: boolean; error?: string } | null>(null);
  const focusedRef = useRef(false);
  // Auto-width del input: medimos el texto (o el placeholder si está vacío)
  // en un span oculto y aplicamos el ancho al input. Así `www.` queda pegado
  // a la izquierda del texto escrito y `.com` a la derecha, centrados juntos
  // en la card sin huecos.
  const measureRef = useRef<HTMLSpanElement>(null);
  const [inputWidth, setInputWidth] = useState(88);

  useEffect(() => {
    if (!focusedRef.current) setLocal(value);
  }, [value]);

  useEffect(() => {
    if (measureRef.current) {
      // +2 de margen para que el caret no se corte al escribir al final.
      setInputWidth(Math.max(measureRef.current.offsetWidth + 2, 24));
    }
  }, [local]);

  useEffect(() => {
    if (!local || local.length < 3) {
      setAvailability(null);
      return;
    }
    const t = setTimeout(async () => {
      setChecking(true);
      setAvailability(null);
      try {
        const { checkDomainAvailability } = await import("@/lib/domain-check");
        const result = await checkDomainAvailability(local);
        setAvailability(result);
      } catch (e) {
        console.error(e);
      } finally {
        setChecking(false);
      }
    }, 800);
    return () => clearTimeout(t);
  }, [local]);

  const borderCls =
    availability?.available === false
      ? "border-red-500/50"
      : availability?.available === true
        ? "border-emerald-500/50"
        : "border-white/[0.08]";

  const displayText = local || "tuempresa";

  return (
    <div>
      <div
        className={`relative flex items-center justify-center gap-0 overflow-hidden rounded-2xl border bg-white/[0.03] py-3.5 pl-4 pr-10 transition-colors duration-200 focus-within:border-[#E8AA14]/50 ${borderCls}`}
      >
        {/* Span oculto para medir ancho de texto. Debe compartir font-size
            y font-weight del input (text-sm, normal). */}
        <span
          ref={measureRef}
          aria-hidden
          className="pointer-events-none invisible absolute left-0 top-0 whitespace-pre text-sm font-normal"
        >
          {displayText}
        </span>

        <span className="shrink-0 text-sm font-bold text-white/30">www.</span>
        <input
          value={local}
          onChange={(e) =>
            setLocal(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))
          }
          onFocus={() => { focusedRef.current = true; }}
          onBlur={() => {
            focusedRef.current = false;
            if (local !== value) onSave(local);
          }}
          placeholder="tuempresa"
          style={{ width: `${inputWidth}px` }}
          className="bg-transparent text-sm text-white outline-none placeholder:text-white/20"
        />
        <span className="shrink-0 text-sm font-bold text-white/30">.com</span>

        {/* Status icon absolute para no romper el centrado del grupo. */}
        <span className="pointer-events-none absolute right-4 flex items-center">
          {checking && <Loader2 className="h-4 w-4 animate-spin text-[#E8AA14]" />}
          {!checking && availability?.available === true && (
            <Check className="h-4 w-4 text-emerald-500" />
          )}
          {!checking && availability?.available === false && (
            <X className="h-4 w-4 text-red-500" />
          )}
        </span>
      </div>
      <div className="mt-1.5 h-4 text-center">
        {checking ? (
          <p className="text-[11px] text-white/30">Verificando disponibilidad…</p>
        ) : availability ? (
          availability.available ? (
            <p className="text-[11px] font-bold text-emerald-400">¡Dominio disponible!</p>
          ) : (
            <p className="text-[11px] font-bold text-red-400">
              {availability.error || "No disponible."}
            </p>
          )
        ) : null}
      </div>
    </div>
  );
}

// ─── ColorInput ──────────────────────────────────────────────────────────────

const HEX_RE = /^#[0-9a-fA-F]{3,8}$/;

export function ColorInput({
  value = "",
  onSave,
  label,
  hint,
}: {
  value?: string;
  onSave: (v: string) => void;
  label: string;
  hint?: string;
}) {
  const [local, setLocal] = useState(value);
  const focusedRef = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!focusedRef.current) setLocal(value);
  }, [value]);

  const isValid = !local || HEX_RE.test(local);

  const schedule = (v: string) => {
    setLocal(v);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => { if (!v || HEX_RE.test(v)) onSave(v); }, 700);
  };

  const safeColor = local && HEX_RE.test(local) ? local : "#000000";

  return (
    <div className="space-y-1.5">
      <label className={labelCls}>{label}</label>
      {hint && <p className="text-[11px] text-white/25 -mt-1 mb-1">{hint}</p>}
      <div className={`flex items-center gap-0 overflow-hidden rounded-2xl border bg-white/[0.03] transition-colors duration-200 focus-within:border-[#E8AA14]/50 ${!isValid ? "border-red-500/50" : "border-white/[0.08]"}`}>
        <label className="relative flex h-12 w-14 shrink-0 cursor-pointer items-center justify-center border-r border-white/[0.06] bg-white/[0.02] transition-colors hover:bg-white/[0.04]" title="Abrir selector de color">
          <div className="h-6 w-6 rounded-full border border-white/20 shadow-inner" style={{ background: safeColor }} />
          <input
            type="color"
            value={safeColor}
            onChange={(e) => schedule(e.target.value)}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
        </label>
        <input
          type="text"
          value={local}
          onChange={(e) => schedule(e.target.value)}
          onFocus={() => { focusedRef.current = true; }}
          onBlur={() => { focusedRef.current = false; }}
          placeholder="#RRGGBB"
          maxLength={9}
          className="flex-1 bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-white/20"
        />
      </div>
      {!isValid && <p className="text-[11px] text-red-400/70">Formato inválido · usa #RRGGBB o haz clic en el círculo</p>}
    </div>
  );
}

// ─── ImageField ──────────────────────────────────────────────────────────────

export function ImageField({
  value,
  onUpload,
  uploading,
  label,
  hint,
  tall = false,
  square = false,
  large = false,
}: {
  value?: string;
  onUpload: (file: File) => void;
  uploading?: boolean;
  label?: string;
  hint?: string;
  tall?: boolean;
  square?: boolean;
  large?: boolean;
}) {
  const sizeCls = large
    ? "h-56 w-56 mx-auto"
    : square
    ? "h-36 w-36 mx-auto"
    : tall
    ? "h-52 w-full"
    : "h-36 w-full";

  return (
    <div className="space-y-1.5">
      {label && <label className={labelCls}>{label}</label>}
      {hint && <p className="text-[11px] text-white/25 -mt-1 mb-1">{hint}</p>}
      <div
        className={`relative overflow-hidden rounded-2xl border border-dashed border-white/[0.1] bg-white/[0.02] transition-all hover:border-[#E8AA14]/30 hover:bg-[#E8AA14]/[0.03] ${sizeCls}`}
      >
        <input
          type="file"
          accept="image/*"
          className="absolute inset-0 z-10 cursor-pointer opacity-0"
          onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])}
          disabled={uploading}
        />
        {uploading ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-[#E8AA14]" />
          </div>
        ) : value ? (
          <>
            <img src={value} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity hover:opacity-100 z-20 pointer-events-none">
              <span className="text-[10px] font-bold uppercase tracking-widest text-white">
                Cambiar
              </span>
            </div>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-white/20">
            <Upload className="h-5 w-5" />
            <span className="text-[10px] uppercase tracking-widest">
              Subir imagen
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── HoursField ──────────────────────────────────────────────────────────────

const HOUR_PRESETS: HoraItem[] = [
  { dia: "Lunes – Viernes", horas: "" },
  { dia: "Sábado",          horas: "" },
  { dia: "Domingo",         horas: "" },
];

export function HoursField({
  value = [],
  onSave,
}: {
  value?: HoraItem[];
  onSave: (v: HoraItem[]) => void;
}) {
  const [rows, setRows] = useState<HoraItem[]>(value);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { setRows(value); }, [JSON.stringify(value)]);

  const commit = (updated: HoraItem[]) => { setRows(updated); onSave(updated); };
  const update  = (idx: number, key: keyof HoraItem, val: string) =>
    commit(rows.map((r, i) => (i === idx ? { ...r, [key]: val } : r)));
  const remove  = (idx: number) => commit(rows.filter((_, i) => i !== idx));
  const addRow  = (preset: HoraItem) => commit([...rows, { ...preset }]);

  const unusedPresets = HOUR_PRESETS.filter(
    (p) => !rows.find((r) => r.dia === p.dia)
  );

  return (
    <div className="space-y-2.5">

      {/* Quick-add presets */}
      {(unusedPresets.length > 0 || rows.length === 0) && (
        <div className="flex flex-wrap gap-2">
          {unusedPresets.map((p) => (
            <button
              key={p.dia}
              onClick={() => addRow(p)}
              className="flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-[11px] font-bold text-white/40 hover:border-[#E8AA14]/30 hover:bg-[#E8AA14]/[0.04] hover:text-white/70 transition-all"
            >
              <Plus className="h-3 w-3" />
              {p.dia}
            </button>
          ))}
          <button
            onClick={() => addRow({ dia: "", horas: "" })}
            className="flex items-center gap-1.5 rounded-xl border border-dashed border-white/[0.06] px-3 py-2 text-[11px] font-bold text-white/20 hover:border-white/15 hover:text-white/40 transition-all"
          >
            <Plus className="h-3 w-3" />
            Personalizado
          </button>
        </div>
      )}

      {/* Rows */}
      {rows.length > 0 && (
        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-[1fr_1fr_auto] gap-px bg-white/[0.05]">
            <div className="bg-[#0a0a0a] px-4 py-2.5">
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/25">
                Día o rango
              </span>
            </div>
            <div className="bg-[#0a0a0a] px-4 py-2.5">
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/25">
                Horario de atención
              </span>
            </div>
            <div className="bg-[#0a0a0a] w-10" />
          </div>

          {/* Data rows */}
          {rows.map((row, i) => {
            const isClosed = row.horas.trim().toLowerCase() === "cerrado";
            return (
              <div
                key={i}
                className="grid grid-cols-[1fr_1fr_auto] gap-px bg-white/[0.04] border-t border-white/[0.05] first:border-t-0"
              >
                {/* Día */}
                <div className="bg-[#080808] px-3 py-2.5">
                  <input
                    value={row.dia}
                    onChange={(e) => update(i, "dia", e.target.value)}
                    placeholder="Ej. Lunes – Viernes"
                    className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/20"
                  />
                </div>

                {/* Horas */}
                <div className="bg-[#080808] px-3 py-2.5 flex items-center gap-2">
                  {isClosed ? (
                    <span className="flex-1 text-sm font-bold text-red-400/70">Cerrado</span>
                  ) : (
                    <input
                      value={row.horas}
                      onChange={(e) => update(i, "horas", e.target.value)}
                      placeholder="Ej. 9:00am – 6:00pm"
                      className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/20"
                    />
                  )}
                  <button
                    onClick={() => update(i, "horas", isClosed ? "" : "Cerrado")}
                    title={isClosed ? "Marcar como abierto" : "Marcar como cerrado"}
                    className={`shrink-0 rounded-lg px-2 py-1 text-[9px] font-black uppercase tracking-widest transition-colors ${
                      isClosed
                        ? "bg-emerald-500/10 text-emerald-400/80 hover:bg-emerald-500/20"
                        : "bg-white/[0.04] text-white/20 hover:bg-red-500/10 hover:text-red-400/70"
                    }`}
                  >
                    {isClosed ? "Abrir" : "Cerrado"}
                  </button>
                </div>

                {/* Delete */}
                <div className="bg-[#080808] flex items-center justify-center w-10">
                  <button
                    onClick={() => remove(i)}
                    className="text-white/15 hover:text-red-400 transition-colors p-1"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}

          {/* Add more row */}
          {unusedPresets.length > 0 || rows.length > 0 ? (
            <div className="border-t border-white/[0.05] bg-[#080808]">
              <div className="flex flex-wrap gap-2 px-3 py-2.5">
                {unusedPresets.map((p) => (
                  <button
                    key={p.dia}
                    onClick={() => addRow(p)}
                    className="flex items-center gap-1 rounded-lg border border-white/[0.06] px-2.5 py-1 text-[10px] font-bold text-white/25 hover:border-[#E8AA14]/25 hover:text-white/50 transition-all"
                  >
                    <Plus className="h-2.5 w-2.5" />
                    {p.dia}
                  </button>
                ))}
                <button
                  onClick={() => addRow({ dia: "", horas: "" })}
                  className="flex items-center gap-1 rounded-lg border border-dashed border-white/[0.05] px-2.5 py-1 text-[10px] font-bold text-white/15 hover:border-white/10 hover:text-white/30 transition-all"
                >
                  <Plus className="h-2.5 w-2.5" />
                  Personalizado
                </button>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

// ─── StringArrayField ────────────────────────────────────────────────────────

export function StringArrayField({
  value = [],
  onSave,
  placeholder = "Nuevo ítem…",
}: {
  value?: string[];
  onSave: (v: string[]) => void;
  placeholder?: string;
}) {
  const [newVal, setNewVal] = useState("");

  const add = () => {
    const v = newVal.trim();
    if (!v) return;
    onSave([...value, v]);
    setNewVal("");
  };

  const remove = (idx: number) => {
    onSave(value.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {value.map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70"
          >
            {item}
            <button
              onClick={() => remove(i)}
              className="text-white/30 hover:text-red-400 transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={newVal}
          onChange={(e) => setNewVal(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder={placeholder}
          className="flex-1 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/20 focus:border-[#E8AA14]/40 transition-colors"
        />
        <button
          onClick={add}
          disabled={!newVal.trim()}
          className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2.5 text-white/50 disabled:opacity-30 hover:bg-white/[0.06] transition-colors"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
