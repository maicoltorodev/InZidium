"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { Package, Plus, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Servicio, ServiceVariant } from "@/lib/crm/types";
import {
    createServicio,
    deleteServicio,
    listServicios,
    updateServicio,
    toggleServicioActive,
} from "@/lib/crm/actions/servicios";
import { ServicioCard } from "./ServicioCard";
import { ServicioFormModal } from "./ServicioFormModal";
import { VariantsModal } from "./VariantsModal";
import { FaqsModal } from "./FaqsModal";
import { AdminLoading } from "@/lib/ui/AdminLoading";

export function ServiciosClient() {
    const [cargando, setCargando] = useState(true);
    const [servicios, setServicios] = useState<Servicio[]>([]);
    const [search, setSearch] = useState("");
    const [modal, setModal] = useState<
        { mode: "create" } | { mode: "edit"; servicio: Servicio } | null
    >(null);
    const [variantsTarget, setVariantsTarget] = useState<Servicio | null>(null);
    const [faqsTarget, setFaqsTarget] = useState<Servicio | null>(null);
    const [, startTransition] = useTransition();

    useEffect(() => {
        listServicios().then((data) => {
            setServicios(data);
            setCargando(false);
        });
    }, []);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return servicios;
        return servicios.filter(
            (s) =>
                s.name.toLowerCase().includes(q) ||
                s.description?.toLowerCase().includes(q) ||
                s.category?.toLowerCase().includes(q),
        );
    }, [servicios, search]);

    const grouped = useMemo(() => {
        const map = new Map<string, Servicio[]>();
        for (const s of filtered) {
            const key = s.category?.trim() || "Sin categoría";
            if (!map.has(key)) map.set(key, []);
            map.get(key)!.push(s);
        }
        return Array.from(map.entries()).sort(([a], [b]) => {
            if (a === "Sin categoría") return 1;
            if (b === "Sin categoría") return -1;
            return a.localeCompare(b, "es");
        });
    }, [filtered]);

    const categoriasExistentes = useMemo(
        () =>
            Array.from(
                new Set(
                    servicios
                        .map((s) => s.category?.trim())
                        .filter((c): c is string => Boolean(c)),
                ),
            ).sort((a, b) => a.localeCompare(b, "es")),
        [servicios],
    );

    const variantsServicio = variantsTarget
        ? (servicios.find((s) => s.id === variantsTarget.id) ?? null)
        : null;

    if (cargando) return <AdminLoading />;

    async function handleSubmit(input: {
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
    }) {
        if (!modal) return { error: "MODAL NO ABIERTO." };
        if (modal.mode === "create") {
            const res = await createServicio(input);
            if ("success" in res && res.data) {
                setServicios((prev) => [...prev, { ...res.data!, service_variants: [] }]);
            }
            return res;
        }
        const res = await updateServicio(modal.servicio.id, input);
        if ("success" in res && res.data) {
            setServicios((prev) =>
                prev.map((s) =>
                    s.id === res.data!.id
                        ? { ...res.data!, service_variants: s.service_variants }
                        : s,
                ),
            );
        }
        return res;
    }

    function handleVariantCreated(serviceId: string, variant: ServiceVariant) {
        setServicios((prev) =>
            prev.map((s) =>
                s.id === serviceId
                    ? { ...s, service_variants: [...(s.service_variants ?? []), variant] }
                    : s,
            ),
        );
    }

    function handleVariantUpdated(serviceId: string, variant: ServiceVariant) {
        setServicios((prev) =>
            prev.map((s) =>
                s.id === serviceId
                    ? {
                          ...s,
                          service_variants: (s.service_variants ?? []).map((v) =>
                              v.id === variant.id ? variant : v,
                          ),
                      }
                    : s,
            ),
        );
    }

    function handleVariantDeleted(serviceId: string, variantId: string) {
        setServicios((prev) =>
            prev.map((s) =>
                s.id === serviceId
                    ? {
                          ...s,
                          service_variants: (s.service_variants ?? []).filter(
                              (v) => v.id !== variantId,
                          ),
                      }
                    : s,
            ),
        );
    }

    function handleToggle(servicio: Servicio) {
        startTransition(async () => {
            const res = await toggleServicioActive(servicio.id, !servicio.active);
            if ("success" in res && res.data) {
                setServicios((prev) =>
                    prev.map((s) => (s.id === res.data!.id ? { ...res.data!, service_variants: s.service_variants } : s)),
                );
            }
        });
    }

    function handleDelete(servicio: Servicio) {
        startTransition(async () => {
            const res = await deleteServicio(servicio.id);
            if ("success" in res) {
                setServicios((prev) => prev.filter((s) => s.id !== servicio.id));
            }
        });
    }

    return (
        <>
            <div className="min-h-full px-6 py-8 lg:px-12 lg:py-10">
                {/* Header */}
                <header className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.03]">
                            <Package className="h-5 w-5" style={{ color: "#FFD700" }} />
                        </div>
                        <h1 className="text-3xl font-black tracking-tight text-white font-[family-name:var(--font-jost)]">
                            Servicios
                        </h1>
                    </div>

                    <button
                        onClick={() => setModal({ mode: "create" })}
                        className="inline-flex items-center gap-2 rounded-xl bg-[#FFD700] px-5 py-2.5 text-xs font-black uppercase tracking-widest text-black transition hover:bg-[#FFD700]/90"
                    >
                        <Plus className="h-4 w-4" />
                        Nuevo servicio
                    </button>
                </header>

                {/* Search */}
                <div className="mb-8 flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 focus-within:border-[#FFD700]/30 transition-colors">
                    <Search className="h-4 w-4 shrink-0 text-gray-600" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Buscar servicio…"
                        className="flex-1 bg-transparent text-sm text-white placeholder:text-gray-600 focus:outline-none"
                    />
                    {search && (
                        <button
                            onClick={() => setSearch("")}
                            className="shrink-0 text-xs font-bold uppercase tracking-widest text-gray-500 transition hover:text-white"
                        >
                            Limpiar
                        </button>
                    )}
                </div>

                {/* Empty states */}
                {servicios.length === 0 && (
                    <EmptyState onCreate={() => setModal({ mode: "create" })} />
                )}
                {servicios.length > 0 && filtered.length === 0 && (
                    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-12 text-center">
                        <p className="text-sm text-gray-500">
                            Nada con{" "}
                            <span className="text-gray-300">&ldquo;{search}&rdquo;</span>.
                        </p>
                    </div>
                )}

                {/* Category groups */}
                <div className="space-y-10">
                    {grouped.map(([category, items]) => (
                        <section key={category}>
                            <div className="mb-4 flex items-center gap-3">
                                <div className="h-px flex-1 bg-white/[0.05]" />
                                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-600">
                                    {category}
                                </span>
                                <div className="h-px flex-1 bg-white/[0.05]" />
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                                <AnimatePresence mode="popLayout">
                                    {items.map((s) => (
                                        <motion.div
                                            key={s.id}
                                            layout
                                            initial={{ opacity: 0, scale: 0.96 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.96 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <ServicioCard
                                                servicio={s}
                                                onEdit={() => setModal({ mode: "edit", servicio: s })}
                                                onToggle={() => handleToggle(s)}
                                                onDelete={() => handleDelete(s)}
                                                onOpenVariants={() => setVariantsTarget(s)}
                                                onOpenFaqs={() => setFaqsTarget(s)}
                                            />
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        </section>
                    ))}
                </div>
            </div>

            {/* Modales */}
            <ServicioFormModal
                open={modal !== null}
                mode={modal?.mode ?? "create"}
                servicio={modal?.mode === "edit" ? modal.servicio : undefined}
                onClose={() => setModal(null)}
                onSubmit={handleSubmit}
                categoriasExistentes={categoriasExistentes}
            />

            <VariantsModal
                open={variantsTarget !== null}
                servicio={variantsServicio}
                onClose={() => setVariantsTarget(null)}
                onVariantCreated={(v) => variantsTarget && handleVariantCreated(variantsTarget.id, v)}
                onVariantUpdated={(v) => variantsTarget && handleVariantUpdated(variantsTarget.id, v)}
                onVariantDeleted={(vid) => variantsTarget && handleVariantDeleted(variantsTarget.id, vid)}
            />

            <FaqsModal
                open={faqsTarget !== null}
                servicio={faqsTarget}
                onClose={() => setFaqsTarget(null)}
            />
        </>
    );
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
    return (
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-16 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.03]">
                <Package className="h-7 w-7 text-gray-500" />
            </div>
            <h2 className="mb-2 text-lg font-bold text-white">Sin servicios todavía</h2>
            <p className="mx-auto mb-6 max-w-md text-sm leading-relaxed text-gray-500">
                Agrega tu primer servicio. La IA usará este catálogo para cotizar y cerrar pedidos por WhatsApp.
            </p>
            <button
                onClick={onCreate}
                className="inline-flex items-center gap-2 rounded-xl bg-[#FFD700] px-5 py-2.5 text-xs font-black uppercase tracking-widest text-black transition hover:bg-[#FFD700]/90"
            >
                <Plus className="h-4 w-4" />
                Crear primer servicio
            </button>
        </div>
    );
}
