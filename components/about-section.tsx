"use client"

import Image from "next/image"
import { SectionHeader } from "@/components/section-header"
import { BLUR_PLACEHOLDER } from "@/lib/utils/image-optimization"
import { PageSection } from "@/components/ui/page-section"
import { useMounted } from "@/lib/hooks/use-mounted"

export function AboutSection() {
  const containerRef = useMounted<HTMLDivElement>()

  return (
    <PageSection id="sobre-mi" containerSize="lg">
      <div ref={containerRef} className="relative">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-neon-purple/20 rounded-full blur-[120px] -z-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-neon-cyan/20 rounded-full blur-[120px] -z-10 pointer-events-none" />

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
            <div className="glass-panel p-8 sm:p-10 rounded-3xl hover:bg-white/5 transition-all duration-300 group border border-white/10 hover:border-neon-purple/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.2)]">
              <h3 className="text-2xl sm:text-3xl font-orbitron mb-4 text-white group-hover:text-neon-purple transition-colors">Estrategia</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Entendemos tu <span className="text-white font-medium">modelo comercial</span> a profundidad para diseñar soluciones que no solo se ven bien, sino que funcionan para tu negocio.
              </p>
            </div>

            <div className="glass-panel p-8 sm:p-10 rounded-3xl hover:bg-white/5 transition-all duration-300 group border border-white/10 hover:border-neon-cyan/50 hover:shadow-[0_0_30px_rgba(34,211,238,0.2)]">
              <h3 className="text-2xl sm:text-3xl font-orbitron mb-4 text-white group-hover:text-neon-cyan transition-colors">Diseño</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Creamos <span className="text-white font-medium">interfaces inmersivas</span> que capturan la esencia de tu marca y mantienen a tus usuarios cautivados.
              </p>
            </div>

            <div className="glass-panel p-8 sm:p-10 rounded-3xl hover:bg-white/5 transition-all duration-300 group border border-white/10 hover:border-neon-cyan/50 hover:shadow-[0_0_30px_rgba(34,211,238,0.2)]">
              <h3 className="text-2xl sm:text-3xl font-orbitron mb-4 text-white group-hover:text-neon-cyan transition-colors">Resultados</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Enfocados en <span className="text-white font-medium">métricas reales</span>. Tu crecimiento es nuestro principal indicador de éxito.
              </p>
            </div>

            <div className="glass-panel p-8 sm:p-10 rounded-3xl hover:bg-white/5 transition-all duration-300 group border border-white/10 hover:border-neon-purple/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.2)]">
              <h3 className="text-2xl sm:text-3xl font-orbitron mb-4 text-white group-hover:text-neon-purple transition-colors">Tecnología</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Utilizamos el stack más moderno para garantizar <span className="text-white font-medium">velocidad y escalabilidad</span> en cada proyecto.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageSection>
  )
}
