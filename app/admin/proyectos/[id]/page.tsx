"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  getProyectos,
  updateProyectoProgreso,
  updateProyectoVisibilidad,
  deleteArchivo,
  updateProyectoPlan,
  updateProyectoFecha,
  updateProyectoLink,
  deleteProyecto,
  addChatMessage,
  updateProyectoPrecioCustom,
} from "@/lib/actions";
import { useToast } from "@/app/providers/ToastProvider";
import {
  Loader2,
  Save,
  ChevronLeft,
  User,
  Grid,
  MessageCircle,
  FolderOpen,
  Cpu,
  Briefcase,
  TrendingUp,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import {
  PLANS_ARRAY,
  getStatusFromProgress,
  getProgressFromStatus,
} from "@/lib/constants";
import { uploadProjectFile } from "@/lib/client/upload-archivo";
import { useRealtimeRefresh } from "@/hooks/use-realtime-refresh";
import { AdminLoading } from "@/lib/ui/AdminLoading";

import { NavTab } from "./_components/NavTab";
import { ModalConfirm } from "./_components/ModalConfirm";
import { TabOverview } from "./_components/TabOverview";
import { TabCommunication } from "./_components/TabCommunication";
import { TabVault } from "./_components/TabVault";
import { TabBriefing } from "./_components/TabBriefing";
import { TabSettings } from "./_components/TabSettings";
import { TabFinance } from "./_components/TabFinance";

type TabType =
  | "overview"
  | "communication"
  | "vault"
  | "settings"
  | "briefing"
  | "finance";

export default function ProyectoDetalle() {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [progreso, setProgreso] = useState(0);
  const [estado, setEstado] = useState("");
  const [visibilidad, setVisibilidad] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  // Estados de UI y Modales
  const [uploading, setUploading] = useState(false);
  const [togglingVisibilidad, setTogglingVisibilidad] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [archivoToDelete, setArchivoToDelete] = useState<any>(null);
  const [deleteArchivoStep, setDeleteArchivoStep] = useState<1 | 2>(1);
  const [isDeletingArchivo, setIsDeletingArchivo] = useState<string | null>(null);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const [isEditingPlan, setIsEditingPlan] = useState(false);
  const [pendingPlan, setPendingPlan] = useState<string | null>(null);
  const [showConfirmPlan, setShowConfirmPlan] = useState(false);
  const [showVerifyName, setShowVerifyName] = useState(false);
  const [verifyInput, setVerifyInput] = useState("");
  const [hasPendingChanges, setHasPendingChanges] = useState(false);
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
  const [isEditingDate, setIsEditingDate] = useState(false);
  const [tempDate, setTempDate] = useState("");
  const [isEditingLink, setIsEditingLink] = useState(false);
  const [tempLink, setTempLink] = useState("");
  const [showConfirmDeleteProject, setShowConfirmDeleteProject] = useState(false);
  const [deleteConfirmInput, setDeleteConfirmInput] = useState("");
  const [isDeletingProject, setIsDeletingProject] = useState(false);
  const [replyNote, setReplyNote] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const [replyImage, setReplyImage] = useState<string | null>(null);
  const [uploadingReplyImg, setUploadingReplyImg] = useState(false);

  const dragCounter = useRef(0);
  const { showToast } = useToast();
  const prevFilesCount = useRef(-1);

  // --- EFFECT: Carga Inicial ---
  useEffect(() => {
    loadProject();
  }, []);

  // Realtime: recarga silenciosamente si cambia algo en el proyecto, chat o archivos
  useRealtimeRefresh(["proyectos", "chat", "archivos"], () => loadProject(true));

  // --- EFFECT: Notificación Nuevos Archivos ---
  useEffect(() => {
    if (project?.archivos) {
      const currentCount = project.archivos.length;
      if (
        prevFilesCount.current !== -1 &&
        currentCount > prevFilesCount.current
      ) {
        const lastFile = project.archivos[currentCount - 1];
        if (lastFile.subidoPor === "cliente") {
          showToast("¡NUEVO ARCHIVO DEL CLIENTE!", "success");
        } else {
          showToast("ARCHIVO SUBIDO", "success");
        }
      }
      prevFilesCount.current = currentCount;
    }
  }, [project?.archivos]);

  // --- EFFECT: Protección de Navegación ---
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasPendingChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasPendingChanges]);

  // --- LOGIC: Carga de Datos ---
  async function loadProject(silent = false) {
    if (!silent) setLoading(true);
    try {
      const projects = await getProyectos();
      const p = projects.find((p: any) => p.id === params.id);
      if (p) {
        setProject(p);
        if (!hasPendingChanges) {
          setProgreso(p.progreso);
          setEstado(p.estado);
          setVisibilidad(p.visibilidad ?? true);
        }
      }
    } catch (error) {
      console.error("Polling error", error);
    } finally {
      if (!silent) setLoading(false);
    }
  }

  // --- LOGIC: Updates & Sync ---
  const updateProgresoAndEstado = (val: number) => {
    setProgreso(val);
    setEstado(getStatusFromProgress(val));
    setHasPendingChanges(true);
  };

  const updateEstadoAndProgreso = (nuevoEstado: string) => {
    setEstado(nuevoEstado);
    setProgreso(getProgressFromStatus(nuevoEstado));
    setHasPendingChanges(true);
  };

  async function handleSyncChanges() {
    setSaving(true);
    const result = await updateProyectoProgreso(
      params.id as string,
      progreso,
      estado,
    );
    if (result.success) {
      showToast("CAMBIOS SINCRONIZADOS", "success");
      setHasPendingChanges(false);
      await loadProject();
      if (pendingNavigation) {
        router.push(pendingNavigation);
        setPendingNavigation(null);
      }
    } else {
      showToast("ERROR DE SINCRONIZACIÓN", "error");
    }
    setSaving(false);
  }

  const handleConfirmLinkChange = async () => {
    if (!project) return;
    setSaving(true);
    try {
      const result = await updateProyectoLink(project.id, tempLink);
      if (result.success) {
        showToast("ENLACE ACTUALIZADO", "success");
        setIsEditingLink(false);
        loadProject();
      } else {
        showToast("ERROR AL ACTUALIZAR", "error");
      }
    } catch (error) {
      showToast("ERROR DE CONEXIÓN", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!project) return;
    setIsDeletingProject(true);
    try {
      const result = await deleteProyecto(project.id);
      if (result.success) {
        showToast("PROYECTO ELIMINADO", "success");
        router.push("/admin/clientes");
      } else {
        showToast("ERROR AL ELIMINAR", "error");
        setIsDeletingProject(false);
      }
    } catch (error) {
      setIsDeletingProject(false);
    }
  };

  const handleReplyImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !project) return;
    setUploadingReplyImg(true);
    const result = await uploadProjectFile({ file, proyectoId: project.id, subidoPor: "admin", oldUrl: replyImage ?? undefined });
    if (result.success && result.url) setReplyImage(result.url);
    else showToast(result.error || "Error al subir imagen", "error");
    setUploadingReplyImg(false);
  };

  const handleSendReply = async () => {
    if (!replyNote.trim() && !replyImage || !project) return;
    setSendingReply(true);
    try {
      const imagenes = replyImage ? [replyImage] : [];
      const result = await addChatMessage(project.id, replyNote, "admin", imagenes);
      if (result.success) {
        setReplyNote("");
        setReplyImage(null);
        await loadProject(true);
        showToast("MENSAJE ENVIADO", "success");
      } else {
        showToast("ERROR AL ENVIAR", "error");
      }
    } catch (e) {
      showToast("ERROR AL ENVIAR", "error");
    } finally {
      setSendingReply(false);
    }
  };

  async function handleUpdateFecha() {
    if (!tempDate) return;
    setSaving(true);
    // Ajustar zona horaria añadiendo 'T12:00:00' para evitar desfases de día
    const result = await updateProyectoFecha(
      params.id as string,
      new Date(tempDate + "T12:00:00"),
    );
    if (result.success) {
      showToast("FECHA ACTUALIZADA", "success");
      setIsEditingDate(false);
      await loadProject();
    } else {
      showToast("ERROR AL ACTUALIZAR", "error");
    }
    setSaving(false);
  }

  async function handleToggleVisibilidad() {
    setTogglingVisibilidad(true);
    const nuevaVisibilidad = !visibilidad;
    await updateProyectoVisibilidad(params.id as string, nuevaVisibilidad);
    setVisibilidad(nuevaVisibilidad);
    setTogglingVisibilidad(false);
  }

  // --- LOGIC: Files ---
  async function processFile(file: File) {
    setUploading(true);

    const result = await uploadProjectFile({
      file,
      proyectoId: params.id as string,
      subidoPor: "admin",
    });

    if (result.error) {
      showToast(result.error, "error");
    } else {
      await loadProject();
    }
    setUploading(false);
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files?.[0]) return;
    await processFile(e.target.files[0]);
  }

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (dragCounter.current === 1) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounter.current = 0;
    const file = e.dataTransfer.files?.[0];
    if (file) await processFile(file);
  };

  async function handleDeleteArchivo() {
    if (!archivoToDelete) return;
    const id = archivoToDelete.id;
    // Cerrar modal inmediatamente para evitar doble click
    setArchivoToDelete(null);
    setDeleteArchivoStep(1);
    setIsDeletingArchivo(id);
    const result = await deleteArchivo(id);
    if (result.success) {
      showToast("ARCHIVO ELIMINADO", "info");
      await loadProject();
    } else {
      showToast("ERROR AL ELIMINAR", "error");
    }
    setIsDeletingArchivo(null);
  }

  const handleDownload = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      showToast("DESCARGA INICIADA", "success");
    } catch (error) {
      showToast("ERROR DE DESCARGA", "error");
    }
  };

  // --- LOGIC: Planes ---
  async function handleUpdatePlan() {
    if (!pendingPlan || verifyInput.trim() !== project.nombre.trim()) return;
    setShowVerifyName(false);
    setVerifyInput("");
    setSaving(true);
    const result = await updateProyectoPlan(params.id as string, pendingPlan);
    if (result.success) {
      showToast(`PLAN ACTUALIZADO A ${pendingPlan.toUpperCase()}`, "success");
      await loadProject();
    } else {
      showToast("ERROR AL ACTUALIZAR PLAN", "error");
    }
    setSaving(false);
    setPendingPlan(null);
  }

  const handleConfirmPlanChange = async () => {
    setShowConfirmPlan(false);
    setShowVerifyName(true);
  };

  // --- HELPER: Navegación ---
  const handleNavigation = (path: string) => {
    if (hasPendingChanges) {
      setPendingNavigation(path);
      setShowUnsavedModal(true);
    } else {
      router.push(path);
    }
  };

  const handleDiscardChanges = () => {
    setHasPendingChanges(false);
    setShowUnsavedModal(false);
    if (pendingNavigation) {
      router.push(pendingNavigation);
      setPendingNavigation(null);
    }
  };

  if (loading) return <AdminLoading />;

  if (!project)
    return (
      <div className="min-h-screen flex items-center justify-center text-white font-black uppercase tracking-widest">
        Proyecto no encontrado
      </div>
    );

  const projectPlan =
    PLANS_ARRAY.find((p) => p.title === project.plan) || PLANS_ARRAY[0];

  // --- RENDER ---
  return (
    <div className="text-white flex flex-col font-sans selection:bg-[#22d3ee] selection:text-black lg:min-h-screen lg:overflow-hidden">
      {/* TOP BAR / HEADER */}
      <header className="border-b border-white/5 bg-[#060214]/80 backdrop-blur-xl flex flex-col lg:flex-row lg:items-center lg:justify-between lg:h-20 px-4 sm:px-6 lg:px-8 py-3 lg:py-0 gap-3 lg:gap-4 shrink-0 z-50">
        <div className="flex items-center gap-4 lg:gap-6 min-w-0">
          <button
            onClick={() => handleNavigation("/admin/proyectos")}
            className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors shrink-0"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex flex-col min-w-0">
            <h1 className="text-base sm:text-lg lg:text-xl font-black tracking-tight uppercase leading-tight flex flex-wrap items-center gap-2 min-w-0">
              <span className="truncate">{project.nombre}</span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] bg-gradient-to-r ${projectPlan.color} text-white font-black uppercase tracking-widest shrink-0`}
              >
                {project.plan}
              </span>
            </h1>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2 truncate">
              <User className="w-3 h-3 shrink-0" /> <span className="truncate">{project.cliente?.nombre}</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 flex-wrap lg:flex-nowrap">
          <AnimatePresence>
            {hasPendingChanges && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={handleSyncChanges}
                disabled={saving}
                className={`px-4 sm:px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-lg hover:shadow-cyan-500/20 transition-all ${saving ? "bg-gray-800" : "bg-gradient-to-r from-cyan-500 to-blue-500"}`}
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span className="hidden sm:inline">Guardar cambios</span>
                <span className="sm:hidden">Guardar</span>
              </motion.button>
            )}
          </AnimatePresence>

          <div className="hidden lg:block h-8 w-[1px] bg-white/10 mx-2" />

          <div className="flex items-center gap-3 px-3 sm:px-4 py-2 rounded-full border border-white/10 bg-white/5">
            <div
              className={`w-2 h-2 rounded-full bg-gradient-to-r ${projectPlan.color} animate-pulse`}
            />
            <span className="text-[10px] font-black uppercase tracking-widest text-white truncate">
              {estado}
            </span>
          </div>

          <button
            onClick={handleToggleVisibilidad}
            disabled={togglingVisibilidad}
            className={`lg:hidden flex items-center gap-2 px-3 py-2 rounded-full border transition-all ${
              visibilidad
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                : "bg-red-500/10 border-red-500/20 text-red-400"
            }`}
            aria-label="Cambiar visibilidad"
          >
            {togglingVisibilidad ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <div className={`w-2 h-2 rounded-full ${visibilidad ? "bg-emerald-500" : "bg-red-500"}`} />
            )}
            <span className="text-[10px] font-black uppercase tracking-widest">
              {visibilidad ? "Online" : "Offline"}
            </span>
          </button>
        </div>
      </header>

      {/* MAIN WORKSPACE LAYOUT */}
      <div className="flex flex-col lg:flex-row lg:flex-1 lg:overflow-hidden relative">
        {/* BACKGROUND FX */}
        <div
          className={`absolute top-[-50%] left-[-20%] w-[50%] h-[100%] rounded-full bg-gradient-to-br ${projectPlan.color} opacity-[0.03] blur-[150px] pointer-events-none`}
        />

        {/* SIDEBAR NAVIGATION (desktop) */}
        <aside className="w-64 border-r border-white/5 bg-[#060214]/60 hidden lg:flex flex-col shrink-0">
          <nav className="flex-1 p-4 space-y-2">
            <NavTab
              active={activeTab === "overview"}
              onClick={() => setActiveTab("overview")}
              icon={Grid}
              label="Resumen"
              color="text-blue-400"
            />
            <NavTab
              active={activeTab === "finance"}
              onClick={() => setActiveTab("finance")}
              icon={TrendingUp}
              label="Pagos"
              color="text-emerald-400"
            />
            <NavTab
              active={activeTab === "communication"}
              onClick={() => setActiveTab("communication")}
              icon={MessageCircle}
              label="Mensajes"
              notificationCount={
                project.chat?.filter((n: any) => n.autor !== "admin").length
              }
              color="text-amber-400"
            />
            <NavTab
              active={activeTab === "vault"}
              onClick={() => setActiveTab("vault")}
              icon={FolderOpen}
              label="Archivos"
              notificationCount={project.archivos?.length}
              color="text-emerald-400"
            />
            <NavTab
              active={activeTab === "briefing"}
              onClick={() => setActiveTab("briefing")}
              icon={Briefcase}
              label="Información"
              color="text-purple-400"
            />
            <NavTab
              active={activeTab === "settings"}
              onClick={() => setActiveTab("settings")}
              icon={Cpu}
              label="Configuración"
              color="text-gray-400"
            />
          </nav>

          <div className="p-4 border-t border-white/5">
            <div className="bg-white/5 rounded-xl p-4">
              <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest block mb-3">
                Visibilidad Cliente
              </span>
              <button
                onClick={handleToggleVisibilidad}
                disabled={togglingVisibilidad}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border transition-all ${
                  visibilidad
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20"
                    : "bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20"
                }`}
              >
                <span className="text-[10px] font-black uppercase tracking-widest">
                  {visibilidad ? "ONLINE" : "OFFLINE"}
                </span>
                {togglingVisibilidad ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <div
                    className={`w-2 h-2 rounded-full ${visibilidad ? "bg-emerald-500 shadow-[0_0_8px_#10b981]" : "bg-red-500 shadow-[0_0_8px_#ef4444]"}`}
                  />
                )}
              </button>
            </div>
          </div>
        </aside>

        {/* CONTENT AREA */}
        <main className="lg:flex-1 lg:overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          {/* Mobile/tablet horizontal tabs */}
          <div className="lg:hidden sticky top-14 z-30 bg-[#060214]/90 backdrop-blur-xl border-b border-white/5">
            <nav className="flex gap-1 overflow-x-auto px-3 py-2 scrollbar-none">
              {[
                { key: "overview", label: "Resumen", icon: Grid, color: "text-blue-400" },
                { key: "finance", label: "Pagos", icon: TrendingUp, color: "text-emerald-400" },
                { key: "communication", label: "Mensajes", icon: MessageCircle, color: "text-amber-400", count: project.chat?.filter((n: any) => n.autor !== "admin").length },
                { key: "vault", label: "Archivos", icon: FolderOpen, color: "text-emerald-400", count: project.archivos?.length },
                { key: "briefing", label: "Info", icon: Briefcase, color: "text-purple-400" },
                { key: "settings", label: "Ajustes", icon: Cpu, color: "text-gray-400" },
              ].map((t) => {
                const Icon = t.icon;
                const active = activeTab === t.key;
                return (
                  <button
                    key={t.key}
                    onClick={() => setActiveTab(t.key as TabType)}
                    className={`relative shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${active ? "bg-white/10 text-white" : "text-gray-500 hover:text-white hover:bg-white/5"}`}
                  >
                    <Icon className={`w-4 h-4 ${active ? t.color : ""}`} />
                    <span className="text-[10px] font-black uppercase tracking-widest">{t.label}</span>
                    {t.count !== undefined && t.count > 0 && (
                      <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">{t.count}</span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-4 sm:p-6 lg:p-12 max-w-6xl mx-auto">
            <AnimatePresence mode="wait">
              {activeTab === "overview" && (
                <TabOverview
                  key="overview"
                  project={project}
                  progreso={progreso}
                  estado={estado}
                  projectPlan={projectPlan}
                  updateProgresoAndEstado={updateProgresoAndEstado}
                  updateEstadoAndProgreso={updateEstadoAndProgreso}
                  setActiveTab={setActiveTab}
                />
              )}

              {activeTab === "communication" && (
                <TabCommunication
                  key="communication"
                  project={project}
                  replyNote={replyNote}
                  setReplyNote={setReplyNote}
                  sendingReply={sendingReply}
                  handleSendReply={handleSendReply}
                  replyImage={replyImage}
                  setReplyImage={setReplyImage}
                  uploadingReplyImg={uploadingReplyImg}
                  handleReplyImageUpload={handleReplyImageUpload}
                />
              )}

              {activeTab === "vault" && (
                <TabVault
                  key="vault"
                  project={project}
                  uploading={uploading}
                  isDragging={isDragging}
                  isDeletingArchivo={isDeletingArchivo}
                  handleUpload={handleUpload}
                  handleDragEnter={handleDragEnter}
                  handleDragLeave={handleDragLeave}
                  handleDragOver={handleDragOver}
                  handleDrop={handleDrop}
                  handleDownload={handleDownload}
                  onOpenLightbox={(url) => setLightboxUrl(url)}
                  onRequestDelete={(archivo) => setArchivoToDelete(archivo)}
                />
              )}

              {activeTab === "briefing" && (
                <TabBriefing
                  key="briefing"
                  project={project}
                />
              )}

              {activeTab === "settings" && (
                <TabSettings
                  key="settings"
                  project={project}
                  projectPlan={projectPlan}
                  visibilidad={visibilidad}
                  togglingVisibilidad={togglingVisibilidad}
                  handleToggleVisibilidad={handleToggleVisibilidad}
                  isEditingPlan={isEditingPlan}
                  setIsEditingPlan={setIsEditingPlan}
                  pendingPlan={pendingPlan}
                  setPendingPlan={setPendingPlan}
                  showConfirmPlan={showConfirmPlan}
                  setShowConfirmPlan={setShowConfirmPlan}
                  showVerifyName={showVerifyName}
                  setShowVerifyName={setShowVerifyName}
                  verifyInput={verifyInput}
                  setVerifyInput={setVerifyInput}
                  handleConfirmPlanChange={handleConfirmPlanChange}
                  handleUpdatePlan={handleUpdatePlan}
                  isEditingDate={isEditingDate}
                  setIsEditingDate={setIsEditingDate}
                  tempDate={tempDate}
                  setTempDate={setTempDate}
                  handleUpdateFecha={handleUpdateFecha}
                  isEditingLink={isEditingLink}
                  setIsEditingLink={setIsEditingLink}
                  tempLink={tempLink}
                  setTempLink={setTempLink}
                  handleConfirmLinkChange={handleConfirmLinkChange}
                  showConfirmDeleteProject={showConfirmDeleteProject}
                  setShowConfirmDeleteProject={setShowConfirmDeleteProject}
                  deleteConfirmInput={deleteConfirmInput}
                  setDeleteConfirmInput={setDeleteConfirmInput}
                  isDeletingProject={isDeletingProject}
                  handleDeleteProject={handleDeleteProject}
                  saving={saving}
                />
              )}

              {activeTab === "finance" && (
                <TabFinance
                  key="finance"
                  project={project}
                  projectId={params.id as string}
                  onUpdatePrecio={async (precio) => {
                    await updateProyectoPrecioCustom(params.id as string, precio);
                    await loadProject(true);
                  }}
                />
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* --- MODALES (que viven fuera del área de tabs) --- */}

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 lg:left-80 z-[300] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 sm:p-10"
            onClick={() => setLightboxUrl(null)}
          >
            <button
              onClick={() => setLightboxUrl(null)}
              className="absolute top-6 right-6 p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-all"
            >
              <X className="w-6 h-6" />
            </button>
            <motion.img
              src={lightboxUrl}
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal DELETE ARCHIVO - Step 1 */}
      {archivoToDelete && deleteArchivoStep === 1 && (
        <ModalConfirm
          title="Eliminar archivo"
          message={`¿Quieres eliminar "${archivoToDelete.nombre}"?`}
          onCancel={() => {
            setArchivoToDelete(null);
            setDeleteArchivoStep(1);
          }}
          onConfirm={() => setDeleteArchivoStep(2)}
          confirmText="Sí, eliminar"
          isDestructive
        />
      )}

      {/* Modal DELETE ARCHIVO - Step 2 */}
      {archivoToDelete && deleteArchivoStep === 2 && (
        <ModalConfirm
          title="¿Completamente seguro?"
          message="Esta acción eliminará el archivo del storage de forma permanente. No hay vuelta atrás."
          onCancel={() => {
            setArchivoToDelete(null);
            setDeleteArchivoStep(1);
          }}
          onConfirm={handleDeleteArchivo}
          confirmText="Sí, estoy seguro"
          isDestructive
        />
      )}

      {/* Modal UNSAVED */}
      {showUnsavedModal && (
        <ModalConfirm
          title="Cambios sin guardar"
          message="Tienes cambios pendientes. ¿Quieres guardarlos antes de salir?"
          onCancel={handleDiscardChanges}
          onConfirm={async () => {
            setShowUnsavedModal(false);
            await handleSyncChanges();
          }}
          confirmText="Guardar y salir"
          cancelText="Cancelar"
        />
      )}
    </div>
  );
}
