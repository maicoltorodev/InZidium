"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MapPin, HelpCircle } from "lucide-react";
import { AutoField, AutoTextarea } from "../../fields";
import { labelCls } from "../../styles";
import { FieldItem } from "../primitives/FieldItem";
import { DayScheduleInput } from "../primitives/DayScheduleInput";
import { MOTION } from "../primitives/motion";

type GroupMode = "separated" | "weekdays" | "all";
type DayKey =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

const WEEKDAY_KEYS: DayKey[] = ["monday", "tuesday", "wednesday", "thursday", "friday"];
const ALL_KEYS: DayKey[] = [...WEEKDAY_KEYS, "saturday", "sunday"];

// Detecta automáticamente el modo de agrupación que el cliente tiene
// configurado, para que al entrar al proyecto ya vea el layout correcto.
// Si los 7 días son iguales → "all". Si L-V iguales → "weekdays". Si no →
// "separated".
function detectMode(hours: Record<string, string>): GroupMode {
  const vals = ALL_KEYS.map((k) => hours[k] ?? "");
  const first = vals[0];
  if (vals.every((v) => v === first) && first) return "all";
  const weekdayVals = WEEKDAY_KEYS.map((k) => hours[k] ?? "");
  if (weekdayVals.every((v) => v === weekdayVals[0]) && weekdayVals[0]) return "weekdays";
  return "separated";
}

// Si el cliente pega el iframe completo de Google Maps, sacamos el src. Si
// pega solo la URL también funciona. Evitamos pedirle al cliente que recorte
// el HTML a mano.
function extractMapUrl(raw: string): string {
  const trimmed = (raw || "").trim();
  if (!trimmed) return "";
  const match = trimmed.match(/src\s*=\s*["']([^"']+)["']/i);
  return match ? match[1].trim() : trimmed;
}

const DAYS: { key: string; label: string }[] = [
  { key: "monday",    label: "Lunes" },
  { key: "tuesday",   label: "Martes" },
  { key: "wednesday", label: "Miércoles" },
  { key: "thursday",  label: "Jueves" },
  { key: "friday",    label: "Viernes" },
  { key: "saturday",  label: "Sábado" },
  { key: "sunday",    label: "Domingo" },
];

