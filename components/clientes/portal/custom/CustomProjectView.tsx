"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  LogOut,
  Loader2,
  Check,
  Archive,
  ChevronDown,
} from "lucide-react";
import { updateProyectoBriefing } from "@/lib/actions";
import { Chat, type ChatVariant } from "../shared/Chat";
import type { PortalDevice } from "../PortalPage";

const AUTOSAVE_DEBOUNCE = 900;

/**
 * Vista del portal para proyectos con plan "a la medida".
 * A diferencia del wizard de secciones estándar, no hay estructura fija —
 * el cliente articula el scope en un brief libre y conversa con el admin vía
 * chat. Las imágenes y archivos se intercambian por el chat (que ya los soporta).
 */
export function CustomProjectView({
  project,
  clientName,
  onReset,
  showToast,
  device,
}: {
  project: any;
  clientName: string;
  onReset: () => void;
  showToast: (msg: string, type: "success" | "error") => void;
  device: PortalDevice;
}) {
  const initialBrief: string =
    (project?.onboardingData as any)?.briefing ?? "";
  const [brief, setBrief] = useState(initialBrief);
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");
  const lastSavedRef = useRef(initialBrief);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Re-sincronizar cuando llega el proyecto actualizado por realtime.
  useEffect(() => {
    const incoming = (project?.onboardingData as any)?.briefing ?? "";
    if (incoming !== lastSavedRef.current && incoming !== brief) {
      setBrief(incoming);
      lastSavedRef.current = incoming;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project?.onboardingData]);

  // Autosave con debounce
  useEffect(() => {
    if (brief === lastSavedRef.current) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    setStatus("saving");
    saveTimer.current = setTimeout(async () => {
      const res = await updateProyectoBriefing(project.id, brief);
      if (res.success) {
        lastSavedRef.current = brief;
        setStatus("saved");
        setTimeout(() => setStatus((s) => (s === "saved" ? "idle" : s)), 1800);
      } else {
        setStatus("idle");
        showToast("No se pudo guardar tu info", "error");
      }
    }, AUTOSAVE_DEBOUNCE);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [brief, project.id, showToast]);

  const chatVariant: ChatVariant = device;
  const wrapMax = device === "desktop" ? "max-w-3xl" : "max-w-xl";

  // Si venís de un plan estándar, tus datos previos (nombre, colores, catálogo, etc.)
  // se conservan en onboardingData. Los mostramos como referencia visible.
  const onboardingData: Record<string, any> =
    (project?.onboardingData as any) ?? {};
  const hasPrevData = Object.keys(onboardingData).some(
    (k) => k !== "briefing" && hasValue(onboardingData[k]),
  );

  return (
    <main className="min-h-dvh bg-[#020608] text-white">
      <div className={`mx-auto ${wrapMax} px-4 py-8 sm:px-6 sm:py-10 space-y-8`}>
        {/* Header */}
        <header className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#22d3ee] mb-2">
              Proyecto a la medida
            </p>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tighter">
              {project.nombre}
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Hola {clientName} — usá este espacio para contarnos tu proyecto y
              compartir lo que necesitemos ver.
            </p>
          </div>
          <button
            onClick={onReset}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-gray-400 transition hover:text-white hover:bg-white/10"
            aria-label="Cerrar sesión"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </header>

        {/* Panel de referencia: datos del plan estándar previo */}
        {hasPrevData && <PreviousPlanPanel data={onboardingData} />}

        {/* Brief */}
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-3xl border border-white/8 bg-white/[0.04] backdrop-blur-xl p-5 sm:p-7"
        >
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#22d3ee]/10 text-[#22d3ee]">
                <FileText className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-sm font-black uppercase tracking-widest text-white">
                  Cuéntanos tu proyecto
                </h2>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                  Se guarda automáticamente
                </p>
              </div>
            </div>
            <SaveIndicator status={status} />
          </div>
          <textarea
            value={brief}
            onChange={(e) => setBrief(e.target.value)}
            placeholder={
              "¿Qué querés lograr?\n¿Qué tenés hoy (sitio, marca, referencias)?\n¿Tenés deadline o ideas concretas?\nCualquier info útil va acá — podés ir editando cuando quieras."
            }
            rows={10}
            className="w-full resize-y rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-white placeholder:text-gray-600 focus:border-[#22d3ee]/50 focus:outline-none transition-colors leading-relaxed"
          />
          <p className="mt-3 text-[10px] text-gray-600 leading-relaxed">
            Para adjuntar imágenes, PDFs o referencias, usá el chat de abajo.
          </p>
        </motion.section>

        {/* Chat */}
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-3xl border border-white/8 bg-white/[0.04] backdrop-blur-xl overflow-hidden"
        >
          <Chat project={project} showToast={showToast} variant={chatVariant} />
        </motion.section>
      </div>
    </main>
  );
}

function SaveIndicator({
  status,
}: {
  status: "idle" | "saving" | "saved";
}) {
  if (status === "saving") {
    return (
      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-500">
        <Loader2 className="h-3 w-3 animate-spin" />
        Guardando
      </div>
    );
  }
  if (status === "saved") {
    return (
      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-emerald-400">
        <Check className="h-3 w-3" />
        Guardado
      </div>
    );
  }
  return null;
}

// ─── Panel de referencia al plan previo ──────────────────────────────────────

function hasValue(v: unknown): boolean {
  if (v == null) return false;
  if (typeof v === "string") return v.trim().length > 0;
  if (Array.isArray(v)) return v.length > 0;
  if (typeof v === "object") return Object.keys(v).length > 0;
  return true;
}

function PreviousPlanPanel({ data }: { data: Record<string, any> }) {
  const [open, setOpen] = useState(false);

  const nombre = data.nombreComercial;
  const slogan = data.slogan;
  const descripcion = data.descripcion;
  const logo = data.logo;
  const catalogoCount = Array.isArray(data.catalogo) ? data.catalogo.length : 0;
  const colores = [data.colorPrimario, data.colorAcento, data.colorAcento2]
    .filter(Boolean);
  const contacto = [data.whatsapp, data.telefono, data.email].filter(Boolean);

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-amber-500/15 bg-amber-500/[0.03] p-5 sm:p-6"
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 text-left"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
            <Archive className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-white">
              Del plan anterior
            </h3>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
              {open ? "Click para colapsar" : "Click para ver"}
            </p>
          </div>
        </div>
        <ChevronDown
          className={`h-4 w-4 text-gray-500 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-5 space-y-4 border-t border-white/5 pt-5">
              {logo && (
                <div className="flex justify-center">
                  <img
                    src={logo}
                    alt="logo"
                    className="h-16 w-16 rounded-xl bg-black/20 object-contain p-2"
                  />
                </div>
              )}
              {nombre && <RefRow label="Nombre" value={nombre} />}
              {slogan && <RefRow label="Slogan" value={`"${slogan}"`} />}
              {descripcion && (
                <RefRow label="Descripción" value={descripcion} clamp />
              )}
              {colores.length > 0 && (
                <div>
                  <span className="block text-[9px] font-black uppercase tracking-widest text-gray-500 mb-1.5">
                    Colores
                  </span>
                  <div className="flex gap-2">
                    {colores.map((c: string, i: number) => (
                      <div
                        key={i}
                        className="h-8 w-8 rounded-lg border border-white/10"
                        style={{ background: c }}
                        title={c}
                      />
                    ))}
                  </div>
                </div>
              )}
              {catalogoCount > 0 && (
                <RefRow label="Catálogo" value={`${catalogoCount} ítems`} />
              )}
              {contacto.length > 0 && (
                <RefRow label="Contacto" value={contacto.join(" · ")} />
              )}
              <p className="text-[10px] leading-relaxed text-gray-500 italic pt-1">
                Esta info viene del plan estándar que completaste antes. El
                admin la tiene visible para el nuevo proyecto.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}

function RefRow({
  label,
  value,
  clamp,
}: {
  label: string;
  value: string;
  clamp?: boolean;
}) {
  return (
    <div>
      <span className="block text-[9px] font-black uppercase tracking-widest text-gray-500 mb-1">
        {label}
      </span>
      <p
        className={`text-sm text-gray-200 ${
          clamp ? "line-clamp-4" : ""
        } leading-relaxed break-words`}
      >
        {value}
      </p>
    </div>
  );
}
