import type { MDXComponents } from "mdx/types"
import Link from "next/link"

export const mdxComponents: MDXComponents = {
  h2: ({ children, id, ...rest }) => (
    <h2
      id={id}
      className="text-2xl sm:text-3xl font-orbitron text-white mt-16 mb-6 scroll-mt-32 leading-tight"
      {...rest}
    >
      {children}
    </h2>
  ),
  h3: ({ children, id, ...rest }) => (
    <h3
      id={id}
      className="text-xl sm:text-2xl font-orbitron text-white mt-12 mb-4 scroll-mt-32 leading-snug"
      {...rest}
    >
      {children}
    </h3>
  ),
  h4: ({ children, id, ...rest }) => (
    <h4
      id={id}
      className="text-lg sm:text-xl font-semibold text-white mt-8 mb-3 scroll-mt-32"
      {...rest}
    >
      {children}
    </h4>
  ),
  p: ({ children }) => (
    <p className="text-base text-white/80 leading-relaxed mb-6">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="list-disc pl-6 space-y-2 mb-6 text-white/80 marker:text-cyan-400/60">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal pl-6 space-y-2 mb-6 text-white/80 marker:text-purple-400/60">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="leading-relaxed pl-1">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-cyan-400/60 pl-6 py-1 my-10 italic text-white/70 bg-cyan-500/5 rounded-r-lg">
      {children}
    </blockquote>
  ),
  a: ({ children, href }) => {
    const isExternal = href?.startsWith("http") || href?.startsWith("mailto:")
    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-cyan-300 underline decoration-cyan-400/40 underline-offset-4 hover:text-cyan-200 hover:decoration-cyan-300 transition-colors"
        >
          {children}
        </a>
      )
    }
    return (
      <Link
        href={href ?? "#"}
        className="text-cyan-300 underline decoration-cyan-400/40 underline-offset-4 hover:text-cyan-200 hover:decoration-cyan-300 transition-colors"
      >
        {children}
      </Link>
    )
  },
  code: ({ children }) => (
    <code className="px-1.5 py-0.5 rounded bg-white/10 text-cyan-300 text-[0.9em] font-mono border border-white/10">
      {children}
    </code>
  ),
  pre: ({ children }) => (
    <pre className="bg-[#0a0620] border border-white/10 rounded-2xl p-5 overflow-x-auto my-8 text-sm leading-relaxed">
      {children}
    </pre>
  ),
  strong: ({ children }) => <strong className="text-white font-semibold">{children}</strong>,
  em: ({ children }) => <em className="text-white/90 italic">{children}</em>,
  hr: () => <hr className="my-12 border-t border-white/10" />,
  table: ({ children }) => (
    <div className="my-8 overflow-x-auto rounded-2xl border border-white/10">
      <table className="w-full text-sm">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-cyan-300 bg-white/5 border-b border-white/10">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-4 py-3 text-white/80 border-b border-white/5">{children}</td>
  ),
  img: ({ src, alt }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src as string}
      alt={alt ?? ""}
      className="rounded-2xl my-8 border border-white/10"
      loading="lazy"
    />
  ),
}
