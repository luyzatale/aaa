"use client";

import { useAccessibility } from "@/lib/accessibility-context";
import { cn } from "@/lib/utils";
import {
  Moon, Sun, Type, Eye, Zap, BookOpen, Focus, MoonStar, Contrast, SlidersHorizontal,
} from "lucide-react";

function Toggle({ icon, label, active, onToggle }: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      role="switch"
      aria-checked={active}
      className={cn(
        "flex items-center gap-2 p-3 rounded-2xl border text-sm font-medium transition-calm w-full",
        active
          ? "bg-[var(--accent-sage-light)] border-[var(--accent-sage)]/20 text-[var(--accent-sage)]"
          : "bg-[var(--bg-secondary)] border-[var(--border-soft)] text-[var(--text-secondary)] hover:bg-[var(--bg-muted)]"
      )}
    >
      <span aria-hidden>{icon}</span>
      <span className="text-xs">{label}</span>
    </button>
  );
}

export default function NeurodivergentReadingPanel() {
  const a11y = useAccessibility();

  return (
    <section aria-labelledby="nd-reading-heading" className="px-4 sm:px-6 pb-20 max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-2xl bg-[var(--accent-serenity-light)] flex items-center justify-center flex-shrink-0" aria-hidden>
          <SlidersHorizontal className="w-4 h-4 text-[var(--accent-serenity)]" />
        </div>
        <div>
          <h2 id="nd-reading-heading" className="text-lg font-semibold text-[var(--text-primary)]">
            Reading with neurodivergent needs
          </h2>
          <p className="text-sm text-[var(--text-muted)]">
            Adjust how this site looks and feels for you.
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <Toggle
          icon={a11y.darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          label={a11y.darkMode ? "Light Mode" : "Dark Mode"}
          active={a11y.darkMode}
          onToggle={a11y.toggleDarkMode}
        />
        <Toggle
          icon={<MoonStar className="w-4 h-4" />}
          label="Night Mode"
          active={a11y.nightMode}
          onToggle={a11y.toggleNightMode}
        />
        <Toggle
          icon={<BookOpen className="w-4 h-4" />}
          label="Dyslexia Font"
          active={a11y.dyslexiaMode}
          onToggle={a11y.toggleDyslexiaMode}
        />
        <Toggle
          icon={<Zap className="w-4 h-4" />}
          label="Reduce Motion"
          active={a11y.reduceMotion}
          onToggle={a11y.toggleReduceMotion}
        />
        <Toggle
          icon={<Eye className="w-4 h-4" />}
          label="Calm Mode"
          active={a11y.calmMode}
          onToggle={a11y.toggleCalmMode}
        />
        <Toggle
          icon={<Focus className="w-4 h-4" />}
          label="Focus Mode"
          active={a11y.focusMode}
          onToggle={a11y.toggleFocusMode}
        />
        <Toggle
          icon={<Contrast className="w-4 h-4" />}
          label="High Contrast"
          active={a11y.highContrast}
          onToggle={a11y.toggleHighContrast}
        />
      </div>

      <div className="space-y-2">
        <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">Text Size</p>
        <div className="flex gap-2 max-w-xs">
          {(["normal", "large", "xl"] as const).map((size) => (
            <button
              key={size}
              onClick={() => a11y.setTextSize(size)}
              className={cn(
                "flex-1 py-2 px-3 rounded-xl text-sm border transition-calm",
                a11y.textSize === size
                  ? "bg-[var(--accent-sage)] text-white border-transparent"
                  : "bg-[var(--bg-secondary)] border-[var(--border-soft)] text-[var(--text-secondary)] hover:bg-[var(--bg-muted)]"
              )}
            >
              <Type className={cn("mx-auto", size === "normal" ? "w-3 h-3" : size === "large" ? "w-4 h-4" : "w-5 h-5")} />
              <span className="block text-xs mt-0.5">{size === "normal" ? "A" : size === "large" ? "AA" : "AAA"}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
