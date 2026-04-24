import type { Metadata } from "next"
import dynamic from "next/dynamic"
import Link from "next/link"
import { ArrowRight, Rss } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SectionHeader } from "@/components/section-header"
import { PostCard } from "@/components/blog/post-card"
import { getAllPosts, CATEGORIAS } from "@/lib/data/blog"

const WhatsAppFAB = dynamic(() => import("@/components/whatsapp-fab").then((mod) => mod.WhatsAppFAB))

export const metadata: Metadata = {
  title: "Blog · Desarrollo web, IA y tecnología para negocios",
  description:
    "Guías, tutoriales y análisis sobre desarrollo web, inteligencia artificial, SEO y transformación digital para empresas en Colombia.",
  alternates: {
    canonical: "https://www.inzidium.com/blog",
    types: {
      "application/rss+xml": "https://www.inzidium.com/blog/rss.xml",
    },
  },
  openGraph: {
    title: "Blog · InZidium",
    description:
      "Guías, tutoriales y análisis sobre desarrollo web, IA, SEO y tecnología para negocios.",
    url: "https://www.inzidium.com/blog",
    type: "website",
  },
}

export default async function BlogPage() {
  const posts = await getAllPosts()
  const featured = posts.filter((p) => p.frontmatter.featured === true)
  const rest = posts.filter((p) => p.frontmatter.featured !== true)

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Blog InZidium",
    description: "Desarrollo web, IA, SEO y tecnología para empresas en Colombia",
    url: "https://www.inzidium.com/blog",
    publisher: {
      "@type": "Organization",
      name: "InZidium",
      url: "https://www.inzidium.com",
    },
    blogPost: posts.slice(0, 20).map((p) => ({
      "@type": "BlogPosting",
      headline: p.frontmatter.title,
      url: `https://www.inzidium.com/blog/${p.slug}`,
      datePublished: p.frontmatter.date,
      author: {
        "@type": "Person",
        name: p.frontmatter.author,
      },
    })),
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.inzidium.com" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://www.inzidium.com/blog" },
    ],
  }

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <Header />

      <div className="flex-1 pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(168,85,247,0.08)_0%,transparent_50%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_30%,rgba(34,211,238,0.06)_0%,transparent_40%)] pointer-events-none" />

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1400px]">
          <nav aria-label="breadcrumb" className="mb-8 text-xs text-muted-foreground">
            <ol className="flex items-center gap-2">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Inicio
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="text-white/80" aria-current="page">Blog</li>
            </ol>
          </nav>

          <div className="text-center mb-16 sm:mb-20">
            <SectionHeader
              titleLeft="Nuestro"
              titleHighlight="Blog"
              subtitle="Guías, tutoriales y análisis sobre desarrollo web, IA, SEO y tecnología para negocios en Colombia."
            />
            <div className="mt-6 flex items-center justify-center gap-4 text-xs">
              <Link
                href="/blog/rss.xml"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-cyan-400/20 text-cyan-300 hover:bg-cyan-500/10 transition-colors"
                prefetch={false}
              >
                <Rss className="w-3.5 h-3.5" strokeWidth={2} />
                Suscríbete al RSS
              </Link>
            </div>
          </div>

          {posts.length === 0 && (
            <div className="glass-panel rounded-3xl p-12 text-center border border-white/10 max-w-2xl mx-auto">
              <h2 className="text-2xl font-orbitron text-white mb-3">Pronto aquí</h2>
              <p className="text-muted-foreground">
                Nuestro equipo está preparando el primer grupo de artículos. Vuelve pronto o suscríbete al RSS para recibir las novedades.
              </p>
            </div>
          )}

          {featured.length > 0 && (
            <section className="mb-20">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center">
                  <ArrowRight className="w-5 h-5 text-cyan-300" strokeWidth={1.75} />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-orbitron text-white">Destacados</h2>
                  <p className="text-xs sm:text-sm text-muted-foreground">Lo que estamos publicando y vale la pena leer</p>
                </div>
              </div>
              <div className={`grid gap-5 sm:gap-6 ${
                featured.length === 1
                  ? "grid-cols-1 max-w-3xl"
                  : featured.length === 2
                  ? "grid-cols-1 md:grid-cols-2"
                  : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              }`}>
                {featured.map((p, i) => (
                  <PostCard key={p.slug} post={p} index={i} featured={featured.length === 1} />
                ))}
              </div>
            </section>
          )}

          {rest.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-400/20 flex items-center justify-center">
                  <ArrowRight className="w-5 h-5 text-purple-300" strokeWidth={1.75} />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-orbitron text-white">Todos los artículos</h2>
                  <p className="text-xs sm:text-sm text-muted-foreground">Ordenados por fecha de publicación</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                {rest.map((p, i) => (
                  <PostCard key={p.slug} post={p} index={i} />
                ))}
              </div>
            </section>
          )}

          <div className="mt-24 flex flex-wrap gap-3 justify-center">
            <span className="text-xs uppercase tracking-[0.15em] text-muted-foreground mr-2 self-center">Categorías:</span>
            {Object.entries(CATEGORIAS).map(([key, cat]) => (
              <span
                key={key}
                className={`text-xs px-3 py-1.5 rounded-full border ${
                  cat.color === "cyan"
                    ? "bg-cyan-500/10 text-cyan-300 border-cyan-400/20"
                    : "bg-purple-500/10 text-purple-300 border-purple-400/20"
                }`}
              >
                {cat.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <Footer />
      <WhatsAppFAB />
    </main>
  )
}
