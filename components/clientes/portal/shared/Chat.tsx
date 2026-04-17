"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Send, Plus, X, MessageSquare, Check } from "lucide-react";
import { addChatMessage } from "@/lib/actions";
import { uploadProjectFile } from "@/lib/client/upload-archivo";
import { ESTUDIO_CONFIG } from "@/lib/config";
import { MOTION } from "./primitives/motion";

const TZ = "America/Bogota";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function dateKey(date: Date): string {
  return date.toLocaleDateString("es-CO", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

function formatHour(date: Date): string {
  return date.toLocaleTimeString("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: TZ,
  });
}

function dateLabel(date: Date): string {
  const now = new Date();
  const ayer = new Date(now);
  ayer.setDate(ayer.getDate() - 1);
  if (dateKey(date) === dateKey(now)) return "Hoy";
  if (dateKey(date) === dateKey(ayer)) return "Ayer";
  return date.toLocaleDateString("es-CO", {
    day: "numeric",
    month: "long",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    timeZone: TZ,
  });
}

type Msg = {
  id: string;
  autor: string;
  contenido?: string;
  nota?: string;
  imagenes?: string[];
  createdAt: string;
};

type Group = { key: string; label: string; messages: Msg[] };

function groupByDay(msgs: Msg[]): Group[] {
  const groups = new Map<string, Group>();
  for (const m of msgs) {
    const d = new Date(m.createdAt);
    if (isNaN(d.getTime())) continue;
    const k = dateKey(d);
    let g = groups.get(k);
    if (!g) {
      g = { key: k, label: dateLabel(d), messages: [] };
      groups.set(k, g);
    }
    g.messages.push(m);
  }
  return Array.from(groups.values());
}

// ─── Component ────────────────────────────────────────────────────────────────

export type ChatVariant = "mobile" | "tablet" | "desktop";

export function Chat({
  project,
  showToast,
  variant = "mobile",
}: {
  project: any;
  showToast: (msg: string, type: "success" | "error") => void;
  variant?: ChatVariant;
}) {
  const [note, setNote] = useState("");
  const [sending, setSending] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [uploadingImg, setUploadingImg] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  const adminNombre = ESTUDIO_CONFIG.nombre.split(" ")[0];
  const messages: Msg[] = project.chat || [];

  const groups = useMemo(() => groupByDay(messages), [messages]);

  // Scroll al último mensaje
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || images.length >= 1) return;
    setUploadingImg(true);
    try {
      const res = await uploadProjectFile({
        file, proyectoId: project.id, subidoPor: "cliente",
      });
      if (res.success && res.url) setImages([res.url]);
      else showToast(res.error || "Error al subir la imagen", "error");
    } finally {
      setUploadingImg(false);
    }
  };

  const handleSend = async () => {
    if ((!note.trim() && images.length === 0) || sending) return;
    setSending(true);
    try {
      await addChatMessage(project.id, note, "cliente", images);
      setNote("");
      setImages([]);
    } catch {
      showToast("Error al enviar el mensaje", "error");
    } finally {
      setSending(false);
    }
  };

  const canSend = !sending && (note.trim() !== "" || images.length > 0);

  // Ancho máximo del chat para que no se sienta exagerado en desktop/tablet.
  const containerMaxW =
    variant === "desktop" ? "max-w-[720px]" :
    variant === "tablet"  ? "max-w-[640px]" :
                            ""; // mobile usa el ancho natural del SectionScreen

  // Bordes laterales sutiles solo en desktop/tablet — delimitan el "canal" del chat.
  const hasLateral = variant !== "mobile";
  const lateralBorders = hasLateral ? "border-x border-white/[0.05]" : "";
  const lateralPadding = hasLateral ? "px-5" : "";

  const innerWrap = `mx-auto w-full ${containerMaxW} ${lateralBorders} ${lateralPadding}`;

  return (
    <div className="flex h-full flex-col">
      {/* Messages area */}
      <div
        ref={scrollRef}
        className={`flex-1 overflow-y-auto pt-4 ${hasLateral ? "" : "px-4"}`}
        style={{ overscrollBehavior: "contain" }}
      >
        <div className={`${innerWrap} min-h-full`}>
        {messages.length === 0 ? (
          <EmptyState adminNombre={adminNombre} />
        ) : (
          <div className="space-y-6">
            {groups.map((g) => (
              <div key={g.key}>
                {/* Day separator */}
                <div className="mb-3 flex items-center justify-center">
                  <span className="rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                    {g.label}
                  </span>
                </div>
                <div className="space-y-2">
                  {g.messages.map((m, i) => {
                    const prev = g.messages[i - 1];
                    const mine = m.autor === "cliente";
                    const prevMine = prev?.autor === "cliente";
                    const stacked =
                      !!prev &&
                      mine === prevMine &&
                      new Date(m.createdAt).getTime() -
                        new Date(prev.createdAt).getTime() <
                        60_000 * 3;
                    return (
                      <Bubble
                        key={m.id}
                        msg={m}
                        mine={mine}
                        stacked={stacked}
                        variant={variant}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>
        )}
        </div>
      </div>

      {/* Preview imagen pendiente */}
      <AnimatePresence>
        {images.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={MOTION.reveal}
            className={`flex gap-2 pt-2 ${hasLateral ? "" : "px-4"} ${innerWrap}`}
          >
            {images.map((img, i) => (
              <div
                key={i}
                className="relative h-16 w-16 overflow-hidden rounded-xl border border-white/10"
              >
                <img src={img} alt="" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                  aria-label="Quitar imagen"
                  className="absolute inset-0 flex items-center justify-center bg-black/70 opacity-0 transition-opacity active:opacity-100"
                >
                  <X className="h-4 w-4 text-white" />
                </button>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Composer */}
      <div
        className={`shrink-0 border-t border-white/[0.05] bg-[#060214]/90 pt-3 backdrop-blur-md ${hasLateral ? "" : "px-3"}`}
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 10px)" }}
      >
        <div className={`flex items-end gap-2 ${innerWrap} ${hasLateral ? "py-1" : ""}`}>
          <label
            className={`flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.02] text-white/50 transition-colors active:bg-white/[0.06] ${
              uploadingImg || images.length >= 1 ? "pointer-events-none opacity-30" : ""
            }`}
          >
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImage}
              disabled={uploadingImg || images.length >= 1}
            />
            {uploadingImg ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-5 w-5" strokeWidth={2.5} />
            )}
          </label>

          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            rows={1}
            placeholder="Escribe un mensaje…"
            className="flex-1 resize-none rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-[#a855f7]/45 transition-colors min-h-[44px] max-h-32"
          />

          <motion.button
            type="button"
            onClick={handleSend}
            disabled={!canSend}
            whileTap={canSend ? { scale: 0.94 } : undefined}
            transition={MOTION.tap}
            aria-label="Enviar"
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition-all ${
              canSend
                ? "bg-[linear-gradient(135deg,#e879f9_0%,#a855f7_50%,#60a5fa_100%)] text-white shadow-[0_4px_16px_-4px_rgba(168,85,247,0.6)]"
                : "bg-white/[0.04] text-white/25"
            }`}
          >
            {sending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" strokeWidth={2.5} />
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
}

// ─── Bubble ───────────────────────────────────────────────────────────────────

function Bubble({ msg, mine, stacked, variant = "mobile" }: { msg: Msg; mine: boolean; stacked: boolean; variant?: ChatVariant }) {
  // Tope duro en px — previene burbujas gigantes en desktop.
  const bubbleMaxW =
    variant === "desktop" ? "max-w-[78%]" :
    variant === "tablet"  ? "max-w-[80%]" :
                            "max-w-[82%]";
  const d = new Date(msg.createdAt);
  const hora = formatHour(d);
  const text = msg.contenido ?? msg.nota ?? "";
  const imgs = Array.isArray(msg.imagenes) ? msg.imagenes : [];

  // Corners — para que mensajes consecutivos del mismo autor parezcan unidos.
  const cornerCls = mine
    ? stacked
      ? "rounded-tr-xl"
      : "rounded-tr-sm"
    : stacked
      ? "rounded-tl-xl"
      : "rounded-tl-sm";

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={MOTION.reveal}
      className={`flex ${mine ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`${bubbleMaxW} rounded-2xl px-3.5 py-2.5 ${cornerCls} ${
          mine
            ? "bg-[linear-gradient(135deg,rgba(232,121,249,0.18)_0%,rgba(168,85,247,0.18)_50%,rgba(96,165,250,0.18)_100%)] border border-[#a855f7]/25 text-white"
            : "border border-white/[0.08] bg-white/[0.04] text-white/85"
        }`}
      >
        {text && (
          <p className="whitespace-pre-wrap break-words text-[14px] leading-relaxed">
            {text}
          </p>
        )}
        {imgs.length > 0 && (
          <div className={`${text ? "mt-2" : ""} grid gap-1.5 ${imgs.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
            {imgs.map((img, i) => (
              <a
                key={i}
                href={img}
                target="_blank"
                rel="noopener noreferrer"
                className="block overflow-hidden rounded-xl border border-white/10 active:opacity-80 transition-opacity"
              >
                <img src={img} alt="" className="h-full w-full object-cover" />
              </a>
            ))}
          </div>
        )}
        <div className={`mt-1 flex items-center gap-1 text-[10px] ${mine ? "justify-end text-white/45" : "text-white/35"}`}>
          <span>{hora}</span>
          {mine && <Check className="h-2.5 w-2.5" strokeWidth={3} />}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ adminNombre }: { adminNombre: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-[linear-gradient(135deg,#e879f9_0%,#a855f7_50%,#60a5fa_100%)] opacity-20 blur-2xl" />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-[#a855f7]/20 bg-[linear-gradient(135deg,rgba(232,121,249,0.08)_0%,rgba(168,85,247,0.08)_50%,rgba(96,165,250,0.08)_100%)]">
          <MessageSquare className="h-8 w-8" style={{ stroke: "url(#inzidium-brand)" }} />
        </div>
      </div>
      <div className="max-w-[280px]">
        <p className="text-[15px] font-black text-white">Aquí hablamos contigo</p>
        <p className="mt-1.5 text-[12px] leading-relaxed text-white/45">
          Cuéntale a <span className="font-semibold text-white/80">{adminNombre}</span> cualquier duda o cambio.
          Las respuestas llegan en tiempo real.
        </p>
      </div>
    </div>
  );
}
