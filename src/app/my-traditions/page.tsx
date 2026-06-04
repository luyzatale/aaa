"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { Lock, Save, Info, Lightbulb, Users, Scale, DoorOpen, Shield, Target, Unlink, Wallet, Award, Network, VolumeX, EyeOff, Sparkles } from "lucide-react";
import { useT } from "@/lib/i18n";

const TRADITION_ICONS = [
  <Users    key="1"  className="w-5 h-5" />,
  <Scale    key="2"  className="w-5 h-5" />,
  <DoorOpen key="3"  className="w-5 h-5" />,
  <Shield   key="4"  className="w-5 h-5" />,
  <Target   key="5"  className="w-5 h-5" />,
  <Unlink   key="6"  className="w-5 h-5" />,
  <Wallet   key="7"  className="w-5 h-5" />,
  <Award    key="8"  className="w-5 h-5" />,
  <Network  key="9"  className="w-5 h-5" />,
  <VolumeX  key="10" className="w-5 h-5" />,
  <EyeOff   key="11" className="w-5 h-5" />,
  <Sparkles key="12" className="w-5 h-5" />,
];

function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const { t } = useT();
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input === "Sun*1010") {
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
            <h1 className="font-semibold text-[var(--text-primary)]">12 Traditions — Private</h1>
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

export default function MyTraditionsPage() {
  const { t } = useT();
  const [unlocked, setUnlocked] = useState(false);
  const [entries, setEntries] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!unlocked) return;
    fetch("/api/my-traditions")
      .then((r) => r.json())
      .then((d) => { if (d.entries) setEntries(d.entries); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [unlocked]);

  const saveNote = async (key: string) => {
    setSaving((prev) => ({ ...prev, [key]: true }));
    try {
      await fetch("/api/my-traditions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entries }),
      });
      setSaved((prev) => ({ ...prev, [key]: true }));
      setTimeout(() => setSaved((prev) => ({ ...prev, [key]: false })), 2000);
    } catch {}
    setSaving((prev) => ({ ...prev, [key]: false }));
  };

  if (!unlocked) return <PasswordGate onUnlock={() => setUnlocked(true)} />;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <div className="mb-10">
        <Badge variant="sage" className="mb-4">{t.traditions.badge}</Badge>
        <h1 className="text-4xl font-light text-[var(--text-primary)] mb-4 leading-tight">
          {t.traditions.titlePrefix}{" "}
          <em className="not-italic text-[var(--accent-sage)]">{t.traditions.titleEm}</em>
        </h1>
        <p className="text-lg text-[var(--text-secondary)] font-light leading-relaxed max-w-2xl">
          {t.traditions.subtitle}
        </p>
      </div>

      <Card variant="serenity" padding="lg" className="mb-10">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-[var(--accent-serenity)] flex-shrink-0 mt-0.5" aria-hidden />
          <div>
            <h2 className="font-semibold text-[var(--text-primary)] mb-2">{t.traditions.stepsVsTraditions}</h2>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{t.traditions.stepsVsTraditionsBody}</p>
          </div>
        </div>
      </Card>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 rounded-3xl bg-[var(--bg-muted)] animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {t.traditions.items.map((item, i) => {
            const key = `tradition-${item.number}`;
            return (
              <Card key={item.number} padding="lg" className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-[var(--accent-sage-light)] flex flex-col items-center justify-center gap-0.5" aria-hidden>
                    <span className="text-xs font-bold text-[var(--accent-sage)] leading-none">{item.number}</span>
                    <span className="text-[var(--accent-sage)]">{TRADITION_ICONS[i]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--text-primary)] leading-relaxed italic">
                      &ldquo;{item.short}&rdquo;
                    </p>
                  </div>
                </div>

                <div className="bg-[var(--bg-muted)] rounded-2xl p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[var(--accent-sage)] mb-2">{t.traditions.plainWords}</p>
                  <p className="text-sm text-[var(--text-primary)] leading-relaxed">{item.plain}</p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)] mb-2">{t.traditions.example}</p>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{item.example}</p>
                </div>

                <div className="flex items-start gap-2.5 bg-[var(--accent-amber-light)] rounded-2xl p-3.5">
                  <Lightbulb className="w-4 h-4 text-[var(--accent-amber)] flex-shrink-0 mt-0.5" aria-hidden />
                  <div>
                    <p className="text-xs font-semibold text-[var(--accent-amber)] mb-1">{t.traditions.autisticNote}</p>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{item.note}</p>
                  </div>
                </div>

                <div className="space-y-2 border-t border-[var(--border-soft)] pt-4">
                  <label htmlFor={key} className="block text-xs font-semibold uppercase tracking-wide text-[var(--accent-sage)]">
                    My Notes
                  </label>
                  <textarea
                    id={key}
                    value={entries[key] || ""}
                    onChange={(e) => setEntries((prev) => ({ ...prev, [key]: e.target.value }))}
                    placeholder="Write your personal reflections on this tradition…"
                    rows={4}
                    className={cn(
                      "w-full px-4 py-3 rounded-2xl text-sm resize-none",
                      "bg-[var(--bg-secondary)] border border-[var(--border-soft)]",
                      "text-[var(--text-primary)] placeholder:text-[var(--text-muted)]",
                      "focus:outline-none focus:ring-2 focus:ring-[var(--accent-sage)] transition-calm"
                    )}
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={() => saveNote(key)}
                      disabled={saving[key]}
                      className={cn(
                        "flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium transition-calm",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-sage)]",
                        saved[key]
                          ? "bg-[var(--accent-sage-light)] text-[var(--accent-sage)]"
                          : "bg-[var(--bg-muted)] text-[var(--text-secondary)] hover:bg-[var(--border-soft)]"
                      )}
                    >
                      <Save className="w-3 h-3" aria-hidden />
                      {saved[key] ? "Saved" : saving[key] ? "Saving…" : "Save note"}
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <p className="mt-10 text-center text-sm text-[var(--text-muted)]">
        Source: <a href="https://www.aa.org/the-twelve-traditions" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-[var(--accent-sage)] transition-calm">aa.org/the-twelve-traditions</a>
      </p>
    </div>
  );
}
