import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

const NAV = [
  { href: "/#sobre-mi", label: "Nosotros" },
  { href: "/servicios", label: "Servicios" },
  { href: "/bots-whatsapp-ia", label: "Bot IA" },
  { href: "/blog", label: "Blog" },
  { href: "/#portal", label: "Portal" },
  { href: "/#casos", label: "Casos" },
]

const LEGAL = [
  { href: "/politica-de-privacidad", label: "Privacidad" },
  { href: "/terminos-y-condiciones", label: "Términos" },
]

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative w-full">

      <div className="h-[2px] w-full overflow-hidden opacity-80">
        <div
          className="w-full h-full energy-flow-css"
          style={{
            backgroundImage: "linear-gradient(to right, #22d3ee, #a855f7, #22d3ee, #a855f7, #22d3ee)",
            backgroundSize: "200% 100%",
          }}
        />
      </div>

      <div className="container mx-auto px-6 sm:px-8 max-w-6xl py-10">

        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-8">

          {/* Brand */}
          <div className="flex flex-col items-center sm:items-start gap-3">
            <span className="font-orbitron font-medium tracking-[0.3em] text-[20px] text-white/90">
              InZidium
            </span>
            <p className="text-[12px] text-white/20 font-light tracking-wide text-center sm:text-left">
              Desarrollo de Software Profesional.
            </p>
            <a
              href="mailto:maicoltorodev@gmail.com"
              className="group inline-flex items-center gap-1.5 text-[12px] text-white/25 hover:text-white transition-colors duration-200"
            >
              <span>maicoltorodev@gmail.com</span>
              <ArrowUpRight className="w-3 h-3 text-white/10 group-hover:text-[#22d3ee] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200" />
            </a>
          </div>

          {/* Links */}
          <div className="flex gap-12 sm:gap-16">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.35em] text-white/15 mb-4 font-[family-name:var(--font-orbitron)]">
                Sitio
              </p>
              <ul className="space-y-2.5">
                {NAV.map(({ href, label }) => (
                  <li key={href}>
                    <Link href={href} className="text-[12px] text-white/25 hover:text-white transition-colors duration-200">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.35em] text-white/15 mb-4 font-[family-name:var(--font-orbitron)]">
                Legal
              </p>
              <ul className="space-y-2.5">
                {LEGAL.map(({ href, label }) => (
                  <li key={href}>
                    <Link href={href} rel="nofollow" className="text-[12px] text-white/25 hover:text-white transition-colors duration-200">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>

        {/* Bottom strip */}
        <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="text-[11px] text-white/15 tracking-wide">
            {currentYear} © InZidium — Todos los derechos reservados
          </span>
          <span className="text-[11px] text-white/10 tracking-wide text-center sm:text-right">
            Representante Legal: Maicol Stiven Toro Aguirre
          </span>
        </div>

      </div>
    </footer>
  )
}
