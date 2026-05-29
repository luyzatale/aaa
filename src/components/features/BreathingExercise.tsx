"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const PHASES = [
  {
    label: "Breathe in",
    instruction: "Let space gently open around you",
    duration: 4,
    scale: 1.27,
    c0: "#d8eef8", c1: "#4a90c4", c2: "#0e2c50",
    glow: "rgba(74,144,196,0.52)",
    outerGlow: "rgba(38,100,178,0.24)",
    ringColor: "#6ab8dc",
    auroraColor: "rgba(100,170,220,0.22)",
  },
  {
    label: "Hold",
    instruction: "Float in stillness among stars",
    duration: 4,
    scale: 1.27,
    c0: "#e0d8f4", c1: "#786cc4", c2: "#1a0e4e",
    glow: "rgba(120,108,196,0.52)",
    outerGlow: "rgba(88,68,178,0.24)",
    ringColor: "#aca0d8",
    auroraColor: "rgba(150,120,200,0.28)",
  },
  {
    label: "Breathe out",
    instruction: "Release softly into the deep",
    duration: 6,
    scale: 0.79,
    c0: "#c4dff0", c1: "#2c72a8", c2: "#081c38",
    glow: "rgba(44,114,168,0.42)",
    outerGlow: "rgba(20,80,148,0.18)",
    ringColor: "#50a0c8",
    auroraColor: "rgba(60,130,180,0.18)",
  },
  {
    label: "Rest",
    instruction: "You are safe. Be still.",
    duration: 2,
    scale: 0.79,
    c0: "#c8d0e8", c1: "#4458a8", c2: "#08102a",
    glow: "rgba(68,88,168,0.36)",
    outerGlow: "rgba(48,65,148,0.14)",
    ringColor: "#6878b8",
    auroraColor: "rgba(80,100,180,0.14)",
  },
];

// ─── Star field data (static to avoid hydration mismatch) ─────────────────────

const STARS_DISTANT = [
  { cx: 14,  cy: 22,  r: 0.5, d: 0.0 }, { cx: 38,  cy: 8,   r: 0.6, d: 1.4 },
  { cx: 55,  cy: 44,  r: 0.5, d: 0.8 }, { cx: 72,  cy: 18,  r: 0.6, d: 2.1 },
  { cx: 92,  cy: 35,  r: 0.5, d: 0.5 }, { cx: 112, cy: 12,  r: 0.6, d: 3.0 },
  { cx: 148, cy: 8,   r: 0.5, d: 0.3 }, { cx: 165, cy: 38,  r: 0.6, d: 2.5 },
  { cx: 182, cy: 18,  r: 0.5, d: 1.1 }, { cx: 200, cy: 32,  r: 0.6, d: 3.4 },
  { cx: 218, cy: 15,  r: 0.5, d: 0.7 }, { cx: 235, cy: 40,  r: 0.6, d: 2.0 },
  { cx: 252, cy: 22,  r: 0.5, d: 1.5 }, { cx: 268, cy: 48,  r: 0.6, d: 0.2 },
  { cx: 18,  cy: 58,  r: 0.5, d: 2.8 }, { cx: 42,  cy: 72,  r: 0.6, d: 1.3 },
  { cx: 62,  cy: 62,  r: 0.5, d: 3.6 }, { cx: 88,  cy: 78,  r: 0.6, d: 0.9 },
  { cx: 108, cy: 65,  r: 0.5, d: 2.2 }, { cx: 162, cy: 72,  r: 0.6, d: 0.4 },
  { cx: 178, cy: 58,  r: 0.5, d: 2.7 }, { cx: 195, cy: 68,  r: 0.6, d: 1.6 },
  { cx: 215, cy: 55,  r: 0.5, d: 3.8 }, { cx: 232, cy: 75,  r: 0.6, d: 0.6 },
  { cx: 258, cy: 62,  r: 0.5, d: 1.9 }, { cx: 272, cy: 78,  r: 0.6, d: 2.4 },
  { cx: 10,  cy: 102, r: 0.5, d: 1.0 }, { cx: 35,  cy: 95,  r: 0.6, d: 3.5 },
  { cx: 58,  cy: 112, r: 0.5, d: 0.1 }, { cx: 78,  cy: 98,  r: 0.6, d: 2.6 },
  { cx: 98,  cy: 115, r: 0.5, d: 1.4 }, { cx: 238, cy: 95,  r: 0.6, d: 2.9 },
  { cx: 258, cy: 110, r: 0.5, d: 1.2 }, { cx: 275, cy: 98,  r: 0.6, d: 3.3 },
  { cx: 8,   cy: 145, r: 0.5, d: 0.7 }, { cx: 28,  cy: 135, r: 0.6, d: 2.1 },
  { cx: 48,  cy: 152, r: 0.5, d: 1.5 }, { cx: 275, cy: 148, r: 0.6, d: 0.3 },
  { cx: 8,   cy: 192, r: 0.5, d: 2.8 }, { cx: 268, cy: 185, r: 0.6, d: 1.7 },
  { cx: 14,  cy: 238, r: 0.5, d: 0.9 }, { cx: 32,  cy: 222, r: 0.6, d: 3.1 },
  { cx: 52,  cy: 248, r: 0.5, d: 1.6 }, { cx: 272, cy: 232, r: 0.6, d: 2.5 },
  { cx: 258, cy: 255, r: 0.5, d: 0.4 }, { cx: 218, cy: 268, r: 0.6, d: 1.8 },
  { cx: 148, cy: 272, r: 0.5, d: 3.2 }, { cx: 82,  cy: 268, r: 0.6, d: 0.6 },
  { cx: 38,  cy: 272, r: 0.5, d: 2.3 }, { cx: 105, cy: 258, r: 0.6, d: 1.0 },
];

