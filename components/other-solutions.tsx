"use client"

import { useRef } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SectionHeader } from "@/components/section-header"
import { PageSection } from "@/components/ui/page-section"
import { BackgroundGradients } from "@/components/ui/background-gradients"
import { useViewportActive } from "@/lib/hooks/use-viewport-active"
import { cn } from "@/lib/utils"

import { HighlightText } from "@/components/ui/highlight-text"

type Solution = {
  id: string
  title: string
  description: string
  highlight?: string
  features: string[]
  icon: string
}

const solutions: Solution[] = [
  {
    id: "1",
    title: "Aplicaciones Móviles",
    description: "Desarrollamos aplicaciones móviles disponibles en Play Store y App Store que permiten a tus clientes acceder a tus servicios desde sus celulares.",
    highlight: "Play Store y App Store",
    features: ["Android", "iPhone", "Play Store", "App Store"],
    icon: "📱",
  },
  {
    id: "2",
    title: "Sistemas Personalizados",
    description: "Creamos sistemas personalizados que automatizan tareas, optimizan procesos y mejoran la eficiencia de tu negocio según tus necesidades específicas.",
    highlight: "automatizan tareas",
    features: ["Automatización", "Personalización", "Optimización", "Escalabilidad"],
    icon: "⚙️",
  },
  {
    id: "3",
    title: "Tiendas Online",
    description: "Desarrollamos tiendas virtuales completas donde tus clientes pueden ver productos, agregar al carrito y comprar de forma segura.",
    highlight: "comprar de forma segura",
    features: ["Ventas online", "Pagos integrados", "Gestión de inventario", "Panel de control"],
    icon: "🛒",
  },
  {
    id: "4",
    title: "Sistemas de Reservas",
    description: "Creamos sistemas de reservas para restaurantes, salones, clínicas o cualquier negocio que necesite gestionar citas y reservas online.",
    highlight: "gestionar citas y reservas online",
    features: ["Reservas automáticas", "Confirmaciones", "Gestión de horarios", "Recordatorios"],
    icon: "📅",
  },
]


function SolutionCard({ solution, index }: { solution: Solution; index: number }) {
  const { elementRef, isActive } = useViewportActive<HTMLDivElement>();

  return (
    <motion.div
      ref={elementRef}
      className={cn(
        "glass-panel glass-card rounded-3xl p-8 relative overflow-hidden group will-change-transform",
        isActive && "viewport-active"
      )}
      style={{
        animationDelay: `${0.2 + index * 0.1}s`,
        "--active-border": index % 2 === 0 ? "rgba(168,85,247,0.5)" : "rgba(34,211,238,0.5)",
        "--active-glow": index % 2 === 0 ? "rgba(168,85,247,0.2)" : "rgba(34,211,238,0.2)",
        "--neon-glow": index % 2 === 0 ? "rgba(168,85,247,0.15)" : "rgba(34,211,238,0.15)"
      } as React.CSSProperties}
    >
      <div className={`absolute top-0 right-0 p-8 opacity-20 transition-opacity transform duration-200 md:group-hover:opacity-40 md:group-hover:scale-110`}>
        <span className="text-6xl filter blur-[2px]">{solution.icon}</span>
      </div>

      <div className="relative z-10">
        <div className="text-4xl mb-6 bg-white/10 w-16 h-16 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/5 shadow-inner">
          {solution.icon}
        </div>

        <h3 className="text-xl sm:text-2xl font-orbitron text-white mb-4 md:group-hover:text-neon-cyan transition-colors duration-200">
          {solution.title}
        </h3>

        <p className="text-muted-foreground leading-relaxed mb-6">
          <HighlightText text={solution.description} highlight={solution.highlight || ""} />
        </p>

        <div className="flex flex-wrap gap-2">
          {solution.features.map((feature) => (
            <span
              key={feature}
              className="text-xs font-medium px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/80 md:group-hover:border-neon-cyan/30 transition-colors duration-200"
            >
              {feature}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export function OtherSolutions() {
  return (
    <PageSection id="otras-soluciones" containerSize="xl" withBackground={false}>
      <BackgroundGradients purplePosition="bottom-right" cyanPosition="top-left" opacity="opacity-10" />

      <div className="relative z-10">
        <div className="text-center mb-20 sm:mb-24 lg:mb-32 animate-on-mount" data-animation="fade-down">
          <SectionHeader
            titleLeft="Otras"
            titleHighlight="Soluciones"
            subtitle="Tecnología que se adapta a las necesidades específicas de tu crecimiento"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {solutions.map((solution, index) => (
            <div key={solution.id} className="animate-on-mount" data-animation="fade-up" style={{ animationDelay: `${0.2 + index * 0.1}s` }}>
              <SolutionCard
                solution={solution}
                index={index}
              />
            </div>
          ))}
        </div>
      </div>
    </PageSection>
  )
}
