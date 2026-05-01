import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono, Orbitron } from "next/font/google"
import "./globals.css"
import { JSONLDSchema } from "./components/json-ld-schema"
import { CustomCursor } from "@/components/ui/custom-cursor"
import { AnimatedBackground } from "@/components/ui/animated-background"
import { AuthProvider } from "@/app/providers/AuthProvider"
import { ToastProvider } from "@/app/providers/ToastProvider"

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
    default: "InZidium · Desarrollo web, apps e IA para empresas en Colombia",
    template: "%s | InZidium",
  },
  description: "Impulsa tu negocio con InZidium. Especialistas en diseño web profesional, desarrollo de apps y automatizaciones inteligentes para resultados excepcionales.",
  applicationName: "InZidium",
  keywords: [
    "desarrollo web bogota",
    "agencia desarrollo web colombia",
    "aplicaciones moviles colombia",
    "bot whatsapp colombia empresas",
    "automatizacion procesos empresariales",
    "software a la medida colombia",
    "diseño web profesional colombia",
    "desarrollo web a medida bogota",
    "inteligencia artificial empresas colombia",
    "agencia digital bogota",
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
    title: "InZidium · Desarrollo web, apps e IA para empresas en Colombia",
    description: "Impulsa tu negocio con InZidium. Especialistas en diseño web profesional, desarrollo de apps y automatizaciones inteligentes para resultados excepcionales.",
    images: [
      {
        url: 'https://www.inzidium.com/opengraph-image',
        width: 1200,
        height: 630,
        alt: "InZidium · Desarrollo web, apps e IA para empresas en Colombia",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "InZidium · Desarrollo web, apps e IA para empresas en Colombia",
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
      // Tab variant — la que se ve en la pestaña del navegador
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "192x192" },
      // Google variant — para resultados de búsqueda (múltiplo de 48)
      { url: "/favicon-google.png", type: "image/png", sizes: "192x192" },
      { url: "/favicon-google-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  other: {
    "og:logo": "https://www.inzidium.com/icon.png",
  },
}

export const viewport: Viewport = {
  themeColor: "#060214",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es-CO" translate="no" className="dark scroll-smooth">
      <head>
        {/* Desactivar traducción automática de Google Chrome/Safari */}
        <meta name="google" content="notranslate" />
        <meta name="googlebot" content="notranslate" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        {/* Google Analytics 4 */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-DKE27Y3D33" />
        <script dangerouslySetInnerHTML={{ __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-DKE27Y3D33', { page_path: window.location.pathname });
        `}} />
      </head>
      <body className={`${geist.variable} ${geistMono.variable} ${orbitron.variable} font-sans antialiased`}>
        <AnimatedBackground />
        <JSONLDSchema />
        <CustomCursor />
        <AuthProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
