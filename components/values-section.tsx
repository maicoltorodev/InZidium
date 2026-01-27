"use client"

import { useRef } from "react"
import { Target, Zap, Palette, Rocket } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SectionHeader } from "@/components/section-header"
import { PageSection } from "@/components/ui/page-section"
import { useMounted } from "@/lib/hooks/use-mounted"
import { useViewportHover } from "@/lib/hooks/use-viewport-hover"

const values = [
  {
    icon: Target,
    title: "Enfocado en Resultados",
    description: "Cada solución que creamos está diseñada para atraer más clientes y aumentar tus ingresos. No solo creamos páginas bonitas, creamos herramientas que venden.",
    badge: "ROI",
  },
  {
    icon: Zap,
    title: "Optimización Total",
    description: "Creamos sistemas que automatizan tareas, reducen costos operativos y hacen que tu negocio funcione de manera más eficiente y rentable.",
    badge: "Eficiencia",
  },
  {
    icon: Palette,
    title: "Experiencia Superior",
    description: "Tus clientes y tu equipo podrán usar todo sin complicaciones. Interfaces claras e intuitivas que cualquiera puede manejar.",
    badge: "UX Premium",
  },
  {
    icon: Rocket,
    title: "Presencia Digital",
    description: "Tus aplicaciones estarán disponibles en Google Play Store y Apple App Store, para el prestigio que necesita tu negocio.",
    badge: "Multiplataforma",
  },
]

function ValueCard({ value, index, isViewportActive, cardRef }: { value: (typeof values)[0]; index: number; isViewportActive: boolean; cardRef: (el: HTMLDivElement | null) => void }) {
  const Icon = value.icon
  return (
    <Card 
      ref={cardRef}
      className={`group relative border border-border/50 bg-gradient-to-br from-card/95 via-card/90 to-card/95 transition-all duration-500 cursor-pointer hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 hover:scale-[1.02] overflow-hidden ${isViewportActive ? "viewport-active" : ""}`}
    >
      {/* Background gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-accent/0 to-primary/0 group-hover:from-primary/5 group-hover:via-accent/3 group-hover:to-primary/5 transition-all duration-500 pointer-events-none" />
      
      {/* Decorative corner elements */}
      <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-primary/10 rounded-tl-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-accent/10 rounded-br-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <CardContent className="relative z-10 p-8 sm:p-10">
        <div className="flex flex-col items-center text-center space-y-6">
          {/* Icon with gradient background */}
          <div className="relative">
            <div className="p-5 rounded-2xl bg-gradient-to-br from-primary/20 via-accent/15 to-primary/20 border-2 border-primary/30 transition-all duration-500 group-hover:scale-110 group-hover:border-primary/50 group-hover:shadow-lg group-hover:shadow-primary/30">
              <Icon className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
            </div>
          </div>
          
          {/* Title and Badge */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 flex-wrap">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground group-hover:text-primary transition-colors duration-500">
                {value.title}
              </h3>
              {value.badge && (
                <Badge variant="secondary" className="text-xs font-semibold bg-gradient-to-r from-primary/15 to-accent/15 text-primary border-primary/30 group-hover:border-primary/50 group-hover:bg-gradient-to-r group-hover:from-primary/25 group-hover:to-accent/25 transition-all duration-500">
                  {value.badge}
                </Badge>
              )}
            </div>
            
            {/* Description */}
            <p className="text-base sm:text-lg text-muted-foreground/80 leading-relaxed max-w-md mx-auto">
              {value.description}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function ValuesSection() {
  const containerRef = useMounted<HTMLDivElement>()
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const activeCardIndex = useViewportHover(cardRefs)

  return (
    <PageSection id="valores" containerSize="lg">
      <div ref={containerRef} className="relative">
        <div className="text-center mb-20 sm:mb-24 lg:mb-32 animate-on-mount" data-animation="fade-down">
          <SectionHeader titleLeft="Nuestros" titleHighlight="Valores" subtitle="Principios que guían cada proyecto y garantizan resultados excepcionales" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {values.map((value, index) => (
            <div key={index} className="animate-on-mount" data-animation="fade-up" style={{ animationDelay: `${0.2 + index * 0.1}s` }}>
              <ValueCard 
                value={value} 
                index={index}
                isViewportActive={activeCardIndex === index}
                cardRef={(el) => {
                  cardRefs.current[index] = el
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </PageSection>
  )
}
