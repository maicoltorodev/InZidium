"use client";

import React, { useEffect, useState } from "react";
import {
  MessageSquare,
  FolderOpen,
  Rocket,
  ChevronRight as ChevronRightIcon,
  Sparkles,
  Hammer,
  CheckCircle2,
  Wrench,
  AlertTriangle,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  iniciarConstruccion,
  publicarProyecto,
  toggleProyectoFreezeMode,
} from "@/lib/actions";
import { PLANS } from "@/lib/constants";
import { useToast } from "@/app/providers/ToastProvider";

interface TabOverviewProps {
  project: any;
  projectPlan: any;
  setActiveTab: (tab: any) => void;
}

export function TabOverview({
  project,
  projectPlan,
  setActiveTab,
}: TabOverviewProps) {
  return (
    <motion.div
      key="overview"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-8"
    >
      <StatePanel project={project} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="p-6 sm:p-8 rounded-3xl bg-white/[0.04] backdrop-blur-xl border border-white/8 flex flex-col justify-between h-64 group hover:border-white/15 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 flex items-center justify-center text-purple-400 mb-4">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <span className="text-3xl font-black text-white block mb-1">
              {project.chat?.length || 0}
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
              Mensajes Totales
            </span>
          </div>
          <button
            onClick={() => setActiveTab("communication")}
            className="mt-4 text-xs font-bold text-white flex items-center gap-2 opacity-50 group-hover:opacity-100 transition-opacity"
          >
            Abrir Canal <ChevronRightIcon className="w-3 h-3" />
          </button>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-white/[0.04] backdrop-blur-xl border border-white/8 flex flex-col justify-between h-64 group hover:border-white/15 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 flex items-center justify-center text-emerald-400 mb-4">
            <FolderOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="text-3xl font-black text-white block mb-1">
              {project.archivos?.length || 0}
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
              Archivos cargados
            </span>
          </div>
          <button
            onClick={() => setActiveTab("vault")}
            className="mt-4 text-xs font-bold text-white flex items-center gap-2 opacity-50 group-hover:opacity-100 transition-opacity"
          >
            Gestionar Archivos <ChevronRightIcon className="w-3 h-3" />
          </button>
        </div>

        <div className="p-8 rounded-3xl bg-white/[0.04] backdrop-blur-xl border border-white/8 flex flex-col justify-between h-64 group hover:border-white/15 transition-all relative overflow-hidden">
          <div
            className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${projectPlan.color} opacity-10 blur-[40px]`}
          />
          <div
            className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white mb-4`}
          >
            <Rocket className="w-6 h-6" />
          </div>
          <div>
            <span
              className={`text-xl font-black bg-gradient-to-r ${projectPlan.color} bg-clip-text text-transparent block mb-1 uppercase`}
            >
              {project.plan}
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
              Nivel de Servicio
            </span>
          </div>
          <button
            onClick={() => setActiveTab("settings")}
            className="mt-4 text-xs font-bold text-white flex items-center gap-2 opacity-50 group-hover:opacity-100 transition-opacity"
          >
            Cambiar plan <ChevronRightIcon className="w-3 h-3" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── State panel ─────────────────────────────────────────────────────────────

/**
 * Único control de estado del proyecto. Se adapta a la fase + plan:
 *  - onboarding (Estándar) → info-only, auto-transiciona al 100%.
 *  - onboarding (A la medida) → botón manual "Iniciar construcción" con duración.
 *  - construccion → countdown grande + botón "Publicar".
 *  - publicado (!freeze) → badge "Publicado" + botón "Activar mantenimiento".
 *  - publicado (freeze)  → badge "En mantenimiento" + botón "Publicar".
 */
function StatePanel({ project }: { project: any }) {
  const fase = (project.fase ?? "onboarding") as
    | "onboarding"
    | "construccion"
    | "publicado";
  const freezeMode = !!project.freezeMode;
  const isALaMedida = project.plan === PLANS.ala_medida.title;

  if (fase === "onboarding") {
    return isALaMedida ? (
      <OnboardingALaMedidaState project={project} />
    ) : (
      <OnboardingEstandarState />
    );
  }
  if (fase === "construccion")
    return (
      <ConstruccionState
        project={project}
        buildStartedAt={project.buildStartedAt ?? null}
        fechaEntrega={project.fechaEntrega ?? null}
      />
    );
  return <PublicadoState project={project} freezeMode={freezeMode} />;
}

function OnboardingEstandarState() {
  return (
    <section className="bg-white/[0.04] backdrop-blur-xl border border-white/8 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
      <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
        <Sparkles className="w-5 h-5" />
      </div>
      <div className="min-w-0">
        <h2 className="text-xl font-black uppercase tracking-tighter">
          Onboarding en curso
        </h2>
        <p className="mt-1 text-xs font-bold text-gray-500 uppercase tracking-widest">
          El cliente está llenando la información. Al completarla, el proyecto
          pasará a construcción automáticamente (48h).
        </p>
      </div>
    </section>
  );
}

function OnboardingALaMedidaState({ project }: { project: any }) {
  const { showToast } = useToast();
  const [saving, setSaving] = useState(false);
  const [days, setDays] = useState(7);

  const onIniciar = async () => {
    if (saving) return;
    if (days < 1 || days > 365) {
      showToast("DURACIÓN FUERA DE RANGO (1–365 DÍAS)", "error");
      return;
    }
    setSaving(true);
    try {
      const res = await iniciarConstruccion(project.id, days);
      if (res.success) showToast("CONSTRUCCIÓN INICIADA", "success");
      else
        showToast(
          ((res as any).error ?? "ERROR AL INICIAR").toUpperCase(),
          "error",
        );
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="bg-white/[0.04] backdrop-blur-xl border border-white/8 rounded-3xl p-6 sm:p-8 space-y-6">
      <header className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-xl font-black uppercase tracking-tighter">
            Onboarding en curso
          </h2>
          <p className="mt-1 text-xs font-bold text-gray-500 uppercase tracking-widest">
            Plan a la medida — cuando el brief esté listo, inicia construcción
            con la duración que definas.
          </p>
        </div>
      </header>

      <div className="flex flex-col sm:flex-row items-stretch gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 sm:p-5">
        <label className="flex-1 flex items-center gap-3">
          <span className="text-[10px] font-black uppercase tracking-widest text-white/60 whitespace-nowrap">
            Duración
          </span>
          <input
            type="number"
            min={1}
            max={365}
            value={days}
            onChange={(e) => setDays(parseInt(e.target.value) || 1)}
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm tabular-nums outline-none focus:border-cyan-400/50"
          />
          <span className="text-[10px] font-black uppercase tracking-widest text-white/60">
            días
          </span>
        </label>
        <button
          type="button"
          onClick={onIniciar}
          disabled={saving}
          className="rounded-xl border border-emerald-500/30 bg-emerald-500/[0.08] px-6 py-3 font-black text-emerald-400 text-[11px] uppercase tracking-widest transition-all hover:bg-emerald-500/[0.14] disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4" />
          Iniciar construcción
        </button>
      </div>
    </section>
  );
}

function ConstruccionState({
  project,
  buildStartedAt,
  fechaEntrega,
}: {
  project: any;
  buildStartedAt: Date | string | null;
  fechaEntrega: Date | string | null;
}) {
  const { showToast } = useToast();
  const [saving, setSaving] = useState(false);

  const onPublicar = async () => {
    if (saving) return;
    setSaving(true);
    try {
      const res = await publicarProyecto(project.id);
      if (res.success) showToast("PROYECTO PUBLICADO", "success");
      else showToast("ERROR AL PUBLICAR", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="bg-white/[0.04] backdrop-blur-xl border border-white/8 rounded-3xl p-6 sm:p-8 space-y-6 relative overflow-hidden">
      <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-[#a855f7] opacity-[0.06] blur-[120px] pointer-events-none" />

      <header className="flex items-start gap-4 relative">
        <div className="w-12 h-12 rounded-2xl bg-[linear-gradient(135deg,rgba(232,121,249,0.14)_0%,rgba(168,85,247,0.14)_50%,rgba(34,211,238,0.14)_100%)] ring-1 ring-[#a855f7]/25 flex items-center justify-center shrink-0">
          <Hammer className="w-5 h-5 text-[#a855f7]" />
        </div>
        <div className="min-w-0">
          <h2 className="text-xl font-black uppercase tracking-tighter">
            En construcción
          </h2>
          <p className="mt-1 text-xs font-bold text-gray-500 uppercase tracking-widest">
            Cliente bloqueado del wizard hasta publicar.
          </p>
        </div>
      </header>

      <BuildCountdown
        buildStartedAt={buildStartedAt}
        fechaEntrega={fechaEntrega}
      />

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          type="button"
          onClick={onPublicar}
          disabled={saving}
          className="group flex-1 relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.08] px-6 py-4 text-left transition-all hover:bg-emerald-500/[0.14] disabled:opacity-50"
        >
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <div>
              <p className="text-sm font-black text-emerald-400">Publicar</p>
              <p className="text-[10px] text-gray-500">
                Cierra el countdown y pone el sitio en vivo.
              </p>
            </div>
          </div>
        </button>
      </div>
    </section>
  );
}

function PublicadoState({
  project,
  freezeMode,
}: {
  project: any;
  freezeMode: boolean;
}) {
  const { showToast } = useToast();
  const [saving, setSaving] = useState(false);

  const onActivarMantenimiento = async () => {
    if (saving) return;
    setSaving(true);
    try {
      const res = await toggleProyectoFreezeMode(project.id, true);
      if (res.success) showToast("MANTENIMIENTO ACTIVADO", "success");
      else showToast("ERROR AL CAMBIAR ESTADO", "error");
    } finally {
      setSaving(false);
    }
  };

  const onPublicar = async () => {
    if (saving) return;
    setSaving(true);
    try {
      const res = await publicarProyecto(project.id);
      if (res.success) showToast("SITIO PUBLICADO", "success");
      else showToast("ERROR AL PUBLICAR", "error");
    } finally {
      setSaving(false);
    }
  };

  const Icon = freezeMode ? Wrench : Rocket;
  const accent = freezeMode ? "amber" : "emerald";
  const title = freezeMode ? "En mantenimiento" : "Publicado";
  const subtitle = freezeMode
    ? "El público ve un aviso de mantenimiento. El sitio no se indexa."
    : "El sitio está en vivo. El cliente puede editar cualquier info.";

  return (
    <section className="bg-white/[0.04] backdrop-blur-xl border border-white/8 rounded-3xl p-6 sm:p-8 space-y-6 relative overflow-hidden">
      <div
        className={`absolute -top-32 -right-32 w-80 h-80 rounded-full ${
          freezeMode ? "bg-amber-400" : "bg-emerald-400"
        } opacity-[0.06] blur-[120px] pointer-events-none`}
      />

      <header className="flex items-start gap-4 relative">
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
            accent === "amber"
              ? "bg-amber-500/10 ring-1 ring-amber-500/25 text-amber-400"
              : "bg-emerald-500/10 ring-1 ring-emerald-500/25 text-emerald-400"
          }`}
        >
          <Icon className="w-5 h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-xl font-black uppercase tracking-tighter">
            {title}
          </h2>
          <p className="mt-1 text-xs font-bold text-gray-500 uppercase tracking-widest">
            {subtitle}
          </p>
        </div>
      </header>

      <div className="flex flex-col sm:flex-row gap-3">
        {freezeMode ? (
          <button
            type="button"
            onClick={onPublicar}
            disabled={saving}
            className="flex-1 rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.08] px-6 py-4 text-left transition-all hover:bg-emerald-500/[0.14] disabled:opacity-50"
          >
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <div>
                <p className="text-sm font-black text-emerald-400">
                  Sacar de mantenimiento
                </p>
                <p className="text-[10px] text-gray-500">
                  Vuelve a mostrar el sitio al público.
                </p>
              </div>
            </div>
          </button>
        ) : (
          <button
            type="button"
            onClick={onActivarMantenimiento}
            disabled={saving}
            className="flex-1 rounded-2xl border border-amber-500/30 bg-amber-500/[0.08] px-6 py-4 text-left transition-all hover:bg-amber-500/[0.14] disabled:opacity-50"
          >
            <div className="flex items-center gap-3">
              <Wrench className="w-5 h-5 text-amber-400" />
              <div>
                <p className="text-sm font-black text-amber-400">
                  Activar mantenimiento
                </p>
                <p className="text-[10px] text-gray-500">
                  El público ve el aviso mientras tú trabajas.
                </p>
              </div>
            </div>
          </button>
        )}
      </div>
    </section>
  );
}

// ─── Build countdown (admin, grande) ────────────────────────────────────────

function BuildCountdown({
  buildStartedAt,
  fechaEntrega,
}: {
  buildStartedAt: Date | string | null;
  fechaEntrega: Date | string | null;
}) {
  const startMs = toMs(buildStartedAt);
  const endMs = toMs(fechaEntrega);
  const totalMs = startMs != null && endMs != null ? Math.max(1, endMs - startMs) : 0;

  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const remaining = endMs != null ? endMs - now : 0;
  const done = remaining <= 0;
  const totalSec = done ? 0 : Math.floor(remaining / 1000);
  const hh = Math.floor(totalSec / 3600).toString().padStart(2, "0");
  const mm = Math.floor((totalSec % 3600) / 60).toString().padStart(2, "0");
  const ss = Math.floor(totalSec % 60).toString().padStart(2, "0");

  const elapsed = startMs != null ? Math.max(0, now - startMs) : 0;
  const pct = totalMs > 0
    ? Math.max(0, Math.min(100, Math.round((elapsed / totalMs) * 100)))
    : 0;

  return (
    <div className="relative rounded-3xl border border-white/5 bg-black/20 p-6 sm:p-8 space-y-5">
      <div className="flex items-center justify-between gap-3">
        <p
          className={`text-[9px] font-black uppercase tracking-[0.3em] ${
            done ? "text-red-400 animate-pulse" : "text-white/40"
          }`}
        >
          {done ? "Plazo vencido" : "Tiempo restante"}
        </p>
        {done && (
          <span className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.2em] text-red-400">
            <AlertTriangle className="w-3 h-3" />
            Publica ya
          </span>
        )}
      </div>

      {/* Timer */}
      <div className="flex items-baseline justify-center gap-1 sm:gap-2 font-mono tracking-tight">
        <BigTimeUnit value={hh} unit="h" done={done} />
        <BigColon done={done} />
        <BigTimeUnit value={mm} unit="m" done={done} />
        <BigColon done={done} />
        <BigTimeUnit value={ss} unit="s" done={done} />
      </div>

      {/* Progress bar derivada */}
      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <p className="text-[9px] font-black uppercase tracking-[0.24em] text-white/35">
            Progreso estimado
          </p>
          <p className="text-[13px] font-black tabular-nums text-white/80">
            {pct}%
          </p>
        </div>
        <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
          <motion.div
            initial={false}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className={`absolute inset-y-0 left-0 rounded-full ${
              done
                ? "bg-[linear-gradient(90deg,#ef4444_0%,#f87171_100%)]"
                : "bg-[linear-gradient(90deg,#e879f9_0%,#a855f7_50%,#22d3ee_100%)]"
            }`}
          />
        </div>
      </div>
    </div>
  );
}

function BigTimeUnit({
  value,
  unit,
  done,
}: {
  value: string;
  unit: string;
  done: boolean;
}) {
  return (
    <span className="inline-flex items-baseline gap-1">
      <span
        className={`bg-clip-text text-5xl sm:text-6xl font-black leading-none text-transparent tabular-nums ${
          done
            ? "bg-[linear-gradient(135deg,#ef4444_0%,#f87171_100%)] animate-pulse"
            : "bg-[linear-gradient(135deg,#e879f9_0%,#a855f7_50%,#22d3ee_100%)]"
        }`}
      >
        {value}
      </span>
      <span
        className={`text-sm font-bold ${
          done ? "text-red-400/60" : "text-white/35"
        }`}
      >
        {unit}
      </span>
    </span>
  );
}

function BigColon({ done }: { done: boolean }) {
  return (
    <span
      className={`text-4xl sm:text-5xl font-black leading-none animate-pulse ${
        done ? "text-red-400/70" : "text-white/25"
      }`}
    >
      :
    </span>
  );
}

function toMs(value: Date | string | null | undefined): number | null {
  if (value == null) return null;
  if (value instanceof Date) return value.getTime();
  const parsed = new Date(value).getTime();
  return Number.isFinite(parsed) ? parsed : null;
}
