"use client"

import Link from "next/link"
import { ArrowRight, Clock } from "lucide-react"
import { motion } from "framer-motion"
import { SectionHeader } from "@/components/section-header"
import { PageSection } from "@/components/ui/page-section"

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  return date.toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric" })
}

const DEMO_POSTS = [
  {
    slug: "demo-1",
    title: "Cómo implementar un bot de WhatsApp con IA",
    description: "Guía paso a paso para crear un asistente automático",
    date: "2026-01-15",
    categoriaLabel: "Inteligencia Artificial",
  },
  {
    slug: "demo-2",
    title: "SEO para proyectos web en 2026",
    description: "Las mejores prácticas para posicionar tu sitio",
    date: "2026-01-10",
    categoriaLabel: "SEO",
  },
  {
    slug: "demo-3",
    title: "Por qué tener un portal de clientes",
    description: "Mejora la comunicación con tus clientes",
    date: "2026-01-05",
    categoriaLabel: "Negocios",
  },
]

interface BlogPost {
  slug: string
  title: string
  description: string
  date: string
  categoriaLabel: string
}

function BlogCard({ post, index }: { post: BlogPost; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link
        href={`/blog/${post.slug}`}
        className="group block p-6 rounded-2xl bg-white/[0.02] border border-white/8 hover:bg-white/[0.05] hover:border-white/15 transition-all duration-300"
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400/60">
            {post.categoriaLabel}
          </span>
          <span className="text-white/10">•</span>
          <span className="text-[10px] text-white/30 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatDate(post.date)}
          </span>
        </div>
        <h3 className="text-lg font-orbitron text-white group-hover:text-cyan-300 transition-colors mb-2">
          {post.title}
        </h3>
        <p className="text-sm text-white/40 line-clamp-2">
          {post.description}
        </p>
        <span className="inline-flex items-center gap-1 text-xs text-cyan-400/60 mt-4 group-hover:gap-2 transition-all">
          Leer más <ArrowRight className="w-3 h-3" />
        </span>
      </Link>
    </motion.div>
  )
}

export function BlogSection() {
  return (
    <PageSection id="blog" containerSize="lg">
      <div className="relative">
        <div className="text-center mb-16 sm:mb-20 animate-on-mount" data-animation="fade-down">
          <SectionHeader
            titleLeft="Nuestro"
            titleHighlight="Blog"
            subtitle="Guías, tutoriales y análisis sobre desarrollo web, IA y tecnología para negocios."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 mb-12">
          {DEMO_POSTS.map((post, index) => (
            <BlogCard key={post.slug} post={post} index={index} />
          ))}
        </div>

        <div className="text-center animate-on-mount" data-animation="fade-up">
          <Link
            href="/blog"
            prefetch={false}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-orbitron font-bold tracking-[0.2em] text-[11px] text-white border border-cyan-500/50 bg-cyan-500/10 shadow-[0_0_20px_rgba(34,211,238,0.2)] uppercase transition-all duration-200 hover:bg-cyan-500/20 hover:scale-105 active:scale-95"
          >
            Ver todos los artículos
            <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
          </Link>
        </div>
      </div>
    </PageSection>
  )
}