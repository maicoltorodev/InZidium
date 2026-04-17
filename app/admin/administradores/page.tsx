"use client";

import React, { useState, useEffect } from "react";
import { getAdmins, createAdmin, deleteAdmin } from "@/lib/actions";
import { useToast } from "@/app/providers/ToastProvider";
import {
  ShieldCheck,
  Plus,
  User,
  Loader2,
  Calendar,
  UserCircle,
  X,
  Sparkles,
  Search,
  ShieldAlert,
  AlertCircle,
  Trash2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AdminLoading } from "@/lib/ui/AdminLoading";
import { useRealtimeRefresh } from "@/hooks/use-realtime-refresh";

export default function AdminsPage() {
  const [cargando, setCargando] = useState(true);
  const [admins, setAdmins] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [errors, setErrors] = useState<any>({});
  const [adminToDelete, setAdminToDelete] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmUsername, setConfirmUsername] = useState("");

  useEffect(() => {
    if (!adminToDelete) setConfirmUsername("");
  }, [adminToDelete]);

  useEffect(() => {
    loadAdmins();
  }, []);

  useRealtimeRefresh(["administradores"], loadAdmins);

  async function loadAdmins() {
    const data = await getAdmins();
    setAdmins(data);
    setCargando(false);
  }

  if (cargando) return <AdminLoading />;

  async function handleDeleteConfirm() {
    if (!adminToDelete) return;
    setIsDeleting(true);
    const result = await deleteAdmin(adminToDelete.id);

    if (result.error) {
      showToast(result.error, "error");
    } else {
      showToast(
        `ACCESO REVOCADO PARA ${adminToDelete.nombre.toUpperCase()}`,
        "info",
      );
      loadAdmins();
    }

    setIsDeleting(false);
    setAdminToDelete(null);
  }

  const filteredAdmins = admins.filter(
    (a) =>
      a.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.username.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="p-4 sm:p-6 lg:p-12 max-w-7xl mx-auto space-y-8 lg:space-y-12">
      <header className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 lg:gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex items-center gap-3 text-[#22d3ee] mb-2">
            <ShieldAlert className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] font-[family-name:var(--font-orbitron)]">
              Gestión de administradores
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tighter">
            Nuestro{" "}
            <span className="bg-gradient-to-r from-[#e879f9] via-[#a855f7] to-[#22d3ee] bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
              Equipo
            </span>
          </h1>
        </motion.div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
          <div className="relative group flex-1 sm:flex-initial">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-[#22d3ee] transition-colors" />
            <input
              type="text"
              placeholder="Buscar administrador..."
              className="bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-6 text-sm focus:outline-none focus:border-[#22d3ee]/50 focus:bg-white/[0.08] transition-all w-full sm:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => setIsAdding(true)}
            className="group relative px-6 py-3 rounded-2xl font-bold text-sm transition-all hover:scale-105 active:scale-95 overflow-hidden shadow-[0_0_30px_rgba(168,85,247,0.15),_0_0_30px_rgba(34,211,238,0.1)]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#e879f9] via-[#a855f7] to-[#22d3ee] animate-gradient bg-[length:200%_auto]" />
            <div className="relative flex items-center justify-center gap-2 text-white font-black uppercase tracking-widest text-[10px]">
              <Plus className="w-5 h-5" />
              <span className="inline">Nuevo administrador</span>
            </div>
          </button>
        </div>
      </header>

      <div className="min-h-[400px]">
        {filteredAdmins.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            <AnimatePresence mode="popLayout">
              {filteredAdmins.map((admin, idx) => (
                <motion.div
                  key={admin.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#a855f7]/10 to-[#22d3ee]/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
                  <div className="relative bg-white/[0.04] backdrop-blur-xl border border-white/8 p-8 rounded-3xl hover:border-white/20 transition-all duration-500 h-full flex flex-col">
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#22d3ee]/15 to-[#a855f7]/10 border border-white/5 flex items-center justify-center text-[#22d3ee] group-hover:scale-110 transition-transform duration-500">
                        <ShieldCheck className="w-6 h-6" />
                      </div>
                      <div className="px-3 py-1 bg-gradient-to-r from-[#22d3ee]/10 to-[#a855f7]/10 border border-white/10 rounded-full text-[8px] font-black uppercase tracking-widest text-transparent bg-clip-text">
                        Acceso total
                      </div>
                    </div>

                    <h3 className="text-xl font-bold mb-2 group-hover:text-white transition-colors">
                      {admin.nombre}
                    </h3>
                    <div className="flex items-center gap-2 text-gray-500 text-xs mb-8">
                      <UserCircle className="w-3.5 h-3.5" />
                      <span className="truncate">{admin.username}</span>
                    </div>

                    <div className="mt-auto pt-6 border-t border-white/5 flex justify-between items-center text-[10px] font-black text-gray-600 uppercase tracking-widest">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>
                          Desde {new Date(admin.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <button
                        onClick={() =>
                          admins.length > 1 && setAdminToDelete(admin)
                        }
                        disabled={admins.length <= 1}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 shadow-lg ${
                          admins.length <= 1
                            ? "bg-gray-500/5 text-gray-700 border border-white/5 cursor-not-allowed opacity-50"
                            : "bg-red-500/5 hover:bg-red-500 text-red-500/50 hover:text-white border border-red-500/10 hover:border-red-500 group/trash hover:scale-110 active:scale-90"
                        }`}
                        title={
                          admins.length <= 1
                            ? "Debe existir al menos un administrador"
                            : "Eliminar administrador"
                        }
                      >
                        <Trash2 className="w-3.5 h-3.5 group-hover/trash:rotate-12 transition-transform" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-32 text-center"
          >
            <div className="w-24 h-24 bg-white/5 rounded-[2.5rem] border border-white/10 flex items-center justify-center text-gray-700 mb-8 relative group">
              <ShieldAlert className="w-10 h-10 group-hover:text-[#22d3ee] transition-colors duration-500" />
              <div className="absolute inset-0 bg-gradient-to-br from-[#22d3ee]/5 to-[#a855f7]/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <h2 className="text-2xl font-black mb-3 font-[family-name:var(--font-orbitron)] uppercase tracking-tight text-white">
              No hay administradores
            </h2>
            <p className="text-gray-500 text-sm max-w-sm mb-10 leading-relaxed font-medium">
              Aún no hay administradores configurados. <br />
              Crea una cuenta para compartir la gestión operativa.
            </p>
            <button
              onClick={() => setIsAdding(true)}
              className="px-10 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:bg-gradient-to-r hover:from-[#22d3ee] hover:to-[#a855f7] hover:text-white hover:border-transparent transition-all duration-500"
            >
              Crear administrador
            </button>
          </motion.div>
        )}
      </div>

      {/* Modal Registro */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAdding(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-[#060214]/90 border border-white/10 w-full max-w-lg rounded-3xl p-6 sm:p-10 relative z-10 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#22d3ee]/5 to-[#a855f7]/8 blur-[100px] -z-10" />

              <button
                onClick={() => setIsAdding(false)}
                className="absolute top-4 right-4 sm:top-8 sm:right-8 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-gray-500 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all duration-300 group/close z-50"
              >
                <X className="w-6 h-6 group-hover/close:rotate-90 transition-transform duration-300" />
              </button>

              <div className="mb-8 sm:mb-10 text-center pt-6 sm:pt-0">
                <span className="text-xs font-black text-transparent bg-clip-text bg-gradient-to-r from-[#22d3ee] to-[#a855f7] uppercase tracking-[0.5em] mb-2 block">
                  Nuevo administrador
                </span>
                <h2 className="text-2xl sm:text-3xl font-black font-[family-name:var(--font-orbitron)] mb-2 uppercase tracking-tighter">
                  Crear administrador
                </h2>
                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">
                  Crea una cuenta con acceso administrativo al panel.
                </p>
              </div>

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const newErrors: any = {};

                  if (!formData.get("nombre"))
                    newErrors.nombre = "Nombre requerido.";
                  if (!formData.get("username"))
                    newErrors.username = "Usuario necesario.";
                  if (!formData.get("password"))
                    newErrors.password = "Seguridad requerida.";
                  if (
                    formData.get("password") !== formData.get("confirmPassword")
                  ) {
                    newErrors.confirmPassword = "Las contraseñas no coinciden.";
                  }

                  if (Object.keys(newErrors).length > 0) {
                    setErrors(newErrors);
                    return;
                  }

                  const result = await createAdmin(formData);

                  if (result?.error) {
                    setErrors({ username: result.error });
                    showToast(result.error, "error");
                    return;
                  }

                  showToast("ADMINISTRADOR CREADO CON ÉXITO", "success");
                  setIsAdding(false);
                  setErrors({});
                  loadAdmins();
                }}
                className="space-y-6"
              >
                <PremiumInput
                  name="nombre"
                  placeholder="Nombre Real"
                  icon={UserCircle}
                  error={errors.nombre}
                  onFocus={() => setErrors({ ...errors, nombre: null })}
                />
                <PremiumInput
                  name="username"
                  placeholder="Nombre de Usuario (Login)"
                  icon={User}
                  error={errors.username}
                  onFocus={() => setErrors({ ...errors, username: null })}
                />
                <div className="space-y-4">
                  <PremiumInput
                    name="password"
                    type="password"
                    placeholder="Contraseña de Seguridad"
                    icon={ShieldCheck}
                    error={errors.password}
                    onFocus={() => setErrors({ ...errors, password: null })}
                  />
                  <PremiumInput
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirmar Contraseña"
                    icon={ShieldCheck}
                    error={errors.confirmPassword}
                    onFocus={() =>
                      setErrors({ ...errors, confirmPassword: null })
                    }
                  />
                  <p className="px-4 text-[8px] text-gray-600 font-bold uppercase tracking-widest leading-loose">
                    Requisito: mínimo 8 caracteres, una mayúscula, un número y
                    un símbolo (@$!%*?&).
                  </p>
                </div>

                <button
                  type="submit"
                  className="relative group w-full py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-sm transition-all hover:scale-[1.02] active:scale-95 overflow-hidden shadow-[0_10px_30px_rgba(168,85,247,0.15),_0_10px_30px_rgba(34,211,238,0.1)] mt-6"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#e879f9] via-[#a855f7] to-[#22d3ee] animate-gradient bg-[length:200%_auto]" />
                  <span className="relative text-white">
                    Crear administrador
                  </span>
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal Confirmación Eliminación */}
      <AnimatePresence>
        {adminToDelete && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isDeleting && setAdminToDelete(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-[#060214]/95 border border-red-500/20 w-full max-w-md rounded-3xl p-6 sm:p-10 relative z-10 shadow-2xl"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500 mx-auto mb-6">
                  <ShieldAlert className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black font-[family-name:var(--font-orbitron)] mb-3 uppercase tracking-tighter">
                  Eliminar administrador
                </h3>
                <p className="text-gray-500 text-sm mb-6">
                  ¿Estás seguro de eliminar el acceso de{" "}
                  <span className="text-white font-bold">
                    {adminToDelete.nombre}
                  </span>
                  ? Esta acción no se puede deshacer.
                </p>

                <div className="mb-8 text-left">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 mb-2 block">
                    Escribe el usuario para confirmar:
                  </label>
                  <div className="relative group/confirm">
                    <UserCircle
                      className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${confirmUsername === adminToDelete.username ? "text-emerald-400" : "text-gray-600"}`}
                    />
                    <input
                      type="text"
                      value={confirmUsername}
                      onChange={(e) => setConfirmUsername(e.target.value)}
                      placeholder={adminToDelete.username}
                      className={`w-full bg-white/[0.03] border rounded-2xl py-4 pl-12 pr-6 text-xs transition-all placeholder:text-gray-800 focus:outline-none ${confirmUsername === adminToDelete.username ? "border-emerald-500/50 bg-emerald-500/5 text-emerald-400" : "border-white/10 focus:border-red-500/30"}`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    disabled={isDeleting}
                    onClick={() => setAdminToDelete(null)}
                    className="py-4 rounded-xl border border-white/5 text-gray-500 font-bold text-xs uppercase tracking-widest hover:bg-white/5 transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    disabled={
                      isDeleting || confirmUsername !== adminToDelete.username
                    }
                    onClick={handleDeleteConfirm}
                    className={`py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-xl border ${
                      confirmUsername === adminToDelete.username
                        ? "bg-red-500 text-white border-red-400/20 hover:bg-red-600 shadow-[0_10px_20px_-5px_rgba(239,68,68,0.3)]"
                        : "bg-gray-800/50 text-gray-600 border-white/5 grayscale cursor-not-allowed"
                    }`}
                  >
                    {isDeleting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>Eliminar</>
                    )}
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

function PremiumInput({
  icon: Icon,
  placeholder,
  error,
  onFocus,
  ...props
}: any) {
  return (
    <div className="relative group">
      <div
        className={`absolute -inset-0.5 rounded-2xl transition-opacity blur-[2px] ${error ? "bg-red-500/40 opacity-100" : "bg-gradient-to-r from-[#22d3ee]/10 to-[#a855f7]/10 opacity-0 group-focus-within:opacity-100"}`}
      />
      <div className="relative">
        <Icon
          className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${error ? "text-red-400" : "text-gray-500 group-focus-within:text-[#22d3ee]"}`}
        />
        <input
          {...props}
          placeholder={placeholder}
          onFocus={onFocus}
          className={`w-full bg-white/[0.04] border rounded-2xl py-4 pl-12 pr-6 text-sm focus:outline-none transition-all placeholder:text-gray-600 ${error ? "border-red-500/50 focus:border-red-500" : "border-white/8 group-hover:border-white/15 focus:border-[#22d3ee]/50 focus:bg-white/[0.08]"}`}
        />
      </div>
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="absolute -right-2 top-0 -translate-y-1/2 bg-red-500 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-xl z-20 flex items-center gap-2 pointer-events-none"
          >
            <AlertCircle className="w-3 h-3" />
            {error}
            <div className="absolute bottom-0 right-4 translate-y-full w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-red-500" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
