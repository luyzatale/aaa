import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { BookOpen, ExternalLink, FileText, Star } from "lucide-react";

export const metadata: Metadata = {
  title: "AA Literature Library",
  description: "Access the Big Book, 12 Steps & 12 Traditions, Daily Reflections, and more AA literature.",
};

const books = [
  {
    id: "big-book",
    title: "Alcoholics Anonymous",
    subtitle: "The Big Book",
    description:
      "The foundational text of AA. Contains the personal stories of early AA members and the original description of the 12 Steps. Available to read online for free.",
    url: "https://www.aa.org/the-big-book",
    badge: "Essential",
    badgeVariant: "sage" as const,
    icon: "📖",
    readingTime: "~6 hours",
    difficulty: "Accessible",
  },
  {
    id: "twelve-twelve",
    title: "Twelve Steps and Twelve Traditions",
    subtitle: "The 12 & 12",
    description:
      "A detailed exploration of each of the 12 Steps and 12 Traditions. Often used in step study and sponsorship work.",
    url: "https://www.aa.org/twelve-steps-twelve-traditions",
    badge: "Core",
    badgeVariant: "sage" as const,
    icon: "📚",
    readingTime: "~5 hours",
    difficulty: "Accessible",
  },
  {
    id: "living-sober",
    title: "Living Sober",
    subtitle: "Practical daily sobriety",
    description:
      "Practical methods for maintaining sobriety, written in simple and direct language. Excellent for early recovery.",
    url: "https://www.8n8aa.com/wp-content/uploads/2020/06/Living-Sober.pdf",
    badge: "Practical",
    badgeVariant: "amber" as const,
    icon: "🌱",
    readingTime: "~3 hours",
    difficulty: "Very accessible",
  },
  {
    id: "daily-reflections",
    title: "Daily Reflections",
    subtitle: "365 daily meditations",
    description:
      "A book of daily meditations written by AA members. One short reading per day keeps recovery in focus.",
    url: "https://www.aa.org/taxonomy/term/76",
    badge: "Daily",
    badgeVariant: "serenity" as const,
    icon: "☀️",
    readingTime: "~5 minutes/day",
    difficulty: "Very accessible",
  },
  {
    id: "steps-illustrated",
    title: "Twelve Steps Illustrated",
    subtitle: "Visual guide to the steps",
    description:
      "A visual, illustrated guide to the 12 Steps. Particularly helpful for visual learners and those who find dense text difficult.",
    url: "https://www.wpaarea60.org/docs/pamphlets/twelve-steps-illustrated.pdf",
    badge: "Visual",
    badgeVariant: "sage" as const,
    icon: "🎨",
    readingTime: "~30 minutes",
    difficulty: "Very accessible",
  },
  {
    id: "traditions-illustrated",
    title: "Twelve Traditions Illustrated",
    subtitle: "How AA works as a group",
    description:
      "An illustrated guide to the 12 Traditions — the principles that keep AA meetings and the fellowship healthy.",
    url: "https://www.aa.org/sites/default/files/literature/assets/p-43_thetwelvetradiillustrated.pdf",
    badge: "Visual",
    badgeVariant: "sage" as const,
    icon: "🤝",
    readingTime: "~30 minutes",
    difficulty: "Accessible",
  },
  {
    id: "concepts-illustrated",
    title: "Twelve Concepts Illustrated",
    subtitle: "How AA service works",
    description:
      "Illustrates the 12 Concepts for World Service — the principles behind how AA organises itself for service.",
    url: "https://www.aa.org/twelve-concepts-world-service-illustrated",
    badge: "Service",
    badgeVariant: "muted" as const,
    icon: "🌍",
    readingTime: "~45 minutes",
    difficulty: "Moderate",
  },
];

const lowEnergyTips = [
  "Start with just one page",
  "Use the Daily Reflections for short daily reads",
  "Audio versions are available via TTS in Prayers & Meditation",
  "The illustrated books are gentler when text feels overwhelming",
  "Living Sober is written in simple, direct language",
];

export default function LiteraturePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
      <div className="mb-10">
        <Badge variant="sage" className="mb-4">Literature Library</Badge>
        <h1 className="text-4xl font-light text-[var(--text-primary)] mb-4 leading-tight">
          AA Literature
        </h1>
        <p className="text-lg text-[var(--text-secondary)] font-light leading-relaxed max-w-2xl">
          All the core AA texts, free to read online. There is no right order.
          Start anywhere. Come back anytime.
        </p>
      </div>

      {/* Low energy reading mode */}
      <Card variant="amber" padding="md" className="mb-10">
        <div className="flex items-start gap-3">
          <Star className="w-5 h-5 text-[var(--accent-amber)] flex-shrink-0 mt-0.5" aria-hidden />
          <div>
            <h2 className="font-semibold text-[var(--text-primary)] mb-1">
              Low Energy Reading Guide
            </h2>
            <p className="text-sm text-[var(--text-secondary)] mb-3">
              If reading feels impossible today, here are gentler starting points:
            </p>
            <ul className="space-y-1">
              {lowEnergyTips.map((tip, i) => (
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
          {books.map((book) => (
            <div key={book.id} className="flex flex-col">
              <Card padding="lg" className="flex-1 flex flex-col space-y-4">
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span className="text-3xl" role="img" aria-label={book.title}>
                      {book.icon}
                    </span>
                    <Badge variant={book.badgeVariant}>{book.badge}</Badge>
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
                  href={book.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl
                    bg-[var(--accent-sage-light)] text-[var(--accent-sage)] text-sm font-medium
                    hover:bg-[var(--accent-sage)]/20 transition-calm
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-sage)]"
                  aria-label={`Read ${book.title} (opens in new tab)`}
                >
                  Read Online
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
          Reading with neurodivergent needs
        </h2>
        <div className="grid sm:grid-cols-2 gap-4 text-sm text-[var(--text-secondary)]">
          {[
            "Use the Accessibility settings (gear icon) to enable Dyslexia Font mode",
            "Increase text size for easier reading",
            "Enable Dark Mode or Night Mode to reduce eye strain",
            "Use the Focus Mode to reduce visual clutter",
            "Read in short sessions — even 5 minutes is valuable",
            "You can use the browser's built-in read-aloud feature",
          ].map((tip, i) => (
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
          Listen to prayers with text-to-speech →
        </Link>
      </div>
    </div>
  );
}
