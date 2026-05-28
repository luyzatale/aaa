"use client";

import { useState, useEffect } from "react";
import { useAccessibility } from "@/lib/accessibility-context";
import { cn } from "@/lib/utils";
import { X, Wind, Heart, Phone, Users, BookOpen } from "lucide-react";
import Link from "next/link";

const BREATHING_PHASES = [
  { label: "Breathe in",  duration: 4000, scale: 1.28,
    glow: "rgba(88,148,255,0.55)", outerGlow: "rgba(60,110,255,0.22)",
    c0: "#e8f2ff", c1: "#90bef8", c2: "#224ea8" },
  { label: "Hold",        duration: 4000, scale: 1.28,
    glow: "rgba(148,100,255,0.50)", outerGlow: "rgba(120,60,255,0.20)",
    c0: "#ede8ff", c1: "#b098f8", c2: "#4a28a0" },
  { label: "Breathe out", duration: 6000, scale: 0.82,
    glow: "rgba(60,180,255,0.45)", outerGlow: "rgba(40,148,220,0.17)",
    c0: "#dcf5ff", c1: "#88cef8", c2: "#206888" },
  { label: "Rest",        duration: 2000, scale: 0.82,
    glow: "rgba(80,100,220,0.38)", outerGlow: "rgba(60,80,180,0.14)",
    c0: "#dde0ff", c1: "#9098e8", c2: "#282858" },
];

const MOON_STARS = [
  { cx: 12,  cy: 18,  r: 0.9, d: 0.0 },
  { cx: 96,  cy: 12,  r: 1.2, d: 0.7 },
  { cx: 115, cy: 42,  r: 0.7, d: 1.4 },
  { cx: 18,  cy: 88,  r: 1.0, d: 0.4 },
  { cx: 108, cy: 95,  r: 0.8, d: 2.0 },
  { cx: 52,  cy: 8,   r: 0.6, d: 1.1 },
  { cx: 38,  cy: 112, r: 0.9, d: 1.8 },
  { cx: 118, cy: 68,  r: 0.7, d: 0.9 },
  { cx: 22,  cy: 48,  r: 0.8, d: 2.5 },
  { cx: 88,  cy: 118, r: 1.1, d: 0.3 },
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
  const coreScale  = 0.82 + (currentPhase.scale - 0.82) * breathProgress;
  const innerScale = coreScale * 1.14;
  const outerScale = coreScale * 1.30;

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

            {/* Space breathing visual */}
            <div className="flex flex-col items-center gap-3">
              <div aria-hidden>
                <svg width="140" height="140" viewBox="0 0 140 140" aria-hidden="true">
                  <defs>
                    <radialGradient id="ow-space" cx="45%" cy="45%" r="58%">
                      <stop offset="0%" stopColor="#180938" />
                      <stop offset="100%" stopColor="#05020e" />
                    </radialGradient>
                    {BREATHING_PHASES.map((p, i) => (
                      <radialGradient key={i} id={`ow-core-${i}`} cx="38%" cy="32%" r="65%">
                        <stop offset="0%"   stopColor={p.c0} />
                        <stop offset="42%"  stopColor={p.c1} />
                        <stop offset="100%" stopColor={p.c2} />
                      </radialGradient>
                    ))}
                    <clipPath id="ow-clip">
                      <circle cx="70" cy="70" r="67" />
                    </clipPath>
                  </defs>

                  <circle cx="70" cy="70" r="70" fill="url(#ow-space)" />

                  <g clipPath="url(#ow-clip)">
                    {MOON_STARS.map((s, i) => (
                      <circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill="white"
                        style={{ animation: `twinkle ${2.5 + (i % 3) * 0.7}s ease-in-out ${s.d}s infinite` }}
                      />
                    ))}

                    {/* Outer atmospheric bloom */}
                    <circle cx="70" cy="70" r="48" fill={currentPhase.outerGlow}
                      style={{ transform: `scale(${outerScale})`, transformOrigin: "70px 70px", transition: "transform 80ms ease-out" }}
                    />
                    {/* Inner halo */}
                    <circle cx="70" cy="70" r="36" fill={currentPhase.glow}
                      style={{ transform: `scale(${innerScale})`, transformOrigin: "70px 70px", transition: "transform 80ms ease-out" }}
                    />
                    {/* Core */}
                    <circle cx="70" cy="70" r="22" fill={`url(#ow-core-${breathPhase})`}
                      style={{ transform: `scale(${coreScale})`, transformOrigin: "70px 70px", transition: "transform 80ms ease-out" }}
                    />
                    <ellipse cx="63" cy="62" rx="7" ry="5" fill="rgba(255,255,255,0.2)"
                      style={{ transform: `scale(${coreScale})`, transformOrigin: "70px 70px", transition: "transform 80ms ease-out" }}
                    />
                  </g>

                  <circle cx="70" cy="70" r="69" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                </svg>
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
                href="tel:08000113"
                className="flex items-center gap-2 p-3 rounded-2xl bg-[#252419] border border-[#363529] text-[#c3bfb2] text-sm hover:bg-[#2d2c1f] transition-calm"
              >
                <Phone className="w-4 h-4 text-[#7da07d]" aria-hidden />
                Bel 0800 0113
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
