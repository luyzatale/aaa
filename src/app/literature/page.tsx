"use client";

import Link from "next/link";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { BookOpen, ExternalLink, FileText, Star } from "lucide-react";
import { useT } from "@/lib/i18n";

const bookUrls: Record<string, string> = {
  "big-book": "https://www.aa.org/the-big-book",
  "twelve-twelve": "https://www.aa.org/twelve-steps-twelve-traditions",
  "living-sober": "https://www.8n8aa.com/wp-content/uploads/2020/06/Living-Sober.pdf",
  "daily-reflections": "https://www.aa.org/taxonomy/term/76",
  "steps-illustrated": "https://www.wpaarea60.org/docs/pamphlets/twelve-steps-illustrated.pdf",
  "traditions-illustrated": "https://www.aa.org/sites/default/files/literature/assets/p-43_thetwelvetradiillustrated.pdf",
  "concepts-illustrated": "https://www.aa.org/twelve-concepts-world-service-illustrated",
};

const bookIcons: Record<string, string> = {
  "big-book": "📖", "twelve-twelve": "📚", "living-sober": "🌱",
  "daily-reflections": "☀️", "steps-illustrated": "🎨",
  "traditions-illustrated": "🤝", "concepts-illustrated": "🌍",
};

const badgeVariants: Record<string, "sage" | "amber" | "serenity" | "muted"> = {
  "big-book": "sage", "twelve-twelve": "sage", "living-sober": "amber",
  "daily-reflections": "serenity", "steps-illustrated": "sage",
  "traditions-illustrated": "sage", "concepts-illustrated": "muted",
};

export default function LiteraturePage() {
  const { t } = useT();
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
      <div className="mb-10">
        <Badge variant="sage" className="mb-4">{t.literature.badge}</Badge>
        <h1 className="text-4xl font-light text-[var(--text-primary)] mb-4 leading-tight">
          {t.literature.title}
        </h1>
        <p className="text-lg text-[var(--text-secondary)] font-light leading-relaxed max-w-2xl">
          {t.literature.subtitle}
        </p>
      </div>

      {/* Low energy reading mode */}
      <Card variant="amber" padding="md" className="mb-10">
        <div className="flex items-start gap-3">
          <Star className="w-5 h-5 text-[var(--accent-amber)] flex-shrink-0 mt-0.5" aria-hidden />
          <div>
            <h2 className="font-semibold text-[var(--text-primary)] mb-1">
              {t.literature.lowEnergyTitle}
            </h2>
            <p className="text-sm text-[var(--text-secondary)] mb-3">
              {t.literature.lowEnergyDesc}
            </p>
            <ul className="space-y-1">
              {t.literature.lowEnergyTips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                  <span className="text-[var(--accent-amber)] mt-0.5" aria-hidden>·</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>

      {/* Book grid */}
      <section aria-labelledby="books-heading">
        <h2 id="books-heading" className="sr-only">AA Literature</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {t.literature.books.map((book) => (
            <div key={book.id} className="flex flex-col">
              <Card padding="lg" className="flex-1 flex flex-col space-y-4">
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span className="text-3xl" role="img" aria-label={book.title}>
                      {bookIcons[book.id]}
                    </span>
                    <Badge variant={badgeVariants[book.id]}>{book.badge}</Badge>
                  </div>
                  <CardTitle className="mb-1">{book.title}</CardTitle>
                  <CardDescription>{book.subtitle}</CardDescription>
                </div>

                <p className="text-sm text-[var(--text-secondary)] leading-relaxed flex-1">
                  {book.description}
                </p>

                <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
                  <span className="flex items-center gap-1">
                    <FileText className="w-3 h-3" aria-hidden />
                    {book.readingTime}
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3 h-3" aria-hidden />
                    {book.difficulty}
                  </span>
                </div>

                <a
                  href={bookUrls[book.id]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl bg-[var(--accent-sage-light)] text-[var(--accent-sage)] text-sm font-medium hover:bg-[var(--accent-sage)]/20 transition-calm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-sage)]"
                  aria-label={t.literature.readAriaLabel(book.title)}
                >
                  {t.literature.readOnline}
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden />
                </a>
              </Card>
            </div>
          ))}
        </div>
      </section>

      {/* Reading tips */}
      <Card variant="serenity" padding="lg" className="mt-12">
        <h2 className="font-semibold text-[var(--text-primary)] mb-3">
          {t.literature.neurodivergentReadingTitle}
        </h2>
        <div className="grid sm:grid-cols-2 gap-4 text-sm text-[var(--text-secondary)]">
          {t.literature.neurodivergentReadingTips.map((tip, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-[var(--accent-serenity)] mt-0.5" aria-hidden>·</span>
              {tip}
            </div>
          ))}
        </div>
      </Card>

      <div className="mt-8 text-center">
        <Link
          href="/prayers"
          className="text-sm text-[var(--accent-serenity)] hover:opacity-80 transition-calm"
        >
          {t.literature.listenLink}
        </Link>
      </div>
    </div>
  );
}
