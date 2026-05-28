"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const PHASES = [
  {
    label: "Breathe in",
    instruction: "Let your chest open gently",
    duration: 4,
    scale: 1.30,
    c0: "#e8f2ff", c1: "#90bef8", c2: "#224ea8",
    glow: "rgba(88,148,255,0.55)",
    outerGlow: "rgba(60,110,255,0.22)",
    ringColor: "#93c5fd",
  },
  {
    label: "Hold",
    instruction: "Float in stillness",
    duration: 4,
    scale: 1.30,
    c0: "#ede8ff", c1: "#b098f8", c2: "#4a28a0",
    glow: "rgba(148,100,255,0.50)",
    outerGlow: "rgba(120,60,255,0.20)",
    ringColor: "#c4b5fd",
  },
  {
    label: "Breathe out",
    instruction: "Let everything soften",
    duration: 6,
    scale: 0.78,
    c0: "#dcf5ff", c1: "#88cef8", c2: "#206888",
    glow: "rgba(60,180,255,0.45)",
    outerGlow: "rgba(40,148,220,0.17)",
    ringColor: "#7dd8f7",
  },
  {
    label: "Rest",
    instruction: "Be still",
    duration: 2,
    scale: 0.78,
    c0: "#dde0ff", c1: "#9098e8", c2: "#282858",
    glow: "rgba(80,100,220,0.38)",
    outerGlow: "rgba(60,80,180,0.14)",
    ringColor: "#4a98d8",
  },
];

