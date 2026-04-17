"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MapPin, HelpCircle } from "lucide-react";
import { AutoField, AutoTextarea } from "../../fields";
import { labelCls } from "../../styles";
import { FieldItem } from "../primitives/FieldItem";
import { DayScheduleInput } from "../primitives/DayScheduleInput";
import { MOTION } from "../primitives/motion";

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

  const updateDay = (key: string, v: string) =>
    savePatch({ hours: { ...hours, [key]: v } });

  const copyToAll = () => {
    const mon = hours.monday;
    if (!mon) return;
    const next: Record<string, string> = {};
    DAYS.forEach((day) => { next[day.key] = mon; });
    savePatch({ hours: next });
  };

  const copyToWeekdays = () => {
    const mon = hours.monday;
    if (!mon) return;
    savePatch({
      hours: {
        ...hours,
        tuesday: mon, wednesday: mon, thursday: mon, friday: mon,
      },
    });
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
        <div className="mb-2 flex items-center justify-between">
          <label className={`${labelCls} mb-0`}>Horarios de atención</label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={copyToWeekdays}
              disabled={!hours.monday}
              className="rounded-lg border border-white/[0.07] px-2 py-1 text-[9px] font-black uppercase tracking-[0.15em] text-white/40 transition-colors hover:bg-white/[0.04] disabled:opacity-30"
              title="Copiar lunes a viernes"
            >
              L–V
            </button>
            <button
              type="button"
              onClick={copyToAll}
              disabled={!hours.monday}
              className="rounded-lg border border-white/[0.07] px-2 py-1 text-[9px] font-black uppercase tracking-[0.15em] text-white/40 transition-colors hover:bg-white/[0.04] disabled:opacity-30"
              title="Copiar a todos los días"
            >
              Todos
            </button>
          </div>
        </div>
        <p className="mb-3 text-[11px] text-white/25">
          Configura cada día. Activa "Turno partido" si abres mañana y tarde.
        </p>
        <div className="space-y-2">
          {DAYS.map((day) => (
            <DayScheduleInput
              key={day.key}
              label={day.label}
              value={hours[day.key] ?? ""}
              onSave={(v) => updateDay(day.key, v)}
            />
          ))}
        </div>
      </FieldItem>

      <FieldItem id="ubicacion-mapa">
        <label className={labelCls}>Enlace de mapa <span className="normal-case tracking-normal font-normal text-white/25">— opcional</span></label>
        <AutoField
          value={d.embedUrl}
          onSave={(v) => savePatch({ embedUrl: v })}
          placeholder="https://www.google.com/maps/embed?pb=..."
          type="url"
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
                  <>Copia la URL que aparece dentro de <code className="inline-block rounded bg-white/[0.08] px-1.5 py-0.5 text-[11px] text-white/80">src="..."</code> y pégala arriba.</>,
                ].map((node, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,rgba(232,121,249,0.15)_0%,rgba(168,85,247,0.15)_50%,rgba(96,165,250,0.15)_100%)] text-[10px] font-black">
                      <span className="bg-[linear-gradient(135deg,#e879f9_0%,#a855f7_50%,#60a5fa_100%)] bg-clip-text text-transparent">
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
