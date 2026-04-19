"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Settings2, ChevronRight, CheckCircle2, ExternalLink, Sparkles } from "lucide-react";
import { getSectionCompletion } from "../types";
import type { ProjectFase } from "@/lib/data/types";
import { ProgressRing } from "../shared/primitives/ProgressRing";
import { SectionCard } from "../shared/primitives/SectionCard";
import { DomainCard } from "../shared/primitives/DomainCard";
import { CountdownCard } from "../shared/primitives/CountdownCard";
import { BuildModal } from "../shared/primitives/BuildModal";
import { PhaseTimeline } from "../shared/primitives/PhaseTimeline";
import { MOTION, STAGGER, usePrefersReducedMotion } from "../shared/primitives/motion";
import { BrandDivider } from "../shared/primitives/BrandDivider";
import { HUB_SECTIONS, getCatalogoSubtitle, type SectionKey } from "../shared/sections/registry";

export type HubKey = SectionKey;

function subtitleFor(completion: "empty" | "partial" | "complete") {
  if (completion === "complete") return "Completa";
  if (completion === "partial") return "En progreso";
  return "Por iniciar";
}

function buildLiveUrl(data: any): string | null {
  if (data?.seoCanonicalUrl) return data.seoCanonicalUrl;
  if (data?.dominioUno) return `https://www.${data.dominioUno}.com`;
  return null;
}

