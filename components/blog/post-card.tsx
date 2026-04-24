"use client"

import Link from "next/link"
import { ArrowRight, Clock } from "lucide-react"
import type { Post } from "@/lib/data/blog"
import { CATEGORIAS, formatPostDate } from "@/lib/data/blog"

type Props = {
  post: Post
  index?: number
  featured?: boolean
}

export function PostCard({ post, index = 0, featured = false }: Props) {
  const cat = CATEGORIAS[post.frontmatter.category]
  const isCyan = cat.color === "cyan"

  return (
    <Link
      href={`/blog/${post.slug}`}
      prefetch={false}
      className="group block h-full"
      aria-label={`Leer: ${post.frontmatter.title}`}
    >
      <article
        className={`glass-panel glass-card rounded-3xl p-6 sm:p-8 relative overflow-hidden h-full flex flex-col will-change-transform translate-z-0 backface-hidden transition-transform duration-200 md:group-hover:-translate-y-1 ${
          featured ? "md:p-10" : ""
        }`}
        style={{
          animationDelay: `${0.1 + index * 0.05}s`,
          "--active-border": isCyan ? "rgba(34,211,238,0.5)" : "rgba(168,85,247,0.5)",
          "--active-glow": isCyan ? "rgba(34,211,238,0.2)" : "rgba(168,85,247,0.2)",
          "--neon-glow": isCyan ? "rgba(34,211,238,0.15)" : "rgba(168,85,247,0.15)",
        } as React.CSSProperties}
      >
        <div className="relative z-10 flex flex-col h-full">
          <div
            className={`inline-flex items-center self-start px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-[0.15em] mb-5 ${
              isCyan
                ? "bg-cyan-500/10 text-cyan-300 border border-cyan-400/20"
                : "bg-purple-500/10 text-purple-300 border border-purple-400/20"
            }`}
          >
            {cat.label}
          </div>

          <h3
            className={`font-orbitron text-white mb-3 leading-snug md:group-hover:text-neon-cyan transition-colors duration-200 ${
              featured ? "text-xl sm:text-2xl md:text-3xl" : "text-lg sm:text-xl"
            }`}
          >
            {post.frontmatter.title}
          </h3>

          <p
            className={`text-muted-foreground leading-relaxed mb-6 flex-1 ${
              featured ? "text-base" : "text-sm"
            }`}
          >
            {post.frontmatter.description}
          </p>

          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
            <time dateTime={post.frontmatter.date}>{formatPostDate(post.frontmatter.date)}</time>
            <span aria-hidden className="text-white/20">·</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3 h-3" strokeWidth={2} />
              {post.readingTimeMinutes} min
            </span>
          </div>

          <div
            className={`flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.15em] transition-transform duration-200 md:group-hover:translate-x-1 ${
              isCyan ? "text-cyan-300" : "text-purple-300"
            }`}
          >
            Leer artículo
            <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} />
          </div>
        </div>
      </article>
    </Link>
  )
}
