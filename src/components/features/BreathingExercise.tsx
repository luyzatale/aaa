"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const PHASES = [
  { label: "Breathe In", instruction: "Slowly through your nose", duration: 4, color: "#5d825d" },
  { label: "Hold", instruction: "Gently", duration: 4, color: "#7559a8" },
  { label: "Breathe Out", instruction: "Slowly through your mouth", duration: 6, color: "#4a6b4a" },
  { label: "Rest", instruction: "Quiet stillness", duration: 2, color: "#607484" },
];

export default function BreathingExercise() {
  const [active, setActive] = useState(false);
  const [phase, setPhase] = useState(0);
  const [countdown, setCountdown] = useState(PHASES[0].duration);
  const [cycles, setCycles] = useState(0);

  useEffect(() => {
    if (!active) return;
    if (countdown <= 0) {
      const next = (phase + 1) % PHASES.length;
      if (next === 0) setCycles((c) => c + 1);
      setPhase(next);
      setCountdown(PHASES[next].duration);
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [active, countdown, phase]);

  const currentPhase = PHASES[phase];
  const progress = (currentPhase.duration - countdown) / currentPhase.duration;
  const circumference = 2 * Math.PI * 54;
  const dashOffset = circumference - progress * circumference;

  const toggle = () => {
    if (active) {
      setActive(false);
      setPhase(0);
      setCountdown(PHASES[0].duration);
    } else {
      setActive(true);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <div className="relative w-36 h-36" aria-hidden={!active}>
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="54" fill="none" stroke="var(--border-soft)" strokeWidth="4" />
          {active && (
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke={currentPhase.color}
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              className="transition-all duration-1000 ease-linear"
            />
          )}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          {active ? (
            <>
              <span
                className="text-3xl font-light text-[var(--text-primary)]"
                aria-live="polite"
              >
                {countdown}
              </span>
              <span className="text-xs text-[var(--text-muted)] mt-0.5">seconds</span>
            </>
          ) : (
            <span className="text-sm text-[var(--text-muted)]">Ready</span>
          )}
        </div>
      </div>

      {active && (
        <div className="text-center" aria-live="polite" aria-atomic>
          <p className="text-xl font-light text-[var(--text-primary)]">{currentPhase.label}</p>
          <p className="text-sm text-[var(--text-muted)] mt-1">{currentPhase.instruction}</p>
          {cycles > 0 && (
            <p className="text-xs text-[var(--text-muted)] mt-2">
              Cycle {cycles} complete
            </p>
          )}
        </div>
      )}

      <button
        onClick={toggle}
        className={cn(
          "px-8 py-3 rounded-2xl text-sm font-medium transition-calm",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          active
            ? "bg-[var(--bg-muted)] text-[var(--text-secondary)] hover:bg-[var(--border-soft)] focus-visible:ring-[var(--text-muted)]"
            : "bg-[var(--accent-sage)] text-white hover:opacity-90 focus-visible:ring-[var(--accent-sage)]"
        )}
        aria-label={active ? "Stop breathing exercise" : "Start breathing exercise"}
      >
        {active ? "Stop" : "Begin Breathing"}
      </button>

      {!active && (
        <p className="text-xs text-[var(--text-muted)] text-center max-w-xs">
          4-second in · 4-second hold · 6-second out · 2-second rest
        </p>
      )}
    </div>
  );
}
