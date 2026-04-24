import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import dynamic from "next/dynamic"
import { MDXRemote } from "next-mdx-remote/rsc"
import remarkGfm from "remark-gfm"
import rehypeSlug from "rehype-slug"
import { ArrowRight, Clock, Calendar, User } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PostCard } from "@/components/blog/post-card"
import { mdxComponents } from "@/components/blog/mdx-components"
import {
  getPostBySlug,
  getAllPostSlugs,
  getRelatedPosts,
  CATEGORIAS,
  formatPostDate,
} from "@/lib/data/blog"

const WhatsAppFAB = dynamic(() => import("@/components/whatsapp-fab").then((mod) => mod.WhatsAppFAB))

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) return {}

  const url = `https://www.inzidium.com/blog/${post.slug}`
  const cover = post.frontmatter.cover
    ? `https://www.inzidium.com${post.frontmatter.cover}`
    : "https://www.inzidium.com/opengraph-image"

  return {
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    keywords: post.frontmatter.tags,
    authors: [{ name: post.frontmatter.author }],
    alternates: { canonical: url },
    openGraph: {
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      url,
      type: "article",
      publishedTime: post.frontmatter.date,
      authors: [post.frontmatter.author],
      images: [{ url: cover, width: 1200, height: 630, alt: post.frontmatter.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      images: [cover],
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) notFound()

  const related = await getRelatedPosts(slug, 3)
  const cat = CATEGORIAS[post.frontmatter.category]
  const isCyan = cat.color === "cyan"
  const url = `https://www.inzidium.com/blog/${post.slug}`

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.frontmatter.title,
    description: post.frontmatter.description,
    url,
    datePublished: post.frontmatter.date,
    dateModified: post.frontmatter.date,
    author: {
      "@type": "Person",
      name: post.frontmatter.author,
    },
    publisher: {
      "@type": "Organization",
      name: "InZidium",
      url: "https://www.inzidium.com",
      logo: {
        "@type": "ImageObject",
        url: "https://www.inzidium.com/logo.webp",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    articleSection: cat.label,
    keywords: post.frontmatter.tags?.join(", "),
    inLanguage: "es-CO",
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.inzidium.com" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://www.inzidium.com/blog" },
      { "@type": "ListItem", position: 3, name: post.frontmatter.title, item: url },
    ],
  }

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <Header />

      <article className="flex-1 pt-32 pb-20 relative overflow-hidden">
        <div
          className={`absolute inset-0 pointer-events-none ${
            isCyan
              ? "bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,0.08)_0%,transparent_50%)]"
              : "bg-[radial-gradient(circle_at_50%_0%,rgba(168,85,247,0.08)_0%,transparent_50%)]"
          }`}
        />

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          {/* Breadcrumb */}
          <nav aria-label="breadcrumb" className="mb-8 text-xs text-muted-foreground">
            <ol className="flex items-center gap-2 flex-wrap">
              <li><Link href="/" className="hover:text-white transition-colors">Inicio</Link></li>
              <li aria-hidden>/</li>
              <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              <li aria-hidden>/</li>
              <li className="text-white/60 truncate max-w-[200px] sm:max-w-none" aria-current="page">
                {post.frontmatter.title}
              </li>
            </ol>
          </nav>

          {/* Header del post */}
          <header className="mb-12">
            <Link
              href="/blog"
              className={`inline-flex items-center self-start px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-[0.15em] mb-8 transition-colors ${
                isCyan
                  ? "bg-cyan-500/10 text-cyan-300 border border-cyan-400/20 hover:bg-cyan-500/20"
                  : "bg-purple-500/10 text-purple-300 border border-purple-400/20 hover:bg-purple-500/20"
              }`}
            >
              {cat.label}
            </Link>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-white mb-6 leading-tight tracking-tight">
              {post.frontmatter.title}
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              {post.frontmatter.description}
            </p>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-white/60 pb-8 border-b border-white/10">
              <span className="inline-flex items-center gap-2">
                <User className="w-4 h-4" strokeWidth={1.75} />
                {post.frontmatter.author}
              </span>
              <span className="inline-flex items-center gap-2">
                <Calendar className="w-4 h-4" strokeWidth={1.75} />
                <time dateTime={post.frontmatter.date}>{formatPostDate(post.frontmatter.date)}</time>
              </span>
              <span className="inline-flex items-center gap-2">
                <Clock className="w-4 h-4" strokeWidth={1.75} />
                {post.readingTimeMinutes} min de lectura
              </span>
            </div>
          </header>

          {/* Contenido MDX */}
          <div className="prose prose-invert max-w-none">
            <MDXRemote
              source={post.content}
              components={mdxComponents}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkGfm],
                  rehypePlugins: [rehypeSlug],
                },
              }}
            />
          </div>

          {/* Tags */}
          {post.frontmatter.tags && post.frontmatter.tags.length > 0 && (
            <div className="mt-16 pt-8 border-t border-white/10 flex flex-wrap gap-2">
              <span className="text-xs uppercase tracking-[0.15em] text-muted-foreground mr-2 self-center">Tags:</span>
              {post.frontmatter.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/70"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* CTA */}
          <section className="mt-16">
            <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-white/10 relative overflow-hidden text-center">
              <div
                className={`absolute inset-0 pointer-events-none ${
                  isCyan
                    ? "bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/5"
                    : "bg-gradient-to-br from-purple-500/10 via-transparent to-cyan-500/5"
                }`}
              />
              <div className="relative z-10">
                <h2 className="text-2xl sm:text-3xl font-orbitron text-white mb-4">
                  ¿Querés aplicar esto en tu negocio?
                </h2>
                <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                  Armamos una propuesta concreta a la medida. Hablemos sobre qué necesitás y cómo lo resolvemos.
                </p>
                <Link
                  href="/#contacto"
                  className={`inline-flex items-center gap-2 px-8 py-4 rounded-full font-orbitron font-bold tracking-[0.2em] text-[12px] text-white border shadow-[0_0_20px_rgba(34,211,238,0.2)] uppercase transition-all duration-200 hover:scale-105 active:scale-95 ${
                    isCyan
                      ? "border-cyan-500/50 bg-cyan-500/10 hover:bg-cyan-500/20"
                      : "border-purple-500/50 bg-purple-500/10 hover:bg-purple-500/20"
                  }`}
                >
                  Hablar con InZidium
                  <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
                </Link>
              </div>
            </div>
          </section>

          {/* Relacionados */}
          {related.length > 0 && (
            <section className="mt-20">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-xl sm:text-2xl font-orbitron text-white">Seguir leyendo</h2>
                  <p className="text-sm text-muted-foreground mt-1">Artículos relacionados en el blog</p>
                </div>
                <Link
                  href="/blog"
                  className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-cyan-300 hover:gap-2.5 transition-all"
                >
                  Ver todos
                  <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} />
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
                {related.map((p, i) => (
                  <PostCard key={p.slug} post={p} index={i} />
                ))}
              </div>
            </section>
          )}
        </div>
      </article>

      <Footer />
      <WhatsAppFAB />
    </main>
  )
}
