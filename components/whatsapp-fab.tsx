"use client"

import { useEffect, useState } from "react"
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon"

export function WhatsAppFAB() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Buscar la sección hero por ID
    const heroSection = document.getElementById("inicio")
    if (!heroSection) {
      // Si no existe el hero, mostrar el FAB
      setIsVisible(true)
      return
    }

    // Intersection Observer para detectar cuando el hero sale del viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Si el hero NO está intersectando (está fuera del viewport), mostrar FAB
          setIsVisible(!entry.isIntersecting)
        })
      },
      {
        // Trigger cuando el hero sale completamente o parcialmente del viewport
        threshold: 0,
        rootMargin: "-20% 0px 0px 0px", // Empezar a mostrar cuando el hero está 20% fuera
      }
    )

    observer.observe(heroSection)

    // Cleanup
    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <a
      href="https://wa.me/573143855079"
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed bottom-6 right-6 z-50 group whatsapp-fab transition-all duration-500 ${
        isVisible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-4 pointer-events-none"
      }`}
      aria-label="Contactar por WhatsApp"
    >
      <div className="relative bg-gradient-to-br from-primary to-accent p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-primary/50">
        <WhatsAppIcon className="h-7 w-7 text-primary-foreground" />
      </div>
      <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap hidden md:block">
        <div className="px-4 py-2 rounded-lg border border-primary/30 shadow-lg bg-background/95">
          <p className="text-sm font-medium text-foreground">¡Escríbenos!</p>
        </div>
      </div>
    </a>
  )
}
