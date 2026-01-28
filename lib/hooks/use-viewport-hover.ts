"use client"

import { useEffect, useState, useCallback, useRef } from "react"

/**
 * Hook que simula hover basado en viewport para dispositivos móviles.
 * Detecta qué elemento está más cerca del centro del viewport y lo marca como activo.
 *
 * @param cardRefs - Ref object con un array de elementos HTML
 * @returns El índice del elemento activo o null si no hay ninguno
 */
export function useViewportHover(cardRefs: React.MutableRefObject<(HTMLElement | null)[]>) {
  const [activeCardIndex, setActiveCardIndex] = useState<number | null>(null)

  useEffect(() => {
    // Solo activar en dispositivos móviles (touch devices)
    const mediaQuery = window.matchMedia("(max-width: 768px)")
    if (!mediaQuery.matches) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Encontrar el índice del elemento que entró al viewport
            const index = cardRefs.current.findIndex(ref => ref === entry.target)
            if (index !== -1) {
              setActiveCardIndex(index)
            }
          }
        })
      },
      {
        root: null,
        // Usar un margen que se concentre en el centro del viewport
        rootMargin: "-40% 0px -40% 0px",
        threshold: 0
      }
    )

    cardRefs.current.forEach((card) => {
      if (card) observer.observe(card)
    })

    return () => observer.disconnect()
  }, [cardRefs])

  return activeCardIndex
}
