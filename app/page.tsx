import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { AboutSection } from "@/components/about-section"
import { ProjectsGrid } from "@/components/projects-grid"
import { OtherSolutions } from "@/components/other-solutions"
import { ValuesSection } from "@/components/values-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"
import { WhatsAppFAB } from "@/components/whatsapp-fab"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Hero />
      <AboutSection />
      <ProjectsGrid />
      <OtherSolutions />
      <ValuesSection />
      <ContactSection />
      <Footer />
      <WhatsAppFAB />
    </main>
  )
}
