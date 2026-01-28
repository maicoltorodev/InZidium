"use client"

import React, { useEffect, useState, useCallback } from "react"
import { motion, useSpring, useMotionValue } from "framer-motion"

export function CustomCursor() {
    const [isVisible, setIsVisible] = useState(false)
    const [isClickable, setIsClickable] = useState(false)

    // Motion values for smooth tracking
    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)

    // Lagged spring config for the ring and trail
    const ringConfig = { damping: 25, stiffness: 150 }
    const ringX = useSpring(mouseX, ringConfig)
    const ringY = useSpring(mouseY, ringConfig)

    const handleMouseMove = useCallback((e: MouseEvent) => {
        mouseX.set(e.clientX)
        mouseY.set(e.clientY)

        if (!isVisible) setIsVisible(true)

        const target = e.target as HTMLElement
        const isElementClickable =
            target.closest('a') ||
            target.closest('button') ||
            target.closest('[role="button"]') ||
            window.getComputedStyle(target).cursor === 'pointer'

        setIsClickable(!!isElementClickable)
    }, [mouseX, mouseY, isVisible])

    const handleMouseLeave = () => setIsVisible(false)
    const handleMouseEnter = () => setIsVisible(true)

    useEffect(() => {
        const isDesktop = window.matchMedia("(hover: hover) and (pointer: fine)").matches
        if (!isDesktop) return

        window.addEventListener("mousemove", handleMouseMove)
        document.addEventListener("mouseleave", handleMouseLeave)
        document.addEventListener("mouseenter", handleMouseEnter)

        return () => {
            window.removeEventListener("mousemove", handleMouseMove)
            document.removeEventListener("mouseleave", handleMouseLeave)
            document.removeEventListener("mouseenter", handleMouseEnter)
        }
    }, [handleMouseMove])

    if (typeof window === "undefined") return null

    return (
        <div className="fixed inset-0 pointer-events-none z-[9999] hidden lg:block">
            {/* Precision Dot - Zero Lag */}
            <motion.div
                className="fixed top-0 left-0 w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_12px_rgba(34,211,238,1)]"
                style={{
                    x: mouseX,
                    y: mouseY,
                    translateX: "-50%",
                    translateY: "-50%",
                    opacity: isVisible ? 1 : 0,
                }}
            />

            {/* Lagged Outer Ring - Technical Look */}
            <motion.div
                className="fixed top-0 left-0 rounded-full border border-cyan-500/30"
                animate={{
                    width: isClickable ? 48 : 32,
                    height: isClickable ? 48 : 32,
                    scale: isClickable ? 1.1 : 1,
                    backgroundColor: isClickable ? "rgba(34, 211, 238, 0.05)" : "rgba(168, 85, 247, 0.02)",
                    borderColor: isClickable ? "rgba(34, 211, 238, 0.6)" : "rgba(168, 85, 247, 0.3)",
                }}
                style={{
                    x: ringX,
                    y: ringY,
                    translateX: "-50%",
                    translateY: "-50%",
                    opacity: isVisible ? 0.6 : 0,
                }}
            >
                {/* Internal Crosshair bits for technical feel */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-[1px] bg-cyan-500/10 scale-x-[0.2]" />
                    <div className="absolute w-[1px] h-full bg-cyan-500/10 scale-y-[0.2]" />
                </div>
            </motion.div>

            {/* Digital Dust Trail */}
            {[1, 2, 3, 4, 5].map((i) => (
                <TrailParticle key={i} x={mouseX} y={mouseY} index={i} isVisible={isVisible} />
            ))}
        </div>
    )
}

function TrailParticle({ x, y, index, isVisible }: { x: any, y: any, index: number, isVisible: boolean }) {
    // Alternate colors between cyan and purple for the gradient trail effect
    const isCyan = index % 2 === 0
    const colorClass = isCyan ? "bg-cyan-500/30" : "bg-purple-500/30"
    const shadowClass = isCyan ? "shadow-[0_0_8px_rgba(34,211,238,0.4)]" : "shadow-[0_0_8px_rgba(168,85,247,0.4)]"

    // Each particle has slightly different lag for a staggered effect
    const springX = useSpring(x, { damping: 30 + index * 5, stiffness: 200 - index * 15 })
    const springY = useSpring(y, { damping: 30 + index * 5, stiffness: 200 - index * 15 })

    return (
        <motion.div
            className={`fixed top-0 left-0 w-1 h-1 rounded-full blur-[0.5px] ${colorClass} ${shadowClass}`}
            style={{
                x: springX,
                y: springY,
                translateX: "-50%",
                translateY: "-50%",
                opacity: isVisible ? 0.8 / index : 0,
                scale: 1 - (index * 0.1),
            }}
        />
    )
}
