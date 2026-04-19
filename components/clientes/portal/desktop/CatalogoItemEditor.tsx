"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    Trash2,
    Plus,
    Loader2,
    Image as ImageIcon,
    Check,
    Tag,
} from "lucide-react";
import { uploadProjectFile } from "@/lib/client/upload-archivo";
import { StringArrayField } from "../fields";
import { ToggleRow } from "../shared/primitives/ToggleRow";
import { MOTION } from "../shared/primitives/motion";
import type { CatalogoItem } from "../types";

// Los 3 tipos de catálogo comparten shape. Definimos localmente el subset
// que necesita este editor — así no depende de la estructura exacta de
// CatalogoSection.
export type TipoEditorConfig = {
    singular: string;
    plural: string;
    icon: React.ElementType;
    placeholders: { titulo: string; descripcion: string; precio: string };
};

export type PreviewTheme = {
    primary: string;
    accent: string;
    bg: string;
    text: string;
    textMuted: string;
};

/**
 * Editor de item del catálogo para desktop: modal centrado 2 columnas con
 * preview fiel al card del sitio. Reemplaza al BottomSheet en desktop porque
 * ese patrón viene de mobile y se siente raro en pantalla grande.
 */
export function CatalogoItemEditor({
    item,
    cfg,
    categorias,
    projectId,
    theme,
    onChange,
    onClose,
    onRemove,
    onAddCategory,
    showToast,
}: {
    item: CatalogoItem;
    cfg: TipoEditorConfig;
    categorias: string[];
    projectId: string;
    theme: PreviewTheme;
    onChange: (updated: CatalogoItem) => void;
    onClose: () => void;
    onRemove: () => void;
    onAddCategory: (raw: string) => string | null;
    showToast: (msg: string, type: "success" | "error") => void;
}) {
    const [uploadingImg, setUploadingImg] = useState(false);
    const [precioOn, setPrecioOn] = useState<boolean>(!!item.precio);
    const [showNewCat, setShowNewCat] = useState(false);
    const [newCat, setNewCat] = useState("");

    // ESC cierra el modal.
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [onClose]);

    const togglePrecio = (next: boolean) => {
        setPrecioOn(next);
        if (!next && item.precio) onChange({ ...item, precio: "" });
    };

    const handleImage = async (file: File) => {
        setUploadingImg(true);
        try {
            const result = await uploadProjectFile({
                file,
                proyectoId: projectId,
                subidoPor: "cliente",
                oldUrl: item.imagen,
            });
            if (result.success && result.url) {
                onChange({ ...item, imagen: result.url });
            } else {
                showToast(result.error || "Error al subir la imagen", "error");
            }
        } catch {
            showToast("Error al subir la imagen", "error");
        } finally {
            setUploadingImg(false);
        }
    };

    const handleAddCategory = () => {
        const added = onAddCategory(newCat);
        if (added) {
            onChange({ ...item, categoria: added });
            setNewCat("");
            setShowNewCat(false);
        }
    };

    const title = item.titulo.trim()
        ? `Editar ${cfg.singular.toLowerCase()}`
        : `Agregar ${cfg.singular.toLowerCase()}`;

    const fieldCls =
        "w-full rounded-xl border border-white/[0.08] bg-black/30 px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/20 focus:border-[#a855f7]/40 transition-colors";
    const groupLabel =
        "mb-3 block text-[9px] font-black uppercase tracking-[0.26em] text-white/35";

    return (
        <AnimatePresence>
            <motion.div
                key="catalogo-editor-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="fixed inset-0 z-[80] bg-black/75 backdrop-blur-md"
                onClick={onClose}
                aria-hidden
            />
            <motion.div
                key="catalogo-editor-modal"
                initial={{ opacity: 0, scale: 0.96, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: 6 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                role="dialog"
                aria-modal="true"
                aria-label={title}
                className="fixed left-1/2 top-1/2 z-[90] flex w-[min(1100px,92vw)] max-h-[88vh] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-[2rem] border border-white/[0.08] bg-[#0d0820] shadow-[0_0_60px_-10px_rgba(168,85,247,0.5)]"
            >
                {/* Header */}
                <header className="flex shrink-0 items-center justify-between border-b border-white/[0.06] px-6 py-4">
                    <h2 className="text-[13px] font-black uppercase tracking-[0.24em] text-white">
                        {title}
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Cerrar"
                        className="flex h-9 w-9 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/5 hover:text-white"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </header>

                {/* Body 2-col */}
                <div className="grid flex-1 grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] overflow-hidden">
                    {/* Form */}
                    <div className="space-y-7 overflow-y-auto border-r border-white/[0.05] px-6 py-6">
                        {/* Básicos */}
                        <section>
                            <p className={groupLabel}>Básicos</p>
                            <div className="space-y-3">
                                <input
                                    autoFocus
                                    value={item.titulo}
                                    onChange={(e) =>
                                        onChange({
                                            ...item,
                                            titulo: e.target.value,
                                        })
                                    }
                                    placeholder={cfg.placeholders.titulo}
                                    className={fieldCls}
                                />
                                <textarea
                                    value={item.descripcion}
                                    onChange={(e) =>
                                        onChange({
                                            ...item,
                                            descripcion: e.target.value,
                                        })
                                    }
                                    placeholder={cfg.placeholders.descripcion}
                                    rows={4}
                                    className={`${fieldCls} resize-none`}
                                />
                            </div>
                        </section>

                        {/* Imagen */}
                        <section>
                            <p className={groupLabel}>Imagen</p>
                            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-dashed border-white/[0.12] bg-black/30 transition-colors hover:border-[#a855f7]/30">
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="absolute inset-0 z-10 cursor-pointer opacity-0"
                                    onChange={(e) =>
                                        e.target.files?.[0] &&
                                        handleImage(e.target.files[0])
                                    }
                                    disabled={uploadingImg}
                                />
                                {uploadingImg ? (
                                    <div className="flex h-full items-center justify-center">
                                        <Loader2 className="h-6 w-6 animate-spin text-[#a855f7]" />
                                    </div>
                                ) : item.imagen ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={item.imagen}
                                        alt=""
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full flex-col items-center justify-center gap-2 text-white/30">
                                        <ImageIcon className="h-6 w-6" />
                                        <span className="text-[11px] uppercase tracking-widest">
                                            Subir imagen
                                        </span>
                                        <span className="text-[10px] text-white/20">
                                            Proporción recomendada 4:3
                                        </span>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Organización */}
                        <section>
                            <p className={groupLabel}>Organización</p>
                            <div className="space-y-5">
                                {/* Categoría */}
                                <div>
                                    <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">
                                        Categoría{" "}
                                        <span className="font-normal normal-case tracking-normal text-white/25">
                                            — opcional
                                        </span>
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        <CatChip
                                            active={!item.categoria}
                                            onClick={() =>
                                                onChange({
                                                    ...item,
                                                    categoria: "",
                                                })
                                            }
                                        >
                                            Sin categoría
                                        </CatChip>
                                        {categorias.map((c) => (
                                            <CatChip
                                                key={c}
                                                active={item.categoria === c}
                                                onClick={() =>
                                                    onChange({
                                                        ...item,
                                                        categoria: c,
                                                    })
                                                }
                                            >
                                                {c}
                                            </CatChip>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowNewCat((v) => !v)
                                            }
                                            className="flex items-center gap-1.5 rounded-full border border-dashed border-white/20 bg-white/[0.02] px-3 py-1.5 text-[11px] text-white/50 transition-colors hover:border-[#a855f7]/40 hover:text-white/80"
                                        >
                                            <Plus
                                                className="h-3 w-3"
                                                strokeWidth={3}
                                            />
                                            Nueva
                                        </button>
                                    </div>
                                    <AnimatePresence initial={false}>
                                        {showNewCat && (
                                            <motion.div
                                                initial={{
                                                    opacity: 0,
                                                    height: 0,
                                                }}
                                                animate={{
                                                    opacity: 1,
                                                    height: "auto",
                                                }}
                                                exit={{
                                                    opacity: 0,
                                                    height: 0,
                                                }}
                                                transition={MOTION.reveal}
                                                className="overflow-hidden"
                                            >
                                                <div className="flex gap-2 pt-2.5">
                                                    <input
                                                        value={newCat}
                                                        onChange={(e) =>
                                                            setNewCat(
                                                                e.target.value,
                                                            )
                                                        }
                                                        onKeyDown={(e) => {
                                                            if (
                                                                e.key ===
                                                                "Enter"
                                                            ) {
                                                                e.preventDefault();
                                                                handleAddCategory();
                                                            }
                                                        }}
                                                        placeholder="Nueva categoría…"
                                                        className="flex-1 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/20 focus:border-[#a855f7]/40 transition-colors"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={
                                                            handleAddCategory
                                                        }
                                                        disabled={
                                                            !newCat.trim()
                                                        }
                                                        className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 text-white/50 transition-colors hover:bg-white/[0.06] disabled:opacity-30"
                                                    >
                                                        <Plus className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Precio */}
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
                                                initial={{
                                                    opacity: 0,
                                                    height: 0,
                                                }}
                                                animate={{
                                                    opacity: 1,
                                                    height: "auto",
                                                }}
                                                exit={{
                                                    opacity: 0,
                                                    height: 0,
                                                }}
                                                transition={MOTION.reveal}
                                                className="overflow-hidden"
                                            >
                                                <input
                                                    value={item.precio}
                                                    onChange={(e) =>
                                                        onChange({
                                                            ...item,
                                                            precio:
                                                                e.target.value,
                                                        })
                                                    }
                                                    placeholder={
                                                        cfg.placeholders.precio
                                                    }
                                                    className={`${fieldCls} mt-2.5`}
                                                />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </section>

                        {/* Extras */}
                        <section>
                            <p className={groupLabel}>Extras</p>
                            <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">
                                Características{" "}
                                <span className="font-normal normal-case tracking-normal text-white/25">
                                    — opcional
                                </span>
                            </label>
                            <StringArrayField
                                value={item.features || []}
                                onSave={(v) =>
                                    onChange({ ...item, features: v })
                                }
                                placeholder="Ej. Incluye consulta gratis"
                            />
                        </section>
                    </div>

                    {/* Preview fiel al sitio */}
                    <div className="overflow-y-auto bg-[#060214] px-6 py-6">
                        <p className={groupLabel}>Así se verá en tu sitio</p>
                        <SitePreviewCard
                            item={item}
                            cfg={cfg}
                            theme={theme}
                        />
                        <p className="mt-4 text-[10px] leading-relaxed text-white/25">
                            Preview aproximado con los colores y la tipografía
                            de tu sitio. El layout final puede variar según el
                            dispositivo del visitante.
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <footer className="flex shrink-0 items-center justify-between gap-3 border-t border-white/[0.06] px-6 py-4">
                    <button
                        type="button"
                        onClick={onRemove}
                        className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/[0.04] px-4 py-2.5 text-[11px] font-black uppercase tracking-[0.2em] text-red-400 transition-colors hover:bg-red-500/10"
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                        Eliminar
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-5 py-2.5 text-[11px] font-black uppercase tracking-[0.22em] text-white transition-colors hover:bg-white/[0.06]"
                    >
                        Cerrar
                    </button>
                </footer>
            </motion.div>
        </AnimatePresence>
    );
}

function CatChip({
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
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] transition-colors ${
                active
                    ? "border-[#a855f7]/50 bg-[#a855f7]/10 text-white"
                    : "border-white/10 bg-white/[0.02] text-white/60 hover:text-white/90"
            }`}
        >
            {active && <Check className="h-3 w-3" strokeWidth={3} />}
            {children}
        </button>
    );
}

// Preview fiel al card del sitio (DesktopServicesSection de la plantilla):
// aspect-[4/3], imagen con gradient overlay, categoría pill con gradient
// primary→accent, título + descripción clamped, price + "ver detalle"
// separados por divider.
function SitePreviewCard({
    item,
    cfg,
    theme,
}: {
    item: CatalogoItem;
    cfg: TipoEditorConfig;
    theme: PreviewTheme;
}) {
    const { primary, accent, bg, text, textMuted } = theme;
    const Icon = cfg.icon;

    return (
        <div
            className="overflow-hidden rounded-2xl border"
            style={{ background: bg, borderColor: `${text}1a` }}
        >
            {/* Imagen con overlay y categoría */}
            <div className="relative aspect-[4/3] overflow-hidden">
                {item.imagen ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={item.imagen}
                        alt=""
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div
                        className="flex h-full items-center justify-center"
                        style={{ background: `${primary}18` }}
                    >
                        <Icon className="h-12 w-12" style={{ color: `${primary}99` }} />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                {item.categoria && (
                    <div
                        className="absolute left-4 top-4 rounded-full border border-white/20 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white shadow-lg backdrop-blur-sm"
                        style={{
                            background: `linear-gradient(90deg, ${primary}e6, ${accent}e6)`,
                        }}
                    >
                        {item.categoria}
                    </div>
                )}
            </div>

            {/* Body */}
            <div className="space-y-3 p-5">
                <h3
                    className="text-lg font-bold leading-tight"
                    style={{ color: text }}
                >
                    {item.titulo.trim() || `Nuevo ${cfg.singular.toLowerCase()}`}
                </h3>
                <p
                    className="line-clamp-3 text-[13px] leading-relaxed"
                    style={{ color: textMuted }}
                >
                    {item.descripcion.trim() ||
                        "Tu descripción aparecerá aquí. Se corta a 3 líneas en el grid del sitio."}
                </p>
                <div
                    className="flex items-center justify-between border-t pt-3"
                    style={{ borderColor: `${text}1a` }}
                >
                    {item.precio ? (
                        <div className="flex flex-col">
                            <span
                                className="text-[10px] uppercase tracking-wider"
                                style={{ color: textMuted }}
                            >
                                Precio
                            </span>
                            <span
                                className="text-base font-bold"
                                style={{ color: primary }}
                            >
                                {item.precio}
                            </span>
                        </div>
                    ) : (
                        <span
                            className="text-[10px] uppercase tracking-wider"
                            style={{ color: textMuted }}
                        >
                            Sin precio
                        </span>
                    )}
                    <span
                        className="text-[10px] font-semibold uppercase tracking-[0.22em]"
                        style={{ color: textMuted }}
                    >
                        Ver detalle
                    </span>
                </div>

                {/* Features como chips discretos si hay */}
                {item.features && item.features.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                        {item.features.slice(0, 3).map((f, i) => (
                            <span
                                key={i}
                                className="rounded-full border px-2 py-0.5 text-[10px]"
                                style={{
                                    borderColor: `${primary}40`,
                                    color: textMuted,
                                    background: `${primary}08`,
                                }}
                            >
                                {f}
                            </span>
                        ))}
                        {item.features.length > 3 && (
                            <span
                                className="text-[10px]"
                                style={{ color: textMuted }}
                            >
                                +{item.features.length - 3} más
                            </span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
