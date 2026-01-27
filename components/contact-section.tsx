"use client"

import { useRef } from "react"
import { Mail, Phone, MapPin } from "lucide-react"
import { SectionHeader } from "@/components/section-header"
import { PageSection } from "@/components/ui/page-section"
import { useMounted } from "@/lib/hooks/use-mounted"
import { useViewportHover } from "@/lib/hooks/use-viewport-hover"
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon"

export function ContactSection() {
  const containerRef = useMounted<HTMLDivElement>()
  const cardRefs = useRef<(HTMLElement | null)[]>([])
  const activeCardIndex = useViewportHover(cardRefs)

  return (
    <PageSection id="contacto" className="bg-card/50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute left-0 top-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute right-0 bottom-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div ref={containerRef} className="relative z-10">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16 sm:mb-20 lg:mb-24 animate-on-mount" data-animation="fade-down">
            <SectionHeader titleLeft="Trabajemos" titleHighlight="Juntos" subtitle="¿Listo para hacer crecer tu negocio?" />
          </div>

          <div className="max-w-5xl mx-auto">
            {/* Main CTA - WhatsApp prominently */}
            <div className="mb-12 sm:mb-16 animate-on-mount" data-animation="fade-up" style={{ animationDelay: "0.2s" }}>
              <a
                ref={(el) => { cardRefs.current[3] = el }}
                href="https://wa.me/573143855079"
                target="_blank"
                rel="noopener noreferrer"
                className="group block relative"
              >
                <div className={`relative bg-gradient-to-br from-card via-card to-card/80 border-2 border-primary/30 rounded-2xl p-8 sm:p-12 lg:p-16 transition-all duration-300 hover:border-primary/60 hover:shadow-2xl hover:shadow-primary/20 hover:scale-[1.01] overflow-hidden ${activeCardIndex === 3 ? "viewport-active" : ""}`}>
                  {/* Animated background gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Content */}
                  <div className="relative flex flex-col sm:flex-row items-center gap-6 sm:gap-8 text-center sm:text-left">
                    <div className="shrink-0">
                      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border-2 border-primary/40 transition-all duration-300 group-hover:scale-110 group-hover:border-primary/60 group-hover:shadow-lg group-hover:shadow-primary/30">
                        <WhatsAppIcon className="h-12 w-12 sm:h-16 sm:w-16 text-primary" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                        Empecemos ahora
                      </h3>
                      <p className="text-base sm:text-lg text-muted-foreground/80 mb-4">
                        Escríbenos por WhatsApp y recibirás respuesta inmediata
                      </p>
                      <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 justify-center sm:justify-start">
                        <span className="text-lg sm:text-xl font-semibold text-primary">+57 314 385 5079</span>
                        <span className="hidden sm:inline text-muted-foreground/50">•</span>
                        <span className="text-sm text-muted-foreground/70">Respuesta rápida garantizada</span>
                      </div>
                    </div>
                    <div className="shrink-0">
                      <div className="px-6 py-3 rounded-lg bg-primary/10 border border-primary/30 text-primary font-semibold transition-all duration-300 group-hover:bg-primary/20 group-hover:border-primary/50">
                        Contactar →
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            </div>

            {/* Secondary contact methods */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-on-mount" data-animation="fade-up" style={{ animationDelay: "0.4s" }}>
              {/* Email */}
              <a
                ref={(el) => { cardRefs.current[0] = el }}
                href="mailto:maicoltorodev@gmail.com"
                className={`group border border-primary/20 bg-card/80 rounded-xl p-6 hover:border-primary/40 hover:bg-card/95 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/10 ${activeCardIndex === 0 ? "viewport-active" : ""}`}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 mb-4 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/20 group-hover:border-primary/40">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    Email
                  </h4>
                  <p className="text-sm text-muted-foreground/70 break-all">maicoltorodev@gmail.com</p>
                </div>
              </a>

              {/* Phone */}
              <a
                ref={(el) => { cardRefs.current[1] = el }}
                href="tel:+573143855079"
                className={`group border border-primary/20 bg-card/80 rounded-xl p-6 hover:border-primary/40 hover:bg-card/95 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/10 ${activeCardIndex === 1 ? "viewport-active" : ""}`}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 mb-4 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/20 group-hover:border-primary/40">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    Teléfono
                  </h4>
                  <p className="text-sm text-muted-foreground/70">+57 314 385 5079</p>
                </div>
              </a>

              {/* Location */}
              <address 
                ref={(el) => { cardRefs.current[2] = el }}
                className={`group border border-primary/20 bg-card/80 rounded-xl p-6 hover:border-primary/40 hover:bg-card/95 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/10 cursor-default not-italic ${activeCardIndex === 2 ? "viewport-active" : ""}`}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 mb-4 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/20 group-hover:border-primary/40">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">Ubicación</h4>
                  <p className="text-sm text-muted-foreground/70">Bogotá, Colombia</p>
                </div>
              </address>
            </div>
          </div>
        </div>
      </div>
    </PageSection>
  )
}
