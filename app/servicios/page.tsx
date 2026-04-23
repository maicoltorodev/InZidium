import type { Metadata } from "next"
import dynamic from "next/dynamic"
import Link from "next/link"
import { ArrowRight, Sparkles, Layers, Code2 } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SectionHeader } from "@/components/section-header"
import { ServicioCard } from "@/components/servicios/servicio-card"
import { servicios, getServiciosPorCategoria } from "@/lib/data/servicios"

const WhatsAppFAB = dynamic(() => import("@/components/whatsapp-fab").then((mod) => mod.WhatsAppFAB))

export const metadata: Metadata = {
  title: "Servicios · IA, desarrollo a la medida, apps y automatización",
  description:
    "16 servicios especializados en desarrollo con IA: bots de WhatsApp, CRM inteligente, automatización, tiendas online, apps móviles, historia clínica por voz y más. InZidium Colombia.",
  alternates: {
    canonical: "https://www.inzidium.com/servicios",
  },
  openGraph: {
    title: "Servicios · InZidium",
    description:
      "16 servicios especializados: bots de WhatsApp con IA, CRM inteligente, automatización, e-commerce con IA, apps móviles, landing pages y más.",
    url: "https://www.inzidium.com/servicios",
    type: "website",
  },
}

const bloqueIA = getServiciosPorCategoria("ia")
const bloqueSistema = getServiciosPorCategoria("sistema")
const bloqueInfra = getServiciosPorCategoria("infra")

export default function ServiciosPage() {
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Servicios InZidium",
    description: "Catálogo completo de servicios de desarrollo de software con IA, apps, automatización e integraciones",
    numberOfItems: servicios.length,
    itemListElement: servicios.map((s, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `https://www.inzidium.com/servicios/${s.slug}`,
      name: s.titulo,
    })),
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Inicio",
        item: "https://www.inzidium.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Servicios",
        item: "https://www.inzidium.com/servicios",
      },
    ],
  }

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <Header />

      <div className="flex-1 pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,0.08)_0%,transparent_50%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_30%,rgba(168,85,247,0.06)_0%,transparent_40%)] pointer-events-none" />

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1400px]">
          <nav aria-label="breadcrumb" className="mb-8 text-xs text-muted-foreground">
            <ol className="flex items-center gap-2">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Inicio
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="text-white/80" aria-current="page">
                Servicios
              </li>
            </ol>
          </nav>

          <div className="text-center mb-16 sm:mb-20">
            <SectionHeader
              titleLeft="Nuestros"
              titleHighlight="Servicios"
              subtitle="16 soluciones listas para impulsar tu negocio — desde IA conversacional hasta apps móviles y automatización de procesos."
            />
          </div>

          {/* Bloque 1: Web, Apps e Integraciones — flagship primero */}
          <div className="mb-20">
            <div className="flex items-center gap-3 mb-8 sm:mb-10">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center">
                <Code2 className="w-5 h-5 text-cyan-300" strokeWidth={1.75} />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-orbitron text-white">Web, Apps e Integraciones</h2>
                <p className="text-xs sm:text-sm text-muted-foreground">La base — presencia digital, móvil y sistemas conectados</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
              {bloqueInfra.map((s, i) => (
                <ServicioCard key={s.slug} servicio={s} index={i} />
              ))}
            </div>
          </div>

          {/* Bloque 2: IA */}
          <div className="mb-20">
            <div className="flex items-center gap-3 mb-8 sm:mb-10">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-400/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-purple-300" strokeWidth={1.75} />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-orbitron text-white">Inteligencia Artificial</h2>
                <p className="text-xs sm:text-sm text-muted-foreground">El gancho moderno · atención y operación automatizada</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {bloqueIA.map((s, i) => (
                <ServicioCard key={s.slug} servicio={s} index={i} />
              ))}
            </div>
          </div>

          {/* Bloque 3: Sistemas de Negocio */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-8 sm:mb-10">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center">
                <Layers className="w-5 h-5 text-cyan-300" strokeWidth={1.75} />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-orbitron text-white">Sistemas de Negocio</h2>
                <p className="text-xs sm:text-sm text-muted-foreground">Lo que todos necesitan, hecho mejor · e-commerce, reservas, salud, retención</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {bloqueSistema.map((s, i) => (
                <ServicioCard key={s.slug} servicio={s} index={i} />
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-20 sm:mt-28 text-center">
            <div className="glass-panel rounded-3xl p-8 sm:p-12 max-w-3xl mx-auto border border-white/10 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5 pointer-events-none" />
              <div className="relative z-10">
                <h3 className="text-2xl sm:text-3xl font-orbitron text-white mb-4">
                  ¿No sabés cuál se ajusta a tu negocio?
                </h3>
                <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                  Contame qué hacés y qué problema querés resolver. En 15 minutos te digo qué servicio o combinación tiene más sentido para vos.
                </p>
                <Link
                  href="/#contacto"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-orbitron font-bold tracking-[0.2em] text-[12px] text-white border border-cyan-500/50 bg-cyan-500/10 shadow-[0_0_20px_rgba(34,211,238,0.2)] uppercase transition-all duration-200 hover:bg-cyan-500/20 hover:scale-105 active:scale-95"
                >
                  Hablar con InZidium
                  <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <WhatsAppFAB />
    </main>
  )
}
