"use client";

import { ColorInput } from "../../fields";
import { labelCls } from "../../styles";
import { FieldItem } from "../primitives/FieldItem";
import { PalettePresetGrid, matchPaletteId, type Palette } from "../primitives/PalettePreset";

const HEX_RE = /^#[0-9a-fA-F]{3,8}$/;

export function ColoresSection({
  d,
  savePatch,
}: {
  d: any;
  savePatch: (patch: any) => void;
}) {
  const colorPrimario = d.colorPrimario ?? d.colorAcento ?? "";
  const fondo = d.colorFondo ?? "";
  const acento = d.colorAcento2 ?? "";

  const activePalette = matchPaletteId(fondo, colorPrimario, acento);

  const applyPalette = (p: Palette) =>
    savePatch({
      colorFondo: p.fondo,
      colorPrimario: p.primario,
      colorAcento2: p.acento,
    });

  const safeFondo    = HEX_RE.test(fondo)         ? fondo         : "#0a0a0a";
  const safePrimario = HEX_RE.test(colorPrimario) ? colorPrimario : "#a855f7";
  const safeAcento   = HEX_RE.test(acento)        ? acento        : "#f5f5f5";

  return (
    <>
      {/* Live preview */}
      <FieldItem>
        <div
          className="relative overflow-hidden rounded-2xl border border-white/[0.06] p-4"
          style={{ background: safeFondo }}
        >
          <p
            className="text-[9px] font-black uppercase tracking-[0.22em]"
            style={{ color: safeAcento, opacity: 0.6 }}
          >
            Vista previa
          </p>
          <p
            className="mt-2 text-lg font-black"
            style={{ color: safePrimario }}
          >
            Tu negocio
          </p>
          <p
            className="text-[11px]"
            style={{ color: safeAcento, opacity: 0.7 }}
          >
            Así se verá tu paleta en el sitio.
          </p>
          <div
            className="mt-3 inline-flex items-center rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.22em]"
            style={{ background: safePrimario, color: safeFondo }}
          >
            Botón principal
          </div>
        </div>
      </FieldItem>

      {/* Paletas sugeridas */}
      <FieldItem>
        <label className={labelCls}>Paletas sugeridas</label>
        <p className="mb-3 text-[11px] text-white/25">
          Toca una combinación para aplicarla al instante.
        </p>
        <PalettePresetGrid activeId={activePalette} onApply={applyPalette} />
      </FieldItem>

      {/* Override manual */}
      <FieldItem>
        <label className={labelCls}>Personaliza cada color</label>
        <p className="mb-3 text-[11px] text-white/25">
          Toca cada círculo para abrir el selector.
        </p>
        <div className="space-y-3">
          <ColorInput
            label="Color de fondo"
            hint="Base de páginas y secciones."
            value={fondo}
            onSave={(v) => savePatch({ colorFondo: v })}
          />
          <ColorInput
            label="Color primario"
            hint="Botones principales y títulos destacados."
            value={colorPrimario}
            onSave={(v) => savePatch({ colorPrimario: v })}
          />
          <ColorInput
            label="Color de acento"
            hint="Detalles, hover y elementos de apoyo."
            value={acento}
            onSave={(v) => savePatch({ colorAcento2: v })}
          />
        </div>
      </FieldItem>
    </>
  );
}
