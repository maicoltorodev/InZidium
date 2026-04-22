"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { getSectionCompletion } from "../types";
import type { ProjectFase } from "@/lib/data/types";
import { ESTUDIO_CONFIG } from "@/lib/config";
import { DesktopHub } from "./DesktopHub";
import { DesktopSection } from "./DesktopSection";
import { haptic } from "../shared/primitives/motion";
import { BrandDefs } from "../shared/primitives/BrandDefs";
import { TipoNegocioGate } from "../shared/primitives/TipoNegocioGate";
import { SECTION_REGISTRY, getCatalogoSubtitle, type SectionKey } from "../shared/sections/registry";

import { InicioSection } from "../shared/sections/InicioSection";
import { NosotrosSection } from "../shared/sections/NosotrosSection";
import { CatalogoSection } from "../shared/sections/CatalogoSection";
import { UbicacionSection } from "../shared/sections/UbicacionSection";
import { ContactoSection } from "../shared/sections/ContactoSection";
import { RedesSection } from "../shared/sections/RedesSection";
import { ColoresSection } from "../shared/sections/ColoresSection";
import { AjustesSection } from "../shared/sections/AjustesSection";
import { SupportFab } from "../shared/SupportFab";

type View = "hub" | SectionKey;

export function DesktopOnboarding({
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
  hideSupportFab = false,
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
    options?: { preserveFormat?: boolean },
  ) => Promise<void>;
  uploadingLogo: boolean;
  setUploadingLogo: (v: boolean) => void;
  uploadingFavicon: boolean;
  setUploadingFavicon: (v: boolean) => void;
  uploadingNosotros: boolean;
  setUploadingNosotros: (v: boolean) => void;
  hideSupportFab?: boolean;
}) {
  const d = project.onboardingData || {};
  const [view, setView] = useState<View>("hub");
  const [justCompleted, setJustCompleted] = useState<string | null>(null);
  const snapshotRef = useRef<Record<string, string>>({});

  const changeView = useCallback(
    (next: View) => {
      if (next === "hub" && view !== "hub") {
        const key = view;
        const prev = snapshotRef.current[key];
        const nowCompletion = getSectionCompletion(
          key === "ajustes" ? "legal" : key,
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

  useEffect(() => {
    if (view === "hub" || view === "chat" || view === "ajustes") return;
    const key = view === "avanzado" ? "legal" : view;
    snapshotRef.current[view] = getSectionCompletion(key, d);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view]);

  const chatInfo = useMemo(() => {
    const msgs: any[] = project.chat || [];
    const lastAdmin = [...msgs].reverse().find((m) => m.autor !== "cliente");
    const lastClient = [...msgs].reverse().find((m) => m.autor === "cliente");
    const hasUnread =
      !!lastAdmin &&
      (!lastClient || new Date(lastAdmin.createdAt) > new Date(lastClient.createdAt));
    const preview: string | undefined =
      lastAdmin?.nota && typeof lastAdmin.nota === "string"
        ? lastAdmin.nota.length > 100
          ? `${lastAdmin.nota.slice(0, 100)}…`
          : lastAdmin.nota
        : undefined;
    return { hasUnread, preview };
  }, [project.chat]);

  const handleUploadLogo = useCallback(
    (file: File) => {
      uploadImage(file, (url) => savePatch({ logo: url }), setUploadingLogo, d.logo);
    },
    [uploadImage, savePatch, setUploadingLogo, d.logo]
  );
  const handleUploadFavicon = useCallback(
    (file: File) => {
      uploadImage(file, (url) => savePatch({ favicon: url }), setUploadingFavicon, d.favicon, { preserveFormat: true });
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

  const activeCompletion = useMemo(() => {
    if (view === "hub" || view === "chat" || view === "ajustes" || view === "avanzado") {
      return "empty" as const;
    }
    return getSectionCompletion(view, d);
  }, [view, d]);

  return (
    <main>
      <BrandDefs />
      <TipoNegocioGate data={d} clientName={clientName} savePatch={savePatch} />
      {view === "hub" && (
        <DesktopHub
          projectId={project.id}
          clientName={clientName}
          projectName={project.nombre ?? ""}
          data={d}
          fase={(project.fase ?? "onboarding") as ProjectFase}
          buildStartedAt={project.buildStartedAt ?? null}
          fechaEntrega={project.fechaEntrega ?? null}
          chat={project.chat ?? []}
          onSelect={(key) => {
            const fase = project.fase ?? "onboarding";
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
          projectLink={project.link ?? null}
          linkLocked={(project as any).linkLocked ?? false}
        />
      )}

      <AnimatePresence mode="wait">
        {view !== "hub" && (
          <DesktopSection
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
              <InicioSection d={d} savePatch={savePatch} uploadingLogo={uploadingLogo} onUploadLogo={handleUploadLogo} />
            )}
            {view === "nosotros" && (
              <NosotrosSection d={d} savePatch={savePatch} uploadingNosotros={uploadingNosotros} onUploadFoto={handleUploadNosotros} />
            )}
            {view === "catalogo" && (
              <CatalogoSection d={d} savePatch={savePatch} projectId={project.id} showToast={showToast} device="desktop" />
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
          </DesktopSection>
        )}
      </AnimatePresence>

      {/* FAB de soporte — reemplaza la card "Mensajes" del grid. Persistente
          en toda la navegación del portal. */}
      {!hideSupportFab && (
        <SupportFab
          project={project}
          showToast={showToast}
          device="desktop"
          hasUnread={chatInfo.hasUnread}
        />
      )}
    </main>
  );
}
