import type { Metadata } from "next";
import Link from "next/link";
import {
  BookOpen, Users, Headphones, Wind, Heart, Star, Calendar,
  ChevronRight, Sun, Moon
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatDate, getDayOfYear } from "@/lib/utils";
import { DAILY_REFLECTIONS, TWELVE_STEPS } from "@/lib/recovery-content";
import NeurodivergentReadingPanel from "@/components/features/NeurodivergentReadingPanel";
import FellowshipSection from "@/components/features/FellowshipSection";

export const metadata: Metadata = {
  title: "Home",
  description: "A peaceful digital recovery sanctuary. AA recovery resources, daily reflections, prayers, and meetings for people in recovery.",
};

function TodayWidget() {
  const today = new Date();
  const dayOfYear = getDayOfYear(today);
  const reflection = DAILY_REFLECTIONS[dayOfYear % DAILY_REFLECTIONS.length];
  const stepOfDay = TWELVE_STEPS[(dayOfYear % 12)];

  return (
    <Card variant="sage" padding="lg" className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Badge variant="sage" className="mb-2">Today</Badge>
          <p className="text-sm text-[var(--text-muted)]">
            {formatDate(today)}
          </p>
        </div>
        <Sun className="w-5 h-5 text-[var(--accent-sage)] mt-1 flex-shrink-0" aria-hidden />
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold text-[var(--text-primary)]">{reflection.title}</h3>
        <p className="text-[var(--text-secondary)] text-sm leading-relaxed italic">
          &ldquo;{reflection.text}&rdquo;
        </p>
        <p className="text-xs text-[var(--text-muted)]">{reflection.source}</p>
      </div>

      <div className="border-t border-[var(--accent-sage)]/15 pt-4 space-y-1">
        <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide font-medium">Today&apos;s Step</p>
        <p className="text-sm font-medium text-[var(--text-primary)]">
          Step {stepOfDay.number}: {stepOfDay.shortText}
        </p>
        <p className="text-xs text-[var(--text-secondary)] line-clamp-2">{stepOfDay.reflection}</p>
      </div>

      <div className="border-t border-[var(--accent-sage)]/15 pt-4">
        <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide font-medium mb-2">One small action</p>
        <p className="text-sm text-[var(--text-secondary)]">
          Read one paragraph of the Big Book, or say the Serenity Prayer once, quietly, to yourself.
        </p>
      </div>
    </Card>
  );
}

const quickActions = [
  {
    href: "/meetings",
    icon: <Users className="w-5 h-5" />,
    label: "Join a Meeting",
    description: "Online meetings available now",
    variant: "sage" as const,
    badge: "Live",
  },
  {
    href: "/prayers",
    icon: <BookOpen className="w-5 h-5" />,
    label: "Serenity Prayer",
    description: "Read or listen",
    variant: "serenity" as const,
    badge: null,
  },
  {
    href: "/daily",
    icon: <Calendar className="w-5 h-5" />,
    label: "Daily Reflection",
    description: "Today's meditation",
    variant: "amber" as const,
    badge: null,
  },
  {
    href: "/literature",
    icon: <BookOpen className="w-5 h-5" />,
    label: "Big Book",
    description: "AA literature library",
    variant: "sage" as const,
    badge: null,
  },
];

