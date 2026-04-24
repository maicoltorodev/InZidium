export type PostCategoria =
  | "desarrollo-web"
  | "ia"
  | "seo"
  | "negocios"
  | "tutoriales"

export const CATEGORIAS: Record<
  PostCategoria,
  { label: string; slug: string; descripcion: string; color: "cyan" | "purple" }
> = {
  "desarrollo-web": {
    label: "Desarrollo Web",
    slug: "desarrollo-web",
    descripcion: "Páginas, plataformas y tecnología web moderna para impulsar tu negocio.",
    color: "cyan",
  },
  ia: {
    label: "Inteligencia Artificial",
    slug: "ia",
    descripcion: "Asistentes virtuales, automatización con IA y casos reales aplicados a empresas.",
    color: "purple",
  },
  seo: {
    label: "SEO y Marketing",
    slug: "seo",
    descripcion: "Posicionamiento en Google, estrategias de contenido y mercadeo digital.",
    color: "cyan",
  },
  negocios: {
    label: "Negocios",
    slug: "negocios",
    descripcion: "Decisiones comerciales, precios, procesos y estrategia para empresarios.",
    color: "purple",
  },
  tutoriales: {
    label: "Tutoriales",
    slug: "tutoriales",
    descripcion: "Guías paso a paso y recomendaciones prácticas para aplicar hoy.",
    color: "cyan",
  },
}

export type PostFrontmatter = {
  title: string
  description: string
  date: string
  author: string
  category: PostCategoria
  tags?: string[]
  cover?: string
  featured?: boolean
}

export type Post = {
  slug: string
  frontmatter: PostFrontmatter
  content: string
  readingTimeMinutes: number
}

export function formatPostDate(date: string): string {
  return new Date(`${date}T00:00:00`).toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}
