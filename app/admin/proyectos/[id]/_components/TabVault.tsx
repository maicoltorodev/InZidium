"use client";

import React from "react";
import {
  Upload,
  Download,
  Trash2,
  FileText,
  FolderOpen,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function formatSize(bytes: number) {
  if (!bytes) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

interface TabVaultProps {
  project: any;
  uploading: boolean;
  isDragging: boolean;
  isDeletingArchivo: string | null;
  handleUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDragEnter: (e: React.DragEvent) => void;
  handleDragLeave: (e: React.DragEvent) => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent) => void;
  handleDownload: (url: string, filename: string) => void;
  onOpenLightbox: (url: string) => void;
  onRequestDelete: (archivo: any) => void;
}

export function TabVault({
  project,
  uploading,
  isDragging,
  isDeletingArchivo,
  handleUpload,
  handleDragEnter,
  handleDragLeave,
  handleDragOver,
  handleDrop,
  handleDownload,
  onOpenLightbox,
  onRequestDelete,
}: TabVaultProps) {
  return (
    <motion.div
      key="vault"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {isDragging && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center pointer-events-none">
          <div className="flex flex-col items-center gap-6 animate-pulse">
            <Upload className="w-24 h-24 text-emerald-400" />
            <h2 className="text-4xl font-black text-white uppercase tracking-tighter">
              Suelta para subir
            </h2>
          </div>
        </div>
      )}

      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tighter text-white">
            Archivos del proyecto
          </h2>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">
            Archivos y entregables
          </p>
        </div>
        <label
          className={`cursor-pointer px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 transition-all ${uploading ? "bg-gray-800 pointer-events-none" : "bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg hover:shadow-emerald-500/20"}`}
        >
          <input
            type="file"
            className="hidden"
            onChange={handleUpload}
            disabled={uploading}
          />
          {uploading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Upload className="w-4 h-4" />
          )}
          {uploading ? "Cargando..." : "Subir archivo"}
        </label>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <AnimatePresence>
          {project.archivos?.map((archivo: any) => (
            <motion.div
              key={archivo.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="group relative bg-white/[0.04] backdrop-blur-xl border border-white/8 rounded-3xl p-6 hover:border-white/20 transition-all hover:bg-white/[0.06]"
            >
              <div
                className="aspect-square rounded-2xl bg-black/40 flex items-center justify-center mb-4 overflow-hidden relative cursor-pointer"
                onClick={() => {
                  if (isDeletingArchivo === archivo.id) return;
                  if (
                    /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(archivo.nombre)
                  ) {
                    onOpenLightbox(archivo.url);
                  }
                }}
              >
                {/\.(jpg|jpeg|png|gif|webp|svg)$/i.test(archivo.nombre) ? (
                  <img
                    src={archivo.url}
                    alt={archivo.nombre}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                  />
                ) : (
                  <FileText className="w-12 h-12 text-gray-600 group-hover:text-emerald-400 transition-colors" />
                )}

                {/* Deleting overlay */}
                {isDeletingArchivo === archivo.id ? (
                  <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-2">
                    <Loader2 className="w-7 h-7 text-red-400 animate-spin" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-red-400">
                      Eliminando...
                    </span>
                  </div>
                ) : (
                  /* Actions Overlay */
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(archivo.url, archivo.nombre);
                      }}
                      className="p-3 rounded-xl bg-white/10 hover:bg-emerald-500 hover:text-white text-white transition-all"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRequestDelete(archivo);
                      }}
                      className="p-3 rounded-xl bg-white/10 hover:bg-red-500 hover:text-white text-white transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>

              <h3 className="text-xs font-bold text-gray-300 truncate mb-1">
                {archivo.nombre}
              </h3>
              <span className="text-[10px] font-mono text-gray-600 uppercase">
                {formatSize(archivo.tamano)}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>

        {(!project.archivos || project.archivos.length === 0) && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center bg-white/[0.02] border-2 border-dashed border-white/8 rounded-3xl">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4">
              <FolderOpen className="w-10 h-10 text-gray-600" />
            </div>
            <p className="text-gray-500 text-xs font-black uppercase tracking-widest">
              Sin archivos
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
