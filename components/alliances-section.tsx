"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { SectionHeader } from "@/components/section-header"
import { PageSection } from "@/components/ui/page-section"

const alliances = [
  {
    name: "Nexus",
    logo: "/alianza-nexus.webp",
    logoAlt: "Nexus — estudio de impresión y diseño",
    logoIcon: undefined as string | undefined,
    url: "https://nexustoprint.com",
    glow: "rgba(234,179,8,0.5)",
    glowSoft: "rgba(234,179,8,0.12)",
    border: "rgba(234,179,8,0.35)",
  },
  {
    name: "Alkubo",
    logo: "/alianza-alkubo-titulo.webp",
    logoAlt: "Alkubo Soluciones Gráficas",
    logoIcon: "/alianza-alkubo.webp",
    url: "https://alkubosoluciones.com",
    glow: "rgba(20,120,100,0.7)",
    glowSoft: "rgba(20,120,100,0.13)",
    border: "rgba(20,140,110,0.4)",
  },
]

function AllianceCard({ alliance, index }: { alliance: typeof alliances[number]; index: number }) {
  return (
    <motion.a
      href={alliance.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.03 }}
      className="group relative flex items-center justify-center rounded-3xl overflow-hidden cursor-pointer"
      style={{
        width: 320,
        height: 210,
        flexShrink: 0,
        background: `radial-gradient(ellipse 120% 100% at 50% 120%, ${alliance.glowSoft} 0%, rgba(10,10,10,0.9) 60%)`,
        border: `1px solid rgba(255,255,255,0.07)`,
        boxShadow: `0 0 0 0 transparent`,
        transition: "box-shadow 0.4s ease, border-color 0.4s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 0 48px -8px ${alliance.glow}, inset 0 0 40px -20px ${alliance.glowSoft}`
        e.currentTarget.style.borderColor = alliance.border
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "0 0 0 0 transparent"
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"
      }}
    >
      {/* Glow top edge */}
      <div
        className="pointer-events-none absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `linear-gradient(to right, transparent, ${alliance.border}, transparent)` }}
      />

      {/* Logo */}
      {alliance.logoIcon ? (
        <div className="flex flex-col items-center gap-3 relative z-10">
          <Image
            src={alliance.logoIcon}
            alt=""
            width={72}
            height={72}
            className="object-contain"
            style={{ filter: `drop-shadow(0 0 18px ${alliance.glow})` }}
          />
          <Image
            src={alliance.logo}
            alt={alliance.logoAlt}
            width={160}
            height={40}
            className="object-contain opacity-90 group-hover:opacity-100 transition-opacity"
          />
        </div>
      ) : (
        <Image
          src={alliance.logo}
          alt={alliance.logoAlt}
          width={230}
          height={90}
          className="object-contain relative z-10 px-6 opacity-90 group-hover:opacity-100 transition-opacity"
          style={{ filter: `drop-shadow(0 0 20px ${alliance.glow})` }}
        />
      )}

      {/* Bottom fade */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-16"
        style={{ background: `linear-gradient(to top, ${alliance.glowSoft}, transparent)` }}
      />
    </motion.a>
  )
}

export function AlliancesSection() {
  return (
    <PageSection id="alianzas" containerSize="lg">
      <div className="text-center mb-20 sm:mb-24 animate-on-mount" data-animation="fade-down">
        <SectionHeader
          titleLeft="Nuestras"
          titleHighlight="Alianzas"
          subtitle="Estudios gráficos que confían en InZidium para digitalizar y profesionalizar su operación"
        />
      </div>

      <div className="flex flex-col sm:flex-row justify-center items-center gap-6 sm:gap-8">
        {alliances.map((alliance, index) => (
          <AllianceCard key={alliance.name} alliance={alliance} index={index} />
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-14 text-center text-[13px] text-white/20 tracking-wide"
      >
        La red de estudios aliados continúa creciendo.
      </motion.p>
    </PageSection>
  )
}
