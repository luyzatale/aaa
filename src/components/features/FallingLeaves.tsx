"use client";

type Leaf = {
  left: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
  shape: 0 | 1 | 2;
  anim: "a" | "b" | "c";
  flip: boolean;
};

const LEAVES: Leaf[] = [
  { left:  4, size: 18, duration: 14, delay: 0,    opacity: 0.42, shape: 0, anim: "a", flip: false },
  { left: 12, size: 13, duration: 19, delay: 3.5,  opacity: 0.33, shape: 1, anim: "b", flip: true  },
  { left: 22, size: 22, duration: 12, delay: 7,    opacity: 0.46, shape: 2, anim: "a", flip: false },
  { left: 32, size: 15, duration: 17, delay: 1.5,  opacity: 0.36, shape: 0, anim: "c", flip: true  },
  { left: 42, size: 20, duration: 15, delay: 5,    opacity: 0.40, shape: 1, anim: "b", flip: false },
  { left: 51, size: 12, duration: 20, delay: 9.5,  opacity: 0.30, shape: 2, anim: "c", flip: true  },
  { left: 60, size: 24, duration: 13, delay: 2,    opacity: 0.44, shape: 0, anim: "a", flip: false },
  { left: 69, size: 16, duration: 18, delay: 6.5,  opacity: 0.37, shape: 1, anim: "b", flip: true  },
  { left: 78, size: 19, duration: 11, delay: 4,    opacity: 0.43, shape: 2, anim: "c", flip: false },
  { left: 86, size: 14, duration: 16, delay: 10,   opacity: 0.32, shape: 0, anim: "a", flip: true  },
  { left: 93, size: 17, duration: 14, delay: 8,    opacity: 0.38, shape: 1, anim: "b", flip: false },
  { left: 17, size: 21, duration: 17, delay: 12.5, opacity: 0.35, shape: 2, anim: "c", flip: true  },
  { left: 38, size: 11, duration: 13, delay: 0.5,  opacity: 0.29, shape: 0, anim: "b", flip: false },
  { left: 56, size: 16, duration: 19, delay: 14,   opacity: 0.34, shape: 1, anim: "a", flip: true  },
];

const PATHS = [
  // Rounded teardrop leaf
  "M12 3C8 3 4 6.5 4 11c0 5 8 10 8 10s8-5 8-10c0-4.5-4-8-8-8z",
  // Classic pointed leaf
  "M12 2C7 4 3 8 3 13c0 4 3.5 6.5 9 9 5.5-2.5 9-5 9-9 0-5-4-9-9-11z",
  // Elongated slim leaf
  "M12 1C9 4 5 8 5 13s4 8 7 10c3-2 7-5 7-10S15 4 12 1z",
];

function LeafSVG({ size, shape }: { size: number; shape: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="var(--accent-sage)" aria-hidden>
      <path d={PATHS[shape]} />
    </svg>
  );
}

export default function FallingLeaves() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {LEAVES.map((leaf, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: "-5%",
            left: `${leaf.left}%`,
            opacity: leaf.opacity,
            transform: leaf.flip ? "scaleX(-1)" : undefined,
            animation: `leaf-fall-${leaf.anim} ${leaf.duration}s ease-in-out ${leaf.delay}s infinite`,
            filter: "blur(0.4px)",
          }}
        >
          <LeafSVG size={leaf.size} shape={leaf.shape} />
        </div>
      ))}
    </div>
  );
}
