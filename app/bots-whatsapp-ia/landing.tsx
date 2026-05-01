"use client"

import { useState, useRef, useEffect } from "react"
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion"
import Link from "next/link"
import {
  Shield,
  CheckCircle,
  ArrowRight,
  ChevronDown,
  Zap,
  Users,
  Calendar,
  ShoppingBag,
  Briefcase,
  Bot,
  Globe,
  FileText,
  LayoutDashboard,
  Sparkles,
  Radio,
} from "lucide-react"

// ─── URLs ─────────────────────────────────────────────────────────────────────
const WA_URL =
  "https://wa.me/573143855079?text=Hola%2C%20quiero%20información%20sobre%20el%20asistente%20de%20WhatsApp%20con%20IA%20para%20mi%20empresa"
const WA_DEMO_URL =
  "https://wa.me/573143855079?text=Hola%21%20Quiero%20probar%20el%20asistente%20de%20InZidium%20%F0%9F%A4%96"

function trackWA(label: string) {
  if (typeof window !== "undefined" && typeof (window as any).gtag === "function") {
    ;(window as any).gtag("event", "whatsapp_click", {
      event_category: "conversion",
      event_label: label,
    })
  }
}

// ─── WhatsApp icon ─────────────────────────────────────────────────────────────
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

// ─── Partículas ────────────────────────────────────────────────────────────────
const PARTICLES = [
  { top: "8%",  left: "12%", size: 2, delay: 0,   dur: 20 },
  { top: "20%", left: "82%", size: 3, delay: 1.5,  dur: 24 },
  { top: "38%", left: "28%", size: 2, delay: 0.8,  dur: 17 },
  { top: "55%", left: "7%",  size: 4, delay: 2.2,  dur: 26 },
  { top: "72%", left: "68%", size: 2, delay: 1.1,  dur: 19 },
  { top: "88%", left: "22%", size: 3, delay: 3,    dur: 23 },
  { top: "14%", left: "91%", size: 2, delay: 0.4,  dur: 18 },
  { top: "45%", left: "58%", size: 3, delay: 0.9,  dur: 22 },
]

// ─── SpotlightCard ─────────────────────────────────────────────────────────────
function SpotlightCard({
  children,
  className = "",
  variant = "green",
}: {
  children: React.ReactNode
  className?: string
  variant?: "green" | "red"
}) {
  const ref = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    ref.current.style.setProperty("--x", `${e.clientX - rect.left}px`)
    ref.current.style.setProperty("--y", `${e.clientY - rect.top}px`)
  }

  const isRed = variant === "red"

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      className={`relative overflow-hidden group border border-white/[0.07] bg-white/[0.025] rounded-2xl ${className}`}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0"
        style={{
          background: isRed
            ? `radial-gradient(600px circle at var(--x) var(--y), rgba(239,68,68,0.08), transparent 40%)`
            : `radial-gradient(600px circle at var(--x) var(--y), rgba(37,211,102,0.09), transparent 40%)`,
        }}
      />
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20 rounded-2xl"
        style={{
          WebkitMaskImage: "radial-gradient(350px circle at var(--x) var(--y), black, transparent 40%)",
          maskImage: "radial-gradient(350px circle at var(--x) var(--y), black, transparent 40%)",
        }}
      >
        <div className={`absolute inset-0 rounded-2xl border ${isRed ? "border-red-500/35" : "border-[#25D366]/30"}`} />
      </div>
      <div className="relative z-10 h-full">{children}</div>
    </div>
  )
}

// ─── Reveal ────────────────────────────────────────────────────────────────────
function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-48px" })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.38, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ─── ScrollCard ────────────────────────────────────────────────────────────────
function ScrollCard({ children }: { children: React.ReactNode }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 90%", "center center", "end 10%"] })
  const opacity = useTransform(scrollYProgress, [0, 0.35, 0.65, 1], [0.06, 1, 1, 0.06])
  const scale   = useTransform(scrollYProgress, [0, 0.35, 0.65, 1], [0.86, 1, 1, 0.86])
  return (
    <motion.div ref={ref} style={{ opacity, scale }} className="w-full">
      {children}
    </motion.div>
  )
}

