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
    descripcion: "Next.js, React, arquitectura web moderna y buenas prácticas de desarrollo.",
    color: "cyan",
  },
  ia: {
    label: "Inteligencia Artificial",
    slug: "ia",
    descripcion: "Bots, agentes, automatización con IA y casos reales para negocios.",
    color: "purple",
  },
  seo: {
    label: "SEO y Marketing",
    slug: "seo",
    descripcion: "Posicionamiento en Google, estrategias de contenido y marketing digital.",
    color: "cyan",
  },
  negocios: {
    label: "Negocios",
    slug: "negocios",
    descripcion: "Decisiones comerciales, precios, procesos y estrategia para emprendedores.",
    color: "purple",
  },
  tutoriales: {
    label: "Tutoriales",
    slug: "tutoriales",
    descripcion: "Guías paso a paso, code snippets y tips técnicos.",
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
