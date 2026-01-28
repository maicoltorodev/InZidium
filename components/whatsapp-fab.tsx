"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon"

export function WhatsAppFAB() {
  const [isVisible, setIsVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)

    const heroSection = document.getElementById("inicio")
    if (!heroSection) {
      setIsVisible(true)
      return () => window.removeEventListener('resize', checkMobile)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(!entry.isIntersecting)
        })
      },
      { threshold: 0, rootMargin: "-20% 0px 0px 0px" }
    )

    observer.observe(heroSection)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.a
          initial={{ opacity: 0, scale: 0.5, y: 50 }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
              type: "spring",
              damping: 15,
              stiffness: 100
            }
          }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          href="https://wa.me/573143855079"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-8 right-8 z-50 group"
          aria-label="Contactar por WhatsApp"
        >
          {/* Cosmic Glow Base */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#a855f7] via-transparent to-[#22d3ee] opacity-30 blur-3xl group-hover:opacity-60 transition-opacity duration-700 animate-pulse hide-on-mobile" />

          {/* Floating Physics Layer */}
          <motion.div
            animate={{
              y: [0, -12, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="relative will-change-transform"
          >
            {/* The Main Holographic Body */}
            <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full flex items-center justify-center relative overflow-hidden border border-white/20 bg-white/[0.03] backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] group-hover:border-white/50 transition-colors duration-500 will-change-transform">

              {/* Internal Liquid Gradient - Disabled on mobile for performance */}
              {!isMobile && (
                <motion.div
                  animate={{
                    rotate: [0, 360],
                    scale: [1, 1.3, 1],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute inset-[-60%] bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.3)_0%,transparent_50%),radial-gradient(circle_at_center,rgba(34,211,238,0.3)_0%,transparent_70%)] opacity-40 blur-2xl mix-blend-screen group-hover:opacity-60"
                />
              )}

              {/* High-Frequency Outer Glow Ring */}
              <div className="absolute inset-0 rounded-full border border-white/10 opacity-50 group-hover:opacity-100">
                <div className="absolute inset-[-2px] rounded-full bg-gradient-to-r from-transparent via-white/40 to-transparent rotate-45 group-hover:animate-[spin_1.5s_linear_infinite] opacity-0 group-hover:opacity-100" />
              </div>

              {/* The Icon */}
              <WhatsAppIcon className="h-8 w-8 sm:h-10 sm:w-10 text-white/90 relative z-10 transition-all duration-500 group-hover:scale-110 group-hover:drop-shadow-[0_0_15px_rgba(255,255,255,1)]" />

              {/* Scanner Shimmer Line */}
              <div className="absolute top-0 left-[-100%] h-full w-[200%] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-25deg] group-hover:animate-[shine_2s_infinite_linear]" />
            </div>

            {/* Tech Tooltip */}
            <div className="absolute right-full mr-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 translate-x-10 group-hover:translate-x-0 transition-all duration-500 pointer-events-none hidden md:block">
              <div className="relative overflow-hidden px-8 py-3 rounded-2xl border-l-[3px] border-neon-cyan bg-[#030014]/70 backdrop-blur-3xl shadow-2xl">
                <p className="text-[11px] font-orbitron font-bold tracking-[0.6em] text-white uppercase flex items-center gap-5">
                  <span className="flex h-2.5 w-2.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-cyan opacity-80"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-neon-cyan shadow-[0_0_10px_#22d3ee]"></span>
                  </span>
                  ONLINE
                </p>
                {/* Subtle glitch bg for tooltip */}
                <div className="absolute inset-0 bg-gradient-to-r from-neon-purple/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </motion.div>
        </motion.a>
      )}
    </AnimatePresence>
  )
}
