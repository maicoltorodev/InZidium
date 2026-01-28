"use client"

import { SectionHeader } from "@/components/section-header"
import { PageSection } from "@/components/ui/page-section"
import { BackgroundGradients } from "@/components/ui/background-gradients"

const ABOUT_CARDS = [
  {
    title: "Estrategia",
    description: "Entendemos tu modelo comercial a profundidad para diseñar soluciones que no solo se ven bien, sino que funcionan para tu negocio.",
    highlight: "modelo comercial",
    color: "neon-purple"
  },
  {
    title: "Diseño",
    description: "Creamos interfaces inmersivas que capturan la esencia de tu marca y mantienen a tus usuarios cautivados.",
    highlight: "interfaces inmersivas",
    color: "neon-cyan"
  },
  {
    title: "Resultados",
    description: "Enfocados en métricas reales. Tu crecimiento es nuestro principal indicador de éxito.",
    highlight: "métricas reales",
    color: "neon-cyan"
  },
  {
    title: "Tecnología",
    description: "Utilizamos el stack más moderno para garantizar velocidad y escalabilidad en cada proyecto.",
    highlight: "velocidad y escalabilidad",
    color: "neon-purple"
  }
]

export function AboutSection() {
  return (
    <PageSection id="sobre-mi" containerSize="lg" withBackground={false}>
      <BackgroundGradients />
      <div className="relative">

        <div className="text-center mb-16 sm:mb-24 lg:mb-32 animate-on-mount" data-animation="fade-down">
          <SectionHeader
            titleLeft="Sobre"
            titleHighlight="Nosotros"
            subtitle="Transformamos ideas en experiencias digitales de alto impacto"
            className="text-foreground"
          />
        </div>

        <div className="mb-20 sm:mb-24 animate-on-mount" data-animation="fade-up" style={{ animationDelay: "0.2s" }}>
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {ABOUT_CARDS.map((card, idx) => (
              <AboutCard key={idx} {...card} />
            ))}
          </div>
        </div>
      </div>
    </PageSection>
  )
}

function AboutCard({ title, description, highlight, color }: typeof ABOUT_CARDS[0]) {
  const isPurple = color === "neon-purple";

  return (
    <div className={`glass-panel p-8 sm:p-10 rounded-3xl md:hover:bg-white/5 transition-all duration-200 group border border-white/10 
      ${isPurple ? 'md:hover:border-neon-purple/50 md:hover:shadow-[0_0_30px_rgba(168,85,247,0.2)]' : 'md:hover:border-neon-cyan/50 md:hover:shadow-[0_0_30px_rgba(34,211,238,0.2)]'} 
      will-change-transform`}>
      <h3 className={`text-2xl sm:text-3xl font-orbitron mb-4 text-white transition-colors duration-200 
        ${isPurple ? 'md:group-hover:text-neon-purple' : 'md:group-hover:text-neon-cyan'}`}>
        {title}
      </h3>
      <p className="text-muted-foreground text-lg leading-relaxed">
        {description.split(highlight).map((part, i, arr) => (
          <span key={i}>
            {part}
            {i < arr.length - 1 && <span className="text-white font-medium">{highlight}</span>}
          </span>
        ))}
      </p>
    </div>
  )
}
