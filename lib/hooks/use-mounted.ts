"use client"

import { useEffect, useRef } from "react"

/**
 * Hook que agrega la clase "mounted" al elemento después del mount.
 * Esto asegura que el servidor y el cliente rendericen el mismo HTML inicial,
 * permitiendo que las animaciones se activen solo después de que el componente se monte.
 *
 * @param containerRef - Ref del contenedor al que se agregará la clase "mounted"
 */
export function useMounted<T extends HTMLElement = HTMLDivElement>() {
  const containerRef = useRef<T>(null)

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.classList.add("mounted")
    }
  }, [])

  return containerRef
}
