"use client"

import { useState, useRef, useEffect } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import dynamic from "next/dynamic"
import {
  Shield,
  CheckCircle2,
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
  Clock,
  TrendingUp,
  AlertCircle,
} from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SectionHeader } from "@/components/section-header"
import { PageSection } from "@/components/ui/page-section"

const WhatsAppFAB = dynamic(() => import("@/components/whatsapp-fab").then((m) => m.WhatsAppFAB))

// ─── URLs ─────────────────────────────────────────────────────────────────────
const WA_URL =
  "https://wa.me/573202483740?text=Hola%2C%20quiero%20información%20sobre%20el%20asistente%20de%20WhatsApp%20con%20IA%20para%20mi%20empresa"
const WA_DEMO_URL =
  "https://wa.me/573202483740?text=Hola%21%20Quiero%20probar%20el%20asistente%20de%20InZidium%20%F0%9F%A4%96"

function trackWA(label: string) {
  if (typeof window !== "undefined" && typeof (window as any).gtag === "function") {
    ;(window as any).gtag("event", "whatsapp_click", { event_category: "conversion", event_label: label })
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

// ─── Reveal helper ────────────────────────────────────────────────────────────
function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ─── WaMock ───────────────────────────────────────────────────────────────────
const MESSAGES_HERO = [
  { from: "client", text: "Hola, ¿tienen cita disponible esta semana?" },
  { from: "bot",    text: "¡Hola! 👋 Sí tenemos. ¿Qué día te queda mejor?" },
  { from: "client", text: "El jueves en la tarde, tipo 3pm" },
  { from: "bot",    text: "Tengo ese espacio libre. ¿Te confirmo el jueves a las 3:00pm?" },
  { from: "client", text: "Perfecto, sí" },
  { from: "bot",    text: "✅ Cita confirmada. Te escribo un recordatorio el día antes. ¡Hasta pronto! 😊" },
]

const MESSAGES_DEMO = [
  { from: "client", text: "Hola" },
  { from: "bot",    text: "¡Hola! 👋 Bienvenido a InZidium. ¿En qué puedo ayudarte?" },
  { from: "client", text: "Cuéntame del bot de WhatsApp" },
  { from: "bot",    text: "Claro. Es un asistente con IA que atiende tus clientes 24/7 en WhatsApp oficial. ¿Tu negocio recibe mensajes que no alcanzas a contestar?" },
  { from: "client", text: "Sí, todo el día" },
  { from: "bot",    text: "✨ Entonces te encaja. ¿Quieres que coordine una llamada con el equipo esta semana?" },
]

function WaMock({ size = "md", messages = MESSAGES_HERO }: { size?: "sm" | "md"; messages?: typeof MESSAGES_HERO }) {
  const isSmall = size === "sm"
  return (
    <div className={`relative w-full mx-auto ${isSmall ? "max-w-[260px]" : "max-w-[300px]"}`}>
      <div className="absolute -inset-6 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(34,211,238,0.10), transparent 70%)" }} />
      <div className="relative rounded-[1.75rem] overflow-hidden border border-white/10 bg-[#111b21] shadow-2xl shadow-black/50">
        <div className="bg-[#1f2c34] px-4 py-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-neon-cyan/15 border border-neon-cyan/25 flex items-center justify-center shrink-0">
            <Bot className="w-[18px] h-[18px] text-neon-cyan" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-[13px] font-semibold leading-tight">Tu asistente</p>
            <p className="text-neon-cyan text-[11px] flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan inline-block animate-pulse" />
              en línea
            </p>
          </div>
        </div>
        <div className="bg-[#0b141a] px-3 py-3 space-y-[6px]" style={{ minHeight: isSmall ? 220 : 280 }}>
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95, y: 4 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.42 + 0.5, duration: 0.25, ease: "easeOut" }}
              className={`flex ${m.from === "client" ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[85%] px-[10px] py-[6px] rounded-[10px] text-[11.5px] leading-[1.55] ${
                m.from === "client" ? "bg-[#005c4b] text-white rounded-tr-[3px]" : "bg-[#202c33] text-white/85 rounded-tl-[3px]"
              }`}>
                {m.text}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Glass card with InZidium accent lines ────────────────────────────────────
