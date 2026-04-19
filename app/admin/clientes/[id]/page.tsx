"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getClienteById, updateCliente, deleteCliente } from "@/lib/actions";
import {
  formatName,
  validateName,
  formatCedula,
  validateCedula,
  formatEmail,
  validateEmail,
  formatPhoneDigitsCO,
  displayPhoneCO,
  fullPhoneCO,
  validatePhoneCO,
} from "@/lib/input-formatters";
import { useToast } from "@/app/providers/ToastProvider";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  CreditCard,
  Save,
  Trash2,
  Loader2,
  Edit3,
  X,
  Check,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ClienteDetalle() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const [cliente, setCliente] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [errors, setErrors] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (params.id) {
      loadCliente();
    }
  }, [params.id]);

  async function loadCliente() {
    try {
      const data = await getClienteById(params.id as string);
      if (data) {
        setCliente(data);
        // Convertir teléfono guardado ("+57 300 123 45 67") a dígitos
        // nacionales para poder editarlo con el formatter.
        setFormData({
          ...data,
          phoneDigits: formatPhoneDigitsCO(data.telefono ?? ""),
        });
      } else {
        showToast("Cliente no encontrado", "error");
        router.push("/admin/clientes");
      }
    } catch (error) {
      showToast("Error al cargar el cliente", "error");
      router.push("/admin/clientes");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (saving) return;

    const newErrors: any = {
      nombre: validateName(formData.nombre ?? ""),
      cedula: validateCedula(formData.cedula ?? ""),
      email: validateEmail(formData.email ?? ""),
      telefono: validatePhoneCO(formData.phoneDigits ?? ""),
    };
    const hasErrors = Object.values(newErrors).some((v) => v);
    if (hasErrors) {
      setErrors(newErrors);
      return;
    }

    const payload = {
      nombre: formData.nombre.trim(),
      cedula: formData.cedula,
      email: formData.email.trim(),
      telefono: fullPhoneCO(formData.phoneDigits),
    };

    setSaving(true);
    try {
      await updateCliente(params.id as string, payload);
      setCliente({ ...cliente, ...payload });
      setEditing(false);
      showToast("Cliente actualizado con éxito", "success");
    } catch (error) {
      showToast("Error al actualizar el cliente", "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (deleting) return;
    setDeleting(true);
    try {
      await deleteCliente(params.id as string);
      showToast("Cliente eliminado con éxito", "success");
      router.push("/admin/clientes");
    } catch (error) {
      showToast("Error al eliminar el cliente", "error");
      setDeleting(false);
    }
  }

  if (!cliente) {
    return (
      <div className="p-8 max-w-4xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4">Cliente no encontrado</h2>
        <button
          onClick={() => router.push("/admin/clientes")}
          className="px-6 py-3 bg-gradient-to-r from-[#a855f7] to-[#22d3ee] text-white rounded-xl font-bold hover:opacity-90 transition-colors"
        >
          Volver a Clientes
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => router.push("/admin/clientes")}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Volver a Clientes</span>
        </button>

        <div className="flex items-center gap-4">
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#a855f7] text-white rounded-xl font-bold hover:bg-[#a855f7]/90 transition-colors"
            >
              <Edit3 className="w-4 h-4" />
              Editar
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setEditing(false);
                  setFormData(cliente);
                  setErrors({});
                }}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-xl font-bold hover:bg-gray-700 transition-colors"
              >
                <X className="w-4 h-4" />
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#a855f7] to-[#22d3ee] text-white rounded-xl font-bold hover:opacity-90 transition-colors disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Guardar
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Cliente Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/[0.04] backdrop-blur-xl border border-white/8 rounded-3xl p-12"
      >
        <div className="flex items-center gap-6 mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-[#e879f9] to-[#a855f7] rounded-3xl flex items-center justify-center text-white">
            <User className="w-10 h-10" />
          </div>
          <div>
            <h1 className="text-3xl font-black mb-2">{cliente.nombre}</h1>
            <p className="text-gray-400">ID: #{cliente.cedula}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600">
              Nombre Completo
            </label>
            {editing ? (
              <input
                type="text"
                value={formData.nombre || ""}
                onChange={(e) =>
                  setFormData({ ...formData, nombre: formatName(e.target.value) })
                }
                className={`w-full bg-white/5 border rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#a855f7] ${errors.nombre ? "border-red-500" : "border-white/10"}`}
              />
            ) : (
              <div className="flex items-center gap-3 text-white">
                <User className="w-4 h-4 text-gray-500" />
                <span>{cliente.nombre}</span>
              </div>
            )}
            {errors.nombre && (
              <p className="text-red-400 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {errors.nombre}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600">
              Correo Electrónico
            </label>
            {editing ? (
              <input
                type="email"
                inputMode="email"
                value={formData.email || ""}
                onChange={(e) =>
                  setFormData({ ...formData, email: formatEmail(e.target.value) })
                }
                className={`w-full bg-white/5 border rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#a855f7] ${errors.email ? "border-red-500" : "border-white/10"}`}
              />
            ) : (
              <div className="flex items-center gap-3 text-white">
                <Mail className="w-4 h-4 text-gray-500" />
                <span>{cliente.email}</span>
              </div>
            )}
            {errors.email && (
              <p className="text-red-400 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {errors.email}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600">
              Teléfono
            </label>
            {editing ? (
              <div className="relative flex items-center">
                <span className="absolute left-4 text-sm font-bold text-gray-400 pointer-events-none select-none">
                  +57
                </span>
                <input
                  type="tel"
                  inputMode="tel"
                  placeholder="300 123 45 67"
                  value={displayPhoneCO(formData.phoneDigits || "")}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      phoneDigits: formatPhoneDigitsCO(e.target.value),
                    })
                  }
                  className={`w-full bg-white/5 border rounded-xl py-3 pl-14 pr-4 text-white focus:outline-none focus:border-[#a855f7] ${errors.telefono ? "border-red-500" : "border-white/10"}`}
                />
              </div>
            ) : (
              <div className="flex items-center gap-3 text-white">
                <Phone className="w-4 h-4 text-gray-500" />
                <span>{cliente.telefono}</span>
              </div>
            )}
            {errors.telefono && (
              <p className="text-red-400 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {errors.telefono}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600">
              Cédula
            </label>
            {editing ? (
              <input
                type="text"
                inputMode="numeric"
                value={formData.cedula || ""}
                onChange={(e) =>
                  setFormData({ ...formData, cedula: formatCedula(e.target.value) })
                }
                className={`w-full bg-white/5 border rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#a855f7] ${errors.cedula ? "border-red-500" : "border-white/10"}`}
              />
            ) : (
              <div className="flex items-center gap-3 text-white">
                <CreditCard className="w-4 h-4 text-gray-500" />
                <span>{cliente.cedula}</span>
              </div>
            )}
            {errors.cedula && (
              <p className="text-red-400 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {errors.cedula}
              </p>
            )}
          </div>
        </div>

        {!editing && (
          <div className="mt-8 pt-8 border-t border-white/10">
            <button
              onClick={() => setConfirmDelete(true)}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl font-bold hover:bg-red-500/20 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Eliminar Cliente
            </button>
          </div>
        )}
      </motion.div>

      {/* Modal de Confirmación de Eliminación */}
      <AnimatePresence>
        {confirmDelete && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setConfirmDelete(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-[#060214]/95 border border-white/10 rounded-3xl p-8 relative z-10 max-w-md w-full"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500 mx-auto mb-4">
                  <Trash2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">¿Eliminar Cliente?</h3>
                <p className="text-gray-400 mb-6">
                  Estás a punto de eliminar permanentemente a{" "}
                  <span className="text-white font-bold">{cliente.nombre}</span>
                  . Esta acción no se puede deshacer.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="py-3 bg-white/5 border border-white/10 rounded-xl text-gray-400 font-bold hover:bg-white/10 hover:text-white transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleDelete}
                    className="py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-colors"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
