import type { Metadata } from "next"
import { BotLanding } from "./landing"

export const metadata: Metadata = {
  title: "Bot de WhatsApp con IA para empresas en Colombia · InZidium",
  description:
    "Asistente de inteligencia artificial para WhatsApp que atiende clientes, agenda citas y cierra ventas las 24 horas. WhatsApp Business oficial, sin riesgo de bloqueo. Para empresas en Colombia.",
  keywords: [
    "bot whatsapp colombia",
    "chatbot whatsapp empresas",
    "whatsapp business ia colombia",
    "asistente virtual whatsapp bogota",
    "automatizacion whatsapp empresas",
    "bot whatsapp inteligencia artificial",
    "whatsapp business api colombia",
    "atencion al cliente 24 horas whatsapp",
  ],
  alternates: {
    canonical: "https://www.inzidium.com/bots-whatsapp-ia",
  },
  openGraph: {
    title: "Bot de WhatsApp con IA para empresas · InZidium",
    description:
      "Asistente con IA que atiende clientes, agenda citas y cierra ventas en WhatsApp las 24 horas. WhatsApp oficial, sin riesgo de bloqueo.",
    url: "https://www.inzidium.com/bots-whatsapp-ia",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bot de WhatsApp con IA para empresas · InZidium",
    description:
      "Asistente con IA que atiende clientes, agenda citas y cierra ventas en WhatsApp las 24 horas.",
  },
}

export default function Page() {
  return <BotLanding />
}
