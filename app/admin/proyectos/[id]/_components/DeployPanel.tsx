"use client";

import React, { useEffect, useState } from "react";
import {
    Globe,
    ExternalLink,
    Loader2,
    Snowflake,
    Check,
    Copy,
    Rocket,
} from "lucide-react";
import { toggleProyectoFreezeMode, getProyectoUrls } from "@/lib/actions";
import { useToast } from "@/app/providers/ToastProvider";

type Urls = { preview: string; custom: string | null } | null;

/**
 * Panel de administración del sitio publicado en la Plantilla Web.
 * Muestra las URLs disponibles (preview + custom si hay) y permite activar
 * el "modo revisión" para pausar cambios visibles al público.
 */
export function DeployPanel({ project }: { project: any }) {
    const { showToast } = useToast();
    const [urls, setUrls] = useState<Urls>(null);
    const [loading, setLoading] = useState(true);
    const [freezeMode, setFreezeMode] = useState<boolean>(!!project.freezeMode);
    const [toggling, setToggling] = useState(false);

    useEffect(() => {
        setFreezeMode(!!project.freezeMode);
    }, [project.freezeMode]);

    useEffect(() => {
        let cancelled = false;
        getProyectoUrls(project.id).then((u) => {
            if (!cancelled) {
                setUrls(u);
                setLoading(false);
            }
        });
        return () => {
            cancelled = true;
        };
    }, [project.id]);

    const onToggleFreeze = async () => {
        setToggling(true);
        const next = !freezeMode;
        const res = await toggleProyectoFreezeMode(project.id, next);
        if (res.success) {
            setFreezeMode(next);
            showToast(
                next
                    ? "MODO REVISIÓN ACTIVADO — CAMBIOS PAUSADOS"
                    : "MODO REVISIÓN DESACTIVADO — CAMBIOS EN VIVO",
                "success",
            );
        } else {
            showToast("ERROR AL CAMBIAR MODO REVISIÓN", "error");
        }
        setToggling(false);
    };

    const copyUrl = async (url: string) => {
        try {
            await navigator.clipboard.writeText(url);
            showToast("URL COPIADA", "success");
        } catch {
            showToast("NO SE PUDO COPIAR", "error");
        }
    };

    const fase = project.fase as "onboarding" | "construccion" | "publicado";
    const faseLabel =
        fase === "onboarding"
            ? "En construcción (oculto al público)"
            : fase === "construccion"
                ? "Vista previa (no indexado)"
                : "Publicado (indexable)";
    const faseColor =
        fase === "publicado"
            ? "text-emerald-400"
            : fase === "construccion"
                ? "text-amber-400"
                : "text-gray-500";

    return (
        <div className="p-6 sm:p-8 rounded-3xl bg-white/[0.04] backdrop-blur-xl border border-white/8 space-y-6">
            <div className="flex items-center gap-4 border-b border-white/5 pb-5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Rocket className="w-5 h-5" />
                </div>
                <div>
                    <h2 className="text-lg sm:text-xl font-black uppercase tracking-tighter">
                        Sitio en Plantilla
                    </h2>
                    <p className={`text-[10px] font-bold uppercase tracking-widest ${faseColor}`}>
                        {faseLabel}
                    </p>
                </div>
            </div>

            {/* URLs */}
            <div className="space-y-3">
                {loading ? (
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Cargando URLs…
                    </div>
                ) : urls ? (
                    <>
                        <UrlRow
                            label="Preview (subdominio)"
                            url={urls.preview}
                            onCopy={() => copyUrl(urls.preview)}
                            variant="preview"
                        />
                        {urls.custom ? (
                            <UrlRow
                                label="Dominio del cliente"
                                url={urls.custom}
                                onCopy={() => copyUrl(urls.custom!)}
                                variant="custom"
                            />
                        ) : (
                            <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-4 text-[10px] font-bold uppercase tracking-widest text-gray-600">
                                Sin dominio personalizado configurado.
                                Cuando el cliente compre un dominio, cargalo en "Enlace público"
                                arriba para que se active.
                            </div>
                        )}
                    </>
                ) : (
                    <p className="text-xs text-gray-500">No se pudieron obtener las URLs.</p>
                )}
            </div>

            {/* Freeze mode toggle */}
            <div className="rounded-2xl bg-white/[0.02] border border-white/5 p-5">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                        <div
                            className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center border ${freezeMode
                                    ? "bg-amber-500/10 border-amber-500/20 text-amber-400"
                                    : "bg-white/5 border-white/10 text-gray-500"
                                }`}
                        >
                            <Snowflake className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                            <h3 className="text-xs font-black uppercase tracking-widest text-white mb-1">
                                Modo revisión
                            </h3>
                            <p className="text-[10px] text-gray-500 leading-relaxed">
                                {freezeMode
                                    ? "Los cambios del cliente no se propagan al sitio. Activá solo cuando quieras revisar antes de publicar."
                                    : "Los cambios del cliente se ven en vivo al instante."}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onToggleFreeze}
                        disabled={toggling}
                        className={`shrink-0 relative w-14 h-8 rounded-full border transition-all ${freezeMode
                                ? "bg-amber-500/10 border-amber-500/20"
                                : "bg-white/5 border-white/10"
                            } disabled:opacity-50`}
                    >
                        <div
                            className={`absolute top-1 w-5 h-5 rounded-full shadow-lg transition-all ${freezeMode ? "bg-amber-400 right-1" : "bg-gray-500 left-1"
                                }`}
                        />
                    </button>
                </div>
            </div>
        </div>
    );
}

function UrlRow({
    label,
    url,
    onCopy,
    variant,
}: {
    label: string;
    url: string;
    onCopy: () => void;
    variant: "preview" | "custom";
}) {
    const color =
        variant === "custom"
            ? "text-emerald-400 border-emerald-500/20 bg-emerald-500/[0.04]"
            : "text-cyan-400 border-cyan-500/20 bg-cyan-500/[0.04]";

    return (
        <div className={`rounded-2xl border p-4 ${color}`}>
            <div className="flex items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5 opacity-80" />
                    <span className="text-[9px] font-black uppercase tracking-widest opacity-80">
                        {label}
                    </span>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={onCopy}
                        title="Copiar URL"
                        className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                    >
                        <Copy className="w-3.5 h-3.5" />
                    </button>
                    <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Abrir en nueva pestaña"
                        className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                    >
                        <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                </div>
            </div>
            <p className="text-sm font-mono font-bold text-white break-all">{url}</p>
        </div>
    );
}
