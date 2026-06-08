"use client";

import Link from "next/link";
import {
  BookOpen, Users, Wind, Heart, Star, Calendar,
  ChevronRight, Sun, Moon
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatDate, getDayOfYear } from "@/lib/utils";
import NeurodivergentReadingPanel from "@/components/features/NeurodivergentReadingPanel";
import AASpeakersCard from "@/components/features/AASpeakersCard";
import { useT } from "@/lib/i18n";

function TodayWidget() {
  const { t } = useT();
  const today = new Date();
  const dayOfYear = getDayOfYear(today);
  const stepOfDay = t.steps.stepData[dayOfYear % 12];

  return (
    <Card variant="sage" padding="lg" className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Badge variant="sage" className="mb-2">{t.home.today}</Badge>
          <p className="text-sm text-[var(--text-muted)]">{formatDate(today)}</p>
        </div>
        <Sun className="w-5 h-5 text-[var(--accent-sage)] mt-1 flex-shrink-0" aria-hidden />
      </div>

      <div className="border-t border-[var(--accent-sage)]/15 pt-4 space-y-1">
        <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide font-medium">{t.home.todaysStep}</p>
        <p className="text-sm font-medium text-[var(--text-primary)]">
          {t.home.step} {stepOfDay.number}: {stepOfDay.shortText}
        </p>
        <p className="text-xs text-[var(--text-secondary)] line-clamp-2">{stepOfDay.reflection}</p>
      </div>

      <div className="border-t border-[var(--accent-sage)]/15 pt-4">
        <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide font-medium mb-2">{t.home.oneSmallAction}</p>
        <p className="text-sm text-[var(--text-secondary)]">{t.home.oneSmallActionText}</p>
      </div>
    </Card>
  );
}

function HALTCard() {
  const { t } = useT();
  const items = [
    { letter: "H", word: t.home.hungry, suggestion: t.home.hungrySug },
    { letter: "A", word: t.home.angry,  suggestion: t.home.angrySug },
    { letter: "L", word: t.home.lonely, suggestion: t.home.lonelySug },
    { letter: "T", word: t.home.tired,  suggestion: t.home.tiredSug },
  ];

  return (
    <Card padding="md">
      <div className="flex items-center gap-2 mb-3">
        <Sun className="w-4 h-4 text-[var(--accent-amber)]" aria-hidden />
        <span className="text-sm font-medium text-[var(--text-primary)]">{t.home.haltTitle}</span>
      </div>
      <p className="text-xs text-[var(--text-muted)] mb-3">{t.home.haltDesc}</p>
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

function getWeekOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 1);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / (7 * 24 * 60 * 60 * 1000));
}

function TraitPill({ label, desc, color }: { label: string; desc: string; color: "green" | "red" }) {
  const green = "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300";
  const red   = "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300";
  return (
    <div className="relative group inline-flex">
      <span className={`px-3 py-1.5 rounded-xl text-sm font-semibold cursor-help underline decoration-dotted underline-offset-2 ${color === "green" ? green : red}`}>
        {label}
      </span>
      <div className="absolute bottom-full left-0 mb-2 w-56 px-3 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border,#e5e7eb)] shadow-lg text-xs text-[var(--text-secondary)] leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none z-20">
        {desc}
      </div>
    </div>
  );
}

function WeeklyTraitsCard() {
  const { t } = useT();
  const week = getWeekOfYear(new Date());
  const vi = week % t.home.virtues.length;
  const di = (week * 3 + 17) % t.home.defects.length;

  return (
    <Card padding="md">
      <div className="flex items-center gap-2 mb-3">
        <Star className="w-4 h-4 text-[var(--accent-amber)]" aria-hidden />
        <span className="text-sm font-medium text-[var(--text-primary)]">{t.home.weeklyTraitsTitle}</span>
      </div>
      <div className="space-y-2.5">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)] w-14 flex-shrink-0">{t.home.weeklyVirtueLabel}</span>
          <TraitPill label={t.home.virtues[vi]} desc={t.home.virtueDescs[vi]} color="green" />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)] w-14 flex-shrink-0">{t.home.weeklyDefectLabel}</span>
          <TraitPill label={t.home.defects[di]} desc={t.home.defectDescs[di]} color="red" />
        </div>
      </div>
    </Card>
  );
}

