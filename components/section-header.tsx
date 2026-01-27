type SectionHeaderProps = {
  titleLeft: string
  titleHighlight: string
  subtitle: string
}

export function SectionHeader({ titleLeft, titleHighlight, subtitle }: SectionHeaderProps) {
  return (
    <>
      <h2 className="section-title-float text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold mb-6 sm:mb-8 tracking-tight leading-tight">
        <span className="text-foreground">{titleLeft}</span>{" "}
        <span className="text-primary bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
          {titleHighlight}
        </span>
      </h2>
      <p className="text-lg sm:text-xl md:text-2xl text-foreground/70 max-w-4xl mx-auto font-light leading-relaxed mb-8">
        {subtitle}
      </p>
      <div className="flex items-center justify-center gap-4 max-w-md mx-auto">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-border" />
        <div className="w-2 h-2 rounded-full bg-primary/40" />
        <div className="h-px flex-1 bg-gradient-to-l from-transparent via-border to-border" />
      </div>
    </>
  )
}
