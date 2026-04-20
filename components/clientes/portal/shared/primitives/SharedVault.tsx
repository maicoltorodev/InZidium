"use client";

import React, { useCallback, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Download,
  Trash2,
  FileText,
  FolderOpen,
  Loader2,
  X,
  UserRound,
  Briefcase,
} from "lucide-react";
import { uploadProjectFile } from "@/lib/client/upload-archivo";
import { deleteArchivo } from "@/lib/actions";
import { BRAND_ICON_STYLE } from "./BrandDefs";

function formatSize(bytes: number) {
  if (!bytes) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

const isImage = (name: string) => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(name);

/**
 * Carpeta compartida admin ↔ cliente: ambos suben y ven lo mismo. Nada
 * se borra salvo por acción manual. Pensado para proyectos "a la medida"
 * que no caben en el wizard de secciones.
 */
export function SharedVault({
  project,
  showToast,
  variant = "desktop",
  uploadedBy = "cliente",
  className,
}: {
  project: any;
  showToast: (msg: string, type: "success" | "error") => void;
  variant?: "desktop" | "mobile";
  uploadedBy?: "cliente" | "admin";
  className?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<any>(null);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const dragCounter = useRef(0);

  const archivos: any[] = Array.isArray(project?.archivos) ? project.archivos : [];

  const processFile = useCallback(
    async (file: File) => {
      if (uploading) return;
      setUploading(true);
      try {
        const result = await uploadProjectFile({
          file,
          proyectoId: project.id,
          subidoPor: uploadedBy,
        });
        if (!result.success) showToast(result.error || "No se pudo subir", "error");
        else showToast("Archivo subido", "success");
      } catch {
        showToast("No se pudo subir", "error");
      } finally {
        setUploading(false);
      }
    },
    [project.id, showToast, uploadedBy, uploading],
  );

  const onFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (f) await processFile(f);
  };

  const onDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (dragCounter.current === 1) setIsDragging(true);
  };
  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) setIsDragging(false);
  };
  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const onDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounter.current = 0;
    const f = e.dataTransfer.files?.[0];
    if (f) await processFile(f);
  };

  const handleDownload = async (url: string, filename: string) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch {
      showToast("No se pudo descargar", "error");
    }
  };

  const confirmDeletion = async () => {
    if (!confirmDelete) return;
    const id = confirmDelete.id;
    setConfirmDelete(null);
    setDeletingId(id);
    const res = await deleteArchivo(id);
    if (!res.success) showToast("No se pudo eliminar", "error");
    setDeletingId(null);
  };

  const gridCols =
    variant === "mobile"
      ? "grid-cols-2"
      : "grid-cols-2 md:grid-cols-3 xl:grid-cols-4";

  return (
    <>
      <motion.section
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
        className={`relative rounded-[2rem] border border-white/[0.08] bg-[linear-gradient(135deg,rgba(232,121,249,0.04)_0%,rgba(168,85,247,0.03)_50%,rgba(34,211,238,0.04)_100%)] p-5 sm:p-7 ${className ?? ""}`}
      >
        {/* Header */}
        <div className="mb-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[linear-gradient(135deg,rgba(232,121,249,0.12)_0%,rgba(168,85,247,0.12)_50%,rgba(34,211,238,0.12)_100%)] ring-1 ring-[#a855f7]/25">
              <FolderOpen className="h-4 w-4" style={BRAND_ICON_STYLE} />
            </div>
            <div>
              <h2 className="text-[13px] font-black uppercase tracking-[0.24em] text-white">
                Archivos del proyecto
              </h2>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/30">
                Compartido con el estudio
              </p>
            </div>
          </div>
          <label
            className={`cursor-pointer inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#e879f9] via-[#a855f7] to-[#22d3ee] px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-white transition-all ${
              uploading ? "pointer-events-none opacity-60" : "hover:scale-[1.02]"
            }`}
          >
            <input
              type="file"
              className="hidden"
              onChange={onFileInput}
              disabled={uploading}
            />
            {uploading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Upload className="h-3.5 w-3.5" strokeWidth={3} />
            )}
            {uploading ? "Subiendo" : "Subir"}
          </label>
        </div>

        {/* Grid */}
        <div className={`grid ${gridCols} gap-3 sm:gap-4`}>
          <AnimatePresence>
            {archivos.map((archivo: any) => (
              <motion.div
                key={archivo.id}
                layout
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3 transition-all hover:border-white/15 hover:bg-white/[0.04]"
              >
                <div
                  className="relative aspect-square overflow-hidden rounded-xl bg-black/40 flex items-center justify-center cursor-pointer"
                  onClick={() => {
                    if (deletingId === archivo.id) return;
                    if (isImage(archivo.nombre)) setLightbox(archivo.url);
                  }}
                >
                  {isImage(archivo.nombre) ? (
                    <img
                      src={archivo.url}
                      alt={archivo.nombre}
                      className="h-full w-full object-cover opacity-85 transition-opacity group-hover:opacity-100"
                    />
                  ) : (
                    <FileText className="h-10 w-10 text-white/40" />
                  )}

                  {deletingId === archivo.id ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/80">
                      <Loader2 className="h-6 w-6 animate-spin text-red-400" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-red-400">
                        Eliminando
                      </span>
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(archivo.url, archivo.nombre);
                        }}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-emerald-500"
                        aria-label="Descargar"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setConfirmDelete(archivo);
                        }}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-red-500"
                        aria-label="Eliminar"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="mt-2.5 flex items-center gap-1.5">
                  {archivo.subidoPor === "admin" ? (
                    <Briefcase className="h-2.5 w-2.5 shrink-0 text-[#22d3ee]/60" />
                  ) : (
                    <UserRound className="h-2.5 w-2.5 shrink-0 text-[#e879f9]/60" />
                  )}
                  <p className="truncate text-[11px] font-bold text-white/80">
                    {archivo.nombre}
                  </p>
                </div>
                <span className="mt-0.5 block text-[9px] font-mono uppercase text-white/30">
                  {formatSize(archivo.tamano)}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>

          {archivos.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-white/[0.08] bg-white/[0.01] py-12">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5">
                <FolderOpen className="h-6 w-6 text-white/25" />
              </div>
              <p className="text-center text-[11px] font-bold uppercase tracking-[0.22em] text-white/35">
                Sin archivos todavía
                <br />
                <span className="text-white/20">Arrastra o pulsa subir</span>
              </p>
            </div>
          )}
        </div>

        {/* Drag overlay */}
        <AnimatePresence>
          {isDragging && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 rounded-[2rem] border-2 border-dashed border-[#a855f7]/60 bg-black/70 backdrop-blur-sm"
            >
              <Upload className="h-12 w-12 animate-bounce" style={BRAND_ICON_STYLE} />
              <p className="text-sm font-black uppercase tracking-[0.3em] text-white">
                Suelta para subir
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>

      {/* Lightbox (via portal para escapar transform parents) */}
      {lightbox && typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            <motion.div
              key="lightbox"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLightbox(null)}
              className="fixed inset-0 z-[400] flex items-center justify-center bg-black/92 p-4 sm:p-10"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightbox(null);
                }}
                className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-white transition hover:bg-white/20"
                aria-label="Cerrar"
              >
                <X className="h-5 w-5" />
              </button>
              <motion.img
                src={lightbox}
                initial={{ scale: 0.92, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.92, opacity: 0 }}
                className="max-h-full max-w-full rounded-2xl object-contain shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />
            </motion.div>
          </AnimatePresence>,
          document.body,
        )}

      {/* Modal de confirmación de delete */}
      {confirmDelete && typeof document !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 z-[400] flex items-center justify-center bg-black/80 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-sm rounded-3xl border border-white/10 bg-[#060214] p-6 text-center shadow-2xl"
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 ring-1 ring-red-500/30">
                <Trash2 className="h-6 w-6 text-red-400" />
              </div>
              <h3 className="text-base font-black uppercase tracking-tight text-white">
                Eliminar archivo
              </h3>
              <p className="mt-2 text-sm text-white/60 break-all">
                {confirmDelete.nombre}
              </p>
              <p className="mt-3 text-[11px] text-white/40 leading-relaxed">
                Esta acción no se puede deshacer.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setConfirmDelete(null)}
                  className="rounded-xl border border-white/10 bg-white/5 py-3 text-[11px] font-black uppercase tracking-widest text-white/70 transition hover:bg-white/10"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={confirmDeletion}
                  className="rounded-xl bg-red-500 py-3 text-[11px] font-black uppercase tracking-widest text-white transition hover:bg-red-600"
                >
                  Eliminar
                </button>
              </div>
            </motion.div>
          </div>,
          document.body,
        )}
    </>
  );
}
