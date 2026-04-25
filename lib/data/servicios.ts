import type { ServicioIconName } from "@/components/servicios/icon-map"

export type ServicioStep = {
  titulo: string
  descripcion: string
}

export type ServicioCaso = {
  industria: string
  descripcion: string
}

export type ServicioFaq = {
  pregunta: string
  respuesta: string
}

export type ServicioCategoria = "ia" | "sistema" | "infra"

export type Servicio = {
  slug: string
  categoria: ServicioCategoria
  titulo: string
  titulo_hero: string
  tagline: string
  descripcion_card: string
  descripcion_meta: string
  icono: ServicioIconName
  pills: string[]
  destacado: boolean
  color: "cyan" | "purple"
  problema: {
    titulo: string
    puntos: string[]
  }
  pasos: ServicioStep[]
  casos: ServicioCaso[]
  faq: ServicioFaq[]
  keywords: string[]
  relacionados: string[]
}

export const servicios: Servicio[] = [
  // ============================================================
  // 1. FLAGSHIP — WEB
  // ============================================================
  {
    slug: "desarrollo-web",
    categoria: "infra",
    titulo: "Página web que vende",
    titulo_hero: "Desarrollo web profesional en Colombia — páginas, landings y plataformas a la medida",
    tagline: "La cara digital que tu negocio merece",
    descripcion_card: "Páginas web, landings y plataformas hechas desde cero para tu negocio. Diseño único, carga rápida y preparadas para que Google las encuentre.",
    descripcion_meta: "Desarrollo web profesional en Colombia. Páginas, landings y plataformas a la medida. Diseño único, velocidad de carga y posicionamiento en Google.",
    icono: "Globe",
    pills: ["Diseño único", "Carga rápida", "Lista para Google"],
    destacado: true,
    color: "cyan",
    problema: {
      titulo: "La cara digital de tu negocio cuenta más de lo que parece",
      puntos: [
        "Tu página actual se ve anticuada y la competencia luce más profesional",
        "Las plantillas genéricas te limitan y te cobran mensualidades para siempre",
        "Carga lenta, Google no te prioriza y los visitantes se van antes de conocerte",
        "Llevas meses sin conseguir clientes desde tu web porque no tiene una estrategia detrás",
      ],
    },
    pasos: [
      { titulo: "Estrategia y diseño", descripcion: "Nuestro equipo define la propuesta de valor, el público y la estructura. Antes de programar, se diseña cada pantalla con detalle." },
      { titulo: "Desarrollo a la medida", descripcion: "Construimos tu web desde cero, con código propio y escalable. No es una plantilla comprada, es un producto pensado para tu marca." },
      { titulo: "Detalles que impactan", descripcion: "Animaciones suaves, transiciones fluidas y un terminado visual que hace que tu web se sienta premium, no genérica." },
      { titulo: "Rendimiento y posicionamiento", descripcion: "Optimizamos la carga y preparamos todos los aspectos técnicos para que Google entienda y recomiende tu sitio." },
    ],
    casos: [
      { industria: "Landings de conversión", descripcion: "Páginas para lanzamientos, preventas o campañas, con formularios efectivos y medición completa de resultados." },
      { industria: "Sitios corporativos", descripcion: "Empresas que buscan proyectar profesionalismo, atraer talento y transmitir autoridad en su industria." },
      { industria: "Portafolios profesionales", descripcion: "Arquitectos, fotógrafos, diseñadores, consultores — una presencia online que transmite calidad desde el primer vistazo." },
      { industria: "Plataformas web", descripcion: "Aplicaciones con inicio de sesión, paneles, pagos e integraciones — productos web completos, no solo informativos." },
    ],
    faq: [
      { pregunta: "¿Qué diferencia hay con Wix, Squarespace o WordPress?", respuesta: "Código propio — sin límites, sin extensiones que ralentizan, sin suscripciones eternas. Tu sitio se siente único porque lo es, y crece con tu negocio sin topes artificiales." },
      { pregunta: "¿Cuánto tarda el desarrollo?", respuesta: "Landing: 2 a 3 semanas. Sitio corporativo: 4 a 6 semanas. Plataforma compleja: 2 a 4 meses. Depende del contenido y la funcionalidad que necesites." },
      { pregunta: "¿Me entregan el código?", respuesta: "Sí. El código es tuyo y queda en un repositorio al que tienes acceso. Puedes migrar a otro equipo cuando quieras — sin ataduras." },
      { pregunta: "¿Qué tecnología utilizan?", respuesta: "Trabajamos con Next.js y React, las mismas herramientas que usan Netflix, TikTok y Spotify. Es la tecnología más moderna del mercado y garantiza velocidad, seguridad y escalabilidad." },
      { pregunta: "¿Incluye mantenimiento?", respuesta: "Los primeros 30 días después del lanzamiento están incluidos. Para mantenimiento continuo ofrecemos planes mensuales con actualizaciones, nuevas funcionalidades y soporte." },
    ],
    keywords: [
      "desarrollo web profesional colombia",
      "diseño web bogota",
      "agencia desarrollo web",
      "desarrollo web a medida",
      "paginas web profesionales",
      "diseño web premium",
      "plataforma web colombia",
    ],
    relacionados: ["bots-whatsapp-ia", "apps-moviles-nativas", "integraciones-backoffice"],
  },

  // ============================================================
  // 2. FLAGSHIP — BOT WHATSAPP
  // ============================================================
  {
    slug: "bots-whatsapp-ia",
    categoria: "ia",
    titulo: "Atención automática por WhatsApp",
    titulo_hero: "Bots de WhatsApp con inteligencia artificial para empresas en Colombia",
    tagline: "Atienden, cotizan y venden sin descanso",
    descripcion_card: "Un asistente virtual que responde a tus clientes en WhatsApp cuando tu equipo no puede — agenda citas, cotiza, cierra ventas y no se cansa.",
    descripcion_meta: "Bots de WhatsApp con inteligencia artificial que atienden a tus clientes las 24 horas, agendan citas, cotizan y cierran ventas. Plataforma oficial de WhatsApp para empresas.",
    icono: "MessageCircle",
    pills: ["Atención 24 horas", "WhatsApp oficial", "Inteligencia artificial"],
    destacado: true,
    color: "cyan",
    problema: {
      titulo: "Estás perdiendo ventas mientras duermes",
      puntos: [
        "El cliente escribe a las 11 de la noche y la competencia responde primero al día siguiente",
        "Atender WhatsApp manualmente consume la productividad de todo el equipo",
        "Las preguntas repetidas (precios, horarios, ubicación) consumen horas de tu gente",
        "Los clientes potenciales se enfrían si no respondes en los primeros minutos",
      ],
    },
    pasos: [
      { titulo: "Entrenamos al asistente con tu información", descripcion: "Nuestro equipo carga tu catálogo, precios, políticas y tono de marca para que responda exactamente como lo haría tu negocio." },
      { titulo: "Conectamos WhatsApp oficial", descripcion: "Usamos la plataforma oficial de WhatsApp para empresas. Tu número queda verificado y puede manejar miles de conversaciones simultáneas sin riesgo." },
      { titulo: "Definimos flujos y escalamiento", descripcion: "El asistente resuelve las consultas comunes y transfiere al equipo humano cuando el cliente necesita atención personalizada." },
      { titulo: "Medición y mejora continua", descripcion: "Panel con métricas claras: conversaciones atendidas, citas agendadas y ventas concretadas. Ajustamos el asistente mes a mes." },
    ],
    casos: [
      { industria: "Inmobiliarias", descripcion: "Muestra propiedades según presupuesto, agenda visitas y filtra curiosos de compradores reales." },
      { industria: "Clínicas y consultorios", descripcion: "Agenda citas, recuerda turnos y responde dudas sobre servicios, horarios y precios." },
      { industria: "Tiendas online", descripcion: "Recupera compras abandonadas, rastrea envíos y responde preguntas sobre productos." },
      { industria: "Servicios profesionales", descripcion: "Cotiza proyectos con preguntas guiadas y transfiere al asesor cuando la intención de compra es alta." },
    ],
    faq: [
      { pregunta: "¿WhatsApp puede banear mi número?", respuesta: "No. Utilizamos la plataforma oficial de WhatsApp Business. Tu número queda verificado con Meta y cumple todas las políticas oficiales." },
      { pregunta: "¿Qué pasa cuando el asistente no sabe algo?", respuesta: "Detecta la limitación, notifica a tu equipo y transfiere la conversación sin que el cliente note el cambio." },
      { pregunta: "¿Puedo cambiar lo que dice el asistente?", respuesta: "Sí. Cada negocio es distinto. Actualizamos el conocimiento del asistente cada vez que cambian precios, promociones o políticas." },
      { pregunta: "¿Qué tecnología usan?", respuesta: "Trabajamos con modelos de inteligencia artificial de Google (Gemini), Anthropic (Claude) y OpenAI — las plataformas líderes en el mercado. Elegimos la más adecuada según tu caso." },
      { pregunta: "¿Funciona en otros idiomas?", respuesta: "Sí. El asistente puede atender en español, inglés, portugués o cualquier idioma que necesite tu negocio." },
    ],
    keywords: [
      "bot whatsapp",
      "chatbot whatsapp empresas",
      "whatsapp business colombia",
      "automatizacion whatsapp",
      "atencion al cliente 24/7 whatsapp",
      "asistente virtual whatsapp",
    ],
    relacionados: ["crm-inteligente", "automatizacion-procesos", "integraciones-backoffice"],
  },

  // ============================================================
  // 3. CRM
  // ============================================================
  {
    slug: "crm-inteligente",
    categoria: "ia",
    titulo: "Seguimiento de clientes sin esfuerzo",
    titulo_hero: "CRM con inteligencia artificial que predice qué cliente va a comprar",
    tagline: "El CRM te dice dónde enfocar tu energía",
    descripcion_card: "Un CRM que no solo guarda contactos — analiza el comportamiento, clasifica los clientes potenciales y avisa cuándo alguien está por irse.",
    descripcion_meta: "CRM con inteligencia artificial que prioriza clientes, predice ventas y alerta cuando un cliente está por dejarte. Diseñado para equipos comerciales de alto rendimiento.",
    icono: "Database",
    pills: ["Clientes priorizados", "Alertas inteligentes", "Panel de control claro"],
    destacado: false,
    color: "cyan",
    problema: {
      titulo: "Tu equipo comercial no sabe a quién llamar primero",
      puntos: [
        "Tienes 500 contactos y nadie sabe cuáles están listos para comprar",
        "Pierdes clientes sin darte cuenta porque llevan semanas sin interactuar",
        "Los vendedores reportan en Excel y el seguimiento se desordena",
        "No tienes claro qué campaña o canal está trayendo los mejores clientes",
      ],
    },
    pasos: [
      { titulo: "Migración de tu información actual", descripcion: "Traemos tus clientes desde Excel, HubSpot, Pipedrive o donde los tengas. Eliminamos duplicados y organizamos todo." },
      { titulo: "Entrenamos la inteligencia artificial", descripcion: "El sistema aprende de tu historial qué comportamientos predicen una venta concreta." },
      { titulo: "Configuración de alertas", descripcion: "Notificamos al vendedor cuando un cliente potencial se calienta o cuando un cliente actual muestra señales de querer irse." },
      { titulo: "Integración con tus canales", descripcion: "WhatsApp, correo, calendario y tu sitio web — todo alimenta al CRM para tener la foto completa." },
    ],
    casos: [
      { industria: "Agencias y servicios B2B", descripcion: "Prioriza clientes potenciales y reactiva cuentas inactivas automáticamente." },
      { industria: "Educación", descripcion: "Identifica a los estudiantes prospecto con mayor probabilidad de inscribirse al próximo ciclo." },
      { industria: "Servicios financieros", descripcion: "Alerta cuando un cliente deja de usar tu producto — actúa antes de que se vaya." },
      { industria: "Inmobiliarias", descripcion: "Clasificación automática según presupuesto, urgencia e interacción con propiedades." },
    ],
    faq: [
      { pregunta: "¿Tengo que dejar el CRM que uso?", respuesta: "No necesariamente. Podemos integrarnos con HubSpot o Pipedrive y añadir la capa de inteligencia artificial sobre lo que ya tienes." },
      { pregunta: "¿Cuánta información necesita el sistema para funcionar?", respuesta: "Con unos 100 a 200 clientes históricos ya empieza a dar predicciones útiles. Mejora mes a mes con más datos." },
      { pregunta: "¿Puedo ver por qué un cliente está marcado como caliente?", respuesta: "Sí. El panel muestra qué señales activan la clasificación (visitas al sitio, respuestas, aperturas de correo, etc.)." },
      { pregunta: "¿Cumple con la protección de datos?", respuesta: "Sí. Respetamos la Ley 1581 de Colombia y todas las normas de protección de datos personales aplicables." },
    ],
    keywords: [
      "crm con inteligencia artificial",
      "crm colombia",
      "prediccion ventas ia",
      "software ventas b2b",
      "crm para empresas",
      "clasificacion clientes automatica",
    ],
    relacionados: ["bots-whatsapp-ia", "automatizacion-procesos", "integraciones-backoffice"],
  },

  // ============================================================
  // 4. AUTOMATIZACIÓN
  // ============================================================
  {
    slug: "automatizacion-procesos",
    categoria: "ia",
    titulo: "Tu negocio en piloto automático",
    titulo_hero: "Automatización de procesos empresariales — que el software haga lo repetitivo",
    tagline: "Deja de hacer a mano lo que un sistema puede hacer solo",
    descripcion_card: "Liberamos a tu equipo de las tareas repetitivas — facturas, reportes, sincronizaciones, notificaciones — todo funcionando solo, incluso mientras duermen.",
    descripcion_meta: "Automatización de procesos empresariales. Sistemas que realizan tareas repetitivas: reportes, sincronizaciones, facturas, notificaciones, sin intervención humana.",
    icono: "Workflow",
    pills: ["Procesos automáticos", "Sin tareas repetitivas", "Conectado a tus sistemas"],
    destacado: false,
    color: "purple",
    problema: {
      titulo: "Tu equipo humano está haciendo trabajo de máquina",
      puntos: [
        "Alguien pasa horas al mes copiando datos de un sistema a otro",
        "Los reportes semanales se arman a mano cada vez",
        "Las notificaciones a clientes (facturas, recordatorios) se envían manualmente",
        "Contratar a otra persona cuesta más que automatizar el proceso",
      ],
    },
    pasos: [
      { titulo: "Diagnóstico de procesos", descripcion: "Nuestro equipo identifica qué tareas consumen más tiempo y cuáles se pueden automatizar con mayor impacto." },
      { titulo: "Diseño del flujo", descripcion: "Definimos disparadores, pasos, manejo de excepciones y notificaciones para que todo funcione sin sorpresas." },
      { titulo: "Implementación", descripcion: "Según la complejidad, usamos las herramientas más adecuadas. Lo importante no es la tecnología sino que el proceso funcione." },
      { titulo: "Monitoreo y soporte", descripcion: "Te entregamos un panel con el historial de ejecuciones y alertas si algo necesita atención." },
    ],
    casos: [
      { industria: "Contabilidad", descripcion: "Lectura automática de facturas, carga al sistema contable y envío de recordatorios de pago." },
      { industria: "Mercadeo", descripcion: "Sincronización de clientes potenciales entre Meta Ads, Google Ads y tu CRM sin necesidad de exportar archivos." },
      { industria: "Operaciones", descripcion: "Generación y envío automático de reportes diarios o semanales a los responsables correspondientes." },
      { industria: "Comercio electrónico", descripcion: "Sincronización de inventario entre Shopify, MercadoLibre, Amazon y tu bodega física." },
    ],
    faq: [
      { pregunta: "¿Qué tareas se pueden automatizar?", respuesta: "Cualquier proceso repetitivo basado en reglas. Si tu equipo hace lo mismo cada día o semana, probablemente se puede automatizar." },
      { pregunta: "¿Cuánto tarda implementar una automatización?", respuesta: "Procesos simples: pocos días. Procesos complejos con múltiples sistemas: de 2 a 4 semanas." },
      { pregunta: "¿Qué pasa si la automatización falla?", respuesta: "Configuramos reintentos automáticos, alertas y procesos alternativos. Recibes notificación inmediata si algo necesita atención humana." },
      { pregunta: "¿Puedo ver qué está haciendo el sistema?", respuesta: "Sí. Te damos un panel con el registro de cada ejecución y métricas de ahorro de tiempo." },
    ],
    keywords: [
      "automatizacion procesos empresa",
      "automatizacion tareas repetitivas",
      "integracion sistemas colombia",
      "software automatizacion empresarial",
      "procesos automaticos oficina",
      "automatizacion digital pyme",
    ],
    relacionados: ["integraciones-backoffice", "crm-inteligente", "bots-whatsapp-ia"],
  },

  // ============================================================
  // 5. APPS MÓVILES
  // ============================================================
  {
    slug: "apps-moviles-nativas",
    categoria: "infra",
    titulo: "App para tu negocio",
    titulo_hero: "Aplicaciones móviles para Android y iPhone, publicadas en las tiendas oficiales",
    tagline: "Tu marca en el celular de tu cliente",
    descripcion_card: "Aplicaciones publicadas en Play Store y App Store — notificaciones, acceso sin internet, cámara, ubicación, pagos — todo lo que una web no puede hacer.",
    descripcion_meta: "Desarrollo de aplicaciones móviles para Android y iPhone. Publicación en Play Store y App Store. Notificaciones, pagos y funciones nativas del celular.",
    icono: "Smartphone",
    pills: ["Android e iPhone", "En las tiendas oficiales", "Notificaciones push"],
    destacado: false,
    color: "cyan",
    problema: {
      titulo: "Una página web a veces no es suficiente",
      puntos: [
        "Quieres enviar notificaciones para avisar al cliente directamente en su celular",
        "Tu servicio necesita cámara, ubicación o funciones sin internet",
        "Los clientes ya no guardan favoritos — descargan aplicaciones",
        "Estar en la App Store transmite profesionalismo y confianza",
      ],
    },
    pasos: [
      { titulo: "Diseño de experiencia", descripcion: "Esquemas, prototipo interactivo y diseño final siguiendo los estándares oficiales de Apple y Google." },
      { titulo: "Desarrollo para ambas plataformas", descripcion: "Un solo desarrollo que funciona en Android e iPhone — se ahorra alrededor del 40% del tiempo y el costo." },
      { titulo: "Funciones del celular", descripcion: "Notificaciones, cámara, ubicación, pagos dentro de la app, huella o rostro, modo sin internet." },
      { titulo: "Publicación en tiendas", descripcion: "Nuestro equipo sube la aplicación a Play Store y App Store, gestiona las revisiones y las actualizaciones." },
    ],
    casos: [
      { industria: "Domicilios y servicios a la puerta", descripcion: "Aplicación de pedidos con seguimiento por GPS y notificaciones de cada etapa." },
      { industria: "Fidelización", descripcion: "Aplicación con tarjeta digital, puntos, promociones y pago sin contacto." },
      { industria: "Gimnasios y bienestar", descripcion: "Aplicación con rutinas, reservas de clases, seguimiento de progreso y comunidad." },
      { industria: "Empresas con equipos en campo", descripcion: "Aplicaciones para vendedores, técnicos y repartidores." },
    ],
    faq: [
      { pregunta: "¿Cuánto cuesta publicar en las tiendas?", respuesta: "Google Play: 25 dólares una sola vez. App Store: 99 dólares al año. Nuestro equipo se encarga de la publicación completa." },
      { pregunta: "¿Cuánto tarda el desarrollo?", respuesta: "Aplicaciones simples: 2 a 3 meses. Aplicaciones complejas con servidor propio: 4 a 6 meses." },
      { pregunta: "¿Qué tecnología utilizan?", respuesta: "Trabajamos principalmente con React Native, la misma tecnología que usan Instagram, Facebook y Shopify para sus aplicaciones. Permite tener Android e iPhone con un solo desarrollo." },
      { pregunta: "¿Hacen las actualizaciones después?", respuesta: "Sí. Ofrecemos planes mensuales de mantenimiento para nuevas funcionalidades y actualizaciones de seguridad." },
    ],
    keywords: [
      "desarrollo app movil colombia",
      "aplicacion android iphone",
      "app play store app store",
      "desarrollo apps bogota",
      "aplicacion movil empresa",
      "app notificaciones push",
    ],
    relacionados: ["desarrollo-web", "integraciones-backoffice", "automatizacion-procesos"],
  },

  // ============================================================
  // 6. INTEGRACIONES
  // ============================================================
  {
    slug: "integraciones-backoffice",
    categoria: "infra",
    titulo: "Todo tu negocio conectado",
    titulo_hero: "Sistemas internos a la medida para operaciones complejas",
    tagline: "El sistema que tu operación necesita",
    descripcion_card: "Paneles internos, sistemas de gestión a la medida e integraciones entre Shopify, MercadoLibre, tu contabilidad, WhatsApp y cualquier otro software.",
    descripcion_meta: "Desarrollo de software interno, paneles administrativos y sistemas de gestión a la medida. Integraciones entre Shopify, WhatsApp, contabilidad y más.",
    icono: "Plug",
    pills: ["A la medida", "Conecta tus sistemas", "Escalable"],
    destacado: false,
    color: "purple",
    problema: {
      titulo: "Tu operación vive en varios sistemas que no se comunican",
      puntos: [
        "Shopify, MercadoLibre, Siigo, WhatsApp y Excel — cada uno con información distinta",
        "Nadie tiene la foto completa de un cliente o un pedido",
        "Copiar información entre sistemas consume horas cada semana",
        "Los programas genéricos no hacen el 20% clave que diferencia tu operación",
      ],
    },
    pasos: [
      { titulo: "Análisis de sistemas y procesos", descripcion: "Nuestro equipo entiende qué sistemas usas, cómo fluye la información y qué partes se hacen manualmente." },
      { titulo: "Diseño de la integración", descripcion: "Definimos cuál es la fuente principal de cada dato, los disparadores y la sincronización — en tiempo real o por lotes." },
      { titulo: "Desarrollo del panel", descripcion: "Construimos el panel interno con el flujo exacto de tu operación — ni más ni menos." },
      { titulo: "Puesta en marcha y capacitación", descripcion: "Tu equipo empieza a usar el sistema y nuestro equipo da soporte y hace ajustes según el uso real." },
    ],
    casos: [
      { industria: "Comercio electrónico multicanal", descripcion: "Sincronización de inventario y pedidos entre Shopify, MercadoLibre, Linio y tu bodega física." },
      { industria: "Agencias", descripcion: "Panel interno para gestión de clientes, proyectos, horas y facturación." },
      { industria: "Distribuidoras", descripcion: "Sistema a la medida con pedidos, rutas, cartera, comisiones y reportes en tiempo real." },
      { industria: "Plataformas digitales", descripcion: "Panel administrativo para operar tu producto — cobros, soporte, analítica y configuración." },
    ],
    faq: [
      { pregunta: "¿Por qué no usar Odoo, SAP o NetSuite?", respuesta: "Para operaciones estándar, sí úsalos. Para el 20% de procesos que diferencian tu negocio, un sistema a la medida escala mejor y resulta más económico a largo plazo." },
      { pregunta: "¿Con qué sistemas se integran?", respuesta: "Shopify, MercadoLibre, WhatsApp, las pasarelas de pago colombianas, Siigo, Alegra, Google Workspace, Meta Ads, Google Ads y prácticamente cualquier software con conexión disponible." },
      { pregunta: "¿Es escalable?", respuesta: "Sí. Construimos sobre la misma tecnología que usan plataformas con millones de usuarios — crece con tu negocio sin topes." },
      { pregunta: "¿Qué pasa si necesito cambios después?", respuesta: "Tenemos planes de mantenimiento mensual o por horas. El código es tuyo y queda documentado." },
    ],
    keywords: [
      "software a la medida colombia",
      "sistema gestion empresa",
      "panel interno personalizado",
      "integracion shopify mercadolibre",
      "integracion sistemas",
      "desarrollo software empresa",
    ],
    relacionados: ["automatizacion-procesos", "crm-inteligente", "desarrollo-web"],
  },
]

export function getServicioBySlug(slug: string): Servicio | undefined {
  return servicios.find((s) => s.slug === slug)
}

export function getServiciosDestacados(): Servicio[] {
  return servicios.filter((s) => s.destacado)
}

export function getServiciosPorCategoria(categoria: ServicioCategoria): Servicio[] {
  return servicios.filter((s) => s.categoria === categoria)
}

export function getServiciosRelacionados(slug: string): Servicio[] {
  const servicio = getServicioBySlug(slug)
  if (!servicio) return []
  return servicio.relacionados
    .map((s) => getServicioBySlug(s))
    .filter((s): s is Servicio => s !== undefined)
}
