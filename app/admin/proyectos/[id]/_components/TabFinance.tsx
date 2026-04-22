"use client";

import React, { useRef, useState } from "react";
import {
  Edit2,
  Check,
  X,
  Lock,
  Loader2,
  AlertTriangle,
  Upload,
  CheckCircle2,
  Clock,
  XCircle,
  ImageIcon,
  Ban,
  FileText,
  Plus,
  Trash2,
  Receipt,
  Calendar,
  DollarSign,
  StickyNote,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import {
  approveComprobantePago,
  rejectComprobantePago,
  uploadComprobantePago,
} from "@/lib/actions";
import { uploadProjectFile } from "@/lib/client/upload-archivo";
import {
  getPagos,
  getPagoStatus,
  getPrecioTotal,
  getMontoInzidiumTotal,
  getMontoEstudioTotal,
  isPagoUnlocked,
  COMISION_ESTUDIO_ESTANDAR,
  PCT_ESTUDIO,
  PCT_INZIDIUM,
  PLAN_ALA_MEDIDA_TITLE,
  PLAN_ESTANDAR_TITLE,
  type Pago,
  type PagoStatus,
} from "@/lib/finance";

const COP = (n: number) => "$" + n.toLocaleString("es-CO") + " COP";

interface TabFinanceProps {
  project: any;
  projectId: string;
  onUpdatePrecio: (precio: number) => Promise<void>;
  savePatch: (patch: Record<string, any>) => Promise<void> | void;
}

export function TabFinance({
  project,
  projectId,
  onUpdatePrecio,
  savePatch,
}: TabFinanceProps) {
  const { data: session } = useSession();
  const isInZidium = (session?.user as any)?.username === "InZidium";
  const isEstandar = project.plan === PLAN_ESTANDAR_TITLE;
  const isAlaMedida = project.plan === PLAN_ALA_MEDIDA_TITLE;

  const precioTotal = getPrecioTotal(project);
  const montoInzidiumTotal = getMontoInzidiumTotal(project);
  const montoEstudioTotal = getMontoEstudioTotal(project);
  const pagos = getPagos(project);

  return (
    <motion.div
      key="finance"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="max-w-3xl mx-auto space-y-6"
    >
      {/* HEADER con total */}
      <div className="bg-white/[0.04] backdrop-blur-xl border border-white/8 rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 mb-2">
              A transferir a InZidium
            </p>
            {montoInzidiumTotal ? (
              <>
                <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight break-all">
                  {COP(montoInzidiumTotal)}
                </span>
                {precioTotal && (
                  <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mt-2">
                    {isEstandar
                      ? `${COP(precioTotal)} − ${COP(COMISION_ESTUDIO_ESTANDAR)} comisión estudio`
                      : `80% de ${COP(precioTotal)}`} · {project.plan}
                  </p>
                )}
              </>
            ) : (
              <span className="text-xl sm:text-2xl font-black text-gray-600 uppercase tracking-widest">
                Monto no definido
              </span>
            )}
          </div>
          <div className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10 shrink-0 self-start">
            <p className="text-[8px] font-black uppercase tracking-widest text-gray-600 mb-0.5">
              Plan
            </p>
            <p className="text-xs font-black text-white uppercase">{project.plan}</p>
          </div>
        </div>

        {/* Editor de precio sólo para A la medida — sólo InZidium puede editar */}
        {isAlaMedida && (
          <div className="border-t border-white/5 pt-6">
            <PrecioCustomEditor
              project={project}
              precioTotal={precioTotal}
              isInZidium={isInZidium}
              onSave={onUpdatePrecio}
            />
          </div>
        )}
      </div>

      {/* CARDS DE PAGOS */}
      {pagos.length === 0 ? (
        <div className="rounded-3xl border border-white/5 bg-white/[0.02] p-8 text-center text-gray-500">
          <p className="text-xs font-black uppercase tracking-widest">
            {isAlaMedida
              ? "InZidium debe definir el precio antes de habilitar los pagos"
              : "Plan no reconocido"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {pagos.map((pago) => (
            <PagoCard
              key={pago.tipo}
              pago={pago}
              project={project}
              projectId={projectId}
              isInZidium={isInZidium}
              isSinglePayment={pagos.length === 1}
            />
          ))}
        </div>
      )}

      {/* DESGLOSE — Estándar usa monto fijo, A la medida usa 80/20 */}
      {precioTotal && (
        <div className="bg-white/[0.04] backdrop-blur-xl border border-white/8 rounded-3xl p-6 sm:p-8">
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-gray-500 mb-6">
            Distribución del proyecto
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 sm:p-6 rounded-2xl bg-[#FFD700]/5 border border-[#FFD700]/20 space-y-1">
              <p className="text-[9px] font-black uppercase tracking-widest text-[#FFD700]/60">
                InZidium {isAlaMedida ? "· 80%" : ""}
              </p>
              <p className="text-2xl font-black text-[#FFD700]">
                {COP(montoInzidiumTotal!)}
              </p>
              <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">
                Desarrollo & plataforma
              </p>
            </div>
            <div className="p-5 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
              <p className="text-[9px] font-black uppercase tracking-widest text-gray-500">
                Estudio {isAlaMedida ? "· 20%" : "· monto fijo"}
              </p>
              <p className="text-2xl font-black text-white">
                {COP(montoEstudioTotal!)}
              </p>
              <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">
                Comisión comercial
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-start gap-3 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10">
            <AlertTriangle className="w-4 h-4 text-amber-500/60 shrink-0 mt-0.5" />
            <p className="text-[10px] text-gray-500 leading-relaxed">
              Si el cliente pagó mediante pasarela de pago, la comisión
              {" "}<span className="text-amber-400/80 font-black">(3–4%)</span>{" "}
              se descuenta de la parte del estudio. La transferencia a InZidium
              es siempre fija.
            </p>
          </div>
        </div>
      )}

      {/* REGISTRO MANUAL cliente → estudio (solo custom). Sin lógica, solo historial. */}
      {isAlaMedida && (
        <RegistroPagosPanel project={project} savePatch={savePatch} />
      )}
    </motion.div>
  );
}

// ─── Registro manual de pagos del cliente al estudio (solo A la medida) ─────

type RegistroPago = {
  id: string;
  monto: number;
  fecha: string; // YYYY-MM-DD
  nota?: string;
  createdAt: string;
};

function RegistroPagosPanel({
  project,
  savePatch,
}: {
  project: any;
  savePatch: (patch: Record<string, any>) => Promise<void> | void;
}) {
  const registros: RegistroPago[] = Array.isArray(
    project?.onboardingData?.registroPagos,
  )
    ? [...project.onboardingData.registroPagos].sort((a, b) =>
        b.fecha.localeCompare(a.fecha),
      )
    : [];

  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [montoInput, setMontoInput] = useState("");
  const [fechaInput, setFechaInput] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [notaInput, setNotaInput] = useState("");
  const [saving, setSaving] = useState(false);

  const total = registros.reduce((sum, r) => sum + (r.monto || 0), 0);

  const resetForm = () => {
    setMontoInput("");
    setFechaInput(new Date().toISOString().slice(0, 10));
    setNotaInput("");
  };

  const handleAdd = async () => {
    if (saving) return;
    const monto = parseInt(montoInput.replace(/\D/g, ""), 10);
    if (!monto || monto <= 0 || !fechaInput) return;

    const nuevo: RegistroPago = {
      id:
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random()}`,
      monto,
      fecha: fechaInput,
      nota: notaInput.trim() || undefined,
      createdAt: new Date().toISOString(),
    };
    const nextList = [...registros, nuevo];

    // Cerramos y reseteamos de entrada: la UI responde al toque sin esperar
    // el roundtrip. El realtime reconcilia si hubo error (el optimistic del
    // savePatch queda descartado y el pago no aparece).
    setAdding(false);
    resetForm();

    setSaving(true);
    await savePatch({ registroPagos: nextList });
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    await savePatch({ registroPagos: registros.filter((r) => r.id !== id) });
    setDeletingId(null);
  };

  return (
    <div className="bg-white/[0.04] backdrop-blur-xl border border-white/8 rounded-3xl p-6 sm:p-8">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#22d3ee]/10 border border-[#22d3ee]/20 flex items-center justify-center shrink-0">
            <Receipt className="w-4 h-4 text-[#22d3ee]" />
          </div>
          <div>
            <p className="text-sm font-black uppercase tracking-tight text-white">
              Pagos del cliente
            </p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mt-0.5">
              Registro manual · sin lógica
            </p>
          </div>
        </div>
        {total > 0 && (
          <div className="text-right shrink-0">
            <p className="text-[9px] font-black uppercase tracking-widest text-gray-600">
              Total registrado
            </p>
            <p className="text-lg font-black text-white tracking-tight">
              {COP(total)}
            </p>
          </div>
        )}
      </div>

      {/* Lista */}
      {registros.length === 0 && !adding && (
        <div className="rounded-2xl border-2 border-dashed border-white/5 bg-white/[0.01] p-8 text-center">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-600">
            Sin pagos registrados
          </p>
          <p className="text-[10px] text-gray-600 mt-1.5 leading-relaxed max-w-xs mx-auto">
            Anota aquí cuánto y cuándo te ha pagado el cliente. Solo sirve como historial.
          </p>
        </div>
      )}

      {registros.length > 0 && (
        <div className="space-y-2 mb-4">
          {registros.map((r) => (
            <div
              key={r.id}
              className="group flex items-start gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/15 transition-all"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                <DollarSign className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-base font-black text-white">{COP(r.monto)}</p>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(r.fecha + "T12:00:00").toLocaleDateString("es-CO", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
                {r.nota && (
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed break-words">
                    {r.nota}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => handleDelete(r.id)}
                disabled={deletingId === r.id}
                className="shrink-0 opacity-0 group-hover:opacity-100 flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 text-gray-500 hover:bg-red-500/20 hover:text-red-400 transition-all disabled:opacity-40"
                aria-label="Eliminar registro"
              >
                {deletingId === r.id ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Form de agregar (inline) */}
      <AnimatePresence initial={false}>
        {adding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="rounded-2xl border border-[#22d3ee]/20 bg-[#22d3ee]/[0.03] p-5 space-y-4 mb-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-[9px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-1.5 mb-2">
                    <DollarSign className="w-3 h-3" />
                    Monto (COP)
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={montoInput}
                    onChange={(e) =>
                      setMontoInput(e.target.value.replace(/\D/g, ""))
                    }
                    placeholder="0"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-black text-white outline-none focus:border-[#22d3ee]/50"
                    autoFocus
                  />
                </label>
                <label className="block">
                  <span className="text-[9px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-1.5 mb-2">
                    <Calendar className="w-3 h-3" />
                    Fecha
                  </span>
                  <input
                    type="date"
                    value={fechaInput}
                    onChange={(e) => setFechaInput(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-bold text-white outline-none focus:border-[#22d3ee]/50"
                  />
                </label>
              </div>
              <label className="block">
                <span className="text-[9px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-1.5 mb-2">
                  <StickyNote className="w-3 h-3" />
                  Nota (opcional)
                </span>
                <input
                  type="text"
                  value={notaInput}
                  onChange={(e) => setNotaInput(e.target.value)}
                  placeholder="Ej: primera cuota, transferencia Bancolombia..."
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#22d3ee]/50 placeholder:text-gray-600"
                />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setAdding(false);
                    resetForm();
                  }}
                  disabled={saving}
                  className="py-2.5 rounded-xl border border-white/10 text-gray-500 font-black text-[10px] uppercase tracking-widest hover:bg-white/5"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleAdd}
                  disabled={saving || !montoInput || !fechaInput}
                  className="py-2.5 rounded-xl bg-[#22d3ee] text-black font-black text-[10px] uppercase tracking-widest hover:bg-[#22d3ee]/90 disabled:opacity-40 flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Check className="w-3 h-3" />
                  )}
                  Guardar
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!adding && (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-dashed border-white/10 text-xs font-black uppercase tracking-widest text-gray-400 hover:border-[#22d3ee]/40 hover:text-[#22d3ee] hover:bg-[#22d3ee]/5 transition-all"
        >
          <Plus className="w-4 h-4" />
          Agregar pago
        </button>
      )}
    </div>
  );
}

// ─── Card por cuota ──────────────────────────────────────────────────────────

function PagoCard({
  pago,
  project,
  projectId,
  isInZidium,
  isSinglePayment,
}: {
  pago: Pago;
  project: any;
  projectId: string;
  isInZidium: boolean;
  isSinglePayment: boolean;
}) {
  const unlocked = isPagoUnlocked(pago, project);
  const status = getPagoStatus(pago);

  const [busy, setBusy] = useState<null | "upload" | "approve" | "reject">(
    null,
  );
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const label = pago.tipo === "arranque" ? "Pago de arranque" : "Pago de entrega";
  const subtitle = isSinglePayment
    ? "Transferencia a InZidium al crear el proyecto"
    : pago.tipo === "arranque"
      ? "50% inicial — al crear el proyecto"
      : "50% restante — al publicarse";

  const handleFile = async (file: File) => {
    setBusy("upload");
    try {
      const uploaded = await uploadProjectFile({
        file,
        proyectoId: projectId,
        subidoPor: "admin",
        oldUrl: pago.comprobanteUrl,
      });
      if (!uploaded.success || !uploaded.url) {
        throw new Error(uploaded.error || "Error subiendo comprobante");
      }
      const res = await uploadComprobantePago(
        projectId,
        pago.tipo,
        uploaded.url,
      );
      if (!res.success) throw new Error((res as any).error);
    } catch (e) {
      console.error(e);
    } finally {
      setBusy(null);
    }
  };

  const handleApprove = async () => {
    setBusy("approve");
    await approveComprobantePago(projectId, pago.tipo);
    setBusy(null);
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) return;
    setBusy("reject");
    await rejectComprobantePago(projectId, pago.tipo, rejectReason.trim());
    setRejectOpen(false);
    setRejectReason("");
    setBusy(null);
  };

  const statusStyle = STATUS_STYLES[status];

  return (
    <div
      className={`bg-white/[0.04] backdrop-blur-xl border rounded-3xl p-6 sm:p-7 transition-colors ${
        status === "aprobado"
          ? "border-emerald-500/30"
          : status === "rechazado"
            ? "border-red-500/30"
            : status === "enviado"
              ? "border-amber-500/30"
              : "border-white/8"
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <p className="text-sm font-black uppercase tracking-tight text-white">
              {label}
            </p>
            {!unlocked && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[8px] font-black uppercase tracking-widest text-gray-500">
                <Lock className="w-2.5 h-2.5" /> Bloqueado
              </span>
            )}
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-4">
            {subtitle}
          </p>
          <p className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {COP(pago.monto)}
          </p>
        </div>
        <StatusBadge status={status} />
      </div>

      {/* Estado contextual */}
      {!unlocked ? (
        <div className="mt-5 flex items-start gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
          <Ban className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
          <p className="text-[10px] text-gray-500 leading-relaxed">
            Esta cuota se habilita cuando el proyecto esté publicado.
          </p>
        </div>
      ) : (
        <div className="mt-5 space-y-4">
          {/* Nota de rechazo visible si existe */}
          {status === "rechazado" && pago.rejectionReason && (
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-red-500/5 border border-red-500/20">
              <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-red-400 mb-1">
                  Comprobante rechazado
                </p>
                <p className="text-xs text-gray-300 leading-relaxed">
                  {pago.rejectionReason}
                </p>
              </div>
            </div>
          )}

          {/* Preview del comprobante */}
          {pago.comprobanteUrl && (
            <ComprobantePreview
              url={pago.comprobanteUrl}
              uploadedAt={pago.uploadedAt}
              approvedAt={pago.approvedAt}
            />
          )}

          {/* Acciones */}
          <div className="flex flex-col sm:flex-row gap-2">
            {/* Estudio: subir comprobante (mientras no esté aprobado) */}
            {status !== "aprobado" && (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,application/pdf"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    e.target.value = "";
                    if (file) handleFile(file);
                  }}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={busy !== null}
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-xs font-black uppercase tracking-widest text-gray-300 hover:bg-white/10 hover:text-white transition-all disabled:opacity-50"
                >
                  {busy === "upload" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                  {pago.comprobanteUrl
                    ? status === "rechazado"
                      ? "Subir nuevo comprobante"
                      : "Reemplazar comprobante"
                    : "Subir comprobante"}
                </button>
              </>
            )}

            {/* InZidium: aprobar / rechazar (sólo cuando hay comprobante en revisión) */}
            {isInZidium && status === "enviado" && (
              <>
                <button
                  onClick={handleApprove}
                  disabled={busy !== null}
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-xs font-black uppercase tracking-widest text-emerald-300 hover:bg-emerald-500/30 transition-all disabled:opacity-50"
                >
                  {busy === "approve" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  Aprobar
                </button>
                <button
                  onClick={() => setRejectOpen(true)}
                  disabled={busy !== null}
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs font-black uppercase tracking-widest text-red-300 hover:bg-red-500/20 transition-all disabled:opacity-50"
                >
                  <X className="w-4 h-4" />
                  Rechazar
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Modal de rechazo */}
      <AnimatePresence>
        {rejectOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !busy && setRejectOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative z-10 w-full max-w-md rounded-3xl border border-red-500/20 bg-[#060214]/95 p-6 sm:p-8 shadow-2xl"
            >
              <div className="mb-6">
                <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mb-4">
                  <XCircle className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tighter text-white mb-2">
                  Rechazar comprobante
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  El estudio verá esta nota y podrá re-subir el comprobante.
                </p>
              </div>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Ej: foto borrosa, monto no coincide, falta fecha..."
                rows={4}
                className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-red-500/40 resize-none"
              />
              <div className="grid grid-cols-2 gap-3 mt-6">
                <button
                  onClick={() => setRejectOpen(false)}
                  disabled={busy !== null}
                  className="py-3 rounded-xl border border-white/10 text-gray-500 font-black text-[10px] uppercase tracking-widest hover:bg-white/5"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleReject}
                  disabled={busy !== null || !rejectReason.trim()}
                  className="py-3 rounded-xl bg-red-500 text-white font-black text-[10px] uppercase tracking-widest hover:bg-red-600 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {busy === "reject" ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : null}
                  Confirmar rechazo
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Helpers UI ──────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<
  PagoStatus,
  { label: string; icon: any; color: string; bg: string; border: string }
> = {
  pendiente: {
    label: "Pendiente",
    icon: Clock,
    color: "text-gray-400",
    bg: "bg-white/5",
    border: "border-white/10",
  },
  enviado: {
    label: "En revisión",
    icon: Clock,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
  },
  aprobado: {
    label: "Aprobado",
    icon: CheckCircle2,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  rechazado: {
    label: "Rechazado",
    icon: XCircle,
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
  },
};

function StatusBadge({ status }: { status: PagoStatus }) {
  const s = STATUS_STYLES[status];
  const Icon = s.icon;
  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest shrink-0 self-start ${s.bg} ${s.border} ${s.color}`}
    >
      <Icon className="w-3 h-3" />
      {s.label}
    </div>
  );
}

function ComprobantePreview({
  url,
  uploadedAt,
  approvedAt,
}: {
  url: string;
  uploadedAt?: string;
  approvedAt?: string;
}) {
  const isImage = /\.(jpg|jpeg|png|webp|gif)$/i.test(url);
  const isPdf = /\.pdf$/i.test(url);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-2xl border border-white/10 bg-black/30 overflow-hidden hover:border-white/20 transition-colors"
    >
      <div className="flex">
        {isImage ? (
          <img
            src={url}
            alt="Comprobante"
            className="h-24 w-24 object-cover shrink-0"
          />
        ) : (
          <div className="h-24 w-24 shrink-0 flex items-center justify-center bg-white/5">
            {isPdf ? (
              <FileText className="w-8 h-8 text-red-400/70" />
            ) : (
              <ImageIcon className="w-8 h-8 text-gray-500" />
            )}
          </div>
        )}
        <div className="p-4 flex-1 min-w-0">
          <p className="text-xs font-black uppercase tracking-widest text-white mb-1">
            Comprobante adjunto
          </p>
          {uploadedAt && (
            <p className="text-[10px] text-gray-500">
              Subido: {new Date(uploadedAt).toLocaleString("es-CO")}
            </p>
          )}
          {approvedAt && (
            <p className="text-[10px] text-emerald-400">
              Aprobado: {new Date(approvedAt).toLocaleString("es-CO")}
            </p>
          )}
          <p className="text-[9px] text-gray-600 uppercase tracking-widest mt-2 group-hover:text-gray-400 transition-colors">
            Click para ver →
          </p>
        </div>
      </div>
    </a>
  );
}

// ─── Editor de precio custom ─────────────────────────────────────────────────

function PrecioCustomEditor({
  project,
  precioTotal,
  isInZidium,
  onSave,
}: {
  project: any;
  precioTotal: number | null;
  isInZidium: boolean;
  onSave: (precio: number) => Promise<void>;
}) {
  const precioCustom: number | null = project.onboardingData?.precioCustom ?? null;
  const [editing, setEditing] = useState(false);
  const [temp, setTemp] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    const num = parseInt(temp.replace(/\D/g, ""), 10);
    if (!num || num <= 0) return;
    setSaving(true);
    await onSave(num);
    setSaving(false);
    setEditing(false);
  };

  if (editing) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
          Precio total del proyecto (COP)
        </p>
        <div className="flex items-center gap-3">
          <span className="text-xl font-black text-gray-500">$</span>
          <input
            type="text"
            value={temp}
            onChange={(e) => setTemp(e.target.value.replace(/\D/g, ""))}
            placeholder="0"
            className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-4 text-2xl font-black text-white outline-none focus:border-[#FFD700]/50"
            autoFocus
          />
          <span className="text-sm font-black text-gray-600">COP</span>
        </div>
        {temp && parseInt(temp) > 0 && (
          <div className="flex gap-3 text-[10px] font-black uppercase tracking-widest flex-wrap">
            <span className="text-gray-500">InZidium:</span>
            <span className="text-[#FFD700]">
              {COP(Math.round(parseInt(temp) * PCT_INZIDIUM))}
            </span>
            <span className="text-gray-600">·</span>
            <span className="text-gray-500">Estudio:</span>
            <span className="text-gray-400">
              {COP(Math.round(parseInt(temp) * PCT_ESTUDIO))}
            </span>
          </div>
        )}
        <div className="flex gap-3">
          <button
            onClick={() => {
              setEditing(false);
              setTemp("");
            }}
            className="flex-1 py-3 rounded-xl border border-white/10 text-gray-500 font-bold text-xs uppercase hover:bg-white/5 flex items-center justify-center gap-2"
          >
            <X className="w-4 h-4" /> Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !temp || parseInt(temp) <= 0}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#a855f7] to-[#FFD700] text-white font-black text-xs uppercase hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Check className="w-4 h-4" />
            )}
            Confirmar
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-3">
      <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">
        {precioTotal
          ? `Precio total acordado: ${COP(precioTotal)}`
          : "Precio total sin definir"}
      </p>
      {isInZidium ? (
        <button
          onClick={() => {
            setTemp(precioCustom ? String(precioCustom) : "");
            setEditing(true);
          }}
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5"
        >
          <Edit2 className="w-3 h-3" /> Editar precio
        </button>
      ) : (
        <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-gray-600">
          <Lock className="w-3 h-3" /> Solo InZidium
        </div>
      )}
    </div>
  );
}
