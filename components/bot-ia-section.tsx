"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Bot, Clock, Shield, Zap } from "lucide-react"
import { SectionHeader } from "@/components/section-header"
import { PageSection } from "@/components/ui/page-section"

// ─── Mini WaMock ──────────────────────────────────────────────────────────────
const MESSAGES = [
  { from: "client", text: "Hola, ¿tienen cita esta semana?" },
  { from: "bot",    text: "¡Hola! 👋 Sí. ¿Qué día te queda mejor?" },
  { from: "client", text: "Jueves en la tarde, tipo 3pm" },
  { from: "bot",    text: "✅ Cita confirmada para el jueves a las 3:00pm. ¡Hasta pronto! 😊" },
]

function WaMini() {
  return (
    <div className="w-full max-w-[270px] mx-auto">
      <div className="rounded-[1.5rem] overflow-hidden border border-white/10 bg-[#111b21] shadow-2xl shadow-neon-cyan/10">
        {/* header */}
        <div className="bg-[#1f2c34] px-4 py-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-neon-cyan/10 border border-neon-cyan/25 flex items-center justify-center shrink-0">
            <Bot className="w-4 h-4 text-neon-cyan" />
          </div>
          <div>
            <p className="text-white text-[12px] font-semibold leading-tight">Tu asistente</p>
            <p className="text-neon-cyan text-[10px] flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan inline-block animate-pulse" />
              en línea
            </p>
          </div>
        </div>
        {/* mensajes */}
        <div className="bg-[#0b141a] px-3 py-3 space-y-[6px]" style={{ minHeight: 200 }}>
          {MESSAGES.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95, y: 4 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.45 + 0.3, duration: 0.22, ease: "easeOut" }}
              className={`flex ${m.from === "client" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] px-[10px] py-[6px] rounded-[10px] text-[11px] leading-[1.55] ${
                  m.from === "client"
                    ? "bg-[#005c4b] text-white rounded-tr-[3px]"
                    : "bg-[#202c33] text-white/85 rounded-tl-[3px]"
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

// ─── Feature pills ────────────────────────────────────────────────────────────
const PILLS = [
  { Icon: Clock,  label: "Responde las 24h" },
  { Icon: Shield, label: "WhatsApp oficial" },
  { Icon: Zap,    label: "IA entrenada en tu negocio" },
]

// ─── Section ─────────────────────────────────────────────────────────────────
export function BotIASection() {
  return (
    <PageSection id="bot-ia">

      <div className="text-center mb-16 sm:mb-24 animate-on-mount" data-animation="fade-down">
        <SectionHeader
          titleLeft="Asistente de"
          titleHighlight="WhatsApp IA"
          subtitle="Tu negocio atiende solo, responde, cotiza y agenda — las 24 horas, sin que muevas un dedo."
        />
      </div>

      <div className="animate-on-mount" data-animation="fade-up" style={{ animationDelay: "0.2s" }}>
        <Link href="/bots-whatsapp-ia" className="block max-w-4xl mx-auto cursor-pointer">
          <motion.div
            className="glass-panel glass-card rounded-3xl overflow-hidden border border-white/10 will-change-transform translate-z-0 backface-hidden group"
            style={{
              "--active-border": "rgba(34,211,238,0.5)",
              "--active-glow": "rgba(34,211,238,0.2)",
              "--neon-glow": "rgba(34,211,238,0.15)",
            } as React.CSSProperties}
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.3 }}
          >
            {/* Top accent line */}
            <div className="h-px w-full bg-gradient-to-r from-transparent via-neon-cyan/50 to-transparent" />

            <div className="grid grid-cols-1 md:grid-cols-2">

              {/* Left — copy */}
              <div className="p-8 sm:p-10 flex flex-col justify-between">
                <div>
                  {/* Icon with glow */}
                  <div className="relative mb-8 inline-block">
                    <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan to-neon-purple blur-xl opacity-20 md:group-hover:opacity-40 transition-opacity duration-300" />
                    <div className="relative p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 md:group-hover:border-white/20 transition-all duration-200">
                      <Bot className="h-10 w-10 text-white md:group-hover:text-neon-cyan transition-colors duration-200" />
                    </div>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-orbitron text-white mb-4 md:group-hover:text-neon-cyan transition-colors duration-200">
                    Bot de WhatsApp con IA
                  </h3>

                  <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                    Asistente inteligente que atiende clientes, agenda citas y cierra ventas directo en WhatsApp — mientras vos te enfocás en lo que importa.
                  </p>

                  <div className="flex flex-wrap gap-2 mb-8">
                    {PILLS.map(({ Icon, label }) => (
                      <span
                        key={label}
                        className="inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/50 md:group-hover:text-white md:group-hover:border-neon-cyan/30 transition-colors uppercase tracking-wider"
                      >
                        <Icon className="h-3.5 w-3.5" />
                        {label}
                      </span>
                    ))}
                  </div>
                </div>

                <span className="inline-flex items-center gap-2 text-neon-cyan font-medium w-fit md:group-hover:gap-3 transition-all duration-200">
                  Ver cómo funciona
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>

              {/* Right — WaMock (hidden on mobile) */}
              <div className="relative p-8 hidden md:flex items-center justify-center border-l border-white/5 bg-white/[0.01]">
                <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/[0.03] to-neon-purple/[0.03] pointer-events-none rounded-r-3xl" />
                <WaMini />
              </div>

              {/* Mobile — compact status strip */}
              <div className="md:hidden px-8 pb-8">
                <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3">
                  <div className="h-7 w-7 rounded-lg bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center shrink-0">
                    <Bot className="h-3.5 w-3.5 text-neon-cyan/60" />
                  </div>
                  <div className="flex flex-col gap-1 flex-1">
                    <div className="h-1.5 w-28 rounded-full bg-white/10" />
                    <div className="h-1 w-16 rounded-full bg-white/5" />
                  </div>
                  <div className="h-1.5 w-1.5 rounded-full bg-neon-cyan animate-pulse" />
                </div>
              </div>

            </div>

            {/* Bottom accent line */}
            <div className="h-px w-full bg-gradient-to-r from-transparent via-neon-purple/30 to-transparent" />
          </motion.div>
        </Link>
      </div>

    </PageSection>
  )
}
