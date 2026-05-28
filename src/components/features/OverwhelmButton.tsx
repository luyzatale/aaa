"use client";

import { useState, useEffect } from "react";
import { useAccessibility } from "@/lib/accessibility-context";
import { cn } from "@/lib/utils";
import { X, Wind, Heart, Phone, Users, BookOpen } from "lucide-react";
import Link from "next/link";

const BREATHING_PHASES = [
  { label: "Breathe in", duration: 4000, scale: 1.15 },
  { label: "Hold", duration: 4000, scale: 1.15 },
  { label: "Breathe out", duration: 6000, scale: 1.0 },
  { label: "Rest", duration: 2000, scale: 1.0 },
];

const CALM_MESSAGES = [
  "You do not have to do recovery perfectly.",
  "One breath at a time. One moment at a time.",
  "This feeling will pass. You have survived hard things before.",
  "You are safe right now.",
  "You only need to stay sober today.",
  "It is okay to feel overwhelmed. It is not a failure.",
  "Reach out. You do not have to do this alone.",
];

export default function OverwhelmButton() {
  const { setOverwhelmed } = useAccessibility();
  const [active, setActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState(0);
  const [messageIdx, setMessageIdx] = useState(0);
  const [breathProgress, setBreathProgress] = useState(0);

  const open = () => {
    setActive(true);
    setOverwhelmed(true);
    setBreathPhase(0);
    setBreathProgress(0);
  };

  const close = () => {
    setActive(false);
    setOverwhelmed(false);
  };

  useEffect(() => {
    if (!active) return;
    const phase = BREATHING_PHASES[breathPhase];
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      setBreathProgress(Math.min(elapsed / phase.duration, 1));
      if (elapsed >= phase.duration) {
        setBreathPhase((p) => (p + 1) % BREATHING_PHASES.length);
        setBreathProgress(0);
        clearInterval(interval);
      }
    }, 50);
    return () => clearInterval(interval);
  }, [active, breathPhase]);

  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => {
      setMessageIdx((i) => (i + 1) % CALM_MESSAGES.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [active]);

  const currentPhase = BREATHING_PHASES[breathPhase];

  return (
    <>
      <button
        onClick={open}
        className={cn(
          "fixed bottom-24 right-6 z-50",
          "bg-[var(--accent-serenity)] text-white",
          "px-4 py-3 rounded-2xl shadow-calm-lg",
          "text-sm font-medium flex items-center gap-2",
          "hover:opacity-90 transition-calm",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-serenity)] focus-visible:ring-offset-2"
        )}
        aria-label="I feel overwhelmed — open calm support"
      >
        <Wind className="w-4 h-4" aria-hidden />
        I feel overwhelmed
      </button>

      {active && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          role="dialog"
          aria-label="Calm support panel"
          aria-modal="true"
        >
          {/* Dimmed overlay */}
          <div className="absolute inset-0 bg-[#0d0c09]/80 backdrop-blur-md" />

          <div className={cn(
            "relative z-10 w-full max-w-lg",
            "bg-[#1a1915] border border-[#363529] rounded-4xl shadow-calm-lg",
            "p-8 space-y-8 text-center",
            "animate-fade-up"
          )}>
            <button
              onClick={close}
              className="absolute top-5 right-5 p-2 rounded-xl text-[#8e8b82] hover:bg-[#252419] hover:text-[#f0ede4] transition-calm"
              aria-label="Close calm support"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Breathing circle */}
            <div className="flex flex-col items-center gap-4">
              <div
                className="relative w-32 h-32 rounded-full flex items-center justify-center"
                style={{
                  background: "radial-gradient(circle, rgba(93,130,93,0.25) 0%, rgba(93,130,93,0.05) 100%)",
                  transform: `scale(${1 + (currentPhase.scale - 1) * breathProgress})`,
                  transition: "transform 100ms ease-out",
                }}
                aria-hidden
              >
                <div className="w-20 h-20 rounded-full bg-[var(--accent-sage)]/20 flex items-center justify-center">
                  <Wind className="w-8 h-8 text-[var(--accent-sage)]" />
                </div>
              </div>
              <p className="text-[#c3bfb2] text-lg font-light" aria-live="polite">
                {currentPhase.label}
              </p>
              <p className="text-[#6e6b62] text-sm">
                {breathPhase === 0 ? "Slow, gentle breath in through your nose" :
                 breathPhase === 1 ? "Gently hold" :
                 breathPhase === 2 ? "Slow breath out through your mouth" :
                 "Rest quietly"}
              </p>
            </div>

            {/* Calm message */}
            <p
              className="text-[#d4c9b0] text-lg font-light leading-relaxed italic"
              aria-live="polite"
            >
              &ldquo;{CALM_MESSAGES[messageIdx]}&rdquo;
            </p>

            {/* Quick actions */}
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/meetings"
                onClick={close}
                className="flex items-center gap-2 p-3 rounded-2xl bg-[#252419] border border-[#363529] text-[#c3bfb2] text-sm hover:bg-[#2d2c1f] transition-calm"
              >
                <Users className="w-4 h-4 text-[var(--accent-sage)]" aria-hidden />
                Find a meeting
              </Link>
              <Link
                href="/prayers"
                onClick={close}
                className="flex items-center gap-2 p-3 rounded-2xl bg-[#252419] border border-[#363529] text-[#c3bfb2] text-sm hover:bg-[#2d2c1f] transition-calm"
              >
                <BookOpen className="w-4 h-4 text-[var(--accent-serenity)]" aria-hidden />
                Serenity Prayer
              </Link>
              <Link
                href="/crisis"
                onClick={close}
                className="flex items-center gap-2 p-3 rounded-2xl bg-[#252419] border border-[#363529] text-[#c3bfb2] text-sm hover:bg-[#2d2c1f] transition-calm"
              >
                <Heart className="w-4 h-4 text-[var(--accent-amber)]" aria-hidden />
                Crisis support
              </Link>
              <a
                href="tel:116123"
                className="flex items-center gap-2 p-3 rounded-2xl bg-[#252419] border border-[#363529] text-[#c3bfb2] text-sm hover:bg-[#2d2c1f] transition-calm"
              >
                <Phone className="w-4 h-4 text-[#7da07d]" aria-hidden />
                Samaritans 116 123
              </a>
            </div>

            <p className="text-[#6e6b62] text-xs">
              Take your time. There is no rush here.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
