import Image from "next/image"

export function Footer() {
  // Fecha dinámica - siempre mostrará el año actual
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative w-full py-12 sm:py-16 border-t border-border/30 overflow-hidden">
      {/* Gradiente de fondo similar al de "Juntos" - Optimizado para rendimiento */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/8 to-primary/10 pointer-events-none" />

      {/* Contenido */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
          <Image
            src="/logo.webp"
            alt="Logo InZidium"
            width={120}
            height={40}
            className="h-8 sm:h-10 w-auto object-contain opacity-80"
            sizes="(max-width: 640px) 96px, 120px"
            loading="lazy"
            quality={90}
          />
          <div className="flex flex-col items-center text-sm sm:text-base text-foreground/70 font-medium text-center">
            <span>© {currentYear} InZidium.</span>
            <span>Todos los derechos reservados.</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
