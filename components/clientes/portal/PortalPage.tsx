"use client";

import { useState } from "react";
import { uploadProjectFile } from "@/lib/client/upload-archivo";
import { MobileOnboarding } from "./mobile/MobileOnboarding";
import { TabletOnboarding } from "./tablet/TabletOnboarding";
import { DesktopOnboarding } from "./desktop/DesktopOnboarding";

export type PortalDevice = "desktop" | "tablet" | "mobile";

/**
 * PortalPage despacha al shell correcto según el route group que lo invocó.
 * La detección es por ruta (no por matchMedia) — cada page.tsx pasa su device literal.
 */
export function PortalPage({
  project,
  clientName,
  savePatch,
  onReset,
  showToast,
  device,
  useDesktopLandingBackground = false,
}: {
  project: any;
  clientName: string;
  savePatch: (patch: any) => void;
  onReset: () => void;
  showToast: (msg: string, type: "success" | "error") => void;
  device: PortalDevice;
  useDesktopLandingBackground?: boolean;
}) {
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingNosotros, setUploadingNosotros] = useState(false);

  const uploadImage = async (
    file: File,
    onDone: (url: string) => void,
    setLoading: (v: boolean) => void,
    oldUrl?: string,
  ) => {
    setLoading(true);
    try {
      const result = await uploadProjectFile({
        file, proyectoId: project.id, subidoPor: "cliente", oldUrl,
      });
      if (result.success && result.url) onDone(result.url);
      else showToast(result.error || "Error al subir la imagen", "error");
    } catch {
      showToast("Error al subir la imagen", "error");
    } finally {
      setLoading(false);
    }
  };

  const sharedProps = {
    project,
    clientName,
    savePatch,
    onReset,
    showToast,
    uploadImage,
    uploadingLogo,
    setUploadingLogo,
    uploadingNosotros,
    setUploadingNosotros,
  };

  if (device === "desktop") return <DesktopOnboarding {...sharedProps} />;
  if (device === "tablet") return <TabletOnboarding {...sharedProps} />;
  return <MobileOnboarding {...sharedProps} />;
}
