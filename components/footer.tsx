import Image from "next/image"

export function Footer() {
  // Fecha dinámica - siempre mostrará el año actual
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative w-full py-16 sm:py-20 border-t border-white/5 overflow-hidden pb-[calc(4rem+env(safe-area-inset-bottom))] sm:pb-20">
      {/* Lights Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(168,85,247,0.1)_0%,transparent_50%)] pointer-events-none" />

      {/* Contenido */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10">
          <div className="logo-premium-glow">
            <Image
              src="/logo.webp"
              alt="Logo InZidium"
              width={120}
              height={40}
              className="h-8 sm:h-10 w-auto object-contain opacity-90"
              sizes="(max-width: 640px) 96px, 120px"
              loading="lazy"
              quality={90}
            />
          </div>
          <div className="flex flex-col items-center text-sm sm:text-base text-muted-foreground font-light text-center">
            <span>© {currentYear} InZidium.</span>
            <span>Todos los derechos reservados.</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
