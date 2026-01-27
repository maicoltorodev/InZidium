"use client"

import { useState, useEffect, useCallback } from "react"
import { Menu, X } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { scrollToId } from "@/lib/utils"

const NAV_ITEMS = [
  { id: "sobre-mi", label: "Nosotros" },
  { id: "servicios", label: "Proyectos" },
  { id: "otras-soluciones", label: "Soluciones" },
  { id: "valores", label: "Valores" },
  { id: "contacto", label: "Trabajemos" },
] as const

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    let lastScrollY = window.scrollY
    let ticking = false

    const updateScroll = () => {
      // 5% de la altura de la ventana
      const scrollThreshold = window.innerHeight * 0.05

      setIsScrolled(lastScrollY > 20)
      setIsVisible(lastScrollY > scrollThreshold)

      ticking = false
    }

    const onScroll = () => {
      lastScrollY = window.scrollY
      if (!ticking) {
        requestAnimationFrame(updateScroll)
        ticking = true
      }
    }

    // Verificar estado inicial
    updateScroll()

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const scrollToSection = useCallback((id: string) => {
    scrollToId(id)
    setIsMobileMenuOpen(false)
  }, [])

  // Prevenir scroll cuando el menú está abierto (optimizado)
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  // Cerrar menú al hacer click fuera (optimizado)
  useEffect(() => {
    if (!isMobileMenuOpen) return

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('header')) {
        setIsMobileMenuOpen(false)
      }
    }

    // Usar setTimeout para evitar conflictos con el click que abre el menú
    const timeoutId = setTimeout(() => {
      document.addEventListener('click', handleClickOutside)
    }, 100)

    return () => {
      clearTimeout(timeoutId)
      document.removeEventListener('click', handleClickOutside)
    }
  }, [isMobileMenuOpen])

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${isScrolled ? "border-b border-primary/30 shadow-lg shadow-primary/10 bg-background/95 md:bg-background/50 md:backdrop-blur-md" : "bg-transparent"
        } ${isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 -translate-y-full pointer-events-none"
        }`}
    >
      <div className="container mx-auto px-4 sm:px-6 h-20 sm:h-24 flex items-center justify-between relative">
        <button
          onClick={() => scrollToSection("inicio")}
          className="relative transition-transform duration-300 hover:scale-105 z-10"
          aria-label="Ir al inicio"
        >
          <Image
            src="/logo.webp"
            alt="Logo InZidium - Diseño Web y Desarrollo"
            width={192}
            height={64}
            className="h-12 sm:h-16 w-auto object-contain"
            sizes="(max-width: 640px) 144px, 192px"
            priority
            quality={90}
          />
        </button>

        <div className="md:hidden absolute left-1/2 -translate-x-1/2 z-10">
          <Button onClick={() => scrollToSection("contacto")} size="sm" className="text-xs sm:text-sm">
            Contactar Ahora
          </Button>
        </div>

        <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="text-base font-medium text-foreground/80 hover:text-primary transition-colors duration-300 relative group px-2 py-1"
            >
              <span>{item.label}</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full rounded-full" />
            </button>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Button onClick={() => scrollToSection("contacto")}>Contactar Ahora</Button>
        </div>

        <button
          className="md:hidden p-2 relative z-20 transition-transform duration-300 hover:scale-110"
          onClick={(e) => {
            e.stopPropagation()
            setIsMobileMenuOpen(!isMobileMenuOpen)
          }}
          aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={isMobileMenuOpen}
        >
          <div className="relative w-6 h-6">
            <Menu
              className={`h-6 w-6 text-foreground absolute inset-0 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'
                }`}
            />
            <X
              className={`h-6 w-6 text-foreground absolute inset-0 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'
                }`}
            />
          </div>
        </button>
      </div>

      {/* Menú móvil con animación */}
      {isMobileMenuOpen && (
        <nav
          className={`fixed top-20 sm:top-24 left-0 right-0 z-40 md:hidden border-t border-primary/30 bg-gradient-to-b from-background/98 via-background/98 to-background/95 transform transition-transform duration-300 ease-out translate-y-0`}
        >
          <div className="container mx-auto px-4 py-6 flex flex-col">
            {NAV_ITEMS.map((item, index) => (
              <div key={item.id}>
                <button
                  onClick={() => scrollToSection(item.id)}
                  className={`w-full text-center py-4 px-5 text-base font-medium text-foreground/90 hover:text-primary transition-all duration-300 transform hover:scale-105 ${isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
                    }`}
                  style={{
                    transitionDelay: isMobileMenuOpen ? `${index * 50}ms` : '0ms'
                  }}
                >
                  {item.label}
                </button>
                {index < NAV_ITEMS.length - 1 && (
                  <div className={`h-px bg-gradient-to-r from-transparent via-border to-transparent transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'
                    }`} style={{
                      transitionDelay: isMobileMenuOpen ? `${index * 50 + 25}ms` : '0ms'
                    }} />
                )}
              </div>
            ))}
          </div>
        </nav>
      )}
    </header>
  )
}
