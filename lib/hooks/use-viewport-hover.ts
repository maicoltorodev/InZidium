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
  const rafIdRef = useRef<number | null>(null)
  const currentActiveIndexRef = useRef<number | null>(null)

  const findClosestToCenter = useCallback(() => {
    const viewportCenter = window.innerHeight / 2
    let closestIndex: number | null = null
    let closestDistance = Infinity

    cardRefs.current.forEach((card, index) => {
      if (!card) return

      const rect = card.getBoundingClientRect()
      const cardCenter = rect.top + rect.height / 2
      const distance = Math.abs(viewportCenter - cardCenter)
      const isInViewport = rect.top < viewportCenter && rect.bottom > viewportCenter

      if (isInViewport && distance < closestDistance) {
        closestDistance = distance
        closestIndex = index
      }
    })

    if (closestIndex !== currentActiveIndexRef.current) {
      currentActiveIndexRef.current = closestIndex
      setActiveCardIndex(closestIndex)
    }
  }, [cardRefs])

  useEffect(() => {
    // Solo activar en dispositivos móviles (touch devices)
    const mediaQuery = window.matchMedia("(max-width: 768px) and (hover: none)")
    if (!mediaQuery.matches) return

    const onScroll = () => {
      if (rafIdRef.current !== null) return

      rafIdRef.current = requestAnimationFrame(() => {
        findClosestToCenter()
        rafIdRef.current = null
      })
    }

    // Verificación inicial
    findClosestToCenter()

    window.addEventListener("scroll", onScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", onScroll)
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current)
        rafIdRef.current = null
      }
    }
  }, [findClosestToCenter])

  return activeCardIndex
}
