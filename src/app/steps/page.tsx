"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { TWELVE_STEPS } from "@/lib/recovery-content";
import { cn } from "@/lib/utils";
import { BookOpen, Lock, Save, ChevronDown, ChevronUp, AlertTriangle, Mail } from "lucide-react";

const STEP_PROMPTS: Record<number, string[]> = {
  1: [
    "Describe a specific moment when alcohol made your life unmanageable.",
    "What did you try to control that you could not control?",
    "What does powerlessness mean to you, in your own words?",
  ],
  2: [
    "What would a Power greater than yourself feel like to you?",
    "What would 'restored to sanity' look like in your daily life?",
    "Have you seen recovery work in others? What does that tell you?",
  ],
  3: [
    "What does 'turning my will over' mean to you?",
    "What are you most afraid of letting go of?",
    "Write the Third Step Prayer in your own words.",
  ],
  4: [
    "List three resentments you currently carry.",
    "What fears are most present in your life?",
    "Where have you been dishonest, selfish, or self-seeking recently?",
  ],
  5: [
    "What does it feel like to have shared your inventory?",
    "What was the most difficult thing to admit?",
    "What do you feel free from after this step?",
  ],
  6: [
    "Which character defects are you most resistant to releasing?",
    "What would your life look like without these defects?",
    "Are there any you are not yet ready to give up? Why?",
  ],
  7: [
    "Write the Seventh Step Prayer in your own words.",
    "What shortcomings have you asked to be removed?",
    "What action are you willing to take differently now?",
  ],
  8: [
    "List people you have harmed. Be thorough.",
    "For each person, briefly note how you harmed them.",
    "Are you willing to make amends to all of them?",
  ],
  9: [
    "Which amends have you made?",
    "Which amends are you afraid of?",
    "Are there any amends where you need guidance on how to proceed?",
  ],
  10: [
    "Where were you wrong today?",
    "Did you promptly admit it?",
    "What did you do that was right today?",
  ],
  11: [
    "Describe your current prayer and meditation practice.",
    "What does conscious contact with your Higher Power feel like?",
    "What is your Higher Power asking of you today?",
  ],
  12: [
    "How have you tried to carry the message to others?",
    "What spiritual principles are you practising in your daily life?",
    "How has working these steps changed you?",
  ],
};

