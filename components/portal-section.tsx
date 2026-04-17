"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Monitor, Lock, Zap, ArrowRight, FileText, CheckCircle2 } from "lucide-react"
import { SectionHeader } from "@/components/section-header"
import { PageSection } from "@/components/ui/page-section"
import { useViewportActive } from "@/lib/hooks/use-viewport-active"
import { cn } from "@/lib/utils"

const FEATURES = [
  { icon: Zap, label: "Tiempo real" },
  { icon: Lock, label: "Acceso privado" },
  { icon: Monitor, label: "Multi-dispositivo" },
]

function PortalPreview() {
  return (
    <div className="relative h-full min-h-[280px] flex flex-col gap-3">

      {/* Status bar */}
      <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-neon-cyan animate-pulse" />
          <div className="h-2 w-24 rounded-full bg-white/10" />
        </div>
        <div className="h-2 w-12 rounded-full bg-white/5" />
      </div>

      {/* Progress block */}
      <div className="rounded-xl border border-white/5 bg-white/[0.03] p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="h-2 w-20 rounded-full bg-white/10" />
          <div className="h-2 w-8 rounded-full bg-neon-cyan/40" />
        </div>
        <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-purple-500"
            initial={{ width: "0%" }}
            animate={{ width: "68%" }}
            transition={{ duration: 1.6, delay: 0.4, ease: "easeOut" }}
          />
        </div>
        <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 opacity-40"
            initial={{ width: "0%" }}
            animate={{ width: "38%" }}
            transition={{ duration: 1.6, delay: 0.7, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Chat preview */}
      <div className="rounded-xl border border-white/5 bg-white/[0.03] p-4 flex flex-col gap-3 flex-1">
        <div className="flex gap-2 items-start">
          <div className="h-6 w-6 rounded-full bg-neon-cyan/15 border border-neon-cyan/25 shrink-0" />
          <div className="flex flex-col gap-1.5">
            <div className="h-2 w-28 rounded-full bg-white/10" />
            <div className="h-2 w-20 rounded-full bg-white/5" />
          </div>
        </div>
        <div className="flex gap-2 items-start justify-end">
          <div className="h-2 w-24 rounded-full bg-neon-cyan/20 self-center" />
          <div className="h-6 w-6 rounded-full bg-purple-500/15 border border-purple-500/25 shrink-0" />
        </div>
        <div className="flex gap-2 items-start">
          <div className="h-6 w-6 rounded-full bg-neon-cyan/15 border border-neon-cyan/25 shrink-0" />
          <div className="h-2 w-32 rounded-full bg-white/10 self-center" />
        </div>
      </div>

      {/* File row */}
      <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3">
        <div className="h-8 w-8 rounded-lg bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center shrink-0">
          <FileText className="h-4 w-4 text-neon-cyan/60" />
        </div>
        <div className="flex flex-col gap-1 flex-1">
          <div className="h-2 w-28 rounded-full bg-white/10" />
          <div className="h-1.5 w-16 rounded-full bg-white/5" />
        </div>
        <CheckCircle2 className="h-4 w-4 text-neon-cyan/40 shrink-0" />
      </div>

    </div>
  )
}

export function PortalSection() {
  const { elementRef, isActive } = useViewportActive<HTMLDivElement>()

  return (
    <PageSection id="portal" withBackground={false}>
      <div className="relative">

        <div className="text-center mb-16 sm:mb-24 animate-on-mount" data-animation="fade-down">
          <SectionHeader
            titleLeft="¿Ya eres"
            titleHighlight="Cliente?"
            subtitle="Consulta el estado completo de tu proyecto en tiempo real desde tu portal dedicado."
          />
        </div>

        <div className="animate-on-mount" data-animation="fade-up" style={{ animationDelay: "0.2s" }}>
          <Link href="/seguimiento" className="block max-w-4xl mx-auto cursor-pointer">
          <motion.div
            ref={elementRef}
            className={cn(
              "glass-panel glass-card rounded-3xl overflow-hidden border border-white/10 will-change-transform translate-z-0 backface-hidden group",
              isActive && "viewport-active"
            )}
            style={{
              "--active-border": "rgba(34,211,238,0.5)",
              "--active-glow": "rgba(34,211,238,0.2)",
              "--neon-glow": "rgba(34,211,238,0.15)",
            } as React.CSSProperties}
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.3 }}
          >
            {/* Top accent line */}
            <div className="h-px w-full bg-gradient-to-r from-transparent via-neon-cyan/50 to-transparent" />

            <div className="grid grid-cols-1 md:grid-cols-2">

              {/* Left — content */}
              <div className="p-8 sm:p-10 flex flex-col justify-between">
                <div>
                  {/* Icon with glow */}
                  <div className="relative mb-8 inline-block">
                    <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan to-neon-purple blur-xl opacity-20 md:group-hover:opacity-40 transition-opacity duration-300" />
                    <div className="relative p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 md:group-hover:border-white/20 transition-all duration-200">
                      <Monitor className="h-10 w-10 text-white md:group-hover:text-neon-cyan transition-colors duration-200" />
                    </div>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-orbitron text-white mb-4 md:group-hover:text-neon-cyan transition-colors duration-200">
                    Seguimiento de Proyecto
                  </h3>

                  <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                    Revisa avances, archivos, etapas y mantente al tanto de cada detalle desde un solo lugar.
                  </p>

                  <div className="flex flex-wrap gap-2 mb-8">
                    {FEATURES.map(({ icon: Icon, label }) => (
                      <span
                        key={label}
                        className="inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/50 md:group-hover:text-white md:group-hover:border-neon-cyan/30 transition-colors uppercase tracking-wider"
                      >
                        <Icon className="h-3.5 w-3.5" />
                        {label}
                      </span>
                    ))}
                  </div>
                </div>

                <span className="inline-flex items-center gap-2 text-neon-cyan font-medium w-fit md:group-hover:gap-3 transition-all duration-200">
                  Acceder al portal
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>

              {/* Right — portal visualization */}
              <div className="relative p-6 border-t border-white/5 md:border-t-0 md:border-l md:border-white/5 bg-white/[0.01]">
                <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/[0.03] to-neon-purple/[0.03] pointer-events-none rounded-r-3xl" />
                <PortalPreview />
              </div>

            </div>

            {/* Bottom accent line */}
            <div className="h-px w-full bg-gradient-to-r from-transparent via-neon-purple/30 to-transparent" />
          </motion.div>
          </Link>
        </div>

      </div>
    </PageSection>
  )
}
