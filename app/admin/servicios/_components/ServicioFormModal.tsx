"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X, ImagePlus, Loader2, Trash2 } from "lucide-react";
import Image from "next/image";
import type { Servicio, ActionResult } from "@/lib/crm/types";
import { uploadFile, deleteFile } from "@/lib/storage/upload.client";

type SubmitInput = {
    name: string;
    slug?: string;
    description: string;
    details: string | null;
    seo_title: string | null;
    seo_description: string | null;
    price: number | null;
    category: string;
    service_type: "normal" | "general";
    image_url: string | null;
};

type Props = {
    open: boolean;
    mode: "create" | "edit";
    servicio?: Servicio;
    onClose: () => void;
    onSubmit: (input: SubmitInput) => Promise<ActionResult<Servicio>>;
    categoriasExistentes: string[];
};

export function ServicioFormModal({
    open,
    mode,
    servicio,
    onClose,
    onSubmit,
    categoriasExistentes,
}: Props) {
    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [originalSlug, setOriginalSlug] = useState("");
    const [description, setDescription] = useState("");
    const [details, setDetails] = useState("");
    const [seoTitle, setSeoTitle] = useState("");
    const [seoDescription, setSeoDescription] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [serviceType, setServiceType] = useState<"normal" | "general">("normal");
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [mounted, setMounted] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => setMounted(true), []);

    useEffect(() => {
        if (!open) return;
        if (mode === "edit" && servicio) {
            setName(servicio.name);
            setSlug(servicio.slug ?? "");
            setOriginalSlug(servicio.slug ?? "");
            setDescription(servicio.description ?? "");
            setDetails(servicio.details ?? "");
            setSeoTitle(servicio.seo_title ?? "");
            setSeoDescription(servicio.seo_description ?? "");
            setPrice(servicio.price !== null ? String(servicio.price) : "");
            setCategory(servicio.category ?? "");
            setServiceType(servicio.service_type ?? "normal");
            setImageUrl(servicio.image_url ?? null);
            setOriginalImageUrl(servicio.image_url ?? null);
        } else {
            setName("");
            setSlug("");
            setOriginalSlug("");
            setDescription("");
            setDetails("");
            setSeoTitle("");
            setSeoDescription("");
            setPrice("");
            setCategory("");
            setServiceType("normal");
            setImageUrl(null);
            setOriginalImageUrl(null);
        }
        setError(null);
    }, [open, mode, servicio]);

    async function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        setError(null);
        const previousCandidate = imageUrl;
        try {
            const res = await uploadFile(file, "service-image");
            if (!res.success) { setError(res.error); return; }
            setImageUrl(res.url);
            // Si había un candidato sin guardar (≠ original DB), bórralo: ya está
            // huérfano. Al original NO lo tocamos hasta que se guarde el form.
            if (previousCandidate && previousCandidate !== originalImageUrl) {
                deleteFile("service-image", previousCandidate).catch(() => {});
            }
        } catch {
            setError("ERROR AL PROCESAR LA IMAGEN.");
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    }

    async function handleRemoveImage() {
        if (!imageUrl) return;
        // Si el imageUrl actual es un candidato sin guardar, bórralo del storage.
        // Si es el original, dejarlo: solo se borra al confirmar el guardado.
        if (imageUrl !== originalImageUrl) {
            deleteFile("service-image", imageUrl).catch(() => {});
        }
        setImageUrl(null);
    }

    function handleClose() {
        // Cancelar = revertir. Si hay un candidato sin guardar, bórralo.
        if (imageUrl && imageUrl !== originalImageUrl) {
            deleteFile("service-image", imageUrl).catch(() => {});
        }
        onClose();
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (submitting) return;
        setError(null);

        const trimmedName = name.trim();
        if (!trimmedName) { setError("EL NOMBRE ES OBLIGATORIO."); return; }

        const parsedPrice =
            serviceType === "general" || price.trim() === ""
                ? null
                : Number(price.replace(/\./g, "").replace(/,/g, "."));
        if (parsedPrice !== null && (!Number.isFinite(parsedPrice) || parsedPrice < 0)) {
            setError("EL PRECIO DEBE SER UN NÚMERO VÁLIDO.");
            return;
        }

        const trimmedSlug = slug.trim();
        const slugChanged = mode === "edit" && trimmedSlug && trimmedSlug !== originalSlug;
        if (slugChanged) {
            const ok = window.confirm(
                `Vas a cambiar el slug de "${originalSlug}" a "${trimmedSlug}". La URL antigua redirigirá automáticamente (301) a la nueva.\n\n¿Confirmas?`,
            );
            if (!ok) return;
        }

        setSubmitting(true);
        const res = await onSubmit({
            name: trimmedName,
            ...(slugChanged ? { slug: trimmedSlug } : {}),
            description: description.trim(),
            details: details.trim() || null,
            seo_title: seoTitle.trim() || null,
            seo_description: seoDescription.trim() || null,
            price: parsedPrice,
            category: category.trim(),
            service_type: serviceType,
            image_url: imageUrl,
        });
        setSubmitting(false);

        if ("error" in res) { setError(res.error); return; }

        // Guardado OK: si la imagen cambió, ahora sí podemos borrar la original
        // del storage (ya no la referencia ningún registro de DB).
        if (originalImageUrl && originalImageUrl !== imageUrl) {
            deleteFile("service-image", originalImageUrl).catch(() => {});
        }

        onClose();
    }

    if (!mounted) return null;

    return createPortal(
        <AnimatePresence>
            {open && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-md"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/[0.08] bg-[#080808] shadow-2xl"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-white/[0.06] px-8 py-6">
                            <h2 className="text-xl font-black tracking-tight text-white">
                                {mode === "create" ? "Nuevo servicio" : "Editar servicio"}
                            </h2>
                            <button
                                onClick={handleClose}
                                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.03] text-gray-400 transition hover:border-white/[0.12] hover:text-white"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5 px-8 py-6">
                            {/* Tipo */}
                            <div>
                                <span className="mb-2 block text-xs font-black uppercase tracking-[0.2em] text-gray-400">
                                    Tipo
                                </span>
                                <div className="flex rounded-xl border border-white/[0.06] bg-white/[0.02] p-1">
                                    {(["normal", "general"] as const).map((t) => (
                                        <button
                                            key={t}
                                            type="button"
                                            onClick={() => setServiceType(t)}
                                            className={`flex-1 rounded-lg px-4 py-2 text-xs font-black uppercase tracking-widest transition-all duration-150 ${
                                                serviceType === t
                                                    ? "bg-[#FFD700] text-black shadow"
                                                    : "text-gray-500 hover:text-gray-300"
                                            }`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                                <p className="mt-2 text-xs text-gray-600">
                                    {serviceType === "normal"
                                        ? "Precio directo. Ej: Globos $850/u, DTF UV $180.000."
                                        : "Sin precio — tiene variantes con sus propios precios. Ej: Tarjetas (brillante, mate, metalizada…)."}
                                </p>
                            </div>

                            {/* Imagen */}
                            <div>
                                <span className="mb-2 block text-xs font-black uppercase tracking-[0.2em] text-gray-400">
                                    Imagen
                                </span>
                                {imageUrl ? (
                                    <div className="group relative overflow-hidden rounded-xl border border-white/[0.06]">
                                        <div className="relative aspect-[16/9] w-full">
                                            <Image
                                                src={imageUrl}
                                                alt="Imagen del servicio"
                                                fill
                                                className="object-cover"
                                                sizes="480px"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleRemoveImage}
                                            className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-lg bg-black/60 text-gray-300 opacity-0 transition-all group-hover:opacity-100 hover:bg-red-500/80 hover:text-white"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="absolute bottom-2 right-2 flex items-center gap-1.5 rounded-lg bg-black/60 px-2.5 py-1.5 text-[10px] font-black uppercase tracking-widest text-gray-300 opacity-0 transition-all group-hover:opacity-100 hover:text-white"
                                        >
                                            <ImagePlus className="h-3 w-3" />
                                            Cambiar
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={uploading}
                                        className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/[0.1] bg-white/[0.02] py-8 text-gray-600 transition hover:border-[#FFD700]/30 hover:bg-white/[0.03] hover:text-gray-400 disabled:opacity-50"
                                    >
                                        {uploading ? (
                                            <>
                                                <Loader2 className="h-5 w-5 animate-spin text-[#FFD700]" />
                                                <span className="text-xs font-bold uppercase tracking-widest text-[#FFD700]">
                                                    Subiendo…
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                <ImagePlus className="h-5 w-5" />
                                                <span className="text-xs font-bold uppercase tracking-widest">
                                                    Subir imagen
                                                </span>
                                                <span className="text-[10px]">JPG, PNG, WEBP · Máx 5 MB</span>
                                            </>
                                        )}
                                    </button>
                                )}
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    onChange={handleImageSelect}
                                    className="hidden"
                                />
                            </div>

                            <Field label="Nombre">
                                <input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Ej: Tarjetas de presentación"
                                    className="w-full rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:border-[#FFD700]/40 focus:outline-none"
                                    autoFocus
                                />
                            </Field>

                            <Field label="Descripción" hint="Lo que el bot va a contar al cliente">
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={3}
                                    placeholder="Material, medidas, detalles relevantes…"
                                    className="w-full resize-none rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:border-[#FFD700]/40 focus:outline-none"
                                />
                            </Field>

                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                {serviceType === "normal" && (
                                    <Field label="Precio (COP)" hint="Deja vacío si varía">
                                        <input
                                            value={price}
                                            onChange={(e) =>
                                                setPrice(e.target.value.replace(/[^0-9.,]/g, ""))
                                            }
                                            placeholder="85000"
                                            inputMode="decimal"
                                            className="w-full rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:border-[#FFD700]/40 focus:outline-none"
                                        />
                                    </Field>
                                )}
                                <Field label="Categoría">
                                    <input
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        placeholder="Ej: Impresión Digital"
                                        list="servicio-categorias"
                                        className="w-full rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:border-[#FFD700]/40 focus:outline-none"
                                    />
                                    <datalist id="servicio-categorias">
                                        {categoriasExistentes.map((c) => (
                                            <option key={c} value={c} />
                                        ))}
                                    </datalist>
                                </Field>
                            </div>

                            <details className="group/seo rounded-xl border border-white/[0.06] bg-white/[0.02]">
                                <summary className="cursor-pointer list-none flex items-center justify-between px-4 py-3">
                                    <span className="text-xs font-black uppercase tracking-[0.2em] text-[#FFD700]">
                                        Avanzado · SEO
                                    </span>
                                    <span className="text-gray-500 text-xs transition-transform group-open/seo:rotate-180">▾</span>
                                </summary>
                                <div className="space-y-5 px-4 pb-5 pt-2 border-t border-white/[0.04]">
                                    {mode === "edit" && (
                                        <Field
                                            label="Slug (URL)"
                                            hint="Cambiar genera redirect 301 desde el viejo"
                                        >
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-gray-600 shrink-0">/servicios/</span>
                                                <input
                                                    value={slug}
                                                    onChange={(e) => setSlug(e.target.value)}
                                                    placeholder="ejemplo-de-slug"
                                                    className="w-full rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:border-[#FFD700]/40 focus:outline-none font-mono"
                                                />
                                            </div>
                                        </Field>
                                    )}

                                    <Field
                                        label="Detalles (Markdown)"
                                        hint="Contenido largo de la página · 300-1500 palabras ideal"
                                    >
                                        <textarea
                                            value={details}
                                            onChange={(e) => setDetails(e.target.value)}
                                            rows={10}
                                            placeholder={`## Por qué nuestras tarjetas\n\nMaterial premium, acabados UV, **entrega 48h**.\n\n### Materiales disponibles\n- Propalcote 300g\n- Kimberly texturizado\n- ...\n\n## Casos de uso\n...`}
                                            className="w-full resize-y rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:border-[#FFD700]/40 focus:outline-none font-mono"
                                        />
                                    </Field>

                                    <Field
                                        label="Título SEO"
                                        hint="Override del title para Google (60 chars máx)"
                                    >
                                        <input
                                            value={seoTitle}
                                            onChange={(e) => setSeoTitle(e.target.value)}
                                            placeholder={`${name || 'Servicio'} en Bogotá | InZidium`}
                                            maxLength={70}
                                            className="w-full rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:border-[#FFD700]/40 focus:outline-none"
                                        />
                                    </Field>

                                    <Field
                                        label="Descripción SEO"
                                        hint="Override del meta description (155 chars máx)"
                                    >
                                        <textarea
                                            value={seoDescription}
                                            onChange={(e) => setSeoDescription(e.target.value)}
                                            rows={2}
                                            maxLength={170}
                                            placeholder="Descripción optimizada para resultados de búsqueda. Incluye keywords y CTA."
                                            className="w-full resize-none rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:border-[#FFD700]/40 focus:outline-none"
                                        />
                                    </Field>
                                </div>
                            </details>

                            {error && (
                                <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3">
                                    <p className="text-xs font-bold uppercase tracking-widest text-red-400">
                                        {error}
                                    </p>
                                </div>
                            )}

                            <div className="flex items-center justify-end gap-3 border-t border-white/[0.06] pt-5">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    disabled={submitting}
                                    className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-gray-400 transition hover:text-white disabled:opacity-50"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting || uploading}
                                    className="rounded-xl bg-[#FFD700] px-6 py-2.5 text-xs font-black uppercase tracking-widest text-black transition hover:bg-[#FFD700]/90 disabled:opacity-50"
                                >
                                    {submitting
                                        ? "Guardando…"
                                        : mode === "create"
                                            ? "Crear servicio"
                                            : "Guardar cambios"}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body,
    );
}

function Field({
    label,
    hint,
    children,
}: {
    label: string;
    hint?: string;
    children: React.ReactNode;
}) {
    return (
        <label className="block">
            <div className="mb-2 flex items-baseline justify-between">
                <span className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">
                    {label}
                </span>
                {hint && (
                    <span className="text-xs font-medium text-gray-600">{hint}</span>
                )}
            </div>
            {children}
        </label>
    );
}