export function TabletHub({
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
}: {
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
}) {
  const reduced = usePrefersReducedMotion();
  const [buildModalOpen, setBuildModalOpen] = useState(false);

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

  const domainComplete = !!data.dominioUno;
  const totalSteps = HUB_SECTIONS.length + 1;
  const completedCount = sectionsCompleted + (domainComplete ? 1 : 0);
  const progressPct = Math.round((completedCount / totalSteps) * 100);

  const heroCopy = isOnboarding
    ? progressPct === 100
      ? "¡Tu información está lista! Ya podemos empezar a construir."
      : !domainComplete
        ? "Empecemos eligiendo tu dominio."
        : nextSection
          ? `Tu siguiente paso: completar ${nextSection.label}.`
          : "Sigue completando la información."
    : isBuilding
      ? "Estamos construyendo tu sitio."
      : "Tu sitio está en vivo.";

  const heroSub = isOnboarding
    ? "Apenas completes la info tendremos la web lista en 48 horas."
    : isBuilding
      ? "Si necesitas cambiar algo, escríbenos por Mensajes."
      : "Puedes editar cualquier información y se actualiza en tu sitio.";

  const liveUrl = buildLiveUrl(data);
  const timelineSubtitle = isOnboarding
    ? `${completedCount} de ${totalSteps} listos`
    : isBuilding
      ? "48 horas"
      : "En vivo";

  return (
    <motion.main
      initial={reduced ? { opacity: 0 } : { opacity: 0, x: "-4%" }}
      animate={{ opacity: 1, x: 0 }}
      exit={reduced ? { opacity: 0 } : { opacity: 0, x: "-10%" }}
      transition={MOTION.page}
      className="relative min-h-dvh overflow-hidden bg-[#060214] px-6 pb-20 pt-14 text-white"
    >
      {/* Ambient glows - más grandes para tablet */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-48 -left-40 h-[560px] w-[560px] rounded-full bg-[#e879f9] opacity-[0.13] blur-[150px]"
        animate={reduced ? undefined : { x: [0, 38] }}
        transition={{ duration: 20, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute top-[35%] -right-48 h-[620px] w-[620px] rounded-full bg-[#60a5fa] opacity-[0.11] blur-[160px]"
        animate={reduced ? undefined : { y: [0, 32] }}
        transition={{ duration: 26, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 left-[15%] h-[480px] w-[480px] rounded-full bg-[#a855f7] opacity-[0.1] blur-[150px]"
        animate={reduced ? undefined : { x: [0, -28] }}
        transition={{ duration: 23, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
      />

      <div className="relative mx-auto w-full max-w-[720px]">
        {/* Hero saludo */}
        <motion.div
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={MOTION.reveal}
          className="mb-8 text-center"
        >
          <p className="bg-[linear-gradient(90deg,#e879f9_0%,#a855f7_50%,#60a5fa_100%)] bg-clip-text text-[11px] font-black uppercase tracking-[0.34em] text-transparent">
            Hola, {clientName.split(" ")[0] || "bienvenido"}
          </p>
          <h1 className="mt-4 bg-[linear-gradient(135deg,#f5e7ff_0%,#ffffff_40%,#d6e9ff_100%)] bg-clip-text text-5xl font-black leading-[0.95] tracking-tight text-transparent">
            {projectName || "Tu proyecto"}
          </h1>
          <BrandDivider width="w-20" className="mt-5" />
          <p className="mt-5 text-[13px] font-bold uppercase tracking-[0.24em] text-white/40 truncate">
            Página web
          </p>
        </motion.div>

        <PhaseTimeline fase={fase} activeSubtitle={timelineSubtitle} />

        {/* Progress / Countdown / Live card */}
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
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...MOTION.reveal, delay: reduced ? 0 : 0.08 }}
            className="relative mb-6 overflow-hidden rounded-[2rem] border border-white/[0.08] bg-[linear-gradient(135deg,rgba(232,121,249,0.06)_0%,rgba(168,85,247,0.04)_50%,rgba(96,165,250,0.06)_100%)] p-7"
          >
            <div className="flex items-center gap-7">
              <ProgressRing value={progressPct} size={120} stroke={10} />
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-black uppercase tracking-[0.26em] text-white/30">
                  {completedCount} de {totalSteps} completados
                </p>
                <p className="mt-2 text-[17px] font-bold leading-snug text-white">{heroCopy}</p>
                <p className="mt-1.5 text-[12px] leading-snug text-white/40">{heroSub}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Dominio */}
        <DomainCard
          value={data.dominioUno ?? ""}
          onSave={!isBuilding && !isLive ? (v) => onDomainChange?.(v) : undefined}
          mode={isBuilding ? "locked" : isLive ? "live" : "edit"}
          onLockedTap={isBuilding ? () => setBuildModalOpen(true) : undefined}
        />

        {/* Sections grid 2-col */}
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
          className="grid grid-cols-2 gap-3"
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

        </motion.div>

        {/* Ajustes avanzados — solo cuando el sitio está publicado. */}
        {isLive && (
          <motion.button
            type="button"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...MOTION.reveal, delay: 0.3 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect("ajustes")}
            className="mt-5 flex w-full items-center gap-3 rounded-2xl border border-white/[0.04] bg-white/[0.015] px-5 py-4 text-left text-white/50 transition-colors hover:bg-white/[0.03]"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.03] text-white/35">
              <Settings2 className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-bold text-white/55">Ajustes avanzados</p>
              <p className="text-[11px] text-white/25">Tipo de negocio, legal, fuente y analíticas</p>
            </div>
            <ChevronRight className="h-4 w-4 text-white/20" />
          </motion.button>
        )}

        <FinalMessage fase={fase} />
      </div>

      <BuildModal
        open={buildModalOpen}
        onClose={() => setBuildModalOpen(false)}
        domain={data.dominioUno}
      />
    </motion.main>
  );
}

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
          <p className="mt-1 text-[20px] font-black leading-tight text-white">Tu sitio está en vivo</p>
          <p className="mt-1.5 text-[12px] leading-snug text-white/45">
            Puedes seguir editando — los cambios se actualizan automáticamente.
          </p>
          {liveUrl && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#10b981_0%,#3b82f6_100%)] px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-white shadow-[0_0_24px_-6px_rgba(16,185,129,0.7)] transition-transform hover:scale-[1.02]"
            >
              <ExternalLink className="h-3.5 w-3.5" strokeWidth={3} />
              Ver mi sitio
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function FinalMessage({ fase }: { fase: ProjectFase }) {
  if (fase === "construccion") {
    return (
      <div className="mt-10 rounded-2xl border border-white/[0.05] bg-[linear-gradient(135deg,rgba(232,121,249,0.03)_0%,rgba(168,85,247,0.03)_50%,rgba(96,165,250,0.03)_100%)] px-6 py-5 text-center">
        <p className="text-[13px] leading-relaxed text-white/55">
          Estamos construyendo tu sitio. Cuando esté listo, podrás editar cualquier información sin problemas.{" "}
          <span className="text-white/35">Si hay cambios urgentes, escríbenos por Mensajes.</span>
        </p>
      </div>
    );
  }
  if (fase === "publicado") {
    return (
      <p className="mt-10 text-center text-[12px] leading-relaxed text-white/40">
        Cualquier cambio que hagas se refleja automáticamente en tu sitio.
      </p>
    );
  }
  return (
    <p className="mt-10 text-center text-[11px] text-white/20">
      Los cambios se guardan automáticamente.
    </p>
  );
}
