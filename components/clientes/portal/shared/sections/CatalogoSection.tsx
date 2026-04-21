"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BriefcaseBusiness, ShoppingBag, UtensilsCrossed,
  Plus, Image as ImageIcon, Trash2, Loader2, X, Tag, Check,
} from "lucide-react";
import { uploadProjectFile } from "@/lib/client/upload-archivo";
import { labelCls } from "../../styles";
import { newItem, type CatalogoItem, type TipoCatalogo } from "../../types";
import { AutoField, AutoTextarea, StringArrayField } from "../../fields";
import { FieldItem } from "../primitives/FieldItem";
import { BottomSheet } from "../primitives/BottomSheet";
import { ToggleRow } from "../primitives/ToggleRow";
import { MOTION } from "../primitives/motion";
import { BRAND_ICON_STYLE } from "../primitives/BrandDefs";
import { CatalogoItemEditor, type PreviewTheme } from "../../desktop/CatalogoItemEditor";

const TIPO_CONFIG = {
  servicios: {
    singular: "Servicio",
    plural: "Servicios",
    icon: BriefcaseBusiness,
    add: "Agregar servicio",
    placeholders: {
      titulo: "Ej. Asesoría fiscal",
      descripcion: "Qué incluye, duración, para quién es ideal…",
      precio: "Ej. $50.000 · Desde $30k · Consultar",
    },
  },
  productos: {
    singular: "Producto",
    plural: "Productos",
    icon: ShoppingBag,
    add: "Agregar producto",
    placeholders: {
      titulo: "Ej. Camiseta oversize",
      descripcion: "Materiales, talles, uso…",
      precio: "Ej. $60.000 · Oferta $45.000",
    },
  },
  menu: {
    singular: "Platillo",
    plural: "Menú",
    icon: UtensilsCrossed,
    add: "Agregar platillo",
    placeholders: {
      titulo: "Ej. Pizza margherita",
      descripcion: "Ingredientes principales, tamaño, picante…",
      precio: "Ej. $25.000 · Individual / familiar",
    },
  },
} as const;

// Un item se considera vacío si el cliente no dejó ningún dato significativo.
// Se usa al cerrar el sheet para auto-eliminar items fantasma.
function isItemEmpty(i: CatalogoItem): boolean {
  return (
    !i.titulo.trim() &&
    !i.descripcion.trim() &&
    !i.precio.trim() &&
    !i.imagen.trim() &&
    (!i.features || i.features.length === 0)
  );
}

