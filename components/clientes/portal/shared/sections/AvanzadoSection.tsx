"use client";

import { useEffect, useMemo, useState } from "react";
import { Check } from "lucide-react";
import { AutoField } from "../../fields";
import { labelCls } from "../../styles";
import { FieldItem } from "../primitives/FieldItem";
import { ChipSelector } from "../primitives/ChipSelector";

const PRESETS = [
  { value: "modern",  label: "Modern" },
  { value: "elegant", label: "Elegant" },
  { value: "tech",    label: "Tech" },
  { value: "classic", label: "Classic" },
];

// Mapping preset -> Google Font name for preview
const PRESET_FONTS: Record<string, string> = {
  modern:  "Inter",
  elegant: "Playfair Display",
  tech:    "JetBrains Mono",
  classic: "Lora",
};

const GA_RE = /^G-[A-Z0-9]{6,}$/;

function toGoogleFontName(input: string): string {
  if (!input) return "Inter";
  const preset = PRESET_FONTS[input.toLowerCase()];
  return preset ?? input;
}

function useGoogleFont(fontName: string) {
  useEffect(() => {
    if (!fontName) return;
    const href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontName)}:wght@400;700&display=swap`;
    const existing = document.head.querySelector<HTMLLinkElement>(
      `link[data-gfont="${fontName}"]`
    );
    if (existing) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    link.setAttribute("data-gfont", fontName);
    document.head.appendChild(link);
  }, [fontName]);
}

export function AvanzadoSection({
  d,
  savePatch,
}: {
  d: any;
  savePatch: (patch: any) => void;
}) {
  const [fontInput, setFontInput] = useState<string>(d.fontPreset ?? "");
  useEffect(() => setFontInput(d.fontPreset ?? ""), [d.fontPreset]);

  const debouncedFont = useDebounced(fontInput, 300);
  const previewFont = useMemo(() => toGoogleFontName(debouncedFont), [debouncedFont]);
  useGoogleFont(previewFont);

  const gaValid = !d.analyticsGAId || GA_RE.test(d.analyticsGAId);

  return (
    <>
      <FieldItem>
        <label className={labelCls}>Fuente tipográfica</label>
        <p className="mb-3 text-[11px] text-white/25">
          Elige un preset o escribe el nombre de cualquier fuente de Google Fonts.
        </p>
        <ChipSelector
          chips={PRESETS}
          value={PRESETS.some((p) => p.value === d.fontPreset) ? d.fontPreset : null}
          onChange={(v) => savePatch({ fontPreset: v })}
        />
        <div className="mt-3">
          <AutoField
            value={d.fontPreset}
            onSave={(v) => savePatch({ fontPreset: v })}
            placeholder="Ej. Montserrat"
          />
        </div>

        {/* Preview live */}
        <div className="mt-3 rounded-2xl border border-white/[0.05] bg-white/[0.02] p-4">
          <p className="mb-2 text-[9px] font-black uppercase tracking-[0.22em] text-white/25">
            Vista previa · {previewFont}
          </p>
          <p
            className="text-xl font-bold text-white"
            style={{ fontFamily: `"${previewFont}", system-ui, sans-serif` }}
          >
            Así se verán tus títulos.
          </p>
          <p
            className="text-[13px] text-white/50"
            style={{ fontFamily: `"${previewFont}", system-ui, sans-serif` }}
          >
            El quick brown fox jumps over the lazy dog.
          </p>
        </div>
      </FieldItem>

      <FieldItem>
        <label className={labelCls}>Google Analytics ID</label>
        <p className="mb-2 text-[11px] text-white/25">
          Formato GA4: G-XXXXXXXXXX. Déjalo vacío para desactivar.
        </p>
        <div className="relative">
          <AutoField
            value={d.analyticsGAId}
            onSave={(v) => savePatch({ analyticsGAId: v })}
            placeholder="G-XXXXXXXXXX"
            className={`w-full rounded-2xl border bg-white/[0.03] px-4 py-3.5 pr-11 text-sm text-white outline-none placeholder:text-white/20 focus:border-[#a855f7]/50 transition-colors ${
              d.analyticsGAId && gaValid
                ? "border-emerald-500/40"
                : d.analyticsGAId && !gaValid
                ? "border-red-500/40"
                : "border-white/[0.08]"
            }`}
          />
          {d.analyticsGAId && gaValid && (
            <Check className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-400" />
          )}
        </div>
        {d.analyticsGAId && !gaValid && (
          <p className="mt-1.5 text-[11px] text-red-400/70">
            Formato inválido · debe empezar con G- seguido de letras y números.
          </p>
        )}
      </FieldItem>
    </>
  );
}

function useDebounced<T>(value: T, ms: number): T {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return v;
}
