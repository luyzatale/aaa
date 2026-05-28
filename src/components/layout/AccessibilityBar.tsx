"use client";

import { useState } from "react";
import { useAccessibility } from "@/lib/accessibility-context";
import { cn } from "@/lib/utils";
import {
  Moon, Sun, Type, Eye, Zap, BookOpen, Focus, SlidersHorizontal, X, MoonStar, Contrast,
} from "lucide-react";

export default function AccessibilityBar() {
  const [open, setOpen] = useState(false);
  const a11y = useAccessibility();

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-1.5">
        <button
          onClick={() => setOpen(true)}
          className={cn(
            "w-12 h-12 rounded-full shadow-calm-lg",
            "bg-[var(--bg-card)] border border-[var(--border-soft)]",
            "flex items-center justify-center text-[var(--text-secondary)]",
            "hover:bg-[var(--bg-muted)] transition-calm",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-sage)]"
          )}
          aria-label="Reading with neurodivergent needs"
          aria-expanded={open}
        >
          <SlidersHorizontal className="w-5 h-5" />
        </button>
        <span className="text-[10px] text-[var(--text-muted)] font-medium whitespace-nowrap leading-tight text-center max-w-[72px]">
          Neurodivergent needs
        </span>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
          role="dialog"
          aria-label="Accessibility options"
          aria-modal="true"
        >
          <button
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-label="Close accessibility panel"
          />
          <div className={cn(
            "relative z-10 w-full max-w-sm mx-4 mb-4 sm:mb-0",
            "bg-[var(--bg-card)] border border-[var(--border-soft)]",
            "rounded-3xl shadow-calm-lg p-6 space-y-4",
            "animate-fade-up"
          )}>
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-[var(--text-primary)]">Accessibility</h2>
              <button
                onClick={() => setOpen(false)}
                className="p-2 rounded-xl hover:bg-[var(--bg-muted)] text-[var(--text-muted)] transition-calm"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <A11yToggle
                icon={a11y.darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                label={a11y.darkMode ? "Light Mode" : "Dark Mode"}
                active={a11y.darkMode}
                onToggle={a11y.toggleDarkMode}
              />
              <A11yToggle
                icon={<MoonStar className="w-4 h-4" />}
                label="Night Mode"
                active={a11y.nightMode}
                onToggle={a11y.toggleNightMode}
              />
              <A11yToggle
                icon={<BookOpen className="w-4 h-4" />}
                label="Dyslexia Font"
                active={a11y.dyslexiaMode}
                onToggle={a11y.toggleDyslexiaMode}
              />
              <A11yToggle
                icon={<Zap className="w-4 h-4" />}
                label="Reduce Motion"
                active={a11y.reduceMotion}
                onToggle={a11y.toggleReduceMotion}
              />
              <A11yToggle
                icon={<Eye className="w-4 h-4" />}
                label="Calm Mode"
                active={a11y.calmMode}
                onToggle={a11y.toggleCalmMode}
              />
              <A11yToggle
                icon={<Focus className="w-4 h-4" />}
                label="Focus Mode"
                active={a11y.focusMode}
                onToggle={a11y.toggleFocusMode}
              />
              <A11yToggle
                icon={<Contrast className="w-4 h-4" />}
                label="High Contrast"
                active={a11y.highContrast}
                onToggle={a11y.toggleHighContrast}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">
                Text Size
              </label>
              <div className="flex gap-2">
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
          </div>
        </div>
      )}
    </>
  );
}

function A11yToggle({ icon, label, active, onToggle }: {
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
