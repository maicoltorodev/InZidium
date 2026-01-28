"use client"

import React, { useEffect, useState, useCallback } from "react"
import { motion, useSpring, useMotionValue } from "framer-motion"

export function CustomCursor() {
    const [isVisible, setIsVisible] = useState(false)
    const [isClickable, setIsClickable] = useState(false)

    // Motion values for smooth tracking
    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)

    // Main spring config for the dot
    const dotConfig = { damping: 20, stiffness: 250 }
    const dotX = useSpring(mouseX, dotConfig)
    const dotY = useSpring(mouseY, dotConfig)

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
        // Only enable on high-accuracy pointer devices (desktop)
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
            {/* Precision Dot */}
            <motion.div
                className="fixed top-0 left-0 w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.8)]"
                style={{
                    x: dotX,
                    y: dotY,
                    translateX: "-50%",
                    translateY: "-50%",
                    opacity: isVisible ? 1 : 0,
                }}
            />

            {/* Lagged Outer Ring */}
            <motion.div
                className="fixed top-0 left-0 rounded-full border border-purple-500/50 bg-purple-500/5"
                animate={{
                    width: isClickable ? 45 : 30,
                    height: isClickable ? 45 : 30,
                    scale: isClickable ? 1.2 : 1,
                    borderWidth: isClickable ? "2px" : "1px",
                    backgroundColor: isClickable ? "rgba(168, 85, 247, 0.1)" : "rgba(168, 85, 247, 0.05)",
                }}
                style={{
                    x: ringX,
                    y: ringY,
                    translateX: "-50%",
                    translateY: "-50%",
                    opacity: isVisible ? 0.8 : 0,
                }}
            />

            {/* Subtle Ghost Trail (The Path) */}
            {[1, 2, 3].map((i) => (
                <TrailDot key={i} x={mouseX} y={mouseY} delay={i * 2} isVisible={isVisible} />
            ))}
        </div>
    )
}

function TrailDot({ x, y, delay, isVisible }: { x: any, y: any, delay: number, isVisible: boolean }) {
    const springX = useSpring(x, { damping: 40 + delay, stiffness: 200 - delay * 10 })
    const springY = useSpring(y, { damping: 40 + delay, stiffness: 200 - delay * 10 })

    return (
        <motion.div
            className="fixed top-0 left-0 w-1 h-1 bg-purple-400/40 rounded-full blur-[1px]"
            style={{
                x: springX,
                y: springY,
                translateX: "-50%",
                translateY: "-50%",
                opacity: isVisible ? 1 - (delay * 0.15) : 0,
                scale: 1 - (delay * 0.1),
            }}
        />
    )
}
