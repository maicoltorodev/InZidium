"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import type { Servicio } from "@/lib/data/servicios"

type Props = {
  servicio: Servicio
  index?: number
}

export function ServicioCard({ servicio, index = 0 }: Props) {
  const Icon = servicio.icono
  const isCyan = servicio.color === "cyan"

  return (
    <Link
      href={`/servicios/${servicio.slug}`}
      prefetch={false}
      className="group block h-full"
      aria-label={`Ver detalle del servicio: ${servicio.titulo}`}
    >
      <article
        className="glass-panel glass-card rounded-3xl p-6 sm:p-8 relative overflow-hidden h-full flex flex-col will-change-transform translate-z-0 backface-hidden transition-transform duration-200 md:group-hover:-translate-y-1"
        style={{
          animationDelay: `${0.1 + index * 0.05}s`,
          "--active-border": isCyan ? "rgba(34,211,238,0.5)" : "rgba(168,85,247,0.5)",
          "--active-glow": isCyan ? "rgba(34,211,238,0.2)" : "rgba(168,85,247,0.2)",
          "--neon-glow": isCyan ? "rgba(34,211,238,0.15)" : "rgba(168,85,247,0.15)",
        } as React.CSSProperties}
      >
        <div className="absolute top-0 right-0 p-6 opacity-10 transition-opacity duration-200 md:group-hover:opacity-25">
          <Icon className="w-20 h-20" strokeWidth={1.5} />
        </div>

        <div className="relative z-10 flex flex-col h-full">
          <div
            className={`mb-5 w-14 h-14 rounded-2xl flex items-center justify-center backdrop-blur-sm border shadow-inner ${
              isCyan
                ? "bg-cyan-500/10 border-cyan-400/20"
                : "bg-purple-500/10 border-purple-400/20"
            }`}
          >
            <Icon
              className={isCyan ? "w-7 h-7 text-cyan-300" : "w-7 h-7 text-purple-300"}
              strokeWidth={1.75}
            />
          </div>

          <h3 className="text-lg sm:text-xl font-orbitron text-white mb-2 leading-snug md:group-hover:text-neon-cyan transition-colors duration-200">
            {servicio.titulo}
          </h3>

          <p
            className={`text-xs font-medium uppercase tracking-wider mb-3 ${
              isCyan ? "text-cyan-300/80" : "text-purple-300/80"
            }`}
          >
            {servicio.tagline}
          </p>

          <p className="text-sm text-muted-foreground leading-relaxed mb-5 flex-1">
            {servicio.descripcion_card}
          </p>

          <div className="flex flex-wrap gap-2 mb-5">
            {servicio.pills.slice(0, 3).map((pill) => (
              <span
                key={pill}
                className="text-[10px] sm:text-xs font-medium px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/70"
              >
                {pill}
              </span>
            ))}
          </div>

          <div
            className={`flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.15em] transition-transform duration-200 md:group-hover:translate-x-1 ${
              isCyan ? "text-cyan-300" : "text-purple-300"
            }`}
          >
            Ver detalle
            <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} />
          </div>
        </div>
      </article>
    </Link>
  )
}
