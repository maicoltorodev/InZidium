"use client";

import React from "react";
import {
  Settings2,
  Edit2,
  ShieldAlert,
  Trash2,
  X,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PLANS_ARRAY } from "@/lib/constants";
import { ModalConfirm } from "./ModalConfirm";

interface TabSettingsProps {
  project: any;
  projectPlan: any;
  visibilidad: boolean;
  togglingVisibilidad: boolean;
  handleToggleVisibilidad: () => void;

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

  // Date editing
  isEditingDate: boolean;
  setIsEditingDate: (val: boolean) => void;
  tempDate: string;
  setTempDate: (val: string) => void;
  handleUpdateFecha: () => void;

  // Link editing
  isEditingLink: boolean;
  setIsEditingLink: (val: boolean) => void;
  tempLink: string;
  setTempLink: (val: string) => void;
  handleConfirmLinkChange: () => void;

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
  visibilidad,
  togglingVisibilidad,
  handleToggleVisibilidad,
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
  isEditingDate,
  setIsEditingDate,
  tempDate,
  setTempDate,
  handleUpdateFecha,
  isEditingLink,
  setIsEditingLink,
  tempLink,
  setTempLink,
  handleConfirmLinkChange,
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
        <div className="p-8 rounded-[2.5rem] bg-[#0a0a0a]/50 border border-white/5 space-y-8">
          <div className="flex items-center gap-4 border-b border-white/5 pb-6">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white">
              <Settings2 className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tighter">
              Configuración general
            </h2>
          </div>

          <div className="space-y-6">
            {/* Date Editor */}
            <div className="flex items-center justify-between p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-white mb-1">
                  Fecha de inicio
                </h3>
                <p className="text-[10px] text-gray-500 font-bold uppercase">
                  {new Date(project.createdAt).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => {
                  setIsEditingDate(true);
                  setTempDate(
                    new Date(project.createdAt).toISOString().split("T")[0],
                  );
                }}
                className="p-2 text-gray-500 hover:text-white transition-colors"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            </div>

            {/* Link Editor */}
            <div className="flex items-center justify-between p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-white mb-1">
                  Enlace público
                </h3>
                <p className="text-[10px] text-gray-500 font-bold uppercase max-w-[200px] truncate">
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

            {/* Plan Editor */}
            <div className="flex items-center justify-between p-6 rounded-2xl bg-white/[0.02] border border-white/5">
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

            {/* Visibility Toggle Detailed */}
            <div className="flex items-center justify-between p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-black uppercase tracking-widest text-white">
                    Estado de acceso
                  </h3>
                  <span
                    className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wide ${visibilidad ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}
                  >
                    {visibilidad ? "Visible" : "Oculto"}
                  </span>
                </div>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide max-w-[280px]">
                  {visibilidad
                    ? "El cliente puede acceder a su panel de seguimiento."
                    : "El acceso del cliente está restringido temporalmente."}
                </p>
              </div>
              <button
                onClick={handleToggleVisibilidad}
                disabled={togglingVisibilidad}
                className={`relative w-14 h-8 rounded-full border transition-all ${
                  visibilidad
                    ? "bg-emerald-500/10 border-emerald-500/20"
                    : "bg-white/5 border-white/10"
                }`}
              >
                <motion.div
                  animate={{ x: visibilidad ? 26 : 4 }}
                  className={`w-5 h-5 rounded-full shadow-lg mt-1 ${visibilidad ? "bg-emerald-400" : "bg-gray-500"}`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* DANGER ZONE */}
        <div className="p-8 rounded-[2.5rem] bg-red-500/[0.02] border border-red-500/10">
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
            <div className="bg-[#0a0a0a] border border-white/10 w-full max-w-5xl rounded-[3rem] p-12 overflow-hidden relative">
              <div className="flex justify-between mb-8">
                <h3 className="text-2xl font-black text-white uppercase">
                  Cambiar plan
                </h3>
                <button onClick={() => setIsEditingPlan(false)}>
                  <X className="text-gray-500 hover:text-white" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
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
                      className={`p-8 rounded-3xl border flex items-center gap-5 transition-all text-left ${isCurrent ? "bg-white/10 border-white/20" : "bg-transparent border-white/5 hover:bg-white/5"}`}
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
            <div className="bg-[#0a0a0a] border border-amber-500/30 w-full max-w-md rounded-[2.5rem] p-10 relative z-10">
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

      {/* Modal DATE EDIT */}
      {isEditingDate && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="bg-[#0a0a0a] border border-white/10 p-8 rounded-3xl w-full max-w-sm">
            <h3 className="text-white font-black uppercase mb-4 text-center">
              Editar fecha
            </h3>
            <input
              type="date"
              value={tempDate}
              onChange={(e) => setTempDate(e.target.value)}
              className="w-full bg-white/5 border-white/10 rounded-xl p-4 text-white mb-6 block text-center color-white-scheme"
            />
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setIsEditingDate(false)}
                className="py-3 text-xs font-bold text-gray-500 border border-white/10 rounded-xl"
              >
                Cancelar
              </button>
              <button
                onClick={handleUpdateFecha}
                className="py-3 text-xs font-black text-black bg-white rounded-xl"
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
          <div className="bg-[#0a0a0a] border border-white/10 p-8 rounded-3xl w-full max-w-md">
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
          <div className="w-full max-w-md bg-black border border-red-900/30 p-10 rounded-[3rem] text-center">
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
