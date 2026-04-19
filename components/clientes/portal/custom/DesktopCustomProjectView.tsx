"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    FileText,
    LogOut,
    Loader2,
    Check,
    Archive,
    ChevronDown,
    ExternalLink,
    Sparkles,
    Target,
    Camera,
    Calendar,
    Link2,
    CheckCircle2,
} from "lucide-react";
import { updateProyectoBriefing } from "@/lib/actions";
import { Chat } from "../shared/Chat";
import type { ProjectFase } from "@/lib/data/types";
import { BrandDefs } from "../shared/primitives/BrandDefs";
import { BrandDivider } from "../shared/primitives/BrandDivider";
import { PhaseTimeline } from "../shared/primitives/PhaseTimeline";
import { CountdownCard } from "../shared/primitives/CountdownCard";
import { MOTION, usePrefersReducedMotion } from "../shared/primitives/motion";

const AUTOSAVE_DEBOUNCE = 900;

const BRIEF_PROMPTS = [
    {
        icon: Target,
        label: "¿Qué querés lograr?",
        hint: "Objetivos del proyecto, para quién es.",
    },
    {
        icon: Camera,
        label: "¿Qué tenés hoy?",
        hint: "Marca, sitio previo, redes, referencias.",
    },
    {
        icon: Calendar,
        label: "¿Tenés deadline?",
        hint: "Fechas clave o prioridades.",
    },
    {
        icon: Link2,
        label: "Inspiración",
        hint: "Links o sitios que te gustan.",
    },
];

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
    const initialBrief: string = onboardingData.briefing ?? "";
    const [brief, setBrief] = useState(initialBrief);
    const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");
    const lastSavedRef = useRef(initialBrief);
    const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const fase: ProjectFase = (project?.fase ?? "onboarding") as ProjectFase;
    const isBuilding = fase === "construccion";
    const isLive = fase === "publicado";
    const isOnboarding = fase === "onboarding";
    const liveUrl = buildLiveUrl(onboardingData);

    // Re-sincronizar cuando llega el proyecto actualizado por realtime.
    useEffect(() => {
        const incoming = (project?.onboardingData as any)?.briefing ?? "";
        if (incoming !== lastSavedRef.current && incoming !== brief) {
            setBrief(incoming);
            lastSavedRef.current = incoming;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [project?.onboardingData]);

    // Autosave con debounce.
    useEffect(() => {
        if (brief === lastSavedRef.current) return;
        if (saveTimer.current) clearTimeout(saveTimer.current);
        setStatus("saving");
        saveTimer.current = setTimeout(async () => {
            const res = await updateProyectoBriefing(project.id, brief);
            if (res.success) {
                lastSavedRef.current = brief;
                setStatus("saved");
                setTimeout(
                    () => setStatus((s) => (s === "saved" ? "idle" : s)),
                    1800,
                );
            } else {
                setStatus("idle");
                showToast("No se pudo guardar el brief", "error");
            }
        }, AUTOSAVE_DEBOUNCE);
        return () => {
            if (saveTimer.current) clearTimeout(saveTimer.current);
        };
    }, [brief, project.id, showToast]);

    const hasPrevData = useMemo(
        () =>
            Object.keys(onboardingData).some(
                (k) => k !== "briefing" && hasValue(onboardingData[k]),
            ),
        [onboardingData],
    );

    const timelineSubtitle = isOnboarding
        ? "Contanos tu visión"
        : isBuilding
          ? "Construyendo"
          : "En vivo";

    const briefReadOnly = isBuilding;

    return (
        <motion.main
            initial={reduced ? { opacity: 0 } : { opacity: 0, x: "-3%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, x: "-8%" }}
            transition={MOTION.page}
            className="relative min-h-dvh overflow-hidden bg-[#060214] px-10 pb-24 pt-16 text-white"
        >
            <BrandDefs />

            {/* Ambient glows — igual que el hub para continuidad visual */}
            <motion.div
                aria-hidden
                className="pointer-events-none absolute -top-60 -left-52 h-[720px] w-[720px] rounded-full bg-[#e879f9] blur-[180px]"
                initial={{ x: 0, y: 0, opacity: 0.14 }}
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
                        : {
                              duration: 26,
                              repeat: Infinity,
                              ease: "easeInOut",
                          }
                }
            />
            <motion.div
                aria-hidden
                className="pointer-events-none absolute top-[30%] -right-60 h-[820px] w-[820px] rounded-full bg-[#60a5fa] blur-[200px]"
                initial={{ x: 0, y: 0, opacity: 0.12 }}
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
                        : {
                              duration: 32,
                              repeat: Infinity,
                              ease: "easeInOut",
                              delay: 4,
                          }
                }
            />
            <motion.div
                aria-hidden
                className="pointer-events-none absolute -bottom-52 left-[20%] h-[640px] w-[640px] rounded-full bg-[#a855f7] blur-[180px]"
                initial={{ x: 0, y: 0, opacity: 0.11 }}
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
                        : {
                              duration: 29,
                              repeat: Infinity,
                              ease: "easeInOut",
                              delay: 8,
                          }
                }
            />

            <div className="relative mx-auto w-full max-w-[1200px]">
                {/* Header con botón logout */}
                <div className="mb-10 flex items-start justify-between gap-6">
                    <motion.div
                        initial={
                            reduced ? { opacity: 0 } : { opacity: 0, y: 18 }
                        }
                        animate={{ opacity: 1, y: 0 }}
                        transition={MOTION.reveal}
                        className="flex-1 text-center"
                    >
                        <p className="bg-[linear-gradient(90deg,#e879f9_0%,#a855f7_50%,#60a5fa_100%)] bg-clip-text text-[11px] font-black uppercase tracking-[0.36em] text-transparent">
                            Hola, {clientName.split(" ")[0] || "bienvenido"} · Proyecto a la medida
                        </p>
                        <h1 className="mt-5 bg-[linear-gradient(135deg,#f5e7ff_0%,#ffffff_40%,#d6e9ff_100%)] bg-clip-text text-6xl font-black leading-[0.95] tracking-tight text-transparent">
                            Tu sitio web
                        </h1>
                        <BrandDivider width="w-24" className="mt-6" />
                        <p className="mt-6 text-[13px] font-bold uppercase tracking-[0.26em] text-white/40">
                            {project.nombre || "Proyecto a la medida"}
                        </p>
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

                {/* Estado por fase — protagonista según momento */}
                {isBuilding && (
                    <div className="mb-6">
                        <CountdownCard
                            buildStartedAt={project.buildStartedAt ?? null}
                            fechaEntrega={project.fechaEntrega ?? null}
                            chat={project.chat ?? []}
                        />
                    </div>
                )}
                {isLive && (
                    <LivePublishedCard liveUrl={liveUrl} />
                )}

                {/* Layout 2 columnas: brief a la izq, chat sticky derecha */}
                <div className="grid grid-cols-[minmax(0,1fr)_420px] gap-6 items-start">
                    <div className="space-y-6">
                        {/* Prompts guía */}
                        {!briefReadOnly && (
                            <BriefPrompts />
                        )}

                        {/* Brief */}
                        <motion.section
                            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ ...MOTION.reveal, delay: reduced ? 0 : 0.08 }}
                            className="relative rounded-[2rem] border border-white/[0.08] bg-[linear-gradient(135deg,rgba(232,121,249,0.04)_0%,rgba(168,85,247,0.03)_50%,rgba(96,165,250,0.04)_100%)] p-7"
                        >
                            <div className="mb-5 flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[linear-gradient(135deg,rgba(232,121,249,0.12)_0%,rgba(168,85,247,0.12)_50%,rgba(96,165,250,0.12)_100%)] ring-1 ring-[#a855f7]/25">
                                        <FileText className="h-4 w-4 text-white/80" />
                                    </div>
                                    <div>
                                        <h2 className="text-[13px] font-black uppercase tracking-[0.24em] text-white">
                                            Brief del proyecto
                                        </h2>
                                        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/30">
                                            {briefReadOnly
                                                ? "Lectura · construyendo"
                                                : "Guarda automáticamente"}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <CharCount value={brief} />
                                    <SaveIndicator status={status} />
                                </div>
                            </div>
                            <textarea
                                value={brief}
                                onChange={(e) => setBrief(e.target.value)}
                                disabled={briefReadOnly}
                                placeholder={
                                    "Contanos tu proyecto en tus palabras.\n\n" +
                                    "Mirá las preguntas guía de arriba — no tenés que responderlas todas, " +
                                    "solo sirven para arrancar. Podés ir editando cuando quieras."
                                }
                                rows={14}
                                className="w-full resize-y rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-white placeholder:text-white/25 focus:border-[#a855f7]/50 focus:outline-none transition-colors leading-relaxed disabled:cursor-not-allowed disabled:opacity-70"
                            />
                            <p className="mt-3 text-[11px] leading-relaxed text-white/35">
                                Para imágenes, PDFs o referencias, usá el chat de la derecha →
                            </p>
                        </motion.section>
                    </div>

                    {/* Sidebar derecho: plan previo + chat sticky */}
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
                        ? "Tu brief se guarda automáticamente. Escribinos por el chat cuando quieras."
                        : isBuilding
                          ? "Estamos construyendo tu sitio. Si hay cambios, escribinos por el chat."
                          : "Tu sitio ya está en vivo. Cualquier ajuste lo coordinamos por el chat."}
                </p>
            </div>
        </motion.main>
    );
}

