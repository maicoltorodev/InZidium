"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  TrendingUp,
  ChevronRight,
  Gamepad2,
  Zap,
  Database,
  Cloud,
  Lock,
  Activity,
} from "lucide-react";
import { getClientes, getProyectos, getSystemStatus } from "@/lib/actions";
import { useRealtimeRefresh } from "@/hooks/use-realtime-refresh";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { PLANS, PLANS_ARRAY } from "@/lib/constants";
import { AdminLoading } from "@/lib/ui/AdminLoading";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function AdminDashboard() {
  const router = useRouter();
  const [cargando, setCargando] = useState(true);
  const [stats, setStats] = useState({
    clients: 0,
    projects: 0,
    developing: 0,
  });
  const [recentProjects, setRecentProjects] = useState<any[]>([]);
  const [systemStatus, setSystemStatus] = useState({
    database: "...",
    blob: "...",
    auth: "...",
  });

  async function loadDashboardData() {
    const [clients, projects, health] = await Promise.all([
      getClientes(),
      getProyectos(),
      getSystemStatus(),
    ]);

    setStats({
      clients: clients.length,
      projects: projects.length,
      developing: projects.filter(
        (p: any) => p.fase !== "publicado" || p.freezeMode,
      ).length,
    });

    setRecentProjects(projects.slice(0, 5));
    setSystemStatus(health);
    setCargando(false);
  }

  useEffect(() => {
    loadDashboardData();
  }, []);

  useRealtimeRefresh(["clientes", "proyectos"], loadDashboardData);

  if (cargando) return <AdminLoading />;

  return (
    <div className="p-4 sm:p-6 lg:p-12 max-w-7xl mx-auto space-y-8 lg:space-y-12">
      <header className="flex flex-row items-end justify-between gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex items-center gap-3 text-[#22d3ee] mb-2">
            <Gamepad2 className="w-5 h-5 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] font-[family-name:var(--font-orbitron)]">
              Panel de control
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tighter">
            Nuestro{" "}
            <span className="bg-gradient-to-r from-[#e879f9] via-[#a855f7] to-[#22d3ee] bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
              Ecosistema
            </span>
          </h1>
        </motion.div>
      </header>

      {/* Stats Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6"
      >
        <StatCard
          icon={TrendingUp}
          label="Proyectos Totales"
          value={stats.projects}
          color="#e879f9"
        />
        <StatCard
          icon={Users}
          label="Clientes"
          value={stats.clients}
          color="#a855f7"
        />
        <StatCard
          icon={Zap}
          label="En Desarrollo"
          value={stats.developing}
          color="#22d3ee"
        />
      </motion.div>

      {/* Health Monitor Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="relative group bg-white/[0.04] backdrop-blur-xl border border-white/8 rounded-3xl p-6 sm:p-8 lg:p-10 overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 blur-[100px] -z-10" />
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8 xl:gap-12">
          <div className="flex items-center gap-5 sm:gap-8">
            <div className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-emerald-500/10 text-emerald-400 relative shrink-0">
              <Activity className="w-8 h-8 sm:w-10 sm:h-10 animate-pulse" />
              <div className="absolute inset-0 rounded-3xl border border-emerald-500/20 animate-ping opacity-20" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500">
                  Estado del sistema
                </span>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 xl:gap-8 flex-1 xl:max-w-3xl">
            <HealthStat
              icon={Database}
              label="Base de datos"
              value={systemStatus.database}
            />
            <HealthStat
              icon={Cloud}
              label="Almacenamiento"
              value={systemStatus.blob}
            />
            <HealthStat
              icon={Lock}
              label="Autenticación"
              value={systemStatus.auth}
            />
          </div>
        </div>
      </motion.div>

      {/* Recent Projects Table */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="relative group"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#22d3ee]/5 via-[#a855f7]/5 to-[#e879f9]/5 blur-3xl rounded-3xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        <div className="bg-white/[0.04] backdrop-blur-xl border border-white/8 rounded-3xl overflow-hidden">
          <div className="p-6 sm:p-8 border-b border-white/5 text-center">
            <h2 className="text-lg sm:text-xl font-bold font-[family-name:var(--font-orbitron)]">
              Últimos proyectos
            </h2>
            <p className="text-xs text-gray-500 font-medium">
              Resumen en tiempo real de la actividad del sistema
            </p>
          </div>
          <div>
            {recentProjects.length > 0 ? (
              <ul className="divide-y divide-white/5">
                {recentProjects.map((proj, idx) => {
                  const projectPlan =
                    PLANS_ARRAY.find((p) => p.title === proj.plan) ||
                    PLANS_ARRAY[0];

                  return (
                    <li
                      key={idx}
                      onClick={() =>
                        router.push(`/admin/proyectos/${proj.id}`)
                      }
                      className="group/row hover:bg-white/[0.02] transition-colors cursor-pointer"
                    >
                      <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 px-5 sm:px-8 md:px-10 py-6 md:py-8">
                        <div className="flex flex-col md:flex-1">
                          <span
                            className={`font-bold text-lg sm:text-xl group-hover/row:bg-gradient-to-r ${projectPlan.color} group-hover/row:bg-clip-text group-hover/row:text-transparent transition-all`}
                          >
                            {proj.nombre}
                          </span>
                          <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-1">
                            Cliente: {proj.cliente?.nombre}
                          </span>
                        </div>
                        <div className="flex flex-col gap-2 md:flex-1 md:min-w-[200px] md:items-end">
                          <DashboardFaseBadge
                            fase={proj.fase}
                            freezeMode={!!proj.freezeMode}
                          />
                        </div>
                        <div className="hidden md:flex md:justify-end">
                          <Link
                            href={`/admin/proyectos/${proj.id}`}
                            onClick={(e) => e.stopPropagation()}
                            className={`inline-flex h-12 w-12 lg:h-14 lg:w-14 items-center justify-center bg-white/5 rounded-2xl border border-white/5 group-hover/row:border-white/20 transition-all text-gray-500 group-hover/row:text-white group-hover/row:bg-gradient-to-br ${projectPlan.color} group-hover/row:scale-105 active:scale-95 shadow-lg`}
                          >
                            <ChevronRight className="w-6 h-6" />
                          </Link>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="py-24 flex flex-col items-center justify-center text-center px-6">
                <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center text-gray-700 mb-6 border border-white/5">
                  <Database className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold mb-2">
                  No hay proyectos registrados
                </h3>
                <p className="text-gray-500 text-sm max-w-xs mb-8">
                  No se ha detectado actividad. Crea un proyecto para comenzar.
                </p>
                <Link
                  href="/admin/proyectos"
                  className="px-8 py-4 bg-gradient-to-r from-[#e879f9] via-[#a855f7] to-[#22d3ee] text-white font-black uppercase tracking-widest text-[10px] rounded-2xl hover:scale-105 transition-all active:scale-95 shadow-[0_10px_30px_rgba(168,85,247,0.15),_0_10px_30px_rgba(34,211,238,0.1)]"
                >
                  Crear proyecto
                </Link>
              </div>
            )}
          </div>
        </div>
      </motion.section>
    </div>
  );
}

function DashboardFaseBadge({
  fase,
  freezeMode,
}: {
  fase: "onboarding" | "construccion" | "publicado" | undefined;
  freezeMode: boolean;
}) {
  const { label, tone } = dashboardFaseLabel(fase, freezeMode);
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
      className={`px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-2 ${styles}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${dot}`} />
      {label}
    </div>
  );
}

function dashboardFaseLabel(
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

function HealthStat({ icon: Icon, label, value }: any) {
  const isLoading = value === "...";
  const isOk = !isLoading && value === "ok";
  const isError = !isLoading && !isOk;

  const badgeColor = isLoading
    ? "bg-gray-500/10 border-gray-500/20 text-gray-400"
    : isOk
      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
      : "bg-red-500/10 border-red-500/20 text-red-400";
  const dotColor = isLoading
    ? "bg-gray-500"
    : isOk
      ? "bg-emerald-500"
      : "bg-red-400";
  const badgeLabel = isLoading ? "..." : isOk ? "OK" : "Error";

  return (
    <div className="flex flex-col gap-3 p-6 rounded-3xl bg-white/[0.02] border border-white/5 group-hover:border-white/10 transition-all">
      <div className="flex items-center justify-between">
        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-white transition-colors">
          <Icon className="w-5 h-5" />
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1 border rounded-full ${badgeColor}`}>
          <div className={`w-1 h-1 rounded-full ${dotColor}`} />
          <span className="text-[8px] font-black uppercase tracking-widest">
            {badgeLabel}
          </span>
        </div>
      </div>
      <div>
        <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-1">
          {label}
        </p>
        <p className={`text-sm font-bold tracking-wide ${isError ? "text-red-400" : "text-white"}`}>
          {value}
        </p>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: any) {
  return (
    <motion.div
      variants={item}
      className="bg-white/[0.04] backdrop-blur-xl border border-white/8 p-8 rounded-3xl group hover:border-white/15 transition-all cursor-default relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-white/[0.02] rounded-full -mr-8 -mt-8 group-hover:scale-150 transition-transform duration-700" />
      <div className="relative z-10">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 bg-white/5 border border-white/5 group-hover:scale-110 transition-transform duration-500"
          style={{ color }}
        >
          <Icon className="w-6 h-6" />
        </div>
        <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">
          {label}
        </p>
        <h3 className="text-4xl font-black text-white font-[family-name:var(--font-orbitron)] tracking-tight">
          {value}
        </h3>
      </div>
    </motion.div>
  );
}
