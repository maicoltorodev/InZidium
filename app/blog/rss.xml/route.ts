import { getAllPosts } from "@/lib/data/blog"

const BASE_URL = "https://www.inzidium.com"

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

export async function GET() {
  const posts = await getAllPosts()
  const lastBuild = posts[0]
    ? new Date(`${posts[0].frontmatter.date}T00:00:00Z`).toUTCString()
    : new Date().toUTCString()

  const items = posts
    .map((post) => {
      const pubDate = new Date(`${post.frontmatter.date}T00:00:00Z`).toUTCString()
      return `
    <item>
      <title>${escapeXml(post.frontmatter.title)}</title>
      <link>${BASE_URL}/blog/${post.slug}</link>
      <description>${escapeXml(post.frontmatter.description)}</description>
      <pubDate>${pubDate}</pubDate>
      <author>noreply@inzidium.com (${escapeXml(post.frontmatter.author)})</author>
      <guid isPermaLink="true">${BASE_URL}/blog/${post.slug}</guid>
      <category>${escapeXml(post.frontmatter.category)}</category>
    </item>`
    })
    .join("")

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>InZidium Blog</title>
    <link>${BASE_URL}/blog</link>
    <atom:link href="${BASE_URL}/blog/rss.xml" rel="self" type="application/rss+xml" />
    <description>Desarrollo web, IA, SEO y tecnología para empresas en Colombia</description>
    <language>es-CO</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
    <generator>InZidium</generator>${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  })
}
