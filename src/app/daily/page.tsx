"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { TWELVE_STEPS } from "@/lib/recovery-content";
import { formatDate, getDayOfYear } from "@/lib/utils";
import { cn } from "@/lib/utils";
import {
  Sun, Moon, Heart, CheckCircle, Circle, Star, Trash2, BookOpen, ExternalLink, RefreshCw,
} from "lucide-react";

const EMOTIONS = [
  "Grateful", "Anxious", "Serene", "Frustrated", "Hopeful",
  "Lonely", "Tired", "Present", "Overwhelmed", "Peaceful",
  "Irritable", "Content",
];

interface GratitudeEntry {
  id: string;
  date: string;
  items: string[];
}

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
  const JFT_MONTHS = [
    "january","february","march","april","may","june",
    "july","august","september","october","november","december",
  ];
  const jftUrl = `https://www.justfortodaymeditations.com/daily-recovery-readings-${JFT_MONTHS[today.getMonth()]}-${today.getDate()}/`;
  const step = TWELVE_STEPS[dayOfYear % 12];

  const [reflection, setReflection] = useState<DailyReflection | null>(null);

  useEffect(() => {
    fetch("/api/daily-reflection")
      .then((r) => r.json())
      .then((data) => { if (data.title) setReflection(data); })
      .catch(() => {});
  }, []);

  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  // Sobriety
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

  const [gratitude, setGratitude] = useState(["", "", ""]);
  const [savedGratitudes, setSavedGratitudes] = useState<GratitudeEntry[]>([]);
  const [gratitudesLoading, setGratitudesLoading] = useState(true);
  const [gratitudeSaving, setGratitudeSaving] = useState(false);
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
    fetch("/api/gratitudes")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data.entries)) setSavedGratitudes(data.entries); })
      .catch(() => {})
      .finally(() => setGratitudesLoading(false));
  }, []);

  const saveGratitudeEntry = async () => {
    const filled = gratitude.filter((g) => g.trim());
    if (filled.length === 0 || gratitudeSaving) return;
    setGratitudeSaving(true);
    try {
      const res = await fetch("/api/gratitudes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: filled, date: formatDate(new Date()) }),
      });
      const data = await res.json();
      if (data.entries) {
        setSavedGratitudes(data.entries);
        setGratitude(["", "", ""]);
      }
    } catch {}
    setGratitudeSaving(false);
  };

  const removeGratitudeEntry = (id: string) => {
    setSavedGratitudes((g) => g.filter((e) => e.id !== id));
    fetch("/api/gratitudes", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    }).catch(() => {});
  };

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
                  Just For Today — Daily Reading
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
            <span className="text-sm font-medium text-[var(--text-primary)]">Sobriety Counter</span>
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
                  {sobrietyDays === 1 ? "day sober" : "days sober"}
                </div>
                {sobrietyStartDate && (() => {
                  const [y,m,d] = sobrietyStartDate.split("-").map(Number);
                  return (
                    <p className="text-xs text-[var(--text-muted)] mt-2">
                      Since {formatDate(new Date(y, m - 1, d))}
                    </p>
                  );
                })()}
              </div>
              {sobrietyDays > 0 && (
                <p className="text-center text-xs text-[var(--text-muted)] mb-4">
                  {sobrietyDays < 7 && "Every day matters. You are doing it."}
                  {sobrietyDays >= 7 && sobrietyDays < 30 && "One week or more. That is real."}
                  {sobrietyDays >= 30 && sobrietyDays < 90 && "A month or more. Keep going."}
                  {sobrietyDays >= 90 && sobrietyDays < 365 && "Three months or more. You are building a life."}
                  {sobrietyDays >= 365 && "A year or more. That is extraordinary."}
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
                {sobrietyStartDate ? "Reset / change date" : "Set my sober date"}
              </button>
            </>
          ) : (
            <div className="space-y-3 py-2">
              <p className="text-sm text-[var(--text-secondary)]">
                {sobrietyStartDate ? "Set a new sobriety start date:" : "When did you get sober?"}
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
                  {sobrietySaving ? "Saving…" : "Save"}
                </button>
                <button
                  onClick={() => { setShowDatePicker(false); setNewSobrietyDate(""); }}
                  className="flex-1 py-2.5 rounded-xl bg-[var(--bg-muted)] text-[var(--text-secondary)] text-sm hover:bg-[var(--border-soft)] transition-calm"
                >
                  Cancel
                </button>
              </div>
            </div>
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
                onKeyDown={(e) => { if (e.key === "Enter") saveGratitudeEntry(); }}
                placeholder="I am grateful for..."
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

        <button
          onClick={saveGratitudeEntry}
          disabled={gratitude.every((g) => !g.trim()) || gratitudeSaving}
          className={cn(
            "mt-4 w-full py-2.5 rounded-xl text-sm font-medium transition-calm",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-amber)]",
            "bg-[var(--accent-amber)] text-white hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
          )}
        >
          {gratitudeSaving ? "Saving…" : "Save gratitudes"}
        </button>

        {gratitudesLoading && (
          <div className="mt-6 space-y-2 animate-pulse">
            <div className="h-3 bg-[var(--border-soft)] rounded w-24" />
            <div className="h-16 bg-[var(--border-soft)] rounded-2xl" />
          </div>
        )}

        {!gratitudesLoading && savedGratitudes.length > 0 && (
          <div className="mt-6 space-y-3">
            <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide font-medium">Saved entries</p>
            {savedGratitudes.map((entry) => (
              <div
                key={entry.id}
                className="rounded-2xl border border-[var(--accent-amber)]/20 bg-[var(--bg-card)] p-3"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-[var(--text-muted)]">{entry.date}</span>
                  <button
                    onClick={() => removeGratitudeEntry(entry.id)}
                    className="p-1 rounded-lg text-[var(--text-muted)] hover:text-red-400 hover:bg-[var(--bg-muted)] transition-calm"
                    aria-label="Remove entry"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <ul className="space-y-1">
                  {entry.items.map((item, j) => (
                    <li key={j} className="text-sm text-[var(--text-secondary)] flex items-start gap-2">
                      <span className="text-[var(--accent-amber)] mt-0.5 flex-shrink-0">·</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
