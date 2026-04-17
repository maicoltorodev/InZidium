"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  getProyectoByCedula,
  updateProyectoOnboarding,
  loginCliente,
  resumeClienteSession,
  logoutCliente,
} from "@/lib/actions";
import { useRealtimeRefresh } from "@/hooks/use-realtime-refresh";
import { useSessionEviction } from "@/hooks/use-session-eviction";
import { useToast } from "@/app/providers/ToastProvider";
import { LoginScreen, ProjectSelector } from "./portal/LoginScreen";
import { PortalPage } from "./portal/PortalPage";
import { AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

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

  const projectRef = useRef(selectedProject);
  useEffect(() => { projectRef.current = selectedProject; }, [selectedProject]);

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
  useSessionEviction(data?.cliente?.id ?? null, () => {
    setEvicted(true);
    setData(null);
    setSelectedProject(null);
    setCedula("");
  });

  const resetPortal = async () => {
    await logoutCliente();
    setCedula("");
    setData(null);
    setSelectedProject(null);
    setError("");
    setEvicted(false);
  };

  const savePatch = useCallback(
    async (patch: Record<string, any>) => {
      const proj = projectRef.current;
      if (!proj) return;
      const merged = { ...(proj.onboardingData || {}), ...patch };
      if (patch.dominioUno !== undefined) {
        merged.seoCanonicalUrl = patch.dominioUno ? `https://www.${patch.dominioUno}.com` : "";
      }
      setSelectedProject((prev: any) =>
        prev ? { ...prev, onboardingData: merged } : prev
      );
      try {
        await updateProyectoOnboarding(proj.id, 1, merged);
      } catch {
        showToast("No se pudo guardar. Inténtalo de nuevo.", "error");
      }
    },
    [showToast]
  );

  async function refreshPortalData() {
    if (!cedula || !data) return;
    const result = await getProyectoByCedula(cedula);
    if (result.status !== "ok") { setData(null); setSelectedProject(null); return; }
    setData(result);
    if (selectedProject) {
      const updated = result.proyectos.find((p: any) => p.id === selectedProject.id);
      if (updated) {
        setSelectedProject((prev: any) => ({
          ...updated,
          onboardingData: prev?.onboardingData ?? updated.onboardingData,
        }));
      } else setSelectedProject(null);
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
      if (result.status === "not_found") { setError("No existe ese cliente."); return; }
      if (result.status === "no_projects") { setError("Aún no tienes proyectos."); return; }
      if (result.status === "all_hidden") { setError("Tus proyectos están ocultos."); return; }
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
      <main className={`min-h-dvh flex items-center justify-center ${useDesktopLandingBackground ? "" : "bg-[#020608]"}`}>
        <div className="flex flex-col items-center gap-8">
          <div className="relative w-24 h-24 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#22d3ee]/15 to-[#e879f9]/15 blur-2xl" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full border-2 border-transparent"
              style={{ borderTopColor: "#22d3ee", borderRightColor: "#a855f7" }}
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute inset-4 rounded-full border-2 border-transparent"
              style={{ borderBottomColor: "#a855f7", borderLeftColor: "#e879f9" }}
            />
            <motion.div
              animate={{ scale: [1, 1.08, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Image src="/logo.webp" alt="InZidium" width={32} height={32} className="object-contain" />
            </motion.div>
          </div>
          <div className="w-32 h-[2px] rounded-full bg-white/5 overflow-hidden">
            <motion.div
              className="h-full w-full rounded-full"
              style={{ background: "linear-gradient(to right, #22d3ee, #a855f7, #e879f9)" }}
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.1 }}
            />
          </div>
        </div>
      </main>
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
    );
  }

  if (!selectedProject && data.proyectos?.length > 0) {
    return (
      <ProjectSelector
        data={data}
        onSelect={setSelectedProject}
        onReset={resetPortal}
        useDesktopLandingBackground={useDesktopLandingBackground}
        containerMaxWidth={containerMaxWidth}
      />
    );
  }

  if (selectedProject) {
    return (
      <PortalPage
        project={selectedProject}
        clientName={data.cliente.nombre}
        savePatch={savePatch}
        onReset={resetPortal}
        showToast={showToast}
        device={device}
        useDesktopLandingBackground={useDesktopLandingBackground}
      />
    );
  }

  return null;
}
