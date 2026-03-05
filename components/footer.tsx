import Image from "next/image"
import Link from "next/link"
import { Mail } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative w-full py-16 sm:py-20 border-t border-white/5 overflow-hidden pb-[calc(4rem+env(safe-area-inset-bottom))] sm:pb-20">
      {/* Lights Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(168,85,247,0.1)_0%,transparent_50%)] pointer-events-none" />

      {/* Contenido */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12 items-center text-center md:text-left max-w-5xl mx-auto">
          {/* Logo */}
          <div className="flex flex-col items-center md:items-start space-y-4">
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
            <p className="text-sm text-muted-foreground font-light max-w-xs">
              Resultados impulsados por tecnología.
            </p>
          </div>

          {/* Enlaces Legales */}
          <div className="flex flex-col items-center gap-3">
            <h4 className="text-white font-semibold mb-2">Legal</h4>
            <Link href="/politica-de-privacidad" className="text-sm text-muted-foreground hover:text-neon-cyan transition-colors">
              Política de Privacidad
            </Link>
            <Link href="/terminos-y-condiciones" className="text-sm text-muted-foreground hover:text-neon-cyan transition-colors">
              Términos y Condiciones
            </Link>
          </div>

          {/* Contacto */}
          <div className="flex flex-col items-center md:items-end gap-3">
            <h4 className="text-white font-semibold mb-2">Contacto</h4>
            <a href="mailto:maicoltorodev@gmail.com" className="text-sm text-muted-foreground hover:text-neon-cyan transition-colors flex items-center gap-2">
              <Mail className="w-4 h-4" />
              maicoltorodev@gmail.com
            </a>
          </div>
        </div>

        <div className="flex justify-center border-t border-white/5 pt-8 text-sm text-muted-foreground font-light text-center">
          <span>© {currentYear} InZidium. Todos los derechos reservados.</span>
        </div>
      </div>
    </footer>
  )
}
