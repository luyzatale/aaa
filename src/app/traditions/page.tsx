"use client";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useT } from "@/lib/i18n";
import {
  Users, Scale, DoorOpen, Shield, Target, Unlink,
  Wallet, Award, Network, VolumeX, EyeOff, Sparkles,
  Info, Lightbulb,
} from "lucide-react";

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

export default function TraditionsPage() {
  const { t } = useT();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      {/* Header */}
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

      {/* Steps vs Traditions explainer */}
      <Card variant="serenity" padding="lg" className="mb-10">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-[var(--accent-serenity)] flex-shrink-0 mt-0.5" aria-hidden />
          <div>
            <h2 className="font-semibold text-[var(--text-primary)] mb-2">
              {t.traditions.stepsVsTraditions}
            </h2>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              {t.traditions.stepsVsTraditionsBody}
            </p>
          </div>
        </div>
      </Card>

      {/* Tradition cards */}
      <div className="space-y-6">
        {t.traditions.items.map((item, i) => (
          <Card key={item.number} padding="lg" className="space-y-5">
            {/* Number + icon + short text */}
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

            {/* Plain words */}
            <div className="bg-[var(--bg-muted)] rounded-2xl p-4 space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--accent-sage)] mb-2">
                {t.traditions.plainWords}
              </p>
              <p className="text-sm text-[var(--text-primary)] leading-relaxed">
                {item.plain}
              </p>
            </div>

            {/* Concrete example */}
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)] mb-2">
                {t.traditions.example}
              </p>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                {item.example}
              </p>
            </div>

            {/* Neurodivergent / autistic note */}
            <div className="flex items-start gap-2.5 bg-[var(--accent-amber-light)] rounded-2xl p-3.5">
              <Lightbulb className="w-4 h-4 text-[var(--accent-amber)] flex-shrink-0 mt-0.5" aria-hidden />
              <div>
                <p className="text-xs font-semibold text-[var(--accent-amber)] mb-1">
                  {t.traditions.autisticNote}
                </p>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  {item.note}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <p className="mt-10 text-center text-sm text-[var(--text-muted)]">
        Source: <a href="https://www.aa.org/the-twelve-traditions" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-[var(--accent-sage)] transition-calm">aa.org/the-twelve-traditions</a>
      </p>
    </div>
  );
}
