import React from "react"
import { cn } from "@/lib/utils"

interface BackgroundGradientsProps {
    className?: string
    purplePosition?: "top-right" | "top-left" | "bottom-right" | "bottom-left"
    cyanPosition?: "top-right" | "top-left" | "bottom-right" | "bottom-left"
    opacity?: string
}

export function BackgroundGradients({
    className,
    purplePosition = "top-right",
    cyanPosition = "bottom-left",
    opacity = "opacity-20"
}: BackgroundGradientsProps) {

    const positions = {
        "top-right": "top-0 right-0",
        "top-left": "top-0 left-0",
        "bottom-right": "bottom-0 right-0",
        "bottom-left": "bottom-0 left-0"
    }

    return (
        <div className={cn("absolute inset-0 -z-10 pointer-events-none overflow-hidden", className)}>
            <div className={cn(
                "absolute w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] bg-neon-purple/20 rounded-full blur-[80px] sm:blur-[120px] translate-z-0 will-change-transform backface-hidden",
                positions[purplePosition]
            )} />
            <div className={cn(
                "absolute w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] bg-neon-cyan/20 rounded-full blur-[80px] sm:blur-[120px] translate-z-0 will-change-transform backface-hidden",
                positions[cyanPosition]
            )} />
        </div>
    )
}
