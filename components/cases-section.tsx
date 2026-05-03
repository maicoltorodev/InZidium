"use client"

import { ExternalLink, Quote } from "lucide-react"
import { motion } from "framer-motion"
import { SectionHeader } from "@/components/section-header"
import { PageSection } from "@/components/ui/page-section"
import { cn } from "@/lib/utils"

type Case = {
  name: string
  url: string
  domain: string
  industry: string
  project: string
  quote: string
  author: string
}

const cases: Case[] = [
  {
    name: "Nexus",
    url: "https://nexustoprint.com",
    domain: "nexustoprint.com",
    industry: "Impresión 3D y manufactura",
    project: "Plataforma administrativa multi-tenant con CRM integrado y bot de WhatsApp con IA para atención automatizada.",
    quote: "Automatizamos la atención al cliente y centralizamos toda la operación. Cambió por completo la forma en que gestionamos el negocio.",
    author: "Equipo Nexus",
  },
  {
    name: "Ganglu",
    url: "https://ganglu.site",
    domain: "ganglu.site",
    industry: "Restaurante y gastronomía",
    project: "Sitio web con carta digital, galería de platos y reservas en línea integradas.",
    quote: "La carta digital y las reservas online nos quitaron carga del teléfono y mejoraron la experiencia de los comensales.",
    author: "Equipo Ganglu",
  },
  {
    name: "Dr. Iglesias",
    url: "https://driglesias.co",
    domain: "driglesias.co",
    industry: "Salud y consultorio médico",
    project: "Sitio profesional con presentación de servicios, agenda de citas y portal de información para pacientes.",
    quote: "El consultorio proyecta ahora la imagen profesional que necesitábamos. Los pacientes lo perciben y lo comentan.",
    author: "Dr. Iglesias",
  },
  {
    name: "PetCare Studio",
    url: "https://petcarestudiogrooming.com",
    domain: "petcarestudiogrooming.com",
    industry: "Estética y cuidado canino",
    project: "Web institucional con reservas online, presentación de servicios y galería de trabajos realizados.",
    quote: "Las reservas en línea nos liberaron horas de mensajería diaria y los clientes valoran la facilidad para agendar.",
    author: "Equipo PetCare Studio",
  },
  {
    name: "Pinturas San Pedro",
    url: "https://pinturassanpedro.com",
    domain: "pinturassanpedro.com",
    industry: "Pinturas y ferretería",
    project: "Sitio institucional con catálogo de productos, datos de contacto y captura de cotizaciones.",
    quote: "Comenzamos a recibir cotizaciones desde la web cada semana. La inversión se reflejó rápido en nuevos clientes.",
    author: "Equipo Pinturas San Pedro",
  },
]

function CaseCard({ caseItem, index }: { caseItem: Case; index: number }) {
  const accent = index % 2 === 0 ? "purple" : "cyan"

  return (
    <motion.div
      className="glass-panel glass-card border-white/5 bg-white/5 rounded-3xl p-8 sm:p-10 relative overflow-hidden group h-full flex flex-col will-change-transform translate-z-0 backface-hidden"
      style={{
        "--active-border": accent === "purple" ? "rgba(168,85,247,0.5)" : "rgba(34,211,238,0.5)",
        "--active-glow": accent === "purple" ? "rgba(168,85,247,0.2)" : "rgba(34,211,238,0.2)",
        "--neon-glow": accent === "purple" ? "rgba(168,85,247,0.15)" : "rgba(34,211,238,0.15)",
      } as React.CSSProperties}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />

      <div className="relative z-10 flex flex-col gap-6 h-full">
        {/* Logo placeholder */}
        <div
          className={cn(
            "h-24 w-full rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md flex items-center justify-center relative overflow-hidden",
            "md:group-hover:border-white/20 transition-colors duration-200"
          )}
        >
          <div
            className={cn(
              "absolute inset-0 opacity-30 md:group-hover:opacity-50 transition-opacity duration-200",
              accent === "purple"
                ? "bg-gradient-to-br from-neon-purple/20 to-transparent"
                : "bg-gradient-to-br from-neon-cyan/20 to-transparent"
            )}
          />
          <span className="font-orbitron text-2xl sm:text-3xl text-white/80 relative z-10 tracking-wide">
            {caseItem.name}
          </span>
        </div>

        {/* Industry + project */}
        <div className="space-y-3">
          <span className="inline-block text-xs font-bold px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/60 uppercase tracking-wider">
            {caseItem.industry}
          </span>
          <p className="text-base text-muted-foreground leading-relaxed">
            {caseItem.project}
          </p>
        </div>

        {/* Quote */}
        <div className="relative pl-6 border-l-2 border-white/10 md:group-hover:border-neon-purple/40 transition-colors duration-200 mt-auto">
          <Quote className="absolute -left-3 -top-1 h-5 w-5 text-white/20 bg-background rounded-full" />
          <p className="text-sm sm:text-base text-white/80 italic leading-relaxed">
            &ldquo;{caseItem.quote}&rdquo;
          </p>
          <p className="text-xs text-white/50 mt-3 not-italic font-medium">
            — {caseItem.author}
          </p>
        </div>

        {/* CTA */}
        <a
          href={caseItem.url}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "inline-flex items-center justify-between gap-2 px-5 py-3 rounded-xl border border-white/10 bg-white/5 text-sm text-white/80",
            "md:hover:border-white/30 md:hover:bg-white/10 md:hover:text-white transition-all duration-200"
          )}
        >
          <span className="font-medium">{caseItem.domain}</span>
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </motion.div>
  )
}

export function CasesSection() {
  return (
    <PageSection id="casos" containerSize="lg">
      <div className="relative">
        <div className="text-center mb-20 sm:mb-24 lg:mb-32 animate-on-mount" data-animation="fade-down">
          <SectionHeader
            titleLeft="Casos de"
            titleHighlight="Éxito"
            subtitle="Estudios y negocios que confiaron en nosotros para construir su presencia digital"
          />
        </div>

        <div className="flex flex-wrap justify-center gap-6 sm:gap-8">
          {cases.map((caseItem, index) => (
            <div
              key={caseItem.domain}
              className="animate-on-mount w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.4rem)]"
              data-animation="fade-up"
              style={{ animationDelay: `${0.2 + index * 0.1}s` }}
            >
              <CaseCard caseItem={caseItem} index={index} />
            </div>
          ))}
        </div>
      </div>
    </PageSection>
  )
}
