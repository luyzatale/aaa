"use client";

import Link from "next/link";
import { useState } from "react";
import BreathingExercise from "@/components/features/BreathingExercise";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import {
  Phone, Video, Heart, Shield, Droplets, Utensils, Moon, Wind, Users,
  Clock, CheckCircle,
} from "lucide-react";
import { useT } from "@/lib/i18n";

const helplines = [
  {
    name: "113 Zelfmoordpreventie",
    number: "0800 0113",
    tel: "08000113",
    desc: "Nederland. Gratis. 24/7. Suïcidepreventie — bel of chat op 113.nl.",
    region: "NL",
  },
  {
    name: "Sensoor",
    number: "0900 0767",
    tel: "09000767",
    desc: "Nederland. 24/7. Luisterlijn voor emotionele steun en verdriet.",
    region: "NL",
  },
  {
    name: "AA Nederland",
    number: "0900 2020 (AA-lijn)",
    tel: "09002020",
    desc: "Nederland. Hulplijn voor mensen met een drankprobleem. Zie ook aa-nederland.nl.",
    region: "NL",
  },
  {
    name: "Jellinek Alcohol & Drugs",
    number: "088 505 1220",
    tel: "0885051220",
    desc: "Nederland. Gratis advies over alcohol- en drugsgebruik.",
    region: "NL",
  },
  {
    name: "Landelijke hulplijn GGZ",
    number: "0900 1450",
    tel: "09001450",
    desc: "Nederland. Geestelijke gezondheidszorg, voor mensen in psychische nood.",
    region: "NL",
  },
];

const delayIcons = [
  <Droplets className="w-4 h-4" key="droplets" />,
  <Phone className="w-4 h-4" key="phone" />,
  <Video className="w-4 h-4" key="video" />,
  <Moon className="w-4 h-4" key="moon" />,
  <Utensils className="w-4 h-4" key="utensils" />,
  <Wind className="w-4 h-4" key="wind" />,
  <Heart className="w-4 h-4" key="heart" />,
  <Users className="w-4 h-4" key="users" />,
];

