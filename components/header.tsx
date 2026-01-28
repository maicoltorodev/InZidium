"use client"

import { useState, useEffect, useCallback } from "react"
import { Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { scrollToId } from "@/lib/utils"

const NAV_ITEMS = [
  { id: "sobre-mi", label: "Nosotros" },
  { id: "servicios", label: "Proyectos" },
  { id: "otras-soluciones", label: "Soluciones" },
  { id: "valores", label: "Valores" },
] as const

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isLogoHovered, setIsLogoHovered] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    const handleLogoHover = (e: any) => {
      setIsLogoHovered(e.detail)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("logoHover", handleLogoHover as EventListener)
    handleScroll()
    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("logoHover", handleLogoHover as EventListener)
    }
  }, [])

  const scrollToSection = useCallback((id: string) => {
    scrollToId(id)
    setIsMobileMenuOpen(false)
    // Ensure navbar is visible after clicking (though scroll will trigger it)
  }, [])

  // Prevenir scroll cuando el menú está abierto (optimizado)
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
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
      className={`fixed top-0 z-50 w-full transition-all duration-500 ease-in-out ${isScrolled || isMobileMenuOpen ? "glass-panel bg-[#030014]/90 backdrop-blur-[40px] shadow-2xl" : "bg-transparent"
        }`}
    >
      <div
        className={`absolute bottom-0 left-0 w-full overflow-hidden opacity-90 transition-all duration-500 ${isLogoHovered ? "h-[4px]" : "h-[2px]"}`}
      >
        <div
          className={`absolute inset-0 w-full h-full bg-[length:100%_100%] ${isLogoHovered ? "energy-flow-css-fast" : "energy-flow-css"}`}
          style={{
            backgroundImage: "linear-gradient(to right, #22d3ee, #a855f7, #22d3ee, #a855f7, #22d3ee)",
            backgroundSize: "200% 100%"
          }}
        />
        {/* Subtle Glow Overlay */}
        <div className={`absolute inset-0 pointer-events-none transition-all duration-500 ${isLogoHovered ? "shadow-[0_0_20px_rgba(34,211,238,0.8)]" : "shadow-[0_0_10px_rgba(34,211,238,0.4)]"}`} />
      </div>
      <div className="container mx-auto px-4 sm:px-6 h-20 sm:h-24 flex items-center justify-between relative">
        <button
          onClick={() => scrollToSection("inicio")}
          className="relative transition-transform duration-300 hover:scale-105 z-10 group"
          aria-label="Ir al inicio"
        >
          <span className="font-orbitron font-medium tracking-[0.3em] text-[14px] sm:text-[18px] text-white/90 transition-all duration-300 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-purple-500 group-hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]">
            InZidium
          </span>
        </button>

        <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="text-[11px] font-medium text-white/50 hover:text-white transition-all duration-300 relative group px-2 py-1 uppercase tracking-[0.2em] font-orbitron hover:scale-110 active:scale-95"
            >
              <span className="relative z-10">{item.label}</span>
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full" />
              <span className="absolute inset-0 bg-white/0 group-hover:bg-white/5 blur-md rounded-lg transition-all duration-300 -z-10" />
            </button>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={() => scrollToSection("contacto")}
            className="px-8 py-3 rounded-full font-orbitron font-bold tracking-[0.2em] text-[11px] text-white border border-cyan-500/50 bg-cyan-500/10 shadow-[0_0_20px_rgba(34,211,238,0.2)] uppercase transition-all duration-300 hover:bg-cyan-500/20 hover:scale-105 active:scale-95"
          >
            Trabajemos Juntos
          </button>
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
              className={`h-6 w-6 text-white absolute inset-0 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'
                }`}
            />
            <X
              className={`h-6 w-6 text-white absolute inset-0 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'
                }`}
            />
          </div>
        </button>
      </div>

      {/* Menú móvil con AnimatePresence */}
      <AnimatePresence mode="wait">
        {isMobileMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed top-20 sm:top-24 left-0 right-0 z-40 md:hidden border-t border-white/10 bg-[#030014]/95 backdrop-blur-[40px]"
          >
            <div className="container mx-auto px-4 py-10 flex flex-col items-center">
              {NAV_ITEMS.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="w-full text-center"
                >
                  <button
                    onClick={() => scrollToSection(item.id)}
                    className="w-full py-5 text-base font-orbitron font-medium tracking-[0.2em] text-white/70 hover:text-white transition-all duration-300 active:scale-95"
                  >
                    {item.label}
                  </button>
                  {index < NAV_ITEMS.length - 1 && (
                    <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mx-auto w-1/2" />
                  )}
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-10 w-full flex justify-center"
              >
                <button
                  onClick={() => scrollToSection("contacto")}
                  className="w-full max-w-[280px] py-4 rounded-full font-orbitron font-bold tracking-[0.2em] text-[12px] text-white border border-cyan-500/50 bg-cyan-500/10 shadow-[0_0_20px_rgba(34,211,238,0.2)] uppercase transition-all duration-300 active:scale-95"
                >
                  Trabajemos Juntos
                </button>
              </motion.div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