export default function StepWorkPage() {
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [entries, setEntries] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState<Record<string, boolean>>({});

  const saveEntry = (key: string) => {
    try {
      const all = JSON.parse(localStorage.getItem("aa-step-work") || "{}");
      all[key] = entries[key] || "";
      localStorage.setItem("aa-step-work", JSON.stringify(all));
      setSaved((prev) => ({ ...prev, [key]: true }));
      setTimeout(() => setSaved((prev) => ({ ...prev, [key]: false })), 2000);
    } catch {}
  };

  const loadEntry = (key: string) => {
    try {
      const all = JSON.parse(localStorage.getItem("aa-step-work") || "{}");
      return all[key] || "";
    } catch {
      return "";
    }
  };

  const emailStep = (stepNum: number) => {
    const step = TWELVE_STEPS[stepNum - 1];
    const prompts = STEP_PROMPTS[stepNum] || [];
    const subject = `Step Work — Step ${stepNum}: ${step.shortText}`;
    const body = prompts
      .map((prompt, idx) => {
        const answer = entries[`step-${stepNum}-${idx}`]?.trim() || "(no answer yet)";
        return `${prompt}\n${answer}`;
      })
      .join("\n\n");
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleOpen = (stepNum: number) => {
    if (activeStep === stepNum) {
      setActiveStep(null);
    } else {
      setActiveStep(stepNum);
      const step = TWELVE_STEPS[stepNum - 1];
      const prompts = STEP_PROMPTS[stepNum] || [];
      prompts.forEach((_, idx) => {
        const key = `step-${stepNum}-${idx}`;
        if (!entries[key]) {
          const saved = loadEntry(key);
          if (saved) {
            setEntries((prev) => ({ ...prev, [key]: saved }));
          }
        }
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      <div className="mb-10">
        <Badge variant="sage" className="mb-4">Step Work</Badge>
        <h1 className="text-4xl font-light text-[var(--text-primary)] mb-4 leading-tight">
          Private Step Work Journal
        </h1>
        <p className="text-lg text-[var(--text-secondary)] font-light leading-relaxed max-w-2xl">
          Your writing is private. It is stored only on your device and never sent anywhere.
          Work at your own pace. There is no wrong speed.
        </p>
      </div>

      {/* Privacy notice */}
      <Card variant="sage" padding="md" className="mb-8 flex items-start gap-3">
        <Lock className="w-4 h-4 text-[var(--accent-sage)] flex-shrink-0 mt-0.5" aria-hidden />
        <div className="text-sm text-[var(--text-secondary)]">
          <span className="font-medium text-[var(--text-primary)]">Privacy: </span>
          All your writing stays on your device in local storage. Nothing is sent to a server.
          For deep personal inventory work, sharing with a sponsor or therapist is encouraged.
        </div>
      </Card>

      {/* Overwhelm warning */}
      <Card variant="amber" padding="md" className="mb-8 flex items-start gap-3">
        <AlertTriangle className="w-4 h-4 text-[var(--accent-amber)] flex-shrink-0 mt-0.5" aria-hidden />
        <div className="text-sm text-[var(--text-secondary)]">
          <span className="font-medium text-[var(--text-primary)]">Pacing: </span>
          Step work can bring up difficult feelings. Take breaks. Use the breathing exercises
          in{" "}
          <a href="/prayers" className="text-[var(--accent-sage)] underline">Prayers &amp; Meditation</a>.
          This is not a test. Go slowly.
        </div>
      </Card>

      {/* Steps */}
      <section aria-labelledby="steps-heading">
        <h2 id="steps-heading" className="sr-only">The Twelve Steps</h2>
        <div className="space-y-3">
          {TWELVE_STEPS.map((step) => {
            const isOpen = activeStep === step.number;
            const prompts = STEP_PROMPTS[step.number] || [];

            return (
              <div
                key={step.number}
                className="border border-[var(--border-soft)] rounded-3xl overflow-hidden bg-[var(--bg-card)] transition-calm"
              >
                <button
                  onClick={() => handleOpen(step.number)}
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
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[var(--text-muted)] flex-shrink-0" aria-hidden />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[var(--text-muted)] flex-shrink-0" aria-hidden />
                  )}
                </button>

                {isOpen && (
                  <div
                    id={`step-content-${step.number}`}
                    className="px-5 pb-5 space-y-5 border-t border-[var(--border-soft)] pt-4"
                  >
                    {/* Step text */}
                    <div className="bg-[var(--bg-secondary)] rounded-2xl p-4">
                      <p className="text-sm text-[var(--text-secondary)] italic leading-relaxed">
                        &ldquo;{step.text}&rdquo;
                      </p>
                    </div>

                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                      {step.reflection}
                    </p>

                    {/* Prompts with text areas */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-[var(--accent-sage)]" aria-hidden />
                        <span className="text-sm font-medium text-[var(--text-primary)]">Reflection Prompts</span>
                      </div>
                      {prompts.map((prompt, idx) => {
                        const key = `step-${step.number}-${idx}`;
                        return (
                          <div key={idx} className="space-y-2">
                            <label
                              htmlFor={key}
                              className="block text-sm text-[var(--text-secondary)]"
                            >
                              {prompt}
                            </label>
                            <textarea
                              id={key}
                              value={entries[key] || ""}
                              onChange={(e) => setEntries((prev) => ({ ...prev, [key]: e.target.value }))}
                              placeholder="Write freely here..."
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
                                className={cn(
                                  "flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium transition-calm",
                                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-sage)]",
                                  saved[key]
                                    ? "bg-[var(--accent-sage-light)] text-[var(--accent-sage)]"
                                    : "bg-[var(--bg-muted)] text-[var(--text-secondary)] hover:bg-[var(--border-soft)]"
                                )}
                              >
                                <Save className="w-3 h-3" aria-hidden />
                                {saved[key] ? "Saved" : "Save"}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Email step */}
                    <div className="pt-2 border-t border-[var(--border-soft)] flex justify-end">
                      <button
                        onClick={() => emailStep(step.number)}
                        className={cn(
                          "flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium transition-calm",
                          "bg-[var(--accent-serenity-light)] text-[var(--accent-serenity)] hover:opacity-80",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-serenity)]"
                        )}
                      >
                        <Mail className="w-3 h-3" aria-hidden />
                        Email this step
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