export default function CrisisPage() {
  const { t } = useT();
  const [activeGrounding, setActiveGrounding] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Record<string, Set<number>>>({});

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
        <Badge variant="serenity" className="mb-4">{t.crisis.badge}</Badge>
        <h1 className="text-4xl font-light text-[var(--text-primary)] mb-4 leading-tight">
          {t.crisis.titlePrefix}{" "}
          <em className="not-italic text-[var(--accent-serenity)]">{t.crisis.titleEm}</em>
        </h1>
        <p className="text-xl text-[var(--text-secondary)] font-light leading-relaxed max-w-2xl">
          {t.crisis.subtitle}
        </p>
      </div>

      {/* Immediate breathing */}
      <Card variant="serenity" padding="lg" className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Wind className="w-4 h-4 text-[var(--accent-serenity)]" aria-hidden />
          <h2 className="font-semibold text-[var(--text-primary)]">{t.crisis.breatheTitle}</h2>
        </div>
        <p className="text-sm text-[var(--text-secondary)] mb-4">
          {t.crisis.breatheDesc}
        </p>
        <BreathingExercise />
      </Card>

      {/* Helplines */}
      <section aria-labelledby="helplines-heading" className="mb-10">
        <h2
          id="helplines-heading"
          className="text-xl font-semibold text-[var(--text-primary)] mb-5"
        >
          {t.crisis.reachOutTitle}
        </h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {helplines.map((line) => (
            <Card key={line.name} padding="md" className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-medium text-[var(--text-primary)] text-sm">{line.name}</h3>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">{line.desc}</p>
                </div>
                <Badge variant="muted">{line.region}</Badge>
              </div>
              {line.tel ? (
                <a
                  href={`tel:${line.tel}`}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[var(--accent-serenity)] text-white text-sm font-medium hover:opacity-90 transition-calm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-serenity)]"
                  aria-label={`Call ${line.name}: ${line.number}`}
                >
                  <Phone className="w-3.5 h-3.5" aria-hidden />
                  {line.number}
                </a>
              ) : (
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[var(--accent-serenity-light)] text-[var(--accent-serenity)] text-sm font-medium">
                  <Phone className="w-3.5 h-3.5" aria-hidden />
                  {line.number}
                </div>
              )}
            </Card>
          ))}
        </div>
      </section>

      {/* 24/7 meeting */}
      <Card variant="sage" padding="lg" className="mb-10">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-2xl bg-[var(--accent-sage)] text-white flex items-center justify-center flex-shrink-0" aria-hidden>
            <Video className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="font-semibold text-[var(--text-primary)]">{t.crisis.meetingTitle}</h2>
            </div>
            <p className="text-sm text-[var(--text-secondary)] mb-3">
              {t.crisis.meetingDesc}
            </p>
            <a
              href="https://zoom.us/j/2923712604"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[var(--accent-sage)] text-white text-sm font-medium hover:opacity-90 transition-calm"
            >
              <Video className="w-4 h-4" aria-hidden />
              {t.crisis.meetingBtn}
            </a>
          </div>
        </div>
      </Card>

      {/* Urge surfing */}
      <section aria-labelledby="urge-heading" className="mb-10">
        <h2
          id="urge-heading"
          className="text-xl font-semibold text-[var(--text-primary)] mb-3"
        >
          {t.crisis.urgeSurfingTitle}
        </h2>
        <p className="text-sm text-[var(--text-muted)] mb-5">
          {t.crisis.urgeSurfingSubtitle}
        </p>
        <Card padding="lg">
          <ol className="space-y-3">
            {t.crisis.urgeSurfingSteps.map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[var(--accent-serenity-light)] text-[var(--accent-serenity)] text-xs flex items-center justify-center flex-shrink-0 mt-0.5 font-semibold" aria-hidden>
                  {i + 1}
                </span>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{step}</p>
              </li>
            ))}
          </ol>
        </Card>
      </section>

      {/* Delay techniques */}
      <section aria-labelledby="delay-heading" className="mb-12">
        <h2
          id="delay-heading"
          className="text-xl font-semibold text-[var(--text-primary)] mb-3"
        >
          {t.crisis.delayTitle}
        </h2>
        <p className="text-sm text-[var(--text-muted)] mb-5">
          {t.crisis.delaySubtitle}
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          {t.crisis.delayActions.map((action, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-soft)]"
            >
              <span className="text-[var(--accent-sage)] flex-shrink-0" aria-hidden>{delayIcons[i]}</span>
              <span className="text-sm text-[var(--text-secondary)]">{action}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Grounding exercises */}
      <section aria-labelledby="grounding-heading" className="mb-10">
        <h2
          id="grounding-heading"
          className="text-xl font-semibold text-[var(--text-primary)] mb-1"
        >
          {t.crisis.groundingTitle}
        </h2>
        <p className="text-sm text-[var(--text-muted)] mb-5">
          {t.crisis.groundingSubtitle}
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          {t.prayers.groundingData.map((exercise) => {
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
                  {isActive ? t.crisis.close : t.crisis.begin}
                </button>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Suicidal thoughts */}
      <Card variant="amber" padding="lg" className="mb-8">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-[var(--accent-amber)] flex-shrink-0 mt-0.5" aria-hidden />
          <div>
            <h2 className="font-semibold text-[var(--text-primary)] mb-2">
              {t.crisis.suicidalTitle}
            </h2>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-3">
              Bel nu 113 Zelfmoordpreventie — gratis, 24 uur per dag, 7 dagen per week.
              Je kunt ook chatten via{" "}
              <a href="https://www.113.nl" target="_blank" rel="noopener noreferrer" className="underline">
                113.nl
              </a>.
              Je hoeft niet in onmiddellijk gevaar te zijn om te bellen. Zo voelen is reden genoeg.
            </p>
            <a
              href="tel:08000113"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[var(--accent-amber)] text-white text-sm font-medium hover:opacity-90 transition-calm"
            >
              <Phone className="w-4 h-4" aria-hidden />
              Bel 0800 0113 nu
            </a>
          </div>
        </div>
      </Card>

      <div className="text-center">
        <p className="text-sm text-[var(--text-muted)] mb-4">
          {t.crisis.closingText}
        </p>
        <Link
          href="/prayers"
          className="text-sm text-[var(--accent-serenity)] hover:opacity-80 transition-calm"
        >
          {t.crisis.serenityLink}
        </Link>
      </div>
    </div>
  );
}
