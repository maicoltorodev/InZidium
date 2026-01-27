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

  return (
    <article>
      <Card
        ref={cardRef}
        onClick={() => project.url && window.open(project.url, "_blank", "noopener,noreferrer")}
        className={`group border border-border/50 bg-gradient-to-br from-card/95 to-card/80 overflow-hidden transition-all duration-500 cursor-pointer animate-on-mount relative ${isFeatured
            ? "md:hover:scale-[1.01] hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/20"
            : "hover:border-primary/40 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/10"
          } ${isViewportActive ? "viewport-active" : ""}`}
        data-animation="fade-up"
        style={{ animationDelay: `${0.2 + index * 0.1}s` }}
      >
        {/* Image container */}
        <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10 h-64 sm:h-80">
          {/* Transform container: scales image and overlays together as a unit */}
          <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-110 origin-center">
            {project.image && (
              <div className="absolute inset-0 overflow-hidden">
                <Image
                  src={project.image}
                  alt={`${project.title} - Proyecto web desarrollado por InZidium`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 390px"
                  loading={index < 3 ? "eager" : "lazy"}
                  fetchPriority={index < 3 ? "high" : "low"}
                  quality={85}
                  placeholder="blur"
                  blurDataURL={BLUR_PLACEHOLDER}
                />
              </div>
            )}

            {/* Gradient overlays - same transform context as image */}
            <div className="absolute inset-0 z-[1] pointer-events-none">
              {/* Gradient overlay for better text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/60 to-transparent opacity-90" />
              {/* Secondary gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-accent/0 group-hover:from-primary/20 group-hover:via-transparent group-hover:to-accent/20 transition-all duration-500" />
            </div>
          </div>

          {/* Featured badge */}
          {isFeatured && (
            <div className="absolute top-4 right-4 z-20">
              <Badge className="font-bold px-3 py-1.5 bg-gradient-to-r from-primary to-accent text-primary-foreground border-primary/50 shadow-lg backdrop-blur-sm">
                ⭐ Destacado
              </Badge>
            </div>
          )}

          {/* View icon overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10">
            <div className="p-4 rounded-full bg-card/80 backdrop-blur-md border-2 border-primary/50 shadow-xl shadow-primary/30 group-hover:scale-110 transition-transform duration-500">
              <ExternalLink className="h-6 w-6 text-primary" />
            </div>
          </div>
        </div>

        <CardContent className={`relative z-10 p-6 sm:p-8 ${isFeatured ? "space-y-4" : "space-y-3"
          }`}>
          <div className="flex items-start justify-between gap-4">
            <h3 className={`font-bold text-foreground group-hover:text-primary transition-colors duration-500 ${isFeatured ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl"
              }`}>
              {project.title}
            </h3>
          </div>

          <p className={`text-muted-foreground/80 leading-relaxed ${isFeatured ? "text-base sm:text-lg" : "text-sm sm:text-base"
            }`}>
            {project.description}
          </p>

          <div className="flex flex-wrap gap-2 pt-2">
            {project.features.map((feature) => (
              <Badge
                key={feature}
                variant="secondary"
                className="text-xs font-medium border-primary/30 bg-primary/5 group-hover:bg-primary/10 group-hover:border-primary/50 transition-colors duration-500"
              >
                {feature}
              </Badge>
            ))}
          </div>

          {/* Call to action button on hover */}
          <div className="pt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
              Ver proyecto
              <ExternalLink className="h-4 w-4" />
            </div>
          </div>
        </CardContent>
      </Card>
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
