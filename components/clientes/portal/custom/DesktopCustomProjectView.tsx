"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    LogOut,
    Archive,
    ChevronDown,
    ExternalLink,
    Sparkles,
    CheckCircle2,
} from "lucide-react";
import { Chat } from "../shared/Chat";
import type { ProjectFase } from "@/lib/data/types";
import { BrandDefs } from "../shared/primitives/BrandDefs";
import { BrandDivider } from "../shared/primitives/BrandDivider";
import { PhaseTimeline } from "../shared/primitives/PhaseTimeline";
import { CountdownCard } from "../shared/primitives/CountdownCard";
import { SharedVault } from "../shared/primitives/SharedVault";
import { MOTION, usePrefersReducedMotion } from "../shared/primitives/motion";

function buildLiveUrl(data: any): string | null {
    if (data?.seoCanonicalUrl) return data.seoCanonicalUrl;
    if (data?.dominioUno) return `https://www.${data.dominioUno}.com`;
    return null;
}

export function DesktopCustomProjectView({
    project,
    clientName,
    onReset,
    showToast,
}: {
    project: any;
    clientName: string;
    onReset: () => void;
    showToast: (msg: string, type: "success" | "error") => void;
}) {
    const reduced = usePrefersReducedMotion();
    const onboardingData: Record<string, any> =
        (project?.onboardingData as any) ?? {};

    const fase: ProjectFase = (project?.fase ?? "onboarding") as ProjectFase;
    const isBuilding = fase === "construccion";
    const isLive = fase === "publicado";
    const isOnboarding = fase === "onboarding";
    const liveUrl = buildLiveUrl(onboardingData);

    const hasPrevData = useMemo(
        () =>
            Object.keys(onboardingData).some(
                (k) => k !== "briefing" && hasValue(onboardingData[k]),
            ),
        [onboardingData],
    );

    const timelineSubtitle = isOnboarding
        ? "Cuéntanos tu visión"
        : isBuilding
          ? "Construyendo"
          : "En vivo";

    return (
        <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={MOTION.page}
            className="relative min-h-dvh overflow-hidden bg-[#060214] px-10 pb-24 pt-16 text-white"
        >
            <BrandDefs />

            {/* Ambient glows */}
            <motion.div
                aria-hidden
                className="pointer-events-none absolute -top-60 -left-52 h-[720px] w-[720px] rounded-full bg-[#e879f9] blur-[180px]"
                initial={{ opacity: 0.14 }}
                animate={
                    reduced
                        ? { opacity: 0.14 }
                        : {
                              x: [0, 220, -140, 80, 0],
                              y: [0, -160, 120, -60, 0],
                              opacity: [0.14, 0.2, 0.1, 0.17, 0.14],
                          }
                }
                transition={
                    reduced
                        ? undefined
                        : { duration: 26, repeat: Infinity, ease: "easeInOut" }
                }
            />
            <motion.div
                aria-hidden
                className="pointer-events-none absolute top-[30%] -right-60 h-[820px] w-[820px] rounded-full bg-[#22d3ee] blur-[200px]"
                initial={{ opacity: 0.12 }}
                animate={
                    reduced
                        ? { opacity: 0.12 }
                        : {
                              x: [0, -260, 180, -90, 0],
                              y: [0, 200, -140, 60, 0],
                              opacity: [0.12, 0.18, 0.08, 0.15, 0.12],
                          }
                }
                transition={
                    reduced
                        ? undefined
                        : { duration: 32, repeat: Infinity, ease: "easeInOut", delay: 4 }
                }
            />
            <motion.div
                aria-hidden
                className="pointer-events-none absolute -bottom-52 left-[20%] h-[640px] w-[640px] rounded-full bg-[#a855f7] blur-[180px]"
                initial={{ opacity: 0.11 }}
                animate={
                    reduced
                        ? { opacity: 0.11 }
                        : {
                              x: [0, 180, -240, 120, 0],
                              y: [0, -120, 160, -80, 0],
                              opacity: [0.11, 0.17, 0.07, 0.14, 0.11],
                          }
                }
                transition={
                    reduced
                        ? undefined
                        : { duration: 29, repeat: Infinity, ease: "easeInOut", delay: 8 }
                }
            />

            <div className="relative mx-auto w-full max-w-[1200px]">
                {/* Header */}
                <div className="mb-10 flex items-start justify-between gap-6">
                    <motion.div
                        initial={reduced ? { opacity: 0 } : { opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={MOTION.reveal}
                        className="flex-1 text-center"
                    >
                        <p className="inline-block bg-[linear-gradient(90deg,#e879f9_0%,#a855f7_50%,#22d3ee_100%)] bg-clip-text text-[11px] font-black uppercase tracking-[0.36em] text-transparent">
                            Hola, {clientName.split(" ")[0] || "bienvenido"} · Proyecto a la medida
                        </p>
                        <h1 className="mt-5 bg-[linear-gradient(135deg,#f5e7ff_0%,#ffffff_40%,#d6e9ff_100%)] bg-clip-text text-6xl font-black leading-[0.95] tracking-tight text-transparent">
                            {project.nombre || "Tu proyecto"}
                        </h1>
                        <BrandDivider width="w-24" className="mt-6" />
                    </motion.div>
                    <button
                        onClick={onReset}
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-gray-400 transition hover:text-white hover:bg-white/10"
                        aria-label="Cerrar sesión"
                    >
                        <LogOut className="h-4 w-4" />
                    </button>
                </div>

                <PhaseTimeline fase={fase} activeSubtitle={timelineSubtitle} />

                {/* Estado por fase */}
                {isBuilding && (
                    <div className="mb-6">
                        <CountdownCard
                            buildStartedAt={project.buildStartedAt ?? null}
                            fechaEntrega={project.fechaEntrega ?? null}
                            chat={project.chat ?? []}
                        />
                    </div>
                )}
                {isLive && <LivePublishedCard liveUrl={liveUrl} />}

                {/* Layout 2 columnas: archivos compartidos a la izq, chat sticky derecha */}
                <div className="grid grid-cols-[minmax(0,1fr)_420px] gap-6 items-start">
                    <div className="space-y-6">
                        <SharedVault
                            project={project}
                            showToast={showToast}
                            variant="desktop"
                            uploadedBy="cliente"
                        />
                    </div>

                    <div className="sticky top-6 space-y-4 max-h-[calc(100dvh-3rem)] flex flex-col">
                        {hasPrevData && <PreviousPlanPanel data={onboardingData} />}
                        <motion.section
                            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ ...MOTION.reveal, delay: reduced ? 0 : 0.16 }}
                            className="flex-1 min-h-[520px] rounded-[2rem] border border-white/[0.08] bg-white/[0.03] overflow-hidden"
                        >
                            <Chat
                                project={project}
                                showToast={showToast}
                                variant="desktop"
                            />
                        </motion.section>
                    </div>
                </div>

                <p className="mt-10 text-center text-[12px] leading-relaxed text-white/35">
                    {isOnboarding
                        ? "Comparte archivos y conversa con nosotros por el chat. Agendamos una llamada cuando estés listo."
                        : isBuilding
                          ? "Estamos construyendo tu sitio. Si hay cambios, escríbenos por el chat."
                          : "Tu sitio ya está en vivo. Cualquier ajuste lo coordinamos por el chat."}
                </p>
            </div>
        </motion.main>
    );
}

