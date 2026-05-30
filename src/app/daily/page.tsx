"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatDate, getDayOfYear } from "@/lib/utils";
import { cn } from "@/lib/utils";
import {
  Sun, Moon, CheckCircle, Circle, Star, BookOpen, ExternalLink,
} from "lucide-react";
import { useT } from "@/lib/i18n";

interface DailyReflection {
  title: string;
  date: string;
  quote: string;
  source: string;
  body: string;
}

export default function DailyRecoveryPage() {
  const { t } = useT();
  const today = new Date();
  const dayOfYear = getDayOfYear(today);
  const JFT_MONTHS = [
    "january","february","march","april","may","june",
    "july","august","september","october","november","december",
  ];
  const jftUrl = `https://www.justfortodaymeditations.com/daily-recovery-readings-${JFT_MONTHS[today.getMonth()]}-${today.getDate()}/`;
  const step = t.steps.stepData[dayOfYear % 12];

  const [reflection, setReflection] = useState<DailyReflection | null>(null);

  useEffect(() => {
    fetch("/api/daily-reflection")
      .then((r) => r.json())
      .then((data) => { if (data.title) setReflection(data); })
      .catch(() => {});
  }, []);

  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const [emotions, setEmotions] = useState<Set<string>>(new Set());

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleEmotion = (e: string) => {
    setEmotions((prev) => {
      const next = new Set(prev);
      if (next.has(e)) next.delete(e);
      else next.add(e);
      return next;
    });
  };

  const actionIds = ["prayer","meeting","sponsor","reading","inventory","gratitude","meditation","exercise","sleep","food"];
  const dailyItems = actionIds.map((id, i) => ({ id, label: t.daily.actions[i] }));

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      <div className="mb-10">
        <Badge variant="amber" className="mb-4">{t.daily.badge}</Badge>
        <h1 className="text-3xl font-light text-[var(--text-primary)] mb-2">
          {formatDate(today)}
        </h1>
        <p className="text-[var(--text-secondary)] font-light">
          {t.daily.subtitle}
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Daily reflection */}
        <Card variant="serenity" padding="lg" className="space-y-3">
          <div className="flex items-center gap-2">
            <Sun className="w-4 h-4 text-[var(--accent-serenity)]" aria-hidden />
            <span className="text-sm font-medium text-[var(--text-primary)]">{t.daily.dailyReflection}</span>
            {reflection && (
              <span className="ml-auto text-xs text-[var(--text-muted)]">{reflection.date}</span>
            )}
          </div>
          {reflection ? (
            <>
              <h2 className="text-lg font-light text-[var(--text-primary)]">{reflection.title}</h2>
              <p className="text-[var(--text-secondary)] italic leading-relaxed text-sm">
                &ldquo;{reflection.quote}&rdquo;
              </p>
              <p className="text-xs text-[var(--text-muted)]">{reflection.source}</p>
              {reflection.body && (
                <div className="text-sm text-[var(--text-secondary)] leading-relaxed border-t border-[var(--border-soft)] pt-3 space-y-3">
                  {reflection.body.split("\n\n").map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="space-y-2 animate-pulse">
              <div className="h-4 bg-[var(--border-soft)] rounded w-3/4" />
              <div className="h-3 bg-[var(--border-soft)] rounded w-full" />
              <div className="h-3 bg-[var(--border-soft)] rounded w-5/6" />
            </div>
          )}
        </Card>

        {/* Step of the day */}
        <Card variant="sage" padding="lg" className="space-y-3">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-[var(--accent-sage)]" aria-hidden />
            <span className="text-sm font-medium text-[var(--text-primary)]">{t.daily.stepOf(step.number)}</span>
          </div>
          <h2 className="text-lg font-light text-[var(--text-primary)]">{step.shortText}</h2>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed italic">
            &ldquo;{step.text}&rdquo;
          </p>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{step.reflection}</p>
        </Card>
      </div>

      {/* Just For Today */}
      <a
        href={jftUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block mb-6 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-serenity)] rounded-3xl"
      >
        <Card variant="serenity" padding="lg">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[var(--accent-serenity-light)] flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-5 h-5 text-[var(--accent-serenity)]" aria-hidden />
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--text-primary)] group-hover:text-[var(--accent-serenity)] transition-calm">
                  {t.daily.justForToday}
                </p>
                <p className="text-xs text-[var(--text-muted)]">{formatDate(today)}</p>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-[var(--accent-serenity)] flex-shrink-0 opacity-60 group-hover:opacity-100 transition-calm" aria-hidden />
          </div>
        </Card>
      </a>

      <div className="mb-6">
        {/* Emotional check-in */}
        <Card padding="lg">
          <div className="flex items-center gap-2 mb-4">
            <Moon className="w-4 h-4 text-[var(--accent-serenity)]" aria-hidden />
            <span className="text-sm font-medium text-[var(--text-primary)]">{t.daily.emotionalCheckIn}</span>
          </div>
          <p className="text-xs text-[var(--text-muted)] mb-3">{t.daily.howAreYou}</p>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Emotion selector">
            {t.daily.emotions.map((e) => (
              <button
                key={e}
                onClick={() => toggleEmotion(e)}
                aria-pressed={emotions.has(e)}
                className={cn(
                  "px-3 py-1.5 rounded-xl text-xs font-medium transition-calm",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-serenity)]",
                  emotions.has(e)
                    ? "bg-[var(--accent-serenity)] text-white"
                    : "bg-[var(--bg-muted)] text-[var(--text-secondary)] hover:bg-[var(--border-soft)]"
                )}
              >
                {e}
              </button>
            ))}
          </div>
        </Card>
      </div>

      {/* Daily checklist */}
      <Card padding="lg" className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle className="w-4 h-4 text-[var(--accent-sage)]" aria-hidden />
          <span className="text-sm font-medium text-[var(--text-primary)]">{t.daily.todaysActions}</span>
          <span className="ml-auto text-xs text-[var(--text-muted)]">
            {checkedItems.size}/{dailyItems.length}
          </span>
        </div>
        <ul className="space-y-2">
          {dailyItems.map((item) => {
            const checked = checkedItems.has(item.id);
            return (
              <li key={item.id}>
                <button
                  onClick={() => toggleCheck(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-2xl text-sm transition-calm text-left",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-sage)]",
                    checked
                      ? "bg-[var(--accent-sage-light)] text-[var(--text-secondary)]"
                      : "hover:bg-[var(--bg-muted)] text-[var(--text-primary)]"
                  )}
                  aria-pressed={checked}
                >
                  {checked ? (
                    <CheckCircle className="w-4 h-4 text-[var(--accent-sage)] flex-shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-[var(--border-muted)] flex-shrink-0" />
                  )}
                  <span className={checked ? "line-through opacity-60" : ""}>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </Card>

    </div>
  );
}
