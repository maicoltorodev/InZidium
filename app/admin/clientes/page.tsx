"use client";

import React, { useState, useEffect } from "react";
import { createCliente, getClientes, deleteCliente } from "@/lib/actions";
import { useToast } from "@/app/providers/ToastProvider";
import {
  Plus,
  Users,
  Mail,
  CreditCard,
  Phone,
  Loader2,
  Search,
  Filter,
  UserPlus,
  X,
  Sparkles,
  AlertCircle,
  Trash2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AdminLoading } from "@/lib/ui/AdminLoading";
import { useRealtimeRefresh } from "@/hooks/use-realtime-refresh";

export default function ClientsAdmin() {
  const [cargando, setCargando] = useState(true);
  const [clients, setClients] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [errors, setErrors] = useState<any>({});
  const [confirmDelete, setConfirmDelete] = useState<{
    id: string;
    nombre: string;
    cedula: string;
  } | null>(null);
  const [isDoubleConfirm, setIsDoubleConfirm] = useState(false);
  const [isTripleConfirm, setIsTripleConfirm] = useState(false);
  const [docInput, setDocInput] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadClients();
  }, []);

  useRealtimeRefresh(["clientes"], loadClients);

  async function loadClients() {
    const data = await getClientes();
    setClients(data);
    setCargando(false);
  }

  if (cargando) return <AdminLoading />;

  async function handleDelete() {
    if (!confirmDelete || docInput !== confirmDelete.cedula) return;
    setIsDeleting(true);
    await deleteCliente(confirmDelete.id);
    showToast(
      `CLIENTE ${confirmDelete.nombre.toUpperCase()} ELIMINADO CON EXITO`,
      "success",
    );
    setConfirmDelete(null);
    setIsDoubleConfirm(false);
    setIsTripleConfirm(false);
    setDocInput("");
    setIsDeleting(false);
    loadClients();
  }

  const filteredClients = clients.filter(
    (c) =>
      c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.cedula.includes(searchTerm),
  );

  return (
    <div className="p-12 max-w-7xl mx-auto space-y-12">
      <header className="flex flex-row items-end justify-between gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex items-center gap-3 text-[#22d3ee] mb-2">
            <Users className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] font-[family-name:var(--font-orbitron)]">
              Gestión de clientes
            </span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter">
            Nuestros{" "}
            <span className="bg-gradient-to-r from-[#e879f9] via-[#a855f7] to-[#22d3ee] bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
              Clientes
            </span>
          </h1>
        </motion.div>

        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-[#22d3ee] transition-colors" />
            <input
              type="text"
              placeholder="Buscar cliente..."
              className="bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-6 text-sm focus:outline-none focus:border-[#22d3ee]/50 focus:bg-white/[0.08] transition-all w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => setIsAdding(true)}
            className="relative group px-6 py-3 rounded-2xl font-bold text-sm transition-all hover:scale-105 active:scale-95 overflow-hidden shadow-[0_0_20px_rgba(168,85,247,0.12),_0_0_20px_rgba(34,211,238,0.08)]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#e879f9] via-[#a855f7] to-[#22d3ee] animate-gradient bg-[length:200%_auto]" />
            <div className="relative flex items-center gap-2 text-white">
              <UserPlus className="w-5 h-5" />
              <span className="inline">Nuevo cliente</span>
            </div>
          </button>
        </div>
      </header>

      <div className="min-h-[400px]">
        {filteredClients.length > 0 ? (
          <div className="grid grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredClients.map((client, idx) => (
                <motion.div
                  key={client.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#e879f9]/10 via-[#a855f7]/10 to-[#22d3ee]/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl" />

                  <div className="relative bg-white/[0.04] backdrop-blur-xl border border-white/8 p-10 rounded-3xl hover:border-white/20 transition-all duration-500 h-full flex flex-col overflow-hidden">
                    <div className="absolute top-0 left-0 w-0 group-hover:w-full h-[2px] bg-gradient-to-r from-[#e879f9] via-[#a855f7] to-[#22d3ee] transition-all duration-700" />

                    <div className="flex justify-between items-start mb-10">
                      <div className="w-16 h-16 rounded-[2rem] bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 flex items-center justify-center text-[#22d3ee] group-hover:bg-[#22d3ee] group-hover:text-black group-hover:rotate-6 transition-all duration-500">
                        <Users className="w-7 h-7" />
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-600">
                          Documento
                        </span>
                        <span className="text-xs font-black text-gray-400 group-hover:text-[#22d3ee] transition-colors">
                          #{client.cedula}
                        </span>
                      </div>
                    </div>

                    <div className="mb-10">
                      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-transparent bg-clip-text bg-gradient-to-r from-[#22d3ee] to-[#a855f7] mb-2 block">
                        Cliente
                      </span>
                      <h3 className="text-2xl font-black group-hover:bg-gradient-to-r group-hover:from-[#e879f9] group-hover:via-[#a855f7] group-hover:to-[#22d3ee] group-hover:bg-clip-text group-hover:text-transparent transition-all duration-500 leading-none">
                        {client.nombre}
                      </h3>
                    </div>

                    <div className="space-y-5 flex-1">
                      <ClientInfo
                        icon={Mail}
                        label="Correo electrónico"
                        text={client.email}
                      />
                      <ClientInfo
                        icon={Phone}
                        label="Teléfono"
                        text={client.telefono}
                      />
                      <ClientInfo
                        icon={CreditCard}
                        label="Documento"
                        text={`C.C. ${client.cedula}`}
                      />
                    </div>

                    <div className="mt-12 pt-8 border-t border-white/5 flex justify-between items-center">
                      <div className="flex flex-col gap-1">
                        <span className="text-[8px] font-black text-gray-600 uppercase tracking-[0.3em]">
                          Registrado desde
                        </span>
                        <span className="text-[10px] font-bold text-gray-400">
                          {new Date(client.createdAt)
                            .toLocaleDateString("es-ES", {
                              month: "short",
                              year: "numeric",
                            })
                            .toUpperCase()}
                        </span>
                      </div>
                      <button
                        onClick={() =>
                          setConfirmDelete({
                            id: client.id,
                            nombre: client.nombre,
                            cedula: client.cedula,
                          })
                        }
                        className="w-10 h-10 rounded-xl bg-red-500/5 hover:bg-red-500 text-red-500/50 hover:text-white border border-red-500/10 hover:border-red-500 transition-all duration-300 flex items-center justify-center group/trash hover:scale-110 active:scale-90 shadow-lg"
                        title="Eliminar Cliente"
                      >
                        <Trash2 className="w-4 h-4 group-hover/trash:rotate-12 transition-transform" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-32 text-center"
          >
            <div className="w-24 h-24 bg-white/5 rounded-[2.5rem] border border-white/10 flex items-center justify-center text-gray-700 mb-8 relative group">
              <Users className="w-10 h-10 group-hover:text-[#22d3ee] transition-colors duration-500" />
              <div className="absolute inset-0 bg-[#22d3ee]/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <h2 className="text-2xl font-black mb-3 font-[family-name:var(--font-orbitron)] uppercase tracking-tight text-white">
              No hay clientes registrados
            </h2>
            <p className="text-gray-500 text-sm max-w-sm mb-10 leading-relaxed font-medium">
              No se han detectado clientes registrados. <br />
              Crea el primer cliente.
            </p>
            <button
              onClick={() => setIsAdding(true)}
              className="px-10 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:bg-[#22d3ee] hover:text-black hover:border-transparent transition-all duration-500"
            >
              Crear cliente
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
              className="absolute inset-0 bg-black/40 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40, rotateX: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-[#060214]/90 border border-white/10 w-full max-w-lg rounded-3xl p-12 relative z-10 shadow-[0_0_100px_rgba(168,85,247,0.12),_0_0_100px_rgba(34,211,238,0.08)] overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#22d3ee]/5 to-[#a855f7]/10 blur-[80px] -z-10 rounded-full" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#22d3ee]/10 blur-[80px] -z-10 rounded-full" />

              <button
                onClick={() => setIsAdding(false)}
                className="absolute top-8 right-8 w-12 h-12 flex items-center justify-center text-gray-500 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all duration-300 group/close z-50"
              >
                <X className="w-5 h-5 group-hover/close:rotate-90 transition-transform duration-300" />
              </button>

              <div className="mb-12 text-center relative">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                  className="w-20 h-20 bg-gradient-to-br from-[#a855f7] to-[#22d3ee] rounded-3xl flex items-center justify-center text-white mx-auto mb-8 shadow-[0_10px_30px_rgba(168,85,247,0.3)] rotate-3"
                >
                  <UserPlus className="w-10 h-10" />
                </motion.div>
                <h2 className="text-3xl font-black font-[family-name:var(--font-orbitron)] mb-3 uppercase tracking-tighter leading-none">
                  Nuevo <br />
                  <span className="bg-gradient-to-r from-[#e879f9] via-[#a855f7] to-[#22d3ee] bg-clip-text text-transparent">
                    Cliente
                  </span>
                </h2>
                <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em] opacity-80">
                  Registro de cliente
                </p>
              </div>

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const newErrors: any = {};

                  if (!formData.get("nombre"))
                    newErrors.nombre = "El nombre es obligatorio.";
                  if (!formData.get("cedula"))
                    newErrors.cedula = "La cédula es obligatoria.";
                  if (!formData.get("email"))
                    newErrors.email = "El correo es necesario.";
                  if (!formData.get("telefono"))
                    newErrors.telefono = "El teléfono es requerido.";

                  if (Object.keys(newErrors).length > 0) {
                    setErrors(newErrors);
                    return;
                  }

                  const result = await createCliente(formData);

                  if (result?.error) {
                    setErrors({ cedula: result.error });
                    showToast(result.error, "error");
                    return;
                  }

                  showToast("CLIENTE REGISTRADO CON ÉXITO", "success");
                  setIsAdding(false);
                  setErrors({});
                  loadClients();
                }}
                className="space-y-5 relative"
              >
                <PremiumInput
                  name="nombre"
                  placeholder="Nombre Completo"
                  icon={Users}
                  error={errors.nombre}
                  onFocus={() => setErrors({ ...errors, nombre: null })}
                />
                <PremiumInput
                  name="cedula"
                  placeholder="Documento / Cédula"
                  icon={CreditCard}
                  error={errors.cedula}
                  onFocus={() => setErrors({ ...errors, cedula: null })}
                />
                <PremiumInput
                  name="email"
                  type="email"
                  placeholder="Correo Electrónico"
                  icon={Mail}
                  error={errors.email}
                  onFocus={() => setErrors({ ...errors, email: null })}
                />
                <PremiumInput
                  name="telefono"
                  placeholder="WhatsApp / Teléfono"
                  icon={Phone}
                  error={errors.telefono}
                  onFocus={() => setErrors({ ...errors, telefono: null })}
                />

                <div className="pt-6">
                  <button
                    type="submit"
                    className="group relative w-full h-16 rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 hover:scale-[1.02] active:scale-95"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#e879f9] via-[#a855f7] to-[#22d3ee] bg-[length:200%_auto] animate-gradient" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                    <div className="relative flex items-center justify-center">
                      <span className="font-black text-white uppercase tracking-[0.2em] text-xs">
                        Guardar cliente
                      </span>
                    </div>
                  </button>

                  <p className="mt-4 text-[9px] text-center text-gray-600 font-bold uppercase tracking-widest leading-relaxed">
                    Al guardar, el cliente podrá acceder a sus proyectos con su
                    número de cédula.
                  </p>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal Confirmación Eliminación */}
      <AnimatePresence>
        {confirmDelete && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setConfirmDelete(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-[#060214]/95 border border-white/10 w-full max-w-md rounded-3xl p-8 relative z-10 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 blur-[50px] -z-10" />

              <div className="text-center">
                <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center text-red-500 mx-auto mb-6 border border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.1)]">
                  <Trash2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black font-[family-name:var(--font-orbitron)] mb-3 uppercase tracking-tighter text-white">
                  {!isDoubleConfirm
                    ? "¿Eliminar cliente?"
                    : !isTripleConfirm
                      ? "Confirmación final"
                      : "Verificación de seguridad"}
                </h3>

                <p className="text-gray-400 text-sm mb-8 leading-relaxed px-4">
                  {!isDoubleConfirm ? (
                    <>
                      Estás a punto de eliminar de forma permanente a{" "}
                      <span className="text-white font-bold underline decoration-red-500/50 underline-offset-4">
                        {confirmDelete.nombre}
                      </span>
                      . Esta acción no se puede deshacer.
                    </>
                  ) : !isTripleConfirm ? (
                    <span className="text-red-400 font-bold italic">
                      Si eliminas este cliente, también se eliminarán sus
                      proyectos asociados.
                    </span>
                  ) : (
                    <span className="text-gray-300">
                      Para confirmar la eliminación de{" "}
                      <span className="text-white font-bold">
                        {confirmDelete.nombre}
                      </span>
                      , ingresa su número de documento: <br />
                      <span className="text-[10px] font-black tracking-[0.2em] text-[#22d3ee] block mt-2">
                        {confirmDelete.cedula}
                      </span>
                    </span>
                  )}
                </p>

                {isTripleConfirm && (
                  <div className="mb-8 px-4">
                    <div className="relative group">
                      <div className="absolute -inset-0.5 bg-[#22d3ee]/20 rounded-xl blur opacity-75 group-focus-within:opacity-100 transition duration-1000"></div>
                      <input
                        type="text"
                        value={docInput}
                        onChange={(e) => setDocInput(e.target.value)}
                        placeholder="Documento"
                        className="relative w-full bg-black/40 border border-white/10 rounded-xl py-4 px-6 text-center text-sm font-bold tracking-widest text-[#22d3ee] focus:outline-none transition-all placeholder:text-gray-700"
                      />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => {
                      setConfirmDelete(null);
                      setIsDoubleConfirm(false);
                      setIsTripleConfirm(false);
                      setDocInput("");
                    }}
                    className="py-4 rounded-2xl bg-white/5 border border-white/10 text-gray-500 font-black uppercase tracking-widest text-[10px] hover:bg-white/10 hover:text-white transition-all focus:outline-none"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={
                      !isDoubleConfirm
                        ? () => setIsDoubleConfirm(true)
                        : !isTripleConfirm
                          ? () => setIsTripleConfirm(true)
                          : handleDelete
                    }
                    disabled={
                      isDeleting ||
                      (isTripleConfirm && docInput !== confirmDelete.cedula)
                    }
                    className="relative group py-4 rounded-2xl overflow-hidden shadow-xl hover:scale-[1.05] transition-all active:scale-95 disabled:opacity-50 focus:outline-none"
                  >
                    <div className="absolute inset-0 bg-red-600 group-hover:bg-red-500 transition-colors" />
                    <span className="relative text-white font-black uppercase tracking-widest text-[10px]">
                      {!isDoubleConfirm
                        ? "Continuar"
                        : !isTripleConfirm
                          ? "Entiendo el riesgo"
                          : isDeleting
                            ? "Eliminando..."
                            : "Eliminar cliente"}
                    </span>
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

function ClientInfo({
  icon: Icon,
  label,
  text,
}: {
  icon: any;
  label: string;
  text: string;
}) {
  return (
    <div className="group/info">
      <span className="text-[7px] font-black uppercase tracking-[0.4em] text-gray-600 mb-1.5 block group-hover/info:text-[#22d3ee] transition-colors">
        {label}
      </span>
      <div className="flex items-center gap-4 text-gray-400 group-hover/info:text-gray-100 transition-colors">
        <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 group-hover/info:border-[#22d3ee]/30 transition-all duration-500 group-hover/info:scale-110">
          <Icon className="w-4 h-4" />
        </div>
        <span className="text-sm font-bold truncate tracking-tight">
          {text}
        </span>
      </div>
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
        className={`absolute -inset-0.5 rounded-2xl transition-opacity blur-[2px] ${error ? "bg-red-500/40 opacity-100" : "bg-gradient-to-r from-[#a855f7]/20 to-[#22d3ee]/20 opacity-0 group-focus-within:opacity-100"}`}
      />
      <div className="relative">
        <Icon
          className={`absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${error ? "text-red-400" : "text-gray-500 group-focus-within:text-[#22d3ee]"}`}
        />
        <input
          {...props}
          placeholder={placeholder}
          onFocus={onFocus}
          className={`w-full bg-white/[0.04] backdrop-blur-md border rounded-2xl py-4 pl-14 pr-6 text-sm focus:outline-none transition-all placeholder:text-gray-600 font-medium ${error ? "border-red-500/50 focus:border-red-500" : "border-white/8 group-hover:border-white/15 focus:border-[#22d3ee]/50 focus:bg-white/[0.06]"}`}
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
