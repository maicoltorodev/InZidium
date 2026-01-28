"use client"

import { useState, useRef } from "react"
import { Mail, Phone, MapPin } from "lucide-react"
import { SectionHeader } from "@/components/section-header"
import { PageSection } from "@/components/ui/page-section"
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon"
import { BackgroundGradients } from "@/components/ui/background-gradients"

export function ContactSection() {
  const [copied, setCopied] = useState(false)

  const copyEmail = () => {
    const email = "maicoltorodev@gmail.com"

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(email).then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
    } else {
      // Fallback para contextos no seguros o navegadores que no soportan Clipboard API
      const textArea = document.createElement("textarea")
      textArea.value = email
      textArea.style.position = "fixed"
      textArea.style.left = "-9999px"
      textArea.style.top = "-9999px"
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      try {
        document.execCommand("copy")
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (err) {
        console.error("Error al copiar email:", err)
      }
      document.body.removeChild(textArea)
    }
  }

  return (
    <PageSection id="contacto" className="relative overflow-hidden">
      <BackgroundGradients purplePosition="top-left" cyanPosition="bottom-right" className="opacity-10" />
      <div className="relative z-10">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16 sm:mb-24 lg:mb-32 animate-on-mount" data-animation="fade-down">
            <SectionHeader
              titleLeft="Trabajemos"
              titleHighlight="Juntos"
              subtitle="Transformamos tu visión en una realidad digital de alto rendimiento"
            />
          </div>

          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Email Card - Now first */}
            <button
              onClick={copyEmail}
              className="glass-panel p-8 sm:p-10 rounded-3xl group border border-white/10 text-left relative will-change-transform"
              style={{
                "--active-border": "rgba(168,85,247,0.5)",
                "--active-glow": "rgba(168,85,247,0.2)",
                "--neon-glow": "rgba(168,85,247,0.15)"
              } as React.CSSProperties}
            >
              <div className="text-4xl mb-6 bg-white/10 w-16 h-16 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/5 shadow-inner">
                <Mail className="h-8 w-8 text-white md:group-hover:text-neon-purple transition-colors duration-200" />
              </div>
              <h3 className="text-2xl font-orbitron mb-4 text-white md:group-hover:text-neon-purple transition-colors duration-200">Email</h3>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                Propuestas detalladas y soporte técnico especializado.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-neon-purple font-medium">Copiar correo →</span>
                {copied && (
                  <span className="absolute bottom-10 right-10 px-4 py-2 bg-neon-purple/20 border border-neon-purple/40 backdrop-blur-xl rounded-full text-[10px] font-orbitron tracking-widest text-white animate-fade-in-up">
                    COPIADO
                  </span>
                )}
              </div>
            </button>

            {/* WhatsApp Card - Now middle */}
            <a
              href="https://wa.me/573143855079"
              target="_blank"
              rel="noopener noreferrer"
              className="glass-panel p-8 sm:p-10 rounded-3xl group border border-white/10 will-change-transform"
              style={{
                "--active-border": "rgba(34,211,238,0.5)",
                "--active-glow": "rgba(34,211,238,0.2)",
                "--neon-glow": "rgba(34,211,238,0.15)"
              } as React.CSSProperties}
            >
              <div className="text-4xl mb-6 bg-white/10 w-16 h-16 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/5 shadow-inner">
                <WhatsAppIcon className="h-8 w-8 text-white md:group-hover:text-neon-cyan transition-colors duration-200" />
              </div>
              <h3 className="text-2xl font-orbitron mb-4 text-white md:group-hover:text-neon-cyan transition-colors duration-200">WhatsApp</h3>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                Respuesta inmediata para tus consultas y proyectos.
              </p>
              <span className="text-neon-cyan font-medium">Chat directo →</span>
            </a>

            {/* Location Card */}
            <div
              className="glass-panel p-8 sm:p-10 rounded-3xl group border border-white/10 will-change-transform"
              style={{
                "--active-border": "rgba(34,211,238,0.5)",
                "--active-glow": "rgba(34,211,238,0.2)",
                "--neon-glow": "rgba(34,211,238,0.15)"
              } as React.CSSProperties}
            >
              <div className="text-4xl mb-6 bg-white/10 w-16 h-16 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/5 shadow-inner">
                <MapPin className="h-8 w-8 text-white md:group-hover:text-neon-cyan transition-colors duration-200" />
              </div>
              <h3 className="text-2xl font-orbitron mb-4 text-white md:group-hover:text-neon-cyan transition-colors duration-200">Ubicación</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Bogotá, Colombia.<br />
                <span className="text-white/60">Servicio global para proyectos de alto impacto.</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageSection>
  )
}
