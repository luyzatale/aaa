"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { BookOpen, Lock, Save, ChevronDown, ChevronUp, AlertTriangle, Mail, Send, X, Lightbulb } from "lucide-react";
import { useT } from "@/lib/i18n";

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
            <h1 className="font-semibold text-[var(--text-primary)]">12 Steps — Private</h1>
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

export default function MyStepsPage() {
  const { t } = useT();
  const [unlocked, setUnlocked] = useState(false);
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [entries, setEntries] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [emailPrompt, setEmailPrompt] = useState<number | null>(null);
  const [emailTo, setEmailTo] = useState("");
  const [emailStatus, setEmailStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [emailError, setEmailError] = useState("");

  useEffect(() => {
    if (!unlocked) return;
    fetch("/api/my-steps")
      .then((r) => r.json())
      .then((d) => { if (d.entries) setEntries(d.entries); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [unlocked]);

  const saveEntry = async (key: string) => {
    setSaving((prev) => ({ ...prev, [key]: true }));
    try {
      await fetch("/api/my-steps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entries }),
      });
      setSaved((prev) => ({ ...prev, [key]: true }));
      setTimeout(() => setSaved((prev) => ({ ...prev, [key]: false })), 2000);
    } catch {}
    setSaving((prev) => ({ ...prev, [key]: false }));
  };

  const sendStepEmail = async (stepNum: number) => {
    setEmailStatus("sending");
    setEmailError("");
    try {
      const res = await fetch("/api/send-step-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: emailTo, stepNumber: stepNum, entries }),
      });
      const data = await res.json();
      if (!res.ok) { setEmailStatus("error"); setEmailError(data.error ?? t.common.somethingWentWrong); return; }
      setEmailStatus("sent");
      setTimeout(() => { setEmailPrompt(null); setEmailStatus("idle"); setEmailTo(""); }, 3000);
    } catch {
      setEmailStatus("error");
      setEmailError(t.common.couldNotConnect);
    }
  };

  if (!unlocked) return <PasswordGate onUnlock={() => setUnlocked(true)} />;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      <div className="mb-10">
        <Badge variant="sage" className="mb-4">{t.steps.badge}</Badge>
        <h1 className="text-4xl font-light text-[var(--text-primary)] mb-4 leading-tight">
          {t.steps.title}
        </h1>
        <p className="text-lg text-[var(--text-secondary)] font-light leading-relaxed max-w-2xl">
          {t.steps.subtitle}
        </p>
      </div>

      <Card variant="sage" padding="md" className="mb-8 flex items-start gap-3">
        <Lock className="w-4 h-4 text-[var(--accent-sage)] flex-shrink-0 mt-0.5" aria-hidden />
        <div className="text-sm text-[var(--text-secondary)]">
          <span className="font-medium text-[var(--text-primary)]">{t.steps.privacyLabel} </span>
          Your notes are saved privately to secure cloud storage.
        </div>
      </Card>

      <Card variant="amber" padding="md" className="mb-8 flex items-start gap-3">
        <AlertTriangle className="w-4 h-4 text-[var(--accent-amber)] flex-shrink-0 mt-0.5" aria-hidden />
        <div className="text-sm text-[var(--text-secondary)]">
          <span className="font-medium text-[var(--text-primary)]">{t.steps.pacing} </span>
          {t.steps.pacingText.split(t.steps.prayersMedLink)[0]}
          <a href="/prayers" className="text-[var(--accent-sage)] underline">{t.steps.prayersMedLink}</a>
          {t.steps.pacingText.split(t.steps.prayersMedLink)[1]}
        </div>
      </Card>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 rounded-3xl bg-[var(--bg-muted)] animate-pulse" />
          ))}
        </div>
      ) : (
        <section aria-labelledby="steps-heading">
          <h2 id="steps-heading" className="sr-only">The Twelve Steps</h2>
          <div className="space-y-3">
            {t.steps.stepData.map((step) => {
              const isOpen = activeStep === step.number;
              const prompts = t.steps.prompts[step.number] || [];

              return (
                <div
                  key={step.number}
                  className="border border-[var(--border-soft)] rounded-3xl overflow-hidden bg-[var(--bg-card)] transition-calm"
                >
                  <button
                    onClick={() => setActiveStep(isOpen ? null : step.number)}
                    className="w-full flex items-center gap-4 p-5 text-left hover:bg-[var(--bg-muted)] transition-calm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-sage)] focus-visible:ring-inset"
                    aria-expanded={isOpen}
                    aria-controls={`step-content-${step.number}`}
                  >
                    <span className="w-8 h-8 rounded-xl bg-[var(--accent-sage-light)] text-[var(--accent-sage)] text-sm font-semibold flex items-center justify-center flex-shrink-0" aria-hidden>
                      {step.number}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[var(--text-primary)] text-sm">{step.shortText}</p>
                      <p className="text-xs text-[var(--text-muted)] mt-0.5 line-clamp-1">{step.text}</p>
                    </div>
                    {isOpen
                      ? <ChevronUp className="w-4 h-4 text-[var(--text-muted)] flex-shrink-0" aria-hidden />
                      : <ChevronDown className="w-4 h-4 text-[var(--text-muted)] flex-shrink-0" aria-hidden />
                    }
                  </button>

                  {isOpen && (
                    <div id={`step-content-${step.number}`} className="px-5 pb-5 space-y-5 border-t border-[var(--border-soft)] pt-4">
                      <div className="bg-[var(--bg-secondary)] rounded-2xl p-4">
                        <p className="text-sm text-[var(--text-secondary)] italic leading-relaxed">&ldquo;{step.text}&rdquo;</p>
                      </div>

                      <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{step.reflection}</p>

                      <div className="bg-[var(--bg-muted)] rounded-2xl p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--accent-sage)] mb-2">{t.steps.plainWords}</p>
                        <p className="text-sm text-[var(--text-primary)] leading-relaxed">{step.plain}</p>
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)] mb-2">{t.steps.example}</p>
                        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{step.example}</p>
                      </div>

                      <div className="flex items-start gap-2.5 bg-[var(--accent-amber-light)] rounded-2xl p-3.5">
                        <Lightbulb className="w-4 h-4 text-[var(--accent-amber)] flex-shrink-0 mt-0.5" aria-hidden />
                        <div>
                          <p className="text-xs font-semibold text-[var(--accent-amber)] mb-1">{t.steps.autisticNote}</p>
                          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{step.note}</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-[var(--accent-sage)]" aria-hidden />
                          <span className="text-sm font-medium text-[var(--text-primary)]">{t.steps.reflectionPrompts}</span>
                        </div>
                        {prompts.map((prompt, idx) => {
                          const key = `step-${step.number}-${idx}`;
                          return (
                            <div key={idx} className="space-y-2">
                              <label htmlFor={key} className="block text-sm text-[var(--text-secondary)]">{prompt}</label>
                              <textarea
                                id={key}
                                value={entries[key] || ""}
                                onChange={(e) => setEntries((prev) => ({ ...prev, [key]: e.target.value }))}
                                placeholder={t.steps.writeFreelyPlaceholder}
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
                                  onClick={() => saveEntry(key)}
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
                                  {saved[key] ? t.steps.saved : saving[key] ? "Saving…" : t.steps.save}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="pt-2 border-t border-[var(--border-soft)]">
                        {emailPrompt !== step.number ? (
                          <div className="flex justify-end">
                            <button
                              onClick={() => { setEmailPrompt(step.number); setEmailStatus("idle"); setEmailError(""); }}
                              className={cn(
                                "flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium transition-calm",
                                "bg-[var(--accent-serenity-light)] text-[var(--accent-serenity)] hover:opacity-80",
                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-serenity)]"
                              )}
                            >
                              <Mail className="w-3 h-3" aria-hidden />
                              {t.steps.emailThisStep}
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <p className="text-xs text-[var(--text-muted)]">{t.steps.sendStep(step.number)}</p>
                              <button onClick={() => setEmailPrompt(null)} className="text-[var(--text-muted)] hover:text-[var(--text-secondary)]" aria-label={t.common.cancel}>
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <div className="flex gap-2">
                              <input
                                type="email"
                                value={emailTo}
                                onChange={(e) => setEmailTo(e.target.value)}
                                placeholder={t.common.email}
                                autoFocus
                                className={cn(
                                  "flex-1 px-3 py-2 rounded-xl text-sm",
                                  "bg-[var(--bg-secondary)] border border-[var(--border-soft)]",
                                  "text-[var(--text-primary)] placeholder:text-[var(--text-muted)]",
                                  "focus:outline-none focus:ring-2 focus:ring-[var(--accent-serenity)] transition-calm"
                                )}
                                onKeyDown={(e) => e.key === "Enter" && sendStepEmail(step.number)}
                              />
                              <button
                                onClick={() => sendStepEmail(step.number)}
                                disabled={emailStatus === "sending" || !emailTo.trim()}
                                className={cn(
                                  "flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium transition-calm",
                                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-serenity)]",
                                  emailStatus === "sent"
                                    ? "bg-[var(--accent-sage-light)] text-[var(--accent-sage)]"
                                    : "bg-[var(--accent-serenity)] text-white hover:opacity-90 disabled:opacity-50"
                                )}
                              >
                                <Send className="w-3 h-3" aria-hidden />
                                {emailStatus === "sending" ? t.steps.sending : emailStatus === "sent" ? t.steps.sent : t.steps.send}
                              </button>
                            </div>
                            {emailStatus === "error" && <p className="text-xs text-red-500">{emailError}</p>}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
