"use client";

import { useState, useEffect } from "react";
import {
  refetchClienteProyectos,
  loginCliente,
  resumeClienteSession,
  logoutCliente,
  validateClienteSession,
} from "@/lib/actions";
import { useRealtimeRefresh } from "@/hooks/use-realtime-refresh";
import { useProyectoPatcher } from "@/hooks/use-patch-proyecto";
import { useSessionEviction } from "@/hooks/use-session-eviction";
import { useToast } from "@/app/providers/ToastProvider";
import { LoginScreen, ProjectSelector } from "./portal/LoginScreen";
import { PortalPage } from "./portal/PortalPage";
import { LoginSupportFab } from "./portal/LoginSupportFab";
import { AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function CompactProjectsPortal({
  device = "mobile",
  useDesktopLandingBackground = false,
  navbarSlot,
  footerSlot,
}: {
  device?: "desktop" | "tablet" | "mobile";
  useDesktopLandingBackground?: boolean;
  navbarSlot?: React.ReactNode;
  footerSlot?: React.ReactNode;
}) {
  const { showToast } = useToast();
  const [cedula, setCedula] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [error, setError] = useState("");
  const [sessionReady, setSessionReady] = useState(false);
  const [evicted, setEvicted] = useState(false);

  // Auto-login: intenta restaurar sesión desde cookie al montar
  useEffect(() => {
    resumeClienteSession().then((result) => {
      if (result && result.status === "ok") {
        setCedula(result.cedula);
        setData(result);
        if (result.proyectos.length === 1) setSelectedProject(result.proyectos[0]);
      }
      setSessionReady(true);
    });
  }, []);

  // Evicción en tiempo real: si otro dispositivo inicia sesión, cierra esta
  useSessionEviction({
    userId: data?.cliente?.id ?? null,
    table: "clientes",
    validate: validateClienteSession,
    onEvicted: () => {
      setEvicted(true);
      setData(null);
      setSelectedProject(null);
      setCedula("");
    },
  });

  const resetPortal = async () => {
    await logoutCliente();
    setCedula("");
    setData(null);
    setSelectedProject(null);
    setError("");
    setEvicted(false);
  };

  // `selectedProject` ahora es el SERVER STATE crudo. El hook devuelve
  // `displayedProject`, que es server + pending mutations mergeadas — y es
  // lo que los componentes hijos consumen. Refreshes stale ya no pueden
  // pisar cambios recién hechos: las pendings siempre ganan arriba.
  const { savePatch, displayedProject } = useProyectoPatcher({
    project: selectedProject,
    onError: (msg) => showToast(msg, "error"),
  });

  async function refreshPortalData() {
    if (!data) return;
    // [HORARIOS] DEBUG — borrar cuando se confirme el bug
    const callId = Math.random().toString(36).slice(2, 7);
    console.log(`[HORARIOS] refreshPortalData start id=${callId}`);
    const result = await refetchClienteProyectos();
    if (result.status === "not_authenticated") {
      setData(null);
      setSelectedProject(null);
      return;
    }
    if (result.status !== "ok") return;
    setData(result);
    if (selectedProject) {
      const updated = result.proyectos.find((p: any) => p.id === selectedProject.id);
      if (updated) {
        // [HORARIOS] DEBUG
        const h = updated.onboardingData?.hours;
        if (h) {
          console.log(
            `[HORARIOS] refreshPortalData id=${callId} setServerProject hours=${JSON.stringify(h)}`,
          );
        }
        setSelectedProject(updated);
      }
      else setSelectedProject(null);
    }
  }

  useRealtimeRefresh(["proyectos", "chat", "archivos"], refreshPortalData, !!data);

  async function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!cedula) return;
    setLoading(true);
    setError("");
    setData(null);
    setSelectedProject(null);
    try {
      const result = await loginCliente(cedula);
      if (result.status === "rate_limited") {
        setError(`Demasiados intentos. Esperá ${(result as any).resetInSec ?? 60}s.`);
        return;
      }
      if (result.status === "not_found") { setError("No existe ese cliente."); return; }
      if (result.status === "no_projects") { setError("Aún no tienes proyectos."); return; }
      setData(result);
      if (result.proyectos.length === 1) setSelectedProject(result.proyectos[0]);
    } catch {
      setError("Ocurrió un error al buscar. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  const containerMaxWidth = useDesktopLandingBackground ? "max-w-[560px]" : "max-w-md";

  // Loading mientras se verifica la cookie
  if (!sessionReady) {
    return (
      <div className={`fixed inset-0 z-50 flex items-center justify-center ${useDesktopLandingBackground ? "" : "bg-[#020608]"}`}>
        <div className="relative w-40 h-40 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#22d3ee]/20 via-[#a855f7]/20 to-[#e879f9]/20 blur-3xl" />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border-[3px] border-transparent"
            style={{ borderTopColor: "#22d3ee", borderRightColor: "#a855f7" }}
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="absolute inset-6 rounded-full border-[3px] border-transparent"
            style={{ borderBottomColor: "#a855f7", borderLeftColor: "#e879f9" }}
          />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
            className="absolute inset-12 rounded-full border-[3px] border-transparent"
            style={{ borderTopColor: "#e879f9", borderRightColor: "#22d3ee" }}
          />
        </div>
      </div>
    );
  }

  // Pantalla de evicción
  if (evicted) {
    return (
      <main className={`min-h-dvh text-white flex flex-col items-center justify-center px-4 ${useDesktopLandingBackground ? "" : "bg-[#020608]"}`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center space-y-6"
        >
          <div className="mx-auto w-16 h-16 rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-yellow-500" />
          </div>
          <div>
            <h2 className="text-2xl font-black">Sesión cerrada</h2>
            <p className="text-gray-400 mt-2 text-sm">
              Se inició sesión con tu cédula desde otro dispositivo. Solo puedes tener una sesión activa a la vez.
            </p>
          </div>
          <button
            onClick={() => setEvicted(false)}
            className="px-6 py-3 bg-[#E8AA14] text-black font-bold rounded-2xl hover:scale-95 transition-transform"
          >
            Volver al inicio
          </button>
        </motion.div>
      </main>
    );
  }

  if (!data) {
    return (
      <>
        <LoginScreen
          cedula={cedula}
          setCedula={setCedula}
          loading={loading}
          error={error}
          onSubmit={handleSearch}
          useDesktopLandingBackground={useDesktopLandingBackground}
          navbarSlot={navbarSlot}
          footerSlot={footerSlot}
        />
        <LoginSupportFab cedula={cedula} />
      </>
    );
  }

  if (!selectedProject && data.proyectos?.length > 0) {
    return (
      <>
        <ProjectSelector
          data={data}
          onSelect={setSelectedProject}
          onReset={resetPortal}
          useDesktopLandingBackground={useDesktopLandingBackground}
          containerMaxWidth={containerMaxWidth}
        />
      </>
    );
  }

  if (selectedProject && displayedProject) {
    return (
      <>
        <PortalPage
          project={displayedProject}
          clientName={data.cliente.nombre}
          savePatch={savePatch}
          onReset={resetPortal}
          showToast={showToast}
          device={device}
          useDesktopLandingBackground={useDesktopLandingBackground}
        />
      </>
    );
  }

  return null;
}
