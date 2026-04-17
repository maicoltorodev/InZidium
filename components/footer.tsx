import Image from "next/image"
import Link from "next/link"
import { Mail, ArrowUpRight } from "lucide-react"

const NAV = [
  { href: "/#servicios", label: "Servicios" },
  { href: "/#planes", label: "Planes" },
  { href: "/#portal", label: "Portal cliente" },
  { href: "/portal", label: "Seguimiento" },
]

const LEGAL = [
  { href: "/politica-de-privacidad", label: "Política de Privacidad" },
  { href: "/terminos-y-condiciones", label: "Términos y Condiciones" },
]

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative w-full overflow-hidden">

      {/* Animated gradient top line */}
      <div className="h-[2px] w-full overflow-hidden opacity-80">
        <div
          className="w-full h-full energy-flow-css"
          style={{
            backgroundImage: "linear-gradient(to right, #22d3ee, #a855f7, #22d3ee, #a855f7, #22d3ee)",
            backgroundSize: "200% 100%",
          }}
        />
      </div>

      {/* Ambient glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[300px] bg-[#a855f7]/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[300px] bg-[#22d3ee]/5 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 container mx-auto px-6 sm:px-8 max-w-6xl">

        {/* Brand zone */}
        <div className="pt-20 pb-16 border-b border-white/5 flex flex-col md:flex-row items-start md:items-end justify-between gap-12">

          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-5">
              <Image
                src="/logo.webp"
                alt="InZidium"
                width={56}
                height={56}
                className="object-contain drop-shadow-[0_0_24px_rgba(34,211,238,0.25)]"
                loading="lazy"
              />
              <span
                className="text-6xl sm:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-[length:200%_auto] animate-gradient"
                style={{ backgroundImage: "linear-gradient(90deg, #e879f9, #a855f7, #22d3ee, #a855f7, #e879f9)" }}
              >
                InZidium
              </span>
            </div>
            <p className="text-base text-white/30 font-light max-w-xs leading-relaxed pl-1">
              Resultados impulsados por tecnología.
            </p>
          </div>

          <a
            href="mailto:maicoltorodev@gmail.com"
            className="group flex items-center gap-3 px-6 py-4 rounded-2xl border border-white/8 hover:border-[#22d3ee]/30 bg-white/[0.02] hover:bg-[#22d3ee]/5 transition-all duration-300 shrink-0"
          >
            <Mail className="w-4 h-4 text-white/30 group-hover:text-[#22d3ee] transition-colors" />
            <span className="text-sm font-medium text-white/40 group-hover:text-white transition-colors">
              maicoltorodev@gmail.com
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 text-white/15 group-hover:text-[#22d3ee] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200" />
          </a>
        </div>

        {/* Links zone */}
        <div className="py-12 grid grid-cols-2 md:grid-cols-3 gap-10 border-b border-white/5">

          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.35em] text-white/20 mb-6 font-[family-name:var(--font-orbitron)]">
              Sitio
            </p>
            <ul className="space-y-4">
              {NAV.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-white/35 hover:text-white transition-colors duration-200 font-medium"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.35em] text-white/20 mb-6 font-[family-name:var(--font-orbitron)]">
              Legal
            </p>
            <ul className="space-y-4">
              {LEGAL.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-white/35 hover:text-white transition-colors duration-200 font-medium"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 md:col-span-1">
            <p className="text-[9px] font-black uppercase tracking-[0.35em] text-white/20 mb-6 font-[family-name:var(--font-orbitron)]">
              Empresa
            </p>
            <p className="text-sm text-white/30 font-medium leading-relaxed">
              Estudio de desarrollo<br />web &amp; digital premium.
            </p>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="py-7 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-[11px] text-white/15 font-medium tracking-wide">
            {currentYear} © InZidium — Todos los derechos reservados
          </span>
          <span className="text-[11px] text-white/10 font-medium tracking-wide text-center sm:text-right">
            Representante Legal: Maicol Stiven Toro Aguirre
          </span>
        </div>

      </div>
    </footer>
  )
}
