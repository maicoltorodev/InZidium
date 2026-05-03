import dynamic from "next/dynamic"
import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { AboutSection } from "@/components/about-section"
import { OtherSolutions } from "@/components/other-solutions"
import { PortalSection } from "@/components/portal-section"
import { BotIASection } from "@/components/bot-ia-section"
import { BlogSection } from "@/components/blog-section"
import { AlliancesSection } from "@/components/alliances-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"

// WhatsAppFAB sí queda dynamic — no es anchor target de ningún nav button,
// no afecta layout del smooth scroll, y su JS (framer + web audio) sí vale
// la pena diferir hasta después del first paint.
const WhatsAppFAB = dynamic(() => import("@/components/whatsapp-fab").then(mod => mod.WhatsAppFAB))

/**
 * Todos los sections de la landing están importados estáticos (no `dynamic`).
 *
 * Antes cada section era `dynamic()` con la idea de bajar el JS inicial. Pero
 * como son todos `'use client'`, sus chunks se descargaban async después del
 * first paint → la altura del layout cambiaba mientras se hidrataban → el
 * smooth scroll del navbar a `#contacto` o `#nosotros` en mobile "aterrizaba"
 * en una coordenada vieja porque el destino se movía. User veía "el viaje a
 * medias".
 *
 * Ahorro real de dynamic en esta landing: ~nulo. Visitantes scrollean las 6
 * secciones → terminan descargando todo igual. Statically imported es más
 * predecible en layout y no rompe la nav interna.
 */
export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <AboutSection />
      <OtherSolutions />
      <PortalSection />
      <BotIASection />
      <BlogSection />
      <AlliancesSection />
      <ContactSection />
      <Footer />
      <WhatsAppFAB />
    </main>
  )
}
