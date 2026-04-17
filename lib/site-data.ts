import { Cpu, Calendar, Zap, PackageCheck, Mail, MapPin, LucideIcon } from "lucide-react";
import { WhatsAppIcon } from "@/lib/icons/WhatsAppIcon";

// Navigation Items
export const navItems = [
  { label: "Inicio", href: "#hero" },
  { label: "Servicios", href: "#servicios" },
  { label: "Proceso", href: "#proceso" },
  { label: "Proyectos Web", href: "#proyectos" },
  { label: "Nosotros", href: "#nosotros" },
  { label: "Testimonios", href: "#testimonios" },
  { label: "Contacto", href: "#contacto" },
];

// Service type
export interface Service {
  id: number;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  image: string;
  accent: string;
  gradient: string;
  longDescription: string;
  features: string[];
  applications: string[];
  specs?: { label: string; value: string }[];
  ctaText: string;
}

// Services Data
export const services: Service[] = [
  {
    id: 1,
    slug: "gran-formato",
    title: "Gran Formato",
    tagline: "Impresión de gran escala con impacto visual máximo.",
    description: "Impresión a gran escala: banners, vinilos, microperforados, planos de arquitectura y vallas publicitarias.",
    image: "/servicios/gran-formato.webp",
    accent: "#E8AA14",
    gradient: "from-amber-900/30 via-amber-800/20 to-amber-900/30",
    longDescription: "La impresión en gran formato es la herramienta más poderosa para captar miradas y comunicar a escala. En Alkubo utilizamos tecnología de punta para garantizar colores vibrantes, nitidez excepcional y materiales resistentes a la intemperie. Ideal para todo tipo de comunicación visual de alto impacto.",
    features: [
      "Alta resolución hasta 1440 dpi",
      "Tintas UV resistentes al agua y sol",
      "Materiales premium interior/exterior",
      "Sin límite de tamaño",
      "Entrega rápida y segura",
    ],
    applications: ["Banners publicitarios", "Vallas en carretera", "Pendones de fachada", "Planos arquitectónicos", "Murales decorativos", "Backdrops para eventos"],
    specs: [
      { label: "Resolución", value: "Hasta 1440 dpi" },
      { label: "Materiales", value: "Lona, vinilo, banner, tela" },
      { label: "Tamaño", value: "Sin límite (medidas personalizadas)" },
      { label: "Acabados", value: "Ojales, tubos, estructura araña" },
    ],
    ctaText: "Cotizar Gran Formato",
  },
  {
    id: 2,
    slug: "corte-laser",
    title: "Corte Láser",
    tagline: "Precisión milimétrica para acabados que impresionan.",
    description: "Ideal para madera, grabado láser, acrílicos, poliestirenos, placas de reconocimiento, letras en 2 y 3 dimensiones.",
    image: "/servicios/corte-laser.webp",
    accent: "#E8AA14",
    gradient: "from-teal-900/30 via-cyan-900/20 to-teal-900/30",
    longDescription: "El corte láser es la técnica más precisa para crear piezas únicas con acabados perfectos. Trabajamos con una amplia gama de materiales para dar vida a diseños complejos que serían imposibles con métodos tradicionales. Desde letras corporativas hasta piezas decorativas de alta gama.",
    features: [
      "Corte con precisión de 0.1 mm",
      "Grabado fotográfico en materiales",
      "Compatible con múltiples materiales",
      "Acabados lisos sin rebabas",
      "Reproducción exacta de vectores",
    ],
    applications: ["Letras corporativas 2D y 3D", "Placas de reconocimiento", "Trofeos y premios", "Decoración en acrílico", "Piezas arquitectónicas", "Señalización personalizada"],
    specs: [
      { label: "Precisión", value: "0.1 mm" },
      { label: "Materiales", value: "Madera, acrílico, MDF, poliestireno, cuero" },
      { label: "Potencia", value: "Alta potencia para cortes limpios" },
      { label: "Grabado", value: "Fotograbado y vectorial" },
    ],
    ctaText: "Cotizar Corte Láser",
  },
  {
    id: 3,
    slug: "publicidad-comercial",
    title: "Publicidad Comercial",
    tagline: "Tu marca en manos de tus clientes.",
    description: "Tarjetas personales, volantes, catálogos, revistas, carpetas, brochures, sellos y factureros.",
    image: "/servicios/publicidad-comercial.webp",
    accent: "#E8AA14",
    gradient: "from-slate-900/40 via-slate-800/30 to-slate-900/40",
    longDescription: "La comunicación impresa sigue siendo uno de los canales más efectivos para conectar con tus clientes. Creamos piezas gráficas con calidad litográfica que transmiten profesionalismo y dejan una impresión duradera. Desde una tarjeta personal hasta un catálogo completo.",
    features: [
      "Impresión litográfica de alta calidad",
      "Papel propalcote y couché premium",
      "Plastificados mate, brillo y soft-touch",
      "Troquelados personalizados",
      "Barniz UV selectivo",
    ],
    applications: ["Tarjetas de presentación", "Brochures corporativos", "Catálogos de producto", "Revistas institucionales", "Carpetas con logo", "Factureros y talonarios"],
    specs: [
      { label: "Papel", value: "Propalcote 115-300 g/m²" },
      { label: "Acabados", value: "Mate, brillo UV, soft-touch" },
      { label: "Mínimo", value: "Desde 500 unidades" },
      { label: "Colores", value: "4 colores CMYK + especiales" },
    ],
    ctaText: "Cotizar Publicidad Comercial",
  },
  {
    id: 4,
    slug: "diseno-grafico",
    title: "Diseño Gráfico",
    tagline: "Identidades visuales que cuentan tu historia.",
    description: "Logos, flyers, vectorización y catálogos de servicios exclusivos para tu marca.",
    image: "/servicios/diseño-grafico.webp",
    accent: "#E8AA14",
    gradient: "from-emerald-900/30 via-teal-900/20 to-emerald-900/30",
    longDescription: "El diseño es la primera conversación que tu marca tiene con el mundo. Nuestro equipo creativo desarrolla identidades visuales coherentes, memorables y estratégicas. Cada pieza que diseñamos lleva consigo una intención clara: comunicar el valor único de tu negocio.",
    features: [
      "Diseño de identidad corporativa completa",
      "Vectorización de logos y arte",
      "Manual de marca profesional",
      "Formatos para digital e impresión",
      "Revisiones incluidas hasta aprobación",
    ],
    applications: ["Logos y marcas", "Flyers y afiches", "Plantillas para redes sociales", "Catálogos de servicios", "Señalética corporativa", "Packaging y etiquetas"],
    specs: [
      { label: "Formatos", value: "AI, PDF, PNG, SVG, EPS" },
      { label: "Resolución", value: "300 dpi para impresión" },
      { label: "Revisiones", value: "Hasta aprobación del cliente" },
      { label: "Entrega", value: "Archivos editables + listos para imprimir" },
    ],
    ctaText: "Solicitar Diseño",
  },
  {
    id: 5,
    slug: "pendon-publicitario",
    title: "Pendón Publicitario",
    tagline: "Presencia vertical que no pasa desapercibida.",
    description: "Alta calidad, interior/exterior, durabilidad. Estructuras de araña, tubos para colgar y ojales para templar.",
    image: "/servicios/pendon-publicitario.webp",
    accent: "#E8AA14",
    gradient: "from-amber-900/30 via-amber-800/20 to-amber-900/30",
    longDescription: "Los pendones son la solución perfecta para destacar tu marca en eventos, puntos de venta y espacios públicos. Combinamos impresión de alta calidad con estructuras resistentes y fáciles de instalar. Tu mensaje siempre visible, siempre impactante.",
    features: [
      "Impresión en lona de alta resolución",
      "Estructura de araña incluida",
      "Opciones de ojales y varillas",
      "Resistente a lluvia y viento",
      "Enrollable y fácil de transportar",
    ],
    applications: ["Eventos empresariales", "Puntos de venta", "Ferias y exposiciones", "Fachadas comerciales", "Promotores en calle", "Decoración de espacios"],
    specs: [
      { label: "Material", value: "Lona flex reforzada 440 g" },
      { label: "Tamaños", value: "Estándar 0.60×1.60 m a medida" },
      { label: "Estructura", value: "Araña aluminio incluida" },
      { label: "Acabados", value: "Ojales, bolsillo, varilla" },
    ],
    ctaText: "Cotizar Pendón",
  },
  {
    id: 6,
    slug: "vinilos-adhesivos",
    title: "Vinilos Adhesivos",
    tagline: "Adhiere tu marca a cualquier superficie.",
    description: "Alta calidad, interior/exterior, durabilidad y servicio de instalación para todo tipo de superficies.",
    image: "/servicios/vinilos-adhesivos.webp",
    accent: "#E8AA14",
    gradient: "from-teal-900/30 via-cyan-900/20 to-teal-900/30",
    longDescription: "Los vinilos adhesivos transforman cualquier superficie en un soporte publicitario. Trabajamos con materiales de primera calidad que garantizan adherencia duradera, colores vivos y facilidad de aplicación. Contamos con servicio de instalación profesional para garantizar un resultado perfecto.",
    features: [
      "Vinilo autoadhesivo de primera calidad",
      "Instalación profesional incluida",
      "Resistente a rayos UV",
      "Removible o permanente según necesidad",
      "Laminado protector opcional",
    ],
    applications: ["Vidrieras de locales", "Vehículos y flotas", "Paredes y muros", "Pisos y superficies planas", "Equipos y maquinaria", "Señalización interior"],
    specs: [
      { label: "Material", value: "Vinilo OracAl / Avery premium" },
      { label: "Durabilidad", value: "3-7 años exterior" },
      { label: "Instalación", value: "Profesional incluida" },
      { label: "Acabado", value: "Mate, brillo, satinado" },
    ],
    ctaText: "Cotizar Vinilos",
  },
  {
    id: 7,
    slug: "vinilo-microperforado",
    title: "Vinilo Microperforado",
    tagline: "Publicidad en vidrios sin perder la visibilidad.",
    description: "Alta calidad, interior/exterior y durabilidad. Cotización según medida para vidrios y fachadas.",
    image: "/servicios/vinilos-microperforado.webp",
    accent: "#E8AA14",
    gradient: "from-slate-900/40 via-slate-800/30 to-slate-900/40",
    longDescription: "El vinilo microperforado es la solución ideal para publicidad en vidrios: permite ver desde adentro hacia afuera mientras proyecta tu diseño al exterior. Perfecto para vitrinas, ventanas de oficinas, buses y cualquier superficie transparente donde quieras comunicar sin sacrificar visibilidad.",
    features: [
      "Visibilidad interior conservada",
      "Alta resolución de impresión exterior",
      "Resistente a la intemperie",
      "Fácil instalación y remoción",
      "No daña el vidrio",
    ],
    applications: ["Vitrinas de almacenes", "Buses y vehículos de transporte", "Fachadas con ventanales", "Oficinas y edificios", "Centros comerciales", "Restaurantes y cafés"],
    specs: [
      { label: "Perforación", value: "50/50 (50% tinta / 50% transparente)" },
      { label: "Superficie", value: "Vidrios exteriores e interiores" },
      { label: "Instalación", value: "Profesional recomendada" },
      { label: "Durabilidad", value: "2-4 años con laminado UV" },
    ],
    ctaText: "Cotizar Microperforado",
  },
  {
    id: 8,
    slug: "volantes",
    title: "Volantes",
    tagline: "El clásico que nunca falla multiplicado al por mayor.",
    description: "Alta calidad, papel propalcote de 115 g, impresión litográfica. Cantidad mínima: 1000 unidades.",
    image: "/servicios/volantes.webp",
    accent: "#E8AA14",
    gradient: "from-emerald-900/30 via-teal-900/20 to-emerald-900/30",
    longDescription: "Los volantes siguen siendo una de las herramientas de marketing más efectivas por su costo-beneficio. Con impresión litográfica de alta fidelidad en papel propalcote, cada volante es una pieza que comunica con claridad y profesionalismo. Producciones en gran volumen con calidad consistente.",
    features: [
      "Impresión litográfica 4 colores",
      "Papel propalcote premium",
      "Acabado brillo o mate",
      "Entrega en cantidad exacta",
      "Diseño incluido bajo solicitud",
    ],
    applications: ["Promociones y ofertas", "Eventos y lanzamientos", "Distribución puerta a puerta", "Ferias y exposiciones", "Restaurantes y comercios", "Instituciones educativas"],
    specs: [
      { label: "Papel", value: "Propalcote 115 g/m²" },
      { label: "Impresión", value: "Litografía 4+4 colores" },
      { label: "Mínimo", value: "1.000 unidades" },
      { label: "Tamaños", value: "Media carta, carta, A5, A4" },
    ],
    ctaText: "Cotizar Volantes",
  },
  {
    id: 9,
    slug: "tarjetas-personales",
    title: "Tarjetas Personales",
    tagline: "Tu primera impresión en papel de primera calidad.",
    description: "Alta calidad, papel propalcote de 300 g, plastificado mate o brillo UV. Mínimo 1000 unidades.",
    image: "/servicios/tarjetas.webp",
    accent: "#E8AA14",
    gradient: "from-amber-900/30 via-amber-800/20 to-amber-900/30",
    longDescription: "Una tarjeta de presentación bien impresa habla del nivel de excelencia de tu negocio. Producimos tarjetas en papel de 300 gramos con acabados que transmiten solidez y distinción. Cada detalle, desde el peso del papel hasta el acabado final, está pensado para dejar una huella memorable.",
    features: [
      "Cartulina propalcote 300 g",
      "Plastificado mate, brillo o soft-touch",
      "Barniz UV selectivo disponible",
      "Impresión frente y dorso",
      "Troquelado especial opcional",
    ],
    applications: ["Ejecutivos y gerentes", "Emprendedores y freelancers", "Profesionales independientes", "Agentes inmobiliarios", "Médicos y abogados", "Diseñadores y creativos"],
    specs: [
      { label: "Papel", value: "Propalcote 300 g/m²" },
      { label: "Tamaño", value: "8.5 × 5.5 cm estándar o personalizado" },
      { label: "Acabado", value: "Mate, brillo, soft-touch" },
      { label: "Mínimo", value: "1.000 unidades" },
    ],
    ctaText: "Cotizar Tarjetas",
  },
  {
    id: 10,
    slug: "tarjetas-imantadas",
    title: "Tarjetas Imantadas",
    tagline: "Siempre a la mano en la nevera de tu cliente.",
    description: "Alta calidad, troqueladas, imán de 13 micas, plastificado mate o brillo. Mínimo 1000 unidades.",
    image: "/servicios/tarjetas-imantadas.webp",
    accent: "#E8AA14",
    gradient: "from-teal-900/30 via-cyan-900/20 to-teal-900/30",
    longDescription: "Las tarjetas imantadas son una inversión de marketing permanente: tu cliente las pega en la nevera y tu número siempre está a un vistazo de distancia. Combinamos impresión de alta calidad con un imán de 13 micas para garantizar que tu tarjeta no caiga nunca.",
    features: [
      "Imán de 13 micas de alta resistencia",
      "Impresión a todo color frente/dorso",
      "Troquelado con bordes redondeados",
      "Plastificado protector incluido",
      "Duradera y lavable",
    ],
    applications: ["Servicios a domicilio", "Restaurantes y delivery", "Plomeros y electricistas", "Peluquerías y salones", "Médicos y especialistas", "Cualquier negocio recurrente"],
    specs: [
      { label: "Imán", value: "13 micas (resistencia premium)" },
      { label: "Acabado", value: "Mate o brillo UV" },
      { label: "Troquel", value: "Esquinas redondeadas" },
      { label: "Mínimo", value: "1.000 unidades" },
    ],
    ctaText: "Cotizar Tarjetas Imantadas",
  },
  {
    id: 11,
    slug: "etiquetas-adhesivas",
    title: "Etiquetas Adhesivas",
    tagline: "Identifica tu producto con distinción.",
    description: "Ideal para productos envasados, con total adherencia en cualquier superficie y alta resistencia.",
    image: "/servicios/stickers.webp",
    accent: "#E8AA14",
    gradient: "from-slate-900/40 via-slate-800/30 to-slate-900/40",
    longDescription: "Las etiquetas adhesivas son fundamentales para la identidad de cualquier producto. Diseñamos e imprimimos etiquetas a medida que se adhieren perfectamente a vidrio, plástico, metal y más. Con materiales resistentes al agua y la manipulación, tu producto luce siempre impecable en el estante.",
    features: [
      "Material resistente al agua y grasas",
      "Alta fidelidad de color",
      "Adhesivo permanente o repositionable",
      "Troquelado a la forma del diseño",
      "Laminado UV protector",
    ],
    applications: ["Productos alimenticios", "Cosméticos y cuidado personal", "Productos artesanales", "Bebidas y envases", "Productos industriales", "Sector farmacéutico"],
    specs: [
      { label: "Material", value: "Adhesivo vinilo o papel couché" },
      { label: "Impresión", value: "Digital o litográfica" },
      { label: "Mínimo", value: "Desde 500 unidades" },
      { label: "Acabado", value: "Mate, brillo UV, laminado" },
    ],
    ctaText: "Cotizar Etiquetas",
  },
  {
    id: 13,
    slug: "plotter-de-corte",
    title: "Plotter de Corte",
    tagline: "Decoración mural y señalización en vinilo de precisión.",
    description: "Decoración en muros, vidrios, retablos y señalización con acabados profesionales.",
    image: "/servicios/plotter-corte.webp",
    accent: "#E8AA14",
    gradient: "from-amber-900/30 via-amber-800/20 to-amber-900/30",
    longDescription: "El plotter de corte permite crear letreros, stickers y decoraciones con precisión quirúrgica directamente en vinilo. Sin impresión, solo corte puro: ideal para identidades de una sola tinta, señalización minimalista y decoración interior que requiere acabados limpios y elegantes.",
    features: [
      "Corte vectorial de alta precisión",
      "Amplia gama de colores de vinilo",
      "Sin límite de tamaño (por secciones)",
      "Trasferencia e instalación incluida",
      "Vinilo de intemperie disponible",
    ],
    applications: ["Letras murales decorativas", "Señalización de oficinas", "Stickers para vehículos", "Decoración de escaparates", "Retablos y vitrinas", "Marcas en pisos y paredes"],
    specs: [
      { label: "Material", value: "Vinilo de corte Oracal, Avery, Mactac" },
      { label: "Colores", value: "+50 colores sólidos disponibles" },
      { label: "Durabilidad", value: "5-7 años exterior" },
      { label: "Instalación", value: "Profesional incluida" },
    ],
    ctaText: "Cotizar Plotter de Corte",
  },
  {
    id: 14,
    slug: "desarrollo-web",
    title: "Desarrollo Web",
    tagline: "Presencia digital de alto nivel para tu marca.",
    description: "Sitios web modernos, landing pages, e-commerce y aplicaciones web optimizadas para SEO y conversión.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop",
    accent: "#64dcff",
    gradient: "from-blue-900/30 via-indigo-900/20 to-blue-900/30",
    longDescription: "Llevamos tu negocio a la web con tecnología de última generación. Creamos experiencias digitales rápidas, seguras y totalmente escalables que se adaptan a cualquier dispositivo. No solo programamos código, diseñamos herramientas de crecimiento para tu empresa.",
    features: [
      "Diseño Web Responsive (Mobile-First)",
      "Optimización SEO y Performance",
      "Integración con WhatsApp y Redes Sociales",
      "Administrador de contenido autogestionable",
      "Certificados SSL y Seguridad Avanzada",
    ],
    applications: ["Landing Pages de venta", "Sitios Web Corporativos", "Tiendas Virtuales (E-commerce)", "Aplicaciones Web Progresivas", "Portafolios Digitales", "Sistemas de Reservas"],
    specs: [
      { label: "Tecnologías", value: "Next.js, React, Node.js, Tailwind" },
      { label: "Carga", value: "Optimizado para +90 Score PageSpeed" },
      { label: "Hosting", value: "Servidores Cloud de alta velocidad" },
      { label: "Soporte", value: "Garantía de mantenimiento incluida" },
    ],
    ctaText: "Iniciar Proyecto Web",
  },
];

