"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Menu, X, Heart, ChevronDown, HeartHandshake } from "lucide-react";
import { useT } from "@/lib/i18n";

function NavDropdown({
  groupId, label, items, isOpen, onOpen, onClose, pathname,
}: {
  groupId: string;
  label: string;
  items: { href: string; label: string; desc: string }[];
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  pathname: string;
}) {
  const isGroupActive = items.some((item) => pathname === item.href);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  return (
    <div ref={containerRef} className="relative" onMouseEnter={onOpen}>
      <button
        onClick={onOpen}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className={cn(
          "px-3 py-1.5 rounded-xl text-sm transition-calm flex items-center gap-1",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-sage)]",
          isGroupActive || isOpen
            ? "text-[var(--accent-sage)] bg-[var(--accent-sage-light)] font-medium"
            : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)]"
        )}
      >
        {label}
        <ChevronDown
          className={cn("w-3 h-3 transition-calm", isOpen && "rotate-180")}
          aria-hidden
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 w-60 z-50 pt-1.5">
          <div
            className="rounded-2xl bg-[var(--bg-card)] border border-[var(--border-soft)] shadow-calm-md p-2 animate-fade-in"
            role="menu"
            aria-label={`${label} submenu`}
          >
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                role="menuitem"
                onClick={onClose}
                className={cn(
                  "block px-3 py-2.5 rounded-xl transition-calm",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-sage)]",
                  pathname === item.href
                    ? "text-[var(--accent-sage)] bg-[var(--accent-sage-light)]"
                    : "text-[var(--text-secondary)] hover:bg-[var(--bg-muted)] hover:text-[var(--text-primary)]"
                )}
              >
                <span className="block text-sm font-medium">{item.label}</span>
                <span className="block text-xs text-[var(--text-muted)] mt-0.5">{item.desc}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MobileNavGroup({
  label, items, pathname, onClose,
}: {
  label: string;
  items: { href: string; label: string; desc: string }[];
  pathname: string;
  onClose: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const isGroupActive = items.some((item) => pathname === item.href);

  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        className={cn(
          "w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm transition-calm",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-sage)]",
          isGroupActive
            ? "text-[var(--accent-sage)] bg-[var(--accent-sage-light)] font-medium"
            : "text-[var(--text-secondary)] hover:bg-[var(--bg-muted)]"
        )}
      >
        {label}
        <ChevronDown
          className={cn("w-4 h-4 transition-calm", expanded && "rotate-180")}
          aria-hidden
        />
      </button>
      {expanded && (
        <div className="pl-4 pt-1 space-y-0.5">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "block px-4 py-2.5 rounded-xl text-sm transition-calm",
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
    </div>
  );
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const pathname = usePathname();
  const { t, lang, setLang } = useT();

  const navGroups = [
    {
      id: "recovery",
      label: t.nav.recovery,
      items: [
        { href: "/daily",        label: t.nav.dailyRecovery,  desc: t.nav.dailyRecoveryDesc },
        { href: "/prayers",      label: t.nav.prayers,        desc: t.nav.prayersDesc },
        { href: "/steps",        label: t.nav.stepWork,       desc: t.nav.stepWorkDesc },
        { href: "/sponsorship",  label: t.nav.sponsorship,    desc: t.nav.sponsorshipDesc },
        { href: "/literature",   label: t.nav.literature,     desc: t.nav.literatureDesc },
      ],
    },
    {
      id: "support",
      label: t.nav.support,
      items: [
        { href: "/meetings",       label: t.nav.meetings,       desc: t.nav.meetingsDesc },
        { href: "/neurodivergent", label: t.nav.neurodivergent, desc: t.nav.neurodivergentDesc },
      ],
    },
  ];

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
          aria-label={t.nav.appAriaLabel}
        >
          <span className="w-7 h-7 rounded-xl bg-[var(--accent-sage-light)] flex items-center justify-center" aria-hidden>
            <Heart className="w-4 h-4 text-[var(--accent-sage)]" />
          </span>
          <span className="text-base">{t.nav.appName}</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-1">
          <Link
            href="/"
            className={cn(
              "px-3 py-1.5 rounded-xl text-sm transition-calm",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-sage)]",
              pathname === "/"
                ? "text-[var(--accent-sage)] bg-[var(--accent-sage-light)] font-medium"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)]"
            )}
          >
            {t.nav.home}
          </Link>
          <Link
            href="/new-to-aa"
            className={cn(
              "px-3 py-1.5 rounded-xl text-sm transition-calm",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-sage)]",
              pathname === "/new-to-aa"
                ? "text-[var(--accent-sage)] bg-[var(--accent-sage-light)] font-medium"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)]"
            )}
          >
            {t.nav.newToAA}
          </Link>
          {navGroups.map((group) => (
            <NavDropdown
              key={group.id}
              groupId={group.id}
              label={group.label}
              items={group.items}
              isOpen={openGroup === group.id}
              onOpen={() => setOpenGroup(group.id)}
              onClose={() => setOpenGroup(null)}
              pathname={pathname}
            />
          ))}
          <Link
            href="/fellowship"
            className={cn(
              "px-3 py-1.5 rounded-xl text-sm transition-calm flex items-center gap-1.5 font-medium",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-amber)]",
              "text-[var(--accent-amber)] bg-[var(--accent-amber-light)] hover:opacity-80"
            )}
          >
            <HeartHandshake className="w-4 h-4" aria-hidden />
            {t.nav.fellowship}
          </Link>
        </div>

        <div className="hidden lg:flex items-center gap-2">
          <button
            onClick={() => setLang(lang === "en" ? "pt" : "en")}
            aria-label={t.lang.switchLabel}
            className={cn(
              "px-3 py-1.5 rounded-xl text-sm font-medium transition-calm",
              "border border-[var(--border-soft)] text-[var(--text-secondary)] hover:bg-[var(--bg-muted)]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-sage)]"
            )}
          >
            {t.lang.toggle}
          </button>
          <Link
            href="/crisis"
            className={cn(
              "px-4 py-2 rounded-2xl text-sm font-medium transition-calm",
              "bg-[var(--accent-serenity-light)] text-[var(--accent-serenity)]",
              "hover:bg-[var(--accent-serenity)]/20",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-serenity)]"
            )}
          >
            {t.nav.crisisSupport}
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
          aria-label={mobileOpen ? t.nav.closeMenu : t.nav.openMenu}
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
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className={cn(
              "block px-4 py-3 rounded-2xl text-sm transition-calm",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-sage)]",
              pathname === "/"
                ? "text-[var(--accent-sage)] bg-[var(--accent-sage-light)] font-medium"
                : "text-[var(--text-secondary)] hover:bg-[var(--bg-muted)]"
            )}
          >
            {t.nav.home}
          </Link>
          <Link
            href="/new-to-aa"
            onClick={() => setMobileOpen(false)}
            className={cn(
              "block px-4 py-3 rounded-2xl text-sm transition-calm",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-sage)]",
              pathname === "/new-to-aa"
                ? "text-[var(--accent-sage)] bg-[var(--accent-sage-light)] font-medium"
                : "text-[var(--text-secondary)] hover:bg-[var(--bg-muted)]"
            )}
          >
            {t.nav.newToAA}
          </Link>
          {navGroups.map((group) => (
            <MobileNavGroup
              key={group.id}
              label={group.label}
              items={group.items}
              pathname={pathname}
              onClose={() => setMobileOpen(false)}
            />
          ))}
          <Link
            href="/fellowship"
            onClick={() => setMobileOpen(false)}
            className={cn(
              "flex items-center gap-1.5 px-4 py-3 rounded-2xl text-sm transition-calm font-medium",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-amber)]",
              "text-[var(--accent-amber)] bg-[var(--accent-amber-light)] hover:opacity-80"
            )}
          >
            <HeartHandshake className="w-4 h-4" aria-hidden />
            {t.nav.fellowship}
          </Link>
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => { setLang(lang === "en" ? "pt" : "en"); setMobileOpen(false); }}
              aria-label={t.lang.switchLabel}
              className={cn(
                "flex-1 px-4 py-3 rounded-2xl text-sm font-medium transition-calm",
                "border border-[var(--border-soft)] text-[var(--text-secondary)] hover:bg-[var(--bg-muted)]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-sage)]"
              )}
            >
              {t.lang.toggle}
            </button>
            <Link
              href="/crisis"
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex-1 block px-4 py-3 rounded-2xl text-sm font-medium text-center transition-calm",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-serenity)]",
                "bg-[var(--accent-serenity-light)] text-[var(--accent-serenity)]"
              )}
            >
              {t.nav.crisisSupport}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
