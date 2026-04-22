"use client";

import { useEffect, useState } from "react";
import { AutoField, AutoTextarea, ImageField } from "../../fields";
import { labelCls } from "../../styles";
import { FieldItem } from "../primitives/FieldItem";

// Counter vivo para textareas con maxLength — sube/baja mientras el cliente
// tipea sin esperar al blur. AutoTextarea es uncontrolled, así que nos
// suscribimos al input con un onInput y mantenemos un state local.
function CharCounter({ count, max }: { count: number; max: number }) {
  const near = count >= max - 10;
  return (
    <span
      className={`shrink-0 text-[11px] tabular-nums ${
        near ? "text-amber-400/80" : "text-white/30"
      }`}
    >
      {count}/{max}
    </span>
  );
}

// Stats de ejemplo que arrancan prellenados. El cliente los puede editar o
// borrar. Si nunca los toca, aparecen tal cual en el sitio final.
const DEFAULT_STATS = [
  { value: "+5",   label: "Años de experiencia" },
  { value: "+500", label: "Clientes satisfechos" },
  { value: "5★",   label: "Calificación" },
  { value: "100%", label: "Compromiso" },
];

const EMPTY_STATS = [
  { value: "", label: "" },
  { value: "", label: "" },
  { value: "", label: "" },
  { value: "", label: "" },
];

export function NosotrosSection({
  d,
  savePatch,
  uploadingNosotros,
  onUploadFoto,
}: {
  d: any;
  savePatch: (patch: any) => void;
  uploadingNosotros: boolean;
  onUploadFoto: (file: File) => void;
}) {
  const stats: { value: string; label: string }[] = d.stats ?? EMPTY_STATS;

  // Contadores locales para los textareas (AutoTextarea es uncontrolled, así
  // que necesitamos este state para feedback en vivo mientras el cliente tipea).
  // Se sincronizan con `d.*` cuando cambia externamente (ej: realtime del admin).
  const [descCount, setDescCount] = useState((d.descripcion ?? "").length);
  const [misionCount, setMisionCount] = useState((d.mision ?? "").length);
  const [difCount, setDifCount] = useState((d.diferencial ?? "").length);
  useEffect(() => setDescCount((d.descripcion ?? "").length), [d.descripcion]);
  useEffect(() => setMisionCount((d.mision ?? "").length), [d.mision]);
  useEffect(() => setDifCount((d.diferencial ?? "").length), [d.diferencial]);

  // Si el cliente entra por primera vez y no hay stats guardados, sembramos
  // los defaults. Una vez guardados, `d.stats` queda definido y no se vuelve
  // a sembrar aunque el cliente borre todo (respeta su edición explícita).
  useEffect(() => {
    if (!d.stats) {
      savePatch({ stats: DEFAULT_STATS });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateStat = (idx: number, key: "value" | "label", v: string) => {
    const next = stats.length === 4 ? [...stats] : [...EMPTY_STATS];
    next[idx] = { ...next[idx], [key]: v };
    savePatch({ stats: next });
  };

  return (
    <>
      <FieldItem id="nosotros-descripcion">
        <label className={labelCls}>Descripción del negocio</label>
        <AutoTextarea
          value={d.descripcion}
          onSave={(v) => savePatch({ descripcion: v })}
          onInput={(e: React.FormEvent<HTMLTextAreaElement>) =>
            setDescCount(e.currentTarget.value.length)
          }
          placeholder="Somos un equipo apasionado por entregar resultados de calidad."
          rows={4}
          maxLength={150}
        />
        <div className="mt-1.5 flex items-center justify-between gap-3 text-[11px] text-white/25">
          <span>Si lo dejás vacío, en tu sitio aparecerá este texto.</span>
          <CharCounter count={descCount} max={150} />
        </div>
      </FieldItem>

      <FieldItem id="nosotros-mision">
        <label className={labelCls}>Misión</label>
        <AutoTextarea
          value={d.mision}
          onSave={(v) => savePatch({ mision: v })}
          onInput={(e: React.FormEvent<HTMLTextAreaElement>) =>
            setMisionCount(e.currentTarget.value.length)
          }
          placeholder="Ofrecer productos y servicios que superen expectativas."
          rows={3}
          maxLength={150}
        />
        <div className="mt-1.5 flex items-center justify-between gap-3 text-[11px] text-white/25">
          <span>Si lo dejás vacío, en tu sitio aparecerá este texto.</span>
          <CharCounter count={misionCount} max={150} />
        </div>
      </FieldItem>

      <FieldItem id="nosotros-diferencial">
        <label className={labelCls}>¿Qué te hace diferente?</label>
        <AutoTextarea
          value={d.diferencial}
          onSave={(v) => savePatch({ diferencial: v })}
          onInput={(e: React.FormEvent<HTMLTextAreaElement>) =>
            setDifCount(e.currentTarget.value.length)
          }
          placeholder="Atención cercana, compromiso con los tiempos y calidad consistente."
          rows={3}
          maxLength={150}
        />
        <div className="mt-1.5 flex items-center justify-between gap-3 text-[11px] text-white/25">
          <span>Si lo dejás vacío, en tu sitio aparecerá este texto.</span>
          <CharCounter count={difCount} max={150} />
        </div>
      </FieldItem>

      <FieldItem id="nosotros-foto">
        <label className={labelCls}>Foto del negocio o equipo</label>
        <p className="mb-2.5 text-[11px] text-white/25">
          Una foto del local, el equipo o el día a día.
        </p>
        <ImageField
          value={d.imagenNosotros}
          uploading={uploadingNosotros}
          tall
          onUpload={onUploadFoto}
        />
      </FieldItem>

      <FieldItem id="nosotros-stats">
        <label className={labelCls}>4 datos clave</label>
        <p className="mb-3 text-[11px] text-white/30">
          Los valores de ejemplo ya están listos — puedes cambiarlos por los
          tuyos (años, clientes, calificación, etc).
        </p>
        <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] divide-y divide-white/[0.05]">
          {[0, 1, 2, 3].map((i) => {
            const row = stats[i] ?? { value: "", label: "" };
            return (
              <div key={i} className="flex items-stretch">
                <AutoField
                  value={row.value}
                  onSave={(v) => updateStat(i, "value", v)}
                  placeholder={DEFAULT_STATS[i].value}
                  className="w-[34%] border-0 bg-transparent px-3 py-3 text-base font-black text-white outline-none placeholder:text-white/20 placeholder:font-bold"
                />
                <div className="w-px bg-white/[0.05]" aria-hidden />
                <AutoField
                  value={row.label}
                  onSave={(v) => updateStat(i, "label", v)}
                  placeholder={DEFAULT_STATS[i].label}
                  className="flex-1 border-0 bg-transparent px-3 py-3 text-[13px] text-white/80 outline-none placeholder:text-white/25"
                />
              </div>
            );
          })}
        </div>
      </FieldItem>
    </>
  );
}
