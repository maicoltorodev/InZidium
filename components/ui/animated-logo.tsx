"use client"

import { motion } from "framer-motion"

export function AnimatedLogo() {
    return (
        <div className="relative flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 group">
            {/* Outer Rotating Frame */}
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border border-white/5 rounded-lg opacity-40 group-hover:opacity-100 group-hover:border-neon-cyan/50 transition-all duration-500"
            />

            {/* Middle Spinning Hexagon-like ring */}
            <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                className="absolute inset-1 border-[1.5px] border-dashed border-white/10 rounded-full group-hover:border-neon-purple/40 group-hover:scale-110 transition-all duration-500"
            />

            {/* Core Shape - Geometric Morphing */}
            <div className="relative z-10 w-6 h-6 sm:w-7 sm:h-7 bg-white/[0.03] backdrop-blur-md rounded-md border border-white/20 flex items-center justify-center overflow-hidden transition-all duration-500 group-hover:scale-110 group-hover:bg-white/10 group-hover:border-white/40">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [45, 225, 45],
                        borderRadius: ["20%", "50%", "20%"]
                    }}
                    transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="w-3/4 h-3/4 bg-gradient-to-br from-cyan-400 to-purple-500 shadow-[0_0_15px_rgba(34,211,238,0.5)]"
                />

                {/* Inner Glint */}
                <div className="absolute top-0 left-[-100%] w-[200%] h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-20deg] animate-[shine_3s_infinite_linear]" />
            </div>

            {/* Background Energy Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/0 to-neon-purple/0 rounded-full blur-xl group-hover:from-neon-cyan/20 group-hover:to-neon-purple/20 transition-all duration-700" />
        </div>
    )
}