function GlassCard({
  children,
  accent = "cyan",
  className = "",
  hoverable = true,
}: {
  children: React.ReactNode
  accent?: "cyan" | "purple" | "red"
  className?: string
  hoverable?: boolean
}) {
  const colors = {
    cyan:   { top: "via-neon-cyan/40",   bottom: "via-neon-purple/20", border: "md:group-hover:border-neon-cyan/30" },
    purple: { top: "via-neon-purple/40", bottom: "via-neon-cyan/20",   border: "md:group-hover:border-neon-purple/30" },
    red:    { top: "via-red-500/40",     bottom: "via-red-500/15",     border: "md:group-hover:border-red-500/30" },
  }[accent]

  return (
    <div className={`group relative glass-panel glass-card rounded-3xl overflow-hidden border border-white/10 ${hoverable ? colors.border : ""} transition-colors duration-300 ${className}`}>
      <div className={`h-px w-full bg-gradient-to-r from-transparent ${colors.top} to-transparent`} />
      <div className="relative">{children}</div>
      <div className={`h-px w-full bg-gradient-to-r from-transparent ${colors.bottom} to-transparent`} />
    </div>
  )
}

// ─── Datos ────────────────────────────────────────────────────────────────────
const HERO_WORDS = ["Responde", "Cotiza", "Agenda", "Vende"]

const PAIN = [
  {
    Icon: Clock,
    title: "Mensajes A Las 11pm Sin Respuesta",
    quote: "Hola, sigo sin respuesta 😕",
    desc: "Tu cliente escribe fuera de horario y se va con quien le respondió primero.",
  },
  {
    Icon: AlertCircle,
    title: "Preguntas Repetidas Todo El Día",
    quote: "¿Me das precio?",
    desc: "Precios, horarios, disponibilidad — el mismo guion una y otra vez.",
  },
  {
    Icon: TrendingUp,
    title: "Cliente Frío En Minutos",
    quote: "El cliente se fue con la competencia.",
    desc: "Si la respuesta no llega rápido, la intención de compra se enfría.",
  },
]

const INCLUDES = [
  { Icon: Bot,             label: "Asistente IA Entrenado En Tu Negocio",   desc: "Responde con tu catálogo, tu tono y tu información. No es genérico.", accent: "cyan" as const },
  { Icon: LayoutDashboard, label: "Panel De Gestión De Chats",              desc: "Con la identidad de tu negocio. Activa al humano cuando hace falta.", accent: "purple" as const },
  { Icon: Globe,           label: "Landing Page De Tu Negocio",             desc: "Una web profesional para presentar tu empresa.", accent: "cyan" as const },
  { Icon: FileText,        label: "Páginas Legales (Meta Lo Exige)",        desc: "Términos y privacidad — requisito obligatorio. Lo hacemos nosotros.", accent: "purple" as const },
  { Icon: Shield,          label: "Integración WhatsApp Business API",      desc: "Plataforma oficial de Meta. Sin riesgo de bloqueo, número verificado.", accent: "cyan" as const },
  { Icon: Zap,             label: "Soporte Y Monitoreo Continuo",           desc: "Mantenemos la plataforma operando 24/7. Si algo falla, lo arreglamos antes de que lo notes.", accent: "purple" as const },
]

const STEPS = [
  { n: "01", title: "Diagnóstico",         desc: "Hablamos sobre tu negocio: qué debe responder y qué acciones debe ejecutar." },
  { n: "02", title: "Diseño Y Desarrollo", desc: "Construimos tu plataforma: asistente, panel, web y páginas legales." },
  { n: "03", title: "Integración Meta",    desc: "Gestionamos toda la burocracia — Facebook Business, verificación y aprobación." },
  { n: "04", title: "Lanzamiento",         desc: "El asistente sale al aire. Monitoreamos y ajustamos con conversaciones reales." },
]

const INDUSTRIES = [
  { Icon: Users,        name: "Inmobiliarias",           desc: "Filtra compradores reales y agenda visitas automáticamente." },
  { Icon: Calendar,     name: "Clínicas Y Consultorios", desc: "Citas, recordatorios y respuestas sobre horarios y precios." },
  { Icon: ShoppingBag,  name: "Tiendas Y Comercios",     desc: "Recupera carritos abandonados y cierra ventas en el chat." },
  { Icon: Briefcase,    name: "Servicios Profesionales", desc: "Cotiza con preguntas guiadas y transfiere cuando la intención es alta." },
]

