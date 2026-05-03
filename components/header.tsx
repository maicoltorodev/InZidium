"use client"

import { useState, useEffect, useCallback } from "react"
import { Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { scrollToId } from "@/lib/utils"

type NavItem = {
  id: string
  label: string
  highlight: boolean
  href?: string
}

const NAV_ITEMS: readonly NavItem[] = [
  { id: "sobre-mi",         label: "Nosotros",  highlight: false },
  { id: "otras-soluciones", label: "Servicios", highlight: false },
  { id: "portal",          label: "Portal",   highlight: false },
  { id: "bot-ia",          label: "Bot IA",    highlight: false },
  { id: "blog",           label: "Blog",     highlight: false },
  { id: "alianzas",        label: "Alianzas", highlight: false },
]

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLogoHovered, setIsLogoHovered] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, item: { id: string; href?: string }) => {
    // Si es link a pagina completa, dejamos al navegador navegar normal
    if (item.href) {
      setIsMobileMenuOpen(false)
      return
    }

    e.preventDefault()
    setIsMobileMenuOpen(false)

    // Si no estamos en la página de inicio, navegamos a la de inicio con el hash
    if (pathname !== "/") {
      router.push(`/#${item.id}`)
      return
    }

    // Small timeout to allow state updates and potential body unlock to process
    setTimeout(() => {
      scrollToId(item.id)
    }, 10)
  }
  useEffect(() => {
    const handleLogoHover = (e: any) => setIsLogoHovered(e.detail)

    window.addEventListener("logoHover", handleLogoHover as EventListener)

    // Body scroll lock logic integrated
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : ''

    return () => {
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
      className="fixed top-0 z-50 w-full glass-panel bg-background/90 backdrop-blur-md md:backdrop-blur-[40px] shadow-2xl"
    >
      <div
        className={`absolute bottom-0 left-0 w-full overflow-hidden opacity-90 transition-all duration-500 pointer-events-none ${isLogoHovered ? "h-[4px]" : "h-[2px]"}`}
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
        <a
          href={pathname === "/" ? "#inicio" : "/#inicio"}
          onClick={(e) => handleNavClick(e, { id: "inicio" })}
          className="relative transition-transform duration-300 hover:scale-105 z-20 group flex items-center select-none cursor-pointer"
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
              sizes="40px"
              priority
            />
          </div>
          <span className="hidden md:block font-orbitron font-medium tracking-[0.3em] text-[18px] bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-500 to-cyan-400 transition-all duration-200 drop-shadow-[0_0_8px_rgba(34,211,238,0.4)] energy-flow-css bg-[length:200%_auto]">
            InZidium
          </span>
        </a>

        {/* Mobile-only Centered CTA */}
        <div className="md:hidden absolute left-1/2 -translate-x-1/2 z-10">
          <a
            href={pathname === "/" ? "#contacto" : "/#contacto"}
            onClick={(e) => handleNavClick(e, { id: "contacto" })}
            className="inline-block px-5 py-2.5 rounded-full font-orbitron font-bold tracking-[0.1em] text-[9px] text-white border border-cyan-500/50 bg-cyan-500/10 shadow-[0_0_15px_rgba(34,211,238,0.2)] uppercase active:scale-95 whitespace-nowrap cursor-pointer"
          >
            Trabajemos Juntos
          </a>
        </div>

        <nav className="hidden md:flex items-center gap-6 xl:gap-8 absolute left-1/2 -translate-x-1/2">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={item.href ?? (pathname === "/" ? `#${item.id}` : `/#${item.id}`)}
              onClick={(e) => handleNavClick(e, item)}
              className="text-[10px] xl:text-[11px] font-medium transition-all duration-200 relative group px-2 py-1 uppercase tracking-[0.15em] font-orbitron md:hover:scale-110 active:scale-95 cursor-pointer text-white/50 md:hover:text-white whitespace-nowrap"
            >
              <span className="relative z-10">{item.label}</span>
              <span className="absolute bottom-0 left-0 w-0 h-[1px] transition-all duration-200 md:group-hover:w-full bg-white" />
              <span className="absolute inset-0 blur-md rounded-lg transition-all duration-200 -z-10 bg-white/0 md:group-hover:bg-white/5" />
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <a
            href={pathname === "/" ? "#contacto" : "/#contacto"}
            onClick={(e) => handleNavClick(e, { id: "contacto" })}
            className="px-8 py-3 rounded-full font-orbitron font-bold tracking-[0.2em] text-[11px] text-white border border-cyan-500/50 bg-cyan-500/10 shadow-[0_0_20px_rgba(34,211,238,0.2)] uppercase transition-all duration-200 md:hover:bg-cyan-500/20 md:hover:scale-105 active:scale-95 cursor-pointer"
          >
            Trabajemos Juntos
          </a>
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
            className="absolute top-full left-0 right-0 z-[100] md:hidden overflow-hidden border-b border-white/10 bg-background/98 backdrop-blur-xl"
          >
            {/* Minimal Background Decoration for mobile performance */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
              <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[40px] rounded-full" />
              <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[40px] rounded-full" />
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
                  <a
                    href={item.href ?? (pathname === "/" ? `#${item.id}` : `/#${item.id}`)}
                    onClick={(e) => handleNavClick(e, item)}
                    className="group w-full py-7 flex items-center justify-center text-center text-[13px] font-orbitron font-medium tracking-[0.3em] transition-all duration-300 active:scale-[0.98] cursor-pointer relative z-[101] text-white/50 hover:text-white whitespace-nowrap"
                  >
                    <span className="relative">
                      {item.label}
                      <motion.span
                        className="absolute bottom-[-8px] left-1/2 -translate-x-1/2 w-0 h-[2px] bg-white rounded-full"
                        whileHover={{ width: "100%" }}
                        transition={{ duration: 0.3 }}
                      />
                    </span>
                  </a>

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
