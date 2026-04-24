import fs from "node:fs/promises"
import path from "node:path"
import matter from "gray-matter"
import readingTime from "reading-time"
import type { Post, PostCategoria, PostFrontmatter } from "./blog-meta"

export type { Post, PostCategoria, PostFrontmatter } from "./blog-meta"
export { CATEGORIAS, formatPostDate } from "./blog-meta"

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
