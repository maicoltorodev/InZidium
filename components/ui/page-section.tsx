import React from "react"
import { cn } from "@/lib/utils"

interface PageSectionProps extends React.HTMLAttributes<HTMLElement> {
  id?: string
  className?: string
  children: React.ReactNode
  containerSize?: "default" | "sm" | "lg" | "xl" | "full"
}

export function PageSection({ id, className, children, containerSize = "default", ...props }: PageSectionProps) {
  const sectionRef = React.useRef<HTMLElement>(null)

  React.useEffect(() => {
    if (sectionRef.current) {
      sectionRef.current.classList.add("mounted")
    }
  }, [])

  const containerClasses = {
    default: "container mx-auto px-4 sm:px-6 lg:px-8",
    sm: "container mx-auto px-4 sm:px-6 max-w-4xl",
    lg: "container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl",
    xl: "container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1400px]",
    full: "w-full",
  }

  return (
    <section
      id={id}
      ref={sectionRef}
      className={cn(
        "relative overflow-hidden scroll-mt-28 sm:scroll-mt-40 pt-36 sm:pt-52 lg:pt-64 pb-20 sm:pb-32 lg:pb-40 section-optimize",
        className
      )}
      {...props}
    >
      <div className="relative z-10">
        <div className={containerClasses[containerSize]}>{children}</div>
      </div>
    </section>
  )
}
