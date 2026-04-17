import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

const NAV = [
  { href: "/#servicios", label: "Servicios" },
  { href: "/#planes", label: "Planes" },
  { href: "/#portal", label: "Portal cliente" },
  { href: "/portal", label: "Portal" },
]

const LEGAL = [
  { href: "/politica-de-privacidad", label: "Privacidad" },
  { href: "/terminos-y-condiciones", label: "Términos" },
]

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative w-full">

      {/* Animated gradient line — mirrors navbar */}
      <div className="h-[2px] w-full overflow-hidden opacity-80">
        <div
          className="w-full h-full energy-flow-css"
          style={{
            backgroundImage: "linear-gradient(to right, #22d3ee, #a855f7, #22d3ee, #a855f7, #22d3ee)",
            backgroundSize: "200% 100%",
          }}
        />
      </div>

      <div className="container mx-auto px-6 sm:px-8 max-w-6xl">

        {/* Brand — centered */}
        <div className="pt-16 pb-12 flex flex-col items-center gap-5 border-b border-white/5">
          <Image
            src="/logo.webp"
            alt="InZidium"
            width={64}
            height={64}
            className="object-contain opacity-90"
            loading="lazy"
          />
          <span className="font-orbitron font-medium tracking-[0.3em] text-[32px] text-white/90">
            InZidium
          </span>
          <p className="text-[12px] text-white/20 font-light tracking-wide text-center">
            Estudio de desarrollo web &amp; digital premium.
          </p>
          <a
            href="mailto:maicoltorodev@gmail.com"
            className="group inline-flex items-center gap-1.5 text-[13px] text-white/25 hover:text-white transition-colors duration-200 mt-1"
          >
            <span>maicoltorodev@gmail.com</span>
            <ArrowUpRight className="w-3 h-3 text-white/10 group-hover:text-[#22d3ee] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200" />
          </a>
        </div>

        {/* Links — centered */}
        <div className="py-10 flex justify-center gap-16 sm:gap-24 border-b border-white/5">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.35em] text-white/15 mb-5 font-[family-name:var(--font-orbitron)]">
              Sitio
            </p>
            <ul className="space-y-3">
              {NAV.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-[13px] text-white/25 hover:text-white transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.35em] text-white/15 mb-5 font-[family-name:var(--font-orbitron)]">
              Legal
            </p>
            <ul className="space-y-3">
              {LEGAL.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-[13px] text-white/25 hover:text-white transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="text-[11px] text-white/15 tracking-wide">
            {currentYear} © InZidium — Todos los derechos reservados
          </span>
          <span className="text-[11px] text-white/10 tracking-wide">
            Representante Legal: Maicol Stiven Toro Aguirre
          </span>
        </div>

      </div>
    </footer>
  )
}
