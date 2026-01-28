"use client"

import { Target, Zap, Palette, Rocket } from "lucide-react"
import { motion } from "framer-motion"
import { SectionHeader } from "@/components/section-header"
import { PageSection } from "@/components/ui/page-section"
import { BackgroundGradients } from "@/components/ui/background-gradients"
import { useViewportActive } from "@/lib/hooks/use-viewport-active"
import { cn } from "@/lib/utils"

import { HighlightText } from "@/components/ui/highlight-text"

const values = [
  {
    icon: Target,
    title: "Enfocado en Resultados",
    description: "Cada solución que creamos está diseñada para atraer más clientes y aumentar tus ingresos. No solo creamos páginas bonitas, creamos herramientas que venden.",
    highlight: "atraer más clientes",
    badge: "ROI",
  },
  {
    icon: Zap,
    title: "Optimización Total",
    description: "Creamos sistemas que automatizan tareas, reducen costos operativos y hacen que tu negocio funcione de manera más eficiente y rentable.",
    highlight: "automatizan tareas",
    badge: "Eficiencia",
  },
  {
    icon: Palette,
    title: "Experiencia Superior",
    description: "Tus clientes y tu equipo podrán usar todo sin complicaciones. Interfaces claras e intuitivas que cualquiera puede manejar.",
    highlight: "Interfaces claras e intuitivas",
    badge: "UX Premium",
  },
  {
    icon: Rocket,
    title: "Presencia Digital",
    description: "Tus aplicaciones estarán disponibles en Google Play Store y Apple App Store, para el prestigio que necesita tu negocio.",
    highlight: "disponibles en Play Store y App Store",
    badge: "Multiplataforma",
  },
]

function ValueCard({ value, index }: { value: (typeof values)[0]; index: number }) {
  const Icon = value.icon
  const { elementRef, isActive } = useViewportActive<HTMLDivElement>();

  return (
    <motion.div
      ref={elementRef}
      className={cn(
        "glass-panel glass-card border-white/5 bg-white/5 rounded-3xl p-8 sm:p-10 relative overflow-hidden group will-change-transform",
        isActive && "viewport-active"
      )}
      style={{
        "--active-border": index % 2 === 0 ? "rgba(168,85,247,0.5)" : "rgba(34,211,238,0.5)",
        "--active-glow": index % 2 === 0 ? "rgba(168,85,247,0.2)" : "rgba(34,211,238,0.2)",
        "--neon-glow": index % 2 === 0 ? "rgba(168,85,247,0.15)" : "rgba(34,211,238,0.15)"
      } as React.CSSProperties}
    >
      {/* Background gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />

      <div className="flex flex-col items-center text-center space-y-6 relative z-10">
        {/* Icon with glass background */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-neon-purple to-neon-cyan blur-xl opacity-20 md:group-hover:opacity-40 transition-opacity duration-200" />
          <div className="p-5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 md:group-hover:border-white/20 transition-all duration-200 relative">
            <Icon className="h-10 w-10 text-white md:group-hover:text-neon-cyan transition-colors duration-200" />
          </div>
        </div>

        {/* Title and Badge */}
        <div className="space-y-4">
          <div className="flex flex-col items-center gap-3">
            <h3 className="text-2xl sm:text-3xl font-orbitron text-white md:group-hover:text-neon-purple transition-colors duration-200">
              {value.title}
            </h3>
            {value.badge && (
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/50 md:group-hover:text-white md:group-hover:border-neon-purple/50 transition-colors uppercase tracking-wider">
                {value.badge}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-lg text-muted-foreground leading-relaxed max-w-md mx-auto">
            <HighlightText text={value.description} highlight={value.highlight} />
          </p>
        </div>
      </div>
    </motion.div>
  )
}

export function ValuesSection() {

  return (
    <PageSection id="valores" containerSize="lg" withBackground={false}>
      <BackgroundGradients purplePosition="top-left" cyanPosition="bottom-right" className="opacity-10" />
      <div className="relative">
        <div className="text-center mb-20 sm:mb-24 lg:mb-32 animate-on-mount" data-animation="fade-down">
          <SectionHeader titleLeft="Nuestros" titleHighlight="Valores" subtitle="Principios que guían cada proyecto y garantizan resultados excepcionales" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {values.map((value, index) => (
            <div key={index} className="animate-on-mount" data-animation="fade-up" style={{ animationDelay: `${0.2 + index * 0.1}s` }}>
              <ValueCard
                value={value}
                index={index}
              />
            </div>
          ))}
        </div>
      </div>
    </PageSection>
  )
}