// ─── Label ─────────────────────────────────────────────────────────────────────
function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-[#25D366] text-[11px] font-bold uppercase tracking-[0.18em] mb-3">{children}</p>
}

// ─── WA Mock ───────────────────────────────────────────────────────────────────
const MESSAGES = [
  { from: "client", text: "Hola, ¿tienen cita disponible hoy?" },
  { from: "bot",    text: "¡Hola! 👋 Sí tenemos. ¿Prefieres mañana o tarde?" },
  { from: "client", text: "En la tarde, tipo 3pm" },
  { from: "bot",    text: "Tengo el espacio libre. ¿Te confirmo el jueves a las 3:00pm?" },
  { from: "client", text: "Perfecto, sí" },
  { from: "bot",    text: "✅ Cita confirmada. Te escribo un recordatorio el día antes. ¡Hasta pronto! 😊" },
]

function WaMock() {
  return (
    <div className="relative w-full max-w-[300px] mx-auto">
      <div className="rounded-[1.75rem] overflow-hidden border border-white/10 bg-[#111b21] shadow-2xl shadow-[#25D366]/10">
        <div className="bg-[#1f2c34] px-4 py-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#25D366]/15 border border-[#25D366]/20 flex items-center justify-center shrink-0">
            <Bot className="w-[18px] h-[18px] text-[#25D366]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-[13px] font-semibold leading-tight">Tu asistente</p>
            <p className="text-[#25D366] text-[11px] flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] inline-block animate-pulse" />
              en línea
            </p>
          </div>
        </div>
        <div className="bg-[#0b141a] px-3 py-3 space-y-[6px]" style={{ minHeight: 280 }}>
          {MESSAGES.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95, y: 4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: i * 0.42 + 0.5, duration: 0.25, ease: "easeOut" }}
              className={`flex ${m.from === "client" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] px-[10px] py-[6px] rounded-[10px] text-[11.5px] leading-[1.55] ${
                  m.from === "client" ? "bg-[#005c4b] text-white rounded-tr-[3px]" : "bg-[#202c33] text-white/85 rounded-tl-[3px]"
                }`}
              >
                {m.text}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Datos ─────────────────────────────────────────────────────────────────────
const PAIN = [
  { title: "El cliente escribe a las 11pm y tu competencia responde primero.",              quote: '"Hola, sigo sin respuesta 😕"' },
  { title: "Preguntas repetidas — precios, horarios, disponibilidad — todo el día.",         quote: '"¿Me das precio?" y te dejan en visto.' },
  { title: "Los clientes se enfrían si no respondes en los primeros minutos.",               quote: '"El cliente se fue con la competencia."' },
]

const INCLUDES = [
  { Icon: Bot,            label: "Asistente con IA entrenado en tu negocio",     desc: "Responde con tu catálogo, tu tono y tu información. No es genérico." },
  { Icon: LayoutDashboard,label: "Panel de gestión de chats",                    desc: "Con la identidad de tu negocio. Gestiona conversaciones y activa al humano cuando hace falta." },
  { Icon: Globe,          label: "Landing page de tu negocio",                   desc: "Una web profesional para presentar tu empresa." },
  { Icon: FileText,       label: "Páginas de términos y privacidad",             desc: "Requisito obligatorio de Meta. Lo hacemos nosotros." },
  { Icon: Shield,         label: "Integración WhatsApp Business API",            desc: "Plataforma oficial de Meta. Sin riesgo de bloqueo, número verificado." },
  { Icon: Zap,            label: "Sin comisiones ni plataformas de terceros",    desc: "La mensualidad es solo infraestructura real. Nada más." },
]

const STEPS = [
  { n: "01", title: "Diagnóstico",         desc: "Hablamos sobre tu negocio: qué debe responder y qué acciones debe poder ejecutar." },
  { n: "02", title: "Diseño y desarrollo", desc: "Construimos tu plataforma: asistente, panel, web y páginas legales." },
  { n: "03", title: "Integración Meta",    desc: "Gestionamos toda la burocracia de WhatsApp Business API — Facebook Business, verificación y aprobación." },
  { n: "04", title: "Lanzamiento",         desc: "El asistente sale al aire. Monitoreamos y ajustamos con base en conversaciones reales." },
]

const INDUSTRIES = [
  { Icon: Users,       name: "Inmobiliarias",           desc: "Filtra compradores reales y agenda visitas automáticamente." },
  { Icon: Calendar,    name: "Clínicas y consultorios", desc: "Citas, recordatorios y respuestas sobre horarios y precios." },
  { Icon: ShoppingBag, name: "Tiendas y comercios",     desc: "Recupera carritos abandonados y cierra ventas en el chat." },
  { Icon: Briefcase,   name: "Servicios profesionales", desc: "Cotiza con preguntas guiadas y transfiere cuando la intención es alta." },
]

const FAQS = [
  { q: "¿WhatsApp puede banear mi número?",           a: "No. Usamos la plataforma oficial de WhatsApp Business API. Tu número queda verificado con Meta y cumple todas las políticas. Sin riesgo de bloqueo." },
  { q: "¿Qué pasa cuando el asistente no sabe algo?", a: "Detecta su limitación y transfiere la conversación — con todo el historial — al equipo humano, sin que el cliente note el cambio." },
  { q: "¿Puedo cambiar lo que dice el asistente?",    a: "Sí. Desde el panel actualizas información, precios y tono cuando quieras." },
  { q: "¿Cuánto tarda la implementación?",            a: "2 a 4 semanas. El tiempo depende principalmente de la aprobación de Meta — la parte técnica la resolvemos rápido." },
  { q: "¿Es para mi negocio?",                        a: "Si recibes más de 150 mensajes al mes y el 40% son preguntas repetidas, el ROI es positivo en menos de 6 meses. Si no es tu caso, te lo decimos sin rodeos." },
]

const HERO_WORDS = ["responde", "cotiza", "agenda", "vende"]
const PAIN_WORDS  = ["ventas",  "clientes", "tiempo", "dinero"]

// ─── FAQ item ──────────────────────────────────────────────────────────────────
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-white/10 rounded-2xl overflow-hidden bg-white/[0.025]">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-5 py-[18px] text-left active:bg-white/[0.03] transition-colors"
      >
        <span className="text-white font-medium text-[14px] sm:text-[15px] leading-snug">{q}</span>
        <ChevronDown
          className="shrink-0 w-[18px] h-[18px] text-[#25D366] transition-transform duration-200"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>
      <div
        className="grid transition-[grid-template-rows] duration-200 ease-out"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <p className="px-5 pb-5 text-[13px] sm:text-sm text-white/50 leading-relaxed">{a}</p>
        </div>
      </div>
    </div>
  )
}

