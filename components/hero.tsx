"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ArrowDown } from "lucide-react"
import { motion } from "framer-motion"
import { scrollToId } from "@/lib/utils"

export function Hero() {
  const [isHovered, setIsHovered] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Notify other components (like Header) about the hover state
  useEffect(() => {
    const event = new CustomEvent('logoHover', { detail: isHovered });
    window.dispatchEvent(event);
  }, [isHovered]);

  // Mobile detection for performance
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <section id="inicio" className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden">

      {/* Background Gradient - Performance Optimized */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-neon-purple/20 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-neon-cyan/20 rounded-full blur-[120px] -z-10 pointer-events-none" />

      <div className="relative z-10 container mx-auto px-4 pt-16 sm:pt-32 flex flex-col items-center justify-center">

        {/* Logo Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.8,
            ease: [0, 0.71, 0.2, 1.01],
            scale: {
              type: "spring",
              damping: 10,
              stiffness: 100,
              restDelta: 0.001
            }
          }}
          className="relative mb-8 sm:mb-12"
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
        >
          {/* Holographic Clones (Sci-Fi Effect) - Disabled on mobile for performance */}
          {!isMobile && [1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="absolute inset-0 z-0 pointer-events-none opacity-0 will-change-transform"
              animate={isHovered ? {
                opacity: [0, 0.4, 0],
                scale: [1, 1.2 + (i * 0.1), 0.8],
                x: [0, (i % 2 === 0 ? 30 : -30) * i, 0],
                y: [0, (i % 2 === 0 ? -20 : 20) * i, 0],
                filter: [
                  "blur(0px) brightness(1)",
                  i % 2 === 0 ? "blur(4px) hue-rotate(90deg) brightness(2)" : "blur(4px) hue-rotate(-90deg) brightness(2)",
                  "blur(10px) brightness(0)"
                ]
              } : { opacity: 0 }}
              transition={{
                duration: 1.2,
                delay: i * 0.1,
                ease: "easeOut"
              }}
            >
              <Image
                src="/logo.png"
                alt=""
                width={200}
                height={400}
                className="h-48 sm:h-64 md:h-80 w-auto object-contain"
              />
            </motion.div>
          ))}

          <motion.div
            animate={{
              y: [0, -15, 0], // Floating effect
              scale: isHovered ? 0.9 : 1, // Shrink on hover per user request
            }}
            transition={{
              y: {
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              },
              scale: { duration: 0.2 }
            }}
            style={{
              filter: isHovered
                ? "drop-shadow(0 0 25px rgba(34,211,238,0.6))"
                : "drop-shadow(0 0 15px rgba(168,85,247,0.4))",
              WebkitMaskImage: "url('/logo.png')",
              WebkitMaskSize: "contain",
              WebkitMaskRepeat: "no-repeat",
              WebkitMaskPosition: "center",
              maskImage: "url('/logo.png')",
              maskSize: "contain",
              maskRepeat: "no-repeat",
              maskPosition: "center",
            }}
            whileHover={{
              scale: 0.9,
              transition: { duration: 0.3 }
            }}
            whileTap={{ scale: 0.85 }}
            className="cursor-pointer relative shine-container group z-10 will-change-transform"
          >
            {/* Base Image */}
            <Image
              src="/logo.png"
              alt="InZidium Logo"
              width={200}
              height={400}
              className="h-48 sm:h-64 md:h-80 w-auto object-contain relative z-10"
              priority
              quality={isMobile ? 80 : 100}
            />
          </motion.div>
        </motion.div>

        {/* Text Branding */}
        <div className="text-center space-y-4 will-change-transform">
          <motion.h1
            animate={{
              scale: isHovered ? 1.05 : 1,
              filter: isHovered
                ? "drop-shadow(0 0 20px rgba(34,211,238,0.4)) drop-shadow(0 0 40px rgba(168,85,247,0.2))"
                : "drop-shadow(0 0 0px rgba(255,255,255,0))"
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="font-orbitron text-5xl sm:text-7xl md:text-8xl font-medium tracking-[0.2em] sm:tracking-[0.3em] text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 pb-2"
          >
            InZidium
          </motion.h1>
          <motion.p
            animate={{
              opacity: isHovered ? 1 : 0.8,
              scale: isHovered ? 1.05 : 1,
              color: isHovered ? "#ffffff" : "var(--muted-foreground)",
              textShadow: isHovered ? "0 0 10px rgba(34,211,238,0.5)" : "none"
            }}
            className="text-sm sm:text-base tracking-widest will-change-[opacity,transform,color]"
          >
            Resultados impulsados por calidad y tecnología
          </motion.p>
        </div>

        {/* Scroll Indicator */}
        <div className="mt-16 sm:mt-24 animate-bounce">
          <button
            onClick={() => scrollToId("sobre-mi")}
            className="p-2 opacity-60 hover:opacity-100 transition-opacity"
            aria-label="Scroll down"
          >
            <ArrowDown className="h-6 w-6 text-white" />
          </button>
        </div>

      </div>
    </section>
  )
}
