import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "destructive"
  size?: "default" | "icon" | "sm" | "lg"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-lg text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
          {
            // Primary button with gradient and glow
            "bg-gradient-to-r from-primary via-primary to-accent text-primary-foreground hover:from-primary/95 hover:via-primary/95 hover:to-accent/95 active:from-primary active:via-primary active:to-accent shadow-lg hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98] relative overflow-hidden": variant === "default",
            // Outline button with better visibility and glow
            "border-2 border-primary/60 bg-transparent text-primary hover:bg-primary/10 hover:border-primary hover:shadow-lg hover:shadow-primary/20 active:bg-primary/20 active:scale-[0.98]": variant === "outline",
            // Ghost button
            "text-foreground hover:bg-accent/20 hover:text-accent-foreground active:bg-accent/30 active:scale-[0.98]": variant === "ghost",
            // Destructive button
            "bg-destructive text-destructive-foreground hover:bg-destructive/90 active:bg-destructive/95 shadow-md hover:shadow-lg active:scale-[0.98]": variant === "destructive",
            // Sizes
            "h-10 px-5 py-2": size === "default",
            "h-8 px-3 text-xs": size === "sm",
            "h-12 px-8 text-base": size === "lg",
            "h-10 w-10": size === "icon",
          },
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }

