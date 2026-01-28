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

  const scrollToSection = useCallback((id: string) => {
    scrollToId(id)
    setIsMobileMenuOpen(false)
  }, [])

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    const handleLogoHover = (e: any) => setIsLogoHovered(e.detail)

    // Combined scroll and custom events
    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("logoHover", handleLogoHover as EventListener)

    // Body scroll lock logic integrated
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : ''

    // Initial check
    handleScroll()

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("logoHover", handleLogoHover as EventListener)
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  // Click outside logic simplified
  useEffect(() => {
    if (!isMobileMenuOpen) return
    const handleClick = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('header')) setIsMobileMenuOpen(false)
    }
    const timer = setTimeout(() => document.addEventListener('click', handleClick), 100)
    return () => {
      clearTimeout(timer)
      document.removeEventListener('click', handleClick)
    }
  }, [isMobileMenuOpen])

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-500 ease-in-out ${isScrolled || isMobileMenuOpen ? "glass-panel bg-[#030014]/90 backdrop-blur-md md:backdrop-blur-[40px] shadow-2xl" : "bg-transparent"
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
          className="relative transition-transform duration-300 hover:scale-105 z-20 group flex items-center select-none"
          aria-label="Ir al inicio"
        >
          {/* Logo image for mobile, text for desktop (or keep both consistent with user request) */}
          <div className="md:hidden">
            <Image
              src="/logo.webp"
              alt="InZidium"
              width={40}
              height={40}
              className="h-10 w-auto object-contain"
              priority
            />
          </div>
          <span className="hidden md:block font-orbitron font-medium tracking-[0.3em] text-[18px] text-white/90 transition-all duration-200 md:group-hover:text-transparent md:group-hover:bg-clip-text md:group-hover:bg-gradient-to-r md:group-hover:from-cyan-400 md:group-hover:via-purple-500 md:group-hover:to-cyan-400 md:group-hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.4)] energy-flow-css bg-[length:200%_auto]">
            InZidium
          </span>
        </button>

        {/* Mobile-only Centered CTA */}
        <div className="md:hidden absolute left-1/2 -translate-x-1/2 z-10">
          <button
            onClick={() => scrollToSection("contacto")}
            className="px-5 py-2.5 rounded-full font-orbitron font-bold tracking-[0.1em] text-[9px] text-white border border-cyan-500/50 bg-cyan-500/10 shadow-[0_0_15px_rgba(34,211,238,0.2)] uppercase active:scale-95 whitespace-nowrap"
          >
            Trabajemos Juntos
          </button>
        </div>

        <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="text-[11px] font-medium text-white/50 md:hover:text-white transition-all duration-200 relative group px-2 py-1 uppercase tracking-[0.2em] font-orbitron md:hover:scale-110 active:scale-95"
            >
              <span className="relative z-10">{item.label}</span>
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white transition-all duration-200 md:group-hover:w-full" />
              <span className="absolute inset-0 bg-white/0 md:group-hover:bg-white/5 blur-md rounded-lg transition-all duration-200 -z-10" />
            </button>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={() => scrollToSection("contacto")}
            className="px-8 py-3 rounded-full font-orbitron font-bold tracking-[0.2em] text-[11px] text-white border border-cyan-500/50 bg-cyan-500/10 shadow-[0_0_20px_rgba(34,211,238,0.2)] uppercase transition-all duration-200 md:hover:bg-cyan-500/20 md:hover:scale-105 active:scale-95"
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
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="fixed top-20 sm:top-24 left-0 right-0 z-40 md:hidden overflow-hidden border-b border-white/10 bg-[#030014]/98 backdrop-blur-[100px]"
          >
            {/* Background Decorative Blurs */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[80px] rounded-full" />
              <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[80px] rounded-full" />
            </div>

            <div className="container mx-auto px-6 py-10 flex flex-col items-center relative z-10">
              {NAV_ITEMS.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08, duration: 0.4 }}
                  className="w-full flex flex-col items-center"
                >
                  <button
                    onClick={() => scrollToSection(item.id)}
                    className="group w-full py-7 flex items-center justify-center text-center text-[13px] font-orbitron font-medium tracking-[0.4em] text-white/50 hover:text-white transition-all duration-300 active:scale-[0.98]"
                  >
                    <span className="relative">
                      {item.label}
                      <motion.span
                        className="absolute bottom-[-8px] left-1/2 -translate-x-1/2 w-0 h-[2px] bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full"
                        whileHover={{ width: "100%" }}
                        transition={{ duration: 0.3 }}
                      />
                    </span>
                  </button>

                  {index < NAV_ITEMS.length - 1 && (
                    <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  )}
                </motion.div>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
