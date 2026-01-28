"use client"

import { useRef } from "react"
import Image from "next/image"
import { ExternalLink } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BLUR_PLACEHOLDER } from "@/lib/utils/image-optimization"
import { SectionHeader } from "@/components/section-header"
import { PageSection } from "@/components/ui/page-section"
import { useMounted } from "@/lib/hooks/use-mounted"
import { useViewportHover } from "@/lib/hooks/use-viewport-hover"

const projects = [
  {
    id: "1",
    title: "Bogotá Detailing Center",
    description: "Proyecto web para detailing center con 3 sedes en Bogotá.",
    features: ["Exclusividad", "Calidad", "Servicios", "Pertenencia"],
    featured: true,
    image: "/proyectos/bogotadetailingcenter.webp",
    url: "https://bogotadetailingcenter.vercel.app/",
  },
  {
    id: "2",
    title: "Clínica Mery Alvarez",
    description: "Proyecto web para una clínica estética con 5 sedes en Medellín.",
    features: ["Profesionalismo", "Excelencia", "Tienda Online", "Modernidad"],
    featured: true,
    image: "/proyectos/clinicameryalvarez.webp",
    url: "https://web-clinica-mery-alvarez.vercel.app/",
  },
  {
    id: "3",
    title: "Pinturas San Pedro",
    description: "Proyecto web para una empresa de pinturas con 2 sedes en Bogotá.",
    features: ["Productos", "Innovación", "Confort", "Transformación"],
    featured: false,
    image: "/proyectos/pinturassanpedro.webp",
    url: "https://pinturas-san-pedro.vercel.app/",
  },
  {
    id: "4",
    title: "Robin La Peluquería",
    description: "Proyecto web para peluquería prestigiosa con sede en Bogotá.",
    features: ["Expertise", "Prestigio", "Personalidad", "Vanguardismo"],
    featured: false,
    image: "/proyectos/robinlapeluqueria.webp",
    url: "https://robinlapeluqueria.vercel.app/",
  },
  {
    id: "5",
    title: "Veterinaria Clinidog",
    description: "Proyecto web para veterinaria con sede en Bogotá.",
    features: ["Profesionalismo", "Amabilidad", "Servicios", "Modernidad"],
    featured: false,
    image: "/proyectos/veterinariaclinidog.webp",
    url: "https://clinidog.vercel.app/",
  },
  {
    id: "6",
    title: "Veterinaria Dogtor",
    description: "Proyecto web para veterinaria con sede en Bogotá.",
    features: ["Profesionalismo", "Urgencia", "Modernidad", "Pertenencia"],
    featured: false,
    image: "/proyectos/veterinariadogtor.webp",
    url: "https://dogtor-drab.vercel.app/",
  },
]

function ProjectCard({ project, index, isViewportActive, cardRef }: { project: (typeof projects)[0]; index: number; isViewportActive: boolean; cardRef: (el: HTMLDivElement | null) => void }) {
  const isFeatured = project.featured
  const neonColor = 'var(--color-neon-purple)';

  return (
    <article
      ref={cardRef}
      className={`glass-panel rounded-3xl overflow-hidden relative group transition-all duration-300 hover:-translate-y-2 hover:border-neon-purple/50 hover:shadow-[0_0_40px_rgba(168,85,247,0.15)] ${isViewportActive ? "viewport-active" : ""}`}
      style={{
        animationDelay: `${0.2 + index * 0.1}s`,
        borderColor: isViewportActive ? neonColor : ''
      }}
    >
      {/* Glow behind the card on hover */}
      <div className="absolute inset-0 bg-neon-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl pointer-events-none" />

      <div
        onClick={() => project.url && window.open(project.url, "_blank", "noopener,noreferrer")}
        className="cursor-pointer"
      >
        {/* Image container */}
        <div className="relative overflow-hidden h-56 sm:h-64">
          {/* Unified Transform Context for both Image and Overlay */}
          <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-110">
            {project.image && (
              <Image
                src={project.image}
                alt={`${project.title} - Proyecto InZidium`}
                fill
                className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 390px"
                quality={85}
                placeholder="blur"
                blurDataURL={BLUR_PLACEHOLDER}
              />
            )}
            {/* Overlay - INSIDE the transform context to stay attached during zoom */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#030014] via-[#030014]/50 to-transparent opacity-90 group-hover:opacity-60 transition-opacity duration-500" />
          </div>

          {/* Featured badge */}
          {isFeatured && (
            <div className="absolute top-4 right-4 z-20">
              <span className="font-orbitron font-bold px-3 py-1 bg-neon-purple text-white text-xs rounded-full shadow-[0_0_15px_rgba(168,85,247,0.5)] tracking-wider">
                PREMIUM
              </span>
            </div>
          )}

          {/* View icon overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10">
            <div className="p-4 rounded-full bg-black/50 backdrop-blur-md border border-white/20 hover:bg-neon-purple hover:border-neon-purple transition-colors duration-300">
              <ExternalLink className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8 relative z-10">
          <h3 className={`font-orbitron text-white mb-2 transition-colors duration-300 group-hover:text-neon-purple ${isFeatured ? "text-xl sm:text-2xl" : "text-lg sm:text-xl"}`}>
            {project.title}
          </h3>

          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-4 line-clamp-2">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-2">
            {project.features.slice(0, 3).map((feature) => (
              <span
                key={feature}
                className="text-[10px] sm:text-xs font-medium px-2 py-1 rounded bg-white/5 border border-white/10 text-white/70"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>
      </div>
    </article>
  )
}

export function ProjectsGrid() {
  const containerRef = useMounted<HTMLDivElement>()
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const activeCardIndex = useViewportHover(cardRefs)

  return (
    <PageSection id="servicios" containerSize="lg">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute left-0 top-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute right-0 bottom-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div ref={containerRef} className="relative z-10">
        <div className="text-center mb-20 sm:mb-24 lg:mb-32 animate-on-mount" data-animation="fade-down">
          <SectionHeader titleLeft="Proyectos de" titleHighlight="Páginas Web" subtitle="Transformamos ideas en resultados reales" />
        </div>

        {/* Projects grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              isViewportActive={activeCardIndex === index}
              cardRef={(el) => {
                cardRefs.current[index] = el
              }}
            />
          ))}
        </div>
      </div>
    </PageSection>
  )
}