// Helper to find service by slug
export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

// Process Steps
export const steps = [
  {
    icon: WhatsAppIcon,
    title: "Contacto",
    description: "Escríbenos y cuéntanos tu idea en minutos.",
  },
  {
    icon: Cpu,
    title: "Asesoría",
    description: "Definimos la mejor estrategia técnica para ti.",
  },
  {
    icon: Calendar,
    title: "Agendamos",
    description: "Fijamos plazos claros y compromisos reales.",
  },
  {
    icon: Zap,
    title: "Creación",
    description: "Ejecutamos con máxima precisión y rapidez.",
  },
  {
    icon: PackageCheck,
    title: "Entrega",
    description: "Recibes tu proyecto listo para impactar.",
  }
];

// Stats Data
export const stats = [
  { value: "150", suffix: "+", label: "Proyectos" },
  { value: "10", suffix: "+", label: "Años" },
  { value: "100", suffix: "%", label: "Dedicación" },
];

// Testimonials Data
export const testimonials = [
  {
    name: "Beatriz Chaves",
    role: "Cliente Satisfecha",
    content: "Excelente, es un trabajo impecable la entrega final, además de la alegría y ansiedad que transmite cuando se recibe, los recomiendo 10000%. La paciencia en la asesoría que prestan es muy profesional.",
    stars: 5
  },
  {
    name: "Pao Ovalle",
    role: "Cliente Frecuente",
    content: "Excelente trabajo, muy detallista con todo lo que uno desea mandar hacer, puntual. Super recomendado.",
    stars: 5
  },
  {
    name: "Camilo Ch Cardozo",
    role: "Cliente Corporativo",
    content: "Excelente servicio, este lugar es muy bueno, trabajan con mucha calidad y son cumplidos.",
    stars: 5
  },
  {
    name: "Karen Nope",
    role: "Diseño de Marca",
    content: "Recomendado, entrega puntual y materiales de alta calidad.",
    stars: 5
  },
  {
    name: "Nathaly Vergara",
    role: "Proyectos Especiales",
    content: "Súper amables y cumplidos 👍🏻 volveré a hacer otras cosas con ellos.",
    stars: 5
  }
];

// Contact Methods
export const contactMethods = [
  {
    icon: Mail,
    label: "Email",
    value: "alkubosolucionesgraficas@gmail.com",
    href: "mailto:alkubosolucionesgraficas@gmail.com",
    delay: 200,
    accent: "rgba(100, 220, 255, 0.4)"
  },
  {
    icon: WhatsAppIcon,
    label: "WhatsApp",
    value: "+57 322 7485563",
    href: "https://wa.me/573227485563",
    delay: 400,
    accent: "rgba(232, 170, 20, 0.4)"
  },
  {
    icon: MapPin,
    label: "Ubicación",
    value: "Calle 139 # 94 - 46 local 3",
    href: "https://maps.google.com/?q=Calle+139+%23+94+-+46+local+3",
    delay: 600,
    accent: "rgba(255, 255, 255, 0.4)"
  }
];

// Suppress unused import warning
export type { LucideIcon };
