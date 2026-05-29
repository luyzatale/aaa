"use client";

import { useState, useEffect } from "react";
import { BookHeart, Plus, Trash2, ChevronDown, ChevronUp, Phone, Lock, X, Star } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n";

interface SponsorshipEntry {
  id: string;
  date: string;
  notes: string;
}

interface GratitudeEntry {
  id: string;
  date: string;
  items: string[];
}

function todayString() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatDate(dateStr: string) {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const NOTE_PREVIEW_LENGTH = 180;

function EntryCard({
  entry,
  onRemove,
  removing,
}: {
  entry: SponsorshipEntry;
  onRemove: (id: string) => void;
  removing: boolean;
}) {
  const { t } = useT();
  const [expanded, setExpanded] = useState(false);
  const isLong = entry.notes.length > NOTE_PREVIEW_LENGTH;
  const displayText = isLong && !expanded ? entry.notes.slice(0, NOTE_PREVIEW_LENGTH) + "…" : entry.notes;

  return (
    <Card padding="md" className="space-y-3">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-medium text-[var(--accent-sage)] uppercase tracking-wide">
          {formatDate(entry.date)}
        </p>
        <button
          onClick={() => onRemove(entry.id)}
          disabled={removing}
          className="flex-shrink-0 p-1.5 rounded-lg text-[var(--text-muted)] hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-calm focus-visible:outline-none disabled:opacity-40"
          aria-label={t.sponsorship.deleteEntry}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
      <p className="text-sm text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap">{displayText}</p>
      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-xs text-[var(--accent-sage)] hover:opacity-80 transition-calm focus-visible:outline-none"
        >
          {expanded ? (
            <><ChevronUp className="w-3 h-3" /> {t.sponsorship.showLess}</>
          ) : (
            <><ChevronDown className="w-3 h-3" /> {t.sponsorship.showMore}</>
          )}
        </button>
      )}
    </Card>
  );
}

function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const { t } = useT();
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input === "Sun*1010") {  // hardcoded password — do not translate
      onUnlock();
    } else {
      setError(t.sponsorship.incorrectPassword);
      setInput("");
    }
  };

  return (
    <main className="min-h-[60vh] flex items-center justify-center px-4">
      <div className={cn(
        "w-full max-w-sm",
        "bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-3xl shadow-calm-lg",
        "p-8 animate-fade-up"
      )}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-[var(--accent-serenity-light)] flex items-center justify-center flex-shrink-0" aria-hidden>
            <Lock className="w-5 h-5 text-[var(--accent-serenity)]" />
          </div>
          <div>
            <h1 className="font-semibold text-[var(--text-primary)]">{t.sponsorship.badge}</h1>
            <p className="text-xs text-[var(--text-muted)]">{t.sponsorship.passwordPrompt}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={input}
            onChange={(e) => { setInput(e.target.value); setError(""); }}
            placeholder={t.sponsorship.password}
            autoFocus
            className={cn(
              "w-full px-3 py-2.5 rounded-xl text-sm",
              "bg-[var(--bg-secondary)] border",
              error ? "border-red-400" : "border-[var(--border-soft)]",
              "text-[var(--text-primary)] placeholder:text-[var(--text-muted)]",
              "focus:outline-none focus:ring-2 focus:ring-[var(--accent-serenity)] transition-calm"
            )}
          />
          {error && <p className="text-xs text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={!input}
            className={cn(
              "w-full py-3 rounded-2xl text-sm font-medium transition-calm",
              "bg-[var(--accent-serenity)] text-white hover:opacity-90",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-serenity)]",
              "disabled:opacity-50"
            )}
          >
            {t.sponsorship.unlock}
          </button>
        </form>
      </div>
    </main>
  );
}

