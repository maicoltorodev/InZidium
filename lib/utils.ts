import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function scrollToId(id: string) {
  if (typeof document === "undefined") return
  
  const element = document.getElementById(id)
  if (!element) return

  // Obtener altura del header sticky
  const header = document.querySelector("header")
  const headerHeight = header ? header.offsetHeight : 0
  
  // Calcular offset adicional para espacio visual
  // Móvil: 16px extra, Desktop: 32px extra
  const isMobile = window.innerWidth < 640
  const extraOffset = isMobile ? 16 : 32
  
  // Calcular posición final
  const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
  const offsetPosition = elementPosition - headerHeight - extraOffset

  // Scroll suave a la posición calculada
  window.scrollTo({
    top: Math.max(0, offsetPosition),
    behavior: "smooth"
  })
}