// ─── Live card ────────────────────────────────────────────────────────────────

function LivePublishedCard({ liveUrl }: { liveUrl: string | null }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...MOTION.reveal, delay: 0.08 }}
            className="relative mb-6 overflow-hidden rounded-[2rem] border border-emerald-500/25 bg-[linear-gradient(135deg,rgba(16,185,129,0.08)_0%,rgba(16,185,129,0.04)_50%,rgba(34,211,238,0.06)_100%)] p-8 shadow-[0_0_40px_-14px_rgba(16,185,129,0.45)]"
        >
            <div className="flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 ring-1 ring-emerald-500/25">
                    <CheckCircle2 className="h-8 w-8 text-emerald-400" />
                </div>
                <p className="mt-4 flex items-center justify-center gap-1.5 text-[11px] font-black uppercase tracking-[0.28em] text-emerald-400/80">
                    <Sparkles className="h-3 w-3" />
                    Publicado
                </p>
                <p className="mt-2 text-[22px] font-black leading-tight text-white">
                    Tu sitio está en vivo
                </p>
                <p className="mt-2 max-w-sm text-[12px] leading-relaxed text-white/45">
                    Cualquier ajuste lo coordinamos por el chat.
                </p>
                {liveUrl && (
                    <a
                        href={liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-5 inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#10b981_0%,#3b82f6_100%)] px-5 py-2.5 text-[11px] font-black uppercase tracking-[0.22em] text-white shadow-[0_0_24px_-6px_rgba(16,185,129,0.7)] transition-transform hover:scale-[1.02]"
                    >
                        <ExternalLink className="h-3.5 w-3.5" strokeWidth={3} />
                        Ver mi sitio
                    </a>
                )}
            </div>
        </motion.div>
    );
}

