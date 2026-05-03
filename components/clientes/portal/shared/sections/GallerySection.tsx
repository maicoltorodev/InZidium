"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Images,
  Plus,
  Loader2,
  Trash2,
  Image as ImageIcon,
} from "lucide-react";
import { uploadProjectFile } from "@/lib/client/upload-archivo";
import { deleteArchivoByUrl } from "@/lib/alliance/actions";
import { labelCls } from "../../styles";
import {
  newGalleryImage,
  GALLERY_MAX_IMAGES,
  type GalleryImage,
} from "../../types";
import { AutoField, AutoTextarea } from "../../fields";
import { FieldItem } from "../primitives/FieldItem";
import { BottomSheet } from "../primitives/BottomSheet";
import { MOTION } from "../primitives/motion";
import { BRAND_ICON_STYLE } from "../primitives/BrandDefs";

/**
 * Sección "Galería" del portal del cliente.
 *
 * Solo se muestra en el hub si `d.galleryEnabled === true` (toggle en
 * AjustesAvanzados). El cliente puede subir hasta `GALLERY_MAX_IMAGES`
 * fotos, cada una con `alt` (accesibilidad / SEO) y `caption` opcional.
 *
 * Comportamiento al apagar el toggle: las imágenes NO se borran del Storage
 * — el sanitizer del schema y el adapter de la plantilla pública conservan
 * `galleryImages` aunque `galleryEnabled` esté en false. Si el cliente
 * reactiva el toggle, todo vuelve.
 */
