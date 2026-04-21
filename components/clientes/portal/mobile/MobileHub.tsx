"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Settings2, ChevronRight, CheckCircle2, ExternalLink, Sparkles } from "lucide-react";
import { getSectionCompletion } from "../types";
import type { ProjectFase } from "@/lib/data/types";
import { ProgressRing } from "../shared/primitives/ProgressRing";
import { SectionCard } from "../shared/primitives/SectionCard";
import { DomainCard } from "../shared/primitives/DomainCard";
import { CountdownCard } from "../shared/primitives/CountdownCard";
import { BuildModal } from "../shared/primitives/BuildModal";
import { OnboardingCompleteModal } from "../shared/primitives/OnboardingCompleteModal";
import { PhaseTimeline } from "../shared/primitives/PhaseTimeline";
import { MOTION, STAGGER, usePrefersReducedMotion } from "../shared/primitives/motion";
import { BrandDivider } from "../shared/primitives/BrandDivider";
import { HUB_SECTIONS, getCatalogoSubtitle, type SectionKey } from "../shared/sections/registry";
import { iniciarConstruccionEstandar } from "@/lib/actions";

export type HubKey = SectionKey;

function subtitleFor(completion: "empty" | "partial" | "complete") {
  if (completion === "complete") return "Completa";
  if (completion === "partial") return "En progreso";
  return "Por iniciar";
}

function buildLiveUrl(data: any, projectLink?: string | null): string | null {
  // Admin wins: si hay `proyectos.link` seteado, ignoramos onboardingData.
  const link = projectLink?.trim();
  if (link) return /^https?:\/\//i.test(link) ? link : `https://${link}`;
  if (data?.seoCanonicalUrl) return data.seoCanonicalUrl;
  if (data?.dominioUno) return `https://www.${data.dominioUno}.com`;
  return null;
}

