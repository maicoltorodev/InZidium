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
  return (
    <Card 
      ref={cardRef}
      className={`group border border-primary/30 bg-gradient-to-br from-card/95 to-card/80 overflow-hidden transition-all duration-500 cursor-pointer hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 animate-on-mount md:hover:scale-[1.02] ${isViewportActive ? "viewport-active" : ""}`}
      data-animation="fade-up" 
      style={{ animationDelay: `${0.2 + index * 0.1}s` }}
    >
      {/* Icon container with transform wrapper */}
      <div className="relative h-48 sm:h-56 overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10">
        {/* Transform container: scales icon and overlays together */}
        <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-110 origin-center">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl">{solution.icon}</div>
          </div>
          
          {/* Gradient overlays - same transform context as icon */}
          <div className="absolute inset-0 z-[1] pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/60 to-transparent opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-accent/0 group-hover:from-primary/15 group-hover:via-transparent group-hover:to-accent/15 transition-all duration-500" />
          </div>
        </div>
      </div>

      <CardContent className="relative z-10 p-6">
        <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-500">
          {solution.title}
        </h3>
        <p className="text-sm sm:text-base text-muted-foreground/80 mb-4 leading-relaxed">{solution.description}</p>

        <div className="flex flex-wrap gap-2">
          {solution.features.map((feature) => (
            <Badge 
              key={feature} 
              variant="secondary" 
              className="text-xs font-medium border-primary/30 bg-primary/5 group-hover:bg-primary/10 group-hover:border-primary/50 transition-colors duration-500"
            >
              {feature}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function OtherSolutions() {
  const containerRef = useMounted<HTMLDivElement>()
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const activeCardIndex = useViewportHover(cardRefs)

  return (
    <section id="otras-soluciones" className="scroll-mt-24 sm:scroll-mt-32 pt-28 sm:pt-40 pb-20 sm:pb-32 bg-card/50 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent opacity-50" />
      <div ref={containerRef} className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-20 sm:mb-24 lg:mb-32 animate-on-mount" data-animation="fade-down">
          <SectionHeader titleLeft="Otras" titleHighlight="Soluciones" subtitle="Más allá de páginas web, ofrecemos soluciones tecnológicas completas para tu negocio" />
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
