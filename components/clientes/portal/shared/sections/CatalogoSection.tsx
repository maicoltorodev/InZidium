"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BriefcaseBusiness, ShoppingBag, UtensilsCrossed,
  Plus, Image as ImageIcon, Trash2, Loader2, X, Tag,
} from "lucide-react";
import { uploadProjectFile } from "@/lib/client/upload-archivo";
import { labelCls } from "../../styles";
import { newItem, type CatalogoItem, type TipoCatalogo } from "../../types";
import { StringArrayField } from "../../fields";
import { FieldItem } from "../primitives/FieldItem";
import { BottomSheet } from "../primitives/BottomSheet";
import { ToggleRow } from "../primitives/ToggleRow";
import { MOTION } from "../primitives/motion";
import { BRAND_ICON_STYLE } from "../primitives/BrandDefs";

const TIPO_CONFIG = {
  servicios: { singular: "Servicio",  plural: "Servicios",  icon: BriefcaseBusiness, add: "Agregar servicio" },
  productos: { singular: "Producto",  plural: "Productos",  icon: ShoppingBag,       add: "Agregar producto" },
  menu:      { singular: "Platillo",  plural: "Menú",       icon: UtensilsCrossed,   add: "Agregar platillo" },
} as const;

export function CatalogoSection({
  d,
  savePatch,
  projectId,
  showToast,
}: {
  d: any;
  savePatch: (patch: any) => void;
  projectId: string;
  showToast: (msg: string, type: "success" | "error") => void;
}) {
  const tipo: TipoCatalogo = d.tipoCatalogo || "servicios";
  const categorias: string[] = d.categorias || [];
  const catalogo: CatalogoItem[] = d.catalogo || [];
  const cfg = TIPO_CONFIG[tipo];

  const [editingId, setEditingId] = useState<string | null>(null);
  const [newCat, setNewCat] = useState("");
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

  const addCategory = () => {
    const cat = newCat.trim();
    if (!cat || categorias.includes(cat)) return;
    savePatch({ categorias: [...categorias, cat] });
    setNewCat("");
  };

  const removeCategory = (cat: string) =>
    savePatch({ categorias: categorias.filter((c) => c !== cat) });

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

  return (
    <>
      {/* Categorías */}
      <FieldItem>
        <label className={labelCls}>
          Categorías <span className="normal-case tracking-normal font-normal text-white/20">— opcional</span>
        </label>
        {categorias.length > 0 && (
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
        )}
        <div className="flex gap-2">
          <input
            value={newCat}
            onChange={(e) => setNewCat(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addCategory()}
            placeholder="Nueva categoría…"
            className="flex-1 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/20 focus:border-[#a855f7]/40 transition-colors"
          />
          <button
            type="button"
            onClick={addCategory}
            disabled={!newCat.trim()}
            aria-label="Agregar categoría"
            className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 text-white/50 disabled:opacity-30 hover:bg-white/[0.06] transition-colors"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </FieldItem>

      {/* Lista */}
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
              className="mt-1 flex items-center gap-1.5 rounded-full bg-[linear-gradient(135deg,#e879f9_0%,#a855f7_50%,#60a5fa_100%)] px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-[0_0_24px_-6px_rgba(168,85,247,0.7)] transition-transform active:scale-95"
            >
              <Plus className="h-3.5 w-3.5" strokeWidth={3} />
              {cfg.add}
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {catalogo.map((item) => (
              <motion.button
                key={item.id}
                type="button"
                onClick={() => setEditingId(item.id)}
                whileTap={{ scale: 0.98 }}
                transition={MOTION.tap}
                className="flex w-full items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3 text-left transition-colors active:bg-white/[0.04]"
              >
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-white/[0.06] bg-black/20">
                  {item.imagen ? (
                    <img src={item.imagen} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-white/20">
                      <ImageIcon className="h-4 w-4" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-[13px] font-bold text-white">
                    {item.titulo || `Nuevo ${cfg.singular.toLowerCase()}`}
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
              </motion.button>
            ))}
          </div>
        )}

        {/* FAB (solo si ya hay items) */}
        {catalogo.length > 0 && (
          <button
            type="button"
            onClick={createItem}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-[#a855f7]/30 bg-[linear-gradient(135deg,rgba(232,121,249,0.08)_0%,rgba(168,85,247,0.08)_50%,rgba(96,165,250,0.08)_100%)] py-3 text-[11px] font-black uppercase tracking-[0.22em] transition-colors hover:border-[#a855f7]/50 [&>span]:bg-[linear-gradient(90deg,#e879f9_0%,#a855f7_50%,#60a5fa_100%)] [&>span]:bg-clip-text [&>span]:text-transparent"
          >
            <Plus className="h-4 w-4" strokeWidth={3} style={BRAND_ICON_STYLE} />
            <span>{cfg.add}</span>
          </button>
        )}
      </FieldItem>

      {/* BottomSheet edición */}
      <BottomSheet
        open={!!editing}
        onClose={() => setEditingId(null)}
        title={`Editar ${cfg.singular.toLowerCase()}`}
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
            cfgSingular={cfg.singular}
            uploadingImg={uploadingImg}
            onChange={setItem}
            onUploadImage={handleItemImage}
          />
        )}
      </BottomSheet>
    </>
  );
}

// ─── Form dentro del sheet ───────────────────────────────────────────────────

function ItemForm({
  item,
  categorias,
  cfgSingular,
  uploadingImg,
  onChange,
  onUploadImage,
}: {
  item: CatalogoItem;
  categorias: string[];
  cfgSingular: string;
  uploadingImg: boolean;
  onChange: (updated: CatalogoItem) => void;
  onUploadImage: (file: File) => void;
}) {
  const fieldCls =
    "w-full rounded-xl border border-white/[0.08] bg-black/20 px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/20 focus:border-[#a855f7]/40 transition-colors";

  // El precio es opcional. Si el item ya tiene precio guardado → toggle ON.
  // Al apagar el toggle se limpia el precio.
  const [precioOn, setPrecioOn] = useState<boolean>(!!item.precio);

  const togglePrecio = (next: boolean) => {
    setPrecioOn(next);
    if (!next && item.precio) onChange({ ...item, precio: "" });
  };

  return (
    <div className="space-y-3">
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

      <input
        value={item.titulo}
        onChange={(e) => onChange({ ...item, titulo: e.target.value })}
        placeholder={`Nombre del ${cfgSingular.toLowerCase()}`}
        className={fieldCls}
      />
      <textarea
        value={item.descripcion}
        onChange={(e) => onChange({ ...item, descripcion: e.target.value })}
        placeholder="Descripción breve"
        rows={3}
        className={`${fieldCls} resize-none`}
      />
      {categorias.length > 0 && (
        <select
          value={item.categoria}
          onChange={(e) => onChange({ ...item, categoria: e.target.value })}
          className={fieldCls}
        >
          <option value="">Sin categoría</option>
          {categorias.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      )}

      {/* Precio (opcional) */}
      <div>
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
              <input
                value={item.precio}
                onChange={(e) => onChange({ ...item, precio: e.target.value })}
                placeholder="Ej. $50.000 / Desde $30k / Consultar"
                className={`${fieldCls} mt-2.5`}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div>
        <label className="mb-1.5 block text-[9px] font-bold uppercase tracking-[0.22em] text-white/30">
          Características
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