const sectionLinks = [
  {
    href: "/meetings",
    icon: <Users className="w-5 h-5" />,
    title: "Meetings",
    desc: "Online & in-person, available now",
    color: "text-[var(--accent-sage)]",
    bg: "bg-[var(--accent-sage-light)]",
  },
  {
    href: "/neurodivergent",
    icon: <Heart className="w-5 h-5" />,
    title: "Neurodivergent Recovery",
    desc: "Autistic burnout, sensory needs, low-demand tools",
    color: "text-[var(--accent-serenity)]",
    bg: "bg-[var(--accent-serenity-light)]",
  },
  {
    href: "/new-to-aa",
    icon: <Star className="w-5 h-5" />,
    title: "New to AA",
    desc: "Your questions answered gently",
    color: "text-[var(--accent-amber)]",
    bg: "bg-[var(--accent-amber-light)]",
  },
  {
    href: "/crisis",
    icon: <Wind className="w-5 h-5" />,
    title: "Crisis Support",
    desc: "Grounding tools and emergency resources",
    color: "text-[var(--accent-serenity)]",
    bg: "bg-[var(--accent-serenity-light)]",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section
        className="relative px-4 sm:px-6 pt-16 pb-20 max-w-6xl mx-auto"
        aria-labelledby="hero-heading"
      >
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-sage)] animate-[breathe_3s_ease-in-out_infinite]" aria-hidden />
            <span className="text-sm text-[var(--text-muted)]">Recovery, one day at a time</span>
          </div>

          <h1
            id="hero-heading"
            className="text-4xl sm:text-5xl font-light text-[var(--text-primary)] leading-[1.2] mb-6 text-balance"
          >
            You do not have to do
            <br />
            <em className="not-italic font-normal text-[var(--accent-sage)]">recovery perfectly.</em>
          </h1>

          <p className="text-xl text-[var(--text-secondary)] font-light leading-relaxed mb-4 max-w-lg">
            You only need to stay sober today.
          </p>

          <p className="text-[var(--text-muted)] text-base leading-relaxed max-w-md">
            A calm, accessible space for AA recovery — especially for those who
            are exhausted, overwhelmed, or neurodivergent.
          </p>

          <div className="flex flex-wrap gap-3 mt-10">
            {quickActions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className={`
                  flex items-center gap-2.5 px-5 py-3 rounded-2xl text-sm font-medium
                  border transition-calm focus-visible:outline-none focus-visible:ring-2
                  focus-visible:ring-[var(--accent-sage)] group
                  ${action.variant === "sage"
                    ? "bg-[var(--accent-sage)] text-white border-transparent hover:opacity-90"
                    : action.variant === "serenity"
                    ? "bg-[var(--accent-serenity-light)] text-[var(--accent-serenity)] border-[var(--accent-serenity)]/15 hover:bg-[var(--accent-serenity)]/20"
                    : "bg-[var(--bg-secondary)] text-[var(--text-primary)] border-[var(--border-soft)] hover:bg-[var(--bg-muted)]"
                  }
                `}
              >
                <span aria-hidden className="flex-shrink-0">{action.icon}</span>
                {action.label}
                {action.badge && (
                  <span className="ml-1 px-1.5 py-0.5 rounded-full text-xs bg-white/20 font-normal">
                    {action.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>

        {/* Decorative soft orbs */}
        <div
          className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-[0.04] bg-[var(--accent-sage)] blur-3xl pointer-events-none"
          aria-hidden
        />
        <div
          className="absolute bottom-0 left-1/2 w-60 h-60 rounded-full opacity-[0.03] bg-[var(--accent-serenity)] blur-3xl pointer-events-none"
          aria-hidden
        />
      </section>

      {/* Today widget + HALT */}
      <section
        className="px-4 sm:px-6 pb-20 max-w-6xl mx-auto"
        aria-labelledby="today-section"
      >
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <h2 id="today-section" className="text-lg font-semibold text-[var(--text-primary)] mb-4">
              Today&apos;s Recovery
            </h2>
            <TodayWidget />
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
              Check In
            </h2>
            <HALTCard />
            <SerenityCard />
          </div>
        </div>
      </section>

      {/* Section links grid */}
      <section
        className="px-4 sm:px-6 pb-24 max-w-6xl mx-auto"
        aria-labelledby="explore-section"
      >
        <h2
          id="explore-section"
          className="text-lg font-semibold text-[var(--text-primary)] mb-6"
        >
          Recovery Resources
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {sectionLinks.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className={`
                group p-5 rounded-3xl border border-[var(--border-soft)]
                bg-[var(--bg-card)] hover:shadow-calm-md transition-calm
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-sage)]
                block
              `}
            >
              <div className={`w-10 h-10 rounded-2xl ${section.bg} flex items-center justify-center mb-3`}>
                <span className={section.color} aria-hidden>{section.icon}</span>
              </div>
              <h3 className="font-medium text-[var(--text-primary)] mb-1 text-sm group-hover:text-[var(--accent-sage)] transition-calm">
                {section.title}
              </h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                {section.desc}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Fellowship */}
      <FellowshipSection />

      {/* Reading with neurodivergent needs */}
      <NeurodivergentReadingPanel />

      {/* Gentle reminder */}
      <section className="px-4 sm:px-6 pb-24 max-w-3xl mx-auto text-center">
        <Card variant="serenity" padding="lg">
          <Headphones className="w-6 h-6 text-[var(--accent-serenity)] mx-auto mb-4" aria-hidden />
          <p className="text-[var(--text-primary)] text-lg font-light leading-relaxed italic mb-3">
            &ldquo;The most important thing is that we do not pick up a drink today.
            Everything else can wait.&rdquo;
          </p>
          <p className="text-xs text-[var(--text-muted)]">AA Program</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/meetings"
              className="px-5 py-2.5 rounded-2xl bg-[var(--accent-serenity)] text-white text-sm font-medium hover:opacity-90 transition-calm"
            >
              Find a meeting now
            </Link>
            <Link
              href="/daily"
              className="px-5 py-2.5 rounded-2xl bg-[var(--accent-serenity-light)] text-[var(--accent-serenity)] text-sm font-medium hover:bg-[var(--accent-serenity)]/20 transition-calm"
            >
              Daily reflection
            </Link>
          </div>
        </Card>
      </section>
    </div>
  );
}

function HALTCard() {
  const items = [
    { letter: "H", word: "Hungry?", suggestion: "Eat something simple — a piece of fruit, toast, soup." },
    { letter: "A", word: "Angry?", suggestion: "Write it down. You do not have to act on it." },
    { letter: "L", word: "Lonely?", suggestion: "Join a meeting. Text your sponsor. You matter." },
    { letter: "T", word: "Tired?", suggestion: "Rest is recovery. It is okay to sleep." },
  ];

  return (
    <Card padding="md">
      <div className="flex items-center gap-2 mb-3">
        <Sun className="w-4 h-4 text-[var(--accent-amber)]" aria-hidden />
        <span className="text-sm font-medium text-[var(--text-primary)]">HALT Check</span>
      </div>
      <p className="text-xs text-[var(--text-muted)] mb-3">
        Before reaching for a drink, ask yourself:
      </p>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.letter} className="flex items-start gap-2.5">
            <span className="w-6 h-6 rounded-lg bg-[var(--accent-amber-light)] text-[var(--accent-amber)] text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5" aria-hidden>
              {item.letter}
            </span>
            <div>
              <span className="text-sm font-medium text-[var(--text-primary)]">{item.word}</span>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">{item.suggestion}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function SerenityCard() {
  return (
    <Card variant="serenity" padding="md">
      <div className="flex items-center gap-2 mb-3">
        <Moon className="w-4 h-4 text-[var(--accent-serenity)]" aria-hidden />
        <span className="text-sm font-medium text-[var(--text-primary)]">Serenity Prayer</span>
      </div>
      <p className="text-sm text-[var(--text-secondary)] leading-relaxed italic">
        God, grant me the serenity to accept the things I cannot change,
        courage to change the things I can, and wisdom to know the difference.
      </p>
      <Link
        href="/prayers"
        className="mt-3 text-xs text-[var(--accent-serenity)] hover:opacity-80 transition-calm inline-flex items-center gap-1"
      >
        More prayers <ChevronRight className="w-3 h-3" />
      </Link>
    </Card>
  );
}
