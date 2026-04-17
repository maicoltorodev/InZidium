"use client";

import { useEffect, useState } from "react";
import {
  TipoNegocioModal,
  buildTipoNegocioPatch,
  inferTipoNegocio,
  type TipoNegocio,
} from "./TipoNegocioModal";

/**
 * Se monta en los orquestadores de cada shell. Muestra el modal bloqueante
 * la primera vez que el cliente entra al hub, si aún no definió `tipoNegocio`.
 * Soporta backfill silencioso para proyectos viejos con `tipoCatalogo` o
 * `legalTemplate` seteados.
 */
export function TipoNegocioGate({
  data,
  clientName,
  savePatch,
}: {
  data: any;
  clientName: string;
  savePatch: (patch: any) => void;
}) {
  const hasTipo = !!data?.tipoNegocio;
  const inferred = inferTipoNegocio(data);
  const [justSaved, setJustSaved] = useState(false);

  // Backfill silencioso: si no tiene tipoNegocio pero sí legalTemplate/tipoCatalogo,
  // setearlo sin mostrar modal. Solo una vez (justSaved evita loops).
  useEffect(() => {
    if (hasTipo || justSaved) return;
    if (inferred) {
      savePatch(buildTipoNegocioPatch(inferred, data?.legalLastUpdated));
      setJustSaved(true);
    }
  }, [hasTipo, inferred, justSaved, data?.legalLastUpdated, savePatch]);

  const open = !hasTipo && !inferred;

  const handleSelect = (tipo: TipoNegocio) => {
    savePatch(buildTipoNegocioPatch(tipo, data?.legalLastUpdated));
    setJustSaved(true);
  };

  return (
    <TipoNegocioModal
      open={open}
      clientName={clientName}
      onSelect={handleSelect}
    />
  );
}
