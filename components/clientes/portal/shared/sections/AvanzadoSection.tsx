"use client";

import { useEffect, useMemo, useState } from "react";
import { Check } from "lucide-react";
// Nota: `useEffect` + `useState` solo se usan para `pendingTipo` (modal de
// confirmación local) y el `useDebounced` de la preview de Google Fonts. No
// se usan para sincronizar data del proyecto — eso vive en `d`, que ya es el
// `displayedProject` (server + pending mutations).
import { AutoField, ImageField } from "../../fields";
import { labelCls } from "../../styles";
import { FieldItem } from "../primitives/FieldItem";
import { ChipSelector } from "../primitives/ChipSelector";
import {
  TIPO_NEGOCIO_MAP,
  buildTipoNegocioPatch,
  type TipoNegocio,
} from "../primitives/TipoNegocioModal";
import { BRAND_ICON_STYLE } from "../primitives/BrandDefs";
import { ModalConfirm } from "@/components/ui/ModalConfirm";

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
  uploadingFavicon,
  onUploadFavicon,
}: {
  d: any;
  savePatch: (patch: any) => void;
  uploadingFavicon: boolean;
  onUploadFavicon: (file: File) => void;
}) {
  // Debounce sobre `d.fontPreset` directo — 300ms para no bombardear Google
  // Fonts mientras el user tipea. `d` ya incluye optimistic (queue de
  // mutaciones), así que no necesitamos estado local intermedio.
  const debouncedFont = useDebounced(d.fontPreset ?? "", 300);
  const previewFont = useMemo(() => toGoogleFontName(debouncedFont), [debouncedFont]);
  useGoogleFont(previewFont);

  const gaValid = !d.analyticsGAId || GA_RE.test(d.analyticsGAId);

  const [pendingTipo, setPendingTipo] = useState<TipoNegocio | null>(null);

  const handleChangeTipo = (tipo: TipoNegocio) => {
    if (tipo === d.tipoNegocio) return;
    setPendingTipo(tipo);
  };

  const confirmChangeTipo = () => {
    if (!pendingTipo) return;
    savePatch(buildTipoNegocioPatch(pendingTipo, d.legalLastUpdated));
    setPendingTipo(null);
  };

  return (
    <>
      <FieldItem>
        <label className={labelCls}>Tipo de negocio</label>
        <p className="mb-3 text-[11px] text-white/25">
          Define el nombre de tu catálogo y la plantilla legal que usamos.
        </p>
        <div className="space-y-2">
          {(Object.keys(TIPO_NEGOCIO_MAP) as TipoNegocio[]).map((key) => {
            const cfg = TIPO_NEGOCIO_MAP[key];
            const Icon = cfg.icon;
            const active = d.tipoNegocio === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => handleChangeTipo(key)}
                className={`group relative flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-all ${
                  active
                    ? "border-[#a855f7]/50 bg-[linear-gradient(135deg,rgba(232,121,249,0.08)_0%,rgba(168,85,247,0.08)_50%,rgba(34,211,238,0.08)_100%)]"
                    : "border-white/[0.07] bg-white/[0.02] hover:border-white/20"
                }`}
              >
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ring-1 ${
                    active
                      ? "bg-[linear-gradient(135deg,rgba(232,121,249,0.18)_0%,rgba(168,85,247,0.18)_50%,rgba(34,211,238,0.18)_100%)] ring-[#a855f7]/40"
                      : "bg-[linear-gradient(135deg,rgba(232,121,249,0.08)_0%,rgba(168,85,247,0.08)_50%,rgba(34,211,238,0.08)_100%)] ring-[#a855f7]/15"
                  }`}
                >
                  <Icon className="h-4 w-4" style={BRAND_ICON_STYLE} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[13px] font-bold text-white">{cfg.label}</h3>
                  <p className="mt-0.5 text-[11px] leading-snug text-white/45 truncate">
                    {cfg.description}
                  </p>
                </div>
                {active && (
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#e879f9_0%,#a855f7_50%,#22d3ee_100%)] text-white">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </FieldItem>

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
        <label className={labelCls}>Favicon</label>
        <p className="mb-3 text-[11px] text-white/25">
          Opcional. Imagen cuadrada PNG (recomendado 512×512) para el icono de
          la pestaña del browser. Si lo dejas vacío, se usa un icono
          autogenerado con las iniciales sobre el color de tu marca.
        </p>
        <div className="flex justify-center">
          <div className="aspect-square w-40">
            <ImageField
              value={d.favicon}
              uploading={uploadingFavicon}
              square
              onUpload={onUploadFavicon}
            />
          </div>
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

      {pendingTipo && (
        <ModalConfirm
          title="Cambiar tipo de negocio"
          message={
            <>
              Se actualizará el nombre de tu catálogo (
              {TIPO_NEGOCIO_MAP[pendingTipo].catalogoNoun.plural}) y se
              regenerarán tus páginas legales. ¿Quieres continuar?
            </>
          }
          confirmText="Sí, cambiar"
          onCancel={() => setPendingTipo(null)}
          onConfirm={confirmChangeTipo}
        />
      )}
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
