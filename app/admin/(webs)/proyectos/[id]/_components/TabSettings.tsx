"use client";

import React from "react";
import {
  Settings2,
  Edit2,
  ShieldAlert,
  Trash2,
  X,
  Loader2,
  Lock,
  Unlock,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PLANS_ARRAY } from "@/lib/constants";
import { ModalConfirm } from "@/components/ui/ModalConfirm";
import { DeployPanel } from "./DeployPanel";
import { toggleProyectoLinkLock } from "@/lib/alliance/actions";
import { useToast } from "@/app/providers/ToastProvider";

interface TabSettingsProps {
  project: any;
  projectPlan: any;

  // Plan editing
  isEditingPlan: boolean;
  setIsEditingPlan: (val: boolean) => void;
  pendingPlan: string | null;
  setPendingPlan: (val: string | null) => void;
  showConfirmPlan: boolean;
  setShowConfirmPlan: (val: boolean) => void;
  showVerifyName: boolean;
  setShowVerifyName: (val: boolean) => void;
  verifyInput: string;
  setVerifyInput: (val: string) => void;
  handleConfirmPlanChange: () => void;
  handleUpdatePlan: () => void;

  // Link editing
  isEditingLink: boolean;
  setIsEditingLink: (val: boolean) => void;
  tempLink: string;
  setTempLink: (val: string) => void;
  handleConfirmLinkChange: () => void;

  // Nombre editing
  isEditingNombre: boolean;
  setIsEditingNombre: (val: boolean) => void;
  tempNombre: string;
  setTempNombre: (val: string) => void;
  handleConfirmNombreChange: () => void;

  // Delete project
  showConfirmDeleteProject: boolean;
  setShowConfirmDeleteProject: (val: boolean) => void;
  deleteConfirmInput: string;
  setDeleteConfirmInput: (val: string) => void;
  isDeletingProject: boolean;
  handleDeleteProject: () => void;

  saving: boolean;
}

