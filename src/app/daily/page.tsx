"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { TWELVE_STEPS } from "@/lib/recovery-content";
import { formatDate, getDayOfYear } from "@/lib/utils";
import { cn } from "@/lib/utils";
import {
  Sun, Moon, Heart, CheckCircle, Circle, Star, Minus, Plus,
} from "lucide-react";

const EMOTIONS = [
  "Grateful", "Anxious", "Serene", "Frustrated", "Hopeful",
  "Lonely", "Tired", "Present", "Overwhelmed", "Peaceful",
  "Irritable", "Content",
];

interface DailyReflection {
  title: string;
  date: string;
  quote: string;
  source: string;
  body: string;
}

export default function DailyRecoveryPage() {
  const today = new Date();
  const dayOfYear = getDayOfYear(today);
  const step = TWELVE_STEPS[dayOfYear % 12];

  const [reflection, setReflection] = useState<DailyReflection | null>(null);

  useEffect(() => {
    fetch("/api/daily-reflection")
      .then((r) => r.json())
      .then((data) => { if (data.title) setReflection(data); })
      .catch(() => {});
  }, []);

  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [sobrietyDays, setSobrietyDays] = useState(() => {
    try { return Number(localStorage.getItem("aa-sobriety-days") ?? 0); } catch { return 0; }
  });
  const [gratitude, setGratitude] = useState(["", "", ""]);
  const [emotions, setEmotions] = useState<Set<string>>(new Set());

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  useEffect(() => {
    try { localStorage.setItem("aa-sobriety-days", String(sobrietyDays)); } catch {}
  }, [sobrietyDays]);

  const toggleEmotion = (e: string) => {
    setEmotions((prev) => {
      const next = new Set(prev);
      if (next.has(e)) next.delete(e);
      else next.add(e);
      return next;
    });
  };

  const dailyItems = [
    { id: "prayer", label: "Said the Serenity Prayer" },
    { id: "meeting", label: "Attended a meeting" },
    { id: "sponsor", label: "Contacted my sponsor" },
    { id: "reading", label: "Read AA literature" },
    { id: "inventory", label: "Did a mini inventory" },
    { id: "gratitude", label: "Noted gratitude" },
    { id: "meditation", label: "Meditated or prayed" },
    { id: "exercise", label: "Moved my body" },
    { id: "sleep", label: "Prioritised sleep" },
    { id: "food", label: "Ate regularly" },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      <div className="mb-10">
        <Badge variant="amber" className="mb-4">Daily Recovery</Badge>
        <h1 className="text-3xl font-light text-[var(--text-primary)] mb-2">
          {formatDate(today)}
        </h1>
        <p className="text-[var(--text-secondary)] font-light">
          One day at a time. Today is enough.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Daily reflection */}
        <Card variant="serenity" padding="lg" className="space-y-3">
          <div className="flex items-center gap-2">
            <Sun className="w-4 h-4 text-[var(--accent-serenity)]" aria-hidden />
            <span className="text-sm font-medium text-[var(--text-primary)]">Daily Reflection</span>
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
            <span className="text-sm font-medium text-[var(--text-primary)]">Step {step.number}</span>
          </div>
          <h2 className="text-lg font-light text-[var(--text-primary)]">{step.shortText}</h2>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed italic">
            &ldquo;{step.text}&rdquo;
          </p>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{step.reflection}</p>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Sobriety counter */}
        <Card padding="lg">
          <div className="flex items-center gap-2 mb-4">
            <Heart className="w-4 h-4 text-[var(--accent-sage)]" aria-hidden />
            <span className="text-sm font-medium text-[var(--text-primary)]">Sobriety Counter</span>
          </div>
          <div className="flex items-center justify-center gap-6 py-4">
            <button
              onClick={() => setSobrietyDays(Math.max(0, sobrietyDays - 1))}
              className="w-10 h-10 rounded-full border border-[var(--border-soft)] flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--bg-muted)] transition-calm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-sage)]"
              aria-label="Decrease days"
            >
              <Minus className="w-4 h-4" />
            </button>
            <div className="text-center">
              <div className="text-5xl font-light text-[var(--accent-sage)]" aria-live="polite">
                {sobrietyDays}
              </div>
              <div className="text-sm text-[var(--text-muted)] mt-1">
                {sobrietyDays === 1 ? "day sober" : "days sober"}
              </div>
            </div>
            <button
              onClick={() => setSobrietyDays(sobrietyDays + 1)}
              className="w-10 h-10 rounded-full border border-[var(--border-soft)] flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--bg-muted)] transition-calm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-sage)]"
              aria-label="Increase days"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          {sobrietyDays > 0 && (
            <p className="text-center text-xs text-[var(--text-muted)]">
              {sobrietyDays < 7 && "Every day matters. You are doing it."}
              {sobrietyDays >= 7 && sobrietyDays < 30 && "One week or more. That is real."}
              {sobrietyDays >= 30 && sobrietyDays < 90 && "A month or more. Keep going."}
              {sobrietyDays >= 90 && sobrietyDays < 365 && "Three months or more. You are building a life."}
              {sobrietyDays >= 365 && "A year or more. That is extraordinary."}
            </p>
          )}
        </Card>

        {/* Emotional check-in */}
        <Card padding="lg">
          <div className="flex items-center gap-2 mb-4">
            <Moon className="w-4 h-4 text-[var(--accent-serenity)]" aria-hidden />
            <span className="text-sm font-medium text-[var(--text-primary)]">Emotional Check-in</span>
          </div>
          <p className="text-xs text-[var(--text-muted)] mb-3">How are you feeling right now?</p>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Emotion selector">
            {EMOTIONS.map((e) => (
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
          <span className="text-sm font-medium text-[var(--text-primary)]">Today&apos;s Recovery Actions</span>
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

      {/* Gratitude */}
      <Card variant="amber" padding="lg">
        <div className="flex items-center gap-2 mb-4">
          <Star className="w-4 h-4 text-[var(--accent-amber)]" aria-hidden />
          <span className="text-sm font-medium text-[var(--text-primary)]">Three Gratitudes</span>
        </div>
        <p className="text-xs text-[var(--text-muted)] mb-3">
          Small is fine. &ldquo;I have a bed&rdquo; counts.
        </p>
        <div className="space-y-2">
          {gratitude.map((value, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[var(--accent-amber-light)] text-[var(--accent-amber)] text-xs flex items-center justify-center flex-shrink-0 font-medium" aria-hidden>
                {i + 1}
              </span>
              <input
                type="text"
                value={value}
                onChange={(e) => {
                  const next = [...gratitude];
                  next[i] = e.target.value;
                  setGratitude(next);
                }}
                placeholder={`I am grateful for...`}
                aria-label={`Gratitude ${i + 1}`}
                className={cn(
                  "flex-1 px-3 py-2 rounded-xl text-sm",
                  "bg-[var(--bg-card)] border border-[var(--border-soft)]",
                  "text-[var(--text-primary)] placeholder:text-[var(--text-muted)]",
                  "focus:outline-none focus:ring-2 focus:ring-[var(--accent-amber)] transition-calm"
                )}
              />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