export function MobileHub({
  projectId,
  clientName,
  projectName,
  data,
  fase,
  buildStartedAt,
  fechaEntrega,
  chat,
  onSelect,
  onReset,
  onDomainChange,
  justCompleted,
  hasUnread,
  lastAdminMessage,
  projectLink,
  linkLocked,
}: {
  projectId: string;
  clientName: string;
  projectName: string;
  data: any;
  fase: ProjectFase;
  buildStartedAt: Date | string | null;
  fechaEntrega: Date | string | null;
  chat?: any[];
  onSelect: (key: HubKey) => void;
  onReset: () => void;
  onDomainChange?: (v: string) => void;
  justCompleted: string | null;
  hasUnread: boolean;
  lastAdminMessage?: string;
  projectLink?: string | null;
  linkLocked?: boolean;
}) {
  const reduced = usePrefersReducedMotion();
  const [buildModalOpen, setBuildModalOpen] = useState(false);
  const [completeModalOpen, setCompleteModalOpen] = useState(false);

  const sectionsLocked = fase === "construccion";
  const isLive = fase === "publicado";
  const isBuilding = fase === "construccion";
  const isOnboarding = fase === "onboarding";

  const { nextSection, sectionsCompleted } = useMemo(() => {
    let next: (typeof HUB_SECTIONS)[number] | null = null;
    let completed = 0;
    for (const s of HUB_SECTIONS) {
      const c = getSectionCompletion(s.key, data);
      if (c === "complete") completed++;
      else if (!next) next = s;
    }
    return { nextSection: next, sectionsCompleted: completed };
  }, [data]);

  const domainComplete = !!data.dominioUno || !!projectLink?.trim();
  const totalSteps = HUB_SECTIONS.length + 1;
  const completedCount = sectionsCompleted + (domainComplete ? 1 : 0);
  const progressPct = Math.round((completedCount / totalSteps) * 100);

  // Modal "felicidades" cuando el cliente vuelve al hub habiendo completado
  // 100% en fase onboarding. NO se puede cerrar — solo confirmar dispara la
  // transición a construccion. Al cambiar a fase=construccion vía realtime,
  // este efecto deja de mantenerlo abierto.
  useEffect(() => {
    if (isOnboarding && progressPct === 100) {
      setCompleteModalOpen(true);
    } else {
      setCompleteModalOpen(false);
    }
  }, [isOnboarding, progressPct]);

  const completeModalDomain =
    projectLink?.trim().replace(/^https?:\/\//i, "") ||
    (data.dominioUno ? `www.${data.dominioUno}.com` : "");

  const heroCopy = isOnboarding
    ? progressPct === 100
      ? "¡Tu información está lista!"
      : !domainComplete
        ? "Empecemos eligiendo tu dominio."
        : nextSection
          ? `Tu siguiente paso: ${nextSection.label}.`
          : "Sigue completando la info."
    : isBuilding
      ? "Estamos construyendo tu sitio."
      : "Tu sitio está en vivo.";

  const heroSub = isOnboarding
    ? "Apenas completes la info tendremos la web lista en 48 horas."
    : isBuilding
      ? "Si hay cambios, escríbenos por Mensajes."
      : "Puedes editar cualquier información.";

  const liveUrl = buildLiveUrl(data, projectLink);
  const timelineSubtitle = isOnboarding
    ? `${completedCount}/${totalSteps}`
    : isBuilding
      ? "48 horas"
      : "En vivo";

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={MOTION.page}
      className="relative min-h-dvh overflow-hidden bg-[#060214] px-4 pb-16 pt-10 text-white"
    >
      {/* Glows estáticos (sin animación) — en mobile los `motion.div` con
          blur grande repintaban cada frame y pegaban GPU. Quietos se pintan
          una sola vez y el efecto visual prácticamente no cambia. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -left-32 h-[420px] w-[420px] rounded-full bg-[#e879f9] opacity-[0.12] blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-[40%] -right-40 h-[480px] w-[480px] rounded-full bg-[#22d3ee] opacity-[0.1] blur-[130px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 left-[20%] h-[360px] w-[360px] rounded-full bg-[#a855f7] opacity-[0.09] blur-[120px]"
      />

      <div className="relative mx-auto w-full max-w-[560px]">
        <motion.div
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={MOTION.reveal}
          className="mb-6 text-center"
        >
          <p className="inline-block bg-[linear-gradient(90deg,#e879f9_0%,#a855f7_50%,#22d3ee_100%)] bg-clip-text text-[10px] font-black uppercase tracking-[0.32em] text-transparent">
            Hola, {clientName.split(" ")[0] || "bienvenido"} · Tu página web
          </p>
          <h1 className="mt-3 bg-[linear-gradient(135deg,#f5e7ff_0%,#ffffff_40%,#d6e9ff_100%)] bg-clip-text text-[2.75rem] font-black leading-[0.95] tracking-tight text-transparent">
            {projectName || "Tu proyecto"}
          </h1>
          <BrandDivider width="w-16" className="mt-4" />
        </motion.div>

        <PhaseTimeline fase={fase} activeSubtitle={timelineSubtitle} />

        {isBuilding ? (
          <CountdownCard
            buildStartedAt={buildStartedAt}
            fechaEntrega={fechaEntrega}
            chat={chat}
          />
        ) : isLive ? (
          <LivePublishedCard liveUrl={liveUrl} />
        ) : (
          <motion.div
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...MOTION.reveal, delay: reduced ? 0 : 0.08 }}
            className="relative mb-6 overflow-hidden rounded-[2rem] border border-white/[0.08] bg-[linear-gradient(135deg,rgba(232,121,249,0.06)_0%,rgba(168,85,247,0.04)_50%,rgba(34,211,238,0.06)_100%)] p-5"
          >
            <div className="flex items-center gap-5">
              <ProgressRing value={progressPct} />
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/30">
                  {completedCount} de {totalSteps} completados
                </p>
                <p className="mt-1.5 text-[15px] font-bold leading-snug text-white">{heroCopy}</p>
                <p className="mt-1 text-[11px] leading-snug text-white/40">{heroSub}</p>
              </div>
            </div>
          </motion.div>
        )}

        <DomainCard
          value={data.dominioUno ?? ""}
          onSave={!isBuilding && !isLive ? (v) => onDomainChange?.(v) : undefined}
          mode={isBuilding ? "locked" : isLive ? "live" : "edit"}
          onLockedTap={isBuilding ? () => setBuildModalOpen(true) : undefined}
          displayUrl={projectLink}
          linkLocked={linkLocked}
        />

        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: reduced ? 0 : STAGGER.cards,
                delayChildren: reduced ? 0 : 0.12,
              },
            },
          }}
          className="space-y-2.5"
        >
          {HUB_SECTIONS.map((sec) => {
            const completion = getSectionCompletion(sec.key, data);
            const isNext = isOnboarding && nextSection?.key === sec.key;
            return (
              <motion.div
                key={sec.key}
                variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
                transition={MOTION.reveal}
              >
                <SectionCard
                  icon={sec.icon}
                  title={sec.label}
                  description={sec.key === "catalogo" ? getCatalogoSubtitle(data.tipoCatalogo) : sec.subtitle}
                  status={{ kind: "progress", completion, subtitle: subtitleFor(completion) }}
                  onPress={() => onSelect(sec.key as HubKey)}
                  celebrate={justCompleted === sec.key}
                  disabled={sectionsLocked}
                  published={isLive}
                  isNext={isNext}
                />
              </motion.div>
            );
          })}

          {/* Ajustes avanzados — solo cuando el sitio está publicado. */}
          {isLive && (
            <motion.button
              type="button"
              variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
              transition={MOTION.reveal}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect("ajustes")}
              className="mt-4 flex w-full items-center gap-3 rounded-2xl border border-white/[0.04] bg-white/[0.015] px-4 py-3 text-left text-white/50 transition-colors hover:bg-white/[0.03]"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/[0.03] text-white/35">
                <Settings2 className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-bold text-white/55">Ajustes avanzados</p>
                <p className="text-[10px] text-white/25">Tipo de negocio, legal, fuente y analíticas</p>
              </div>
              <ChevronRight className="h-4 w-4 text-white/20" />
            </motion.button>
          )}
        </motion.div>

        <FinalMessage fase={fase} />
      </div>

      <BuildModal
        open={buildModalOpen}
        onClose={() => setBuildModalOpen(false)}
        domain={projectLink?.trim() || data.dominioUno}
      />

      <OnboardingCompleteModal
        open={completeModalOpen}
        onConfirm={async () => {
          const res = await iniciarConstruccionEstandar(projectId);
          if (res.success) setCompleteModalOpen(false);
        }}
        domain={completeModalDomain}
        linkLocked={linkLocked}
      />
    </motion.main>
  );
}

