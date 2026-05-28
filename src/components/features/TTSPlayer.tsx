"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Play, Pause, RotateCcw, Volume2, VolumeX, ChevronDown } from "lucide-react";

interface TTSPlayerProps {
  text: string;
  title?: string;
  className?: string;
}

const SPEEDS = [0.75, 1.0, 1.25, 1.5];
const VOICES_PREF = ["Karen", "Samantha", "Victoria", "Daniel", "Moira", "Tessa"];

export default function TTSPlayer({ text, title, className }: TTSPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [speed, setSpeed] = useState(1.0);
  const [progress, setProgress] = useState(0);
  const [available, setAvailable] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const charIndexRef = useRef(0);
  const [showVoices, setShowVoices] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setAvailable(true);
      const loadVoices = () => {
        const v = window.speechSynthesis.getVoices();
        setVoices(v);
        const preferred = v.find((voice) =>
          VOICES_PREF.some((name) => voice.name.includes(name))
        );
        setSelectedVoice(preferred || v[0] || null);
      };
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setPlaying(false);
    setProgress(0);
    charIndexRef.current = 0;
  }, []);

  const speak = useCallback(
    (fromChar = 0) => {
      if (!available) return;
      window.speechSynthesis.cancel();

      const remaining = text.slice(fromChar);
      const utterance = new SpeechSynthesisUtterance(remaining);
      utterance.rate = speed;
      utterance.volume = muted ? 0 : 1;
      if (selectedVoice) utterance.voice = selectedVoice;

      utterance.onboundary = (e) => {
        charIndexRef.current = fromChar + e.charIndex;
        setProgress(charIndexRef.current / text.length);
      };

      utterance.onend = () => {
        setPlaying(false);
        setProgress(1);
      };

      utterance.onerror = () => {
        setPlaying(false);
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
      setPlaying(true);
    },
    [available, text, speed, muted, selectedVoice]
  );

  const togglePlay = () => {
    if (playing) {
      window.speechSynthesis.pause();
      setPlaying(false);
    } else if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setPlaying(true);
    } else {
      speak(progress === 1 ? 0 : charIndexRef.current);
    }
  };

  useEffect(() => {
    return () => window.speechSynthesis?.cancel();
  }, []);

  if (!available) return null;

  return (
    <div
      className={cn(
        "rounded-2xl border border-[var(--border-soft)] bg-[var(--bg-muted)] p-4",
        className
      )}
      role="region"
      aria-label={`Audio player${title ? `: ${title}` : ""}`}
    >
      <div className="flex items-center gap-3">
        <button
          onClick={togglePlay}
          className="w-10 h-10 rounded-full bg-[var(--accent-sage)] text-white flex items-center justify-center hover:opacity-90 transition-calm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-sage)] flex-shrink-0"
          aria-label={playing ? "Pause" : "Play"}
        >
          {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
        </button>

        <div className="flex-1 min-w-0">
          {title && (
            <p className="text-xs font-medium text-[var(--text-secondary)] mb-1 truncate">{title}</p>
          )}
          <div className="relative h-1.5 bg-[var(--border-soft)] rounded-full overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-[var(--accent-sage)] rounded-full transition-all duration-200"
              style={{ width: `${progress * 100}%` }}
              role="progressbar"
              aria-valuenow={Math.round(progress * 100)}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        </div>

        <button
          onClick={stop}
          className="p-2 rounded-xl text-[var(--text-muted)] hover:bg-[var(--border-soft)] transition-calm"
          aria-label="Stop and reset"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => setMuted(!muted)}
          className="p-2 rounded-xl text-[var(--text-muted)] hover:bg-[var(--border-soft)] transition-calm"
          aria-label={muted ? "Unmute" : "Mute"}
        >
          {muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
        </button>
      </div>

      <div className="flex items-center justify-between mt-3 gap-3">
        <div className="flex items-center gap-1">
          {SPEEDS.map((s) => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={cn(
                "px-2.5 py-1 rounded-lg text-xs transition-calm",
                speed === s
                  ? "bg-[var(--accent-sage-light)] text-[var(--accent-sage)] font-medium"
                  : "text-[var(--text-muted)] hover:bg-[var(--border-soft)]"
              )}
              aria-pressed={speed === s}
              aria-label={`Playback speed ${s}x`}
            >
              {s}×
            </button>
          ))}
        </div>

        {voices.length > 1 && (
          <div className="relative">
            <button
              onClick={() => setShowVoices(!showVoices)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs text-[var(--text-muted)] hover:bg-[var(--border-soft)] transition-calm"
              aria-expanded={showVoices}
            >
              Voice
              <ChevronDown className="w-3 h-3" />
            </button>
            {showVoices && (
              <div className="absolute bottom-full right-0 mb-1 w-48 bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl shadow-calm-lg overflow-hidden">
                <div className="max-h-40 overflow-y-auto p-1">
                  {voices.slice(0, 12).map((v) => (
                    <button
                      key={v.name}
                      onClick={() => { setSelectedVoice(v); setShowVoices(false); }}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-xl text-xs transition-calm",
                        selectedVoice?.name === v.name
                          ? "bg-[var(--accent-sage-light)] text-[var(--accent-sage)]"
                          : "text-[var(--text-secondary)] hover:bg-[var(--bg-muted)]"
                      )}
                    >
                      {v.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