// ─── Prompts guía ─────────────────────────────────────────────────────────────

function BriefPrompts() {
    return (
        <motion.section
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={MOTION.reveal}
            aria-hidden
        >
            <p className="mb-3 text-[10px] font-black uppercase tracking-[0.26em] text-white/30">
                Preguntas guía · opcional
            </p>
            <div className="grid grid-cols-2 gap-2.5">
                {BRIEF_PROMPTS.map((p) => {
                    const Icon = p.icon;
                    return (
                        <div
                            key={p.label}
                            className="flex items-start gap-3 rounded-2xl border border-white/[0.05] bg-white/[0.02] p-3"
                        >
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[linear-gradient(135deg,rgba(232,121,249,0.1)_0%,rgba(168,85,247,0.1)_50%,rgba(96,165,250,0.1)_100%)] ring-1 ring-white/5">
                                <Icon className="h-3.5 w-3.5 text-white/60" />
                            </div>
                            <div className="flex-1 min-w-0 pt-0.5">
                                <p className="text-[12px] font-bold text-white leading-tight">
                                    {p.label}
                                </p>
                                <p className="mt-0.5 text-[11px] text-white/40 leading-snug">
                                    {p.hint}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </motion.section>
    );
}

// ─── Indicador de guardado ───────────────────────────────────────────────────

function SaveIndicator({ status }: { status: "idle" | "saving" | "saved" }) {
    if (status === "saving") {
        return (
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-white/40">
                <Loader2 className="h-3 w-3 animate-spin" />
                Guardando
            </div>
        );
    }
    if (status === "saved") {
        return (
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                <Check className="h-3 w-3" />
                Guardado
            </div>
        );
    }
    return null;
}

function CharCount({ value }: { value: string }) {
    const len = value.trim().length;
    if (len === 0) return null;
    return (
        <span className="text-[10px] font-bold uppercase tracking-widest text-white/25">
            {len} caracteres
        </span>
    );
}

// ─── Live card ────────────────────────────────────────────────────────────────

function LivePublishedCard({ liveUrl }: { liveUrl: string | null }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...MOTION.reveal, delay: 0.08 }}
            className="relative mb-6 overflow-hidden rounded-[2rem] border border-emerald-500/25 bg-[linear-gradient(135deg,rgba(16,185,129,0.08)_0%,rgba(16,185,129,0.04)_50%,rgba(96,165,250,0.06)_100%)] p-7 shadow-[0_0_40px_-14px_rgba(16,185,129,0.45)]"
        >
            <div className="flex items-center gap-6">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 ring-1 ring-emerald-500/25">
                    <CheckCircle2 className="h-8 w-8 text-emerald-400" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-[0.26em] text-emerald-400/80">
                        <Sparkles className="h-3 w-3" />
                        Publicado
                    </p>
                    <p className="mt-1 text-[20px] font-black leading-tight text-white">
                        Tu sitio está en vivo
                    </p>
                    <p className="mt-1.5 text-[12px] leading-snug text-white/45">
                        Cualquier ajuste lo coordinamos por el chat.
                    </p>
                </div>
                {liveUrl && (
                    <a
                        href={liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#10b981_0%,#3b82f6_100%)] px-5 py-2.5 text-[11px] font-black uppercase tracking-[0.22em] text-white shadow-[0_0_24px_-6px_rgba(16,185,129,0.7)] transition-transform hover:scale-[1.02]"
                    >
                        <ExternalLink className="h-3.5 w-3.5" strokeWidth={3} />
                        Ver mi sitio
                    </a>
                )}
            </div>
        </motion.div>
    );
}

// ─── Panel del plan previo ────────────────────────────────────────────────────

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
    const colores = [
        data.colorPrimario,
        data.colorAcento,
        data.colorAcento2,
    ].filter(Boolean);
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