function FINECard() {
  const { t } = useT();
  const items = [
    { letter: "F", word: t.home.fineF, suggestion: t.home.fineFSug },
    { letter: "I", word: t.home.fineI, suggestion: t.home.fineISug },
    { letter: "N", word: t.home.fineN, suggestion: t.home.fineNSug },
    { letter: "E", word: t.home.fineE, suggestion: t.home.fineESug },
  ];

  return (
    <Card padding="md">
      <div className="flex items-center gap-2 mb-3">
        <Heart className="w-4 h-4 text-[var(--accent-serenity)]" aria-hidden />
        <span className="text-sm font-medium text-[var(--text-primary)]">{t.home.fineTitle}</span>
      </div>
      <p className="text-xs text-[var(--text-muted)] mb-3">{t.home.fineDesc}</p>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.letter} className="flex items-start gap-2.5">
            <span className="w-6 h-6 rounded-lg bg-[var(--accent-serenity-light)] text-[var(--accent-serenity)] text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5" aria-hidden>
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
  const { t } = useT();
  return (
    <Card variant="serenity" padding="md">
      <div className="flex items-center gap-2 mb-3">
        <Moon className="w-4 h-4 text-[var(--accent-serenity)]" aria-hidden />
        <span className="text-sm font-medium text-[var(--text-primary)]">{t.home.serenityTitle}</span>
      </div>
      <p className="text-sm text-[var(--text-secondary)] leading-relaxed italic">
        {t.home.serenityText}
      </p>
      <Link
        href="/prayers"
        className="mt-3 text-xs text-[var(--accent-serenity)] hover:opacity-80 transition-calm inline-flex items-center gap-1"
      >
        {t.home.morePrayers} <ChevronRight className="w-3 h-3" />
      </Link>
    </Card>
  );
}

export default function HomeClient() {
  const { t } = useT();

  const quickActions = [
    {
      href: "/meetings",
      icon: <Users className="w-5 h-5" />,
      label: t.home.joinMeeting,
      description: t.home.joinMeetingDesc,
      variant: "sage" as const,
      badge: t.home.live,
    },
    {
      href: "/daily",
      icon: <Calendar className="w-5 h-5" />,
      label: t.home.dailyReflection,
      description: t.home.dailyReflectionDesc,
      variant: "amber" as const,
      badge: null,
    },
    {
      href: "/literature",
      icon: <BookOpen className="w-5 h-5" />,
      label: t.home.literature,
      description: t.home.literatureDesc,
      variant: "serenity" as const,
      badge: null,
    },
  ];

  const sectionLinks = [
    {
      href: "/meetings",
      icon: <Users className="w-5 h-5" />,
      title: t.home.meetings,
      desc: t.home.meetingsDesc,
      color: "text-[var(--accent-sage)]",
      bg: "bg-[var(--accent-sage-light)]",
    },
    {
      href: "/neurodivergent",
      icon: <Heart className="w-5 h-5" />,
      title: t.home.neurodivergentRecovery,
      desc: t.home.neurodivergentDesc,
      color: "text-[var(--accent-serenity)]",
      bg: "bg-[var(--accent-serenity-light)]",
    },
    {
      href: "/new-to-aa",
      icon: <Star className="w-5 h-5" />,
      title: t.home.newToAA,
      desc: t.home.newToAADesc,
      color: "text-[var(--accent-amber)]",
      bg: "bg-[var(--accent-amber-light)]",
    },
    {
      href: "/crisis",
      icon: <Wind className="w-5 h-5" />,
      title: t.home.crisisSupport,
      desc: t.home.crisisSupportDesc,
      color: "text-[var(--accent-serenity)]",
      bg: "bg-[var(--accent-serenity-light)]",
    },
  ];

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
            <span className="text-sm text-[var(--text-muted)]">{t.home.tagline}</span>
          </div>

          <h1
            id="hero-heading"
            className="text-4xl sm:text-5xl font-light text-[var(--text-primary)] leading-[1.2] mb-6 text-balance"
          >
            {t.home.heroLine1}
            <br />
            <em className="not-italic font-normal text-[var(--accent-sage)]">{t.home.heroEm}</em>
          </h1>

          <p className="text-xl text-[var(--text-secondary)] font-light leading-relaxed mb-4 max-w-lg">
            {t.home.heroSub}
          </p>

          <p className="text-[var(--text-muted)] text-base leading-relaxed max-w-md">
            {t.home.heroDesc}
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

        <div
          className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-[0.04] bg-[var(--accent-sage)] blur-3xl pointer-events-none"
          aria-hidden
        />
        <div
          className="absolute bottom-0 left-1/2 w-60 h-60 rounded-full opacity-[0.03] bg-[var(--accent-serenity)] blur-3xl pointer-events-none"
          aria-hidden
        />
      </section>

      {/* Today widget + HALT + AA Speakers */}
      <section
        className="px-4 sm:px-6 pb-16 max-w-6xl mx-auto"
        aria-labelledby="today-section"
      >
        <div className="grid lg:grid-cols-3 gap-6 items-start">
          {/* Left column: Today's Recovery + AA Speakers */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 id="today-section" className="text-lg font-semibold text-[var(--text-primary)] mb-4">
                {t.home.todaysRecovery}
              </h2>
              <TodayWidget />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">AA Speakers</h2>
              <AASpeakersCard />
            </div>
          </div>

          {/* Right column: HALT + Serenity */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
              {t.home.checkIn}
            </h2>
            <WeeklyTraitsCard />
            <HALTCard />
            <FINECard />
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
          {t.home.recoveryResources}
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {sectionLinks.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="group p-5 rounded-3xl border border-[var(--border-soft)] bg-[var(--bg-card)] hover:shadow-calm-md transition-calm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-sage)] block"
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

      <NeurodivergentReadingPanel />
    </div>
  );
}
