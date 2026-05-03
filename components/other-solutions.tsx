"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { SectionHeader } from "@/components/section-header"
import { PageSection } from "@/components/ui/page-section"
import { ServicioCard } from "@/components/servicios/servicio-card"
import { getServiciosDestacados } from "@/lib/data/servicios"

export function OtherSolutions() {
  const destacados = getServiciosDestacados()

  return (
    <PageSection id="otras-soluciones" containerSize="xl">
      <div className="relative z-10">
        <div className="text-center mb-16 sm:mb-20 lg:mb-24 animate-on-mount" data-animation="fade-down">
          <SectionHeader
            titleLeft="Nuestras"
            titleHighlight="Soluciones"
            subtitle="Tecnología con IA que se adapta a tu negocio — bots, automatización, e-commerce, apps y más."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {destacados.map((servicio, index) => (
            <div
              key={servicio.slug}
              className="animate-on-mount"
              data-animation="fade-up"
              style={{ animationDelay: `${0.1 + index * 0.05}s` }}
            >
              <ServicioCard servicio={servicio} index={index} />
            </div>
          ))}
        </div>

        <div className="mt-12 sm:mt-16 text-center animate-on-mount" data-animation="fade-up">
          <Link
            href="/servicios"
            prefetch={false}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-orbitron font-bold tracking-[0.2em] text-[11px] sm:text-[12px] text-white border border-cyan-500/50 bg-cyan-500/10 shadow-[0_0_20px_rgba(34,211,238,0.2)] uppercase transition-all duration-200 hover:bg-cyan-500/20 hover:scale-105 active:scale-95"
          >
            Ver todos los servicios
            <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
          </Link>
          <p className="mt-4 text-xs text-muted-foreground">
            Casos específicos por industria, detalles técnicos y FAQ en cada uno.
          </p>
        </div>
      </div>
    </PageSection>
  )
}
