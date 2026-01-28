"use client"

import { useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SectionHeader } from "@/components/section-header"
import { useMounted } from "@/lib/hooks/use-mounted"
import { useViewportHover } from "@/lib/hooks/use-viewport-hover"

type Solution = {
  id: string
  title: string
  description: string
  features: string[]
  icon: string
}

const solutions: Solution[] = [
  {
    id: "1",
    title: "Aplicaciones Móviles",
    description: "Desarrollamos aplicaciones móviles disponibles en Play Store y App Store que permiten a tus clientes acceder a tus servicios desde sus celulares.",
    features: ["Android", "iPhone", "Play Store", "App Store"],
    icon: "📱",
  },
  {
    id: "2",
    title: "Sistemas Personalizados",
    description: "Creamos sistemas personalizados que automatizan tareas, optimizan procesos y mejoran la eficiencia de tu negocio según tus necesidades específicas.",
    features: ["Automatización", "Personalización", "Optimización", "Escalabilidad"],
    icon: "⚙️",
  },
  {
    id: "3",
    title: "Tiendas Online",
    description: "Desarrollamos tiendas virtuales completas donde tus clientes pueden ver productos, agregar al carrito y comprar de forma segura.",
    features: ["Ventas online", "Pagos integrados", "Gestión de inventario", "Panel de control"],
    icon: "🛒",
  },
  {
    id: "4",
    title: "Sistemas de Reservas",
    description: "Creamos sistemas de reservas para restaurantes, salones, clínicas o cualquier negocio que necesite gestionar citas y reservas online.",
    features: ["Reservas automáticas", "Confirmaciones", "Gestión de horarios", "Recordatorios"],
    icon: "📅",
  },
]

function SolutionCard({ solution, index, isViewportActive, cardRef }: { solution: Solution; index: number; isViewportActive: boolean; cardRef: (el: HTMLDivElement | null) => void }) {
  const neonColor = index % 2 === 0 ? 'var(--color-neon-purple)' : 'var(--color-neon-cyan)';

  return (
    <div
      ref={cardRef}
      className={`glass-panel rounded-3xl p-8 relative overflow-hidden group transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(34,211,238,0.15)] hover:border-neon-cyan/50 will-change-transform ${isViewportActive ? "viewport-active scale-[1.02] -translate-y-2 shadow-[0_0_30px_rgba(34,211,238,0.15)]" : ""}`}
      style={{
        animationDelay: `${0.2 + index * 0.1}s`,
        borderColor: isViewportActive ? neonColor : ''
      }}
    >
      <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-40 transition-opacity transform group-hover:scale-110 duration-500">
        <span className="text-6xl filter blur-[2px]">{solution.icon}</span>
      </div>

      <div className="relative z-10">
        <div className="text-4xl mb-6 bg-white/10 w-16 h-16 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/5 shadow-inner">
          {solution.icon}
        </div>

        <h3 className="text-xl sm:text-2xl font-orbitron text-white mb-4 group-hover:text-neon-cyan transition-colors">
          {solution.title}
        </h3>

        <p className="text-muted-foreground leading-relaxed mb-6">
          {solution.description}
        </p>

        <div className="flex flex-wrap gap-2">
          {solution.features.map((feature) => (
            <span
              key={feature}
              className="text-xs font-medium px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/80 group-hover:border-neon-cyan/30 transition-colors"
            >
              {feature}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export function OtherSolutions() {
  const containerRef = useMounted<HTMLDivElement>()
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const activeCardIndex = useViewportHover(cardRefs)

  return (
    <section id="otras-soluciones" className="scroll-mt-24 sm:scroll-mt-32 pt-28 sm:pt-40 pb-20 sm:pb-32 relative overflow-hidden">
      {/* Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 w-[600px] h-[600px] bg-neon-purple/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-neon-cyan/10 rounded-full blur-[100px]" />
      </div>

      <div ref={containerRef} className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-20 sm:mb-24 lg:mb-32 animate-on-mount" data-animation="fade-down">
          <SectionHeader
            titleLeft="Otras"
            titleHighlight="Soluciones"
            subtitle="Tecnología que se adapta a las necesidades específicas de tu crecimiento"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {solutions.map((solution, index) => (
            <SolutionCard
              key={solution.id}
              solution={solution}
              index={index}
              isViewportActive={activeCardIndex === index}
              cardRef={(el) => {
                cardRefs.current[index] = el
              }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
