"use client";

import { AutoField, AutoTextarea, ImageField } from "../../fields";
import { labelCls } from "../../styles";
import { FieldItem } from "../primitives/FieldItem";

const EMPTY_STATS = [
  { value: "", label: "" },
  { value: "", label: "" },
  { value: "", label: "" },
  { value: "", label: "" },
];

// Ejemplos por fila: valor y lo que representa. Plantilla mental "+5 años".
const PLACEHOLDER_VALUES = ["+5",    "+500",     "5★",           "100%"];
const PLACEHOLDER_LABELS = ["Años",  "Clientes", "Calificación", "Compromiso"];

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
          placeholder="Nuestra empresa se dedica a…"
          rows={4}
        />
      </FieldItem>

      <FieldItem id="nosotros-mision">
        <label className={labelCls}>Misión</label>
        <AutoTextarea
          value={d.mision}
          onSave={(v) => savePatch({ mision: v })}
          placeholder="Nuestro propósito es…"
          rows={3}
        />
      </FieldItem>

      <FieldItem id="nosotros-diferencial">
        <label className={labelCls}>¿Qué te hace diferente?</label>
        <AutoTextarea
          value={d.diferencial}
          onSave={(v) => savePatch({ diferencial: v })}
          placeholder="Lo que nos hace únicos es…"
          rows={3}
        />
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
          Estadísticas cortas que generan confianza. Escribe el dato a la izquierda y lo que representa a la derecha.
        </p>
        <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] divide-y divide-white/[0.05]">
          {[0, 1, 2, 3].map((i) => {
            const row = stats[i] ?? { value: "", label: "" };
            return (
              <div key={i} className="flex items-stretch">
                <AutoField
                  value={row.value}
                  onSave={(v) => updateStat(i, "value", v)}
                  placeholder={PLACEHOLDER_VALUES[i]}
                  className="w-[34%] border-0 bg-transparent px-3 py-3 text-base font-black text-white outline-none placeholder:text-white/20 placeholder:font-bold"
                />
                <div className="w-px bg-white/[0.05]" aria-hidden />
                <AutoField
                  value={row.label}
                  onSave={(v) => updateStat(i, "label", v)}
                  placeholder={PLACEHOLDER_LABELS[i]}
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
