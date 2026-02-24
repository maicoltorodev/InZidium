import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono, Orbitron } from "next/font/google"
import "./globals.css"
import { JSONLDSchema } from "./components/json-ld-schema"
import { CustomCursor } from "@/components/ui/custom-cursor"

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  variable: "--font-geist",
  adjustFontFallback: true,
  fallback: ["system-ui", "arial"],
  weight: ["400", "500", "600", "700"],
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  display: "swap",
  preload: false,
  variable: "--font-geist-mono",
  adjustFontFallback: true,
  fallback: ["monospace"],
  weight: ["400"],
})

const orbitron = Orbitron({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-orbitron",
  weight: ["400", "500", "600", "700", "800", "900"],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://www.inzidium.com'),
  title: {
    default: "InZidium · Diseño y Desarrollo de sistemas de software conectado",
    template: "%s | InZidium",
  },
  description: "Impulsa tu negocio con InZidium. Especialistas en diseño web profesional, desarrollo de apps y automatizaciones inteligentes para resultados excepcionales.",
  applicationName: "InZidium",
  keywords: [
    "diseño web profesional",
    "desarrollo de software bogota",
    "páginas web de alto impacto",
    "automatización de procesos",
    "agencia de desarrollo web",
  ],
  authors: [{ name: "InZidium" }],
  creator: "InZidium",
  publisher: "InZidium",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  openGraph: {
    type: "website",
    locale: "es_CO",
    url: 'https://www.inzidium.com',
    siteName: "InZidium",
    title: "InZidium · Diseño y Desarrollo de sistemas de software conectado",
    description: "Impulsa tu negocio con InZidium. Especialistas en diseño web profesional, desarrollo de apps y automatizaciones inteligentes para resultados excepcionales.",
    images: [
      {
        url: 'https://www.inzidium.com/opengraph-image',
        width: 1200,
        height: 630,
        alt: "InZidium · Diseño y Desarrollo de sistemas de software conectado",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "InZidium · Diseño y Desarrollo de sistemas de software conectado",
    description: "Impulsa tu negocio con InZidium. Especialistas en diseño web profesional, desarrollo de apps y automatizaciones inteligentes para resultados excepcionales.",
    images: ['https://www.inzidium.com/twitter-image'],
    creator: "@inzidium",
  },
  alternates: {
    canonical: 'https://www.inzidium.com',
    languages: {
      "es-CO": 'https://www.inzidium.com',
    },
  },
  category: "Desarrollo Web",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "192x192" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  other: {
    "og:logo": "https://www.inzidium.com/icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" translate="no" className="dark scroll-smooth">
      <head>
        {/* Desactivar traducción automática de Google Chrome/Safari */}
        <meta name="google" content="notranslate" />
        <meta name="googlebot" content="notranslate" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
      </head>
      <body className={`${geist.variable} ${geistMono.variable} ${orbitron.variable} font-sans antialiased`}>
        <JSONLDSchema />
        <CustomCursor />
        {children}
      </body>
    </html>
  )
}
