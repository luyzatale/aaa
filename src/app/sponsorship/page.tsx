"use client";

import { useState, useEffect } from "react";
import { BookHeart, Plus, Trash2, ChevronDown, ChevronUp, Phone, Lock, X, Star, PlusCircle, Heart, RefreshCw, Sparkles, Pencil, Check } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { RichTextEditor, RichTextRenderer } from "@/components/ui/RichTextEditor";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n";

interface ChecklistItem {
  text: string;
  checked: boolean;
}

interface SponsorshipEntry {
  id: string;
  date: string;
  type?: "note" | "checklist";
  notes?: string;
  title?: string;
  items?: ChecklistItem[];
}

interface GratitudeEntry {
  id: string;
  date: string;
  items: string[];
}

interface ReflectionEntry {
  id: string;
  date: string;
  text: string;
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
  onEdit,
  removing,
}: {
  entry: SponsorshipEntry;
  onRemove: (id: string) => void;
  onEdit: (id: string, newNotes: string) => void;
  removing: boolean;
}) {
  const { t } = useT();
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const notes = entry.notes ?? "";
  const [editNotes, setEditNotes] = useState(notes);
  const isLong = notes.length > NOTE_PREVIEW_LENGTH;
  const displayText = isLong && !expanded ? notes.slice(0, NOTE_PREVIEW_LENGTH) + "…" : notes;

  const handleSaveEdit = () => {
    if (!editNotes.trim()) return;
    onEdit(entry.id, editNotes);
    setEditing(false);
  };

  return (
    <Card padding="md" className="space-y-3">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-medium text-[var(--accent-sage)] uppercase tracking-wide">
          {formatDate(entry.date)}
        </p>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={() => { setEditNotes(entry.notes ?? ""); setEditing(true); }}
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--accent-sage)] hover:bg-[var(--accent-sage-light)] transition-calm focus-visible:outline-none"
            aria-label={t.sponsorship.editReflection}
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onRemove(entry.id)}
            disabled={removing}
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-calm focus-visible:outline-none disabled:opacity-40"
            aria-label={t.sponsorship.deleteEntry}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {editing ? (
        <div className="space-y-2">
          <RichTextEditor
            value={editNotes}
            onChange={setEditNotes}
            rows={5}
            autoFocus
            textareaClassName={cn(
              "w-full px-3 py-2.5 rounded-xl text-sm resize-none",
              "bg-[var(--bg-secondary)] border border-[var(--accent-sage)]/30",
              "text-[var(--text-primary)] placeholder:text-[var(--text-muted)]",
              "focus:outline-none focus:ring-2 focus:ring-[var(--accent-sage)] transition-calm"
            )}
          />
          <div className="flex gap-2">
            <button
              onClick={handleSaveEdit}
              disabled={!editNotes.trim()}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-calm",
                "bg-[var(--accent-sage)] text-white hover:opacity-90 disabled:opacity-40",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-sage)]"
              )}
            >
              <Check className="w-3 h-3" aria-hidden />
              {t.sponsorship.saveEdit}
            </button>
            <button
              onClick={() => { setEditing(false); setEditNotes(entry.notes ?? ""); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-[var(--text-secondary)] hover:bg-[var(--bg-muted)] transition-calm focus-visible:outline-none"
            >
              <X className="w-3 h-3" aria-hidden />
              {t.sponsorship.cancelEdit}
            </button>
          </div>
        </div>
      ) : (
        <>
          <RichTextRenderer text={displayText} />
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
        </>
      )}
    </Card>
  );
}

