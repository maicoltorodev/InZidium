"use client"

import { useState } from "react"
import { Phone, MapPin } from "lucide-react"
import { SectionHeader } from "@/components/section-header"
import { PageSection } from "@/components/ui/page-section"
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon"
import { BackgroundGradients } from "@/components/ui/background-gradients"
import { useViewportActive } from "@/lib/hooks/use-viewport-active"
import { cn } from "@/lib/utils"

export function ContactSection() {
  const contactRef1 = useViewportActive<HTMLAnchorElement>();
  const contactRef2 = useViewportActive<HTMLDivElement>();

  return (
    <PageSection id="contacto" className="relative overflow-hidden" withBackground={false}>
      <BackgroundGradients />
      <div className="relative">
        <div className="text-center mb-16 sm:mb-24 animate-on-mount" data-animation="fade-down">
          <SectionHeader
            titleLeft="¿Quieres"
            titleHighlight="Resultados?"
            subtitle="Escríbenos directamente para empezar a construir tu visión y llevar tu negocio al siguiente nivel."
            className="text-foreground"
          />
        </div>

        <div className="mb-20 sm:mb-32 animate-on-mount" data-animation="fade-up" style={{ animationDelay: "0.2s" }}>
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* WhatsApp Card - Priority on mobile, center on desktop */}
            <a
              href="https://wa.me/573143855079"
              target="_blank"
              rel="noopener noreferrer"
              ref={contactRef1.elementRef}
              className={cn(
                "glass-panel glass-card p-8 sm:p-10 rounded-3xl group border border-white/10 will-change-transform translate-z-0 backface-hidden order-first md:order-none",
                contactRef1.isActive && "viewport-active"
              )}
              style={{
                "--active-border": "rgba(34,211,238,0.5)",
                "--active-glow": "rgba(34,211,238,0.2)",
                "--neon-glow": "rgba(34,211,238,0.15)"
              } as React.CSSProperties}
            >
              <div className="text-4xl mb-6 bg-white/10 w-16 h-16 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/5 shadow-inner">
                <WhatsAppIcon className="h-8 w-8 text-white md:group-hover:text-neon-cyan transition-colors duration-200" />
              </div>
              <h3 className="text-2xl font-orbitron mb-4 text-white md:group-hover:text-neon-cyan transition-colors duration-200">WhatsApp</h3>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                Respuesta inmediata para tus consultas y proyectos.
              </p>
              <span className="text-neon-cyan font-medium">Chat directo →</span>
            </a>

            {/* Location Card */}
            <div
              ref={contactRef2.elementRef}
              className={cn(
                "glass-panel glass-card p-8 sm:p-10 rounded-3xl group border border-white/10 will-change-transform translate-z-0 backface-hidden",
                contactRef2.isActive && "viewport-active"
              )}
              style={{
                "--active-border": "rgba(34,211,238,0.5)",
                "--active-glow": "rgba(34,211,238,0.2)",
                "--neon-glow": "rgba(34,211,238,0.15)"
              } as React.CSSProperties}
            >
              <div className="text-4xl mb-6 bg-white/10 w-16 h-16 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/5 shadow-inner">
                <MapPin className="h-8 w-8 text-white md:group-hover:text-neon-cyan transition-colors duration-200" />
              </div>
              <h3 className="text-2xl font-orbitron mb-4 text-white md:group-hover:text-neon-cyan transition-colors duration-200">Ubicación</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Bogotá, Colombia.<br />
                <span className="text-white/60">Servicio global para proyectos de alto impacto.</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageSection>
  )
}
