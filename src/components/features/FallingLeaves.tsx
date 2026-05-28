"use client";

const ORBS = [
  { left: 4,  top: 65, size: 12, duration: 10, delay: 0,   opacity: 0.13, sage: true  },
  { left: 13, top: 28, size: 7,  duration: 14, delay: 2,   opacity: 0.10, sage: false },
  { left: 22, top: 82, size: 16, duration: 8,  delay: 5,   opacity: 0.14, sage: true  },
  { left: 30, top: 45, size: 6,  duration: 12, delay: 1,   opacity: 0.09, sage: false },
  { left: 40, top: 15, size: 10, duration: 15, delay: 4,   opacity: 0.12, sage: true  },
  { left: 48, top: 70, size: 8,  duration: 9,  delay: 7,   opacity: 0.11, sage: true  },
  { left: 56, top: 38, size: 5,  duration: 13, delay: 0.5, opacity: 0.10, sage: false },
  { left: 63, top: 88, size: 14, duration: 11, delay: 6,   opacity: 0.13, sage: true  },
  { left: 72, top: 22, size: 7,  duration: 16, delay: 3,   opacity: 0.11, sage: true  },
  { left: 80, top: 55, size: 9,  duration: 10, delay: 8,   opacity: 0.14, sage: false },
  { left: 87, top: 75, size: 6,  duration: 14, delay: 2.5, opacity: 0.10, sage: true  },
  { left: 93, top: 40, size: 11, duration: 12, delay: 5.5, opacity: 0.12, sage: true  },
  { left: 18, top: 50, size: 8,  duration: 9,  delay: 9,   opacity: 0.09, sage: false },
  { left: 44, top: 92, size: 13, duration: 15, delay: 11,  opacity: 0.11, sage: true  },
  { left: 68, top: 18, size: 5,  duration: 11, delay: 4.5, opacity: 0.10, sage: false },
];

export default function FallingLeaves() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {ORBS.map((orb, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${orb.left}%`,
            top: `${orb.top}%`,
            opacity: orb.opacity,
          }}
        >
          <div
            style={{
              width: orb.size,
              height: orb.size,
              borderRadius: "50%",
              backgroundColor: orb.sage
                ? "var(--accent-sage)"
                : "var(--accent-serenity)",
              filter: `blur(${Math.ceil(orb.size * 0.6)}px)`,
              animation: `orb-float ${orb.duration}s ease-in-out ${orb.delay}s infinite`,
            }}
          />
        </div>
      ))}
    </div>
  );
}
