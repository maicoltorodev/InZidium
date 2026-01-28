export function JSONLDSchema() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://inzidium.com'

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "InZidium",
    "url": baseUrl,
    "logo": `${baseUrl}/logo.png`,
    "description": "Resultados impulsados por tecnología. Diseño, Desarrollo Web, Apps y Automatizaciones para negocios.",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+57-314-385-5079",
      "contactType": "customer service",
      "availableLanguage": "Spanish"
    },
    "sameAs": [
      "https://wa.me/573143855079"
    ]
  }

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${baseUrl}#localbusiness`,
    "name": "InZidium",
    "image": `${baseUrl}/logo.png`,
    "description": "Servicios de diseño web, desarrollo web, aplicaciones móviles y automatizaciones para negocios en Bogotá, Colombia.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Bogotá",
      "addressCountry": "CO"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "addressLocality": "Bogotá",
      "addressCountry": "CO"
    },
    "telephone": "+57-314-385-5079",
    "priceRange": "$$",
    "areaServed": {
      "@type": "Country",
      "name": "Colombia"
    }
  }

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "InZidium",
    "url": baseUrl,
    "description": "Resultados impulsados por tecnología. Diseño, Desarrollo Web, Apps y Automatizaciones.",
    "publisher": {
      "@type": "Organization",
      "name": "InZidium"
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  )
}