export function CatalogoSection({
  d,
  savePatch,
  projectId,
  showToast,
  device = "mobile",
}: {
  d: any;
  savePatch: (patch: any) => void;
  projectId: string;
  showToast: (msg: string, type: "success" | "error") => void;
  /** En desktop usamos un modal centrado con preview fiel al sitio.
   *  En mobile/tablet mantenemos el BottomSheet. */
  device?: "desktop" | "tablet" | "mobile";
}) {
  const tipo: TipoCatalogo = d.tipoCatalogo || "servicios";
  const categorias: string[] = d.categorias || [];
  const catalogo: CatalogoItem[] = d.catalogo || [];
  const cfg = TIPO_CONFIG[tipo];

  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploadingImg, setUploadingImg] = useState(false);

  const editing = catalogo.find((i) => i.id === editingId) ?? null;

  const setItem = (updated: CatalogoItem) =>
    savePatch({ catalogo: catalogo.map((i) => (i.id === updated.id ? updated : i)) });

  const createItem = () => {
    const item = newItem();
    savePatch({ catalogo: [...catalogo, item] });
    setEditingId(item.id);
  };

  const removeItem = (id: string) => {
    savePatch({ catalogo: catalogo.filter((i) => i.id !== id) });
    setEditingId(null);
  };

  // Al cerrar el sheet, si el item quedó completamente vacío lo eliminamos —
  // evita que se acumulen "Nuevo servicio" sin datos en la lista si el cliente
  // toca Agregar y luego cierra.
  const handleCloseSheet = () => {
    if (editing && isItemEmpty(editing)) {
      savePatch({ catalogo: catalogo.filter((i) => i.id !== editing.id) });
    }
    setEditingId(null);
  };

  const addCategory = (raw: string): string | null => {
    const cat = raw.trim();
    if (!cat || categorias.includes(cat)) return null;
    savePatch({ categorias: [...categorias, cat] });
    return cat;
  };

  const removeCategory = (cat: string) => {
    // Al borrar una categoría, limpiamos la asignación de los items que la usaban.
    const nextCatalogo = catalogo.map((i) =>
      i.categoria === cat ? { ...i, categoria: "" } : i
    );
    savePatch({
      categorias: categorias.filter((c) => c !== cat),
      catalogo: nextCatalogo,
    });
  };

  const handleItemImage = async (file: File) => {
    if (!editing) return;
    setUploadingImg(true);
    try {
      const result = await uploadProjectFile({
        file, proyectoId: projectId, subidoPor: "cliente", oldUrl: editing.imagen,
      });
      if (result.success && result.url) {
        setItem({ ...editing, imagen: result.url });
      } else showToast(result.error || "Error al subir la imagen", "error");
    } catch {
      showToast("Error al subir la imagen", "error");
    } finally {
      setUploadingImg(false);
    }
  };

  const sheetTitle = editing
    ? editing.titulo.trim()
      ? `Editar ${cfg.singular.toLowerCase()}`
      : `Agregar ${cfg.singular.toLowerCase()}`
    : "";

  return (
    <>
      {/* Lista de items — lo primero que ve el cliente */}
      <FieldItem>
        <div className="mb-3 flex items-center justify-between">
          <label className={`${labelCls} mb-0`}>
            {cfg.plural}{" "}
            <span className="normal-case tracking-normal font-normal text-white/20">
              ({catalogo.length})
            </span>
          </label>
        </div>

        {catalogo.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-white/[0.07] py-10 text-white/25">
            <cfg.icon className="h-6 w-6" />
            <p className="text-[11px] uppercase tracking-widest">
              Aún no has agregado {cfg.plural.toLowerCase()}
            </p>
            <button
              type="button"
              onClick={createItem}
              className="mt-1 flex items-center gap-1.5 rounded-full bg-[linear-gradient(135deg,#e879f9_0%,#a855f7_50%,#22d3ee_100%)] px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-[0_0_24px_-6px_rgba(168,85,247,0.7)] transition-transform active:scale-95"
            >
              <Plus className="h-3.5 w-3.5" strokeWidth={3} />
              {cfg.add}
            </button>
          </div>
        ) : (
          /* Grid de cards con el mismo layout del sitio: imagen 4:3 arriba con
             overlay, categoría como pill gradient, título + descripción +
             price·edit abajo. Más reconocible que una lista de filas planas. */
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {catalogo.map((item) => (
              <CatalogoCard
                key={item.id}
                item={item}
                cfg={cfg}
                onClick={() => setEditingId(item.id)}
              />
            ))}
          </div>
        )}

        {catalogo.length > 0 && (
          <button
            type="button"
            onClick={createItem}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-[#a855f7]/30 bg-[linear-gradient(135deg,rgba(232,121,249,0.08)_0%,rgba(168,85,247,0.08)_50%,rgba(34,211,238,0.08)_100%)] py-3 text-[11px] font-black uppercase tracking-[0.22em] transition-colors hover:border-[#a855f7]/50 [&>span]:bg-[linear-gradient(90deg,#e879f9_0%,#a855f7_50%,#22d3ee_100%)] [&>span]:bg-clip-text [&>span]:text-transparent"
          >
            <Plus className="h-4 w-4" strokeWidth={3} style={BRAND_ICON_STYLE} />
            <span>{cfg.add}</span>
          </button>
        )}
      </FieldItem>

      {/* Categorías — bajo la lista porque es opcional y no es la primera acción */}
      <FieldItem>
        <label className={labelCls}>
          Categorías <span className="normal-case tracking-normal font-normal text-white/20">— opcional</span>
        </label>
        <p className="-mt-1 mb-2.5 text-[11px] text-white/25">
          Úsalas para agrupar {cfg.plural.toLowerCase()} en el sitio. Si no las
          creas, todo aparece junto.
        </p>
        {categorias.length > 0 ? (
          <div className="mb-2.5 flex flex-wrap gap-2">
            {categorias.map((c) => (
              <span
                key={c}
                className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-white/70"
              >
                {c}
                <button
                  type="button"
                  onClick={() => removeCategory(c)}
                  className="text-white/30 hover:text-red-400 transition-colors"
                  aria-label={`Eliminar ${c}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        ) : null}
        <AddCategoryInput onAdd={addCategory} />
      </FieldItem>

      {/* Editor — modal centrado en desktop, BottomSheet en mobile/tablet */}
      {editing && device === "desktop" ? (
        <CatalogoItemEditor
          item={editing}
          cfg={cfg}
          categorias={categorias}
          projectId={projectId}
          theme={buildPreviewTheme(d)}
          onChange={setItem}
          onClose={handleCloseSheet}
          onRemove={() => removeItem(editing.id)}
          onAddCategory={addCategory}
          showToast={showToast}
        />
      ) : (
        <BottomSheet
          open={!!editing}
          onClose={handleCloseSheet}
          title={sheetTitle}
          footer={
            editing && (
              <button
                type="button"
                onClick={() => removeItem(editing.id)}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/[0.06] py-3 text-[11px] font-black uppercase tracking-[0.2em] text-red-400 transition-colors hover:bg-red-500/10"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Eliminar {cfg.singular.toLowerCase()}
              </button>
            )
          }
        >
          {editing && (
            <ItemForm
              item={editing}
              categorias={categorias}
              cfg={cfg}
              uploadingImg={uploadingImg}
              onChange={setItem}
              onUploadImage={handleItemImage}
              onAddCategory={addCategory}
            />
          )}
        </BottomSheet>
      )}
    </>
  );
}

// Arma el theme que pasa al editor desktop para el preview WYSIWYG. Los
// colores vienen del onboarding; text/textMuted se derivan por luminance
// del bg (fondo claro → texto oscuro, y viceversa).
function buildPreviewTheme(d: any): PreviewTheme {
  const bg = d.colorFondo || "#ffffff";
  const primary = d.colorPrimario || d.colorAcento || "#c8a24a";
  const accent = d.colorAcento2 || d.colorAcento || d.colorPrimario || "#7a1e2c";
  const dark = luminanceHex(bg) < 0.5;
  return {
    primary,
    accent,
    bg,
    text: dark ? "#f5f5f7" : "#171717",
    textMuted: dark ? "#9a9aa3" : "#6b6b73",
  };
}

// Card de item en la lista — layout tipo "service card" del sitio pero con
// paleta admin (dark + gradient brand). Click abre el editor. Grid-friendly
// (aspect-[4/3]) para que entren 2 en desktop y 1 en mobile.
function CatalogoCard({
  item,
  cfg,
  onClick,
}: {
  item: CatalogoItem;
  cfg: {
    singular: string;
    plural: string;
    icon: React.ElementType;
    add: string;
    placeholders: { titulo: string; descripcion: string; precio: string };
  };
  onClick: () => void;
}) {
  const Icon = cfg.icon;
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.99 }}
      whileHover={{ y: -2 }}
      transition={MOTION.tap}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] text-left transition-colors hover:border-[#a855f7]/30"
    >
      {/* Imagen 4:3 con overlay y categoría pill */}
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        {item.imagen ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.imagen}
            alt=""
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-[linear-gradient(135deg,rgba(232,121,249,0.08)_0%,rgba(168,85,247,0.06)_50%,rgba(34,211,238,0.08)_100%)] text-white/25">
            <Icon className="h-8 w-8" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
        {item.categoria && (
          <span className="absolute left-3 top-3 rounded-full border border-white/20 bg-[linear-gradient(90deg,rgba(168,85,247,0.9),rgba(34,211,238,0.9))] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.22em] text-white shadow-lg backdrop-blur-sm">
            {item.categoria}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="text-[14px] font-black leading-tight text-white line-clamp-1">
          {item.titulo.trim() || `Nuevo ${cfg.singular.toLowerCase()}`}
        </h3>
        <p className="line-clamp-2 text-[11px] leading-snug text-white/45">
          {item.descripcion.trim() || "Sin descripción todavía."}
        </p>
        <div className="mt-auto flex items-center justify-between border-t border-white/[0.05] pt-2.5">
          {item.precio ? (
            <div className="flex flex-col">
              <span className="text-[9px] uppercase tracking-[0.2em] text-white/30">
                Precio
              </span>
              <span className="text-[13px] font-bold bg-[linear-gradient(90deg,#e879f9_0%,#a855f7_50%,#22d3ee_100%)] bg-clip-text text-transparent">
                {item.precio}
              </span>
            </div>
          ) : (
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/25">
              Sin precio
            </span>
          )}
          <span className="text-[9px] font-bold uppercase tracking-[0.22em] text-white/40 group-hover:text-white/70 transition-colors">
            Editar
          </span>
        </div>
      </div>
    </motion.button>
  );
}

function luminanceHex(hex: string): number {
  const c = hex.replace("#", "").padEnd(6, "0").slice(0, 6);
  const r = parseInt(c.slice(0, 2), 16) / 255;
  const g = parseInt(c.slice(2, 4), 16) / 255;
  const b = parseInt(c.slice(4, 6), 16) / 255;
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

// ─── Input inline para categoría (usado fuera y dentro del modal) ────────────

function AddCategoryInput({
  onAdd,
  compact = false,
}: {
  onAdd: (raw: string) => string | null;
  compact?: boolean;
}) {
  const [value, setValue] = useState("");
  const submit = () => {
    const added = onAdd(value);
    if (added) setValue("");
  };
  return (
    <div className="flex gap-2">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            submit();
          }
        }}
        placeholder={compact ? "Nueva categoría…" : "Nueva categoría…"}
        className="flex-1 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/20 focus:border-[#a855f7]/40 transition-colors"
      />
      <button
        type="button"
        onClick={submit}
        disabled={!value.trim()}
        aria-label="Agregar categoría"
        className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 text-white/50 disabled:opacity-30 hover:bg-white/[0.06] transition-colors"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}

// ─── Form dentro del sheet ───────────────────────────────────────────────────

type TipoConfig = (typeof TIPO_CONFIG)[TipoCatalogo];

function ItemForm({
  item,
  categorias,
  cfg,
  uploadingImg,
  onChange,
  onUploadImage,
  onAddCategory,
}: {
  item: CatalogoItem;
  categorias: string[];
  cfg: TipoConfig;
  uploadingImg: boolean;
  onChange: (updated: CatalogoItem) => void;
  onUploadImage: (file: File) => void;
  onAddCategory: (raw: string) => string | null;
}) {
  const fieldCls =
    "w-full rounded-xl border border-white/[0.08] bg-black/20 px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/20 focus:border-[#a855f7]/40 transition-colors";
  const subLabelCls =
    "mb-1.5 block text-[9px] font-bold uppercase tracking-[0.22em] text-white/30";

  // Si hay precio, el toggle está siempre ON (sin importar el override).
  // El override solo aplica cuando no hay precio — cubre el caso transitorio
  // "user acaba de prender el toggle, aún no escribió el valor". Así un
  // cambio externo de `item.precio` (admin en paralelo) se refleja en el
  // toggle aunque el modal esté abierto.
  const [precioOnOverride, setPrecioOnOverride] = useState<boolean | null>(null);
  const precioOn = item.precio ? true : precioOnOverride ?? false;
  const [showNewCat, setShowNewCat] = useState(false);

  const togglePrecio = (next: boolean) => {
    if (!next && item.precio) onChange({ ...item, precio: "" });
    setPrecioOnOverride(next);
  };

  const handleAddCategory = (raw: string): string | null => {
    const added = onAddCategory(raw);
    if (added) {
      onChange({ ...item, categoria: added });
      setShowNewCat(false);
    }
    return added;
  };

  return (
    <div className="space-y-4">
      {/* Preview — cómo se verá el item en el sitio */}
      <ItemPreview item={item} cfg={cfg} />

      {/* Título */}
      <div>
        <label className={subLabelCls}>Título</label>
        <AutoField
          value={item.titulo}
          onSave={(v) => onChange({ ...item, titulo: v })}
          placeholder={cfg.placeholders.titulo}
          className={fieldCls}
          autoFocus
        />
      </div>

      {/* Descripción */}
      <div>
        <label className={subLabelCls}>Descripción</label>
        <AutoTextarea
          value={item.descripcion}
          onSave={(v) => onChange({ ...item, descripcion: v })}
          placeholder={cfg.placeholders.descripcion}
          rows={3}
          className={`${fieldCls} resize-none`}
        />
      </div>

      {/* Imagen */}
      <div>
        <label className={subLabelCls}>Imagen</label>
        <div className="relative h-36 w-full overflow-hidden rounded-xl border border-dashed border-white/[0.08] bg-black/20 transition-colors hover:border-[#a855f7]/25">
          <input
            type="file"
            accept="image/*"
            className="absolute inset-0 z-10 cursor-pointer opacity-0"
            onChange={(e) => e.target.files?.[0] && onUploadImage(e.target.files[0])}
            disabled={uploadingImg}
          />
          {uploadingImg ? (
            <div className="flex h-full items-center justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-[#a855f7]" />
            </div>
          ) : item.imagen ? (
            <img src={item.imagen} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-1.5 text-white/25">
              <ImageIcon className="h-4 w-4" />
              <span className="text-[10px] uppercase tracking-widest">Subir imagen</span>
            </div>
          )}
        </div>
      </div>

      {/* Categoría */}
      <div>
        <label className={subLabelCls}>
          Categoría <span className="normal-case tracking-normal font-normal text-white/25">— opcional</span>
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onChange({ ...item, categoria: "" })}
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] transition-colors ${
              !item.categoria
                ? "border-[#a855f7]/50 bg-[#a855f7]/10 text-white"
                : "border-white/10 bg-white/[0.02] text-white/45 hover:text-white/70"
            }`}
          >
            {!item.categoria && <Check className="h-3 w-3" strokeWidth={3} />}
            Sin categoría
          </button>
          {categorias.map((c) => {
            const active = item.categoria === c;
            return (
              <button
                key={c}
                type="button"
                onClick={() => onChange({ ...item, categoria: c })}
                className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] transition-colors ${
                  active
                    ? "border-[#a855f7]/50 bg-[#a855f7]/10 text-white"
                    : "border-white/10 bg-white/[0.02] text-white/60 hover:text-white/90"
                }`}
              >
                {active && <Check className="h-3 w-3" strokeWidth={3} />}
                {c}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => setShowNewCat((v) => !v)}
            className="flex items-center gap-1.5 rounded-full border border-dashed border-white/20 bg-white/[0.02] px-3 py-1.5 text-[11px] text-white/50 transition-colors hover:border-[#a855f7]/40 hover:text-white/80"
          >
            <Plus className="h-3 w-3" strokeWidth={3} />
            Nueva
          </button>
        </div>
        <AnimatePresence initial={false}>
          {showNewCat && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={MOTION.reveal}
              className="overflow-hidden"
            >
              <div className="pt-2.5">
                <AddCategoryInput onAdd={handleAddCategory} compact />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Precio (opcional) */}
      <div>
        <label className={subLabelCls}>
          Precio <span className="normal-case tracking-normal font-normal text-white/25">— opcional</span>
        </label>
        <ToggleRow
          icon={Tag}
          title="Mostrar precio"
          checked={precioOn}
          onChange={togglePrecio}
        />
        <AnimatePresence initial={false}>
          {precioOn && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={MOTION.reveal}
              className="overflow-hidden"
            >
              <AutoField
                value={item.precio}
                onSave={(v) => onChange({ ...item, precio: v })}
                placeholder={cfg.placeholders.precio}
                className={`${fieldCls} mt-2.5`}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Características */}
      <div>
        <label className={subLabelCls}>
          Características <span className="normal-case tracking-normal font-normal text-white/25">— opcional</span>
        </label>
        <StringArrayField
          value={item.features || []}
          onSave={(v) => onChange({ ...item, features: v })}
          placeholder="Ej. Incluye consulta gratis"
        />
      </div>
    </div>
  );
}

// ─── Preview visual del item dentro del sheet ────────────────────────────────

function ItemPreview({ item, cfg }: { item: CatalogoItem; cfg: TipoConfig }) {
  const Icon = cfg.icon;
  return (
    <div>
      <p className="mb-1.5 text-[9px] font-bold uppercase tracking-[0.22em] text-white/30">
        Vista previa
      </p>
      <div className="flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3">
        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-white/[0.06] bg-black/20">
          {item.imagen ? (
            <img src={item.imagen} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-white/20">
              <Icon className="h-4 w-4" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="truncate text-[13px] font-bold text-white">
            {item.titulo.trim() || `Nuevo ${cfg.singular.toLowerCase()}`}
          </p>
          <div className="mt-0.5 flex items-center gap-2 text-[11px] text-white/35">
            {item.precio && <span>{item.precio}</span>}
            {item.categoria && (
              <>
                {item.precio && <span className="text-white/20">·</span>}
                <span className="truncate">{item.categoria}</span>
              </>
            )}
            {!item.precio && !item.categoria && <span>Sin detalles</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
