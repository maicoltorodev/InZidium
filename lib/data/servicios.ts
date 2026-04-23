import type { LucideIcon } from "lucide-react"
import {
  MessageCircle,
  Bot,
  Database,
  Workflow,
  FileScan,
  Sparkles,
  Truck,
  CalendarCheck,
  ShoppingBag,
  Stethoscope,
  ScanFace,
  Trophy,
  Globe,
  Search,
  Smartphone,
  Plug,
} from "lucide-react"

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
  icono: LucideIcon
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
  // FLAGSHIP — DESARROLLO WEB (el fuerte de la casa)
  // ============================================================
  {
    slug: "desarrollo-web",
    categoria: "infra",
    titulo: "Desarrollo Web Profesional",
    titulo_hero: "Desarrollo web profesional en Colombia — sitios, landings y web apps a la medida",
    tagline: "Tu presencia digital, bien hecha",
    descripcion_card: "Sitios, landings y aplicaciones web hechas desde cero — Next.js 16, diseño premium, animaciones modernas, performance 95+ y SEO técnico de fábrica.",
    descripcion_meta: "Desarrollo web profesional en Colombia. Sitios, landings y aplicaciones web custom con Next.js, diseño premium, SEO técnico y performance optimizada.",
    icono: Globe,
    pills: ["Next.js 16", "Diseño custom", "SEO y performance"],
    destacado: true,
    color: "cyan",
    problema: {
      titulo: "La web que te representa importa más que nunca",
      puntos: [
        "Tu sitio actual se ve como de hace 5 años mientras tu competencia luce moderna",
        "Los templates de Wix o WordPress te encajan donde no querés y te cobran eternamente",
        "Carga lento, Google te castiga y los visitantes se van antes de conocerte",
        "Llevás 6 meses sin convertir un lead — porque tu web no tiene estrategia detrás",
      ],
    },
    pasos: [
      { titulo: "Estrategia y diseño", descripcion: "Definimos propuesta de valor, público, estructura y moodboard visual. Antes de programar, diseñamos cada pantalla al pixel." },
      { titulo: "Desarrollo a medida", descripcion: "Next.js 16, React 19, TypeScript. Código escalable, mantenible y pensado para vivir años — no un template comprado." },
      { titulo: "Animaciones y detalle premium", descripcion: "Micro-interacciones, glassmorphism, transiciones fluidas — lo que hace que tu web se sienta cara y diferente, no genérica." },
      { titulo: "Performance y SEO técnico", descripcion: "PageSpeed 95+, Core Web Vitals verdes, schema.org, sitemap, OG tags — Google la entiende y la recomienda." },
    ],
    casos: [
      { industria: "Landings de conversión", descripcion: "Lanzamientos, waitlists, pre-ventas con formularios optimizados, tracking end-to-end y retargeting configurado." },
      { industria: "Sitios corporativos", descripcion: "Empresas que quieren lucir profesional, atraer talento y comunicar autoridad en su industria." },
      { industria: "Portafolios profesionales", descripcion: "Arquitectos, fotógrafos, diseñadores, consultores — una presencia que transmite calidad desde el primer scroll." },
      { industria: "Web apps y SaaS", descripcion: "Aplicaciones complejas con login, dashboards, pagos e integraciones — no sitios informativos, producto real." },
    ],
    faq: [
      { pregunta: "¿Qué diferencia hay con Wix, Squarespace o WordPress?", respuesta: "Código propio — cero límites, cero plugins que ralentizan, cero suscripciones infinitas. Tu sitio se siente único porque lo es, y escala con tu negocio sin topes." },
      { pregunta: "¿Cuánto tarda?", respuesta: "Landing: 2-3 semanas. Sitio corporativo: 4-6 semanas. Web app compleja: 2-4 meses. Depende del contenido y la funcionalidad que necesites." },
      { pregunta: "¿Me entregan el código?", respuesta: "Sí. El código es tuyo y queda en un repositorio al que tenés acceso. Podés migrar a otro developer cuando quieras — sin lock-in." },
      { pregunta: "¿Qué hosting usan?", respuesta: "Vercel — el mejor stack para Next.js. Primer año de hosting incluido; después, costo marginal según tráfico." },
      { pregunta: "¿Incluye mantenimiento?", respuesta: "Los primeros 30 días sí, post-lanzamiento. Después ofrecemos plan mensual opcional para actualizaciones, features nuevas y soporte." },
    ],
    keywords: [
      "desarrollo web profesional colombia",
      "diseño web bogota",
      "agencia desarrollo web",
      "paginas web next.js",
      "desarrollo web a medida",
      "web app custom",
      "diseño web premium",
    ],
    relacionados: ["sitios-corporativos-seo", "apps-moviles-nativas", "tienda-online-ia"],
  },

  // ============================================================
  // BLOQUE — IA (el gancho moderno)
  // ============================================================
  {
    slug: "bots-whatsapp-ia",
    categoria: "ia",
    titulo: "Bots de WhatsApp con IA",
    titulo_hero: "Bots de WhatsApp con IA para empresas en Colombia",
    tagline: "Atienden, cotizan y venden 24/7",
    descripcion_card: "Un asistente que responde a tus clientes en WhatsApp cuando vos no podés — agenda citas, cotiza, cierra ventas y nunca se cansa.",
    descripcion_meta: "Bots de WhatsApp con IA que atienden a tus clientes 24/7, agendan citas, cotizan y cierran ventas. Integración con WhatsApp Business API oficial.",
    icono: MessageCircle,
    pills: ["WhatsApp Business API", "IA Gemini", "24/7"],
    destacado: true,
    color: "cyan",
    problema: {
      titulo: "Estás perdiendo ventas mientras dormís",
      puntos: [
        "El cliente pregunta a las 11pm y tu competencia responde primero al otro día",
        "Atender WhatsApp manualmente mata la productividad del equipo",
        "Preguntas repetidas (precios, horarios, ubicación) consumen horas de tu gente",
        "Los leads se enfrían si no contestás en los primeros 5 minutos",
      ],
    },
    pasos: [
      { titulo: "Entrenamos al bot con tu información", descripcion: "Le cargamos tu catálogo, precios, políticas, FAQ y tono de voz para que hable como tu marca." },
      { titulo: "Conectamos WhatsApp Business API oficial", descripcion: "Sin riesgo de baneo. Tu número verificado y listo para miles de mensajes simultáneos." },
      { titulo: "Definimos flujos y escalamiento", descripcion: "El bot resuelve lo común y te pasa el control cuando el cliente quiere hablar con humano." },
      { titulo: "Medimos y afinamos", descripcion: "Dashboard con métricas: leads atendidos, citas agendadas, conversiones. Iteramos el bot mes a mes." },
    ],
    casos: [
      { industria: "Inmobiliarias", descripcion: "El bot muestra propiedades según presupuesto, agenda visitas y filtra curiosos de compradores reales." },
      { industria: "Clínicas y consultorios", descripcion: "Agenda citas, recuerda turnos, responde dudas sobre servicios y precios." },
      { industria: "E-commerce", descripcion: "Recupera carritos abandonados, rastrea envíos y responde preguntas de producto." },
      { industria: "Servicios profesionales", descripcion: "Cotiza proyectos según inputs del cliente y deriva al vendedor cuando la venta está caliente." },
    ],
    faq: [
      { pregunta: "¿WhatsApp me va a banear el número?", respuesta: "No. Usamos WhatsApp Business Cloud API oficial de Meta. Tu número queda verificado y cumple con todas las políticas de WhatsApp." },
      { pregunta: "¿Qué pasa cuando el bot no sabe algo?", respuesta: "Detecta que no sabe, te avisa y transfiere la conversación a un humano sin que el cliente lo note." },
      { pregunta: "¿Puedo cambiar lo que dice el bot?", respuesta: "Sí. Cada negocio es distinto. Actualizamos el conocimiento del bot cada vez que cambian tus precios, promos o políticas." },
      { pregunta: "¿Cuánto cuesta?", respuesta: "Depende del volumen de mensajes y la complejidad del flujo. Te armamos una cotización a la medida tras entender tu caso." },
      { pregunta: "¿Funciona en otros idiomas?", respuesta: "Sí. El bot puede atender en español, inglés, portugués o cualquier idioma que necesite tu negocio." },
    ],
    keywords: [
      "bot whatsapp",
      "chatbot whatsapp empresas",
      "whatsapp business api colombia",
      "automatizacion whatsapp",
      "atencion al cliente 24/7 whatsapp",
      "bot ia para negocios",
    ],
    relacionados: ["agente-ia-personalizado", "crm-inteligente", "automatizacion-procesos"],
  },

  {
    slug: "agente-ia-personalizado",
    categoria: "ia",
    titulo: "Agente IA entrenado con tu negocio",
    titulo_hero: "Agentes de IA personalizados entrenados con la información de tu empresa",
    tagline: "Un ChatGPT que habla TU negocio",
    descripcion_card: "Un asistente que conoce tus precios, productos, políticas y responde como vos — no como un ChatGPT genérico.",
    descripcion_meta: "Creamos agentes de IA personalizados entrenados con los datos de tu empresa. Atención especializada en web, chat interno o WhatsApp.",
    icono: Bot,
    pills: ["IA Custom", "RAG", "Embebible"],
    destacado: false,
    color: "purple",
    problema: {
      titulo: "ChatGPT no conoce tu negocio",
      puntos: [
        "Los clientes preguntan cosas específicas que la IA genérica no sabe responder",
        "Tu equipo pierde horas explicando lo mismo una y otra vez",
        "El onboarding de empleados nuevos es lento porque toda la info está dispersa",
        "Querés un chat inteligente en tu web pero no que invente respuestas",
      ],
    },
    pasos: [
      { titulo: "Recolección de conocimiento", descripcion: "Ingestamos tus documentos, manuales, catálogos, políticas y cualquier fuente de información relevante." },
      { titulo: "Entrenamiento con RAG", descripcion: "Usamos recuperación aumentada por generación para que el agente cite fuentes reales y no alucine." },
      { titulo: "Integración en tu canal", descripcion: "Lo embebemos en tu web, WhatsApp, Slack interno o el canal que uses." },
      { titulo: "Iteración continua", descripcion: "Revisamos conversaciones reales y ajustamos el modelo para subir la tasa de respuestas correctas." },
    ],
    casos: [
      { industria: "E-commerce", descripcion: "Asiste en compras recomendando productos según preguntas en lenguaje natural." },
      { industria: "Empresas grandes", descripcion: "Chat interno para que empleados consulten políticas de RRHH, procesos o documentación técnica." },
      { industria: "Educación", descripcion: "Tutor IA que responde dudas de estudiantes con el material del curso." },
      { industria: "SaaS", descripcion: "Soporte técnico de primer nivel sin pasar por humanos." },
    ],
    faq: [
      { pregunta: "¿El agente puede inventar información?", respuesta: "Mitigamos alucinaciones con arquitectura RAG — el agente responde solo con lo que está en tu base de conocimiento y cita la fuente." },
      { pregunta: "¿Cómo actualizo su conocimiento?", respuesta: "Te damos un panel para subir o reemplazar documentos. El agente se re-entrena automáticamente." },
      { pregunta: "¿Puede aprender solo con el tiempo?", respuesta: "Sí. Monitoreamos conversaciones y las usamos para afinar al agente mes a mes." },
      { pregunta: "¿Dónde lo puedo embeber?", respuesta: "Widget de web, app móvil, Slack, Microsoft Teams, WhatsApp o como API para tu software." },
    ],
    keywords: [
      "agente ia personalizado",
      "chatbot empresa custom",
      "ia entrenada con mis datos",
      "rag colombia",
      "asistente virtual negocio",
      "chat inteligente web",
    ],
    relacionados: ["bots-whatsapp-ia", "crm-inteligente", "sitios-corporativos-seo"],
  },

  {
    slug: "crm-inteligente",
    categoria: "ia",
    titulo: "CRM inteligente con IA predictiva",
    titulo_hero: "CRM con inteligencia artificial que predice qué cliente va a comprar",
    tagline: "Tu CRM te dice dónde enfocar",
    descripcion_card: "Un CRM que no solo guarda contactos — analiza comportamiento, califica leads y te avisa cuándo un cliente está por irse.",
    descripcion_meta: "CRM con IA que prioriza leads, predice ventas y alerta cuando un cliente está por abandonarte. Diseñado para equipos comerciales de alto rendimiento.",
    icono: Database,
    pills: ["Lead scoring IA", "Alertas de churn", "Dashboard"],
    destacado: true,
    color: "cyan",
    problema: {
      titulo: "Tu equipo no sabe a quién llamar primero",
      puntos: [
        "Tenés 500 leads y nadie sabe cuáles están calientes",
        "Perdés clientes sin darte cuenta porque llevaban semanas sin interactuar",
        "Los vendedores reportan en Excel y el seguimiento se pierde",
        "No tenés claro qué campaña o canal trae los mejores clientes",
      ],
    },
    pasos: [
      { titulo: "Migramos tu data actual", descripcion: "Excel, HubSpot, Pipedrive — traemos tus clientes y los deduplicamos." },
      { titulo: "Entrenamos el lead scoring", descripcion: "La IA aprende de tu historial qué comportamientos predicen una venta." },
      { titulo: "Configuramos alertas", descripcion: "Notificaciones al vendedor cuando un lead califica como caliente o cuando un cliente muestra señales de churn." },
      { titulo: "Integramos con tus canales", descripcion: "WhatsApp, email, calendario y tu sitio web — todo alimenta al CRM." },
    ],
    casos: [
      { industria: "Agencias B2B", descripcion: "Priorizá leads calientes y reactivá clientes inactivos automáticamente." },
      { industria: "Educación", descripcion: "Identificá estudiantes prospecto con mayor probabilidad de inscribirse al próximo ciclo." },
      { industria: "Servicios financieros", descripcion: "Alertas cuando un cliente deja de usar tu producto — actúa antes de que se vaya." },
      { industria: "Inmobiliarias", descripcion: "Scoring automático según presupuesto, urgencia e interacciones con propiedades." },
    ],
    faq: [
      { pregunta: "¿Tengo que botar el CRM que uso?", respuesta: "No necesariamente. Podemos integrarnos con HubSpot o Pipedrive y enriquecerlos con nuestra capa de IA." },
      { pregunta: "¿Cuánta data necesita la IA para funcionar?", respuesta: "Con unos 100-200 clientes históricos ya empieza a dar predicciones útiles. Mejora mes a mes." },
      { pregunta: "¿Puedo ver por qué un lead está caliente?", respuesta: "Sí. El dashboard explica qué señales disparan el scoring (visitas al sitio, respuestas, aperturas de email, etc.)." },
      { pregunta: "¿Cumple con protección de datos?", respuesta: "Sí. Respetamos la Ley 1581 de Colombia y políticas de protección de datos personales." },
    ],
    keywords: [
      "crm con inteligencia artificial",
      "lead scoring automatico",
      "crm colombia",
      "prediccion ventas ia",
      "software ventas b2b",
      "crm para empresas",
    ],
    relacionados: ["bots-whatsapp-ia", "automatizacion-procesos", "integraciones-backoffice"],
  },

  {
    slug: "automatizacion-procesos",
    categoria: "ia",
    titulo: "Automatización de procesos",
    titulo_hero: "Automatización de procesos empresariales (RPA) — que los bots hagan lo repetitivo",
    tagline: "Deja de hacer a mano lo que un bot puede hacer",
    descripcion_card: "Liberamos a tu equipo de tareas repetitivas — facturas, reportes, sincronizaciones, notificaciones — todo corriendo solo mientras duermen.",
    descripcion_meta: "Automatización de procesos (RPA) para empresas. Bots que hacen tareas repetitivas: reportes, sincronizaciones, facturas, notificaciones.",
    icono: Workflow,
    pills: ["RPA", "Zapier / Make", "Cron jobs"],
    destacado: true,
    color: "purple",
    problema: {
      titulo: "Tu equipo humano hace trabajo de robot",
      puntos: [
        "Alguien pasa horas al mes copiando datos de un sistema a otro",
        "Los reportes semanales se arman a mano cada vez",
        "Las notificaciones a clientes (facturación, recordatorios) se envían manual",
        "Contratar a otra persona cuesta más que automatizar el proceso",
      ],
    },
    pasos: [
      { titulo: "Diagnóstico de procesos", descripcion: "Mapeamos qué tareas consumen más tiempo y cuáles son candidatas a automatizar." },
      { titulo: "Diseño del flujo automatizado", descripcion: "Definimos triggers, pasos, manejo de errores y notificaciones." },
      { titulo: "Implementación", descripcion: "Según complejidad usamos Zapier, Make, scripts custom o RPA con navegador headless." },
      { titulo: "Monitoreo", descripcion: "Te damos dashboard de ejecuciones y alertas si algo falla." },
    ],
    casos: [
      { industria: "Contabilidad", descripcion: "Lectura de facturas, carga automática al sistema contable, envío de recordatorios de pago." },
      { industria: "Marketing", descripcion: "Sincronización de leads entre Meta Ads, Google Ads y tu CRM sin exportar CSVs." },
      { industria: "Operaciones", descripcion: "Generación y envío automático de reportes diarios/semanales a stakeholders." },
      { industria: "E-commerce", descripcion: "Sincronización de inventario entre Shopify, MercadoLibre, Amazon y tu bodega física." },
    ],
    faq: [
      { pregunta: "¿Qué tareas se pueden automatizar?", respuesta: "Cualquier proceso repetitivo basado en reglas. Si vos o tu equipo hacen lo mismo cada día/semana, probablemente se puede automatizar." },
      { pregunta: "¿Cuánto tarda implementar una automatización?", respuesta: "Flujos simples: días. Flujos complejos con múltiples sistemas: 2-4 semanas." },
      { pregunta: "¿Qué pasa si la automatización falla?", respuesta: "Configuramos reintentos, alertas y fallbacks. Vos recibís notificación inmediata si algo necesita atención humana." },
      { pregunta: "¿Puedo ver qué está haciendo el bot?", respuesta: "Sí. Te damos un panel con el log de cada ejecución y métricas de ahorro de tiempo." },
    ],
    keywords: [
      "automatizacion procesos empresa",
      "rpa colombia",
      "zapier make colombia",
      "automatizacion tareas repetitivas",
      "bot tareas oficina",
      "integracion sistemas",
    ],
    relacionados: ["integraciones-backoffice", "crm-inteligente", "lector-documentos-ia"],
  },

  {
    slug: "lector-documentos-ia",
    categoria: "ia",
    titulo: "Lector de facturas y documentos con IA",
    titulo_hero: "OCR con IA — subí una foto, nosotros extraemos los datos",
    tagline: "Cero digitación manual",
    descripcion_card: "Subí facturas, recibos, cédulas o contratos. La IA lee, extrae y carga los datos directo a tu sistema — sin digitación.",
    descripcion_meta: "OCR con inteligencia artificial para facturas, recibos, contratos y documentos. Extracción automática de datos e integración con tu sistema.",
    icono: FileScan,
    pills: ["OCR IA", "Extracción estructurada", "Integración contable"],
    destacado: false,
    color: "cyan",
    problema: {
      titulo: "Tipear facturas manualmente es perder dinero",
      puntos: [
        "Alguien pasa horas digitando facturas de proveedores al sistema contable",
        "Los errores de transcripción generan problemas con la DIAN",
        "Las imágenes de WhatsApp o fotos borrosas no las lee tu software actual",
        "Los contratos se firman y los datos clave quedan enterrados en PDFs",
      ],
    },
    pasos: [
      { titulo: "Identificación de documentos", descripcion: "Definimos qué tipos vas a procesar: facturas, cédulas, contratos, recibos de caja, actas." },
      { titulo: "Entrenamiento del extractor", descripcion: "Ajustamos la IA a los formatos específicos de tus proveedores o de tus documentos internos." },
      { titulo: "Integración con tu sistema", descripcion: "Los datos extraídos van directo a tu contable, ERP, CRM o a donde los necesites." },
      { titulo: "Validación humana", descripcion: "Los casos dudosos los revisa una persona — el resto se procesa solo." },
    ],
    casos: [
      { industria: "Contabilidad y finanzas", descripcion: "Facturas de proveedores automáticamente capturadas en Siigo, Alegra o Contapyme." },
      { industria: "Inmobiliarias", descripcion: "Lectura automática de cédulas, RUT, contratos de arrendamiento y pagos." },
      { industria: "Salud", descripcion: "Digitalización de historias clínicas en papel, órdenes médicas y recetas." },
      { industria: "Logística", descripcion: "Guías de despacho, actas de entrega y remisiones capturadas desde foto en el celular." },
    ],
    faq: [
      { pregunta: "¿Qué tan preciso es?", respuesta: "Sobre documentos claros: 95%+ de precisión. Para documentos borrosos o muy poco contraste, marcamos los campos dudosos para revisión." },
      { pregunta: "¿Funciona con facturas electrónicas colombianas?", respuesta: "Sí. Extraemos datos de facturas electrónicas DIAN y también de facturas físicas escaneadas." },
      { pregunta: "¿Puedo cargar documentos en lote?", respuesta: "Sí. Podés subir 100 documentos a la vez y procesarlos en paralelo." },
      { pregunta: "¿Se integra con Siigo o Alegra?", respuesta: "Sí. Armamos integración directa con los softwares contables más usados en Colombia." },
    ],
    keywords: [
      "ocr inteligencia artificial",
      "lector facturas automatico",
      "digitalizacion documentos colombia",
      "extraccion datos pdf",
      "automatizacion contabilidad",
      "ocr siigo alegra",
    ],
    relacionados: ["automatizacion-procesos", "integraciones-backoffice", "agente-ia-personalizado"],
  },

  {
    slug: "generador-contenido-redes",
    categoria: "ia",
    titulo: "Generador de contenido para redes con IA",
    titulo_hero: "Posts de Instagram y TikTok generados automáticamente con IA",
    tagline: "30 días de contenido en 10 minutos",
    descripcion_card: "Subí tus productos, la IA arma posts, reels, carruseles y textos listos para publicar — con tu estilo y tus colores de marca.",
    descripcion_meta: "Generador de contenido para redes sociales con IA. Posts, reels, carruseles y copys listos para publicar en Instagram, TikTok y Facebook.",
    icono: Sparkles,
    pills: ["Generación con IA", "Multicanal", "Agendador"],
    destacado: false,
    color: "purple",
    problema: {
      titulo: "Las redes consumen tu mes entero",
      puntos: [
        "Armar 1 post toma 30 minutos entre foto, edición y copy",
        "Te quedás sin ideas a la tercera semana del mes",
        "Contratar community manager cuesta millones al mes",
        "Publicás inconsistente y el algoritmo te castiga",
      ],
    },
    pasos: [
      { titulo: "Cargamos tu marca", descripcion: "Colores, fuentes, tono de voz, productos, público objetivo. La IA aprende tu estilo." },
      { titulo: "Generación masiva", descripcion: "En un clic generás 30 posts variados: productos, consejos, testimonios, promociones." },
      { titulo: "Edición y aprobación", descripcion: "Revisás los posts en un panel estilo Instagram. Editás lo que quieras antes de publicar." },
      { titulo: "Programación", descripcion: "Agendás automáticamente a Instagram, Facebook, TikTok y LinkedIn." },
    ],
    casos: [
      { industria: "Moda y retail", descripcion: "Catálogo → posts de producto automáticamente con copy de venta listo." },
      { industria: "Restaurantes", descripcion: "Menú del día, promos y reels de platos generados a partir de fotos del celular." },
      { industria: "Influencers y marca personal", descripcion: "Contenido educativo y promocional consistente sin depender de tu inspiración diaria." },
      { industria: "Servicios profesionales", descripcion: "Abogados, médicos, coaches — posts educativos que posicionan tu expertise." },
    ],
    faq: [
      { pregunta: "¿Los posts se ven con cara de IA genérica?", respuesta: "No. La IA respeta tus colores, fuentes y estilo. Salen posts de tu marca, no plantillas de Canva." },
      { pregunta: "¿Puedo editar antes de publicar?", respuesta: "Sí. Revisás cada post y lo ajustás antes de que salga. También podés regenerar si algo no te gusta." },
      { pregunta: "¿Qué redes soporta?", respuesta: "Instagram, Facebook, TikTok, LinkedIn y X (Twitter)." },
      { pregunta: "¿Cómo se conecta con mi cuenta?", respuesta: "Vía API oficial de cada red. Sin riesgo de baneo por automatización." },
    ],
    keywords: [
      "generador contenido ia",
      "posts instagram automaticos",
      "ia redes sociales",
      "community manager ia",
      "automatizacion redes sociales",
      "social media colombia",
    ],
    relacionados: ["agente-ia-personalizado", "tienda-online-ia", "automatizacion-procesos"],
  },

  // ============================================================
  // BLOQUE — SISTEMAS DE NEGOCIO (clásicos reinventados)
  // ============================================================
  {
    slug: "delivery-inteligente",
    categoria: "sistema",
    titulo: "Delivery inteligente con IA",
    titulo_hero: "Sistema de delivery con tracking en vivo e IA que predice tiempos de entrega",
    tagline: "Tu propio Rappi, sin comisiones",
    descripcion_card: "Tu propio sistema de pedidos: menú con carrito, asignación inteligente de domicilios, tracking en mapa y ETA predicho por IA.",
    descripcion_meta: "Sistema de delivery a la medida. Menú digital, carrito, pagos, tracking en vivo con mapa y predicción de tiempo de entrega con IA.",
    icono: Truck,
    pills: ["Tracking en vivo", "ETA con IA", "Pagos integrados"],
    destacado: false,
    color: "cyan",
    problema: {
      titulo: "Rappi se lleva el 30% de cada pedido",
      puntos: [
        "Las comisiones de apps de delivery te comen el margen",
        "No tenés los datos de tus propios clientes — son de Rappi",
        "No podés correr promociones a tu base propia",
        "Los clientes se sienten más leales a la app que a tu marca",
      ],
    },
    pasos: [
      { titulo: "Menú digital con tu branding", descripcion: "Tu carta online con fotos, modificadores, combos y recomendaciones del día." },
      { titulo: "Carrito y pagos", descripcion: "Checkout con Wompi, Bold, MercadoPago, PayU o efectivo contraentrega." },
      { titulo: "Asignación de domiciliarios", descripcion: "Algoritmo que asigna al domiciliario más cercano y agrupa pedidos por zona." },
      { titulo: "Tracking para el cliente", descripcion: "Mapa en vivo, ETA predicho por IA y notificaciones WhatsApp automáticas." },
    ],
    casos: [
      { industria: "Restaurantes", descripcion: "Menú digital + domicilios propios + programa de fidelización — recuperás tu margen." },
      { industria: "Heladerías y postres", descripcion: "Pedidos rápidos con slot de entrega y ventana de tiempo antes de que se derrita." },
      { industria: "Comida saludable y meal prep", descripcion: "Pedidos semanales recurrentes con suscripción y entrega programada." },
      { industria: "Supermercados de barrio", descripcion: "Catálogo de productos con stock en vivo y domicilios en tu zona." },
    ],
    faq: [
      { pregunta: "¿Necesito tener domiciliarios propios?", respuesta: "No necesariamente. Podemos integrar con flota tercerizada o con apps existentes como Picap." },
      { pregunta: "¿Qué pasarelas de pago soporta?", respuesta: "Wompi, Bold, MercadoPago, PayU, Nequi, Daviplata y efectivo contraentrega." },
      { pregunta: "¿Funciona en WhatsApp también?", respuesta: "Sí. Podemos integrar un bot WhatsApp que lleva al cliente al menú o le arma el pedido por chat." },
      { pregunta: "¿Cuánto me ahorro vs Rappi?", respuesta: "Rappi cobra 20-30% por pedido. Nuestra solución tiene costo fijo mensual — si tenés volumen, la diferencia es brutal." },
    ],
    keywords: [
      "sistema delivery propio",
      "aplicacion restaurante",
      "menu digital qr",
      "domicilios sin rappi",
      "app pedidos restaurante",
      "sistema pedidos online",
    ],
    relacionados: ["tienda-online-ia", "apps-moviles-nativas", "fidelizacion-gamificada"],
  },

  {
    slug: "sistema-reservas",
    categoria: "sistema",
    titulo: "Sistema de reservas inteligente",
    titulo_hero: "Sistema de reservas online con confirmación automática y lista de espera inteligente",
    tagline: "Agenda llena sin mover un dedo",
    descripcion_card: "Calendario online por profesional, confirmaciones automáticas por WhatsApp, recordatorios, lista de espera y anti no-show.",
    descripcion_meta: "Sistema de reservas online para salones, clínicas, barberías y consultorios. Agenda por profesional, recordatorios WhatsApp y gestión de no-show.",
    icono: CalendarCheck,
    pills: ["Agenda online", "Recordatorios WhatsApp", "Anti no-show"],
    destacado: true,
    color: "purple",
    problema: {
      titulo: "Las reservas por teléfono son un caos",
      puntos: [
        "Tu recepcionista pasa todo el día atendiendo llamadas para agendar",
        "Los clientes llaman fuera de horario y pierden la reserva",
        "No-shows te cuestan dinero cada semana",
        "La agenda en Excel o cuaderno da errores y choques de turnos",
      ],
    },
    pasos: [
      { titulo: "Agenda por profesional", descripcion: "Cada profesional tiene su disponibilidad, duración de servicios y días libres." },
      { titulo: "Reserva autoservicio", descripcion: "El cliente reserva desde tu web o un link de WhatsApp en 30 segundos." },
      { titulo: "Recordatorios automáticos", descripcion: "WhatsApp 24h y 2h antes de la cita. Confirma, reagenda o cancela con un botón." },
      { titulo: "Lista de espera", descripcion: "Si alguien cancela, el sistema ofrece el cupo al siguiente en lista automáticamente." },
    ],
    casos: [
      { industria: "Barberías y salones", descripcion: "Reservá con tu barbero favorito según disponibilidad real y duración del servicio." },
      { industria: "Clínicas y consultorios", descripcion: "Pacientes agendan desde su celular, reciben recordatorios y confirman con un clic." },
      { industria: "Spa y estética", descripcion: "Paquetes de servicios, promos y gift cards integradas en la reserva." },
      { industria: "Talleres y repuestos", descripcion: "Agenda de citas para mantenimiento con capacidad por bahía y técnico especializado." },
    ],
    faq: [
      { pregunta: "¿Cobro un abono para evitar no-shows?", respuesta: "Sí. Podés pedir un abono o cargar una tarjeta al reservar. Si el cliente no llega, se cobra la penalidad automáticamente." },
      { pregunta: "¿Se integra con Google Calendar?", respuesta: "Sí. Cada profesional puede ver sus citas sincronizadas en Google Calendar." },
      { pregunta: "¿Los recordatorios son por WhatsApp?", respuesta: "Sí, y también por SMS o email. WhatsApp tiene mejor tasa de lectura." },
      { pregunta: "¿Se puede usar desde el celular del profesional?", respuesta: "Sí. Tiene app web optimizada para que el profesional gestione desde su celular." },
    ],
    keywords: [
      "sistema reservas online",
      "agenda online barberia",
      "software reservas clinica",
      "citas online salon belleza",
      "agendamiento automatico",
      "recordatorios whatsapp citas",
    ],
    relacionados: ["bots-whatsapp-ia", "apps-moviles-nativas", "fidelizacion-gamificada"],
  },

  {
    slug: "tienda-online-ia",
    categoria: "sistema",
    titulo: "Tienda online con recomendador IA",
    titulo_hero: "E-commerce inteligente con recomendador IA y recuperación de carrito por WhatsApp",
    tagline: "Vendé más a los mismos visitantes",
    descripcion_card: "Catálogo con carrito, pagos seguros, recomendador IA que sube ticket promedio y bot WhatsApp que recupera carritos abandonados.",
    descripcion_meta: "Tienda online a la medida con recomendador IA, recuperación de carrito abandonado, pagos integrados y panel de inventario.",
    icono: ShoppingBag,
    pills: ["Recomendador IA", "Carrito abandonado", "Pagos integrados"],
    destacado: true,
    color: "cyan",
    problema: {
      titulo: "Tu tienda online vende menos de lo que debería",
      puntos: [
        "70% de los carritos se abandonan sin que nadie haga nada",
        "Los clientes ven 1 producto y se van — nadie les recomienda otro",
        "Shopify y WooCommerce te limitan y cobran comisión eterna",
        "El catálogo es estático — no se adapta a lo que cada cliente prefiere",
      ],
    },
    pasos: [
      { titulo: "Catálogo inteligente", descripcion: "Productos con fotos, variantes, stock, SEO optimizado y filtros por atributos." },
      { titulo: "Recomendador IA", descripcion: "Sugiere productos relacionados en carrito, checkout y después de la compra." },
      { titulo: "Recuperación de carrito", descripcion: "Bot WhatsApp que contacta al cliente 1h después con descuento personalizado." },
      { titulo: "Panel completo", descripcion: "Inventario, pedidos, envíos, clientes — todo desde un solo admin." },
    ],
    casos: [
      { industria: "Moda y accesorios", descripcion: "Recomendador que sugiere looks completos — pantalón + camisa + zapatos." },
      { industria: "Alimentos y bebidas", descripcion: "Carritos recurrentes, suscripción semanal y combos con precio dinámico." },
      { industria: "Electrónica", descripcion: "Comparador de productos, especificaciones técnicas y cross-sell de accesorios." },
      { industria: "Cosmética", descripcion: "Quiz de producto según tipo de piel y recomendación personalizada." },
    ],
    faq: [
      { pregunta: "¿Qué diferencia hay con Shopify?", respuesta: "Sin comisión por venta, sin límites de apps, código tuyo, integración con tu operación real y IA entrenada específicamente para tu catálogo." },
      { pregunta: "¿Qué pasarelas soporta?", respuesta: "Wompi, Bold, MercadoPago, PayU, ePayco, Addi, Sistecrédito y efectivo." },
      { pregunta: "¿Migrás mi tienda actual?", respuesta: "Sí. Traemos productos, imágenes, clientes, pedidos históricos y redirecciones SEO para no perder tráfico." },
      { pregunta: "¿Se integra con MercadoLibre?", respuesta: "Sí. Sincronización de inventario con MercadoLibre, Linio, Éxito y marketplaces." },
    ],
    keywords: [
      "tienda online colombia",
      "ecommerce personalizado",
      "tienda virtual ia",
      "recomendador productos",
      "recuperar carrito abandonado",
      "tienda online wompi",
    ],
    relacionados: ["bots-whatsapp-ia", "apps-moviles-nativas", "integraciones-backoffice"],
  },

  {
    slug: "historia-clinica-voz",
    categoria: "sistema",
    titulo: "Historia clínica con dictado por voz",
    titulo_hero: "Historia clínica electrónica con dictado por voz — IA transcribe mientras atendés",
    tagline: "Atendé, no escribás",
    descripcion_card: "Dictás la consulta, la IA transcribe y estructura la historia clínica, receta y orden médica — vos solo revisás y firmás.",
    descripcion_meta: "Historia clínica electrónica con transcripción por voz usando IA. Ideal para consultorios, clínicas y profesionales de la salud.",
    icono: Stethoscope,
    pills: ["Speech-to-text IA", "RIPS", "Historia clínica estructurada"],
    destacado: false,
    color: "purple",
    problema: {
      titulo: "Tipear la historia te roba la consulta",
      puntos: [
        "Pasás más tiempo mirando la pantalla que al paciente",
        "Cada consulta sale con historia incompleta porque no hay tiempo de escribir",
        "Las historias en papel se pierden o son ilegibles",
        "La DIAN y los RIPS requieren historia estructurada que tu software actual no genera bien",
      ],
    },
    pasos: [
      { titulo: "Dictado durante consulta", descripcion: "Hablás como si dictaras a una secretaria. La IA escucha y va estructurando en tiempo real." },
      { titulo: "Estructuración automática", descripcion: "Motivo de consulta, anamnesis, examen físico, diagnóstico y plan — cada parte en su lugar." },
      { titulo: "Receta y orden médica", descripcion: "Generadas con base en el diagnóstico y firma digital lista para imprimir o enviar por WhatsApp." },
      { titulo: "Revisión y firma", descripcion: "Vos revisás, corregís lo mínimo y firmás. La historia queda guardada con respaldo legal." },
    ],
    casos: [
      { industria: "Medicina general y especialistas", descripcion: "Consulta completa sin tocar teclado. Más tiempo con el paciente, más pacientes por día." },
      { industria: "Odontología", descripcion: "Odontograma digital, plan de tratamiento y seguimiento por fase." },
      { industria: "Psicología", descripcion: "Notas de sesión estructuradas con seguimiento de objetivos y evolución." },
      { industria: "Veterinaria", descripcion: "Historia por paciente (mascota) con vacunas, cirugías y tratamientos." },
    ],
    faq: [
      { pregunta: "¿Cumple con normativa de historia clínica en Colombia?", respuesta: "Sí. Cumplimos con la Resolución 1995 de 1999 y generamos RIPS si los necesitás." },
      { pregunta: "¿La transcripción funciona con acento colombiano?", respuesta: "Sí. La IA está entrenada en español LatAm incluyendo términos médicos y medicamentos locales." },
      { pregunta: "¿Los datos están seguros?", respuesta: "Sí. Cifrado extremo a extremo, respaldo diario y cumplimiento con Ley 1581 de protección de datos." },
      { pregunta: "¿Se integra con aseguradoras y EPS?", respuesta: "Sí. Generamos RIPS, facturación electrónica y conexión con las principales EPS colombianas." },
    ],
    keywords: [
      "historia clinica electronica colombia",
      "software consultorio medico",
      "dictado por voz medico",
      "hc electronica odontologo",
      "rips colombia",
      "software clinica ia",
    ],
    relacionados: ["sistema-reservas", "agente-ia-personalizado", "integraciones-backoffice"],
  },

  {
    slug: "control-asistencia-facial",
    categoria: "sistema",
    titulo: "Control de asistencia con reconocimiento facial",
    titulo_hero: "Control de acceso y asistencia por reconocimiento facial — sin huella, sin tarjeta",
    tagline: "La cara es la contraseña",
    descripcion_card: "Empleados o miembros entran con solo mirar la cámara. Reportes automáticos de horas trabajadas, tardanzas y ausencias.",
    descripcion_meta: "Sistema de control de asistencia con reconocimiento facial por IA para empresas, gimnasios y clubes. Reportes automáticos y control de acceso.",
    icono: ScanFace,
    pills: ["Reconocimiento facial", "Reportes automáticos", "Anti-fraude"],
    destacado: false,
    color: "cyan",
    problema: {
      titulo: "Las huellas y tarjetas tienen problemas",
      puntos: [
        "Los empleados 'se marcan' entre sí con huella prestada",
        "Las tarjetas se pierden, se prestan o se clonan",
        "Calcular las horas trabajadas cada quincena es un dolor de cabeza",
        "No tenés cómo saber quién entró y cuándo en tus instalaciones",
      ],
    },
    pasos: [
      { titulo: "Enrolamiento", descripcion: "Los empleados o miembros se registran una vez con una foto. El sistema aprende sus rasgos." },
      { titulo: "Reconocimiento en cámara", descripcion: "Instalamos cámaras en accesos. El sistema identifica a la persona en menos de 1 segundo." },
      { titulo: "Registro automático", descripcion: "Cada entrada y salida queda grabada con foto, hora y ubicación." },
      { titulo: "Reportes y nómina", descripcion: "Horas trabajadas, extras, tardanzas y ausencias — exportables para nómina." },
    ],
    casos: [
      { industria: "Empresas y oficinas", descripcion: "Control de entrada de empleados con reportes para nómina y compliance laboral." },
      { industria: "Gimnasios y clubes", descripcion: "Acceso de miembros según plan vigente. Si caducó la membresía, no entra." },
      { industria: "Instituciones educativas", descripcion: "Asistencia de estudiantes y alerta automática a padres cuando un niño llega o se va." },
      { industria: "Obras y construcción", descripcion: "Control de cuadrillas en obra con cámaras robustas y reportes por proyecto." },
    ],
    faq: [
      { pregunta: "¿Funciona con tapabocas o lentes?", respuesta: "Sí. La IA reconoce con tapabocas, lentes oscuros, barba o cambios de peinado." },
      { pregunta: "¿Y si alguien intenta engañar con una foto?", respuesta: "El sistema tiene detección de vida (liveness) — descarta fotos, videos y máscaras." },
      { pregunta: "¿Cumple con protección de datos biométricos?", respuesta: "Sí. Almacenamos embeddings encriptados, no fotos. Cumple con Ley 1581." },
      { pregunta: "¿Qué pasa si se va la luz o internet?", respuesta: "El dispositivo funciona offline y sincroniza cuando vuelve la conexión." },
    ],
    keywords: [
      "control asistencia reconocimiento facial",
      "control acceso empresa",
      "biometrico facial colombia",
      "nomina automatica",
      "asistencia empleados ia",
      "control gimnasio miembros",
    ],
    relacionados: ["automatizacion-procesos", "integraciones-backoffice", "apps-moviles-nativas"],
  },

  {
    slug: "fidelizacion-gamificada",
    categoria: "sistema",
    titulo: "Fidelización gamificada",
    titulo_hero: "Programa de fidelización con puntos, niveles y misiones — clientes que vuelven",
    tagline: "Clientes que juegan, vuelven",
    descripcion_card: "Puntos por compra, niveles, misiones, cumpleaños y recompensas. Tu cliente se engancha como con un videojuego.",
    descripcion_meta: "Programa de fidelización gamificado con puntos, niveles, misiones y recompensas. Ideal para retail, restaurantes, gimnasios y servicios.",
    icono: Trophy,
    pills: ["Puntos y niveles", "Push notifications", "Gamificación"],
    destacado: true,
    color: "purple",
    problema: {
      titulo: "Traer un cliente nuevo cuesta 5x más que mantener uno",
      puntos: [
        "Tus clientes compran una vez y no vuelven",
        "Los programas de puntos tradicionales son aburridos y nadie los usa",
        "No sabés cuáles son tus clientes VIP ni cómo premiarlos",
        "Las promos van para todos — sin personalización ni exclusividad",
      ],
    },
    pasos: [
      { titulo: "Diseño del programa", descripcion: "Definimos puntos por compra, niveles (Bronce, Plata, Oro, Platino) y recompensas por nivel." },
      { titulo: "App o panel web para el cliente", descripcion: "Ve sus puntos, nivel, misiones activas y recompensas disponibles." },
      { titulo: "Misiones y retos", descripcion: "'Comprá 3 veces este mes y ganá 500 puntos' — el cliente se engancha." },
      { titulo: "Notificaciones push", descripcion: "Cumpleaños, ofertas exclusivas de su nivel, recordatorios de puntos por vencer." },
    ],
    casos: [
      { industria: "Cafeterías y restaurantes", descripcion: "Cada compra suma puntos. Al llegar a nivel Oro desbloquea promos exclusivas." },
      { industria: "Gimnasios", descripcion: "Asistencia frecuente sube nivel. Nivel alto = acceso a clases premium." },
      { industria: "Retail y moda", descripcion: "Primera compra: Bronce. Nivel máximo: acceso a preventas y eventos privados." },
      { industria: "Servicios", descripcion: "Barberías, salones, veterinarias — la sexta visita es gratis, y el cliente lo ve en su app." },
    ],
    faq: [
      { pregunta: "¿Cómo sumo los puntos al cliente?", respuesta: "Según tu canal: app, QR en caja, bot WhatsApp o integración directa con tu POS." },
      { pregunta: "¿Se integra con mi sistema actual?", respuesta: "Sí. Conectamos con Shopify, WooCommerce, Siigo, Alegra o sistemas POS vía API." },
      { pregunta: "¿Necesito una app?", respuesta: "No obligatorio. Podés empezar con un portal web responsive y migrar a app móvil nativa después." },
      { pregunta: "¿Qué métricas me da?", respuesta: "Clientes activos, frecuencia de compra, ticket promedio por nivel, churn rate y ROI del programa." },
    ],
    keywords: [
      "programa fidelizacion clientes",
      "puntos recompensas negocio",
      "gamificacion clientes",
      "app fidelizacion colombia",
      "retencion clientes",
      "programa puntos restaurante",
    ],
    relacionados: ["apps-moviles-nativas", "bots-whatsapp-ia", "tienda-online-ia"],
  },

  // ============================================================
  // BLOQUE — WEB, APPS E INTEGRACIONES (infra)
  // ============================================================
  {
    slug: "sitios-corporativos-seo",
    categoria: "infra",
    titulo: "Sitios corporativos con SEO + blog",
    titulo_hero: "Sitios web corporativos optimizados para que Google te encuentre",
    tagline: "Que tu marca aparezca cuando te buscan",
    descripcion_card: "Sitio institucional multipágina con blog, SEO técnico, schema.org, sitemaps y optimización para aparecer primero en Google.",
    descripcion_meta: "Sitios web corporativos con SEO técnico avanzado, blog integrado, schema markup y estrategia de posicionamiento en Google.",
    icono: Search,
    pills: ["SEO técnico", "Blog MDX", "Schema.org"],
    destacado: false,
    color: "purple",
    problema: {
      titulo: "Google no sabe que existís",
      puntos: [
        "Tu empresa lleva años y no aparece ni en la segunda página de Google",
        "Dependés 100% de redes sociales para traer clientes nuevos",
        "Competidores más chicos te ganan en tráfico orgánico",
        "Tu sitio actual no tiene blog, schema, sitemap ni metadatos optimizados",
      ],
    },
    pasos: [
      { titulo: "Keyword research", descripcion: "Identificamos qué buscan tus clientes y qué palabras te van a traer tráfico calificado." },
      { titulo: "Arquitectura SEO", descripcion: "Estructura de URLs, jerarquía de páginas, linking interno y schema markup." },
      { titulo: "Contenido semilla", descripcion: "10 posts iniciales optimizados en los temas de mayor intención de búsqueda." },
      { titulo: "Monitoreo y ajuste", descripcion: "Google Search Console, reportes mensuales de posicionamiento y ajuste de contenido." },
    ],
    casos: [
      { industria: "Servicios profesionales", descripcion: "Abogados, contadores, arquitectos — rankeá por 'abogado laboral Bogotá' y traé clientes." },
      { industria: "B2B", descripcion: "Posicionamiento por palabras clave de tu industria con blog técnico." },
      { industria: "Salud", descripcion: "Clínicas y consultorios rankeando por especialidad y ciudad." },
      { industria: "Educación", descripcion: "Instituciones con blog educativo que atrae futuros estudiantes vía Google." },
    ],
    faq: [
      { pregunta: "¿Cuánto tardo en rankear?", respuesta: "Primeros movimientos: 2-3 meses. Posicionamiento fuerte: 6-12 meses. SEO es un juego largo pero el tráfico compuesto lo vale." },
      { pregunta: "¿Vos escribís los posts del blog?", respuesta: "Te damos los 10 posts iniciales. Después podés escribirlos vos o contratar a un redactor — te dejamos el editor listo." },
      { pregunta: "¿Se integra con mi identidad actual?", respuesta: "Sí. Respetamos colores, logo y tono. Solo modernizamos lo que haga falta." },
      { pregunta: "¿Qué pasa con mi sitio actual?", respuesta: "Hacemos migración con redirecciones 301 para no perder el SEO que ya tenés ganado." },
    ],
    keywords: [
      "sitio web corporativo",
      "seo colombia",
      "posicionamiento google",
      "blog para empresa",
      "diseño web seo",
      "agencia seo bogota",
    ],
    relacionados: ["desarrollo-web", "generador-contenido-redes", "agente-ia-personalizado"],
  },

  {
    slug: "apps-moviles-nativas",
    categoria: "infra",
    titulo: "Apps móviles nativas",
    titulo_hero: "Aplicaciones móviles nativas para Android y iOS en Play Store y App Store",
    tagline: "Tu marca en el celular de tu cliente",
    descripcion_card: "Apps nativas en Play Store y App Store — push notifications, acceso offline, cámara, GPS, pagos — todo lo que una app web no puede.",
    descripcion_meta: "Desarrollo de aplicaciones móviles nativas para Android e iOS. Publicación en Play Store y App Store. Push notifications, pagos y funciones nativas.",
    icono: Smartphone,
    pills: ["React Native", "Play Store", "App Store"],
    destacado: true,
    color: "cyan",
    problema: {
      titulo: "Una web no es suficiente",
      puntos: [
        "Querés push notifications para avisar al cliente en su celular",
        "Tu servicio necesita cámara, GPS o funciones offline",
        "Los clientes ya no guardan bookmarks — bajan apps",
        "Estar en la App Store da profesionalismo y confianza",
      ],
    },
    pasos: [
      { titulo: "Diseño UX/UI móvil", descripcion: "Wireframes, prototipo interactivo y diseño final siguiendo guías de Apple y Material Design." },
      { titulo: "Desarrollo multiplataforma", descripcion: "React Native — un solo código para Android e iOS, ahorrás 40% de tiempo y dinero." },
      { titulo: "Funciones nativas", descripcion: "Push notifications con FCM, cámara, GPS, pagos in-app, biometría, modo offline." },
      { titulo: "Publicación en stores", descripcion: "Subimos tu app a Play Store y App Store, gestionamos reviews y actualizaciones." },
    ],
    casos: [
      { industria: "Delivery y servicios a domicilio", descripcion: "App de pedidos con tracking GPS y push notifications de estado." },
      { industria: "Fidelización", descripcion: "App con tarjeta digital, puntos, promociones y pago contactless." },
      { industria: "Gimnasios y wellness", descripcion: "App con rutinas, reservas de clases, progreso y comunidad." },
      { industria: "Enterprise interno", descripcion: "Apps para equipos de campo — vendedores, técnicos, repartidores." },
    ],
    faq: [
      { pregunta: "¿React Native o nativo puro?", respuesta: "React Native para 90% de los casos — código compartido, mantenimiento barato. Nativo puro solo para casos que requieren máximo rendimiento o funciones muy específicas." },
      { pregunta: "¿Cuánto cuesta publicar en las stores?", respuesta: "Google Play: 25 USD una vez. App Store: 99 USD al año. Nosotros gestionamos la publicación." },
      { pregunta: "¿Cuánto tarda?", respuesta: "Apps simples: 2-3 meses. Apps complejas con backend propio: 4-6 meses." },
      { pregunta: "¿Hacen las actualizaciones después?", respuesta: "Sí. Plan de mantenimiento mensual opcional para features nuevas y actualizaciones de seguridad." },
    ],
    keywords: [
      "desarrollo app movil colombia",
      "aplicacion android ios",
      "app react native",
      "apps play store app store",
      "desarrollo apps bogota",
      "app push notifications",
    ],
    relacionados: ["delivery-inteligente", "fidelizacion-gamificada", "sistema-reservas"],
  },

  {
    slug: "integraciones-backoffice",
    categoria: "infra",
    titulo: "Integraciones y backoffice a la medida",
    titulo_hero: "Integraciones y software interno a la medida para operaciones complejas",
    tagline: "El sistema que tu operación pide",
    descripcion_card: "Paneles internos, ERPs custom, integraciones entre Shopify, MercadoLibre, contabilidad, WhatsApp y cualquier API — unimos todo.",
    descripcion_meta: "Desarrollo de software interno, backoffice, ERPs a la medida e integraciones entre sistemas (Shopify, WhatsApp, contabilidad, APIs custom).",
    icono: Plug,
    pills: ["APIs custom", "Integraciones", "Backoffice"],
    destacado: false,
    color: "purple",
    problema: {
      titulo: "Tu operación vive en 8 sistemas que no se hablan",
      puntos: [
        "Shopify, MercadoLibre, Siigo, WhatsApp y Excel — cada uno con datos distintos",
        "Nadie tiene la foto completa de un cliente o pedido",
        "Copiar datos entre sistemas consume horas semanales",
        "Los softwares genéricos no hacen el 20% clave de tu operación",
      ],
    },
    pasos: [
      { titulo: "Mapeo de sistemas y procesos", descripcion: "Entendemos qué sistemas usás, qué datos fluyen dónde y qué partes se hacen manual." },
      { titulo: "Diseño de la integración", descripcion: "Definimos fuente de verdad por dato, triggers y sincronización en tiempo real o batch." },
      { titulo: "Desarrollo del backoffice", descripcion: "Panel web interno con el flujo exacto de tu operación — nada más, nada menos." },
      { titulo: "Despliegue y capacitación", descripcion: "Tu equipo usa el sistema, nosotros damos soporte y ajustamos según feedback real." },
    ],
    casos: [
      { industria: "E-commerce multicanal", descripcion: "Sincronización de inventario y pedidos entre Shopify, MercadoLibre, Linio y bodega física." },
      { industria: "Agencias", descripcion: "Panel interno de gestión de clientes, proyectos, horas y facturación." },
      { industria: "Distribuidoras", descripcion: "ERP custom con pedidos, rutas, cartera, comisiones y reportes en tiempo real." },
      { industria: "Startups SaaS", descripcion: "Backoffice admin para operar tu producto — billing, soporte, analytics y configuración." },
    ],
    faq: [
      { pregunta: "¿Por qué no usar Odoo, SAP o NetSuite?", respuesta: "Para operaciones estándar — sí, usalos. Para el 20% de procesos que te hacen único, un backoffice a la medida escala mejor y cuesta menos a largo plazo." },
      { pregunta: "¿Con qué APIs se integran?", respuesta: "Shopify, MercadoLibre, WhatsApp Cloud API, Wompi, Bold, Siigo, Alegra, Google Workspace, Meta Ads, Google Ads y cualquier API REST o GraphQL." },
      { pregunta: "¿Es escalable?", respuesta: "Sí. Armamos sobre Next.js + PostgreSQL/Supabase — la misma stack que escala a millones de usuarios." },
      { pregunta: "¿Qué pasa si necesito cambios después?", respuesta: "Plan de mantenimiento mensual o por horas. El código es tuyo y documentado." },
    ],
    keywords: [
      "software a la medida colombia",
      "erp custom empresa",
      "backoffice personalizado",
      "integracion shopify mercadolibre",
      "integracion apis",
      "desarrollo software empresa",
    ],
    relacionados: ["automatizacion-procesos", "crm-inteligente", "tienda-online-ia"],
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
