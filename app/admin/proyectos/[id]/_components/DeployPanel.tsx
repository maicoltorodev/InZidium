"use client";

import React, { useEffect, useState } from "react";
import {
    Globe,
    ExternalLink,
    Loader2,
    Copy,
    Rocket,
} from "lucide-react";
import { getProyectoUrls } from "@/lib/actions";
import { useToast } from "@/app/providers/ToastProvider";

type Urls = { preview: string; custom: string | null } | null;

/**
 * Panel informativo del sitio en Plantilla Web: muestra las URLs disponibles
 * (preview + custom si hay). El control de estado (publicar/mantenimiento)
 * vive en TabOverview.
 */
export function DeployPanel({ project }: { project: any }) {
    const { showToast } = useToast();
    const [urls, setUrls] = useState<Urls>(null);
    const [loading, setLoading] = useState(true);

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

    const copyUrl = async (url: string) => {
        try {
            await navigator.clipboard.writeText(url);
            showToast("URL COPIADA", "success");
        } catch {
            showToast("NO SE PUDO COPIAR", "error");
        }
    };

    const fase = project.fase as "onboarding" | "construccion" | "publicado";
    const freezeMode = !!project.freezeMode;
    const faseLabel =
        fase === "publicado" && !freezeMode
            ? "Publicado (indexable)"
            : fase === "publicado" && freezeMode
                ? "En mantenimiento (oculto al público)"
                : fase === "construccion"
                    ? "En construcción (no indexado)"
                    : "Onboarding (oculto al público)";
    const faseColor =
        fase === "publicado" && !freezeMode
            ? "text-emerald-400"
            : fase === "publicado" && freezeMode
                ? "text-amber-400"
                : fase === "construccion"
                    ? "text-[#c084fc]"
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
