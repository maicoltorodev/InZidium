"use client";

import { motion } from "framer-motion";
import {
  AlertCircle,
  ChevronRight,
  Loader2,
  Lock,
  Search,
} from "lucide-react";
import { BackgroundGradients } from "@/components/ui/background-gradients";
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
    <main className="bg-[#030014] min-h-screen text-white flex flex-col relative overflow-hidden">
      <BackgroundGradients />
      {navbarSlot ?? <Header />}
      <section className="flex-1 flex flex-col items-center justify-center p-4 pt-32 md:pt-48 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-10 md:mb-12">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-[#a855f7]/20 bg-[#a855f7]/5 backdrop-blur-md mb-6 md:mb-8"
            >
              <Lock className="w-3 h-3 text-[#a855f7]" />
              <span className="text-[10px] font-black tracking-[0.2em] text-gray-300 uppercase">Acceso Cliente</span>
            </motion.div>

            <div className="relative flex items-center justify-center gap-4 md:gap-6 mb-6 md:mb-8">
              <motion.img
                src="/logo.webp"
                alt="InZidium Logo"
                className="w-11 h-11 md:w-16 md:h-16 object-contain"
                animate={{ y: [0, -15, 0], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              />
              <h1 className="text-3xl md:text-6xl font-black text-white tracking-tight text-center leading-[1.05]">
                Portal De <span className="bg-[linear-gradient(90deg,#e879f9_0%,#a855f7_50%,#22d3ee_100%)] bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">Clientes</span>
              </h1>
            </div>
            <p className="text-gray-400 text-base md:text-lg">Tu espacio personal, en tiempo real.</p>
          </div>

          <motion.form
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            onSubmit={onSubmit}
            className="space-y-4"
          >
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#a855f7]/30 to-[#22d3ee]/30 rounded-3xl blur transition duration-500 group-hover:duration-200 group-hover:opacity-100 opacity-60" />
              <div className="relative bg-[#0f0b1f] border border-[#a855f7]/20 rounded-3xl p-2 flex items-center transition-all focus-within:border-[#a855f7]/60 focus-within:shadow-[0_0_30px_rgba(168,85,247,0.25)]">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white/5 flex items-center justify-center flex-shrink-0">
                  <Search className="w-5 h-5 text-gray-500" />
                </div>
                <input
                  type="text"
                  value={cedula}
                  onChange={(e) => setCedula(e.target.value)}
                  placeholder="Tu Número de Identificación"
                  className="w-full bg-transparent border-none outline-none text-white font-bold h-12 md:h-14 px-3 md:px-4 text-base md:text-lg placeholder:text-gray-600 placeholder:font-medium placeholder:text-sm md:placeholder:text-base"
                />
                <button
                  type="submit"
                  disabled={loading || !cedula}
                  className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-[#e879f9] via-[#a855f7] to-[#60a5fa] rounded-2xl flex items-center justify-center text-white hover:scale-95 transition-all disabled:opacity-50 disabled:scale-100 flex-shrink-0"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ChevronRight className="w-6 h-6" />}
                </button>
              </div>
            </div>
          </motion.form>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 md:mt-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-4"
            >
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-red-400">Acceso Denegado</p>
                <p className="text-xs text-red-300/80 mt-1">{error}</p>
              </div>
            </motion.div>
          )}
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
    <main className={`min-h-screen px-4 pb-12 pt-10 text-white ${useDesktopLandingBackground ? "" : "bg-[#030014]"}`}>
      <div className={`mx-auto flex w-full flex-col gap-5 ${containerMaxWidth}`}>
        <button onClick={onReset} className="w-fit rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] font-black uppercase tracking-[0.25em] text-gray-300">
          Cambiar cédula
        </button>
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#a855f7]">Hola, {data.cliente.nombre.split(" ")[0]}</p>
          <h2 className="mt-2 text-3xl font-black leading-tight">Elige tu proyecto</h2>
        </div>
        <div className="space-y-3">
          {data.proyectos.map((item: any) => (
            <button key={item.id} onClick={() => onSelect(item)} className="w-full rounded-[1.75rem] border border-[#a855f7]/10 bg-[#0f0b1f] p-5 text-left transition-colors hover:border-[#a855f7]/30 active:scale-[0.99]">
              <h3 className="text-lg font-black">{item.nombre}</h3>
              <p className="mt-1 text-sm text-gray-500">Plan {item.plan}</p>
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