// ─── Main ──────────────────────────────────────────────────────────────────────
export function BotLanding() {
  const [scrolled, setScrolled] = useState(false)
  const [wordIdx,  setWordIdx]  = useState(0)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", fn, { passive: true })
    return () => window.removeEventListener("scroll", fn)
  }, [])

  useEffect(() => {
    const t = setInterval(() => setWordIdx(i => (i + 1) % HERO_WORDS.length), 2500)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="relative text-white overflow-x-hidden">

      {/* ── FONDO FIJO ── */}
      <div className="fixed inset-0 bg-[#060214] z-0 overflow-hidden pointer-events-none">
        {/* dot grid */}
        <div className="absolute inset-0 opacity-[0.075] bg-[radial-gradient(rgba(255,255,255,1)_1px,transparent_1px)] [background-size:26px_26px]" />
        {/* ambient gradients — CSS puro, cero filter */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 55% 45% at 0%   0%,   rgba(37,211,102,0.07) 0%, transparent 65%),
              radial-gradient(ellipse 45% 55% at 100% 38%,  rgba(18,140,126,0.07) 0%, transparent 65%),
              radial-gradient(ellipse 45% 35% at 50%  100%, rgba(88,28,135,0.06)  0%, transparent 60%)
            `,
          }}
        />
        {/* partículas — solo sm+ */}
        <div className="hidden sm:block">
          {PARTICLES.map((p, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white"
              style={{ width: p.size, height: p.size, top: p.top, left: p.left }}
              animate={{ y: [0, -340], opacity: [0, 0.45, 0] }}
              transition={{ duration: p.dur, repeat: Infinity, ease: "linear", delay: p.delay }}
            />
          ))}
        </div>
      </div>

      {/* ── NAV ── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 grid grid-cols-3 items-center px-5 sm:px-8 py-4 transition-all duration-300"
        style={{
          background:     scrolled ? "rgba(6,2,20,0.9)" : "transparent",
          borderBottom:   scrolled ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
        }}
      >
        <div />
        <Link href="/" className="justify-self-center font-orbitron font-semibold tracking-[0.2em] text-[13px] text-white/90">
          InZidium
        </Link>
        <a href={WA_URL} target="_blank" rel="noopener noreferrer" onClick={() => trackWA("wa_general")}
          className="justify-self-end wa-cta-btn flex items-center gap-2 text-black font-bold text-[12px] px-4 py-2.5 rounded-full transition-transform duration-100 active:scale-95"
        >
          <WhatsAppIcon className="w-[14px] h-[14px]" />
          Hablar ahora
        </a>
      </nav>

      <div className="relative z-10">

        {/* ── 1. HERO ── */}
        <section className="relative min-h-[100svh] flex flex-col items-center justify-center pt-20 pb-12 px-5 sm:px-8 text-center overflow-hidden">
          <div className="w-full max-w-2xl mx-auto lg:max-w-6xl">
            <div className="flex flex-col lg:flex-row lg:items-center lg:gap-16 lg:text-left">

              <div className="flex-1">
                <motion.div
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.32 }}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#25D366]/30 bg-[#25D366]/8 text-[#25D366] text-[11px] font-bold uppercase tracking-[0.15em] mb-6"
                >
                  <Shield className="w-3 h-3" />
                  WhatsApp Business API · Meta Oficial
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.38, delay: 0.08 }}
                  className="text-[2.5rem] sm:text-5xl lg:text-[3.4rem] font-extrabold leading-[1.1] tracking-tight mb-5"
                >
                  Tu negocio{" "}
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={wordIdx}
                      initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }}
                      transition={{ duration: 0.28 }}
                      className="inline-block"
                      style={{ background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
                    >
                      {HERO_WORDS[wordIdx]}
                    </motion.span>
                  </AnimatePresence>{" "}
                  solo,{" "}
                  <br className="sm:hidden" />
                  <span className="text-white/90">las 24 horas.</span>
                </motion.h1>

                {/* subtitle: más visceral, orientado al dolor */}
                <motion.p
                  initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.38, delay: 0.14 }}
                  className="text-[15px] sm:text-lg text-white/45 leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0"
                >
                  Cada mensaje sin responder es un cliente que se va con la competencia. Tu asistente con IA atiende en WhatsApp — a las 3am, los domingos, en festivos.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.38, delay: 0.2 }}
                  className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-7"
                >
                  <a href={WA_URL} target="_blank" rel="noopener noreferrer" onClick={() => trackWA("wa_general")}
                    className="wa-cta-btn wa-pulse inline-flex items-center justify-center gap-2.5 text-black font-bold px-8 py-[14px] rounded-full text-[14px] transition-transform duration-100 active:scale-[0.97]"
                  >
                    <WhatsAppIcon className="w-[18px] h-[18px]" />
                    Quiero mi asistente
                  </a>
                  <a href="#incluye"
                    className="inline-flex items-center justify-center gap-2 border border-white/12 text-white/60 px-8 py-[14px] rounded-full text-[14px] active:bg-white/5 transition-colors duration-100"
                  >
                    Ver qué incluye
                    <ChevronDown className="w-4 h-4" />
                  </a>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
                  className="flex flex-wrap justify-center lg:justify-start gap-x-5 gap-y-2"
                >
                  {["Sin riesgo de bloqueo", "Listo en 2–4 semanas", "Todo con tu identidad"].map((t) => (
                    <span key={t} className="flex items-center gap-1.5 text-[11px] text-white/35">
                      <CheckCircle className="w-3 h-3 text-[#25D366]" /> {t}
                    </span>
                  ))}
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.18 }}
                className="mt-12 lg:mt-0 lg:shrink-0 flex justify-center"
              >
                <WaMock />
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── 2. DOLOR ── (primero que todo lo demás) */}
        <section className="px-5 sm:px-8 py-16">
          <div className="max-w-xl mx-auto">
            <Reveal className="text-center mb-20">
              <Label>El problema</Label>
              <h2 className="text-[1.85rem] sm:text-4xl font-bold text-white leading-tight">
                Esto está pasando{" "}
                <br className="sm:hidden" />
                y pierdes{" "}
                <AnimatePresence mode="wait">
                  <motion.span
                    key={wordIdx}
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="text-red-500 font-extrabold inline-block"
                  >
                    {PAIN_WORDS[wordIdx]}
                  </motion.span>
                </AnimatePresence>
              </h2>
            </Reveal>

            <div className="flex flex-col gap-24 sm:gap-32">
              {PAIN.map((p, i) => (
                <ScrollCard key={i}>
                  <SpotlightCard variant="red" className="p-5 sm:p-6">
                    <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/15 flex items-center justify-center mb-4">
                      <span className="text-red-500 text-[15px] font-black leading-none">✗</span>
                    </div>
                    <p className="text-white/80 text-[14px] sm:text-[15px] leading-relaxed font-medium mb-4">{p.title}</p>
                    <div className="p-3 rounded-xl bg-black/30 border border-red-900/20 flex items-center gap-2">
                      <div className="shrink-0 w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                      <span className="text-red-300 text-[11px] sm:text-xs italic">{p.quote}</span>
                    </div>
                  </SpotlightCard>
                </ScrollCard>
              ))}
            </div>

            {/* puente */}
            <Reveal className="mt-28">
              <div className="relative p-8 rounded-3xl border border-white/[0.07] bg-white/[0.018] text-center overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#25D366]/35 to-transparent" />
                <p className="text-xl sm:text-2xl font-medium text-white/60 leading-relaxed">
                  No es falta de clientes...{" "}
                  <span className="text-white font-bold">es cómo estás respondiendo.</span>
                </p>
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="mt-6 flex justify-center"
                >
                  <div className="w-10 h-10 rounded-full border border-white/10 bg-white/[0.03] flex items-center justify-center">
                    <ArrowRight className="w-5 h-5 text-[#25D366] rotate-90" />
                  </div>
                </motion.div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── 3. DEMO — protagonista ── */}
        <section className="relative px-5 sm:px-8 py-24 sm:py-32 overflow-hidden">
          {/* glow de fondo específico para esta sección */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `
                radial-gradient(ellipse 60% 50% at 50% 50%, rgba(37,211,102,0.07) 0%, transparent 70%),
                radial-gradient(ellipse 30% 40% at 80% 20%, rgba(18,140,126,0.06) 0%, transparent 60%)
              `,
            }}
          />
          <div className="relative max-w-5xl mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-center lg:gap-16">

              {/* ── Copy ── */}
              <div className="flex-1 text-center lg:text-left">
                <Reveal>
                  {/* badge LIVE */}
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#25D366]/30 bg-[#25D366]/8 text-[#25D366] text-[11px] font-bold uppercase tracking-[0.15em] mb-6">
                    <Radio className="w-3 h-3" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse inline-block" />
                    Activo ahora mismo
                  </div>

                  <h2 className="text-[2rem] sm:text-4xl lg:text-[2.8rem] font-extrabold text-white leading-[1.1] tracking-tight mb-5">
                    Escríbenos ahora.{" "}
                    <span
                      className="block"
                      style={{ background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
                    >
                      Nuestro asistente
                    </span>
                    te responde.
                  </h2>

                  <p className="text-white/50 text-[15px] sm:text-[16px] leading-relaxed mb-4 max-w-md mx-auto lg:mx-0">
                    No es una demo armada. Es el mismo sistema en producción que usamos para atender nuestros propios clientes.
                  </p>

                  {/* el argumento clave */}
                  <div className="inline-flex items-start gap-3 px-4 py-3 rounded-2xl border border-[#25D366]/20 bg-[#25D366]/[0.06] mb-8 max-w-md mx-auto lg:mx-0">
                    <Sparkles className="w-4 h-4 text-[#25D366] shrink-0 mt-0.5" />
                    <p className="text-[#25D366] text-[13px] leading-snug font-medium text-left">
                      Somos tan convencidos de esto que lo usamos nosotros mismos.<br />
                      <span className="text-white/60 font-normal">Si no funcionara, no lo venderíamos.</span>
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                    <a href={WA_DEMO_URL} target="_blank" rel="noopener noreferrer" onClick={() => trackWA("wa_demo")}
                      className="wa-cta-btn wa-pulse inline-flex items-center justify-center gap-2.5 text-black font-bold px-8 py-[14px] rounded-full text-[14px] sm:text-[15px] transition-transform duration-100 active:scale-[0.97]"
                    >
                      <WhatsAppIcon className="w-[18px] h-[18px]" />
                      Probar el asistente
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>

                  <p className="text-white/20 text-[11px] mt-4">
                    Responde en segundos · Sin formularios · Sin vendedor
                  </p>
                </Reveal>
              </div>

              {/* ── WaMock ── */}
              <Reveal delay={0.15} className="mt-14 lg:mt-0 lg:shrink-0 flex justify-center">
                <div className="relative">
                  {/* halo verde detrás del teléfono */}
                  <div
                    className="absolute -inset-8 rounded-full pointer-events-none"
                    style={{ background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(37,211,102,0.12), transparent 70%)" }}
                  />
                  <WaMock />
                </div>
              </Reveal>

            </div>
          </div>
        </section>

        {/* ── 5. QUÉ INCLUYE ── */}
        <section id="incluye" className="px-5 sm:px-8 py-16">
          <div className="max-w-5xl mx-auto">
            <Reveal className="text-center mb-10">
              <Label>El paquete completo</Label>
              <h2 className="text-[1.85rem] sm:text-4xl font-bold text-white">Todo lo que recibe tu negocio</h2>
              <p className="text-white/35 mt-2 text-[13px]">No solo el bot. Una plataforma lista para operar.</p>
            </Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {INCLUDES.map(({ Icon, label, desc }, i) => (
                <Reveal key={i} delay={i * 0.05}>
                  <SpotlightCard className="p-5 sm:p-6 h-full">
                    <div className="w-9 h-9 rounded-xl bg-[#25D366]/8 border border-[#25D366]/12 flex items-center justify-center mb-4">
                      <Icon className="w-[18px] h-[18px] text-[#25D366]" />
                    </div>
                    <h3 className="text-white font-semibold text-[13px] sm:text-[14px] mb-1.5 leading-snug">{label}</h3>
                    <p className="text-white/35 text-[12px] leading-relaxed">{desc}</p>
                  </SpotlightCard>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── 6. PROCESO ── */}
        <section className="px-5 sm:px-8 py-16">
          <div className="max-w-5xl mx-auto">
            <Reveal className="text-center mb-10">
              <Label>El proceso</Label>
              <h2 className="text-[1.85rem] sm:text-4xl font-bold text-white">Cómo funciona</h2>
            </Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {STEPS.map((s, i) => (
                <Reveal key={i} delay={i * 0.07}>
                  <SpotlightCard className="p-6 sm:p-7 h-full">
                    <div className="absolute top-4 right-4 text-[3.2rem] font-black text-[#25D366]/[0.07] leading-none select-none font-mono">{s.n}</div>
                    <div className="w-8 h-8 rounded-xl bg-[#25D366]/8 border border-[#25D366]/12 flex items-center justify-center mb-4">
                      <span className="text-[#25D366] text-[11px] font-black">{s.n}</span>
                    </div>
                    <h3 className="text-white font-semibold text-[14px] sm:text-[15px] mb-2">{s.title}</h3>
                    <p className="text-white/45 text-[12px] sm:text-[13px] leading-relaxed">{s.desc}</p>
                  </SpotlightCard>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── 7. INDUSTRIAS ── */}
        <section className="px-5 sm:px-8 py-16">
          <div className="max-w-5xl mx-auto">
            <Reveal className="text-center mb-10">
              <Label>Casos de uso</Label>
              <h2 className="text-[1.85rem] sm:text-4xl font-bold text-white">¿Para qué tipo de negocio?</h2>
            </Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {INDUSTRIES.map(({ Icon, name, desc }, i) => (
                <Reveal key={i} delay={i * 0.06}>
                  <SpotlightCard className="p-6 h-full">
                    <div className="flex items-start gap-4">
                      <div className="shrink-0 w-10 h-10 rounded-xl bg-[#25D366]/8 border border-[#25D366]/12 flex items-center justify-center">
                        <Icon className="w-[18px] h-[18px] text-[#25D366]" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-[14px] mb-1">{name}</h3>
                        <p className="text-white/45 text-[12px] sm:text-[13px] leading-relaxed">{desc}</p>
                      </div>
                    </div>
                  </SpotlightCard>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── 8. PRECIOS ── */}
        <section className="px-5 sm:px-8 py-16">
          <div className="max-w-2xl mx-auto">
            <Reveal className="text-center mb-10">
              <Label>Inversión</Label>
              <h2 className="text-[1.85rem] sm:text-4xl font-bold text-white">¿Cuánto cuesta?</h2>
              <p className="text-white/35 mt-2 text-[13px]">Rangos reales. Sin sorpresas.</p>
            </Reveal>
            <Reveal>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div className="relative p-6 sm:p-7 rounded-2xl border border-[#25D366]/25 bg-[#25D366]/5 overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#25D366] via-[#20c75a] to-[#128C7E]" />
                  <p className="text-[#25D366] text-[11px] font-bold uppercase tracking-[0.15em] mb-3">Implementación</p>
                  <p className="text-white text-3xl sm:text-[2rem] font-black mb-1 leading-none">
                    Desde $1.5M
                  </p>
                  <p className="text-white/40 text-[12px] leading-relaxed mt-2">
                    Pago único. Plataforma completa: asistente, panel, web y gestión Meta incluidos.
                  </p>
                </div>
                <SpotlightCard className="p-6 sm:p-7">
                  <p className="text-white/40 text-[11px] font-bold uppercase tracking-[0.15em] mb-3">Mensual</p>
                  <p className="text-white text-3xl sm:text-[2rem] font-black mb-1 leading-none">
                    Desde $100K
                  </p>
                  <p className="text-white/40 text-[12px] leading-relaxed mt-2">
                    Servidor, IA y mensajes de WhatsApp. Sin cobros ocultos.
                  </p>
                </SpotlightCard>
              </div>
              <div className="flex items-start gap-3 p-5 rounded-2xl border border-white/[0.07] bg-white/[0.018]">
                <Zap className="shrink-0 w-4 h-4 text-[#25D366] mt-0.5" />
                <p className="text-white/40 text-[12px] sm:text-[13px] leading-relaxed">
                  Una recepcionista cuesta más de $2M al mes. La plataforma paga su implementación en menos de 6 meses — y sigue operando sola.
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── 9. FAQ ── */}
        <section className="px-5 sm:px-8 py-16">
          <div className="max-w-2xl mx-auto">
            <Reveal className="text-center mb-10">
              <Label>FAQ</Label>
              <h2 className="text-[1.85rem] sm:text-4xl font-bold text-white">Preguntas frecuentes</h2>
            </Reveal>
            <Reveal>
              <div className="space-y-2">
                {FAQS.map((f, i) => <FaqItem key={i} {...f} />)}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── 10. CTA FINAL ── */}
        <section className="px-5 sm:px-8 py-24">
          <Reveal className="max-w-xl mx-auto text-center">
            <h2 className="text-[1.85rem] sm:text-4xl font-bold text-white mb-3 leading-tight">
              ¿Listo para que tu negocio atienda solo?
            </h2>
            <p className="text-white/40 mb-8 text-[14px] leading-relaxed">
              Cuéntanos sobre tu operación. En menos de 24 horas te decimos si tiene sentido y cuánto costaría.
            </p>
            <a href={WA_URL} target="_blank" rel="noopener noreferrer" onClick={() => trackWA("wa_general")}
              className="wa-cta-btn wa-pulse inline-flex items-center gap-3 text-black font-bold px-9 py-[15px] rounded-full text-[14px] sm:text-[15px] transition-transform duration-100 active:scale-[0.97]"
            >
              <WhatsAppIcon className="w-[18px] h-[18px]" />
              Hablar por WhatsApp
              <ArrowRight className="w-4 h-4" />
            </a>
            <p className="text-white/20 text-[11px] mt-4">Sin compromiso · Respuesta en menos de 24 horas</p>
          </Reveal>
        </section>

        {/* ── STICKY MOBILE ── */}
        <div
          className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 pt-2 sm:hidden pointer-events-none"
          style={{ background: "linear-gradient(to top, rgba(6,2,20,0.96) 60%, transparent)" }}
        >
          <a href={WA_URL} target="_blank" rel="noopener noreferrer" onClick={() => trackWA("wa_general")}
            className="wa-cta-btn pointer-events-auto flex items-center justify-center gap-2.5 w-full text-black font-bold py-[15px] rounded-2xl text-[14px] transition-transform duration-100 active:scale-[0.98]"
          >
            <WhatsAppIcon className="w-[18px] h-[18px]" />
            Quiero mi asistente de WhatsApp
          </a>
        </div>
        <div className="h-24 sm:hidden" />

      </div>

      {/* ── ESTILOS ── */}
      <style>{`
        @keyframes wa-gradient {
          0%   { background-position: 0%   50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0%   50%; }
        }
        .wa-cta-btn {
          background: linear-gradient(135deg, #25D366, #20c75a, #128C7E, #25D366);
          background-size: 300% 300%;
          animation: wa-gradient 3.5s ease infinite;
        }
        @keyframes wa-pulse {
          0%, 100% { box-shadow: 0 0 0 0   rgba(37,211,102,0.45); }
          50%       { box-shadow: 0 0 0 11px rgba(37,211,102,0); }
        }
        .wa-pulse {
          animation: wa-gradient 3.5s ease infinite, wa-pulse 2.4s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .wa-cta-btn { animation: none; background: #25D366; }
          .wa-pulse   { animation: none; }
        }
      `}</style>
    </div>
  )
}
