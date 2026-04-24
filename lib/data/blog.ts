import fs from "node:fs/promises"
import path from "node:path"
import matter from "gray-matter"
import readingTime from "reading-time"

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

const CONTENT_DIR = path.join(process.cwd(), "content", "blog")

export async function getAllPostSlugs(): Promise<string[]> {
  try {
    const files = await fs.readdir(CONTENT_DIR)
    return files
      .filter((f) => f.endsWith(".mdx"))
      .map((f) => f.replace(/\.mdx$/, ""))
  } catch {
    return []
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const filePath = path.join(CONTENT_DIR, `${slug}.mdx`)
    const raw = await fs.readFile(filePath, "utf-8")
    const { data, content } = matter(raw)
    const minutes = Math.max(1, Math.ceil(readingTime(content).minutes))
    return {
      slug,
      frontmatter: data as PostFrontmatter,
      content,
      readingTimeMinutes: minutes,
    }
  } catch {
    return null
  }
}

export async function getAllPosts(): Promise<Post[]> {
  const slugs = await getAllPostSlugs()
  const posts = await Promise.all(slugs.map((s) => getPostBySlug(s)))
  return posts
    .filter((p): p is Post => p !== null)
    .sort((a, b) => (a.frontmatter.date < b.frontmatter.date ? 1 : -1))
}

export async function getFeaturedPosts(): Promise<Post[]> {
  const posts = await getAllPosts()
  return posts.filter((p) => p.frontmatter.featured === true)
}

export async function getPostsByCategoria(categoria: PostCategoria): Promise<Post[]> {
  const posts = await getAllPosts()
  return posts.filter((p) => p.frontmatter.category === categoria)
}

export async function getRelatedPosts(slug: string, limit = 3): Promise<Post[]> {
  const current = await getPostBySlug(slug)
  if (!current) return []
  const all = await getAllPosts()

  const sameCategoria = all.filter(
    (p) => p.slug !== slug && p.frontmatter.category === current.frontmatter.category
  )
  if (sameCategoria.length >= limit) return sameCategoria.slice(0, limit)

  const otherPosts = all.filter(
    (p) => p.slug !== slug && p.frontmatter.category !== current.frontmatter.category
  )
  return [...sameCategoria, ...otherPosts].slice(0, limit)
}

export function formatPostDate(date: string): string {
  return new Date(`${date}T00:00:00`).toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}
