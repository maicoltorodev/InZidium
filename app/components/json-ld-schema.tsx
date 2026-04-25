export function JSONLDSchema() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.inzidium.com'

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${baseUrl}#maicol-toro`,
    "name": "Maicol Stiven Toro Aguirre",
    "alternateName": "Maicol Toro",
    "jobTitle": "Fundador y Desarrollador Principal",
    "worksFor": {
      "@type": "Organization",
      "name": "InZidium",
      "url": baseUrl,
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Bogotá",
      "addressCountry": "CO",
    },
    "url": baseUrl,
    "email": "maicoltorodev@gmail.com",
    "telephone": "+57-314-385-5079",
    "knowsAbout": [
      "Desarrollo web",
      "Next.js",
      "React",
      "Aplicaciones móviles",
      "Inteligencia artificial",
      "Bots de WhatsApp",
      "Automatización de procesos",
      "SEO técnico",
    ],
    "sameAs": [
      "https://wa.me/573143855079",
    ],
  }

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${baseUrl}#organization`,
    "name": "InZidium",
    "url": baseUrl,
    "logo": `${baseUrl}/logo.webp`,
    "description": "Desarrollo web profesional, aplicaciones móviles, bots de WhatsApp con IA y automatizaciones a la medida para empresas en Colombia.",
    "founder": { "@id": `${baseUrl}#maicol-toro` },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+57-314-385-5079",
      "contactType": "customer service",
      "availableLanguage": "Spanish",
    },
    "sameAs": [
      "https://wa.me/573143855079",
    ],
  }

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "ProfessionalService"],
    "@id": `${baseUrl}#localbusiness`,
    "name": "InZidium",
    "image": `${baseUrl}/logo.webp`,
    "description": "Desarrollo web, aplicaciones móviles, bots de WhatsApp con IA y automatizaciones para negocios en Colombia.",
    "url": baseUrl,
    "telephone": "+57-314-385-5079",
    "email": "maicoltorodev@gmail.com",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Bogotá",
      "addressRegion": "Bogotá D.C.",
      "addressCountry": "CO",
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 4.7110,
      "longitude": -74.0721,
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "08:00",
        "closes": "19:00",
      },
    ],
    "priceRange": "$$",
    "currenciesAccepted": "COP",
    "areaServed": {
      "@type": "Country",
      "name": "Colombia",
    },
    "employee": { "@id": `${baseUrl}#maicol-toro` },
  }

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "InZidium",
    "url": baseUrl,
    "description": "Desarrollo web profesional, apps e inteligencia artificial para empresas en Colombia.",
    "publisher": { "@id": `${baseUrl}#organization` },
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${baseUrl}/blog?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
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