const STARS_MID = [
  { cx: 22,  cy: 32,  r: 1.0, d: 0.5 }, { cx: 62,  cy: 18,  r: 1.1, d: 1.8 },
  { cx: 98,  cy: 48,  r: 0.9, d: 0.3 }, { cx: 175, cy: 12,  r: 1.0, d: 1.2 },
  { cx: 215, cy: 38,  r: 1.1, d: 3.4 }, { cx: 252, cy: 18,  r: 0.9, d: 0.8 },
  { cx: 32,  cy: 88,  r: 1.0, d: 2.1 }, { cx: 75,  cy: 72,  r: 1.1, d: 1.4 },
  { cx: 195, cy: 82,  r: 1.0, d: 2.7 }, { cx: 242, cy: 65,  r: 1.1, d: 1.5 },
  { cx: 18,  cy: 125, r: 0.9, d: 3.2 }, { cx: 265, cy: 128, r: 1.1, d: 2.0 },
  { cx: 28,  cy: 168, r: 0.9, d: 1.7 }, { cx: 252, cy: 182, r: 1.0, d: 3.8 },
  { cx: 22,  cy: 222, r: 1.1, d: 0.9 }, { cx: 68,  cy: 210, r: 0.9, d: 2.8 },
  { cx: 208, cy: 225, r: 0.9, d: 0.5 }, { cx: 255, cy: 212, r: 1.1, d: 2.3 },
  { cx: 115, cy: 258, r: 1.0, d: 1.6 }, { cx: 162, cy: 248, r: 1.1, d: 3.1 },
];

const STARS_BRIGHT = [
  { cx: 45,  cy: 42,  r: 1.5, d: 0.8 },
  { cx: 145, cy: 15,  r: 1.6, d: 2.0 },
  { cx: 242, cy: 58,  r: 1.4, d: 1.3 },
  { cx: 18,  cy: 162, r: 1.5, d: 3.2 },
  { cx: 260, cy: 145, r: 1.4, d: 0.5 },
  { cx: 82,  cy: 252, r: 1.6, d: 1.9 },
  { cx: 195, cy: 258, r: 1.5, d: 2.7 },
  { cx: 22,  cy: 258, r: 1.4, d: 0.2 },
];

