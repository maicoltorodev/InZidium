"use client";

import React, { useState, useEffect } from "react";
import { createProyecto, getClientes, getProyectos } from "@/lib/alliance/actions";
import { useToast } from "@/app/providers/ToastProvider";
import {
  Plus,
  FolderKanban,
  ChevronRight,
  Clock,
  Calendar,
  User,
  Layers,
  Search,
  Zap,
  ChevronDown,
  Rocket,
  Smartphone,
  Terminal,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { PLANS, PLANS_ARRAY } from "@/lib/constants";
import { AdminLoading } from "@/lib/ui/AdminLoading";
import { useRealtimeRefresh } from "@/hooks/use-realtime-refresh";

export default function ProjectsAdmin() {
  const [cargando, setCargando] = useState(true);
  const [projects, setProjects] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [errors, setErrors] = useState<any>({});
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [clientSearch, setClientSearch] = useState("");
  const [selectedPlanId, setSelectedPlanId] = useState(PLANS_ARRAY[0].id);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useRealtimeRefresh(["proyectos", "clientes"], loadData);

  async function loadData() {
    const [pData, cData] = await Promise.all([getProyectos(), getClientes()]);
    setProjects(pData);
    setClients(cData);
    setCargando(false);
  }

  if (cargando) return <AdminLoading />;

  const filteredProjects = projects.filter(
    (p) =>
      p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.cliente?.nombre.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="p-4 sm:p-6 lg:p-12 max-w-7xl mx-auto space-y-8 lg:space-y-12">
      <header className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 lg:gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex items-center gap-3 text-[#22d3ee] mb-2">
            <LayerIcon className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] font-[family-name:var(--font-orbitron)]">
              Gestión de proyectos
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tighter">
            Nuestros{" "}
            <span className="bg-gradient-to-r from-[#e879f9] via-[#a855f7] to-[#22d3ee] bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
              Proyectos
            </span>
          </h1>
        </motion.div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
          <div className="relative group flex-1 sm:flex-initial">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-[#22d3ee] transition-colors" />
            <input
              type="text"
              placeholder="Filtrar proyectos..."
              className="bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-6 text-sm focus:outline-none focus:border-[#22d3ee]/50 focus:bg-white/[0.08] transition-all w-full sm:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => {
              setIsAdding(true);
              setSelectedPlanId(PLANS_ARRAY[0].id);
            }}
            className="group relative px-6 py-3 rounded-2xl font-bold text-sm transition-all hover:scale-105 active:scale-95 overflow-hidden shadow-[0_0_20px_rgba(168,85,247,0.12),_0_0_20px_rgba(34,211,238,0.08)]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#e879f9] via-[#a855f7] to-[#22d3ee] animate-gradient bg-[length:200%_auto]" />
            <div className="relative flex items-center justify-center gap-2 text-white">
              <Plus className="w-5 h-5" />
              <span>Crear proyecto</span>
            </div>
          </button>
        </div>
      </header>

      <div className="min-h-[400px]">
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, idx) => {
                const projectPlan =
                  PLANS_ARRAY.find((p) => p.title === project.plan) ||
                  PLANS_ARRAY[0];
                const PlanIcon = projectPlan.icon;

                return (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="group relative"
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${projectPlan.color} opacity-0 group-hover:opacity-10 blur-[80px] transition-all duration-1000 rounded-3xl`}
                    />

                    <div className="relative bg-white/[0.04] backdrop-blur-xl border border-white/8 rounded-3xl p-6 sm:p-8 lg:p-10 hover:border-white/20 transition-all duration-700 flex flex-col h-full overflow-hidden shadow-2xl">
                      <div
                        className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${projectPlan.color} opacity-5 blur-3xl`}
                      />

                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6 sm:mb-8">
                        <div className="flex items-center gap-4 sm:gap-5 min-w-0">
                          <div
                            className={`p-4 rounded-[1.5rem] bg-gradient-to-br ${projectPlan.color} text-white shadow-lg transition-all duration-500 group-hover:rotate-6 group-hover:scale-110 shadow-current/20 shrink-0`}
                          >
                            <PlanIcon className="w-6 h-6" />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[9px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-gray-400 group-hover:border-white/20 transition-colors">
                                {project.plan}
                              </span>
                            </div>
                            <h3 className="text-xl sm:text-2xl font-black group-hover:text-white transition-colors leading-tight tracking-tighter break-words">
                              {project.nombre}
                            </h3>
                          </div>
                        </div>
                        <div className="self-start sm:self-auto flex flex-col gap-2 items-end">
                          <FaseBadge
                            fase={project.fase}
                            freezeMode={!!project.freezeMode}
                          />
                        </div>
                      </div>

                      <div className="mb-6 p-4 sm:p-6 rounded-3xl bg-white/[0.02] border border-white/5 group-hover:bg-white/[0.04] transition-all duration-500">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-gray-500">
                            <User className="w-3 h-3" /> Cliente
                          </div>
                          <p className="text-sm font-bold text-gray-100 truncate">
                            {project.cliente?.nombre}
                          </p>
                        </div>
                      </div>

                      {project.fase === "construccion" && project.fechaEntrega && (
                        <CountdownHero fechaEntrega={project.fechaEntrega} />
                      )}

                      <div className="mt-auto" />

                      <Link
                        href={`/admin/proyectos/${project.id}`}
                        className={`mt-10 w-full py-5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center gap-3 font-black text-xs uppercase tracking-[0.4em] hover:bg-gradient-to-r ${projectPlan.color} hover:text-white hover:border-transparent transition-all duration-500 shadow-xl`}
                      >
                        Examinar{" "}
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-32 text-center"
          >
            <div className="w-24 h-24 bg-white/5 rounded-[2rem] border border-white/10 flex items-center justify-center text-gray-700 mb-8 relative">
              <FolderKanban className="w-10 h-10" />
              <div className="absolute inset-0 bg-gradient-to-br from-[#22d3ee]/5 to-[#a855f7]/5 blur-2xl rounded-full" />
            </div>
            <h2 className="text-2xl font-black mb-3 font-[family-name:var(--font-orbitron)] uppercase tracking-tight text-white">
              No hay proyectos
            </h2>
            <p className="text-gray-500 text-sm max-w-md mb-2 leading-relaxed font-medium">
              No se han detectado proyectos.
              <br />
              Crea el primero para empezar.
            </p>
          </motion.div>
        )}
      </div>

      {/* Modal Nuevo Proyecto */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAdding(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-2xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-[#060214]/90 border border-white/10 w-full max-w-4xl rounded-3xl p-6 sm:p-8 lg:p-12 relative z-10 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#22d3ee]/5 to-[#a855f7]/8 blur-[100px] -z-10" />

              <button
                onClick={() => {
                  setIsAdding(false);
                  setSelectedClient(null);
                  setIsSelectOpen(false);
                }}
                className="absolute top-4 right-4 sm:top-10 sm:right-10 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-gray-500 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all duration-300 group/close z-50"
              >
                <X className="w-6 h-6 group-hover/close:rotate-90 transition-transform duration-300" />
              </button>

              <div className="mb-8 sm:mb-12 pr-12 sm:pr-0">
                <span className="text-xs font-black text-[#22d3ee] uppercase tracking-[0.5em] mb-2 block">
                  Nuevo proyecto
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black font-[family-name:var(--font-orbitron)] tracking-tighter uppercase">
                  Crear proyecto
                </h2>
              </div>

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (isSaving) return;

                  const formData = new FormData(e.currentTarget);
                  const newErrors: any = {};

                  if (!formData.get("nombre"))
                    newErrors.nombre = "Nombre requerido.";
                  if (!formData.get("clienteId"))
                    newErrors.clienteId = "Selecciona un cliente.";

                  if (Object.keys(newErrors).length > 0) {
                    setErrors(newErrors);
                    return;
                  }

                  setIsSaving(true);
                  try {
                    await createProyecto(formData);
                    showToast("PROYECTO INICIALIZADO EXITOSAMENTE", "success");
                    setIsAdding(false);
                    setSelectedClient(null);
                    setErrors({});
                    loadData();
                  } finally {
                    setIsSaving(false);
                  }
                }}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <PremiumInput
                    name="nombre"
                    placeholder="Nombre del proyecto"
                    icon={FolderKanban}
                    error={errors.nombre}
                    onFocus={() => setErrors({ ...errors, nombre: null })}
                  />
                  {/* Custom Select */}
                  <div className="relative group">
                    <div
                      className={`absolute -inset-0.5 rounded-2xl transition-opacity blur-[2px] ${errors.clienteId ? "bg-red-500/40 opacity-100" : "bg-gradient-to-r from-[#22d3ee]/10 to-[#a855f7]/10 opacity-0 group-focus-within:opacity-100"}`}
                    />
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setIsSelectOpen(!isSelectOpen)}
                        className={`w-full bg-white/[0.04] border rounded-2xl py-4 pl-12 pr-6 text-sm text-left flex justify-between items-center transition-all ${errors.clienteId ? "border-red-500/50" : "border-white/8 group-hover:border-white/15"}`}
                      >
                        <User
                          className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${errors.clienteId ? "text-red-400" : "text-gray-500 group-focus-within:text-[#22d3ee]"}`}
                        />
                        <span
                          className={
                            selectedClient
                              ? "text-white font-bold"
                              : "text-gray-500"
                          }
                        >
                          {selectedClient
                            ? selectedClient.nombre
                            : "Seleccionar Cliente"}
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-300 ${isSelectOpen ? "rotate-180" : ""}`}
                        />
                      </button>

                      <input
                        type="hidden"
                        name="clienteId"
                        value={selectedClient?.id || ""}
                      />

                      <AnimatePresence>
                        {isSelectOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute top-full left-0 right-0 mt-3 p-2 bg-[#060214]/95 backdrop-blur-xl border border-white/10 rounded-2xl z-[120] shadow-2xl overflow-hidden"
                          >
                            <div className="relative mb-2">
                              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500" />
                              <input
                                type="text"
                                placeholder="Buscar cliente..."
                                value={clientSearch}
                                onChange={(e) =>
                                  setClientSearch(e.target.value)
                                }
                                className="w-full bg-white/5 border border-white/5 rounded-xl py-2 pl-9 pr-4 text-xs focus:outline-none focus:border-[#22d3ee]/30 transition-all"
                                onClick={(e) => e.stopPropagation()}
                              />
                            </div>
                            <div className="max-h-48 overflow-y-auto custom-scrollbar">
                              {clients
                                .filter((c) =>
                                  c.nombre
                                    .toLowerCase()
                                    .includes(clientSearch.toLowerCase()),
                                )
                                .map((client) => (
                                  <button
                                    key={client.id}
                                    type="button"
                                    onClick={() => {
                                      setSelectedClient(client);
                                      setIsSelectOpen(false);
                                      setErrors({ ...errors, clienteId: null });
                                    }}
                                    className="w-full px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-[#22d3ee]/10 hover:to-[#a855f7]/20 hover:text-white transition-all text-left text-xs font-bold flex items-center gap-3 group/opt"
                                  >
                                    <div className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover/opt:bg-[#22d3ee]" />
                                    {client.nombre}
                                  </button>
                                ))}
                              {clients.filter((c) =>
                                c.nombre
                                  .toLowerCase()
                                  .includes(clientSearch.toLowerCase()),
                              ).length === 0 && (
                                <div className="py-8 text-center text-[10px] text-gray-500 uppercase font-black tracking-widest">
                                  Sin resultados
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Selector de Plan */}
                  <div className="col-span-full">
                    <input
                      type="hidden"
                      name="plan"
                      value={
                        PLANS_ARRAY.find((p) => p.id === selectedPlanId)
                          ?.title ?? PLANS_ARRAY[0].title
                      }
                    />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 block mb-3">
                      Plan
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {PLANS_ARRAY.map((plan) => {
                        const PlanIcon = plan.icon;
                        const isSelected = selectedPlanId === plan.id;
                        return (
                          <button
                            key={plan.id}
                            type="button"
                            onClick={() => setSelectedPlanId(plan.id)}
                            className={`flex items-center gap-4 p-5 rounded-2xl border transition-all text-left ${
                              isSelected
                                ? `bg-gradient-to-r ${plan.color} border-transparent text-white`
                                : "bg-white/[0.04] border-white/8 hover:border-white/20 text-gray-400"
                            }`}
                          >
                            <PlanIcon className="w-5 h-5 shrink-0" />
                            <div>
                              <p className="text-xs font-black uppercase tracking-widest">
                                {plan.title}
                              </p>
                              <p
                                className={`text-[10px] mt-0.5 ${isSelected ? "text-white/70" : "text-gray-600"}`}
                              >
                                {plan.description}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                </div>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="relative group w-full py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-sm transition-all hover:scale-[1.02] active:scale-95 overflow-hidden shadow-[0_10px_30px_rgba(168,85,247,0.15),_0_10px_30px_rgba(34,211,238,0.1)] mt-6 disabled:scale-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#e879f9] via-[#a855f7] to-[#22d3ee] animate-gradient bg-[length:200%_auto]" />
                  <span className="relative text-white flex items-center justify-center gap-2">
                    {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                    {isSaving ? "Creando…" : "Crear proyecto"}
                  </span>
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FaseBadge({
  fase,
  freezeMode,
}: {
  fase: "onboarding" | "construccion" | "publicado" | undefined;
  freezeMode: boolean;
}) {
  const { label, tone } = faseLabel(fase, freezeMode);
  const styles =
    tone === "emerald"
      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
      : tone === "purple"
        ? "bg-[#a855f7]/10 border-[#a855f7]/30 text-[#c084fc]"
        : "bg-amber-500/10 border-amber-500/30 text-amber-400";
  const dot =
    tone === "emerald"
      ? "bg-emerald-500"
      : tone === "purple"
        ? "bg-[#a855f7]"
        : "bg-amber-400";
  return (
    <div
      className={`px-4 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-2 ${styles}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${dot}`} />
      {label}
    </div>
  );
}

function faseLabel(
  fase: "onboarding" | "construccion" | "publicado" | undefined,
  freezeMode: boolean,
): { label: string; tone: "emerald" | "purple" | "amber" } {
  if (fase === "publicado" && !freezeMode)
    return { label: "Publicado", tone: "emerald" };
  if (fase === "publicado" && freezeMode)
    return { label: "Mantenimiento", tone: "amber" };
  if (fase === "construccion")
    return { label: "En construcción", tone: "purple" };
  return { label: "Onboarding", tone: "amber" };
}

function LayerIcon(props: any) {
  return (
    <svg
      {...props}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
      <path d="m2.6 13.92 8.58 3.9a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83l-8.58 3.9a2 2 0 0 0-1.66 0L2.6 12.08a1 1 0 0 0 0 1.83Z" />
      <path d="m2.6 19.92 8.58 3.9a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83l-8.58 3.9a2 2 0 0 0-1.66 0L2.6 18.08a1 1 0 0 0 0 1.83Z" />
    </svg>
  );
}

function PremiumInput({
  icon: Icon,
  placeholder,
  error,
  onFocus,
  ...props
}: any) {
  return (
    <div className="relative group">
      <div
        className={`absolute -inset-0.5 rounded-2xl transition-opacity blur-[2px] ${error ? "bg-red-500/40 opacity-100" : "bg-gradient-to-r from-[#22d3ee]/10 to-[#a855f7]/10 opacity-0 group-focus-within:opacity-100"}`}
      />
      <div className="relative">
        <Icon
          className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${error ? "text-red-400" : "text-gray-500 group-focus-within:text-[#22d3ee]"}`}
        />
        <input
          {...props}
          placeholder={placeholder}
          onFocus={onFocus}
          className={`w-full bg-white/[0.04] border rounded-2xl py-4 pl-12 pr-6 text-sm focus:outline-none transition-all placeholder:text-gray-600 ${error ? "border-red-500/50 focus:border-red-500" : "border-white/8 group-hover:border-white/15 focus:border-[#22d3ee]/50"}`}
        />
      </div>
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="absolute -right-2 top-0 -translate-y-1/2 bg-red-500 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-xl z-20 flex items-center gap-2 pointer-events-none"
          >
            <AlertCircle className="w-3 h-3" />
            {error}
            <div className="absolute bottom-0 right-4 translate-y-full w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-red-500" />
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        @keyframes move-bg {
          0% { background-position: 0 0; }
          100% { background-position: 1rem 1rem; }
        }
      `}</style>
    </div>
  );
}

function CountdownHero({
  fechaEntrega,
}: {
  fechaEntrega: Date | string | null;
}) {
  const endMs =
    fechaEntrega == null
      ? null
      : typeof fechaEntrega === "string"
        ? new Date(fechaEntrega).getTime()
        : fechaEntrega.getTime();
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  if (endMs == null || !Number.isFinite(endMs)) return null;

  const remaining = endMs - now;
  const done = remaining <= 0;
  const totalSec = done ? 0 : Math.floor(remaining / 1000);
  const hh = Math.floor(totalSec / 3600);
  const mm = Math.floor((totalSec % 3600) / 60);
  const ss = totalSec % 60;

  if (done) {
    return (
      <div className="mt-4 rounded-3xl border border-red-500/30 bg-red-500/10 p-6 flex items-center justify-center gap-3">
        <Clock className="w-5 h-5 text-red-400" />
        <span className="text-[11px] font-black uppercase tracking-[0.4em] text-red-400">
          Entrega vencida
        </span>
      </div>
    );
  }

  return (
    <div className="relative mt-4 overflow-hidden rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-cyan-400/[0.06] via-white/[0.02] to-[#a855f7]/[0.06] p-5 sm:p-6">
      <div className="absolute -top-16 -right-16 w-40 h-40 bg-cyan-400/10 blur-[80px] pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-[#a855f7]/10 blur-[80px] pointer-events-none" />
      <div className="relative flex items-baseline justify-center gap-1.5">
        <span className="bg-gradient-to-r from-cyan-300 to-[#a855f7] bg-clip-text text-transparent text-4xl sm:text-5xl font-black tracking-tighter tabular-nums">
          {hh}
        </span>
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-300/60">h</span>
        <span className="bg-gradient-to-r from-cyan-300 to-[#a855f7] bg-clip-text text-transparent text-4xl sm:text-5xl font-black tracking-tighter tabular-nums ml-2">
          {String(mm).padStart(2, "0")}
        </span>
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-300/60">m</span>
        <span className="bg-gradient-to-r from-cyan-300 to-[#a855f7] bg-clip-text text-transparent text-4xl sm:text-5xl font-black tracking-tighter tabular-nums ml-2">
          {String(ss).padStart(2, "0")}
        </span>
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-300/60">s</span>
      </div>
    </div>
  );
}
