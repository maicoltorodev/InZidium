"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, Archive, ChevronDown } from "lucide-react";
import { Chat, type ChatVariant } from "../shared/Chat";
import type { PortalDevice } from "../PortalPage";
import type { ProjectFase } from "@/lib/data/types";
import { PhaseTimeline } from "../shared/primitives/PhaseTimeline";
import { CountdownCard } from "../shared/primitives/CountdownCard";
import { SharedVault } from "../shared/primitives/SharedVault";

/**
 * Vista del portal para proyectos con plan "a la medida", mobile/tablet.
 * Resumen (fase + countdown) + archivos compartidos con el estudio + chat.
 * Sin wizard, sin brief — la información del proyecto sale de las reuniones
 * y queda registrada en chat/archivos.
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
  const chatVariant: ChatVariant = device;
  const wrapMax = device === "tablet" ? "max-w-2xl" : "max-w-xl";

  const fase: ProjectFase = (project?.fase ?? "onboarding") as ProjectFase;
  const isBuilding = fase === "construccion";
  const isOnboarding = fase === "onboarding";

  const onboardingData: Record<string, any> =
    (project?.onboardingData as any) ?? {};
  const hasPrevData = Object.keys(onboardingData).some(
    (k) => k !== "briefing" && hasValue(onboardingData[k]),
  );

  const timelineSubtitle = isOnboarding
    ? "Cuéntanos tu visión"
    : isBuilding
      ? "Construyendo"
      : "En vivo";

  return (
    <main className="min-h-dvh bg-[#020608] text-white">
      <div className={`mx-auto ${wrapMax} px-4 py-8 sm:px-6 sm:py-10 space-y-6`}>
        {/* Header */}
        <header className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="inline-block bg-[linear-gradient(90deg,#e879f9_0%,#a855f7_50%,#22d3ee_100%)] bg-clip-text text-[10px] font-black uppercase tracking-[0.32em] text-transparent">
              Hola, {clientName.split(" ")[0] || "bienvenido"} · Proyecto a la medida
            </p>
            <h1 className="mt-3 text-2xl sm:text-3xl font-black tracking-tighter">
              {project.nombre}
            </h1>
          </div>
          <button
            onClick={onReset}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-gray-400 transition hover:text-white hover:bg-white/10"
            aria-label="Cerrar sesión"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </header>

        <PhaseTimeline fase={fase} activeSubtitle={timelineSubtitle} />

        {isBuilding && (
          <CountdownCard
            buildStartedAt={project.buildStartedAt ?? null}
            fechaEntrega={project.fechaEntrega ?? null}
            chat={project.chat ?? []}
          />
        )}

        {hasPrevData && <PreviousPlanPanel data={onboardingData} />}

        {/* Archivos compartidos */}
        <SharedVault
          project={project}
          showToast={showToast}
          variant="mobile"
          uploadedBy="cliente"
        />

        {/* Chat */}
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-3xl border border-white/8 bg-white/[0.04] backdrop-blur-xl overflow-hidden"
        >
          <Chat project={project} showToast={showToast} variant={chatVariant} />
        </motion.section>

        <p className="text-center text-[11px] leading-relaxed text-white/35 pt-2">
          {isOnboarding
            ? "Comparte archivos y escríbenos por el chat. Agendamos una llamada cuando estés listo."
            : isBuilding
              ? "Estamos construyendo tu sitio. Si hay cambios, escríbenos por el chat."
              : "Tu sitio ya está en vivo. Cualquier ajuste lo coordinamos por el chat."}
        </p>
      </div>
    </main>
  );
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