export function TabSettings({
  project,
  projectPlan,
  isEditingPlan,
  setIsEditingPlan,
  pendingPlan,
  setPendingPlan,
  showConfirmPlan,
  setShowConfirmPlan,
  showVerifyName,
  setShowVerifyName,
  verifyInput,
  setVerifyInput,
  handleConfirmPlanChange,
  handleUpdatePlan,
  isEditingLink,
  setIsEditingLink,
  tempLink,
  setTempLink,
  handleConfirmLinkChange,
  isEditingNombre,
  setIsEditingNombre,
  tempNombre,
  setTempNombre,
  handleConfirmNombreChange,
  showConfirmDeleteProject,
  setShowConfirmDeleteProject,
  deleteConfirmInput,
  setDeleteConfirmInput,
  isDeletingProject,
  handleDeleteProject,
  saving,
}: TabSettingsProps) {
  return (
    <>
      <motion.div
        key="settings"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="max-w-3xl mx-auto space-y-8"
      >
        <DeployPanel project={project} />

        <div className="p-6 sm:p-8 rounded-3xl bg-white/[0.04] backdrop-blur-xl border border-white/8 space-y-6 sm:space-y-8">
          <div className="flex items-center gap-4 border-b border-white/5 pb-6">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white shrink-0">
              <Settings2 className="w-6 h-6" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tighter">
              Configuración general
            </h2>
          </div>

          <div className="space-y-6">
            {/* Nombre Editor */}
            <div className="flex items-center justify-between gap-4 p-4 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="min-w-0 flex-1">
                <h3 className="text-xs font-black uppercase tracking-widest text-white mb-1">
                  Nombre del proyecto
                </h3>
                <p className="text-[10px] text-gray-500 font-bold uppercase truncate">
                  {project.nombre || "Sin nombre"}
                </p>
              </div>
              <button
                onClick={() => {
                  setIsEditingNombre(true);
                  setTempNombre(project.nombre || "");
                }}
                className="p-2 text-gray-500 hover:text-white transition-colors"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            </div>

            {/* Link Editor */}
            <div className="flex items-center justify-between gap-4 p-4 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-white mb-1">
                  Enlace público
                </h3>
                <p className="text-[10px] text-gray-500 font-bold uppercase max-w-[160px] sm:max-w-[200px] truncate">
                  {project.link ||
                    (project.onboardingData?.dominioUno
                      ? `www.${project.onboardingData.dominioUno}.com`
                      : "No definido")}
                </p>
              </div>
              <button
                onClick={() => {
                  setIsEditingLink(true);
                  setTempLink(
                    project.link ||
                      (project.onboardingData?.dominioUno
                        ? `www.${project.onboardingData.dominioUno}.com`
                        : ""),
                  );
                }}
                className="p-2 text-gray-500 hover:text-white transition-colors"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            </div>

            {/* Lock del dominio: si está activo, el cliente no puede editar el
                campo de dominio en su portal. El admin sigue pudiendo editarlo
                desde acá libremente. */}
            <LinkLockRow project={project} />


            {/* Plan Editor */}
            <div className="flex items-center justify-between gap-4 p-4 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-white mb-1">
                  Plan contratado
                </h3>
                <p
                  className={`text-[10px] font-black uppercase bg-gradient-to-r ${projectPlan.color} bg-clip-text text-transparent`}
                >
                  {project.plan}
                </p>
              </div>
              <button
                onClick={() => setIsEditingPlan(true)}
                className="p-2 text-gray-500 hover:text-white transition-colors"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

        {/* DANGER ZONE */}
        <div className="p-6 sm:p-8 rounded-[2.5rem] bg-red-500/[0.02] border border-red-500/10">
          <h3 className="text-red-500 font-black uppercase tracking-widest text-xs mb-6 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4" /> Zona de riesgo
          </h3>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-bold text-sm">
                Eliminar proyecto
              </h4>
              <p className="text-gray-500 text-[10px] mt-1">
                Esta acción borrará todos los datos y archivos permanentemente.
              </p>
            </div>
            <button
              onClick={() => {
                setDeleteConfirmInput("");
                setShowConfirmDeleteProject(true);
              }}
              className="px-6 py-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest border border-red-500/20"
            >
              Eliminar
            </button>
          </div>
        </div>
      </motion.div>

      {/* Modal PLAN EDIT */}
      <AnimatePresence>
        {isEditingPlan && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#060214]/95 border border-white/10 w-full max-w-5xl rounded-3xl p-6 sm:p-8 lg:p-12 overflow-hidden relative max-h-[90vh] overflow-y-auto custom-scrollbar">
              <div className="flex justify-between mb-8">
                <h3 className="text-2xl font-black text-white uppercase">
                  Cambiar plan
                </h3>
                <button onClick={() => setIsEditingPlan(false)}>
                  <X className="text-gray-500 hover:text-white" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {PLANS_ARRAY.map((planOption) => {
                  const isCurrent = project.plan === planOption.title;
                  const Icon = planOption.icon;
                  return (
                    <button
                      key={planOption.id}
                      onClick={() => {
                        if (!isCurrent) {
                          setPendingPlan(planOption.title);
                          setIsEditingPlan(false);
                          setShowConfirmPlan(true);
                        }
                      }}
                      className={`p-5 sm:p-6 lg:p-8 rounded-3xl border flex items-center gap-4 sm:gap-5 transition-all text-left ${isCurrent ? "bg-white/10 border-white/20" : "bg-transparent border-white/5 hover:bg-white/5"}`}
                    >
                      <Icon
                        className={`w-8 h-8 shrink-0 ${isCurrent ? "text-white" : "text-gray-600"}`}
                      />
                      <div>
                        <span
                          className={`text-sm font-black uppercase tracking-widest block ${isCurrent ? "text-white" : "text-gray-500"}`}
                        >
                          {planOption.title}
                        </span>
                        <span
                          className={`text-[10px] mt-1 block ${isCurrent ? "text-white/60" : "text-gray-700"}`}
                        >
                          {planOption.description}
                        </span>
                      </div>
                      {isCurrent && (
                        <span className="ml-auto text-[9px] font-black uppercase tracking-widest text-white/40 border border-white/10 px-2 py-1 rounded-full">
                          Actual
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal CONFIRM PLAN */}
      <AnimatePresence>
        {showConfirmPlan && (
          <ModalConfirm
            title="Confirmar cambio"
            message={
              <>
                Vas a cambiar a{" "}
                <span className="text-white font-black">{pendingPlan}</span>.
                ¿Deseas continuar?
              </>
            }
            onCancel={() => setShowConfirmPlan(false)}
            onConfirm={handleConfirmPlanChange}
            confirmText="Sí, cambiar"
          />
        )}
      </AnimatePresence>

      {/* Modal VERIFY NAME */}
      <AnimatePresence>
        {showVerifyName && (
          <div className="fixed inset-0 z-[140] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <div className="bg-[#060214]/95 border border-amber-500/30 w-full max-w-md rounded-3xl p-6 sm:p-10 relative z-10">
              <h3 className="text-xl font-black text-center text-white mb-4">
                Verificación de seguridad
              </h3>
              <p className="text-center text-gray-500 text-xs mb-6">
                Escribe{" "}
                <span className="text-white font-bold">{project.nombre}</span>{" "}
                para confirmar.
              </p>
              <input
                value={verifyInput}
                onChange={(e) => setVerifyInput(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-center text-white mb-6 focus:border-amber-500 outline-none"
                placeholder="Nombre del proyecto"
              />
              <div className="flex gap-4">
                <button
                  onClick={() => setShowVerifyName(false)}
                  className="flex-1 py-4 rounded-xl border border-white/10 text-gray-500 font-bold text-xs uppercase hover:bg-white/5"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleUpdatePlan}
                  disabled={verifyInput.trim() !== project.nombre}
                  className="flex-1 py-4 rounded-xl bg-amber-500 text-black font-black text-xs uppercase hover:bg-amber-600 disabled:opacity-50"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal NOMBRE EDIT */}
      {isEditingNombre && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="bg-[#060214]/95 border border-white/10 p-6 sm:p-8 rounded-3xl w-full max-w-md">
            <h3 className="text-white font-black uppercase mb-4 text-center">
              Editar nombre del proyecto
            </h3>
            <input
              value={tempNombre}
              onChange={(e) => setTempNombre(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && tempNombre.trim()) {
                  handleConfirmNombreChange();
                }
              }}
              autoFocus
              className="w-full bg-white/5 border-white/10 rounded-xl p-4 text-white mb-6 outline-none focus:border-blue-500"
              placeholder="Ej. Pizzería Don Juan"
            />
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setIsEditingNombre(false)}
                className="py-3 text-xs font-bold text-gray-500 border border-white/10 rounded-xl"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmNombreChange}
                disabled={!tempNombre.trim()}
                className="py-3 text-xs font-black text-black bg-white rounded-xl disabled:opacity-40"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal LINK EDIT */}
      {isEditingLink && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="bg-[#060214]/95 border border-white/10 p-6 sm:p-8 rounded-3xl w-full max-w-md">
            <h3 className="text-white font-black uppercase mb-4 text-center">
              Editar enlace
            </h3>
            <input
              value={tempLink}
              onChange={(e) => setTempLink(e.target.value)}
              className="w-full bg-white/5 border-white/10 rounded-xl p-4 text-white mb-6 outline-none focus:border-blue-500"
              placeholder="https://..."
            />
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setIsEditingLink(false)}
                className="py-3 text-xs font-bold text-gray-500 border border-white/10 rounded-xl"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmLinkChange}
                className="py-3 text-xs font-black text-black bg-white rounded-xl"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal DELETE PROJECT */}
      {showConfirmDeleteProject && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl">
          <div className="w-full max-w-md bg-[#060214]/95 border border-red-900/30 p-6 sm:p-10 rounded-3xl text-center">
            <Trash2 className="w-12 h-12 text-red-600 mx-auto mb-6" />
            <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-2">
              Eliminar proyecto
            </h2>
            <p className="text-gray-500 text-xs font-bold mb-8">
              Escribe &quot;eliminar {project.nombre}&quot; para confirmar.
            </p>
            <input
              value={deleteConfirmInput}
              onChange={(e) => setDeleteConfirmInput(e.target.value)}
              className="w-full bg-red-900/10 border border-red-900/30 rounded-xl p-4 text-center text-red-100 mb-6 outline-none focus:border-red-500"
              placeholder={`eliminar ${project.nombre}`}
            />
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setShowConfirmDeleteProject(false)}
                className="py-4 text-xs font-bold text-gray-400 border border-white/10 rounded-xl hover:bg-white/5"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteProject}
                disabled={
                  deleteConfirmInput !== `eliminar ${project.nombre}` ||
                  isDeletingProject
                }
                className="py-4 text-xs font-black text-white bg-red-600 rounded-xl hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isDeletingProject ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : null}
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Toggle dominio bloqueado/desbloqueado. Self-contained — llama el server action
// directo y se actualiza vía realtime. No deciamos al cliente "está bloqueado"
// (decisión del owner) — solo cambia su UI a read-only.
function LinkLockRow({ project }: { project: any }) {
  const [saving, setSaving] = React.useState(false);
  const { showToast } = useToast();
  const locked = !!project.linkLocked;

  const onToggle = async () => {
    if (saving) return;
    setSaving(true);
    try {
      const res = await toggleProyectoLinkLock(project.id, !locked);
      if (res.success) {
        showToast(locked ? "DOMINIO DESBLOQUEADO" : "DOMINIO BLOQUEADO", "success");
      } else {
        showToast(res.error || "ERROR", "error");
      }
    } catch {
      showToast("ERROR DE CONEXIÓN", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex items-center justify-between gap-4 p-4 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/5">
      <div className="flex items-center gap-3 min-w-0">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors ${
            locked
              ? "bg-amber-500/10 ring-1 ring-amber-500/30"
              : "bg-white/[0.04] ring-1 ring-white/[0.06]"
          }`}
        >
          {locked ? (
            <Lock className="w-4 h-4 text-amber-400" />
          ) : (
            <Unlock className="w-4 h-4 text-white/40" />
          )}
        </div>
        <div className="min-w-0">
          <h3 className="text-xs font-black uppercase tracking-widest text-white mb-1">
            Bloquear dominio
          </h3>
          <p className="text-[10px] text-gray-500 font-bold uppercase">
            {locked
              ? "El cliente no puede editarlo"
              : "El cliente puede editarlo desde su portal"}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onToggle}
        disabled={saving}
        aria-pressed={locked}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors disabled:opacity-50 ${
          locked
            ? "bg-[linear-gradient(135deg,#f59e0b,#d97706)] shadow-[0_0_12px_-2px_rgba(245,158,11,0.6)]"
            : "bg-white/[0.1]"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-md transition-all ${
            locked ? "right-0.5" : "left-0.5"
          }`}
        />
      </button>
    </div>
  );
}