const STARS = [
  { cx: 20,  cy: 25,  r: 1.0, d: 0.0 },
  { cx: 188, cy: 22,  r: 1.4, d: 0.5 },
  { cx: 218, cy: 58,  r: 0.8, d: 1.2 },
  { cx: 28,  cy: 172, r: 1.2, d: 0.8 },
  { cx: 210, cy: 188, r: 1.0, d: 1.8 },
  { cx: 105, cy: 12,  r: 0.7, d: 0.3 },
  { cx: 198, cy: 110, r: 1.3, d: 2.1 },
  { cx: 42,  cy: 82,  r: 0.9, d: 1.5 },
  { cx: 165, cy: 215, r: 1.1, d: 0.7 },
  { cx: 68,  cy: 220, r: 0.8, d: 2.5 },
  { cx: 226, cy: 150, r: 1.4, d: 1.0 },
  { cx: 14,  cy: 128, r: 0.7, d: 2.0 },
  { cx: 125, cy: 10,  r: 1.0, d: 0.4 },
  { cx: 232, cy: 218, r: 0.9, d: 1.7 },
  { cx: 80,  cy: 42,  r: 1.2, d: 0.9 },
  { cx: 175, cy: 168, r: 0.7, d: 2.3 },
  { cx: 118, cy: 232, r: 1.1, d: 1.4 },
  { cx: 215, cy: 38,  r: 0.8, d: 0.6 },
  { cx: 52,  cy: 198, r: 1.3, d: 2.8 },
  { cx: 150, cy: 68,  r: 0.9, d: 1.1 },
  { cx: 72,  cy: 118, r: 0.6, d: 3.2 },
  { cx: 188, cy: 78,  r: 1.0, d: 0.2 },
  { cx: 38,  cy: 238, r: 0.8, d: 1.6 },
  { cx: 205, cy: 238, r: 0.7, d: 2.4 },
  { cx: 110, cy: 210, r: 1.1, d: 3.0 },
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
  const R = 112;
  const circumference = 2 * Math.PI * R;
  const dashOffset = circumference * (1 - progress);

  const coreScale   = active ? currentPhase.scale : 1.0;
  const innerScale  = coreScale * 1.14;
  const outerScale  = coreScale * 1.32;
  const dur = active ? `${currentPhase.duration}s ease-in-out` : "1.5s ease-in-out";
  const tx = `transform ${dur}`;

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
    <div className="flex flex-col items-center gap-4 py-4">
      {/* Space orb */}
      <div aria-hidden>
        <svg width="240" height="240" viewBox="0 0 240 240" aria-hidden="true">
          <defs>
            <radialGradient id="be-space" cx="45%" cy="45%" r="58%">
              <stop offset="0%" stopColor="#180938" />
              <stop offset="100%" stopColor="#05020e" />
            </radialGradient>

            {PHASES.map((p, i) => (
              <radialGradient key={i} id={`be-core-${i}`} cx="38%" cy="32%" r="65%">
                <stop offset="0%"   stopColor={p.c0} />
                <stop offset="42%"  stopColor={p.c1} />
                <stop offset="100%" stopColor={p.c2} />
              </radialGradient>
            ))}

            <linearGradient id="be-comet" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="rgba(200,220,255,0)" />
              <stop offset="100%" stopColor="rgba(230,244,255,0.92)" />
            </linearGradient>

            <clipPath id="be-clip">
              <circle cx="120" cy="120" r="117" />
            </clipPath>
          </defs>

          {/* Background */}
          <circle cx="120" cy="120" r="120" fill="url(#be-space)" />

          <g clipPath="url(#be-clip)">
            {/* Stars */}
            {STARS.map((s, i) => (
              <circle
                key={i}
                cx={s.cx} cy={s.cy} r={s.r}
                fill="white"
                style={{ animation: `twinkle ${2.4 + (i % 3) * 0.8}s ease-in-out ${s.d}s infinite` }}
              />
            ))}

            {/* Comet */}
            {active && (
              <g style={{ animation: "cometFly 14s ease-in-out 3s infinite" }}>
                <line x1="0" y1="0" x2="55" y2="0" stroke="url(#be-comet)" strokeWidth="1.8" strokeLinecap="round" />
                <circle cx="57" cy="0" r="2.2" fill="rgba(235,248,255,0.95)" />
              </g>
            )}

            {/* Outer atmospheric bloom — expands the most */}
            <circle
              cx="120" cy="120" r="88"
              fill={currentPhase.outerGlow}
              style={{ transform: `scale(${outerScale})`, transformOrigin: "120px 120px", transition: tx }}
            />

            {/* Inner atmospheric halo */}
            <circle
              cx="120" cy="120" r="68"
              fill={currentPhase.glow}
              style={{ transform: `scale(${innerScale})`, transformOrigin: "120px 120px", transition: tx }}
            />

            {/* Core orb — color shifts per phase */}
            <circle
              cx="120" cy="120" r="42"
              fill={`url(#be-core-${active ? phase : 0})`}
              style={{ transform: `scale(${coreScale})`, transformOrigin: "120px 120px", transition: tx }}
            />

            {/* Surface highlight */}
            <ellipse
              cx="109" cy="107" rx="14" ry="9"
              fill="rgba(255,255,255,0.2)"
              style={{ transform: `scale(${coreScale})`, transformOrigin: "120px 120px", transition: tx }}
            />
          </g>

          {/* Progress ring */}
          <circle cx="120" cy="120" r={R} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="2" />
          {active && (
            <circle
              cx="120" cy="120" r={R}
              fill="none"
              stroke={currentPhase.ringColor}
              strokeWidth="2"
              strokeOpacity="0.5"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              transform="rotate(-90 120 120)"
              style={{ transition: "stroke-dashoffset 1s linear, stroke 0.6s ease" }}
            />
          )}

          <circle cx="120" cy="120" r="119" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
        </svg>
      </div>

      {/* Phase label + countdown */}
      <div className="text-center min-h-[84px] flex flex-col items-center justify-center gap-0.5">
        {active ? (
          <>
            <p className="text-lg font-light text-[var(--text-primary)]" aria-live="polite">
              {currentPhase.label}
            </p>
            <p
              className="text-5xl font-extralight tabular-nums leading-none my-1"
              style={{ color: currentPhase.ringColor }}
              aria-live="polite"
              aria-atomic="true"
            >
              {countdown}
            </p>
            <p className="text-sm text-[var(--text-muted)]">{currentPhase.instruction}</p>
            {cycles > 0 && (
              <p className="text-xs text-[var(--text-muted)] mt-1">
                {cycles} {cycles === 1 ? "cycle" : "cycles"} complete
              </p>
            )}
          </>
        ) : (
          <p className="text-xs text-[var(--text-muted)]">
            4 in &middot; 4 hold &middot; 6 out &middot; 2 rest
          </p>
        )}
      </div>

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
    </div>
  );
}
