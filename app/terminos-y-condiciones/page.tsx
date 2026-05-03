import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import dynamic from "next/dynamic"
import { SectionHeader } from "@/components/section-header"

const WhatsAppFAB = dynamic(() => import("@/components/whatsapp-fab").then((mod) => mod.WhatsAppFAB))

export const metadata: Metadata = {
    title: "Términos y Condiciones | InZidium",
    description: "Términos y condiciones de uso del sitio web y servicios de InZidium.",
}

export default function TerminosCondiciones() {
    return (
        <main className="min-h-screen flex flex-col">
            <Header />
            <div className="flex-1 pt-32 pb-20">
                <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
                    <SectionHeader
                        titleLeft="Términos y"
                        titleHighlight="Condiciones"
                        subtitle="Reglas y lineamientos para el uso de nuestro sitio y servicios."
                        className="mb-12"
                    />

                    <div className="glass-panel glass-card p-8 md:p-12 rounded-3xl border border-white/10 text-muted-foreground space-y-8 shadow-2xl">
                        <section>
                            <h3 className="text-2xl font-semibold text-white mb-4">1. Aceptación de los Términos</h3>
                            <p className="leading-relaxed">
                                Al acceder y utilizar el sitio web inzidium.com, aceptas cumplir y estar sujeto a estos Términos y Condiciones. Si no estás de acuerdo con alguna parte de estos términos, te solicitamos no utilizar nuestro portal web ni nuestros servicios de diseño y desarrollo.
                            </p>
                        </section>

                        <section>
                            <h3 className="text-2xl font-semibold text-white mb-4">2. Servicios Ofrecidos y Herramientas Automatizadas</h3>
                            <p className="leading-relaxed mb-4">
                                InZidium es una iniciativa y agencia digital operada por <strong>Maicol Stiven Toro Aguirre</strong>. Ofrecemos servicios de diseño web profesional, desarrollo de aplicaciones y automatizaciones tecnológicas.
                            </p>
                            <p className="leading-relaxed">
                                <strong>Uso de Bots e IA:</strong> Como parte de nuestros canales de atención, disponemos de herramientas informativas automatizadas a través de WhatsApp (utilizando integraciones de Meta Cloud API e Inteligencia Artificial). El uso de este servicio de mensajería implica tu aceptación explícita de interactuar con un sistema automatizado para primera atención, el cual está sujeto a nuestras <a href="/politica-de-privacidad" className="text-neon-cyan hover:underline">Políticas de Privacidad</a>.
                            </p>
                        </section>

                        <section>
                            <h3 className="text-2xl font-semibold text-white mb-4">3. Propiedad Intelectual</h3>
                            <p className="leading-relaxed">
                                Todo el contenido visual, textos, códigos informáticos, gráficos, logotipos y diseños presentes en inzidium.com son propiedad exclusiva de InZidium o de sus respectivos licenciantes, protegidos bajo las diferentes regulaciones de derechos de autor. Queda estrictamente prohibida su reproducción parcial o total con fines comerciales sin previa autorización escrita.
                            </p>
                        </section>

                        <section>
                            <h3 className="text-2xl font-semibold text-white mb-4">4. Obligaciones del Usuario</h3>
                            <p className="leading-relaxed">
                                Te comprometes a utilizar nuestro sitio web de forma ética y lícita. Se prohíbe el uso de esta plataforma web para la transmisión de correos no deseados (spam), de software malicioso o cualquier actividad que afecte el funcionamiento del servicio y los derechos de terceros.
                            </p>
                        </section>

                        <section>
                            <h3 className="text-2xl font-semibold text-white mb-4">5. Limitación de Responsabilidad</h3>
                            <p className="leading-relaxed">
                                En ningún caso InZidium ni su representante serán responsables por daños directos, indirectos, incidentales o consecutivos que deriven del uso o la imposibilidad de uso de nuestro sitio web y sus servicios gratuitos. Hacemos todos los esfuerzos razonables para mantener una operativa fluida libre de errores o interrupciones prolongadas, sin embargo no damos garantía absoluta de su disponibilidad perpetua.
                            </p>
                        </section>

                        <section>
                            <h3 className="text-2xl font-semibold text-white mb-4">6. Contacto</h3>
                            <p className="leading-relaxed">
                                Toda comunicación, duda legal, soporte o reclamo relacionado con los presentes términos deberá ser dirigida a través del correo oficial: <strong>maicoltorodev@gmail.com</strong> y será procesada en los debidos tiempos de respuesta habitual.
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
