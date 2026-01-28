"use client"

import { useEffect, useRef, useState } from "react"

/**
 * Hook para detectar cuándo un elemento está en el centro del viewport.
 * Optimizado para rendimiento usando IntersectionObserver con rootMargin.
 * Genérico para soportar diferentes tipos de elementos HTML.
 */
export function useViewportActive<T extends HTMLElement>() {
    const [isActive, setIsActive] = useState(false)
    const elementRef = useRef<T>(null)

    useEffect(() => {
        // Solo activar en dispositivos con touch para no interferir con hover de PC
        const isTouchDevice = window.matchMedia("(pointer: coarse)").matches
        if (!isTouchDevice) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsActive(entry.isIntersecting)
            },
            {
                // Esto define una "franja" horizontal en el centro del 40% al 60% del alto de la pantalla
                rootMargin: "-40% 0px -40% 0px",
                threshold: 0
            }
        )

        if (elementRef.current) {
            observer.observe(elementRef.current)
        }

        return () => observer.disconnect()
    }, [])

    return { elementRef, isActive }
}
