import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function scrollToId(id: string) {
  if (typeof document === "undefined") return

  const element = document.getElementById(id)
  if (!element) return

  // Usar scrollIntoView nativo que respeta scroll-margin-top definido en CSS
  element.scrollIntoView({
    behavior: "smooth",
    block: "start"
  })
}

