"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const PHASES = [
  { label: "Breathe in",  instruction: "Rise with the stars",   duration: 4,  scale: 1.28, ringColor: "#93c5fd" },
  { label: "Hold",        instruction: "Float in stillness",     duration: 4,  scale: 1.28, ringColor: "#c4b5fd" },
  { label: "Breathe out", instruction: "Drift back gently",      duration: 6,  scale: 0.82, ringColor: "#7eb8f7" },
  { label: "Rest",        instruction: "Rest in the quiet dark", duration: 2,  scale: 0.82, ringColor: "#4a98d8" },
];

const STARS = [
  { cx: 18,  cy: 22,  r: 1.0, d: 0.0 },
  { cx: 145, cy: 18,  r: 1.4, d: 0.5 },
  { cx: 178, cy: 45,  r: 0.8, d: 1.2 },
  { cx: 25,  cy: 140, r: 1.2, d: 0.8 },
  { cx: 168, cy: 155, r: 1.0, d: 1.8 },
  { cx: 82,  cy: 12,  r: 0.7, d: 0.3 },
  { cx: 155, cy: 88,  r: 1.3, d: 2.1 },
  { cx: 38,  cy: 68,  r: 0.9, d: 1.5 },
  { cx: 128, cy: 172, r: 1.1, d: 0.7 },
  { cx: 55,  cy: 175, r: 0.8, d: 2.5 },
  { cx: 182, cy: 120, r: 1.4, d: 1.0 },
  { cx: 12,  cy: 102, r: 0.7, d: 2.0 },
  { cx: 100, cy: 8,   r: 1.0, d: 0.4 },
  { cx: 188, cy: 175, r: 0.9, d: 1.7 },
  { cx: 65,  cy: 35,  r: 1.2, d: 0.9 },
  { cx: 138, cy: 135, r: 0.7, d: 2.3 },
  { cx: 95,  cy: 185, r: 1.1, d: 1.4 },
  { cx: 172, cy: 30,  r: 0.8, d: 0.6 },
  { cx: 42,  cy: 158, r: 1.3, d: 2.8 },
  { cx: 120, cy: 55,  r: 0.9, d: 1.1 },
  { cx: 58,  cy: 95,  r: 0.6, d: 3.2 },
  { cx: 148, cy: 62,  r: 1.0, d: 0.2 },
  { cx: 30,  cy: 188, r: 0.8, d: 1.6 },
  { cx: 162, cy: 188, r: 0.7, d: 2.4 },
  { cx: 88,  cy: 168, r: 1.1, d: 3.0 },
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
  const progress = active ? (currentPhase.duration - countdown) / currentPhase.duration : 0;
  const R = 90;
  const circumference = 2 * Math.PI * R;
  const dashOffset = circumference * (1 - progress);

  const moonScale = active ? currentPhase.scale : 1.0;
  const moonTransition = active
    ? `transform ${currentPhase.duration}s ease-in-out`
    : "transform 1.5s ease-in-out";

  const toggle = () => {
    if (active) {
      setActive(false);
      setPhase(0);
      setCountdown(PHASES[0].duration);
      setCycles(0);
    } else {
      setActive(true);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <div className="relative" aria-hidden>
        <svg width="200" height="200" viewBox="0 0 200 200" aria-hidden="true">
          <defs>
            <radialGradient id="breathe-spaceBg" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#1a1040" />
              <stop offset="100%" stopColor="#06040f" />
            </radialGradient>
            <radialGradient id="breathe-moonFill" cx="38%" cy="32%" r="65%">
              <stop offset="0%" stopColor="#dce8ff" />
              <stop offset="45%" stopColor="#94b4e8" />
              <stop offset="100%" stopColor="#3a5a88" />
            </radialGradient>
            <radialGradient id="breathe-moonGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(120,160,255,0.38)" />
              <stop offset="100%" stopColor="rgba(120,160,255,0)" />
            </radialGradient>
            <linearGradient id="breathe-cometGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(200,220,255,0)" />
              <stop offset="100%" stopColor="rgba(225,240,255,0.9)" />
            </linearGradient>
            <clipPath id="breathe-clip">
              <circle cx="100" cy="100" r="96" />
            </clipPath>
          </defs>

          {/* Space background */}
          <circle cx="100" cy="100" r="98" fill="url(#breathe-spaceBg)" />

          <g clipPath="url(#breathe-clip)">
            {/* Stars */}
            {STARS.map((s, i) => (
              <circle
                key={i}
                cx={s.cx}
                cy={s.cy}
                r={s.r}
                fill="white"
                style={{
                  animation: `twinkle ${2.4 + (i % 3) * 0.8}s ease-in-out ${s.d}s infinite`,
                }}
              />
            ))}

            {/* Comet */}
            {active && (
              <g style={{ animation: "cometFly 14s ease-in-out 2s infinite" }}>
                <line
                  x1="0" y1="0" x2="48" y2="0"
                  stroke="url(#breathe-cometGrad)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <circle cx="50" cy="0" r="2" fill="rgba(235,248,255,0.95)" />
              </g>
            )}

            {/* Moon group — scales with breathing phase */}
            <g
              style={{
                transform: `scale(${moonScale})`,
                transformOrigin: "100px 100px",
                transition: moonTransition,
              }}
            >
              <circle cx="100" cy="100" r="52" fill="url(#breathe-moonGlow)" />
              <circle cx="100" cy="100" r="32" fill="url(#breathe-moonFill)" />
              <circle cx="92" cy="95" r="2.4" fill="rgba(40,70,110,0.22)" />
              <circle cx="108" cy="104" r="1.7" fill="rgba(40,70,110,0.18)" />
            </g>
          </g>

          {/* Progress ring track */}
          <circle
            cx="100" cy="100" r={R}
            fill="none"
            stroke="rgba(255,255,255,0.07)"
            strokeWidth="2"
          />
          {/* Progress ring fill */}
          {active && (
            <circle
              cx="100" cy="100" r={R}
              fill="none"
              stroke={currentPhase.ringColor}
              strokeWidth="2"
              strokeOpacity="0.55"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              transform="rotate(-90 100 100)"
              style={{ transition: "stroke-dashoffset 1s linear, stroke 0.5s ease" }}
            />
          )}

          {/* Outer border ring */}
          <circle
            cx="100" cy="100" r="98"
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="1"
          />
        </svg>

        {/* Countdown overlay */}
        {active && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span
              className="text-3xl font-light"
              style={{ color: "rgba(255,255,255,0.85)" }}
            >
              {countdown}
            </span>
          </div>
        )}
      </div>

      {active && (
        <div className="text-center" aria-live="polite" aria-atomic>
          <p className="text-xl font-light text-[var(--text-primary)]">{currentPhase.label}</p>
          <p className="text-sm text-[var(--text-muted)] mt-1">{currentPhase.instruction}</p>
          {cycles > 0 && (
            <p className="text-xs text-[var(--text-muted)] mt-2">
              {cycles} {cycles === 1 ? "cycle" : "cycles"} complete
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
          4 in &middot; 4 hold &middot; 6 out &middot; 2 rest
        </p>
      )}
    </div>
  );
}
