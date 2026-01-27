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
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[400px] h-[400px] sm:w-[800px] sm:h-[800px] opacity-[0.01] sm:opacity-[0.02] pointer-events-none z-0">
          <div className="relative w-full h-full">
            <Image src="/logo.webp" alt="Fondo decorativo - InZidium" fill className="object-contain" aria-hidden="true" loading="lazy" fetchPriority="low" quality={40} sizes="(max-width: 640px) 400px, 800px" placeholder="blur" blurDataURL={BLUR_PLACEHOLDER} />
          </div>
        </div>

        <div className="text-center mb-20 sm:mb-24 lg:mb-32 animate-on-mount" data-animation="fade-down">
          <SectionHeader titleLeft="Sobre" titleHighlight="Nosotros" subtitle="Soluciones digitales que impulsan tu negocio y generan resultados reales" />
        </div>

        <div className="mb-20 sm:mb-24 lg:mb-32 animate-on-mount" data-animation="fade-up" style={{ animationDelay: "0.3s" }}>
          <div className="max-w-5xl mx-auto">
            <div className="relative p-8 sm:p-12 lg:p-16 rounded-3xl bg-card/50 border border-border/30">
              <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-primary/20 rounded-tl-3xl" />
              <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-accent/20 rounded-br-3xl" />
              <ul className="space-y-4 sm:space-y-6 text-center relative z-10">
                <li className="about-item-float-left text-xl sm:text-2xl md:text-3xl lg:text-4xl text-foreground/90 leading-relaxed font-normal tracking-wide">
                  Entendemos tu <span className="text-primary font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">modelo comercial</span>
                </li>
                <li className="about-item-float-right text-xl sm:text-2xl md:text-3xl lg:text-4xl text-foreground/90 leading-relaxed font-normal tracking-wide">
                  Creamos <span className="text-primary font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">páginas web profesionales</span>
                </li>
                <li className="about-item-float-left text-xl sm:text-2xl md:text-3xl lg:text-4xl text-foreground/90 leading-relaxed font-normal tracking-wide">
                  Para <span className="text-primary font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">generar resultados tangibles</span>
                </li>
                <li className="about-item-float-right text-xl sm:text-2xl md:text-3xl lg:text-4xl text-foreground/90 leading-relaxed font-normal tracking-wide">
                  Y el <span className="text-primary font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">crecimiento de tu negocio</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </PageSection>
  )
}
