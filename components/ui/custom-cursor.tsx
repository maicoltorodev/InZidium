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
    }, [mouseX, mouseY, isVisible])

    const handleMouseOver = useCallback((e: MouseEvent) => {
        const target = e.target as HTMLElement
        const isElementClickable =
            target.closest('a') ||
            target.closest('button') ||
            target.closest('[role="button"]')
        setIsClickable(!!isElementClickable)
    }, [])

    const handleMouseLeave = () => setIsVisible(false)
    const handleMouseEnter = () => setIsVisible(true)

    useEffect(() => {
        const isDesktop = window.matchMedia("(hover: hover) and (pointer: fine)").matches
        if (!isDesktop) return

        window.addEventListener("mousemove", handleMouseMove, { passive: true })
        window.addEventListener("mouseover", handleMouseOver, { passive: true })
        document.addEventListener("mouseleave", handleMouseLeave)
        document.addEventListener("mouseenter", handleMouseEnter)

        return () => {
            window.removeEventListener("mousemove", handleMouseMove)
            window.removeEventListener("mouseover", handleMouseOver)
            document.removeEventListener("mouseleave", handleMouseLeave)
            document.removeEventListener("mouseenter", handleMouseEnter)
        }
    }, [handleMouseMove, handleMouseOver])


    if (typeof window === "undefined") return null

    return (
        <div className="fixed inset-0 pointer-events-none z-[9999] hidden lg:block">
            {/* Precision Dot - Zero Lag */}
            <motion.div
                className="fixed top-0 left-0 bg-cyan-400 z-[9999]"
                animate={{
                    scale: isClickable ? 1.5 : 1,
                    borderRadius: isClickable ? "2px" : "50%",
                    backgroundColor: isClickable ? "#ffffff" : "#22d3ee",
                }}
                style={{
                    width: "6px",
                    height: "6px",
                    x: mouseX,
                    y: mouseY,
                    translateX: "-50%",
                    translateY: "-50%",
                    opacity: isVisible ? 1 : 0,
                    boxShadow: isClickable ? "0 0 15px #fff" : "0 0 12px rgba(34,211,238,1)",
                }}
            />

            {/* Lagged Outer Ring - Technical Look */}
            <motion.div
                className="fixed top-0 left-0 rounded-full border"
                animate={{
                    width: isClickable ? 48 : 32,
                    height: isClickable ? 48 : 32,
                    scale: isClickable ? 1.1 : 1,
                    backgroundColor: isClickable ? "rgba(34, 211, 238, 0.1)" : "rgba(255, 255, 255, 0.05)",
                    borderColor: isClickable ? "rgba(34, 211, 238, 0.8)" : "rgba(255, 255, 255, 0.3)",
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
    const colorClass = isCyan ? "bg-cyan-400" : "bg-purple-500"
    const shadowColor = isCyan ? "rgba(34,211,238,0.5)" : "rgba(168,85,247,0.5)"

    // Each particle has slightly different lag for a staggered effect
    // Lower stiffness and higher damping for a more 'elastic' trail
    const springX = useSpring(x, { damping: 40 + index * 10, stiffness: 150 - index * 20 })
    const springY = useSpring(y, { damping: 40 + index * 10, stiffness: 150 - index * 20 })

    return (
        <motion.div
            className={`fixed top-0 left-0 w-1.5 h-1.5 rounded-full z-[9998] ${colorClass}`}
            style={{
                x: springX,
                y: springY,
                translateX: "-50%",
                translateY: "-50%",
                opacity: isVisible ? 0.6 / index : 0,
                scale: 1 - (index * 0.1),
                boxShadow: `0 0 10px ${shadowColor}`
            }}
        />
    )
}