const FAQS = [
  { q: "¿WhatsApp puede banear mi número?",           a: "No. Usamos la plataforma oficial de WhatsApp Business API. Tu número queda verificado con Meta y cumple todas las políticas. Sin riesgo de bloqueo." },
  { q: "¿Qué pasa cuando el asistente no sabe algo?", a: "Detecta su limitación y transfiere la conversación — con todo el historial — al equipo humano, sin que el cliente note el cambio." },
  { q: "¿Puedo cambiar lo que dice el asistente?",    a: "Sí. Desde el panel actualizas información, precios y tono cuando quieras." },
  { q: "¿Cuánto tarda la implementación?",            a: "2 a 4 semanas. El tiempo depende principalmente de la aprobación de Meta — la parte técnica la resolvemos rápido." },
  { q: "¿Es para mi negocio?",                        a: "Si recibes más de 150 mensajes al mes y el 40% son preguntas repetidas, el ROI es positivo en menos de 6 meses. Si no es tu caso, te lo decimos sin rodeos." },
]

// ─── FAQ item ─────────────────────────────────────────────────────────────────
function FaqItem({ q, a, idx }: { q: string; a: string; idx: number }) {
  const [open, setOpen] = useState(false)
  const isCyan = idx % 2 === 0
  return (
    <div className={`glass-panel rounded-2xl border border-white/10 overflow-hidden transition-colors duration-300 ${open ? (isCyan ? "border-neon-cyan/30" : "border-neon-purple/30") : ""}`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left active:bg-white/[0.03] transition-colors"
      >
        <span className="text-white font-medium text-[14px] sm:text-[15px] leading-snug">{q}</span>
        <ChevronDown
          className={`shrink-0 w-[18px] h-[18px] transition-all duration-200 ${isCyan ? "text-neon-cyan" : "text-neon-purple"}`}
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>
      <div className="grid transition-[grid-template-rows] duration-200 ease-out" style={{ gridTemplateRows: open ? "1fr" : "0fr" }}>
        <div className="overflow-hidden">
          <p className="px-6 pb-5 text-[13px] sm:text-sm text-white/55 leading-relaxed">{a}</p>
        </div>
      </div>
    </div>
  )
}

// ─── WhatsApp CTA Button ─────────────────────────────────────────────────────
function WaButton({ href, label, onClick, variant = "primary" }: { href: string; label: string; onClick?: () => void; variant?: "primary" | "compact" }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      className={`wa-cta-btn wa-pulse inline-flex items-center justify-center gap-2.5 text-black font-bold rounded-full transition-transform duration-100 active:scale-[0.97] ${
        variant === "compact" ? "px-6 py-3 text-[13px]" : "px-8 py-[14px] text-[14px]"
      }`}
    >
      <WhatsAppIcon className="w-[18px] h-[18px]" />
      {label}
    </a>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export function BotLanding() {
  const [wordIdx, setWordIdx] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setWordIdx(i => (i + 1) % HERO_WORDS.length), 2500)
    return () => clearInterval(t)
  }, [])

  return (
    <main className="min-h-screen flex flex-col text-white overflow-x-hidden">
      <Header />

      {/* ═══ HERO ═══════════════════════════════════════════════════════════ */}
      <section className="relative pt-36 sm:pt-48 lg:pt-56 pb-20 sm:pb-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center lg:gap-16">

            <div className="flex-1 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/15 bg-white/[0.03] text-[11px] font-bold uppercase tracking-[0.18em] mb-8"
              >
                <Shield className="w-3 h-3 text-neon-cyan" />
                <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent bg-[length:200%_auto] energy-flow-css">
                  WhatsApp Business API · Meta Oficial
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
                className="font-orbitron text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-semibold leading-[1.05] tracking-tight mb-6"
              >
                Tu Negocio{" "}
                <AnimatePresence mode="wait">
                  <motion.span
                    key={wordIdx}
                    initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }}
                    transition={{ duration: 0.3 }}
                    className="inline-block bg-gradient-to-r from-cyan-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent bg-[length:200%_auto] energy-flow-css"
                  >
                    {HERO_WORDS[wordIdx]}
                  </motion.span>
                </AnimatePresence>
                <br />
                <span className="text-foreground/80">Solo, Las 24 Horas.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.18 }}
                className="text-base sm:text-lg lg:text-xl text-muted-foreground leading-relaxed mb-10 max-w-xl mx-auto lg:mx-0 font-light"
              >
                Cada mensaje sin responder es un cliente que se va con la competencia. Tu asistente con IA atiende en WhatsApp — a las 3am, los domingos, en festivos.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.26 }}
                className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-10"
              >
                <WaButton href={WA_URL} label="Quiero mi asistente" onClick={() => trackWA("hero_main")} />
                <a href="#incluye"
                  className="inline-flex items-center justify-center gap-2 border border-white/15 text-white/70 px-8 py-[14px] rounded-full text-[14px] font-medium hover:bg-white/5 hover:border-white/25 transition-colors duration-200"
                >
                  Ver qué incluye
                  <ChevronDown className="w-4 h-4" />
                </a>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.6 }}
                className="flex flex-wrap justify-center lg:justify-start gap-x-6 gap-y-2"
              >
                {["Sin riesgo de bloqueo", "Listo en 2–4 semanas", "Todo con tu identidad"].map((t) => (
                  <span key={t} className="flex items-center gap-1.5 text-[11px] text-white/40 uppercase tracking-wider">
                    <CheckCircle2 className="w-3.5 h-3.5 text-neon-cyan" /> {t}
                  </span>
                ))}
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 24 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="mt-16 lg:mt-0 lg:shrink-0 flex justify-center"
            >
              <WaMock />
            </motion.div>

          </div>
        </div>
      </section>

      {/* ═══ EL PROBLEMA ════════════════════════════════════════════════════ */}
      <PageSection id="problema" containerSize="lg">
        <Reveal className="text-center mb-16 sm:mb-20">
          <SectionHeader
            titleLeft="El"
            titleHighlight="Problema"
            subtitle="Esto está pasando ahora mismo en tu WhatsApp — y te está costando ventas."
          />
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {PAIN.map((p, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <GlassCard accent="red" className="h-full">
                <div className="p-7 sm:p-8 h-full flex flex-col">
                  <div className="w-11 h-11 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6">
                    <p.Icon className="w-5 h-5 text-red-400" strokeWidth={1.75} />
                  </div>
                  <h3 className="text-white font-semibold text-[16px] sm:text-[17px] leading-snug mb-3">{p.title}</h3>
                  <p className="text-white/45 text-[13px] sm:text-sm leading-relaxed mb-6 flex-1">{p.desc}</p>
                  <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-black/40 border border-red-900/25">
                    <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-red-300/90 text-[12px] italic">{p.quote}</span>
                  </div>
                </div>
              </GlassCard>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.3} className="mt-16">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-xl sm:text-2xl font-light text-white/65 leading-relaxed">
              No es falta de clientes —{" "}
              <span className="text-white font-semibold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                es cómo estás respondiendo.
              </span>
            </p>
          </div>
        </Reveal>
      </PageSection>

      {/* ═══ DEMO EN VIVO ═══════════════════════════════════════════════════ */}
      <PageSection id="demo" containerSize="lg">
        <Reveal>
          <GlassCard accent="cyan">

            {/* HEADER — centered, dramatic */}
            <div className="relative text-center pt-14 sm:pt-20 lg:pt-24 pb-10 sm:pb-12 px-6 sm:px-10">
              {/* Live pulse badge */}
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-white/15 bg-black/40 backdrop-blur-sm mb-8">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-cyan opacity-80"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-neon-cyan shadow-[0_0_10px_#22d3ee]"></span>
                </span>
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.22em] bg-gradient-to-r from-cyan-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent bg-[length:200%_auto] energy-flow-css">
                  Live · Activo Ahora Mismo
                </span>
              </div>

              <h2 className="font-orbitron text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-semibold leading-[1.05] tracking-tight mb-6">
                No Nos Creas.
                <br />
                <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent bg-[length:200%_auto] energy-flow-css">
                  Pruébalo.
                </span>
              </h2>

              <p className="text-muted-foreground text-base sm:text-lg lg:text-xl leading-relaxed max-w-2xl mx-auto font-light">
                Es el mismo asistente que atiende a nuestros clientes ahora mismo.{" "}
                <span className="text-white font-medium">Escríbele.</span> Mira cómo responde.
              </p>
            </div>

            {/* MOCK + STATS */}
            <div className="relative px-6 sm:px-10 pb-10 sm:pb-12">
              <div className="relative max-w-md mx-auto">
                {/* Multi-layer halo */}
                <div
                  className="absolute -inset-10 rounded-full pointer-events-none"
                  style={{ background: "radial-gradient(ellipse 80% 70% at 50% 50%, rgba(34,211,238,0.18), transparent 65%)" }}
                />
                <div
                  className="absolute -inset-20 rounded-full pointer-events-none"
                  style={{ background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(168,85,247,0.10), transparent 70%)" }}
                />
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="relative will-change-transform"
                >
                  <WaMock messages={MESSAGES_DEMO} />
                </motion.div>
              </div>

              {/* Stats — 3 numeric proof points */}
              <div className="mt-12 sm:mt-16 grid grid-cols-3 gap-3 sm:gap-6 max-w-2xl mx-auto">
                {[
                  { value: "< 2s", label: "Respuesta promedio" },
                  { value: "24/7", label: "Sin descanso" },
                  { value: "100%", label: "WhatsApp oficial" },
                ].map((s, i) => (
                  <div
                    key={i}
                    className="relative text-center px-3 py-5 sm:px-4 sm:py-6 rounded-2xl border border-white/[0.08] bg-white/[0.02]"
                  >
                    <p className={`font-orbitron text-2xl sm:text-3xl lg:text-4xl font-bold leading-none mb-2 bg-gradient-to-r ${i % 2 === 0 ? "from-cyan-400 to-purple-400" : "from-purple-400 to-cyan-400"} bg-clip-text text-transparent`}>
                      {s.value}
                    </p>
                    <p className="text-[10px] sm:text-[11px] text-white/45 uppercase tracking-[0.12em]">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* BOTTOM CTA — big & dominant */}
            <div className="relative border-t border-white/5 bg-gradient-to-b from-transparent to-white/[0.015] py-10 sm:py-14 px-6 text-center">
              <a
                href={WA_DEMO_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackWA("demo_try")}
                className="wa-cta-btn wa-pulse inline-flex items-center justify-center gap-3 text-black font-bold px-8 sm:px-12 py-4 sm:py-5 rounded-full text-[14px] sm:text-[16px] transition-transform duration-100 active:scale-[0.97]"
              >
                <WhatsAppIcon className="w-5 h-5 sm:w-[22px] sm:h-[22px]" />
                Hazle Una Pregunta Ahora
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              <p className="text-white/35 text-[10px] sm:text-[11px] mt-5 uppercase tracking-[0.2em]">
                Sin Formularios · Sin Vendedor · Sin Demora
              </p>
            </div>

          </GlassCard>
        </Reveal>
      </PageSection>

      {/* ═══ QUÉ INCLUYE ════════════════════════════════════════════════════ */}
      <PageSection id="incluye" containerSize="xl">
        <Reveal className="text-center mb-16 sm:mb-20">
          <SectionHeader
            titleLeft="Todo Lo Que"
            titleHighlight="Recibes"
            subtitle="No solo el bot. Una plataforma completa lista para operar."
          />
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 max-w-6xl mx-auto">
          {INCLUDES.map(({ Icon, label, desc, accent }, i) => (
            <Reveal key={i} delay={i * 0.05}>
              <GlassCard accent={accent} className="h-full">
                <div className="p-7 sm:p-8 h-full flex flex-col">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-5 ${
                    accent === "cyan" ? "bg-neon-cyan/[0.08] border border-neon-cyan/20" : "bg-neon-purple/[0.08] border border-neon-purple/20"
                  }`}>
                    <Icon className={`w-5 h-5 ${accent === "cyan" ? "text-neon-cyan" : "text-neon-purple"}`} strokeWidth={1.75} />
                  </div>
                  <h3 className="text-white font-semibold text-[15px] sm:text-base mb-2 leading-snug">{label}</h3>
                  <p className="text-white/45 text-[13px] leading-relaxed">{desc}</p>
                </div>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </PageSection>

      {/* ═══ CÓMO FUNCIONA ══════════════════════════════════════════════════ */}
      <PageSection id="proceso" containerSize="lg">
        <Reveal className="text-center mb-16 sm:mb-20">
          <SectionHeader
            titleLeft="Cómo"
            titleHighlight="Funciona"
            subtitle="De la primera conversación al lanzamiento — sin vueltas."
          />
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 max-w-5xl mx-auto">
          {STEPS.map((s, i) => {
            const accent = i % 2 === 0 ? "cyan" : "purple"
            return (
              <Reveal key={i} delay={i * 0.08}>
                <GlassCard accent={accent} className="h-full">
                  <div className="relative p-8 sm:p-10 h-full">
                    <div className={`absolute top-5 right-6 font-orbitron text-6xl sm:text-7xl font-bold leading-none select-none pointer-events-none ${
                      accent === "cyan" ? "text-neon-cyan/[0.08]" : "text-neon-purple/[0.08]"
                    }`}>
                      {s.n}
                    </div>
                    <div className={`relative w-10 h-10 rounded-xl flex items-center justify-center mb-5 font-orbitron font-bold text-[12px] ${
                      accent === "cyan"
                        ? "bg-neon-cyan/10 border border-neon-cyan/25 text-neon-cyan"
                        : "bg-neon-purple/10 border border-neon-purple/25 text-neon-purple"
                    }`}>
                      {s.n}
                    </div>
                    <h3 className="text-white font-semibold text-[16px] sm:text-[17px] mb-2.5">{s.title}</h3>
                    <p className="text-white/50 text-[13px] sm:text-sm leading-relaxed">{s.desc}</p>
                  </div>
                </GlassCard>
              </Reveal>
            )
          })}
        </div>
      </PageSection>

      {/* ═══ INDUSTRIAS ═════════════════════════════════════════════════════ */}
      <PageSection id="casos" containerSize="lg">
        <Reveal className="text-center mb-16 sm:mb-20">
          <SectionHeader
            titleLeft="Para Qué Tipo De"
            titleHighlight="Negocio"
            subtitle="Si recibes mensajes en WhatsApp todos los días, esto es para ti."
          />
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 max-w-4xl mx-auto">
          {INDUSTRIES.map(({ Icon, name, desc }, i) => {
            const accent = i % 2 === 0 ? "cyan" : "purple"
            return (
              <Reveal key={i} delay={i * 0.07}>
                <GlassCard accent={accent} className="h-full">
                  <div className="p-7 sm:p-8 h-full flex items-start gap-4">
                    <div className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${
                      accent === "cyan" ? "bg-neon-cyan/[0.08] border border-neon-cyan/20" : "bg-neon-purple/[0.08] border border-neon-purple/20"
                    }`}>
                      <Icon className={`w-5 h-5 ${accent === "cyan" ? "text-neon-cyan" : "text-neon-purple"}`} strokeWidth={1.75} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-semibold text-[16px] mb-1.5">{name}</h3>
                      <p className="text-white/50 text-[13px] sm:text-sm leading-relaxed">{desc}</p>
                    </div>
                  </div>
                </GlassCard>
              </Reveal>
            )
          })}
        </div>
      </PageSection>

      {/* ═══ INVERSIÓN ══════════════════════════════════════════════════════ */}
      <PageSection id="precios" containerSize="lg">
        <Reveal className="text-center mb-16 sm:mb-20">
          <SectionHeader
            titleLeft="La"
            titleHighlight="Inversión"
            subtitle="Rangos reales. Sin sorpresas, sin letra pequeña."
          />
        </Reveal>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 mb-6">
          <Reveal>
            <GlassCard accent="cyan" className="h-full">
              <div className="p-8 sm:p-10 h-full">
                <p className="text-neon-cyan text-[11px] font-bold uppercase tracking-[0.18em] mb-4">Implementación</p>
                <p className="font-orbitron text-white text-4xl sm:text-5xl font-bold mb-2 leading-none">
                  Desde $1.5M
                </p>
                <p className="text-white/30 text-[11px] uppercase tracking-wider mb-5">Pago único</p>
                <p className="text-white/50 text-[13px] sm:text-sm leading-relaxed">
                  Plataforma completa: asistente, panel, web y gestión Meta incluidos.
                </p>
              </div>
            </GlassCard>
          </Reveal>

          <Reveal delay={0.1}>
            <GlassCard accent="purple" className="h-full">
              <div className="p-8 sm:p-10 h-full">
                <p className="text-neon-purple text-[11px] font-bold uppercase tracking-[0.18em] mb-4">Mensual</p>
                <p className="font-orbitron text-white text-4xl sm:text-5xl font-bold mb-2 leading-none">
                  Desde $100K
                </p>
                <p className="text-white/30 text-[11px] uppercase tracking-wider mb-5">Recurrente</p>
                <p className="text-white/50 text-[13px] sm:text-sm leading-relaxed">
                  Servidor, IA y mensajes de WhatsApp. Sin cobros ocultos.
                </p>
              </div>
            </GlassCard>
          </Reveal>
        </div>

        <Reveal delay={0.2} className="max-w-4xl mx-auto">
          <div className="flex items-start gap-4 p-6 rounded-2xl border border-white/[0.08] bg-white/[0.02]">
            <div className="shrink-0 w-9 h-9 rounded-xl bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center">
              <Zap className="w-[18px] h-[18px] text-neon-cyan" strokeWidth={1.75} />
            </div>
            <p className="text-white/55 text-[13px] sm:text-sm leading-relaxed flex-1">
              Una recepcionista cuesta más de <span className="text-white font-semibold">$2M al mes</span>. La plataforma paga su implementación en menos de 6 meses — y sigue operando sola, las 24 horas.
            </p>
          </div>
        </Reveal>
      </PageSection>

      {/* ═══ FAQ ════════════════════════════════════════════════════════════ */}
      <PageSection id="faq" containerSize="sm">
        <Reveal className="text-center mb-16 sm:mb-20">
          <SectionHeader
            titleLeft="Preguntas"
            titleHighlight="Frecuentes"
            subtitle="Todo lo que probablemente te estás preguntando."
          />
        </Reveal>

        <Reveal>
          <div className="space-y-3">
            {FAQS.map((f, i) => <FaqItem key={i} q={f.q} a={f.a} idx={i} />)}
          </div>
        </Reveal>
      </PageSection>

      {/* ═══ CTA FINAL ══════════════════════════════════════════════════════ */}
      <PageSection id="cta" containerSize="lg">
        <Reveal>
          <GlassCard accent="purple">
            <div className="p-10 sm:p-16 lg:p-20 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/15 bg-white/[0.03] text-[11px] font-bold uppercase tracking-[0.18em] mb-8">
                <Sparkles className="w-3 h-3 text-neon-purple" />
                <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent bg-[length:200%_auto] energy-flow-css">
                  Listo Para Arrancar
                </span>
              </div>

              <h2 className="font-orbitron text-3xl sm:text-4xl lg:text-5xl font-semibold leading-[1.1] tracking-tight mb-5">
                Tu Negocio Puede{" "}
                <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent bg-[length:200%_auto] energy-flow-css">
                  Atender Solo
                </span>
                <br className="hidden sm:block" />
                {" "}Desde La Próxima Semana.
              </h2>

              <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-10 max-w-xl mx-auto font-light">
                Cuéntanos sobre tu operación. En menos de 24 horas te decimos si tiene sentido y cuánto costaría exactamente.
              </p>

              <WaButton href={WA_URL} label="Hablar por WhatsApp" onClick={() => trackWA("cta_final")} />

              <p className="text-white/30 text-[11px] mt-5 uppercase tracking-wider">
                Sin compromiso · Respuesta en menos de 24 horas
              </p>
            </div>
          </GlassCard>
        </Reveal>
      </PageSection>

      <Footer />
      <WhatsAppFAB />

      {/* ─── WhatsApp button styles (verde por branding) ─── */}
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
    </main>
  )
}
