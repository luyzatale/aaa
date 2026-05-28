"use client";

import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "calm" | "crisis" | "sage";
  size?: "sm" | "md" | "lg" | "xl";
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, children, disabled, ...props }, ref) => {
    const base = [
      "inline-flex items-center justify-center gap-2 font-medium rounded-2xl",
      "transition-calm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
      "disabled:opacity-50 disabled:pointer-events-none",
      "select-none cursor-pointer",
    ].join(" ");

    const variants = {
      primary: "bg-[var(--accent-sage)] text-white hover:opacity-90 focus-visible:ring-[var(--accent-sage)] active:scale-[0.98]",
      secondary: "bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border-soft)] hover:bg-[var(--bg-muted)] focus-visible:ring-[var(--accent-sage)]",
      ghost: "text-[var(--text-secondary)] hover:bg-[var(--bg-muted)] hover:text-[var(--text-primary)] focus-visible:ring-[var(--accent-sage)]",
      calm: "bg-[var(--accent-serenity-light)] text-[var(--accent-serenity)] border border-[var(--accent-serenity)]/20 hover:bg-[var(--accent-serenity)]/20 focus-visible:ring-[var(--accent-serenity)]",
      crisis: "bg-[var(--accent-serenity)] text-white hover:opacity-90 focus-visible:ring-[var(--accent-serenity)] shadow-calm",
      sage: "bg-[var(--accent-sage-light)] text-[var(--accent-sage)] border border-[var(--accent-sage)]/20 hover:bg-[var(--accent-sage)]/20 focus-visible:ring-[var(--accent-sage)]",
    };

    const sizes = {
      sm: "px-4 py-2 text-sm",
      md: "px-5 py-2.5 text-sm",
      lg: "px-6 py-3 text-base",
      xl: "px-8 py-4 text-lg",
    };

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" aria-hidden />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
