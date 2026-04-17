"use client";

import React, { useState } from "react";
import {
  Edit2,
  Check,
  X,
  Lock,
  Loader2,
  ArrowRight,
  AlertTriangle,
  Camera,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";

const PRECIO_TOTAL_ESTANDAR = 499000;
const PCT_INZIDIUM = 0.8;
const PCT_ESTUDIO = 0.2;

const COP = (n: number) => "$" + n.toLocaleString("es-CO") + " COP";

interface TabFinanceProps {
  project: any;
  projectId: string;
  onUpdatePrecio: (precio: number) => Promise<void>;
  onUpdatePagoRecibido: (recibido: boolean) => Promise<void>;
}

export function TabFinance({
  project,
  projectId,
  onUpdatePrecio,
  onUpdatePagoRecibido,
}: TabFinanceProps) {
  const { data: session } = useSession();
  const isInZidium = (session?.user as any)?.username === "InZidium";
  const isEstandar = project.plan === "Plan Estándar";

  const precioCustom: number | null = project.onboardingData?.precioCustom ?? null;
  const pagoRecibido: boolean = project.onboardingData?.pagoRecibido ?? false;

  const precioTotal = isEstandar ? PRECIO_TOTAL_ESTANDAR : precioCustom;
  const montoInzidium = precioTotal ? Math.round(precioTotal * PCT_INZIDIUM) : null;
  const montoEstudio = precioTotal ? Math.round(precioTotal * PCT_ESTUDIO) : null;

  const [editingPrecio, setEditingPrecio] = useState(false);
  const [tempPrecio, setTempPrecio] = useState("");
  const [savingPrecio, setSavingPrecio] = useState(false);
  const [togglingPago, setTogglingPago] = useState(false);

  const handleSavePrecio = async () => {
    const num = parseInt(tempPrecio.replace(/\D/g, ""), 10);
    if (!num || num <= 0) return;
    setSavingPrecio(true);
    await onUpdatePrecio(num);
    setSavingPrecio(false);
    setEditingPrecio(false);
  };

  const handleTogglePago = async () => {
    setTogglingPago(true);
    await onUpdatePagoRecibido(!pagoRecibido);
    setTogglingPago(false);
  };

  return (
    <motion.div
      key="finance"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="max-w-3xl mx-auto space-y-6"
    >

      {/* ── HERO: MONTO A TRANSFERIR ── */}
      <div className={`relative bg-[#0a0a0a]/50 border rounded-[3rem] p-10 overflow-hidden transition-colors ${pagoRecibido ? "border-emerald-500/30" : "border-white/10"}`}>

        {/* Glow de fondo según estado */}
        <div className={`absolute inset-0 rounded-[3rem] transition-opacity duration-700 ${pagoRecibido ? "opacity-100" : "opacity-0"}`}
          style={{ background: "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(16,185,129,0.06) 0%, transparent 70%)" }}
        />

        <div className="relative z-10 space-y-8">

          {/* Encabezado */}
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 mb-2">
                Transferencia a InZidium
              </p>
              <div className="flex items-baseline gap-3">
                {montoInzidium ? (
                  <span className="text-5xl font-black text-white tracking-tight">
                    {COP(montoInzidium)}
                  </span>
                ) : (
                  <span className="text-2xl font-black text-gray-600 uppercase tracking-widest">
                    Monto no definido
                  </span>
                )}
              </div>
              {precioTotal && (
                <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mt-2">
                  80% de {COP(precioTotal)} · {project.plan}
                </p>
              )}
            </div>

            {/* Badge plan */}
            <div className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-right shrink-0">
              <p className="text-[8px] font-black uppercase tracking-widest text-gray-600 mb-0.5">Plan</p>
              <p className="text-xs font-black text-white uppercase">{project.plan}</p>
            </div>
          </div>

          {/* Toggle de estado de pago */}
          {montoInzidium && (
            <button
              onClick={handleTogglePago}
              disabled={togglingPago}
              className={`w-full flex items-center justify-between px-8 py-5 rounded-2xl border transition-all duration-300 ${
                pagoRecibido
                  ? "bg-emerald-500/10 border-emerald-500/30 hover:bg-emerald-500/15"
                  : "bg-white/[0.03] border-white/10 hover:bg-white/[0.05] hover:border-white/20"
              }`}
            >
              <div className="flex items-center gap-4">
                {togglingPago ? (
                  <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
                ) : pagoRecibido ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <Clock className="w-5 h-5 text-gray-500" />
                )}
                <div className="text-left">
                  <p className={`text-sm font-black uppercase tracking-widest ${pagoRecibido ? "text-emerald-400" : "text-gray-400"}`}>
                    {pagoRecibido ? "Transferencia recibida" : "Pendiente de transferencia"}
                  </p>
                  <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest mt-0.5">
                    {pagoRecibido ? "El estudio realizó el pago correctamente" : "El estudio aún no ha transferido"}
                  </p>
                </div>
              </div>
              <div className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border ${
                pagoRecibido
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                  : "bg-white/5 border-white/10 text-gray-500"
              }`}>
                {pagoRecibido ? "Marcar pendiente" : "Marcar recibido"}
              </div>
            </button>
          )}

          {/* Editor de precio para A la medida */}
          {!isEstandar && (
            <div className="border-t border-white/5 pt-6">
              <AnimatePresence mode="wait">
                {editingPrecio ? (
                  <motion.div
                    key="editing"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="space-y-4"
                  >
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                      Precio total del proyecto (COP)
                    </p>
                    <div className="flex items-center gap-3">
                      <span className="text-xl font-black text-gray-500">$</span>
                      <input
                        type="text"
                        value={tempPrecio}
                        onChange={(e) => setTempPrecio(e.target.value.replace(/\D/g, ""))}
                        placeholder="0"
                        className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-4 text-2xl font-black text-white outline-none focus:border-[#FFD700]/50"
                        autoFocus
                      />
                      <span className="text-sm font-black text-gray-600">COP</span>
                    </div>
                    {tempPrecio && parseInt(tempPrecio) > 0 && (
                      <div className="flex gap-3 text-[10px] font-black uppercase tracking-widest">
                        <span className="text-gray-500">InZidium recibirá:</span>
                        <span className="text-[#FFD700]">
                          {COP(Math.round(parseInt(tempPrecio) * 0.8))}
                        </span>
                        <span className="text-gray-600">·</span>
                        <span className="text-gray-500">Estudio:</span>
                        <span className="text-gray-400">
                          {COP(Math.round(parseInt(tempPrecio) * 0.2))}
                        </span>
                      </div>
                    )}
                    <div className="flex gap-3">
                      <button
                        onClick={() => { setEditingPrecio(false); setTempPrecio(""); }}
                        className="flex-1 py-3 rounded-xl border border-white/10 text-gray-500 font-bold text-xs uppercase hover:bg-white/5 flex items-center justify-center gap-2"
                      >
                        <X className="w-4 h-4" /> Cancelar
                      </button>
                      <button
                        onClick={handleSavePrecio}
                        disabled={savingPrecio || !tempPrecio || parseInt(tempPrecio) <= 0}
                        className="flex-1 py-3 rounded-xl bg-[#FFD700] text-black font-black text-xs uppercase hover:bg-yellow-400 disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {savingPrecio ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                        Confirmar
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="display"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-between"
                  >
                    <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">
                      {precioTotal ? `Precio total acordado: ${COP(precioTotal)}` : "Precio total sin definir"}
                    </p>
                    {isInZidium ? (
                      <button
                        onClick={() => { setTempPrecio(precioCustom ? String(precioCustom) : ""); setEditingPrecio(true); }}
                        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5"
                      >
                        <Edit2 className="w-3 h-3" /> Editar precio
                      </button>
                    ) : (
                      <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-gray-600">
                        <Lock className="w-3 h-3" /> Solo InZidium
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* ── DESGLOSE 80 / 20 ── */}
      {precioTotal && (
        <div className="bg-[#0a0a0a]/50 border border-white/10 rounded-[2.5rem] p-8">
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-gray-500 mb-6">
            Distribución del proyecto
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 rounded-2xl bg-[#FFD700]/5 border border-[#FFD700]/20 space-y-1">
              <p className="text-[9px] font-black uppercase tracking-widest text-[#FFD700]/60">
                InZidium · 80%
              </p>
              <p className="text-2xl font-black text-[#FFD700]">
                {COP(montoInzidium!)}
              </p>
              <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">
                Desarrollo & plataforma
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
              <p className="text-[9px] font-black uppercase tracking-widest text-gray-500">
                Estudio · 20%
              </p>
              <p className="text-2xl font-black text-white">
                {COP(montoEstudio!)}
              </p>
              <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">
                Comisión comercial
              </p>
            </div>
          </div>

          {/* Nota pasarela */}
          <div className="mt-4 flex items-start gap-3 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10">
            <AlertTriangle className="w-4 h-4 text-amber-500/60 shrink-0 mt-0.5" />
            <p className="text-[10px] text-gray-500 leading-relaxed">
              Si el cliente pagó mediante pasarela de pago, la comisión de la pasarela
              {" "}<span className="text-amber-400/80 font-black">(3–4%)</span>{" "}
              se descuenta del 20% del estudio. La transferencia a InZidium es siempre fija.
            </p>
          </div>
        </div>
      )}

      {/* ── COMPROBANTE ── */}
      <div className="bg-[#0a0a0a]/50 border border-white/10 rounded-[2.5rem] p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-gray-500 mb-1">
              Comprobante de transferencia
            </p>
            <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">
              El estudio adjunta el soporte cuando realiza el pago
            </p>
          </div>
          <div className="text-[9px] font-black uppercase tracking-widest text-gray-600 px-3 py-1.5 rounded-full border border-white/5">
            #{projectId?.toString().slice(-6).toUpperCase()}
          </div>
        </div>

        <div className="flex items-center justify-center aspect-[3/1] rounded-2xl border-2 border-dashed border-white/5 bg-black/20 hover:border-white/10 hover:bg-white/[0.02] transition-all cursor-pointer group">
          <div className="flex flex-col items-center gap-3 text-gray-600 group-hover:text-gray-400 transition-colors">
            <Camera className="w-8 h-8" />
            <div className="text-center">
              <p className="text-[10px] font-black uppercase tracking-widest">
                Subir comprobante
              </p>
              <p className="text-[8px] font-bold uppercase tracking-widest opacity-60 mt-0.5">
                JPG, PNG o PDF
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ArrowRight className="w-3 h-3 text-gray-600 shrink-0" />
          <p className="text-[9px] text-gray-600 leading-relaxed font-bold uppercase tracking-widest">
            Concepto: Infraestructura & Desarrollo · {project.plan}
          </p>
        </div>
      </div>

    </motion.div>
  );
}
