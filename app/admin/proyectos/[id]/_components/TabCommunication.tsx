"use client";

import React, { useEffect, useRef } from "react";
import { MessageSquare, Loader2, Send, Upload, X } from "lucide-react";
import { motion } from "framer-motion";

const TZ = "America/Bogota";

function formatMensajeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();

  const toDateKey = (d: Date) =>
    d.toLocaleDateString("es-CO", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" });

  const ayer = new Date(now);
  ayer.setDate(ayer.getDate() - 1);

  const hora = date.toLocaleTimeString("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: TZ,
  });

  if (!dateStr || isNaN(date.getTime())) return "—";

  if (toDateKey(date) === toDateKey(now)) return `Hoy · ${hora}`;
  if (toDateKey(date) === toDateKey(ayer)) return `Ayer · ${hora}`;

  const diaFecha = date.toLocaleDateString("es-CO", {
    day: "numeric",
    month: "short",
    timeZone: TZ,
  });
  return `${diaFecha} · ${hora}`;
}

function primerNombre(nombreCompleto: string): string {
  return nombreCompleto?.trim().split(" ")[0] ?? "Cliente";
}

interface TabCommunicationProps {
  project: any;
  replyNote: string;
  setReplyNote: (val: string) => void;
  sendingReply: boolean;
  handleSendReply: () => void;
  replyImage: string | null;
  setReplyImage: (url: string | null) => void;
  uploadingReplyImg: boolean;
  handleReplyImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function TabCommunication({
  project,
  replyNote,
  setReplyNote,
  sendingReply,
  handleSendReply,
  replyImage,
  setReplyImage,
  uploadingReplyImg,
  handleReplyImageUpload,
}: TabCommunicationProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [project.chat?.length]);

  const clienteNombre = primerNombre(project.cliente?.nombre ?? "");

  return (
    <motion.div
      key="communication"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="h-[calc(100vh-220px)] lg:h-[calc(100vh-180px)]"
    >
      <div className="h-full bg-white/[0.04] backdrop-blur-xl border border-white/8 rounded-3xl overflow-hidden flex flex-col relative">

        {/* Header */}
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black uppercase tracking-tight text-white">
                Mensajes del cliente
              </h2>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                Comunicación directa con {project.cliente?.nombre}
              </p>
            </div>
          </div>
        </div>

        {/* Mensajes */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-4">
          {project.chat && project.chat.length > 0 ? (
            <>
              {project.chat.map((mensaje: any) => {
                const esAdmin = mensaje.autor === "admin";
                const nombreMostrado = esAdmin ? "Admin" : clienteNombre;

                return (
                  <div
                    key={mensaje.id}
                    className={`flex ${esAdmin ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] sm:max-w-[70%] p-4 sm:p-5 rounded-3xl space-y-2 ${
                        esAdmin
                          ? "bg-white/5 border border-white/10 text-white rounded-tr-none"
                          : "bg-blue-500/10 border border-blue-500/20 text-blue-100 rounded-tl-none"
                      }`}
                    >
                      {/* Nombre + hora */}
                      <div className="flex items-center justify-between gap-6">
                        <span
                          className={`text-[10px] font-black uppercase tracking-widest ${
                            esAdmin ? "text-amber-400" : "text-blue-400"
                          }`}
                        >
                          {nombreMostrado}
                        </span>
                        <span className="text-[9px] font-mono text-white/25 whitespace-nowrap">
                          {formatMensajeTime(mensaje.createdAt)}
                        </span>
                      </div>

                      {/* Contenido */}
                      <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium opacity-90">
                        {mensaje.contenido}
                      </p>

                      {/* Imágenes adjuntas */}
                      {mensaje.imagenes && mensaje.imagenes.length > 0 && (
                        <div className="grid grid-cols-2 gap-2 mt-3">
                          {mensaje.imagenes.map((img: string, i: number) => (
                            <a
                              key={i}
                              href={img}
                              target="_blank"
                              className="block w-full aspect-video rounded-lg overflow-hidden border border-white/10 hover:opacity-80 transition-opacity"
                            >
                              <img src={img} className="w-full h-full object-cover" />
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-white/20">
              <div className="w-20 h-20 rounded-full border-2 border-dashed border-white/10 flex items-center justify-center mb-4">
                <MessageSquare className="w-8 h-8" />
              </div>
              <p className="text-xs font-black uppercase tracking-[0.3em]">
                Sin mensajes aún
              </p>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-3 sm:p-6 bg-black/50 border-t border-white/5 space-y-3">
          {replyImage && (
            <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-white/10">
              <img src={replyImage} className="w-full h-full object-cover" />
              <button
                onClick={() => setReplyImage(null)}
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 flex items-center justify-center text-white/70 hover:text-white transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
          <div className="flex items-end gap-2 sm:gap-3">
            <label className={`flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 cursor-pointer items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-white/40 transition-colors hover:bg-white/[0.06] hover:text-white/60 ${uploadingReplyImg || replyImage ? "pointer-events-none opacity-30" : ""}`}>
              <input type="file" accept="image/*" className="hidden" onChange={handleReplyImageUpload} disabled={uploadingReplyImg || !!replyImage} />
              {uploadingReplyImg ? <Loader2 className="h-5 w-5 animate-spin" /> : <Upload className="h-5 w-5" />}
            </label>
            <textarea
              value={replyNote}
              onChange={(e) => setReplyNote(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (!sendingReply && (replyNote.trim() || replyImage)) handleSendReply();
                }
              }}
              placeholder="Escribir mensaje al cliente... (Enter para enviar)"
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-amber-500/50 transition-colors resize-none h-14 min-h-[56px] py-4"
            />
            <button
              onClick={handleSendReply}
              disabled={sendingReply || (!replyNote.trim() && !replyImage)}
              className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-black flex items-center justify-center shadow-lg hover:shadow-orange-500/20 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            >
              {sendingReply ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <Send className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
