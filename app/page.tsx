import dynamic from "next/dynamic"
import { Header } from "@/components/header"
import { Hero } from "@/components/hero"

// Lazy load off-screen sections
const AboutSection = dynamic(() => import("@/components/about-section").then(mod => mod.AboutSection))
const ProjectsGrid = dynamic(() => import("@/components/projects-grid").then(mod => mod.ProjectsGrid))
const OtherSolutions = dynamic(() => import("@/components/other-solutions").then(mod => mod.OtherSolutions))
const ValuesSection = dynamic(() => import("@/components/values-section").then(mod => mod.ValuesSection))
const ContactSection = dynamic(() => import("@/components/contact-section").then(mod => mod.ContactSection))
const Footer = dynamic(() => import("@/components/footer").then(mod => mod.Footer))
const WhatsAppFAB = dynamic(() => import("@/components/whatsapp-fab").then(mod => mod.WhatsAppFAB))

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