function ChecklistEntryCard({
  entry,
  onRemove,
  onEdit,
  onUpdateItems,
  removing,
}: {
  entry: SponsorshipEntry;
  onRemove: (id: string) => void;
  onEdit: (id: string, title: string | undefined, items: ChecklistItem[]) => void;
  onUpdateItems: (id: string, items: ChecklistItem[]) => void;
  removing: boolean;
}) {
  const { t } = useT();
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(entry.title ?? "");
  const [editItems, setEditItems] = useState<string[]>(entry.items?.map((i) => i.text) ?? [""]);

  const handleSave = () => {
    const filled = editItems.filter((i) => i.trim());
    if (!filled.length) return;
    onEdit(
      entry.id,
      editTitle.trim() || undefined,
      filled.map((text) => {
        const existing = entry.items?.find((i) => i.text === text);
        return { text: text.trim(), checked: existing?.checked ?? false };
      })
    );
    setEditing(false);
  };

  const toggleItem = (idx: number) => {
    const newItems = (entry.items ?? []).map((item, i) =>
      i === idx ? { ...item, checked: !item.checked } : item
    );
    onUpdateItems(entry.id, newItems);
  };

  return (
    <Card padding="md" className="space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-[var(--accent-sage)] uppercase tracking-wide">
            {formatDate(entry.date)}
          </p>
          {entry.title && (
            <p className="text-sm font-semibold text-[var(--text-primary)] mt-1">{entry.title}</p>
          )}
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={() => { setEditTitle(entry.title ?? ""); setEditItems(entry.items?.map((i) => i.text) ?? [""]); setEditing(true); }}
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--accent-sage)] hover:bg-[var(--accent-sage-light)] transition-calm focus-visible:outline-none"
            aria-label={t.sponsorship.editReflection}
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onRemove(entry.id)}
            disabled={removing}
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-calm focus-visible:outline-none disabled:opacity-40"
            aria-label={t.sponsorship.deleteEntry}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {editing ? (
        <div className="space-y-3">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Checklist title (optional)"
            autoFocus
            className={cn(
              "w-full px-3 py-2 rounded-xl text-sm",
              "bg-[var(--bg-secondary)] border border-[var(--accent-sage)]/30",
              "text-[var(--text-primary)] placeholder:text-[var(--text-muted)]",
              "focus:outline-none focus:ring-2 focus:ring-[var(--accent-sage)] transition-calm"
            )}
          />
          <div className="space-y-2">
            {editItems.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => { const next = [...editItems]; next[i] = e.target.value; setEditItems(next); }}
                  placeholder={`Item ${i + 1}`}
                  className={cn(
                    "flex-1 px-3 py-2 rounded-xl text-sm",
                    "bg-[var(--bg-secondary)] border border-[var(--accent-sage)]/30",
                    "text-[var(--text-primary)] placeholder:text-[var(--text-muted)]",
                    "focus:outline-none focus:ring-2 focus:ring-[var(--accent-sage)] transition-calm"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setEditItems((prev) => prev.filter((_, j) => j !== i))}
                  className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-calm"
                  aria-label="Remove item"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setEditItems((prev) => [...prev, ""])}
            className="flex items-center gap-1.5 text-xs text-[var(--accent-sage)] hover:opacity-80 transition-calm"
          >
            <PlusCircle className="w-3.5 h-3.5" aria-hidden />
            Add item
          </button>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={!editItems.some((i) => i.trim())}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-calm",
                "bg-[var(--accent-sage)] text-white hover:opacity-90 disabled:opacity-40",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-sage)]"
              )}
            >
              <Check className="w-3 h-3" aria-hidden />
              {t.sponsorship.saveEdit}
            </button>
            <button
              onClick={() => setEditing(false)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-[var(--text-secondary)] hover:bg-[var(--bg-muted)] transition-calm focus-visible:outline-none"
            >
              <X className="w-3 h-3" aria-hidden />
              {t.sponsorship.cancelEdit}
            </button>
          </div>
        </div>
      ) : (
        <ul className="space-y-2">
          {(entry.items ?? []).map((item, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <button
                type="button"
                onClick={() => toggleItem(i)}
                className={cn(
                  "w-4 h-4 rounded border-2 flex-shrink-0 mt-0.5 transition-calm flex items-center justify-center",
                  item.checked
                    ? "bg-[var(--accent-sage)] border-[var(--accent-sage)]"
                    : "border-[var(--border-muted)] hover:border-[var(--accent-sage)]"
                )}
                aria-label={`${item.checked ? "Uncheck" : "Check"}: ${item.text}`}
              >
                {item.checked && <Check className="w-2.5 h-2.5 text-white" />}
              </button>
              <span className={cn(
                "text-sm leading-relaxed transition-calm",
                item.checked ? "text-[var(--text-muted)] line-through" : "text-[var(--text-secondary)]"
              )}>
                {item.text}
              </span>
            </li>
          ))}
        </ul>
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
  const [entryType, setEntryType] = useState<"note" | "checklist">("note");
  const [checklistTitle, setChecklistTitle] = useState("");
  const [checklistItems, setChecklistItems] = useState<string[]>([""]);

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

  const getMilestone = (days: number) => {
    if (days < 7) return t.daily.milestone0;
    if (days < 30) return t.daily.milestone7;
    if (days < 90) return t.daily.milestone30;
    if (days < 365) return t.daily.milestone90;
    return t.daily.milestone365;
  };

  const [gratitude, setGratitude] = useState(["", "", ""]);
  const [savedGratitudes, setSavedGratitudes] = useState<GratitudeEntry[]>([]);
  const [gratitudesLoading, setGratitudesLoading] = useState(true);
  const [gratitudeSaving, setGratitudeSaving] = useState(false);

  const [reflections, setReflections] = useState<ReflectionEntry[]>([]);
  const [reflectionsLoading, setReflectionsLoading] = useState(true);
  const [reflectionText, setReflectionText] = useState("");
  const [reflectionSaving, setReflectionSaving] = useState(false);
  const [editingReflectionId, setEditingReflectionId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");

  useEffect(() => {
    if (!unlocked) return;
    fetch("/api/sobriety")
      .then((r) => r.json())
      .then((data) => { if (data.startDate) setSobrietyStartDate(data.startDate); })
      .catch(() => {})
      .finally(() => setSobrietyLoading(false));
  }, [unlocked]);

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

  useEffect(() => {
    if (!unlocked) return;
    fetch("/api/gratitudes")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data.entries)) setSavedGratitudes(data.entries); })
      .catch(() => {})
      .finally(() => setGratitudesLoading(false));
  }, [unlocked]);

  useEffect(() => {
    if (!unlocked) return;
    fetch("/api/inspirational-reflections")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data.entries)) setReflections(data.entries); })
      .catch(() => {})
      .finally(() => setReflectionsLoading(false));
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

  const saveReflection = async () => {
    if (!reflectionText.trim() || reflectionSaving) return;
    setReflectionSaving(true);
    try {
      const res = await fetch("/api/inspirational-reflections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: reflectionText }),
      });
      const data = await res.json();
      if (data.entries) { setReflections(data.entries); setReflectionText(""); }
    } catch {}
    setReflectionSaving(false);
  };

  const removeReflection = (id: string) => {
    setReflections((r) => r.filter((e) => e.id !== id));
    fetch("/api/inspirational-reflections", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    }).catch(() => {});
  };

  const saveEditReflection = async (id: string) => {
    if (!editingText.trim()) return;
    const prev = reflections;
    setReflections((r) => r.map((e) => e.id === id ? { ...e, text: editingText.trim() } : e));
    setEditingReflectionId(null);
    try {
      const res = await fetch("/api/inspirational-reflections", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, text: editingText }),
      });
      const data = await res.json();
      if (data.entries) setReflections(data.entries);
    } catch {
      setReflections(prev);
    }
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

  const handleEdit = (id: string, newNotes: string) => {
    const prev = entries;
    setEntries((e) => e.map((entry) => entry.id === id ? { ...entry, notes: newNotes } : entry));
    fetch("/api/sponsorship", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, notes: newNotes }),
    }).then(async (res) => {
      const data = await res.json();
      if (data.entries) setEntries(data.entries);
    }).catch(() => setEntries(prev));
  };

  const handleSubmitChecklist = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const filled = checklistItems.filter((i) => i.trim());
    if (!filled.length) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/sponsorship", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date,
          type: "checklist",
          title: checklistTitle.trim() || undefined,
          items: filled.map((text) => ({ text: text.trim(), checked: false })),
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? t.common.somethingWentWrong); return; }
      setEntries(data.entries ?? []);
      setChecklistTitle("");
      setChecklistItems([""]);
      setDate(todayString());
    } catch {
      setError(t.common.couldNotConnect);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditChecklist = (id: string, title: string | undefined, items: ChecklistItem[]) => {
    const prev = entries;
    setEntries((e) => e.map((entry) => entry.id === id ? { ...entry, title, items } : entry));
    fetch("/api/sponsorship", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, title, items }),
    }).then(async (res) => {
      const data = await res.json();
      if (data.entries) setEntries(data.entries);
    }).catch(() => setEntries(prev));
  };

  const handleUpdateItems = (id: string, items: ChecklistItem[]) => {
    setEntries((e) => e.map((entry) => entry.id === id ? { ...entry, items } : entry));
    const entry = entries.find((e) => e.id === id);
    fetch("/api/sponsorship", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, title: entry?.title, items }),
    }).catch(() => {});
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
              {sobrietyStartDate && (
                <p className="text-xs text-[var(--text-muted)] mt-2">
                  {t.daily.sinceDate(formatDate(sobrietyStartDate))}
                </p>
              )}
            </div>
            {sobrietyDays > 0 && (
              <p className="text-center text-xs text-[var(--text-muted)] mb-4">
                {getMilestone(sobrietyDays)}
              </p>
            )}
            <button
              onClick={() => { setNewSobrietyDate(sobrietyStartDate ?? ""); setShowDatePicker(true); }}
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

      {/* Sponsor contact reminder */}
      <Card padding="md" className="flex items-center gap-3 bg-[var(--accent-serenity-light)] border-[var(--accent-serenity)]/20">
        <Phone className="w-4 h-4 text-[var(--accent-serenity)] flex-shrink-0" aria-hidden />
        <p className="text-sm text-[var(--accent-serenity)]">
          {t.sponsorship.sponsorReminder}
        </p>
      </Card>

      {/* Sponsor's Learnt Lesson — always-visible entry card */}
      <Card padding="lg">
        <div className="flex items-center gap-2 mb-4">
          <BookHeart className="w-4 h-4 text-[var(--accent-sage)]" aria-hidden />
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">{t.sponsorship.newEntry}</h2>
        </div>
        <form onSubmit={entryType === "note" ? handleSubmit : handleSubmitChecklist} className="space-y-4">
          {/* Type toggle */}
          <div className="flex gap-1.5">
            {(["note", "checklist"] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setEntryType(type)}
                className={cn(
                  "px-3 py-1.5 rounded-xl text-xs font-medium transition-calm",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-sage)]",
                  entryType === type
                    ? "bg-[var(--accent-sage)] text-white"
                    : "bg-[var(--bg-muted)] text-[var(--text-secondary)] hover:bg-[var(--border-soft)]"
                )}
              >
                {type === "note" ? "Note" : "Checklist"}
              </button>
            ))}
          </div>

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

          {entryType === "note" ? (
            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5" htmlFor="sp-notes">
                {t.sponsorship.notes}
              </label>
              <RichTextEditor
                id="sp-notes"
                value={notes}
                onChange={setNotes}
                placeholder={t.sponsorship.notesPlaceholder}
                rows={6}
                textareaClassName={cn(
                  "w-full px-3 py-2.5 rounded-xl text-sm resize-none",
                  "bg-[var(--bg-secondary)] border border-[var(--border-soft)]",
                  "text-[var(--text-primary)] placeholder:text-[var(--text-muted)]",
                  "focus:outline-none focus:ring-2 focus:ring-[var(--accent-sage)] transition-calm"
                )}
              />
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
                  Title <span className="font-normal text-[var(--text-muted)]">(optional)</span>
                </label>
                <input
                  type="text"
                  value={checklistTitle}
                  onChange={(e) => setChecklistTitle(e.target.value)}
                  placeholder="e.g. Things to work on this week"
                  className={cn(
                    "w-full px-3 py-2.5 rounded-xl text-sm",
                    "bg-[var(--bg-secondary)] border border-[var(--border-soft)]",
                    "text-[var(--text-primary)] placeholder:text-[var(--text-muted)]",
                    "focus:outline-none focus:ring-2 focus:ring-[var(--accent-sage)] transition-calm"
                  )}
                />
              </div>
              <div className="space-y-2">
                {checklistItems.map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => { const next = [...checklistItems]; next[i] = e.target.value; setChecklistItems(next); }}
                      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); setChecklistItems((prev) => [...prev, ""]); } }}
                      placeholder={`Item ${i + 1}`}
                      className={cn(
                        "flex-1 px-3 py-2 rounded-xl text-sm",
                        "bg-[var(--bg-secondary)] border border-[var(--border-soft)]",
                        "text-[var(--text-primary)] placeholder:text-[var(--text-muted)]",
                        "focus:outline-none focus:ring-2 focus:ring-[var(--accent-sage)] transition-calm"
                      )}
                    />
                    {checklistItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setChecklistItems((prev) => prev.filter((_, j) => j !== i))}
                        className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-calm"
                        aria-label="Remove item"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setChecklistItems((prev) => [...prev, ""])}
                className="flex items-center gap-1.5 text-xs text-[var(--accent-sage)] hover:opacity-80 transition-calm"
              >
                <PlusCircle className="w-3.5 h-3.5" aria-hidden />
                Add item
              </button>
            </div>
          )}

          {error && <p className="text-xs text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={submitting || (entryType === "checklist" && !checklistItems.some((i) => i.trim()))}
            className={cn(
              "w-full py-2.5 rounded-2xl text-sm font-medium transition-calm",
              "bg-[var(--accent-sage)] text-white hover:opacity-90",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-sage)]",
              "disabled:opacity-60"
            )}
          >
            {submitting ? t.sponsorship.saving : t.sponsorship.saveEntry}
          </button>
        </form>
      </Card>

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
        {!loading && entries.map((entry) =>
          entry.type === "checklist" ? (
            <ChecklistEntryCard
              key={entry.id}
              entry={entry}
              onRemove={handleRemove}
              onEdit={handleEditChecklist}
              onUpdateItems={handleUpdateItems}
              removing={removing === entry.id}
            />
          ) : (
            <EntryCard
              key={entry.id}
              entry={entry}
              onRemove={handleRemove}
              onEdit={handleEdit}
              removing={removing === entry.id}
            />
          )
        )}
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
          onClick={() => setGratitude((prev) => [...prev, ""])}
          className="mt-2 flex items-center gap-1.5 text-xs text-[var(--accent-amber)] hover:opacity-80 transition-calm focus-visible:outline-none"
        >
          <PlusCircle className="w-3.5 h-3.5" aria-hidden />
          {t.sponsorship.addGratitude}
        </button>

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

      {/* Inspirational Reflections */}
      <Card variant="serenity" padding="lg" className="mt-8">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-4 h-4 text-[var(--accent-serenity)]" aria-hidden />
          <span className="text-sm font-medium text-[var(--text-primary)]">{t.sponsorship.reflectionsTitle}</span>
        </div>

        {/* Add form */}
        <div className="space-y-2 mb-5">
          <RichTextEditor
            value={reflectionText}
            onChange={setReflectionText}
            onKeyDown={(e) => { if (e.key === "Enter" && e.metaKey) saveReflection(); }}
            placeholder={t.sponsorship.reflectionPlaceholder}
            rows={3}
            textareaClassName={cn(
              "w-full px-3 py-2.5 rounded-xl text-sm resize-none",
              "bg-[var(--bg-card)] border border-[var(--border-soft)]",
              "text-[var(--text-primary)] placeholder:text-[var(--text-muted)]",
              "focus:outline-none focus:ring-2 focus:ring-[var(--accent-serenity)] transition-calm"
            )}
          />
          <button
            onClick={saveReflection}
            disabled={!reflectionText.trim() || reflectionSaving}
            className={cn(
              "flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium transition-calm",
              "bg-[var(--accent-serenity)] text-white hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-serenity)]"
            )}
          >
            <Plus className="w-3.5 h-3.5" aria-hidden />
            {reflectionSaving ? t.sponsorship.saving : t.sponsorship.addReflection}
          </button>
        </div>

        {/* List */}
        {reflectionsLoading && (
          <div className="space-y-2 animate-pulse">
            {[1, 2].map((i) => (
              <div key={i} className="h-14 rounded-2xl bg-[var(--border-soft)]" />
            ))}
          </div>
        )}

        {!reflectionsLoading && reflections.length === 0 && (
          <p className="text-sm text-[var(--text-muted)] text-center py-4">{t.sponsorship.noReflections}</p>
        )}

        {!reflectionsLoading && reflections.length > 0 && (
          <div className="space-y-3">
            {reflections.map((entry) => (
              <div
                key={entry.id}
                className="rounded-2xl border border-[var(--accent-serenity)]/20 bg-[var(--bg-card)] p-3 space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-[var(--text-muted)]">{entry.date}</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => { setEditingReflectionId(entry.id); setEditingText(entry.text); }}
                      className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--accent-serenity)] hover:bg-[var(--accent-serenity-light)] transition-calm focus-visible:outline-none"
                      aria-label={t.sponsorship.editReflection}
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => removeReflection(entry.id)}
                      className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-calm focus-visible:outline-none"
                      aria-label={t.sponsorship.deleteReflection}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {editingReflectionId === entry.id ? (
                  <div className="space-y-2">
                    <RichTextEditor
                      value={editingText}
                      onChange={setEditingText}
                      rows={3}
                      autoFocus
                      textareaClassName={cn(
                        "w-full px-3 py-2 rounded-xl text-sm resize-none",
                        "bg-[var(--bg-secondary)] border border-[var(--accent-serenity)]/30",
                        "text-[var(--text-primary)] placeholder:text-[var(--text-muted)]",
                        "focus:outline-none focus:ring-2 focus:ring-[var(--accent-serenity)] transition-calm"
                      )}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => saveEditReflection(entry.id)}
                        disabled={!editingText.trim()}
                        className={cn(
                          "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-calm",
                          "bg-[var(--accent-serenity)] text-white hover:opacity-90 disabled:opacity-40",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-serenity)]"
                        )}
                      >
                        <Check className="w-3 h-3" aria-hidden />
                        {t.sponsorship.saveEdit}
                      </button>
                      <button
                        onClick={() => { setEditingReflectionId(null); setEditingText(""); }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-[var(--text-secondary)] hover:bg-[var(--bg-muted)] transition-calm focus-visible:outline-none"
                      >
                        <X className="w-3 h-3" aria-hidden />
                        {t.sponsorship.cancelEdit}
                      </button>
                    </div>
                  </div>
                ) : (
                  <RichTextRenderer text={entry.text} />
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </main>
  );
}
