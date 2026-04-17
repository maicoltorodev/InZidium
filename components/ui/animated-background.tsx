"use client"

import { motion, useReducedMotion } from "framer-motion"

export function AnimatedBackground() {
  const reduced = useReducedMotion()

  return (
    <div className="fixed inset-0 -z-10 bg-[#060214] pointer-events-none overflow-hidden">

      {/* Glow 1: Magenta — top-left */}
      <motion.div
        aria-hidden
        className="absolute -top-[15%] -left-[12%] h-[600px] w-[600px] rounded-full bg-[#e879f9] blur-[160px] will-change-transform backface-hidden"
        initial={{ x: 0, y: 0, opacity: 0.14 }}
        animate={reduced ? { opacity: 0.14 } : {
          x:       [0,   180,  -100,   60,   0],
          y:       [0,  -130,   100,  -50,   0],
          opacity: [0.14, 0.20,  0.10, 0.17, 0.14],
        }}
        transition={reduced ? undefined : {
          duration: 26,
          repeat: Infinity,
          ease: "easeInOut",
          times: [0, 0.25, 0.5, 0.75, 1],
        }}
      />

      {/* Glow 2: Blue — right */}
      <motion.div
        aria-hidden
        className="absolute top-[30%] -right-[14%] h-[700px] w-[700px] rounded-full bg-[#60a5fa] blur-[180px] will-change-transform backface-hidden"
        initial={{ x: 0, y: 0, opacity: 0.12 }}
        animate={reduced ? { opacity: 0.12 } : {
          x:       [0,  -200,   140,  -70,   0],
          y:       [0,   160,  -110,   50,   0],
          opacity: [0.12, 0.18,  0.08, 0.15, 0.12],
        }}
        transition={reduced ? undefined : {
          duration: 32,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4,
          times: [0, 0.25, 0.5, 0.75, 1],
        }}
      />

      {/* Glow 3: Purple — bottom */}
      <motion.div
        aria-hidden
        className="absolute -bottom-[12%] left-[20%] h-[560px] w-[560px] rounded-full bg-[#a855f7] blur-[160px] will-change-transform backface-hidden"
        initial={{ x: 0, y: 0, opacity: 0.11 }}
        animate={reduced ? { opacity: 0.11 } : {
          x:       [0,   150,  -200,  100,   0],
          y:       [0,  -100,   130,  -65,   0],
          opacity: [0.11, 0.17,  0.07, 0.14, 0.11],
        }}
        transition={reduced ? undefined : {
          duration: 29,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 8,
          times: [0, 0.25, 0.5, 0.75, 1],
        }}
      />

    </div>
  )
}
