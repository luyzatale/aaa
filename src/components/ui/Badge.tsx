import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "sage" | "serenity" | "amber" | "muted";
}

export function Badge({ className, variant = "sage", children, ...props }: BadgeProps) {
  const variants = {
    sage: "bg-[var(--accent-sage-light)] text-[var(--accent-sage)]",
    serenity: "bg-[var(--accent-serenity-light)] text-[var(--accent-serenity)]",
    amber: "bg-[var(--accent-amber-light)] text-[var(--accent-amber)]",
    muted: "bg-[var(--bg-muted)] text-[var(--text-muted)]",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
