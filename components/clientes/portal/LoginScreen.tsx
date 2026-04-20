"use client";

import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  ChevronRight,
  Loader2,
  Lock,
  Search,
} from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export function LoginScreen({
  cedula,
  setCedula,
  loading,
  error,
  onSubmit,
  useDesktopLandingBackground,
  navbarSlot,
  footerSlot,
}: {
  cedula: string;
  setCedula: (v: string) => void;
  loading: boolean;
  error: string;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  useDesktopLandingBackground: boolean;
  navbarSlot?: React.ReactNode;
  footerSlot?: React.ReactNode;
}) {
  return (
    <main className="min-h-screen text-white flex flex-col relative overflow-hidden">
      {navbarSlot ?? <Header />}

      <section className="flex-1 flex flex-col items-center justify-center p-4 pt-32 sm:pt-40 pb-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          {/* Badge */}
          <motion.div
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex justify-center mb-8"
          >
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[#a855f7]/20 bg-[#a855f7]/5 backdrop-blur-md">
              <Lock className="w-3 h-3 text-[#a855f7]" />
              <span className="text-[10px] font-black tracking-[0.25em] text-white/50 uppercase">
                Acceso Cliente
              </span>
            </div>
          </motion.div>

          {/* Glass card */}
          <motion.div
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="glass-panel glass-card rounded-3xl p-8 sm:p-10 border border-white/10"
            style={{
              "--active-border": "rgba(168,85,247,0.5)",
              "--active-glow": "rgba(168,85,247,0.2)",
              "--neon-glow": "rgba(168,85,247,0.15)",
            } as React.CSSProperties}
          >
            {/* Logo + title */}
            <div className="flex flex-col items-center text-center mb-10">
              <div className="relative mb-6 inline-block">
                <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan to-neon-purple blur-xl opacity-25" />
                <motion.img
                  src="/logo.webp"
                  alt="InZidium"
                  className="relative w-14 h-14 object-contain"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>

              <h1 className="font-orbitron text-2xl sm:text-3xl font-medium tracking-[0.08em] text-white mb-3 leading-snug">
                Portal de{" "}
                <span className="bg-gradient-to-r from-[#e879f9] via-[#a855f7] to-[#22d3ee] bg-clip-text text-transparent">
                  Clientes
                </span>
              </h1>
              <p className="text-white/40 text-sm">Tu espacio personal, en tiempo real.</p>
            </div>

            {/* Form */}
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="relative group">
                <div className="absolute -inset-px bg-gradient-to-r from-[#a855f7]/40 to-[#22d3ee]/40 rounded-2xl blur-sm opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
                <div className="relative bg-white/[0.04] border border-white/10 rounded-2xl p-2 flex items-center gap-2 transition-all duration-200 focus-within:border-[#a855f7]/40">
                  <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center shrink-0">
                    <Search className="w-4 h-4 text-white/25" />
                  </div>
                  <input
                    type="text"
                    value={cedula}
                    onChange={(e) => setCedula(e.target.value)}
                    placeholder="Número de Identificación"
                    className="w-full min-w-0 bg-transparent border-none outline-none text-white font-medium h-11 text-base placeholder:text-[clamp(11px,3.2vw,14px)] placeholder:text-white/20"
                  />
                  <button
                    type="submit"
                    disabled={loading || !cedula}
                    className="w-11 h-11 bg-gradient-to-br from-[#e879f9] via-[#a855f7] to-[#22d3ee] rounded-xl flex items-center justify-center text-white hover:scale-95 active:scale-90 transition-all duration-150 disabled:opacity-30 disabled:scale-100 shrink-0"
                  >
                    {loading
                      ? <Loader2 className="w-4 h-4 animate-spin" />
                      : <ChevronRight className="w-5 h-5" />
                    }
                  </button>
                </div>
              </div>
            </form>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-red-500/8 border border-red-500/20 rounded-2xl flex items-start gap-3"
              >
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-red-400 mb-0.5">Acceso Denegado</p>
                  <p className="text-xs text-red-300/70">{error}</p>
                </div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </section>

      {footerSlot ?? <Footer />}
    </main>
  );
}

export function ProjectSelector({
  data,
  onSelect,
  onReset,
  useDesktopLandingBackground,
  containerMaxWidth,
}: {
  data: any;
  onSelect: (project: any) => void;
  onReset: () => void;
  useDesktopLandingBackground: boolean;
  containerMaxWidth: string;
}) {
  return (
    <main
      className="min-h-screen px-4 pb-12 pt-24 text-white"
    >
      <div className={`mx-auto flex w-full flex-col gap-6 ${containerMaxWidth}`}>

        <button
          onClick={onReset}
          className="w-fit inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.25em] text-white/40 hover:text-white/70 hover:border-white/20 transition-colors duration-200"
        >
          <ArrowLeft className="w-3 h-3" />
          Cambiar cédula
        </button>

        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#a855f7] mb-2">
            Hola, {data.cliente.nombre.split(" ")[0]}
          </p>
          <h2 className="font-orbitron text-2xl sm:text-3xl font-medium text-white tracking-[0.05em]">
            Elige tu proyecto
          </h2>
        </div>

        <div className="space-y-3">
          {data.proyectos.map((item: any) => (
            <button
              key={item.id}
              onClick={() => onSelect(item)}
              className="w-full glass-panel glass-card rounded-3xl p-6 text-left border border-white/10 group transition-all duration-200 hover:border-[#a855f7]/30 hover:shadow-[0_0_25px_rgba(168,85,247,0.1)] active:scale-[0.99] will-change-transform"
            >
              <h3 className="text-lg font-orbitron text-white group-hover:text-neon-cyan transition-colors duration-200">
                {item.nombre}
              </h3>
              <p className="mt-1.5 text-sm text-white/35">Plan {item.plan}</p>
            </button>
          ))}
        </div>

      </div>
    </main>
  );
}
