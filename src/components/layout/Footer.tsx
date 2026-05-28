import Link from "next/link";
import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer
      className="border-t border-[var(--border-soft)] bg-[var(--bg-secondary)] mt-24"
      role="contentinfo"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Heart className="w-4 h-4 text-[var(--accent-sage)]" aria-hidden />
              <span className="font-semibold text-[var(--text-primary)] text-sm">Serenity Path</span>
            </div>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              A peaceful digital recovery sanctuary for exhausted minds.
              Built with love for people in recovery.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)] mb-3">Recovery</h3>
            <ul className="space-y-2">
              {[
                { href: "/daily", label: "Daily Recovery" },
                { href: "/prayers", label: "Prayers" },
                { href: "/steps", label: "Step Work" },
                { href: "/literature", label: "Literature" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-calm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)] mb-3">Support</h3>
            <ul className="space-y-2">
              {[
                { href: "/meetings", label: "Meetings" },
                { href: "/new-to-aa", label: "New to AA" },
                { href: "/neurodivergent", label: "Neurodivergent" },
                { href: "/crisis", label: "Crisis Support" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-calm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)] mb-3">Official AA</h3>
            <ul className="space-y-2">
              {[
                { href: "https://www.aa.org", label: "AA.org" },
                { href: "https://www.alcoholics-anonymous.org.uk", label: "AA UK" },
                { href: "https://www.aa.org/the-big-book", label: "Big Book" },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-calm"
                  >
                    {link.label} ↗
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-[var(--border-soft)] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[var(--text-muted)]">
            This website is not affiliated with Alcoholics Anonymous World Services.
            It is an independent recovery resource.
          </p>
          <p className="text-xs text-[var(--text-muted)]">
            If you are in crisis, please call{" "}
            <a href="tel:116123" className="underline text-[var(--accent-sage)]">116 123</a> (Samaritans UK) or{" "}
            <a href="tel:988" className="underline text-[var(--accent-sage)]">988</a> (US)
          </p>
        </div>
      </div>
    </footer>
  );
}