function LivePublishedCard({ liveUrl }: { liveUrl: string | null }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...MOTION.reveal, delay: 0.08 }}
      className="relative mb-6 overflow-hidden rounded-[2rem] border border-emerald-500/25 bg-[linear-gradient(135deg,rgba(16,185,129,0.08)_0%,rgba(16,185,129,0.04)_50%,rgba(34,211,238,0.06)_100%)] p-5 shadow-[0_0_32px_-12px_rgba(16,185,129,0.4)]"
    >
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 ring-1 ring-emerald-500/25">
          <CheckCircle2 className="h-7 w-7 text-emerald-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.24em] text-emerald-400/80">
            <Sparkles className="h-3 w-3" />
            Publicado
          </p>
          <p className="mt-1 text-[18px] font-black leading-tight text-white">Tu sitio está en vivo</p>
          <p className="mt-1 text-[11px] leading-snug text-white/45">
            Puedes seguir editando — los cambios se actualizan solos.
          </p>
        </div>
      </div>
      {liveUrl && (
        <a
          href={liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#10b981_0%,#3b82f6_100%)] py-3 text-[11px] font-black uppercase tracking-[0.22em] text-white shadow-[0_0_24px_-6px_rgba(16,185,129,0.7)] transition-transform active:scale-[0.98]"
        >
          <ExternalLink className="h-3.5 w-3.5" strokeWidth={3} />
          Ver mi sitio
        </a>
      )}
    </motion.div>
  );
}

function FinalMessage({ fase }: { fase: ProjectFase }) {
  if (fase === "construccion") {
    return (
      <div className="mt-8 rounded-2xl border border-white/[0.05] bg-[linear-gradient(135deg,rgba(232,121,249,0.03)_0%,rgba(168,85,247,0.03)_50%,rgba(34,211,238,0.03)_100%)] px-5 py-4 text-center">
        <p className="text-[12px] leading-relaxed text-white/55">
          Estamos construyendo tu sitio. Cuando esté listo podrás editar sin problemas.
          <br />
          <span className="text-white/35">Si hay cambios urgentes, escríbenos por Mensajes.</span>
        </p>
      </div>
    );
  }
  if (fase === "publicado") {
    return (
      <p className="mt-8 text-center text-[11px] leading-relaxed text-white/40">
        Cualquier cambio se refleja automáticamente en tu sitio.
      </p>
    );
  }
  return (
    <div className="mt-8 flex justify-center">
      <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/[0.06] px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.24em] text-emerald-400">
        <span className="relative flex h-2 w-2">
          <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400 opacity-70" />
          <span className="relative h-2 w-2 rounded-full bg-emerald-400" />
        </span>
        Guardado automático
      </span>
    </div>
  );
}
