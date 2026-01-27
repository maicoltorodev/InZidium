"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import { ArrowDown } from "lucide-react"
import { scrollToId } from "@/lib/utils"
import { useMounted } from "@/lib/hooks/use-mounted"

export function Hero() {
  const containerRef = useMounted<HTMLDivElement>()
  const glitchContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Dynamic will-change optimization for glitch effect
    if (!glitchContainerRef.current) return

    const glitchContainer = glitchContainerRef.current

    // Use Intersection Observer to manage will-change
    // Always enable when element is visible (even slightly) to ensure animations work
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Element is visible - enable will-change for GPU optimization
            glitchContainer.classList.add("glitch-active")
          } else {
            // Element not visible - disable will-change to save memory
            glitchContainer.classList.remove("glitch-active")
          }
        })
      },
      {
        threshold: [0, 0.1, 1],
        rootMargin: "100px",
      }
    )

    observer.observe(glitchContainer)

    // Initial check - if element is already visible, activate immediately
    // Also check immediately on mount
    const checkVisibility = () => {
      const rect = glitchContainer.getBoundingClientRect()
      const isVisible = rect.top < window.innerHeight + 100 && rect.bottom > -100
      if (isVisible) {
        glitchContainer.classList.add("glitch-active")
      }
    }

    checkVisibility()

    // Also check after a short delay to ensure it's activated
    setTimeout(checkVisibility, 100)

    // Cleanup
    return () => {
      observer.disconnect()
      glitchContainer.classList.remove("glitch-active")
    }
  }, [])

  return (
    <section id="inicio" className="relative w-full min-h-screen overflow-hidden hero-lightning scroll-mt-20 sm:scroll-mt-24">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/8" />
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-background/40 via-background/20 to-transparent pointer-events-none z-0" />

      {/* Lightning effect that travels through hero */}
      <div className="lightning-bolt" aria-hidden="true" />

      <div ref={containerRef} className="relative z-10 container mx-auto px-4 sm:px-6 pt-28 sm:pt-32 pb-20 sm:pb-32" style={{ position: 'relative', zIndex: 10 }}>
        <div className="max-w-4xl mx-auto text-center">
          <p className="sr-only">
            InZidium ofrece servicios de diseño web, desarrollo web, aplicaciones móviles y automatizaciones para negocios en Bogotá, Colombia. Especializados en crear páginas web profesionales que generan resultados reales, aumento de ventas y crecimiento de negocios.
          </p>
          <div className="mb-8 sm:mb-12 animate-on-mount" data-animation="fade-up" style={{ animationDelay: "0.2s" }}>
            <div ref={glitchContainerRef} className="logo-glitch-container mx-auto h-36 sm:h-48 md:h-64 lg:h-72 w-auto inline-flex items-center justify-center">
              <Image
                src="/logo.webp"
                alt="Logo InZidium - Resultados impulsados por tecnología"
                width={864}
                height={288}
                className="h-full w-auto object-contain relative z-10"
                sizes="(max-width: 640px) 432px, (max-width: 768px) 576px, (max-width: 1024px) 768px, 864px"
                priority
                quality={90}
              />
            </div>
          </div>

          <h1 className="sr-only">Resultados impulsados por tecnología</h1>
          <h2
            className="text-glitch-title text-xl sm:text-2xl md:text-3xl font-medium mb-8 sm:mb-12 leading-relaxed max-w-2xl mx-auto text-foreground animate-on-mount"
            data-animation="fade-up"
            style={{ animationDelay: "0.4s" }}
          >
            ¿Buscas una web que <span className="font-semibold">realmente genere clientes</span>?
          </h2>

          <button
            onClick={() => scrollToId("sobre-mi")}
            className="flex flex-col items-center gap-2 text-foreground/50 hover:text-primary transition-colors duration-300 mx-auto animate-on-mount"
            data-animation="fade-up"
            style={{ animationDelay: "1s" }}
            aria-label="Scroll down"
          >
            <span className="text-sm font-medium">Explorar más</span>
            <ArrowDown className="h-5 w-5 animate-bounce" />
          </button>
        </div>
      </div>
    </section>
  )
}
