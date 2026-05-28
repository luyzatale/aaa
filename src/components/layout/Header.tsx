"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Menu, X, Heart } from "lucide-react";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/new-to-aa", label: "New to AA" },
  { href: "/daily", label: "Daily Recovery" },
  { href: "/literature", label: "Literature" },
  { href: "/prayers", label: "Prayers" },
  { href: "/meetings", label: "Meetings" },
  { href: "/neurodivergent", label: "Neurodivergent" },
  { href: "/steps", label: "Step Work" },
  { href: "/crisis", label: "Crisis Support" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full",
        "bg-[var(--bg-primary)]/90 backdrop-blur-md",
        "border-b border-[var(--border-soft)]",
        "transition-calm"
      )}
      role="banner"
    >
      <nav
        className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between"
        aria-label="Main navigation"
      >
        <Link
          href="/"
          className="flex items-center gap-2.5 font-semibold text-[var(--text-primary)] hover:opacity-80 transition-calm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-sage)] rounded-lg p-1"
          aria-label="Serenity Path — AA Recovery Home"
        >
          <span className="w-7 h-7 rounded-xl bg-[var(--accent-sage-light)] flex items-center justify-center" aria-hidden>
            <Heart className="w-4 h-4 text-[var(--accent-sage)]" />
          </span>
          <span className="text-base">Serenity Path</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-1" role="list">
          {navItems.slice(0, 7).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              role="listitem"
              className={cn(
                "px-3 py-1.5 rounded-xl text-sm transition-calm",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-sage)]",
                pathname === item.href
                  ? "text-[var(--accent-sage)] bg-[var(--accent-sage-light)] font-medium"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)]"
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-2">
          <Link
            href="/crisis"
            className={cn(
              "px-4 py-2 rounded-2xl text-sm font-medium transition-calm",
              "bg-[var(--accent-serenity-light)] text-[var(--accent-serenity)]",
              "hover:bg-[var(--accent-serenity)]/20",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-serenity)]"
            )}
          >
            Crisis Support
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className={cn(
            "lg:hidden p-2 rounded-xl transition-calm",
            "text-[var(--text-secondary)] hover:bg-[var(--bg-muted)]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-sage)]"
          )}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          id="mobile-nav"
          className={cn(
            "lg:hidden border-t border-[var(--border-soft)]",
            "bg-[var(--bg-primary)] px-4 py-4 space-y-1",
            "animate-fade-in"
          )}
          role="navigation"
          aria-label="Mobile navigation"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "block px-4 py-3 rounded-2xl text-sm transition-calm",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-sage)]",
                pathname === item.href
                  ? "text-[var(--accent-sage)] bg-[var(--accent-sage-light)] font-medium"
                  : "text-[var(--text-secondary)] hover:bg-[var(--bg-muted)]"
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