// ─── Plan previo (cross-plan data preservation) ──────────────────────────────

function hasValue(v: unknown): boolean {
    if (v == null) return false;
    if (typeof v === "string") return v.trim().length > 0;
    if (Array.isArray(v)) return v.length > 0;
    if (typeof v === "object") return Object.keys(v).length > 0;
    return true;
}

function PreviousPlanPanel({ data }: { data: Record<string, any> }) {
    const [open, setOpen] = useState(false);

    const nombre = data.nombreComercial;
    const slogan = data.slogan;
    const descripcion = data.descripcion;
    const logo = data.logo;
    const catalogoCount = Array.isArray(data.catalogo)
        ? data.catalogo.length
        : 0;
    const colores = [data.colorPrimario, data.colorAcento, data.colorAcento2]
        .filter(Boolean);
    const contacto = [data.whatsapp, data.telefono, data.email].filter(Boolean);

    return (
        <motion.section
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-amber-500/15 bg-amber-500/[0.03] p-4"
        >
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="flex w-full items-center justify-between gap-3 text-left"
            >
                <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
                        <Archive className="h-3.5 w-3.5" />
                    </div>
                    <div>
                        <h3 className="text-[11px] font-black uppercase tracking-[0.22em] text-white">
                            Del plan anterior
                        </h3>
                        <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-white/30">
                            {open ? "Click para colapsar" : "Click para ver"}
                        </p>
                    </div>
                </div>
                <ChevronDown
                    className={`h-4 w-4 text-white/30 transition-transform ${
                        open ? "rotate-180" : ""
                    }`}
                />
            </button>
            <AnimatePresence initial={false}>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className="mt-4 space-y-3 border-t border-white/5 pt-4">
                            {logo && (
                                <div className="flex justify-center">
                                    <img
                                        src={logo}
                                        alt="logo"
                                        className="h-14 w-14 rounded-xl bg-black/20 object-contain p-2"
                                    />
                                </div>
                            )}
                            {nombre && <RefRow label="Nombre" value={nombre} />}
                            {slogan && (
                                <RefRow label="Slogan" value={`"${slogan}"`} />
                            )}
                            {descripcion && (
                                <RefRow
                                    label="Descripción"
                                    value={descripcion}
                                    clamp
                                />
                            )}
                            {colores.length > 0 && (
                                <div>
                                    <span className="block text-[9px] font-black uppercase tracking-widest text-white/40 mb-1.5">
                                        Colores
                                    </span>
                                    <div className="flex gap-2">
                                        {colores.map(
                                            (c: string, i: number) => (
                                                <div
                                                    key={i}
                                                    className="h-7 w-7 rounded-lg border border-white/10"
                                                    style={{ background: c }}
                                                    title={c}
                                                />
                                            ),
                                        )}
                                    </div>
                                </div>
                            )}
                            {catalogoCount > 0 && (
                                <RefRow
                                    label="Catálogo"
                                    value={`${catalogoCount} ítems`}
                                />
                            )}
                            {contacto.length > 0 && (
                                <RefRow
                                    label="Contacto"
                                    value={contacto.join(" · ")}
                                />
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.section>
    );
}

function RefRow({
    label,
    value,
    clamp,
}: {
    label: string;
    value: string;
    clamp?: boolean;
}) {
    return (
        <div>
            <span className="block text-[9px] font-black uppercase tracking-widest text-white/40 mb-1">
                {label}
            </span>
            <p
                className={`text-[12px] text-white/75 ${
                    clamp ? "line-clamp-3" : ""
                } leading-relaxed break-words`}
            >
                {value}
            </p>
        </div>
    );
}
