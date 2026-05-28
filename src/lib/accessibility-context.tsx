"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

interface AccessibilityState {
  darkMode: boolean;
  nightMode: boolean;
  dyslexiaMode: boolean;
  largeText: boolean;
  extraLargeText: boolean;
  reduceMotion: boolean;
  highContrast: boolean;
  calmMode: boolean;
  focusMode: boolean;
  readingRuler: boolean;
  overwhelmed: boolean;
  textSize: "normal" | "large" | "xl";
}

interface AccessibilityActions {
  toggleDarkMode: () => void;
  toggleNightMode: () => void;
  toggleDyslexiaMode: () => void;
  toggleReduceMotion: () => void;
  toggleHighContrast: () => void;
  toggleCalmMode: () => void;
  toggleFocusMode: () => void;
  toggleReadingRuler: () => void;
  setOverwhelmed: (v: boolean) => void;
  setTextSize: (size: "normal" | "large" | "xl") => void;
}

const defaultState: AccessibilityState = {
  darkMode: false,
  nightMode: false,
  dyslexiaMode: false,
  largeText: false,
  extraLargeText: false,
  reduceMotion: false,
  highContrast: false,
  calmMode: false,
  focusMode: false,
  readingRuler: false,
  overwhelmed: false,
  textSize: "normal",
};

const AccessibilityContext = createContext<AccessibilityState & AccessibilityActions>({
  ...defaultState,
  toggleDarkMode: () => {},
  toggleNightMode: () => {},
  toggleDyslexiaMode: () => {},
  toggleReduceMotion: () => {},
  toggleHighContrast: () => {},
  toggleCalmMode: () => {},
  toggleFocusMode: () => {},
  toggleReadingRuler: () => {},
  setOverwhelmed: () => {},
  setTextSize: () => {},
});

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AccessibilityState>(defaultState);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("aa-accessibility");
      if (saved) {
        const parsed = JSON.parse(saved);
        setState((prev) => ({ ...prev, ...parsed, overwhelmed: false }));
      }
    } catch {}

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (prefersReducedMotion || prefersDark) {
      setState((prev) => ({
        ...prev,
        reduceMotion: prev.reduceMotion || prefersReducedMotion,
        darkMode: prev.darkMode || prefersDark,
      }));
    }
  }, []);

  useEffect(() => {
    const { darkMode, nightMode, dyslexiaMode, largeText, extraLargeText, reduceMotion, highContrast, calmMode, focusMode, readingRuler } = state;
    const root = document.documentElement;
    const body = document.body;

    root.classList.toggle("dark", darkMode);
    root.classList.toggle("night-mode", nightMode);
    body.classList.toggle("dyslexia-mode", dyslexiaMode);
    body.classList.toggle("large-text", largeText);
    body.classList.toggle("extra-large-text", extraLargeText);
    body.classList.toggle("reduce-motion", reduceMotion);
    body.classList.toggle("high-contrast", highContrast);
    body.classList.toggle("calm-mode", calmMode);
    body.classList.toggle("focus-mode", focusMode);
    body.classList.toggle("reading-ruler-active", readingRuler);

    try {
      const { overwhelmed: _o, ...toSave } = state;
      localStorage.setItem("aa-accessibility", JSON.stringify(toSave));
    } catch {}
  }, [state]);

  const toggle = useCallback((key: keyof AccessibilityState) => {
    setState((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const value = {
    ...state,
    toggleDarkMode: () => toggle("darkMode"),
    toggleNightMode: () => setState((p) => ({ ...p, nightMode: !p.nightMode, darkMode: !p.nightMode ? true : p.darkMode })),
    toggleDyslexiaMode: () => toggle("dyslexiaMode"),
    toggleReduceMotion: () => toggle("reduceMotion"),
    toggleHighContrast: () => toggle("highContrast"),
    toggleCalmMode: () => toggle("calmMode"),
    toggleFocusMode: () => toggle("focusMode"),
    toggleReadingRuler: () => toggle("readingRuler"),
    setOverwhelmed: (v: boolean) => setState((p) => ({ ...p, overwhelmed: v })),
    setTextSize: (size: "normal" | "large" | "xl") =>
      setState((p) => ({
        ...p,
        textSize: size,
        largeText: size === "large",
        extraLargeText: size === "xl",
      })),
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  return useContext(AccessibilityContext);
}
