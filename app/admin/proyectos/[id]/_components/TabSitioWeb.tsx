"use client";

import { motion } from "framer-motion";
import { PortalPage } from "@/components/clientes/portal/PortalPage";

/**
 * Embed del portal del cliente dentro del admin. El admin edita el sitio
 * exactamente como lo vería el cliente — mismas secciones, mismos campos.
 * El FAB de soporte se oculta porque no tiene sentido en modo admin.
 */
export function TabSitioWeb({
  project,
  savePatch,
  showToast,
}: {
  project: any;
  savePatch: (patch: any) => Promise<void> | void;
  showToast: (msg: string, type: "success" | "error") => void;
}) {
  return (
    <motion.div
      key="sitioweb"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <PortalPage
        project={project}
        clientName={project.cliente?.nombre || ""}
        savePatch={savePatch}
        onReset={() => {}}
        showToast={showToast}
        device="desktop"
        hideSupportFab
        uploadedBy="admin"
      />
    </motion.div>
  );
}