export function GallerySection({
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
  const images: GalleryImage[] = Array.isArray(d.galleryImages)
    ? d.galleryImages
    : [];
  const reachedCap = images.length >= GALLERY_MAX_IMAGES;

  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const editing = images.find((i) => i.id === editingId) ?? null;

  const setImage = (updated: GalleryImage) =>
    savePatch({
      galleryImages: images.map((i) => (i.id === updated.id ? updated : i)),
    });

  const removeImage = (id: string) => {
    const target = images.find((i) => i.id === id);
    savePatch({ galleryImages: images.filter((i) => i.id !== id) });
    setEditingId(null);
    // Storage cleanup en background — si falla, log pero no bloqueamos la UX:
    // la imagen ya se removió del array, lo peor es un blob huérfano.
    if (target?.src) {
      void deleteArchivoByUrl(target.src).catch(() => {});
    }
  };

  const handleNewImage = async (file: File) => {
    if (reachedCap) {
      showToast(
        `Máximo ${GALLERY_MAX_IMAGES} imágenes — borra alguna antes de agregar otra.`,
        "error",
      );
      return;
    }
    setUploading(true);
    try {
      const result = await uploadProjectFile({
        file,
        proyectoId: projectId,
        subidoPor: "cliente",
      });
      if (result.success && result.url) {
        const item: GalleryImage = { ...newGalleryImage(), src: result.url };
        savePatch({ galleryImages: [...images, item] });
        // Abrir editor inmediatamente para que el cliente llene `alt`.
        setEditingId(item.id);
      } else {
        showToast(result.error || "Error al subir la imagen", "error");
      }
    } catch {
      showToast("Error al subir la imagen", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleReplaceImage = async (file: File) => {
    if (!editing) return;
    setUploading(true);
    try {
      const result = await uploadProjectFile({
        file,
        proyectoId: projectId,
        subidoPor: "cliente",
        oldUrl: editing.src,
      });
      if (result.success && result.url) {
        setImage({ ...editing, src: result.url });
      } else {
        showToast(result.error || "Error al subir la imagen", "error");
      }
    } catch {
      showToast("Error al subir la imagen", "error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <FieldItem>
        <div className="mb-3 flex items-center justify-between">
          <label className={`${labelCls} mb-0`}>
            Imágenes{" "}
            <span className="normal-case tracking-normal font-normal text-white/20">
              ({images.length} / {GALLERY_MAX_IMAGES})
            </span>
          </label>
        </div>

        {images.length === 0 ? (
          <EmptyState uploading={uploading} onUpload={handleNewImage} />
        ) : (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {images.map((img) => (
              <GalleryCard
                key={img.id}
                image={img}
                onClick={() => setEditingId(img.id)}
              />
            ))}
            {!reachedCap && (
              <AddImageTile uploading={uploading} onUpload={handleNewImage} />
            )}
          </div>
        )}

        {reachedCap && (
          <p className="mt-3 text-center text-[11px] text-white/30">
            Alcanzaste el máximo de {GALLERY_MAX_IMAGES} imágenes. Borra alguna
            si quieres agregar otra.
          </p>
        )}
      </FieldItem>

      {/* Título y descripción de la sección — opcionales. Si vacíos, la
          plantilla pública usa "Galería" / sin descripción. */}
      <FieldItem>
        <label className={labelCls}>
          Título de la sección{" "}
          <span className="normal-case tracking-normal font-normal text-white/20">
            — opcional
          </span>
        </label>
        <p className="mb-2 text-[11px] text-white/25">
          Si lo dejas vacío, se muestra como &quot;Galería&quot; en tu sitio.
        </p>
        <AutoField
          value={d.galleryTitle}
          onSave={(v) => savePatch({ galleryTitle: v })}
          placeholder="Ej. Nuestro Local · Momentos · Detrás de cámaras"
        />
      </FieldItem>

      <FieldItem>
        <label className={labelCls}>
          Descripción{" "}
          <span className="normal-case tracking-normal font-normal text-white/20">
            — opcional
          </span>
        </label>
        <AutoTextarea
          value={d.galleryDescription ?? ""}
          onSave={(v) => savePatch({ galleryDescription: v })}
          placeholder="Una línea corta sobre qué van a ver en estas fotos."
          rows={2}
        />
      </FieldItem>

      {/* Editor de imagen individual — alt, caption, reemplazar foto, eliminar.
          Mismo BottomSheet en desktop/tablet/mobile porque el formulario es
          chico y se ve consistente. */}
      <BottomSheet
        open={!!editing}
        onClose={() => setEditingId(null)}
        title={editing ? "Editar imagen" : ""}
        footer={
          editing ? (
            <button
              type="button"
              onClick={() => removeImage(editing.id)}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/[0.06] py-3 text-[11px] font-black uppercase tracking-[0.2em] text-red-400 transition-colors hover:bg-red-500/10"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Eliminar imagen
            </button>
          ) : undefined
        }
      >
        {editing && (
          <ImageForm
            image={editing}
            uploading={uploading}
            onChange={setImage}
            onReplace={handleReplaceImage}
          />
        )}
      </BottomSheet>
    </>
  );
}

// ─── Empty state ─────────────────────────────────────────────────────────────

function EmptyState({
  uploading,
  onUpload,
}: {
  uploading: boolean;
  onUpload: (file: File) => void;
}) {
  return (
    <div className="relative flex flex-col items-center gap-3 rounded-2xl border border-dashed border-white/[0.07] py-12 text-white/25">
      <Images className="h-7 w-7" />
      <p className="text-[11px] uppercase tracking-widest">
        Aún no has subido fotos
      </p>
      <label
        className={`mt-1 flex cursor-pointer items-center gap-1.5 rounded-full bg-[linear-gradient(135deg,#e879f9_0%,#a855f7_50%,#22d3ee_100%)] px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-[0_0_24px_-6px_rgba(168,85,247,0.7)] transition-transform active:scale-95 ${
          uploading ? "pointer-events-none opacity-70" : ""
        }`}
      >
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])}
          disabled={uploading}
        />
        {uploading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Plus className="h-3.5 w-3.5" strokeWidth={3} />
        )}
        {uploading ? "Subiendo…" : "Subir primera foto"}
      </label>
    </div>
  );
}

// ─── Card de imagen ──────────────────────────────────────────────────────────

function GalleryCard({
  image,
  onClick,
}: {
  image: GalleryImage;
  onClick: () => void;
}) {
  const needsAlt = !image.alt.trim();
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
      transition={MOTION.tap}
      className="group relative aspect-square overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] transition-colors hover:border-[#a855f7]/30"
    >
      {image.src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image.src}
          alt={image.alt || ""}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
      ) : (
        <div className="flex h-full items-center justify-center text-white/25">
          <ImageIcon className="h-6 w-6" />
        </div>
      )}
      {needsAlt && (
        <div className="absolute left-2 top-2 rounded-full border border-amber-400/30 bg-amber-500/20 px-2 py-0.5 text-[8px] font-black uppercase tracking-[0.18em] text-amber-200 shadow-lg backdrop-blur-sm">
          Sin descripción
        </div>
      )}
      {image.caption && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2.5 pt-6">
          <p className="line-clamp-2 text-[10px] leading-tight text-white/85">
            {image.caption}
          </p>
        </div>
      )}
    </motion.button>
  );
}