// Distant galaxy smudges (very faint background blobs)
const GALAXIES = [
  { cx: 55,  cy: 35,  rx: 8,  ry: 4,  rot: 30,  o: 0.08 },
  { cx: 228, cy: 42,  rx: 10, ry: 5,  rot: -20, o: 0.07 },
  { cx: 32,  cy: 195, rx: 7,  ry: 3,  rot: 15,  o: 0.09 },
  { cx: 255, cy: 188, rx: 9,  ry: 4,  rot: -35, o: 0.07 },
  { cx: 105, cy: 262, rx: 8,  ry: 3,  rot: 10,  o: 0.08 },
  { cx: 185, cy: 255, rx: 6,  ry: 3,  rot: -15, o: 0.08 },
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

  const cur = PHASES[phase];
  const coreScale  = active ? cur.scale : 1.0;
  const innerScale = coreScale * 1.15;
  const outerScale = coreScale * 1.34;
  const dur = active ? `${cur.duration}s ease-in-out` : "1.8s ease-in-out";
  const tx  = `transform ${dur}`;

  const R = 130;
  const circ = 2 * Math.PI * R;
  const progress = active ? (cur.duration - countdown) / cur.duration : 0;
  const dashOffset = circ * (1 - progress);

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
      <div aria-hidden>
        <svg
          width="280" height="280"
          viewBox="0 0 280 280"
          aria-hidden="true"
          data-breathing="true"
        >
          <defs>
            {/* Deep space background */}
            <radialGradient id="be-space" cx="42%" cy="40%" r="68%">
              <stop offset="0%"   stopColor="#0e1628" />
              <stop offset="55%"  stopColor="#060b14" />
              <stop offset="100%" stopColor="#020408" />
            </radialGradient>

            {/* Nebula gradients */}
            <radialGradient id="be-neb1" cx="28%" cy="32%" r="58%">
              <stop offset="0%"   stopColor="rgba(55,95,175,0.14)" />
              <stop offset="100%" stopColor="rgba(20,40,100,0)" />
            </radialGradient>
            <radialGradient id="be-neb2" cx="72%" cy="68%" r="52%">
              <stop offset="0%"   stopColor="rgba(80,48,155,0.11)" />
              <stop offset="100%" stopColor="rgba(40,20,100,0)" />
            </radialGradient>
            <radialGradient id="be-neb3" cx="55%" cy="25%" r="38%">
              <stop offset="0%"   stopColor="rgba(40,80,160,0.08)" />
              <stop offset="100%" stopColor="rgba(20,40,100,0)" />
            </radialGradient>

            {/* Planet gradients per phase */}
            {PHASES.map((p, i) => (
              <radialGradient key={i} id={`be-planet-${i}`} cx="34%" cy="30%" r="68%">
                <stop offset="0%"   stopColor={p.c0} />
                <stop offset="44%"  stopColor={p.c1} />
                <stop offset="100%" stopColor={p.c2} />
              </radialGradient>
            ))}

            {/* Atmospheric rim gradient */}
            <radialGradient id="be-rim" cx="50%" cy="50%" r="50%">
              <stop offset="82%" stopColor="rgba(0,0,0,0)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.06)" />
            </radialGradient>

            {/* Comet tail */}
            <linearGradient id="be-comet" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="rgba(200,225,255,0)" />
              <stop offset="100%" stopColor="rgba(228,244,255,0.90)" />
            </linearGradient>

            {/* Clip to circle */}
            <clipPath id="be-clip">
              <circle cx="140" cy="140" r="137" />
            </clipPath>
          </defs>

          {/* ── Background ── */}
          <circle cx="140" cy="140" r="140" fill="url(#be-space)" />

          <g clipPath="url(#be-clip)">

            {/* ── Nebula clouds ── */}
            <ellipse cx="75"  cy="85"  rx="128" ry="95"
              fill="url(#be-neb1)"
              style={{ animation: "nebulaDrift 28s ease-in-out 0s infinite" }}
            />
            <ellipse cx="200" cy="192" rx="115" ry="98"
              fill="url(#be-neb2)"
              style={{ animation: "nebulaDrift 38s ease-in-out 12s infinite" }}
            />
            <ellipse cx="155" cy="68"  rx="85"  ry="55"
              fill="url(#be-neb3)"
              style={{ animation: "nebulaDrift 22s ease-in-out 6s infinite" }}
            />

            {/* ── Distant galaxy smudges ── */}
            {GALAXIES.map((g, i) => (
              <ellipse key={i}
                cx={g.cx} cy={g.cy} rx={g.rx} ry={g.ry}
                fill="rgba(200,215,255,1)"
                opacity={g.o}
                transform={`rotate(${g.rot} ${g.cx} ${g.cy})`}
              />
            ))}

            {/* ── Star field layer 1 – distant, very faint ── */}
            <g style={{ animation: "stardriftA 88s ease-in-out infinite" }}>
              {STARS_DISTANT.map((s, i) => (
                <circle key={i} cx={s.cx} cy={s.cy} r={s.r}
                  fill="white" opacity={0.30}
                  style={{
                    animation: `twinkle ${3.2 + (i % 5) * 0.65}s ease-in-out ${s.d}s infinite`,
                  }}
                />
              ))}
            </g>

            {/* ── Star field layer 2 – mid-field ── */}
            <g style={{ animation: "stardriftB 62s ease-in-out infinite" }}>
              {STARS_MID.map((s, i) => (
                <circle key={i} cx={s.cx} cy={s.cy} r={s.r}
                  fill="white" opacity={0.55}
                  style={{
                    animation: `twinkle ${2.5 + (i % 4) * 0.8}s ease-in-out ${s.d}s infinite`,
                  }}
                />
              ))}
            </g>

            {/* ── Star field layer 3 – bright accent stars with diffraction ── */}
            {STARS_BRIGHT.map((s, i) => (
              <g key={i}
                style={{
                  animation: `twinkle ${2.2 + (i % 3) * 1.1}s ease-in-out ${s.d}s infinite`,
                }}
              >
                <circle cx={s.cx} cy={s.cy} r={s.r} fill="white" opacity={0.88} />
                <line
                  x1={s.cx - s.r * 4} y1={s.cy} x2={s.cx + s.r * 4} y2={s.cy}
                  stroke="rgba(255,255,255,0.22)" strokeWidth="0.4"
                />
                <line
                  x1={s.cx} y1={s.cy - s.r * 4} x2={s.cx} y2={s.cy + s.r * 4}
                  stroke="rgba(255,255,255,0.22)" strokeWidth="0.4"
                />
              </g>
            ))}

            {/* ── Comet (active only) ── */}
            {active && (
              <g style={{ animation: "cometFly2 26s ease-in-out 6s infinite" }}>
                <line x1="0" y1="0" x2="68" y2="0"
                  stroke="url(#be-comet)" strokeWidth="1.6" strokeLinecap="round" />
                <circle cx="70" cy="0" r="1.8" fill="rgba(235,246,255,0.92)" />
              </g>
            )}

            {/* ── Hold phase ripple rings ── */}
            {active && phase === 1 && (
              <>
                <circle cx="140" cy="140" r="52" fill="none"
                  stroke={cur.glow} strokeWidth="1.2"
                  style={{
                    transformOrigin: "140px 140px",
                    animation: "ringRipple 4s ease-out 0s infinite",
                  }}
                />
                <circle cx="140" cy="140" r="52" fill="none"
                  stroke={cur.glow} strokeWidth="1.2"
                  style={{
                    transformOrigin: "140px 140px",
                    animation: "ringRipple 4s ease-out 2s infinite",
                  }}
                />
              </>
            )}

            {/* ── Aurora wisps ── */}
            {active && (
              <>
                <path
                  d="M 8 195 Q 52 175 100 190 Q 148 208 200 190 Q 240 175 272 192"
                  fill="none"
                  stroke={cur.auroraColor}
                  strokeWidth="18"
                  strokeLinecap="round"
                  opacity={phase === 1 ? 1 : 0.55}
                  style={{
                    animation: "auroraDrift 14s ease-in-out infinite",
                    transition: "opacity 2s ease, stroke 1.5s ease",
                  }}
                />
                <path
                  d="M 18 210 Q 60 195 108 205 Q 155 218 205 204 Q 245 193 268 208"
                  fill="none"
                  stroke={cur.auroraColor}
                  strokeWidth="10"
                  strokeLinecap="round"
                  opacity={phase === 1 ? 0.65 : 0.3}
                  style={{
                    animation: "auroraDrift 18s ease-in-out 4s infinite",
                    transition: "opacity 2s ease, stroke 1.5s ease",
                  }}
                />
              </>
            )}

            {/* ── Outer atmospheric bloom ── */}
            <circle cx="140" cy="140" r="85"
              fill={cur.outerGlow}
              style={{ transform: `scale(${outerScale})`, transformOrigin: "140px 140px", transition: tx }}
            />

            {/* ── Inner corona ── */}
            <circle cx="140" cy="140" r="65"
              fill={cur.glow}
              style={{ transform: `scale(${innerScale})`, transformOrigin: "140px 140px", transition: tx }}
            />

            {/* ── Core planet ── */}
            <circle cx="140" cy="140" r="42"
              fill={`url(#be-planet-${active ? phase : 0})`}
              style={{ transform: `scale(${coreScale})`, transformOrigin: "140px 140px", transition: tx }}
            />

            {/* ── Atmospheric rim (edge glow on planet) ── */}
            <circle cx="140" cy="140" r="42"
              fill="url(#be-rim)"
              style={{ transform: `scale(${coreScale})`, transformOrigin: "140px 140px", transition: tx }}
            />

            {/* ── Surface highlight ── */}
            <ellipse cx="126" cy="125" rx="14" ry="9"
              fill="rgba(255,255,255,0.16)"
              style={{ transform: `scale(${coreScale})`, transformOrigin: "140px 140px", transition: tx }}
            />

            {/* ── Secondary subtle highlight ── */}
            <ellipse cx="150" cy="154" rx="7" ry="4"
              fill="rgba(255,255,255,0.05)"
              style={{ transform: `scale(${coreScale})`, transformOrigin: "140px 140px", transition: tx }}
            />

          </g>

          {/* ── Progress ring (outside clip) ── */}
          {active && (
            <circle cx="140" cy="140" r={R}
              fill="none"
              stroke={cur.ringColor}
              strokeWidth="1.5"
              strokeOpacity="0.42"
              strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={dashOffset}
              transform="rotate(-90 140 140)"
              style={{ transition: "stroke-dashoffset 1s linear, stroke 0.8s ease" }}
            />
          )}

        </svg>
      </div>

      {/* Phase label + countdown */}
      <div className="text-center min-h-[88px] flex flex-col items-center justify-center gap-0.5">
        {active ? (
          <>
            <p className="text-base font-light text-[var(--text-primary)]" aria-live="polite">
              {cur.label}
            </p>
            <p
              className="text-5xl font-extralight tabular-nums leading-none my-1"
              style={{ color: cur.ringColor }}
              aria-live="polite"
              aria-atomic="true"
            >
              {countdown}
            </p>
            <p className="text-xs text-[var(--text-muted)] max-w-[220px] leading-relaxed">
              {cur.instruction}
            </p>
            {cycles > 0 && (
              <p className="text-xs text-[var(--text-muted)] mt-1 opacity-60">
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
