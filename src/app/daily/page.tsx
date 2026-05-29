"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatDate, getDayOfYear } from "@/lib/utils";
import { cn } from "@/lib/utils";
import {
  Sun, Moon, Heart, CheckCircle, Circle, Star, BookOpen, ExternalLink, RefreshCw,
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

  const [sobrietyStartDate, setSobrietyStartDate] = useState<string | null>(null);
  const [sobrietyLoading, setSobrietyLoading] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [newSobrietyDate, setNewSobrietyDate] = useState("");
  const [sobrietySaving, setSobrietySaving] = useState(false);

  const sobrietyDays = sobrietyStartDate
    ? (() => {
        const [y, m, d] = sobrietyStartDate.split("-").map(Number);
        const start = new Date(y, m - 1, d);
        const now = new Date();
        const today0 = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        return Math.max(0, Math.floor((today0.getTime() - start.getTime()) / 86400000));
      })()
    : 0;

  useEffect(() => {
    fetch("/api/sobriety")
      .then((r) => r.json())
      .then((data) => { if (data.startDate) setSobrietyStartDate(data.startDate); })
      .catch(() => {})
      .finally(() => setSobrietyLoading(false));
  }, []);

  const saveSobrietyDate = async () => {
    if (!newSobrietyDate || sobrietySaving) return;
    setSobrietySaving(true);
    try {
      const res = await fetch("/api/sobriety", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startDate: newSobrietyDate }),
      });
      const data = await res.json();
      if (data.startDate) {
        setSobrietyStartDate(data.startDate);
        setShowDatePicker(false);
        setNewSobrietyDate("");
      }
    } catch {}
    setSobrietySaving(false);
  };

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

  const getMilestone = (days: number) => {
    if (days < 7) return t.daily.milestone0;
    if (days < 30) return t.daily.milestone7;
    if (days < 90) return t.daily.milestone30;
    if (days < 365) return t.daily.milestone90;
    return t.daily.milestone365;
  };

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
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed border-t border-[var(--border-soft)] pt-3">
                  {reflection.body.split("\n\n")[0]}
                </p>
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

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Sobriety counter */}
        <Card padding="lg">
          <div className="flex items-center gap-2 mb-4">
            <Heart className="w-4 h-4 text-[var(--accent-sage)]" aria-hidden />
            <span className="text-sm font-medium text-[var(--text-primary)]">{t.daily.sobrietyCounter}</span>
          </div>

          {sobrietyLoading ? (
            <div className="py-6 flex flex-col items-center gap-2 animate-pulse">
              <div className="h-12 w-20 bg-[var(--border-soft)] rounded-xl" />
              <div className="h-3 w-24 bg-[var(--border-soft)] rounded" />
            </div>
          ) : !showDatePicker ? (
            <>
              <div className="text-center py-4">
                <div className="text-5xl font-light text-[var(--accent-sage)]" aria-live="polite">
                  {sobrietyDays}
                </div>
                <div className="text-sm text-[var(--text-muted)] mt-1">
                  {sobrietyDays === 1 ? t.daily.daySober : t.daily.daysSober}
                </div>
                {sobrietyStartDate && (() => {
                  const [y,m,d] = sobrietyStartDate.split("-").map(Number);
                  return (
                    <p className="text-xs text-[var(--text-muted)] mt-2">
                      {t.daily.sinceDate(formatDate(new Date(y, m - 1, d)))}
                    </p>
                  );
                })()}
              </div>
              {sobrietyDays > 0 && (
                <p className="text-center text-xs text-[var(--text-muted)] mb-4">
                  {getMilestone(sobrietyDays)}
                </p>
              )}
              <button
                onClick={() => {
                  setNewSobrietyDate(sobrietyStartDate ?? "");
                  setShowDatePicker(true);
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs text-[var(--text-muted)] border border-[var(--border-soft)] hover:bg-[var(--bg-muted)] transition-calm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-sage)]"
              >
                <RefreshCw className="w-3 h-3" aria-hidden />
                {sobrietyStartDate ? t.daily.resetDate : t.daily.setMyDate}
              </button>
            </>
          ) : (
            <div className="space-y-3 py-2">
              <p className="text-sm text-[var(--text-secondary)]">
                {sobrietyStartDate ? t.daily.setNewDate : t.daily.whenSober}
              </p>
              <input
                type="date"
                value={newSobrietyDate}
                max={new Date().toISOString().split("T")[0]}
                onChange={(e) => setNewSobrietyDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[var(--border-soft)] bg-[var(--bg-card)] text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-sage)] transition-calm"
              />
              <div className="flex gap-2">
                <button
                  onClick={saveSobrietyDate}
                  disabled={!newSobrietyDate || sobrietySaving}
                  className="flex-1 py-2.5 rounded-xl bg-[var(--accent-sage)] text-white text-sm font-medium hover:opacity-90 transition-calm disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-sage)]"
                >
                  {sobrietySaving ? t.daily.saving : t.daily.save}
                </button>
                <button
                  onClick={() => { setShowDatePicker(false); setNewSobrietyDate(""); }}
                  className="flex-1 py-2.5 rounded-xl bg-[var(--bg-muted)] text-[var(--text-secondary)] text-sm hover:bg-[var(--border-soft)] transition-calm"
                >
                  {t.daily.cancel}
                </button>
              </div>
            </div>
          )}
        </Card>

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