// ─── Botón "Agregar" como una tile más en el grid ────────────────────────────

function AddImageTile({
  uploading,
  onUpload,
}: {
  uploading: boolean;
  onUpload: (file: File) => void;
}) {
  return (
    <label
      className={`relative flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-white/[0.1] bg-white/[0.015] text-white/40 transition-colors hover:border-[#a855f7]/40 hover:text-white/70 ${
        uploading ? "pointer-events-none opacity-60" : ""
      }`}
    >
      <input
        type="file"
        accept="image/*"
        className="absolute inset-0 cursor-pointer opacity-0"
        onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])}
        disabled={uploading}
      />
      {uploading ? (
        <Loader2 className="h-5 w-5 animate-spin" style={BRAND_ICON_STYLE} />
      ) : (
        <Plus className="h-5 w-5" strokeWidth={2.5} style={BRAND_ICON_STYLE} />
      )}
      <span className="text-[10px] font-black uppercase tracking-[0.22em]">
        {uploading ? "Subiendo…" : "Agregar"}
      </span>
    </label>
  );
}

// ─── Form dentro del BottomSheet ─────────────────────────────────────────────

function ImageForm({
  image,
  uploading,
  onChange,
  onReplace,
}: {
  image: GalleryImage;
  uploading: boolean;
  onChange: (updated: GalleryImage) => void;
  onReplace: (file: File) => void;
}) {
  const fieldCls =
    "w-full rounded-xl border border-white/[0.08] bg-black/20 px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/20 focus:border-[#a855f7]/40 transition-colors";
  const subLabelCls =
    "mb-1.5 block text-[9px] font-bold uppercase tracking-[0.22em] text-white/30";

  return (
    <div className="space-y-4">
      {/* Preview con opción de reemplazar la imagen */}
      <div>
        <label className={subLabelCls}>Imagen</label>
        <div className="relative h-44 w-full overflow-hidden rounded-xl border border-white/[0.08] bg-black/20">
          {image.src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image.src}
              alt={image.alt || ""}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-white/25">
              <ImageIcon className="h-6 w-6" />
            </div>
          )}
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/55 backdrop-blur-sm">
              <Loader2 className="h-5 w-5 animate-spin text-[#a855f7]" />
            </div>
          )}
        </div>
        <label
          className={`mt-2 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] py-2 text-[10px] font-black uppercase tracking-[0.22em] text-white/65 transition-colors hover:bg-white/[0.06] ${
            uploading ? "pointer-events-none opacity-50" : ""
          }`}
        >
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) =>
              e.target.files?.[0] && onReplace(e.target.files[0])
            }
            disabled={uploading}
          />
          Reemplazar imagen
        </label>
      </div>

      {/* Alt — recomendado para SEO + accesibilidad */}
      <div>
        <label className={subLabelCls}>
          Descripción de la imagen{" "}
          <span className="normal-case tracking-normal font-normal text-white/25">
            — recomendado
          </span>
        </label>
        <p className="-mt-0.5 mb-2 text-[10px] leading-snug text-white/30">
          Describe qué se ve en la foto. Lo usan Google y los lectores de
          pantalla. Ej: &quot;Vista frontal del local&quot;, &quot;Plato de
          ceviche con limón&quot;.
        </p>
        <AutoField
          value={image.alt}
          onSave={(v) => onChange({ ...image, alt: v })}
          placeholder="Ej. Vista frontal del local"
          className={fieldCls}
          autoFocus
        />
      </div>

      {/* Caption — texto que aparece sobre la imagen al verla en grande */}
      <div>
        <label className={subLabelCls}>
          Texto que aparece al verla en grande{" "}
          <span className="normal-case tracking-normal font-normal text-white/25">
            — opcional
          </span>
        </label>
        <AutoTextarea
          value={image.caption ?? ""}
          onSave={(v) => onChange({ ...image, caption: v })}
          placeholder="Ej. Capacidad para 40 personas. Reservas con 24h de anticipación."
          rows={2}
          className={`${fieldCls} resize-none`}
        />
      </div>
    </div>
  );
}