export function UbicacionSection({
  d,
  savePatch,
}: {
  d: any;
  savePatch: (patch: any) => void;
}) {
  const [showMapHelp, setShowMapHelp] = useState(false);
  const hours: Record<string, string> = d.hours || {};

  // Modo de agrupación — persistimos en onboardingData para que al volver el
  // cliente vea el layout que eligió. Si no hay pref guardada, detectamos
  // desde los horarios actuales.
  const savedMode: GroupMode | undefined = d.hoursMode;
  const autoMode = useMemo(() => detectMode(hours), [hours]);
  const mode: GroupMode = savedMode ?? autoMode;

  const updateDay = (key: DayKey, v: string) =>
    savePatch({ hours: { ...hours, [key]: v } });

  // Al editar el card agrupado "L-V", escribimos el mismo valor a los 5 keys
  // para mantener la serialización por día que consume la plantilla.
  const updateWeekdays = (v: string) => {
    const next = { ...hours };
    for (const k of WEEKDAY_KEYS) next[k] = v;
    savePatch({ hours: next });
  };

  const updateAll = (v: string) => {
    const next: Record<string, string> = {};
    for (const k of ALL_KEYS) next[k] = v;
    savePatch({ hours: next });
  };

  const setMode = (nextMode: GroupMode) => {
    if (nextMode === mode) return;
    // Al cambiar de modo, uniformizamos los horarios para evitar estados
    // raros. Tomamos el valor de lunes como base (o el primer día no vacío).
    const base =
      hours.monday ||
      ALL_KEYS.map((k) => hours[k]).find((v) => v) ||
      "";
    if (nextMode === "all" && base) {
      const next: Record<string, string> = {};
      for (const k of ALL_KEYS) next[k] = base;
      savePatch({ hours: next, hoursMode: nextMode });
      return;
    }
    if (nextMode === "weekdays" && base) {
      const next = { ...hours };
      for (const k of WEEKDAY_KEYS) next[k] = base;
      savePatch({ hours: next, hoursMode: nextMode });
      return;
    }
    savePatch({ hoursMode: nextMode });
  };

  return (
    <>
      <FieldItem id="ubicacion-descripcion">
        <label className={labelCls}>Descripción del local</label>
        <AutoTextarea
          value={d.descripcionLocal}
          onSave={(v) => savePatch({ descripcionLocal: v })}
          placeholder="Describe tu espacio y el ambiente."
          rows={3}
        />
      </FieldItem>

      <FieldItem id="ubicacion-direccion">
        <label className={labelCls}>Dirección</label>
        <div className="relative">
          <MapPin className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
          <AutoField
            value={d.direccion}
            onSave={(v) => savePatch({ direccion: v })}
            placeholder="Calle 123 #45-67, Ciudad"
            className="w-full rounded-2xl border border-white/[0.08] bg-white/[0.03] pl-11 pr-4 py-3.5 text-sm text-white outline-none placeholder:text-white/20 focus:border-[#a855f7]/50 transition-colors"
          />
        </div>
      </FieldItem>

      <FieldItem id="ubicacion-horarios">
        <label className={labelCls}>Horarios de atención</label>
        <p className="mb-3 text-[11px] text-white/25">
          Elige cómo agrupar los días. Si tu horario es el mismo toda la
          semana, usa "Todos los días". Si L a V es igual pero sábado o
          domingo cambian, usa "L a V + fin de semana".
        </p>

        {/* Selector de modo de agrupación */}
        <div className="mb-3 grid grid-cols-3 gap-1.5 rounded-2xl border border-white/[0.06] bg-black/20 p-1">
          <GroupChip
            active={mode === "separated"}
            onClick={() => setMode("separated")}
          >
            Cada día
          </GroupChip>
          <GroupChip
            active={mode === "weekdays"}
            onClick={() => setMode("weekdays")}
          >
            L a V + fin de semana
          </GroupChip>
          <GroupChip active={mode === "all"} onClick={() => setMode("all")}>
            Todos los días
          </GroupChip>
        </div>

        <div className="space-y-2">
          {mode === "all" && (
            <DayScheduleInput
              label="Toda la semana"
              value={hours.monday ?? ""}
              onSave={updateAll}
            />
          )}
          {mode === "weekdays" && (
            <>
              <DayScheduleInput
                label="Lunes a viernes"
                value={hours.monday ?? ""}
                onSave={updateWeekdays}
              />
              <DayScheduleInput
                label="Sábado"
                value={hours.saturday ?? ""}
                onSave={(v) => updateDay("saturday", v)}
              />
              <DayScheduleInput
                label="Domingo"
                value={hours.sunday ?? ""}
                onSave={(v) => updateDay("sunday", v)}
              />
            </>
          )}
          {mode === "separated" &&
            DAYS.map((day) => (
              <DayScheduleInput
                key={day.key}
                label={day.label}
                value={hours[day.key] ?? ""}
                onSave={(v) => updateDay(day.key as DayKey, v)}
              />
            ))}
        </div>
      </FieldItem>

      <FieldItem id="ubicacion-mapa">
        <label className={labelCls}>Enlace de mapa <span className="normal-case tracking-normal font-normal text-white/25">— opcional</span></label>
        <AutoField
          value={d.embedUrl}
          onSave={(v) => savePatch({ embedUrl: extractMapUrl(v) })}
          placeholder="Pega el iframe o la URL de Google Maps"
        />
        <button
          type="button"
          onClick={() => setShowMapHelp((p) => !p)}
          className="mt-2 flex items-center gap-1.5 text-[11px] font-bold text-white/30 transition-colors hover:text-[#a855f7]"
        >
          <HelpCircle className="h-3 w-3" />
          ¿Cómo obtengo este enlace?
        </button>
        <AnimatePresence initial={false}>
          {showMapHelp && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={MOTION.reveal}
              className="overflow-hidden"
            >
              <ol className="mt-3 space-y-3 rounded-2xl border border-white/[0.05] bg-white/[0.02] p-4">
                {[
                  <>Abre Google Maps y busca tu negocio.</>,
                  <>Toca el botón <span className="font-semibold text-white/85">Compartir</span>, luego <span className="font-semibold text-white/85">Insertar mapa</span>.</>,
                  <>Copia el código que te aparece y pégalo arriba.</>,
                ].map((node, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,rgba(232,121,249,0.15)_0%,rgba(168,85,247,0.15)_50%,rgba(34,211,238,0.15)_100%)] text-[10px] font-black">
                      <span className="bg-[linear-gradient(135deg,#e879f9_0%,#a855f7_50%,#22d3ee_100%)] bg-clip-text text-transparent">
                        {i + 1}
                      </span>
                    </span>
                    <p className="flex-1 min-w-0 text-[12px] leading-relaxed text-white/55 break-words">
                      {node}
                    </p>
                  </li>
                ))}
              </ol>
            </motion.div>
          )}
        </AnimatePresence>
      </FieldItem>
    </>
  );
}

function GroupChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl py-2 text-center text-[10px] font-black uppercase tracking-[0.18em] transition-colors ${
        active
          ? "bg-[linear-gradient(135deg,rgba(232,121,249,0.15)_0%,rgba(168,85,247,0.15)_50%,rgba(34,211,238,0.15)_100%)] text-white ring-1 ring-[#a855f7]/40 shadow-[0_2px_16px_-4px_rgba(168,85,247,0.5)]"
          : "text-white/40 hover:bg-white/[0.03] hover:text-white/70"
      }`}
    >
      {children}
    </button>
  );
}
