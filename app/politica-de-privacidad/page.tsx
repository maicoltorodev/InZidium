import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import dynamic from "next/dynamic"
import { SectionHeader } from "@/components/section-header"

const WhatsAppFAB = dynamic(() => import("@/components/whatsapp-fab").then((mod) => mod.WhatsAppFAB))

export const metadata: Metadata = {
  title: "Política de Privacidad | InZidium",
  description: "Política de privacidad y protección de datos de InZidium.",
}

export default function PoliticaPrivacidad() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="flex-1 pt-32 pb-20 relative overflow-hidden">
        {/* Decorative background similar to generic page sections */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(168,85,247,0.1)_0%,transparent_50%)] pointer-events-none" />

        <div className="relative z-10 container mx-auto px-4 sm:px-6 max-w-4xl">
          <SectionHeader
            titleLeft="Política de"
            titleHighlight="Privacidad"
            subtitle="Conoce cómo protegemos y gestionamos tus datos personales."
            className="mb-12"
          />

          <div className="glass-panel glass-card p-8 md:p-12 rounded-3xl border border-white/10 text-muted-foreground space-y-8 shadow-2xl">
            <section>
              <h3 className="text-2xl font-semibold text-white mb-4">1. Identidad del Responsable</h3>
              <p className="leading-relaxed">
                El responsable del tratamiento de los datos personales recolectados a través de este sitio web (inzidium.com) es <strong>Maicol Stiven Toro Aguirre</strong>, con correo electrónico de contacto: <strong>maicoltorodev@gmail.com</strong>.
              </p>
            </section>

            <section>
              <h3 className="text-2xl font-semibold text-white mb-4">2. Recolección de Datos y Uso de WhatsApp</h3>
              <p className="leading-relaxed mb-4">
                Recolectamos información personal que nos proporcionas voluntariamente al contactarnos vía WhatsApp, correo electrónico o formularios en nuestro sitio. Esta información incluye tu número de teléfono, nombre y el contenido de los mensajes.
              </p>
              <p className="leading-relaxed mb-4">
                <strong>Uso de WhatsApp Cloud API:</strong> Nuestra comunicación por WhatsApp es operada a través de la infraestructura oficial de WhatsApp Cloud API de Meta. Los mensajes pueden ser procesados mediante herramientas de Inteligencia Artificial de terceros para brindar respuestas automatizadas, rápidas y precisas relacionadas exclusivamente con nuestros servicios de desarrollo de software conectado.
              </p>
              <p className="leading-relaxed">
                Adicionalmente, utilizamos cookies y tecnologías de seguimiento similares (como el Píxel de Meta) para recopilar datos de navegación anónimos que nos ayudan a mejorar la experiencia de usuario y medir la efectividad de nuestras campañas publicitarias.
              </p>
            </section>

            <section>
              <h3 className="text-2xl font-semibold text-white mb-4">3. Finalidad del Tratamiento</h3>
              <p className="leading-relaxed mb-4">
                Tus datos serán utilizados exclusivamente con las siguientes finalidades:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Proveer los servicios de desarrollo y diseño web promocionados.</li>
                <li>Atender tus consultas y brindar el soporte necesario.</li>
                <li>Enviar información comercial, promociones o actualizaciones de InZidium (puedes solicitar la baja en cualquier momento).</li>
                <li>Mejorar el rendimiento y la seguridad de nuestro sitio web.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-2xl font-semibold text-white mb-4">4. Protección, Terceros y Retención</h3>
              <p className="leading-relaxed mb-4">
                Implementamos medidas de seguridad técnicas y organizativas adecuadas para proteger tu información. No vendemos, alquilamos ni comercializamos tus datos personales a terceros bajo ninguna circunstancia.
              </p>
              <p className="leading-relaxed">
                Los datos son alojados y procesados utilizando la infraestructura segura de Meta (WhatsApp Cloud API) y nuestros proveedores de servicios de Inteligencia Artificial autorizados, estrictamente para el funcionamiento del bot y la atención al cliente.
              </p>
            </section>

            <section>
              <h3 className="text-2xl font-semibold text-white mb-4">5. Políticas de Mensajería y Cancelación (Opt-out)</h3>
              <p className="leading-relaxed mb-4">
                Cumplimos estrictamente con las Políticas de Mensajería de WhatsApp. Al enviarnos un mensaje, aceptas recibir respuestas por el mismo canal para gestionar tu consulta.
              </p>
              <p className="leading-relaxed font-semibold text-neon-cyan">
                Importante: Puedes optar por no recibir más mensajes automatizados o promocionales en cualquier momento enviando la palabra "STOP" o "CANCELAR" a nuestro número de WhatsApp. Una vez recibido este comando, cancelaremos el envío de comunicaciones no esenciales.
              </p>
            </section>

            <section>
              <h3 className="text-2xl font-semibold text-white mb-4">6. Derechos del Usuario</h3>
              <p className="leading-relaxed">
                En cumplimiento de las normativas de protección de datos aplicables, tienes derecho a conocer, actualizar, rectificar y suprimir tus datos personales, así como a revocar el consentimiento otorgado para su tratamiento.
                Para ejercer estos derechos, puedes enviar una solicitud al correo electrónico: <strong>maicoltorodev@gmail.com</strong>.
              </p>
            </section>

            <section>
              <h3 className="text-2xl font-semibold text-white mb-4">7. Cambios a esta Política</h3>
              <p className="leading-relaxed">
                Nos reservamos el derecho de modificar esta Política de Privacidad en cualquier momento. Cualquier actualización será reflejada en esta misma página identificando la fecha de la modificación más reciente.
              </p>
              <p className="text-sm mt-8 opacity-70">
                Última actualización: Marzo de 2026.
              </p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
      <WhatsAppFAB />
    </main>
  )
}
