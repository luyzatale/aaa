"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import TTSPlayer from "@/components/features/TTSPlayer";
import BreathingExercise from "@/components/features/BreathingExercise";
import { PRAYERS, GROUNDING_EXERCISES } from "@/lib/recovery-content";
import { cn } from "@/lib/utils";
import { Leaf, Wind, Heart, Clock, CheckCircle } from "lucide-react";

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "core", label: "Core" },
  { id: "steps", label: "Step Prayers" },
  { id: "daily", label: "Daily" },
  { id: "emotional", label: "Emotional" },
  { id: "meditation", label: "Meditation" },
];

export default function PrayersPage() {
  const [category, setCategory] = useState("all");
  const [activeGrounding, setActiveGrounding] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Record<string, Set<number>>>({});

  const filtered = PRAYERS.filter(
    (p) => category === "all" || p.category === category
  );

  const toggleStep = (exerciseId: string, idx: number) => {
    setCompletedSteps((prev) => {
      const set = new Set(prev[exerciseId] || []);
      if (set.has(idx)) set.delete(idx);
      else set.add(idx);
      return { ...prev, [exerciseId]: set };
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      <div className="mb-10">
        <Badge variant="serenity" className="mb-4">Prayers & Meditation</Badge>
        <h1 className="text-4xl font-light text-[var(--text-primary)] mb-4 leading-tight">
          A quiet place to{" "}
          <em className="not-italic text-[var(--accent-serenity)]">pray and breathe.</em>
        </h1>
        <p className="text-lg text-[var(--text-secondary)] font-light leading-relaxed max-w-2xl">
          Each prayer can be read or listened to. Take what you need. Leave what you do not.
          There is no pressure here.
        </p>
      </div>

      {/* 2-minute reset */}
      <Card variant="serenity" padding="lg" className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <Wind className="w-4 h-4 text-[var(--accent-serenity)]" aria-hidden />
          <h2 className="font-semibold text-[var(--text-primary)]">2-Minute Recovery Reset</h2>
        </div>
        <p className="text-sm text-[var(--text-secondary)] mb-4 leading-relaxed">
          If you are overwhelmed right now, start here. Follow the breathing guide.
          No thinking required.
        </p>
        <BreathingExercise />
      </Card>

      {/* Category filter */}
      <div
        className="flex flex-wrap gap-2 mb-8"
        role="group"
        aria-label="Filter prayers by category"
      >
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            aria-pressed={category === cat.id}
            className={cn(
              "px-4 py-2 rounded-2xl text-sm font-medium transition-calm",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-serenity)]",
              category === cat.id
                ? "bg-[var(--accent-serenity)] text-white"
                : "bg-[var(--bg-secondary)] border border-[var(--border-soft)] text-[var(--text-secondary)] hover:bg-[var(--bg-muted)]"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Prayers */}
      <section aria-labelledby="prayers-heading" className="mb-16">
        <h2 id="prayers-heading" className="sr-only">Prayers</h2>
        <div className="space-y-6">
          {filtered.map((prayer) => (
            <Card key={prayer.id} padding="lg" className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Badge variant="serenity" className="mb-2">{prayer.category}</Badge>
                  <h3 className="text-xl font-light text-[var(--text-primary)]">{prayer.title}</h3>
                  <p className="text-sm text-[var(--text-muted)] mt-1">{prayer.description}</p>
                </div>
                <Leaf className="w-5 h-5 text-[var(--accent-serenity)] flex-shrink-0 mt-1" aria-hidden />
              </div>

              <div
                className="rounded-2xl bg-[var(--bg-secondary)] p-5 border border-[var(--border-soft)]"
                aria-label={`${prayer.title} text`}
              >
                <p className="text-[var(--text-primary)] leading-[2] whitespace-pre-line font-light text-base">
                  {prayer.text}
                </p>
              </div>

              <TTSPlayer
                text={prayer.text}
                title={prayer.title}
              />
            </Card>
          ))}
        </div>
      </section>

      {/* Grounding exercises */}
      <section aria-labelledby="grounding-heading">
        <div className="mb-6">
          <h2
            id="grounding-heading"
            className="text-xl font-semibold text-[var(--text-primary)]"
          >
            Grounding Exercises
          </h2>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            When your nervous system needs to come back to safety
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {GROUNDING_EXERCISES.map((exercise) => {
            const isActive = activeGrounding === exercise.id;
            const completed = completedSteps[exercise.id] || new Set();
            return (
              <Card key={exercise.id} padding="md" className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-medium text-[var(--text-primary)]">{exercise.title}</h3>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Clock className="w-3 h-3 text-[var(--text-muted)]" aria-hidden />
                      <span className="text-xs text-[var(--text-muted)]">{exercise.duration}</span>
                    </div>
                  </div>
                  <Heart className="w-4 h-4 text-[var(--accent-serenity)] flex-shrink-0" aria-hidden />
                </div>

                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {exercise.description}
                </p>

                {isActive && (
                  <ol className="space-y-2" aria-label={`Steps for ${exercise.title}`}>
                    {exercise.steps.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <button
                          onClick={() => toggleStep(exercise.id, idx)}
                          className={cn(
                            "w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 transition-calm flex items-center justify-center",
                            completed.has(idx)
                              ? "bg-[var(--accent-sage)] border-[var(--accent-sage)] text-white"
                              : "border-[var(--border-muted)]"
                          )}
                          aria-label={`Step ${idx + 1}: ${completed.has(idx) ? "completed" : "not completed"}`}
                        >
                          {completed.has(idx) && <CheckCircle className="w-3 h-3" />}
                        </button>
                        <span className={cn(
                          "text-sm transition-calm",
                          completed.has(idx) ? "text-[var(--text-muted)] line-through" : "text-[var(--text-secondary)]"
                        )}>
                          {step}
                        </span>
                      </li>
                    ))}
                  </ol>
                )}

                <button
                  onClick={() => setActiveGrounding(isActive ? null : exercise.id)}
                  className={cn(
                    "w-full py-2.5 rounded-2xl text-sm font-medium transition-calm",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-serenity)]",
                    isActive
                      ? "bg-[var(--bg-muted)] text-[var(--text-secondary)] hover:bg-[var(--border-soft)]"
                      : "bg-[var(--accent-serenity-light)] text-[var(--accent-serenity)] hover:bg-[var(--accent-serenity)]/20"
                  )}
                >
                  {isActive ? "Close" : "Begin"}
                </button>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
