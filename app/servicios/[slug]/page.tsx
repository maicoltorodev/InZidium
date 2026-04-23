import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import dynamic from "next/dynamic"
import { ArrowRight, CheckCircle2, ChevronRight } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ServicioCard } from "@/components/servicios/servicio-card"
import {
  servicios,
  getServicioBySlug,
  getServiciosRelacionados,
} from "@/lib/data/servicios"

const WhatsAppFAB = dynamic(() => import("@/components/whatsapp-fab").then((mod) => mod.WhatsAppFAB))

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return servicios.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const servicio = getServicioBySlug(slug)

  if (!servicio) return {}

  const url = `https://www.inzidium.com/servicios/${servicio.slug}`

  return {
    title: servicio.titulo_hero,
    description: servicio.descripcion_meta,
    keywords: servicio.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: `${servicio.titulo} · InZidium`,
      description: servicio.descripcion_meta,
      url,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${servicio.titulo} · InZidium`,
      description: servicio.descripcion_meta,
    },
  }
}

export default async function ServicioDetallePage({ params }: Props) {
  const { slug } = await params
  const servicio = getServicioBySlug(slug)

  if (!servicio) notFound()

  const relacionados = getServiciosRelacionados(slug)
  const Icon = servicio.icono
  const isCyan = servicio.color === "cyan"

  const url = `https://www.inzidium.com/servicios/${servicio.slug}`

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: servicio.titulo,
    description: servicio.descripcion_meta,
    url,
    provider: {
      "@type": "Organization",
      name: "InZidium",
      url: "https://www.inzidium.com",
    },
    areaServed: {
      "@type": "Country",
      name: "Colombia",
    },
    serviceType: servicio.titulo,
    category: "Desarrollo de software",
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: servicio.faq.map((item) => ({
      "@type": "Question",
      name: item.pregunta,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.respuesta,
      },
    })),
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.inzidium.com" },
      { "@type": "ListItem", position: 2, name: "Servicios", item: "https://www.inzidium.com/servicios" },
      { "@type": "ListItem", position: 3, name: servicio.titulo, item: url },
    ],
  }

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <Header />

      <article className="flex-1 pt-32 pb-20 relative overflow-hidden">
        <div
          className={`absolute inset-0 pointer-events-none ${
            isCyan
              ? "bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,0.1)_0%,transparent_50%)]"
              : "bg-[radial-gradient(circle_at_50%_0%,rgba(168,85,247,0.1)_0%,transparent_50%)]"
          }`}
        />

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          {/* Breadcrumb */}
          <nav aria-label="breadcrumb" className="mb-8 text-xs text-muted-foreground">
            <ol className="flex items-center gap-2 flex-wrap">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Inicio
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link href="/servicios" className="hover:text-white transition-colors">
                  Servicios
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="text-white/80" aria-current="page">
                {servicio.titulo}
              </li>
            </ol>
          </nav>

          {/* Hero */}
          <header className="mb-16 sm:mb-20">
            <div
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border mb-6 ${
                isCyan
                  ? "bg-cyan-500/10 border-cyan-400/30 text-cyan-300"
                  : "bg-purple-500/10 border-purple-400/30 text-purple-300"
              }`}
            >
              <Icon className="w-4 h-4" strokeWidth={1.75} />
              <span className="text-xs font-semibold uppercase tracking-[0.15em]">
                {servicio.tagline}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-semibold text-white mb-6 leading-tight tracking-tight">
              {servicio.titulo_hero}
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-3xl">
              {servicio.descripcion_card}
            </p>

            <div className="flex flex-wrap gap-2 mt-8">
              {servicio.pills.map((pill) => (
                <span
                  key={pill}
                  className="text-xs font-medium px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/80"
                >
                  {pill}
                </span>
              ))}
            </div>
          </header>

          {/* Problema */}
          <section className="mb-16 sm:mb-20">
            <h2 className="text-2xl sm:text-3xl font-orbitron text-white mb-3">
              {servicio.problema.titulo}
            </h2>
            <p className="text-sm text-muted-foreground uppercase tracking-wider mb-8">El problema</p>
            <ul className="space-y-4 max-w-3xl">
              {servicio.problema.puntos.map((punto, i) => (
                <li key={i} className="flex items-start gap-3 text-white/80 leading-relaxed">
                  <span
                    className={`flex-shrink-0 mt-1 w-1.5 h-1.5 rounded-full ${
                      isCyan ? "bg-cyan-400" : "bg-purple-400"
                    }`}
                  />
                  <span>{punto}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Pasos — Cómo funciona */}
          <section className="mb-16 sm:mb-20">
            <h2 className="text-2xl sm:text-3xl font-orbitron text-white mb-3">Cómo funciona</h2>
            <p className="text-sm text-muted-foreground uppercase tracking-wider mb-10">El proceso</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
              {servicio.pasos.map((paso, i) => (
                <div
                  key={i}
                  className="glass-panel rounded-2xl p-6 border border-white/10 relative overflow-hidden"
                >
                  <div
                    className={`text-5xl font-orbitron font-bold mb-4 ${
                      isCyan ? "text-cyan-300/20" : "text-purple-300/20"
                    }`}
                  >
                    0{i + 1}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{paso.titulo}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{paso.descripcion}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Casos de uso */}
          <section className="mb-16 sm:mb-20">
            <h2 className="text-2xl sm:text-3xl font-orbitron text-white mb-3">Para quién es</h2>
            <p className="text-sm text-muted-foreground uppercase tracking-wider mb-10">Casos de uso</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
              {servicio.casos.map((caso, i) => (
                <div
                  key={i}
                  className="glass-panel rounded-2xl p-6 border border-white/10 flex items-start gap-4"
                >
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
                      isCyan
                        ? "bg-cyan-500/10 border border-cyan-400/20"
                        : "bg-purple-500/10 border border-purple-400/20"
                    }`}
                  >
                    <CheckCircle2
                      className={isCyan ? "w-5 h-5 text-cyan-300" : "w-5 h-5 text-purple-300"}
                      strokeWidth={1.75}
                    />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-white mb-1">{caso.industria}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{caso.descripcion}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section className="mb-16 sm:mb-20">
            <h2 className="text-2xl sm:text-3xl font-orbitron text-white mb-3">Preguntas frecuentes</h2>
            <p className="text-sm text-muted-foreground uppercase tracking-wider mb-10">FAQ</p>
            <div className="space-y-3">
              {servicio.faq.map((item, i) => (
                <details
                  key={i}
                  className="group glass-panel rounded-2xl border border-white/10 overflow-hidden"
                >
                  <summary className="cursor-pointer list-none p-6 flex items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors">
                    <h3 className="text-base sm:text-lg font-semibold text-white">{item.pregunta}</h3>
                    <ChevronRight
                      className={`flex-shrink-0 w-5 h-5 transition-transform duration-200 group-open:rotate-90 ${
                        isCyan ? "text-cyan-300" : "text-purple-300"
                      }`}
                      strokeWidth={2}
                    />
                  </summary>
                  <div className="px-6 pb-6 text-sm text-muted-foreground leading-relaxed">
                    {item.respuesta}
                  </div>
                </details>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="mb-20">
            <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-white/10 relative overflow-hidden text-center">
              <div
                className={`absolute inset-0 pointer-events-none ${
                  isCyan
                    ? "bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/5"
                    : "bg-gradient-to-br from-purple-500/10 via-transparent to-cyan-500/5"
                }`}
              />
              <div className="relative z-10">
                <h2 className="text-2xl sm:text-3xl font-orbitron text-white mb-4">
                  ¿Listo para implementar {servicio.titulo.toLowerCase()}?
                </h2>
                <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                  Contame sobre tu negocio y te armo una propuesta concreta con alcance, tiempo y costo.
                </p>
                <Link
                  href={`/#contacto`}
                  className={`inline-flex items-center gap-2 px-8 py-4 rounded-full font-orbitron font-bold tracking-[0.2em] text-[12px] text-white border shadow-[0_0_20px_rgba(34,211,238,0.2)] uppercase transition-all duration-200 hover:scale-105 active:scale-95 ${
                    isCyan
                      ? "border-cyan-500/50 bg-cyan-500/10 hover:bg-cyan-500/20"
                      : "border-purple-500/50 bg-purple-500/10 hover:bg-purple-500/20"
                  }`}
                >
                  Pedir cotización
                  <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
                </Link>
              </div>
            </div>
          </section>

          {/* Servicios relacionados */}
          {relacionados.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-xl sm:text-2xl font-orbitron text-white">Servicios relacionados</h2>
                  <p className="text-sm text-muted-foreground mt-1">Soluciones que suelen ir con este</p>
                </div>
                <Link
                  href="/servicios"
                  className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-cyan-300 hover:gap-2.5 transition-all"
                >
                  Ver todos
                  <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} />
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
                {relacionados.map((rel, i) => (
                  <ServicioCard key={rel.slug} servicio={rel} index={i} />
                ))}
              </div>
              <div className="mt-8 text-center sm:hidden">
                <Link
                  href="/servicios"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-cyan-300"
                >
                  Ver todos los servicios
                  <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} />
                </Link>
              </div>
            </section>
          )}
        </div>
      </article>

      <Footer />
      <WhatsAppFAB />
    </main>
  )
}
