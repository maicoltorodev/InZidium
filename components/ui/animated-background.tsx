"use client"

import { motion, useReducedMotion } from "framer-motion"

export function AnimatedBackground() {
  const reduced = useReducedMotion()

  return (
    <div
      className="fixed -z-10 bg-background pointer-events-none overflow-hidden"
      style={{ top: 0, left: 0, width: "100lvw", height: "100lvh" }}
    >

      {/* Glow 1: Magenta — top-left */}
      <motion.div
        aria-hidden
        className="absolute -top-[15%] -left-[12%] h-[600px] w-[600px] rounded-full bg-[#f044f9] blur-[160px] will-change-transform backface-hidden"
        initial={{ x: 0, y: 0, opacity: 0.25 }}
        animate={reduced ? { opacity: 0.25 } : {
          x:       [0,   180,  -100,   60,   0],
          y:       [0,  -130,   100,  -50,   0],
          opacity: [0.25, 0.35,  0.18, 0.30, 0.25],
        }}
        transition={reduced ? undefined : {
          duration: 26,
          repeat: Infinity,
          ease: "easeInOut",
          times: [0, 0.25, 0.5, 0.75, 1],
        }}
      />

      {/* Glow 2: Cyan — right */}
      <motion.div
        aria-hidden
        className="absolute top-[30%] -right-[14%] h-[700px] w-[700px] rounded-full bg-[#7ff9fe] blur-[180px] will-change-transform backface-hidden"
        initial={{ x: 0, y: 0, opacity: 0.22 }}
        animate={reduced ? { opacity: 0.22 } : {
          x:       [0,  -200,   140,  -70,   0],
          y:       [0,   160,  -110,   50,   0],
          opacity: [0.22, 0.32,  0.12, 0.27, 0.22],
        }}
        transition={reduced ? undefined : {
          duration: 32,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4,
          times: [0, 0.25, 0.5, 0.75, 1],
        }}
      />

    </div>
  )
}
