import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "muted" | "sage" | "serenity" | "amber";
  padding?: "none" | "sm" | "md" | "lg";
}

export function Card({ className, variant = "default", padding = "md", children, ...props }: CardProps) {
  const base = "rounded-3xl border transition-calm";

  const variants = {
    default: "bg-[var(--bg-card)] border-[var(--border-soft)] shadow-calm",
    muted: "bg-[var(--bg-muted)] border-[var(--border-soft)]",
    sage: "bg-[var(--accent-sage-light)] border-[var(--accent-sage)]/15",
    serenity: "bg-[var(--accent-serenity-light)] border-[var(--accent-serenity)]/15",
    amber: "bg-[var(--accent-amber-light)] border-[var(--accent-amber)]/15",
  };

  const paddings = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <div className={cn(base, variants[variant], paddings[padding], className)} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("mb-4", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn("text-lg font-semibold text-[var(--text-primary)]", className)} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-sm text-[var(--text-secondary)] mt-1", className)} {...props}>
      {children}
    </p>
  );
}
