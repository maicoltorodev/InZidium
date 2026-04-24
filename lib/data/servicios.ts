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
  // FLAGSHIP — DESARROLLO WEB (el fuerte de la casa)
  // ============================================================
  {
    slug: "desarrollo-web",
    categoria: "infra",
    titulo: "Desarrollo Web Profesional",
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
    relacionados: ["sitios-corporativos-seo", "apps-moviles-nativas", "tienda-online-ia"],
  },

  // ============================================================
  // BLOQUE — IA (el gancho moderno)
  // ============================================================
  {
    slug: "bots-whatsapp-ia",
    categoria: "ia",
    titulo: "Bots de WhatsApp con IA",
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
    relacionados: ["agente-ia-personalizado", "crm-inteligente", "automatizacion-procesos"],
  },

  {
    slug: "agente-ia-personalizado",
    categoria: "ia",
    titulo: "Asistente de IA para tu negocio",
    titulo_hero: "Asistentes de inteligencia artificial entrenados con la información de tu empresa",
    tagline: "Inteligencia artificial que conoce tu negocio",
    descripcion_card: "Un asistente que sabe tus precios, productos, políticas y responde exactamente como lo haría tu mejor empleado — no como una IA genérica.",
    descripcion_meta: "Creamos asistentes de inteligencia artificial personalizados, entrenados con los datos de tu empresa. Atención especializada en web, chat interno o WhatsApp.",
    icono: "Bot",
    pills: ["Personalizado", "Responde con tu información", "Se integra donde quieras"],
    destacado: false,
    color: "purple",
    problema: {
      titulo: "Las IA genéricas no conocen tu negocio",
      puntos: [
        "Los clientes preguntan cosas específicas que un chatbot común no sabe responder",
        "Tu equipo pierde horas explicando lo mismo una y otra vez",
        "El entrenamiento de empleados nuevos es lento porque la información está dispersa",
        "Quieres un chat inteligente en tu web pero que no invente respuestas",
      ],
    },
    pasos: [
      { titulo: "Recolección de conocimiento", descripcion: "Nuestro equipo reúne tus documentos, manuales, catálogos, políticas y cualquier fuente de información relevante." },
      { titulo: "Entrenamiento especializado", descripcion: "Configuramos el asistente para que responda únicamente con tu información verificada, citando la fuente cuando corresponde." },
      { titulo: "Integración en tu canal", descripcion: "Lo instalamos donde lo necesites: tu web, WhatsApp, chat interno del equipo o cualquier plataforma que uses." },
      { titulo: "Mejora continua", descripcion: "Revisamos conversaciones reales y ajustamos el asistente mes a mes para aumentar la calidad de las respuestas." },
    ],
    casos: [
      { industria: "Tiendas online", descripcion: "Asiste en la compra recomendando productos según preguntas en lenguaje natural." },
      { industria: "Empresas grandes", descripcion: "Chat interno para que empleados consulten políticas de RRHH, procesos o documentación técnica." },
      { industria: "Educación", descripcion: "Tutor virtual que responde dudas de estudiantes con el material oficial del curso." },
      { industria: "Software y servicios", descripcion: "Soporte técnico de primer nivel que resuelve la mayoría de consultas sin pasar por un humano." },
    ],
    faq: [
      { pregunta: "¿El asistente puede inventar información?", respuesta: "No. Usamos una arquitectura que obliga al asistente a responder únicamente con la información que le cargamos. Si no sabe algo, lo dice claramente." },
      { pregunta: "¿Cómo actualizo su conocimiento?", respuesta: "Te damos un panel sencillo para subir o reemplazar documentos. El asistente se actualiza automáticamente." },
      { pregunta: "¿Puede aprender con el tiempo?", respuesta: "Sí. Nuestro equipo monitorea las conversaciones y las usa para mejorar el asistente mes a mes." },
      { pregunta: "¿Dónde lo puedo usar?", respuesta: "En tu página web, aplicación móvil, Slack, Microsoft Teams, WhatsApp o integrado a otro software que ya utilices." },
      { pregunta: "¿Qué tecnología utilizan?", respuesta: "Usamos los modelos más avanzados del mercado — Gemini, Claude y GPT — adaptados a tu caso específico. Elegimos el más adecuado según el tipo de tareas que debe realizar." },
    ],
    keywords: [
      "asistente virtual empresa",
      "chatbot personalizado",
      "ia entrenada con mis datos",
      "asistente inteligencia artificial",
      "chat inteligente web",
      "chatbot custom colombia",
    ],
    relacionados: ["bots-whatsapp-ia", "crm-inteligente", "sitios-corporativos-seo"],
  },

  {
    slug: "crm-inteligente",
    categoria: "ia",
    titulo: "CRM con inteligencia artificial",
    titulo_hero: "CRM con inteligencia artificial que predice qué cliente va a comprar",
    tagline: "El CRM te dice dónde enfocar tu energía",
    descripcion_card: "Un CRM que no solo guarda contactos — analiza el comportamiento, clasifica los clientes potenciales y avisa cuándo alguien está por irse.",
    descripcion_meta: "CRM con inteligencia artificial que prioriza clientes, predice ventas y alerta cuando un cliente está por dejarte. Diseñado para equipos comerciales de alto rendimiento.",
    icono: "Database",
    pills: ["Clientes priorizados", "Alertas inteligentes", "Panel de control claro"],
    destacado: true,
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

  {
    slug: "automatizacion-procesos",
    categoria: "ia",
    titulo: "Automatización de procesos",
    titulo_hero: "Automatización de procesos empresariales — que el software haga lo repetitivo",
    tagline: "Deja de hacer a mano lo que un sistema puede hacer solo",
    descripcion_card: "Liberamos a tu equipo de las tareas repetitivas — facturas, reportes, sincronizaciones, notificaciones — todo funcionando solo, incluso mientras duermen.",
    descripcion_meta: "Automatización de procesos empresariales. Sistemas que realizan tareas repetitivas: reportes, sincronizaciones, facturas, notificaciones, sin intervención humana.",
    icono: "Workflow",
    pills: ["Procesos automáticos", "Sin tareas repetitivas", "Conectado a tus sistemas"],
    destacado: true,
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
    relacionados: ["integraciones-backoffice", "crm-inteligente", "lector-documentos-ia"],
  },

  {
    slug: "lector-documentos-ia",
    categoria: "ia",
    titulo: "Lectura automática de documentos",
    titulo_hero: "Lectura inteligente de facturas y documentos — subes una foto, extraemos la información",
    tagline: "Adiós a digitar documentos uno por uno",
    descripcion_card: "Sube facturas, recibos, cédulas o contratos. El sistema lee, extrae y carga los datos directamente a tu sistema — sin digitación manual.",
    descripcion_meta: "Lectura inteligente de facturas, recibos, contratos y documentos con inteligencia artificial. Extracción automática de información e integración con tu sistema.",
    icono: "FileScan",
    pills: ["Cero digitación", "Extracción automática", "Se conecta a tu contabilidad"],
    destacado: false,
    color: "cyan",
    problema: {
      titulo: "Digitar facturas manualmente es perder dinero y tiempo",
      puntos: [
        "Alguien pasa horas digitando facturas de proveedores al sistema contable",
        "Los errores de transcripción generan problemas con la DIAN",
        "Las fotos de WhatsApp o imágenes borrosas no las lee el software actual",
        "Los contratos se firman y la información importante queda enterrada en archivos PDF",
      ],
    },
    pasos: [
      { titulo: "Identificación de documentos", descripcion: "Definimos qué tipos de documentos vas a procesar: facturas, cédulas, contratos, recibos, actas." },
      { titulo: "Configuración del sistema", descripcion: "Nuestro equipo ajusta el lector a los formatos específicos de tus proveedores o documentos internos." },
      { titulo: "Conexión con tu sistema", descripcion: "Los datos extraídos van directamente a tu software contable, ERP, CRM o donde los necesites." },
      { titulo: "Revisión humana de casos dudosos", descripcion: "Los casos que requieren verificación los revisa una persona — el resto se procesa solo." },
    ],
    casos: [
      { industria: "Contabilidad y finanzas", descripcion: "Facturas de proveedores cargadas automáticamente en Siigo, Alegra o Contapyme." },
      { industria: "Inmobiliarias", descripcion: "Lectura automática de cédulas, RUT, contratos de arrendamiento y comprobantes de pago." },
      { industria: "Salud", descripcion: "Digitalización de historias clínicas en papel, órdenes médicas y fórmulas." },
      { industria: "Logística", descripcion: "Guías de despacho, actas de entrega y remisiones capturadas desde el celular." },
    ],
    faq: [
      { pregunta: "¿Qué tan preciso es?", respuesta: "Sobre documentos claros: más del 95% de precisión. En documentos borrosos o con bajo contraste, el sistema marca los campos dudosos para revisión humana." },
      { pregunta: "¿Funciona con facturas electrónicas colombianas?", respuesta: "Sí. Extraemos datos de facturas electrónicas DIAN y también de facturas físicas escaneadas." },
      { pregunta: "¿Puedo cargar documentos por lotes?", respuesta: "Sí. Puedes subir cientos de documentos a la vez y se procesan en paralelo." },
      { pregunta: "¿Se integra con Siigo o Alegra?", respuesta: "Sí. Armamos integración directa con los programas contables más usados en Colombia." },
    ],
    keywords: [
      "lectura automatica documentos",
      "lector facturas automatico",
      "digitalizacion documentos colombia",
      "extraccion datos pdf",
      "automatizacion contabilidad",
      "procesamiento facturas ia",
    ],
    relacionados: ["automatizacion-procesos", "integraciones-backoffice", "agente-ia-personalizado"],
  },

  {
    slug: "generador-contenido-redes",
    categoria: "ia",
    titulo: "Contenido automático para redes sociales",
    titulo_hero: "Publicaciones de Instagram y TikTok generadas automáticamente con inteligencia artificial",
    tagline: "Un mes de contenido en minutos",
    descripcion_card: "Subes tus productos y el sistema arma publicaciones, reels, carruseles y textos listos para publicar — con tu estilo y los colores de tu marca.",
    descripcion_meta: "Generador de contenido para redes sociales con inteligencia artificial. Publicaciones, reels, carruseles y textos listos para Instagram, TikTok y Facebook.",
    icono: "Sparkles",
    pills: ["Contenido automático", "Varias redes", "Agendamiento incluido"],
    destacado: false,
    color: "purple",
    problema: {
      titulo: "Las redes sociales consumen el mes entero",
      puntos: [
        "Armar una sola publicación toma media hora entre foto, edición y texto",
        "Se acaban las ideas a la tercera semana del mes",
        "Contratar un community manager cuesta millones al mes",
        "Publicas de forma inconsistente y el algoritmo te castiga",
      ],
    },
    pasos: [
      { titulo: "Cargamos tu marca", descripcion: "Colores, tipografías, tono de voz, productos y público objetivo. El sistema aprende tu estilo." },
      { titulo: "Generación masiva", descripcion: "Con un clic generas un mes de publicaciones variadas: productos, consejos, testimonios, promociones." },
      { titulo: "Revisión y aprobación", descripcion: "Revisas las publicaciones en un panel cómodo. Editas lo que quieras antes de que se publiquen." },
      { titulo: "Agendamiento automático", descripcion: "Las publicaciones se agendan automáticamente a Instagram, Facebook, TikTok y LinkedIn." },
    ],
    casos: [
      { industria: "Moda y retail", descripcion: "De tu catálogo a publicaciones de producto automáticamente, con texto de venta listo." },
      { industria: "Restaurantes", descripcion: "Menú del día, promociones y reels de platos generados a partir de fotos del celular." },
      { industria: "Marca personal e influencers", descripcion: "Contenido educativo y promocional consistente sin depender de tu inspiración diaria." },
      { industria: "Servicios profesionales", descripcion: "Abogados, médicos, coaches — publicaciones educativas que posicionan tu experiencia." },
    ],
    faq: [
      { pregunta: "¿Las publicaciones se ven genéricas?", respuesta: "No. El sistema respeta tus colores, tipografías y estilo. Son publicaciones de tu marca, no plantillas de Canva." },
      { pregunta: "¿Puedo editar antes de publicar?", respuesta: "Sí. Revisas cada publicación y la ajustas antes de que se publique. También puedes regenerarla si algo no te gusta." },
      { pregunta: "¿Qué redes soporta?", respuesta: "Instagram, Facebook, TikTok, LinkedIn y X (antes Twitter)." },
      { pregunta: "¿Cómo se conecta con mi cuenta?", respuesta: "A través de conexiones oficiales de cada red social. Sin riesgo de bloqueo por automatización." },
    ],
    keywords: [
      "generador contenido ia",
      "publicaciones instagram automaticas",
      "ia redes sociales",
      "automatizacion redes sociales",
      "community manager virtual",
      "social media colombia",
    ],
    relacionados: ["agente-ia-personalizado", "tienda-online-ia", "automatizacion-procesos"],
  },

  // ============================================================
  // BLOQUE — SISTEMAS DE NEGOCIO
  // ============================================================
  {
    slug: "delivery-inteligente",
    categoria: "sistema",
    titulo: "Sistema de domicilios inteligente",
    titulo_hero: "Sistema de domicilios con seguimiento en vivo y predicción inteligente de tiempos",
    tagline: "Tu propio sistema de pedidos, sin comisiones externas",
    descripcion_card: "Tu propio sistema de pedidos: menú con carrito, asignación inteligente de domiciliarios, seguimiento en mapa y tiempo estimado confiable.",
    descripcion_meta: "Sistema de domicilios a la medida. Menú digital, carrito, pagos, seguimiento en vivo con mapa y predicción de tiempo de entrega.",
    icono: "Truck",
    pills: ["Seguimiento en vivo", "Tiempos confiables", "Pagos integrados"],
    destacado: false,
    color: "cyan",
    problema: {
      titulo: "Rappi se queda con el 30% de cada pedido",
      puntos: [
        "Las comisiones de las aplicaciones de domicilio consumen tu margen",
        "No tienes los datos de tus propios clientes — son de la plataforma",
        "No puedes hacer promociones a tu base propia",
        "Los clientes sienten más lealtad a la aplicación que a tu marca",
      ],
    },
    pasos: [
      { titulo: "Menú digital con tu marca", descripcion: "Tu carta en línea con fotos, opciones personalizables, combos y recomendaciones del día." },
      { titulo: "Carrito y pagos", descripcion: "Checkout con las pasarelas más usadas en Colombia: Wompi, Bold, MercadoPago, PayU, Nequi o efectivo contra entrega." },
      { titulo: "Asignación de domiciliarios", descripcion: "El sistema asigna al domiciliario más cercano y agrupa pedidos por zona para optimizar los tiempos." },
      { titulo: "Seguimiento para el cliente", descripcion: "Mapa en vivo, tiempo estimado confiable y notificaciones automáticas por WhatsApp." },
    ],
    casos: [
      { industria: "Restaurantes", descripcion: "Menú digital, domicilios propios y fidelización — recuperas tu margen completo." },
      { industria: "Heladerías y postres", descripcion: "Pedidos rápidos con tiempo de entrega controlado antes de que se derrita el producto." },
      { industria: "Comida saludable y meal prep", descripcion: "Pedidos recurrentes con suscripción semanal y entrega programada." },
      { industria: "Tiendas de barrio y mini-mercados", descripcion: "Catálogo con inventario en vivo y domicilios en tu zona." },
    ],
    faq: [
      { pregunta: "¿Necesito tener domiciliarios propios?", respuesta: "No necesariamente. Podemos integrar con flotas tercerizadas o aplicaciones existentes como Picap." },
      { pregunta: "¿Qué formas de pago acepta?", respuesta: "Wompi, Bold, MercadoPago, PayU, Nequi, Daviplata y efectivo contra entrega." },
      { pregunta: "¿Funciona también en WhatsApp?", respuesta: "Sí. Podemos integrar un asistente en WhatsApp que lleva al cliente al menú o le arma el pedido directamente por el chat." },
      { pregunta: "¿Cuánto me ahorro comparado con las apps grandes?", respuesta: "Rappi cobra entre 20% y 30% por pedido. Nuestra solución tiene un costo fijo mensual — si tienes volumen, la diferencia es enorme." },
    ],
    keywords: [
      "sistema domicilios propio",
      "aplicacion restaurante",
      "menu digital qr",
      "domicilios sin rappi",
      "app pedidos restaurante",
      "sistema pedidos online colombia",
    ],
    relacionados: ["tienda-online-ia", "apps-moviles-nativas", "fidelizacion-gamificada"],
  },

  {
    slug: "sistema-reservas",
    categoria: "sistema",
    titulo: "Sistema de citas y reservas",
    titulo_hero: "Sistema de reservas en línea con confirmación automática y lista de espera inteligente",
    tagline: "Agenda completa sin mover un dedo",
    descripcion_card: "Calendario en línea por profesional, confirmaciones automáticas por WhatsApp, recordatorios, lista de espera y manejo de inasistencias.",
    descripcion_meta: "Sistema de reservas en línea para salones, clínicas, barberías y consultorios. Agenda por profesional, recordatorios por WhatsApp y manejo de inasistencias.",
    icono: "CalendarCheck",
    pills: ["Agenda en línea", "Recordatorios automáticos", "Menos inasistencias"],
    destacado: true,
    color: "purple",
    problema: {
      titulo: "Las reservas por teléfono son un caos",
      puntos: [
        "La recepcionista pasa todo el día atendiendo llamadas para agendar",
        "Los clientes llaman fuera de horario y pierden la posibilidad de reservar",
        "Las inasistencias cuestan dinero cada semana",
        "La agenda en Excel o cuaderno genera errores y cruces de turnos",
      ],
    },
    pasos: [
      { titulo: "Agenda por profesional", descripcion: "Cada profesional tiene su disponibilidad, duración de servicios y días libres." },
      { titulo: "Reserva de autoservicio", descripcion: "El cliente reserva desde tu web o un enlace de WhatsApp en menos de un minuto." },
      { titulo: "Recordatorios automáticos", descripcion: "WhatsApp 24 y 2 horas antes de la cita. El cliente confirma, reagenda o cancela con un botón." },
      { titulo: "Lista de espera", descripcion: "Si alguien cancela, el sistema ofrece el cupo al siguiente en lista automáticamente." },
    ],
    casos: [
      { industria: "Barberías y salones", descripcion: "Reservas con tu barbero o estilista favorito según disponibilidad real y duración del servicio." },
      { industria: "Clínicas y consultorios", descripcion: "Los pacientes agendan desde el celular, reciben recordatorios y confirman con un clic." },
      { industria: "Spa y estética", descripcion: "Paquetes de servicios, promociones y bonos de regalo integrados en la reserva." },
      { industria: "Talleres y mantenimiento", descripcion: "Agenda de citas con capacidad por puesto de trabajo y técnico especializado." },
    ],
    faq: [
      { pregunta: "¿Puedo cobrar un abono para evitar inasistencias?", respuesta: "Sí. Se puede solicitar un abono o registrar una tarjeta al momento de reservar. Si el cliente no llega, se cobra la penalidad automáticamente." },
      { pregunta: "¿Se integra con Google Calendar?", respuesta: "Sí. Cada profesional puede ver sus citas sincronizadas en Google Calendar." },
      { pregunta: "¿Los recordatorios son por WhatsApp?", respuesta: "Sí, y también por SMS o correo. WhatsApp tiene la mejor tasa de lectura." },
      { pregunta: "¿Se puede usar desde el celular del profesional?", respuesta: "Sí. El sistema está optimizado para móvil y el profesional puede gestionar su agenda desde cualquier lugar." },
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
    titulo: "Tienda en línea con IA",
    titulo_hero: "Tienda en línea con recomendador inteligente y recuperación de ventas por WhatsApp",
    tagline: "Vende más a los mismos visitantes",
    descripcion_card: "Catálogo con carrito, pagos seguros, recomendador automático que aumenta el valor de compra y recuperación de compras abandonadas.",
    descripcion_meta: "Tienda en línea a la medida con recomendador inteligente, recuperación de compras abandonadas, pagos integrados y panel de inventario.",
    icono: "ShoppingBag",
    pills: ["Recomendador inteligente", "Recupera ventas", "Pagos integrados"],
    destacado: true,
    color: "cyan",
    problema: {
      titulo: "Tu tienda en línea vende menos de lo que debería",
      puntos: [
        "El 70% de los carritos se abandonan sin que nadie los recupere",
        "Los clientes ven un producto y se van — nadie les recomienda otro",
        "Shopify y WooCommerce te limitan y cobran comisiones eternas",
        "El catálogo es estático — no se adapta a lo que cada cliente prefiere",
      ],
    },
    pasos: [
      { titulo: "Catálogo inteligente", descripcion: "Productos con fotos, variantes, inventario, posicionamiento en Google y filtros por atributos." },
      { titulo: "Recomendador automático", descripcion: "Sugiere productos complementarios en el carrito, en la compra y después de finalizar." },
      { titulo: "Recuperación de ventas", descripcion: "Un asistente de WhatsApp contacta al cliente una hora después con un descuento personalizado." },
      { titulo: "Panel completo", descripcion: "Inventario, pedidos, envíos, clientes — todo desde una sola administración." },
    ],
    casos: [
      { industria: "Moda y accesorios", descripcion: "Recomendador que sugiere combinaciones completas — pantalón, camisa y zapatos." },
      { industria: "Alimentos y bebidas", descripcion: "Carritos recurrentes, suscripción semanal y combos con precio dinámico." },
      { industria: "Electrónica", descripcion: "Comparador de productos, especificaciones técnicas y venta cruzada de accesorios." },
      { industria: "Cosmética y cuidado personal", descripcion: "Cuestionario de producto según tipo de piel y recomendación personalizada." },
    ],
    faq: [
      { pregunta: "¿Qué diferencia hay con Shopify?", respuesta: "Sin comisiones por venta, sin límites de aplicaciones, código propio, integración con tu operación real y recomendador entrenado específicamente para tu catálogo." },
      { pregunta: "¿Qué formas de pago acepta?", respuesta: "Wompi, Bold, MercadoPago, PayU, ePayco, Addi, Sistecrédito y efectivo." },
      { pregunta: "¿Migran mi tienda actual?", respuesta: "Sí. Traemos productos, imágenes, clientes, pedidos históricos y redirecciones en Google para no perder el tráfico que ya tienes." },
      { pregunta: "¿Se integra con MercadoLibre?", respuesta: "Sí. Sincronización de inventario con MercadoLibre, Linio, Éxito y otros mercados en línea." },
    ],
    keywords: [
      "tienda online colombia",
      "ecommerce personalizado",
      "tienda virtual colombia",
      "recomendador productos",
      "recuperar carrito abandonado",
      "tienda online wompi",
    ],
    relacionados: ["bots-whatsapp-ia", "apps-moviles-nativas", "integraciones-backoffice"],
  },

  {
    slug: "historia-clinica-voz",
    categoria: "sistema",
    titulo: "Historia clínica por voz",
    titulo_hero: "Historia clínica electrónica con dictado por voz — transcribe mientras atiendes",
    tagline: "Atiende, no escribas",
    descripcion_card: "Dictas la consulta, el sistema transcribe y organiza la historia clínica, la fórmula y la orden médica — solo revisas y firmas.",
    descripcion_meta: "Historia clínica electrónica con transcripción por voz e inteligencia artificial. Ideal para consultorios, clínicas y profesionales de la salud.",
    icono: "Stethoscope",
    pills: ["Dictado por voz", "Historia organizada", "Cumple normativa"],
    destacado: false,
    color: "purple",
    problema: {
      titulo: "Digitar la historia te roba la consulta",
      puntos: [
        "Pasas más tiempo mirando la pantalla que al paciente",
        "Cada consulta queda con la historia incompleta porque no hay tiempo de escribir",
        "Las historias en papel se pierden o son ilegibles",
        "La DIAN y los RIPS exigen historia estructurada que el software actual no genera bien",
      ],
    },
    pasos: [
      { titulo: "Dictado durante la consulta", descripcion: "Hablas como si dictaras a una secretaria. El sistema escucha y organiza la información en tiempo real." },
      { titulo: "Organización automática", descripcion: "Motivo de consulta, antecedentes, examen físico, diagnóstico y plan — cada parte en su lugar correspondiente." },
      { titulo: "Fórmulas y órdenes médicas", descripcion: "Generadas con base en el diagnóstico, con firma digital lista para imprimir o enviar por WhatsApp." },
      { titulo: "Revisión y firma", descripcion: "Revisas, corriges lo mínimo y firmas. La historia queda guardada con respaldo legal completo." },
    ],
    casos: [
      { industria: "Medicina general y especialidades", descripcion: "Consulta completa sin tocar el teclado. Más tiempo con el paciente y más pacientes por día." },
      { industria: "Odontología", descripcion: "Odontograma digital, plan de tratamiento y seguimiento por fase." },
      { industria: "Psicología", descripcion: "Notas de sesión organizadas con seguimiento de objetivos y evolución del paciente." },
      { industria: "Veterinaria", descripcion: "Historia por paciente (mascota) con vacunas, cirugías y tratamientos." },
    ],
    faq: [
      { pregunta: "¿Cumple con la normativa colombiana de historia clínica?", respuesta: "Sí. Cumplimos con la Resolución 1995 de 1999 y generamos los RIPS cuando se requieren." },
      { pregunta: "¿La transcripción funciona con acento colombiano?", respuesta: "Sí. El sistema está entrenado en español latinoamericano e incluye terminología médica y medicamentos locales." },
      { pregunta: "¿La información está segura?", respuesta: "Sí. Cifrado de extremo a extremo, respaldo diario y cumplimiento con la Ley 1581 de protección de datos." },
      { pregunta: "¿Se integra con las EPS?", respuesta: "Sí. Generamos RIPS, facturación electrónica y conexión con las principales EPS colombianas." },
    ],
    keywords: [
      "historia clinica electronica colombia",
      "software consultorio medico",
      "dictado por voz medico",
      "historia clinica electronica odontologo",
      "rips colombia",
      "software clinica",
    ],
    relacionados: ["sistema-reservas", "agente-ia-personalizado", "integraciones-backoffice"],
  },

  {
    slug: "control-asistencia-facial",
    categoria: "sistema",
    titulo: "Control de asistencia por rostro",
    titulo_hero: "Control de acceso y asistencia por reconocimiento facial — sin huella, sin tarjeta",
    tagline: "El rostro es la contraseña",
    descripcion_card: "Empleados o miembros entran con solo mirar la cámara. Reportes automáticos de horas trabajadas, tardanzas y ausencias.",
    descripcion_meta: "Sistema de control de asistencia por reconocimiento facial para empresas, gimnasios y clubes. Reportes automáticos y control de acceso.",
    icono: "ScanFace",
    pills: ["Reconocimiento facial", "Reportes automáticos", "Seguro y confiable"],
    destacado: false,
    color: "cyan",
    problema: {
      titulo: "Las huellas y las tarjetas dan más problemas que soluciones",
      puntos: [
        "Los empleados se marcan entre sí con huella prestada",
        "Las tarjetas se pierden, se prestan o se clonan",
        "Calcular las horas trabajadas cada quincena es un dolor de cabeza",
        "No tienes cómo saber con certeza quién entró y cuándo a tus instalaciones",
      ],
    },
    pasos: [
      { titulo: "Registro inicial", descripcion: "Los empleados o miembros se registran una vez con una foto. El sistema aprende sus rasgos." },
      { titulo: "Reconocimiento en cámara", descripcion: "Instalamos cámaras en los accesos. El sistema identifica a la persona en menos de un segundo." },
      { titulo: "Registro automático", descripcion: "Cada entrada y salida queda grabada con foto, hora y ubicación exacta." },
      { titulo: "Reportes y nómina", descripcion: "Horas trabajadas, extras, tardanzas y ausencias — exportables para el proceso de nómina." },
    ],
    casos: [
      { industria: "Empresas y oficinas", descripcion: "Control de entrada de empleados con reportes para nómina y cumplimiento laboral." },
      { industria: "Gimnasios y clubes", descripcion: "Acceso de miembros según su plan vigente. Si se venció la membresía, no entra." },
      { industria: "Instituciones educativas", descripcion: "Asistencia de estudiantes y notificación automática a padres cuando un niño llega o se retira." },
      { industria: "Obras y construcción", descripcion: "Control de cuadrillas en obra con cámaras robustas y reportes por proyecto." },
    ],
    faq: [
      { pregunta: "¿Funciona con tapabocas o lentes?", respuesta: "Sí. El sistema reconoce con tapabocas, lentes oscuros, barba o cambios de peinado." },
      { pregunta: "¿Y si alguien intenta engañar con una foto?", respuesta: "El sistema tiene detección de presencia real — descarta fotos, videos y máscaras." },
      { pregunta: "¿Cumple con la protección de datos biométricos?", respuesta: "Sí. Almacenamos información cifrada, no fotos. Cumple con la Ley 1581 de protección de datos." },
      { pregunta: "¿Qué pasa si se va la luz o el internet?", respuesta: "El dispositivo funciona sin conexión y sincroniza los datos cuando vuelve la red." },
    ],
    keywords: [
      "control asistencia reconocimiento facial",
      "control acceso empresa",
      "biometrico facial colombia",
      "nomina automatica",
      "asistencia empleados",
      "control gimnasio miembros",
    ],
    relacionados: ["automatizacion-procesos", "integraciones-backoffice", "apps-moviles-nativas"],
  },

  {
    slug: "fidelizacion-gamificada",
    categoria: "sistema",
    titulo: "Programa de fidelización con recompensas",
    titulo_hero: "Programa de fidelización con puntos, niveles y recompensas — clientes que vuelven",
    tagline: "Clientes que juegan, vuelven",
    descripcion_card: "Puntos por compra, niveles, retos, regalos de cumpleaños y recompensas. Tu cliente se engancha y vuelve por más.",
    descripcion_meta: "Programa de fidelización con puntos, niveles, retos y recompensas. Ideal para comercio, restaurantes, gimnasios y servicios.",
    icono: "Trophy",
    pills: ["Puntos y niveles", "Notificaciones automáticas", "Engancha al cliente"],
    destacado: true,
    color: "purple",
    problema: {
      titulo: "Conseguir un cliente nuevo cuesta 5 veces más que mantener uno",
      puntos: [
        "Tus clientes compran una vez y no regresan",
        "Los programas de puntos tradicionales son aburridos y nadie los usa",
        "No sabes cuáles son tus clientes VIP ni cómo premiarlos",
        "Las promociones van para todos — sin personalización ni exclusividad",
      ],
    },
    pasos: [
      { titulo: "Diseño del programa", descripcion: "Definimos los puntos por compra, los niveles (Bronce, Plata, Oro, Platino) y las recompensas por nivel." },
      { titulo: "Aplicación o panel para el cliente", descripcion: "El cliente ve sus puntos, su nivel, los retos activos y las recompensas disponibles." },
      { titulo: "Retos y misiones", descripcion: "«Compra 3 veces este mes y gana 500 puntos» — el cliente se engancha." },
      { titulo: "Notificaciones inteligentes", descripcion: "Cumpleaños, ofertas exclusivas según nivel y recordatorios de puntos por vencer." },
    ],
    casos: [
      { industria: "Cafeterías y restaurantes", descripcion: "Cada compra suma puntos. Al llegar a nivel Oro, el cliente desbloquea promociones exclusivas." },
      { industria: "Gimnasios", descripcion: "Asistencia frecuente sube de nivel. Nivel alto significa acceso a clases premium." },
      { industria: "Comercio y moda", descripcion: "Primera compra: Bronce. Nivel máximo: acceso a preventas y eventos privados." },
      { industria: "Servicios recurrentes", descripcion: "Barberías, salones, veterinarias — la sexta visita es gratis, y el cliente lo ve en su aplicación." },
    ],
    faq: [
      { pregunta: "¿Cómo sumo los puntos al cliente?", respuesta: "Según tu canal: aplicación, código QR en caja, asistente de WhatsApp o integración directa con tu sistema de facturación." },
      { pregunta: "¿Se integra con mi sistema actual?", respuesta: "Sí. Nos conectamos con Shopify, WooCommerce, Siigo, Alegra o sistemas POS existentes." },
      { pregunta: "¿Necesito una aplicación móvil?", respuesta: "No obligatoriamente. Puedes empezar con un portal web adaptado al celular y migrar a aplicación nativa cuando quieras." },
      { pregunta: "¿Qué métricas me entrega?", respuesta: "Clientes activos, frecuencia de compra, ticket promedio por nivel, tasa de abandono y retorno de inversión del programa." },
    ],
    keywords: [
      "programa fidelizacion clientes",
      "puntos recompensas negocio",
      "sistema lealtad clientes",
      "app fidelizacion colombia",
      "retencion clientes",
      "programa puntos restaurante",
    ],
    relacionados: ["apps-moviles-nativas", "bots-whatsapp-ia", "tienda-online-ia"],
  },

  // ============================================================
  // BLOQUE — WEB, APPS E INTEGRACIONES
  // ============================================================
  {
    slug: "sitios-corporativos-seo",
    categoria: "infra",
    titulo: "Sitios corporativos con SEO y blog",
    titulo_hero: "Sitios web corporativos optimizados para que Google te encuentre",
    tagline: "Que tu marca aparezca cuando la buscan",
    descripcion_card: "Sitio institucional con varias páginas, blog integrado, optimización para Google y estrategia de contenido para aparecer primero en las búsquedas.",
    descripcion_meta: "Sitios web corporativos con optimización para Google, blog integrado y estrategia de posicionamiento. Para empresas que quieren aparecer primero.",
    icono: "Search",
    pills: ["Optimizado para Google", "Blog incluido", "Estrategia de contenido"],
    destacado: false,
    color: "purple",
    problema: {
      titulo: "Google no sabe que existes",
      puntos: [
        "Tu empresa lleva años y no aparece ni en la segunda página de Google",
        "Dependes 100% de las redes sociales para traer clientes nuevos",
        "Competidores más pequeños te superan en tráfico por Google",
        "Tu sitio actual no tiene blog ni la configuración que los buscadores premian",
      ],
    },
    pasos: [
      { titulo: "Investigación de palabras clave", descripcion: "Identificamos qué buscan tus clientes y qué términos te traerán tráfico de calidad." },
      { titulo: "Arquitectura optimizada", descripcion: "Estructura de páginas, jerarquía, enlaces internos y la configuración técnica que los buscadores exigen." },
      { titulo: "Contenido inicial", descripcion: "Entregamos 10 publicaciones iniciales optimizadas en los temas con mayor intención de búsqueda." },
      { titulo: "Seguimiento y ajuste", descripcion: "Reportes mensuales de posicionamiento y ajustes al contenido según lo que esté funcionando." },
    ],
    casos: [
      { industria: "Servicios profesionales", descripcion: "Abogados, contadores, arquitectos — aparece cuando buscan «abogado laboral en Bogotá»." },
      { industria: "Empresas B2B", descripcion: "Posicionamiento con palabras clave de tu industria y blog técnico que genera confianza." },
      { industria: "Salud", descripcion: "Clínicas y consultorios que aparecen por especialidad y ciudad." },
      { industria: "Educación", descripcion: "Instituciones con blog educativo que atrae estudiantes potenciales desde Google." },
    ],
    faq: [
      { pregunta: "¿Cuánto tarda en aparecer en Google?", respuesta: "Primeros movimientos: 2 a 3 meses. Posicionamiento fuerte: 6 a 12 meses. El SEO es una carrera larga pero el tráfico se acumula." },
      { pregunta: "¿Ustedes escriben las publicaciones del blog?", respuesta: "Entregamos las 10 publicaciones iniciales. Después puedes escribirlas tu equipo o contratar a un redactor — dejamos el editor listo para usar." },
      { pregunta: "¿Respetan mi identidad actual?", respuesta: "Sí. Mantenemos colores, logo y tono. Solo modernizamos lo que haga falta." },
      { pregunta: "¿Qué pasa con mi sitio actual?", respuesta: "Hacemos la migración con redirecciones para no perder el posicionamiento que ya tienes en Google." },
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
    titulo: "Aplicaciones móviles",
    titulo_hero: "Aplicaciones móviles para Android y iPhone, publicadas en las tiendas oficiales",
    tagline: "Tu marca en el celular de tu cliente",
    descripcion_card: "Aplicaciones publicadas en Play Store y App Store — notificaciones, acceso sin internet, cámara, ubicación, pagos — todo lo que una web no puede hacer.",
    descripcion_meta: "Desarrollo de aplicaciones móviles para Android y iPhone. Publicación en Play Store y App Store. Notificaciones, pagos y funciones nativas del celular.",
    icono: "Smartphone",
    pills: ["Android e iPhone", "En las tiendas oficiales", "Notificaciones push"],
    destacado: true,
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
    relacionados: ["delivery-inteligente", "fidelizacion-gamificada", "sistema-reservas"],
  },

  {
    slug: "integraciones-backoffice",
    categoria: "infra",
    titulo: "Sistemas internos a la medida",
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
