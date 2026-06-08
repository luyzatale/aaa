"use client";

import { useState, useRef, useEffect } from "react";
import { useAccessibility } from "@/lib/accessibility-context";
import { cn } from "@/lib/utils";
import {
  Moon, Sun, Type, Eye, Zap, BookOpen, Focus, MoonStar, Contrast, SlidersHorizontal, X,
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
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div ref={panelRef} className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-3xl shadow-2xl p-5 w-72 space-y-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-semibold text-[var(--text-primary)]">Reading settings</span>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="w-7 h-7 rounded-xl flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--bg-muted)] transition-calm"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
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
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Reading settings"
        aria-expanded={open}
        className={cn(
          "w-13 h-13 rounded-2xl shadow-lg flex items-center justify-center transition-calm",
          open
            ? "bg-[var(--accent-sage)] text-white"
            : "bg-[var(--bg-card)] border border-[var(--border-soft)] text-[var(--accent-serenity)] hover:bg-[var(--accent-serenity-light)]"
        )}
        style={{ width: "3.25rem", height: "3.25rem" }}
      >
        <SlidersHorizontal className="w-5 h-5" />
      </button>
    </div>
  );
}
