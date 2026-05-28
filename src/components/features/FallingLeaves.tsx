"use client";

const LEAVES = [
  { top: -5,  left: 88, size: 20, duration: 14, delay: 0,   opacity: 0.35, flip: false },
  { top: -5,  left: 94, size: 13, duration: 18, delay: 3.5, opacity: 0.22, flip: true  },
  { top: -5,  left: 80, size: 24, duration: 12, delay: 6,   opacity: 0.4,  flip: false },
  { top: -5,  left: 97, size: 15, duration: 16, delay: 1.5, opacity: 0.28, flip: true  },
  { top: -5,  left: 85, size: 18, duration: 20, delay: 9,   opacity: 0.2,  flip: false },
  { top: -5,  left: 91, size: 11, duration: 13, delay: 4.5, opacity: 0.32, flip: true  },
  { top: -5,  left: 76, size: 16, duration: 17, delay: 7.5, opacity: 0.25, flip: false },
];

function LeafSVG({ size, color }: { size: number; color: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      aria-hidden
    >
      <path d="M17 8C8 10 5.9 16.17 3.82 19.16L5.71 21 6 20c.1-.1 2.06-2.33 5-3.43C13 18 14 19 15 20l1-1c-1-1-2-2.17-2.08-3.83C15.77 14.25 19 13 22 12c-1-2.5-2.5-4.5-5-4z" />
    </svg>
  );
}

export default function FallingLeaves() {
  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden
    >
      {LEAVES.map((leaf, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: `${leaf.top}%`,
            left: `${leaf.left}%`,
            opacity: leaf.opacity,
            transform: leaf.flip ? "scaleX(-1)" : undefined,
            animation: `leaf-fall ${leaf.duration}s ease-in-out ${leaf.delay}s infinite`,
            color: "var(--accent-sage)",
            filter: "blur(0.3px)",
          }}
        >
          <LeafSVG size={leaf.size} color="var(--accent-sage)" />
        </div>
      ))}
    </div>
  );
}
