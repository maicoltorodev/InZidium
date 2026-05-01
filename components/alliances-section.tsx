"use client"

import Image from "next/image"
import { ExternalLink } from "lucide-react"
import { motion } from "framer-motion"
import { SectionHeader } from "@/components/section-header"
import { PageSection } from "@/components/ui/page-section"

type Alliance = {
  name: string
  logo: string
  logoAlt: string
  logoIcon?: string
  url: string
  domain: string
  industry: string
  description: string
  accent: "purple" | "cyan"
}

const alliances: Alliance[] = [
  {
    name: "Nexus",
    logo: "/alianza-nexus.webp",
    logoAlt: "Nexus — estudio de impresión y diseño",
    url: "https://nexustoprint.com",
    domain: "nexustoprint.com",
    industry: "Impresión · Diseño · Manufactura",
    description:
      "Estudio de impresión 3D, diseño gráfico y manufactura digital con plataforma administrativa propia, CRM y atención automatizada por WhatsApp.",
    accent: "purple",
  },
  {
    name: "Alkubo",
    logo: "/alianza-alkubo-titulo.webp",
    logoIcon: "/alianza-alkubo.webp",
    logoAlt: "Alkubo Soluciones Gráficas",
    url: "https://alkubosoluciones.com",
    domain: "alkubosoluciones.com",
    industry: "Diseño · Gran Formato · Publicidad",
    description:
      "Estudio especializado en diseño gráfico, impresión de gran formato, vinilos y material publicitario con gestión digital centralizada.",
    accent: "cyan",
  },
]

const accentColors = {
  purple: {
    glow: "rgba(168,85,247,0.22)",
    glowStrong: "rgba(168,85,247,0.35)",
    border: "#a855f7",
    logoBg: "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(168,85,247,0.12), transparent)",
  },
  cyan: {
    glow: "rgba(34,211,238,0.22)",
    glowStrong: "rgba(34,211,238,0.35)",
    border: "#22d3ee",
    logoBg: "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(34,211,238,0.12), transparent)",
  },
}

function AllianceCard({ alliance, index }: { alliance: Alliance; index: number }) {
  const colors = accentColors[alliance.accent]

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.18, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex flex-col rounded-3xl overflow-hidden h-full"
      style={{
        background: "linear-gradient(160deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
        border: `1px solid rgba(255,255,255,0.08)`,
        boxShadow: `0 0 0 0 ${colors.glow}`,
        transition: "box-shadow 0.4s ease, border-color 0.4s ease",
      }}
    >
      {/* Glow top en hover */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"
        style={{
          background: `radial-gradient(ellipse 80% 50% at 50% 0%, ${colors.glow}, transparent 70%)`,
          boxShadow: `inset 0 1px 0 ${colors.border}40`,
        }}
      />

      {/* ── Área del logo — altura fija para que ambas cards sean iguales ── */}
      <div
        className="relative flex items-center justify-center"
        style={{
          height: "200px",
          background: colors.logoBg,
          borderBottom: `1px solid rgba(255,255,255,0.06)`,
        }}
      >
        {alliance.logoIcon ? (
          // Alkubo: cubo arriba + wordmark abajo, centrados
          <div className="flex flex-col items-center justify-center gap-3 w-full px-10">
            <div className="relative" style={{ width: 84, height: 84 }}>
              <Image
                src={alliance.logoIcon}
                alt=""
                fill
                className="object-contain"
                style={{ filter: "drop-shadow(0 0 20px rgba(234,179,8,0.5))" }}
                sizes="84px"
              />
            </div>
            <div className="relative" style={{ width: "100%", maxWidth: 180, height: 44 }}>
              <Image
                src={alliance.logo}
                alt={alliance.logoAlt}
                fill
                className="object-contain"
                style={{ filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.4))" }}
                sizes="180px"
              />
            </div>
          </div>
        ) : (
          // Nexus: logo horizontal centrado
          <div className="relative w-full px-12" style={{ height: 88 }}>
            <Image
              src={alliance.logo}
              alt={alliance.logoAlt}
              fill
              className="object-contain"
              style={{ filter: "drop-shadow(0 0 16px rgba(255,255,255,0.15))" }}
              sizes="280px"
            />
          </div>
        )}
      </div>

      {/* ── Info ── */}
      <div className="flex flex-col gap-5 px-8 py-8 flex-1">
        {/* Badge */}
        <span
          className="self-start rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest"
          style={{
            border: `1px solid ${colors.border}30`,
            background: `${colors.border}12`,
            color: `${colors.border}`,
          }}
        >
          {alliance.industry}
        </span>

        {/* Descripción */}
        <p className="text-sm leading-relaxed text-white/50 group-hover:text-white/65 transition-colors duration-300 flex-1">
          {alliance.description}
        </p>

        {/* Link */}
        <a
          href={alliance.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-between gap-2 rounded-xl px-4 py-3 text-sm text-white/60 transition-all duration-200 hover:text-white/90"
          style={{
            border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(255,255,255,0.03)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = `${colors.border}50`
            e.currentTarget.style.background = `${colors.border}10`
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"
            e.currentTarget.style.background = "rgba(255,255,255,0.03)"
          }}
        >
          <span className="font-medium">{alliance.domain}</span>
          <ExternalLink className="h-3.5 w-3.5 flex-shrink-0 opacity-60" />
        </a>
      </div>
    </motion.div>
  )
}

export function AlliancesSection() {
  return (
    <PageSection id="alianzas" containerSize="lg" withBackground={false}>
      <div className="relative">
        {/* Header */}
        <div
          className="text-center mb-20 sm:mb-24 lg:mb-28 animate-on-mount"
          data-animation="fade-down"
        >
          <SectionHeader
            titleLeft="Nuestras"
            titleHighlight="Alianzas"
            subtitle="Estudios gráficos que confían en InZidium para digitalizar y profesionalizar su operación"
          />
        </div>

        {/* Cards — ancho fijo para que se vean simétricas siempre */}
        <div className="flex flex-col sm:flex-row justify-center items-stretch gap-6 sm:gap-8 max-w-2xl mx-auto">
          {alliances.map((alliance, index) => (
            <div key={alliance.domain} className="w-full sm:w-80">
              <AllianceCard alliance={alliance} index={index} />
            </div>
          ))}
        </div>

        {/* Footer hint */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-14 text-center text-[13px] text-white/20 tracking-wide"
        >
          La red de estudios aliados continúa creciendo.
        </motion.p>
      </div>
    </PageSection>
  )
}
