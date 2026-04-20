"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { getSectionCompletion } from "../types";
import type { ProjectFase } from "@/lib/data/types";
import { ESTUDIO_CONFIG } from "@/lib/config";
import { MobileHub } from "./MobileHub";
import { MobileSection } from "./MobileSection";
import { haptic } from "../shared/primitives/motion";
import { BrandDefs } from "../shared/primitives/BrandDefs";
import { TipoNegocioGate } from "../shared/primitives/TipoNegocioGate";
import { HUB_SECTIONS, SECTION_REGISTRY, getCatalogoSubtitle, type SectionKey } from "../shared/sections/registry";

import { InicioSection } from "../shared/sections/InicioSection";
import { NosotrosSection } from "../shared/sections/NosotrosSection";
import { CatalogoSection } from "../shared/sections/CatalogoSection";
import { UbicacionSection } from "../shared/sections/UbicacionSection";
import { ContactoSection } from "../shared/sections/ContactoSection";
import { RedesSection } from "../shared/sections/RedesSection";
import { ColoresSection } from "../shared/sections/ColoresSection";
import { SupportFab } from "../shared/SupportFab";
import { AjustesSection } from "../shared/sections/AjustesSection";

type HubKey = SectionKey;

type View = "hub" | HubKey;

export function MobileOnboarding({
  project,
  clientName,
  savePatch,
  onReset,
  showToast,
  uploadImage,
  uploadingLogo,
  setUploadingLogo,
  uploadingFavicon,
  setUploadingFavicon,
  uploadingNosotros,
  setUploadingNosotros,
}: {
  project: any;
  clientName: string;
  savePatch: (patch: any) => void;
  onReset: () => void;
  showToast: (msg: string, type: "success" | "error") => void;
  uploadImage: (
    file: File,
    onDone: (url: string) => void,
    setLoading: (v: boolean) => void,
    oldUrl?: string,
  ) => Promise<void>;
  uploadingLogo: boolean;
  setUploadingLogo: (v: boolean) => void;
  uploadingFavicon: boolean;
  setUploadingFavicon: (v: boolean) => void;
  uploadingNosotros: boolean;
  setUploadingNosotros: (v: boolean) => void;
}) {
  const d = project.onboardingData || {};
  const [view, setView] = useState<View>("hub");
  const [justCompleted, setJustCompleted] = useState<string | null>(null);

  // Snapshot de completion al entrar a una section para detectar transición
  const snapshotRef = useRef<Record<string, string>>({});

  // Al cambiar de view
  const changeView = useCallback(
    (next: View) => {
      if (next === "hub" && view !== "hub") {
        // Detectar si la seccion que dejamos paso a complete
        const key = view;
        const prev = snapshotRef.current[key];
        const nowCompletion = getSectionCompletion(
          key === "ajustes" ? "legal" : key, // ajustes no es scoreable
          d
        );
        if (prev && prev !== "complete" && nowCompletion === "complete") {
          setJustCompleted(key);
          haptic(8);
          setTimeout(() => setJustCompleted(null), 1200);
        }
      }
      setView(next);
    },
    [view, d]
  );

  // Al entrar a una section, guardar snapshot
  useEffect(() => {
    if (view === "hub" || view === "chat" || view === "ajustes") return;
    const key = view === "avanzado" ? "avanzado" : view;
    snapshotRef.current[view] = getSectionCompletion(
      key === "avanzado" ? "legal" : key, // avanzado no scoreable, usa placeholder
      d
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view]);

  // Chat unread
  const chatInfo = useMemo(() => {
    const msgs: any[] = project.chat || [];
    const lastAdmin = [...msgs].reverse().find((m) => m.autor !== "cliente");
    const lastClient = [...msgs].reverse().find((m) => m.autor === "cliente");
    const hasUnread =
      !!lastAdmin &&
      (!lastClient || new Date(lastAdmin.createdAt) > new Date(lastClient.createdAt));
    const preview: string | undefined =
      lastAdmin?.nota && typeof lastAdmin.nota === "string"
        ? lastAdmin.nota.length > 60
          ? `${lastAdmin.nota.slice(0, 60)}…`
          : lastAdmin.nota
        : undefined;
    return { hasUnread, preview };
  }, [project.chat]);

  // Handlers de upload memorizados
  const handleUploadLogo = useCallback(
    (file: File) => {
      uploadImage(file, (url) => savePatch({ logo: url }), setUploadingLogo, d.logo);
    },
    [uploadImage, savePatch, setUploadingLogo, d.logo]
  );
  const handleUploadFavicon = useCallback(
    (file: File) => {
      uploadImage(file, (url) => savePatch({ favicon: url }), setUploadingFavicon, d.favicon);
    },
    [uploadImage, savePatch, setUploadingFavicon, d.favicon]
  );
  const handleUploadNosotros = useCallback(
    (file: File) => {
      uploadImage(file, (url) => savePatch({ imagenNosotros: url }), setUploadingNosotros, d.imagenNosotros);
    },
    [uploadImage, savePatch, setUploadingNosotros, d.imagenNosotros]
  );

  const backToHub = useCallback(() => changeView("hub"), [changeView]);

  // Computar completion de la section activa para el CTA
  const activeCompletion = useMemo(() => {
    if (view === "hub" || view === "chat" || view === "ajustes" || view === "avanzado") {
      return "empty" as const;
    }
    return getSectionCompletion(view, d);
  }, [view, d]);

  return (
    <main className="lg:hidden">
      <BrandDefs />
      <TipoNegocioGate data={d} clientName={clientName} savePatch={savePatch} />
      {view === "hub" && (
        <MobileHub
          clientName={clientName}
          projectName={project.nombre ?? ""}
          data={d}
          fase={(project.fase ?? "onboarding") as ProjectFase}
          buildStartedAt={project.buildStartedAt ?? null}
          fechaEntrega={project.fechaEntrega ?? null}
          chat={project.chat ?? []}
          onSelect={(key) => {
            const fase = project.fase ?? "onboarding";
            // Durante construccion solo Mensajes es navegable.
            if (fase === "construccion" && key !== "chat") return;
            changeView(key as View);
          }}
          onReset={onReset}
          onDomainChange={(v) => {
            const patch: Record<string, any> = { dominioUno: v };
            patch.seoCanonicalUrl = v ? `https://www.${v}.com` : "";
            savePatch(patch);
          }}
          justCompleted={justCompleted}
          hasUnread={chatInfo.hasUnread}
          lastAdminMessage={chatInfo.preview}
        />
      )}

      <AnimatePresence mode="wait">
        {view !== "hub" && (
          <MobileSection
            key={view}
            icon={SECTION_REGISTRY[view].icon}
            title={SECTION_REGISTRY[view].title}
            subtitle={view === "catalogo" ? getCatalogoSubtitle(d.tipoCatalogo) : SECTION_REGISTRY[view].subtitle}
            completion={activeCompletion}
            onBack={backToHub}
            hideBody={view === "chat"}
            headerContent={
              view === "chat" ? (
                <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/[0.06] px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-emerald-400">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                  {(ESTUDIO_CONFIG.nombre.split(" ")[0] || "Estudio")} en línea
                </span>
              ) : undefined
            }
          >
            {view === "inicio" && (
              <InicioSection
                d={d}
                savePatch={savePatch}
                uploadingLogo={uploadingLogo}
                onUploadLogo={handleUploadLogo}
              />
            )}
            {view === "nosotros" && (
              <NosotrosSection
                d={d}
                savePatch={savePatch}
                uploadingNosotros={uploadingNosotros}
                onUploadFoto={handleUploadNosotros}
              />
            )}
            {view === "catalogo" && (
              <CatalogoSection
                d={d}
                savePatch={savePatch}
                projectId={project.id}
                showToast={showToast}
                device="mobile"
              />
            )}
            {view === "contacto" && <UbicacionSection d={d} savePatch={savePatch} />}
            {view === "digital" && <ContactoSection d={d} savePatch={savePatch} />}
            {view === "social" && <RedesSection d={d} savePatch={savePatch} />}
            {view === "colores" && <ColoresSection d={d} savePatch={savePatch} />}
            {view === "ajustes" && (
              <AjustesSection
                d={d}
                savePatch={savePatch}
                uploadingFavicon={uploadingFavicon}
                onUploadFavicon={handleUploadFavicon}
              />
            )}
          </MobileSection>
        )}
      </AnimatePresence>

      {/* FAB de soporte — persistente en toda la navegación. */}
      <SupportFab
        project={project}
        showToast={showToast}
        device="mobile"
        hasUnread={chatInfo.hasUnread}
      />
    </main>
  );
}

// Re-export para referencia externa
export type { View as MobileView };
export { HUB_SECTIONS };