export default function SponsorshipPage() {
  const { t } = useT();
  const [unlocked, setUnlocked] = useState(false);
  const [entries, setEntries] = useState<SponsorshipEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(todayString());
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [removing, setRemoving] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [gratitude, setGratitude] = useState(["", "", ""]);
  const [savedGratitudes, setSavedGratitudes] = useState<GratitudeEntry[]>([]);
  const [gratitudesLoading, setGratitudesLoading] = useState(true);
  const [gratitudeSaving, setGratitudeSaving] = useState(false);

  useEffect(() => {
    if (!unlocked) return;
    fetch("/api/gratitudes")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data.entries)) setSavedGratitudes(data.entries); })
      .catch(() => {})
      .finally(() => setGratitudesLoading(false));
  }, [unlocked]);

  const saveGratitudeEntry = async () => {
    const filled = gratitude.filter((g) => g.trim());
    if (filled.length === 0 || gratitudeSaving) return;
    setGratitudeSaving(true);
    try {
      const res = await fetch("/api/gratitudes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: filled, date: formatDate(todayString()) }),
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

  useEffect(() => {
    if (!unlocked) return;
    fetch("/api/sponsorship")
      .then((r) => r.json())
      .then((d) => setEntries(d.entries ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [unlocked]);

  if (!unlocked) return <PasswordGate onUnlock={() => setUnlocked(true)} />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!notes.trim()) { setError(t.sponsorship.notes + " required"); return; }
    setSubmitting(true);
    try {
      const res = await fetch("/api/sponsorship", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, notes }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? t.common.somethingWentWrong); return; }
      setEntries(data.entries ?? []);
      setNotes("");
      setDate(todayString());
      setShowForm(false);
    } catch {
      setError(t.common.couldNotConnect);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemove = (id: string) => {
    setRemoving(id);
    setEntries((prev) => prev.filter((e) => e.id !== id));
    fetch("/api/sponsorship", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    }).finally(() => setRemoving(null));
  };

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Page header */}
      <div className="flex items-start gap-4">
        <div className="w-11 h-11 rounded-2xl bg-[var(--accent-sage-light)] flex items-center justify-center flex-shrink-0 mt-0.5" aria-hidden>
          <BookHeart className="w-6 h-6 text-[var(--accent-sage)]" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-[var(--text-primary)]">{t.sponsorship.title}</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            {t.sponsorship.subtitle}
          </p>
        </div>
      </div>

      {/* Sponsor contact reminder */}
      <Card padding="md" className="flex items-center gap-3 bg-[var(--accent-serenity-light)] border-[var(--accent-serenity)]/20">
        <Phone className="w-4 h-4 text-[var(--accent-serenity)] flex-shrink-0" aria-hidden />
        <p className="text-sm text-[var(--accent-serenity)]">
          {t.sponsorship.sponsorReminder}
        </p>
      </Card>

      {/* Add entry */}
      <div>
        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className={cn(
              "flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-medium transition-calm",
              "bg-[var(--accent-sage)] text-white hover:opacity-90",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-sage)]"
            )}
          >
            <Plus className="w-4 h-4" aria-hidden />
            {t.sponsorship.addNote}
          </button>
        ) : (
          <Card padding="lg" className="animate-fade-in">
            <h2 className="text-base font-semibold text-[var(--text-primary)] mb-4">{t.sponsorship.newEntry}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5" htmlFor="sp-date">
                  {t.sponsorship.date}
                </label>
                <input
                  id="sp-date"
                  type="date"
                  value={date}
                  max={todayString()}
                  onChange={(e) => setDate(e.target.value)}
                  className={cn(
                    "w-full px-3 py-2.5 rounded-xl text-sm",
                    "bg-[var(--bg-secondary)] border border-[var(--border-soft)]",
                    "text-[var(--text-primary)]",
                    "focus:outline-none focus:ring-2 focus:ring-[var(--accent-sage)] transition-calm"
                  )}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5" htmlFor="sp-notes">
                  {t.sponsorship.notes}
                </label>
                <textarea
                  id="sp-notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={t.sponsorship.notesPlaceholder}
                  rows={6}
                  className={cn(
                    "w-full px-3 py-2.5 rounded-xl text-sm resize-none",
                    "bg-[var(--bg-secondary)] border border-[var(--border-soft)]",
                    "text-[var(--text-primary)] placeholder:text-[var(--text-muted)]",
                    "focus:outline-none focus:ring-2 focus:ring-[var(--accent-sage)] transition-calm"
                  )}
                />
              </div>

              {error && <p className="text-xs text-red-500">{error}</p>}

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className={cn(
                    "flex-1 py-2.5 rounded-2xl text-sm font-medium transition-calm",
                    "bg-[var(--accent-sage)] text-white hover:opacity-90",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-sage)]",
                    "disabled:opacity-60"
                  )}
                >
                  {submitting ? t.sponsorship.saving : t.sponsorship.saveEntry}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setError(""); setNotes(""); }}
                  className={cn(
                    "px-4 py-2.5 rounded-2xl text-sm transition-calm",
                    "text-[var(--text-secondary)] hover:bg-[var(--bg-muted)]",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-sage)]"
                  )}
                >
                  {t.sponsorship.cancel}
                </button>
              </div>
            </form>
          </Card>
        )}
      </div>

      {/* Entries list */}
      <div className="space-y-3">
        {loading && (
          <>
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 rounded-2xl bg-[var(--bg-muted)] animate-pulse" />
            ))}
          </>
        )}
        {!loading && entries.length === 0 && (
          <div className="text-center py-12 text-[var(--text-muted)]">
            <BookHeart className="w-8 h-8 mx-auto mb-3 opacity-40" aria-hidden />
            <p className="text-sm">{t.sponsorship.noEntries}</p>
          </div>
        )}
        {!loading && entries.map((entry) => (
          <EntryCard
            key={entry.id}
            entry={entry}
            onRemove={handleRemove}
            removing={removing === entry.id}
          />
        ))}
      </div>

      {/* Gratitudes List */}
      <Card variant="amber" padding="lg" className="mt-8">
        <div className="flex items-center gap-2 mb-4">
          <Star className="w-4 h-4 text-[var(--accent-amber)]" aria-hidden />
          <span className="text-sm font-medium text-[var(--text-primary)]">{t.sponsorship.gratitudesList}</span>
        </div>
        <p className="text-xs text-[var(--text-muted)] mb-3">
          {t.daily.smallIsFine}
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
                placeholder={t.daily.gratitudePlaceholder}
                aria-label={t.daily.gratitudeLabel(i + 1)}
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
          {gratitudeSaving ? t.sponsorship.saving : t.daily.saveGratitudes}
        </button>

        {gratitudesLoading && (
          <div className="mt-6 space-y-2 animate-pulse">
            <div className="h-3 bg-[var(--border-soft)] rounded w-24" />
            <div className="h-16 bg-[var(--border-soft)] rounded-2xl" />
          </div>
        )}

        {!gratitudesLoading && savedGratitudes.length > 0 && (
          <div className="mt-6 space-y-3">
            <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide font-medium">{t.daily.savedEntries}</p>
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
                    aria-label={t.daily.removeEntry}
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
    </main>
  );
}
