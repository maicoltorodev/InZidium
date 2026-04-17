"use client";

import React, { useEffect, useState } from "react";
import {
  MessageSquare,
  FolderOpen,
  Rocket,
  ChevronRight as ChevronRightIcon,
  Sparkles,
  Hammer,
  Rocket as RocketIcon,
  RotateCcw,
} from "lucide-react";
import { motion } from "framer-motion";
import { setProyectoFase, resetBuildTimer } from "@/lib/actions";
import { BUILD_DURATION_HOURS } from "@/lib/constants";
import type { ProjectFase } from "@/lib/data/types";

interface TabOverviewProps {
  project: any;
  progreso: number;
  estado: string;
  projectPlan: any;
  updateProgresoAndEstado: (val: number) => void;
  updateEstadoAndProgreso: (estado: string) => void;
  setActiveTab: (tab: any) => void;
}

export function TabOverview({
  project,
  progreso,
  estado,
  projectPlan,
  updateProgresoAndEstado,
  updateEstadoAndProgreso,
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
      {/* FASE DEL PROYECTO */}
      <FasePanel project={project} />

      {/* SECCIÓN PROGRESS ENGINE */}
      <section className="bg-white/[0.04] backdrop-blur-xl border border-white/8 rounded-3xl p-10 relative overflow-hidden">
        <div className="flex flex-row items-center justify-between gap-12">
          {/* Circular Progress & Value */}
          <div className="flex items-center gap-8">
            <div className="relative w-40 h-40 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-white/5"
                />
                <motion.circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="url(#gradient-progress)"
                  strokeWidth="8"
                  fill="transparent"
                  strokeLinecap="round"
                  strokeDasharray={440}
                  animate={{
                    strokeDashoffset: 440 - (440 * progreso) / 100,
                  }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
                <defs>
                  <linearGradient
                    id="gradient-progress"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#22d3ee" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-white">
                  {progreso}%
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-black uppercase tracking-tighter">
                Progreso del proyecto
              </h2>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest max-w-[200px]">
                Ajusta el progreso y el estado del proyecto.
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex-1 w-full max-w-xl space-y-8">
            <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={progreso}
                onChange={(e) =>
                  updateProgresoAndEstado(parseInt(e.target.value))
                }
                className="w-full h-2 bg-black/50 rounded-full appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between mt-3 px-1">
                <span className="text-[10px] font-black text-gray-600">
                  0%
                </span>
                <span className="text-[10px] font-black text-gray-600">
                  50%
                </span>
                <span className="text-[10px] font-black text-gray-600">
                  100%
                </span>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-3">
              {["Pendiente", "Diseño", "Desarrollo", "Finalizado"].map(
                (label) => {
                  let value = label.toLowerCase();
                  if (label === "Finalizado") value = "completado";
                  const isActive = estado === value;
                  return (
                    <button
                      key={label}
                      onClick={() => updateEstadoAndProgreso(value)}
                      className={`py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${
                        isActive
                          ? `bg-white/10 text-cyan-400 border-cyan-400/30 shadow-[0_0_20px_rgba(34,211,238,0.1)]`
                          : "bg-transparent border-white/5 text-gray-600 hover:border-white/20 hover:text-gray-400"
                      }`}
                    >
                      {label}
                    </button>
                  );
                },
              )}
            </div>
          </div>
        </div>
      </section>

      {/* QUICK STATS & ACTIONS */}
      <div className="grid grid-cols-3 gap-6">
        <div className="p-8 rounded-3xl bg-white/[0.04] backdrop-blur-xl border border-white/8 flex flex-col justify-between h-64 group hover:border-white/15 transition-all">
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

        <div className="p-8 rounded-3xl bg-white/[0.04] backdrop-blur-xl border border-white/8 flex flex-col justify-between h-64 group hover:border-white/15 transition-all">
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

// ─── Fase panel ──────────────────────────────────────────────────────────────

const FASES: { value: ProjectFase; label: string; description: string; icon: React.ElementType }[] = [
  { value: "onboarding",  label: "Onboarding",   description: "Cliente llenando información.",        icon: Sparkles },
  { value: "construccion", label: "Construcción", description: "48h en curso. Cliente bloqueado.",    icon: Hammer },
  { value: "publicado",   label: "Publicado",    description: "Sitio en vivo. Cliente puede editar.", icon: RocketIcon },
];

function FasePanel({ project }: { project: any }) {
  const fase: ProjectFase = (project.fase ?? "onboarding") as ProjectFase;
  const buildStartedAt: Date | string | null = project.buildStartedAt ?? null;

  const [saving, setSaving] = useState(false);

  const selectFase = async (next: ProjectFase) => {
    if (next === fase || saving) return;
    setSaving(true);
    try {
      await setProyectoFase(project.id, next);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (saving) return;
    setSaving(true);
    try {
      await resetBuildTimer(project.id);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="bg-white/[0.04] backdrop-blur-xl border border-white/8 rounded-3xl p-8">
      <div className="flex items-start justify-between gap-6 mb-6">
        <div>
          <h2 className="text-xl font-black uppercase tracking-tighter">Fase del proyecto</h2>
          <p className="mt-1 text-xs font-bold text-gray-500 uppercase tracking-widest">
            Cambia la vista del cliente. Realtime — se propaga automáticamente.
          </p>
        </div>
        {fase === "construccion" && (
          <BuildCountdown buildStartedAt={buildStartedAt} onReset={handleReset} saving={saving} />
        )}
      </div>

      <div className="grid grid-cols-3 gap-3">
        {FASES.map((f) => {
          const active = fase === f.value;
          const Icon = f.icon;
          return (
            <button
              key={f.value}
              type="button"
              onClick={() => selectFase(f.value)}
              disabled={saving}
              className={`rounded-2xl border px-4 py-4 text-left transition-all disabled:opacity-50 ${
                active
                  ? "border-cyan-400/40 bg-cyan-400/[0.05] shadow-[0_0_20px_rgba(34,211,238,0.08)]"
                  : "border-white/5 bg-white/[0.02] hover:border-white/15"
              }`}
            >
              <Icon className={`h-5 w-5 mb-2 ${active ? "text-cyan-400" : "text-white/40"}`} />
              <p className={`text-sm font-black ${active ? "text-cyan-400" : "text-white"}`}>
                {f.label}
              </p>
              <p className="mt-0.5 text-[11px] text-gray-500 leading-snug">
                {f.description}
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
}

// ─── Build countdown display (admin view) ────────────────────────────────────

function BuildCountdown({
  buildStartedAt,
  onReset,
  saving,
}: {
  buildStartedAt: Date | string | null;
  onReset: () => void;
  saving: boolean;
}) {
  const startMs = buildStartedAt
    ? (typeof buildStartedAt === "string"
        ? new Date(buildStartedAt).getTime()
        : buildStartedAt.getTime())
    : null;
  const endMs = startMs != null ? startMs + BUILD_DURATION_HOURS * 3600 * 1000 : null;

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

  return (
    <div className="flex items-center gap-3">
      <div className="rounded-xl border border-cyan-400/20 bg-cyan-400/[0.04] px-4 py-2.5">
        <p className="text-[9px] font-black uppercase tracking-[0.24em] text-cyan-400/60 mb-0.5">
          {done ? "Plazo vencido" : "Tiempo restante"}
        </p>
        <p className="text-xl font-black text-white font-mono tabular-nums">
          {done ? "Toques finales" : `${hh}:${mm}:${ss}`}
        </p>
      </div>
      <button
        type="button"
        onClick={onReset}
        disabled={saving}
        title="Reiniciar contador a 48:00:00"
        className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-[10px] font-black uppercase tracking-widest text-white/60 transition-colors hover:bg-white/[0.06] hover:text-white disabled:opacity-40"
      >
        <RotateCcw className="h-3.5 w-3.5" />
        Reiniciar
      </button>
    </div>
  );
}
