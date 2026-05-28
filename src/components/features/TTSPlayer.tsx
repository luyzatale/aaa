"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Play, Pause, RotateCcw, Volume2, VolumeX, Loader2 } from "lucide-react";

interface TTSPlayerProps {
  text: string;
  title?: string;
  className?: string;
}

const SPEEDS = [0.75, 1.0, 1.25, 1.5];

export default function TTSPlayer({ text, title, className }: TTSPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [muted, setMuted] = useState(false);
  const [speed, setSpeed] = useState(0.75);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const blobUrlRef = useRef<string | null>(null);

  const cleanup = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
    }
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = null;
    }
  }, []);

  useEffect(() => () => cleanup(), [cleanup]);

  const stop = useCallback(() => {
    cleanup();
    setPlaying(false);
    setProgress(0);
  }, [cleanup]);

  const loadAndPlay = useCallback(async () => {
    setLoading(true);
    cleanup();
    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error(`TTS ${res.status}`);

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      blobUrlRef.current = url;

      const audio = new Audio(url);
      audio.playbackRate = speed;
      audio.muted = muted;
      audioRef.current = audio;

      audio.addEventListener("timeupdate", () => {
        if (audio.duration) setProgress(audio.currentTime / audio.duration);
      });
      audio.addEventListener("ended", () => {
        setPlaying(false);
        setProgress(1);
      });
      audio.addEventListener("error", () => {
        setPlaying(false);
        setLoading(false);
      });

      await audio.play();
      setPlaying(true);
    } catch (e) {
      console.error("TTS error:", e);
      setPlaying(false);
    } finally {
      setLoading(false);
    }
  }, [text, speed, muted, cleanup]);

  const togglePlay = async () => {
    if (loading) return;
    if (playing) {
      audioRef.current?.pause();
      setPlaying(false);
    } else if (audioRef.current?.src && progress < 1 && progress > 0) {
      audioRef.current.playbackRate = speed;
      await audioRef.current.play();
      setPlaying(true);
    } else {
      setProgress(0);
      await loadAndPlay();
    }
  };

  const changeSpeed = (s: number) => {
    setSpeed(s);
    if (audioRef.current) audioRef.current.playbackRate = s;
  };

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    if (audioRef.current) audioRef.current.muted = next;
  };

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
          disabled={loading}
          className="w-10 h-10 rounded-full bg-[var(--accent-sage)] text-white flex items-center justify-center hover:opacity-90 transition-calm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-sage)] flex-shrink-0 disabled:opacity-60"
          aria-label={loading ? "Loading audio" : playing ? "Pause" : "Play"}
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : playing ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4 ml-0.5" />
          )}
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
          onClick={toggleMute}
          className="p-2 rounded-xl text-[var(--text-muted)] hover:bg-[var(--border-soft)] transition-calm"
          aria-label={muted ? "Unmute" : "Mute"}
        >
          {muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
        </button>
      </div>

      <div className="flex items-center mt-3 gap-1">
        {SPEEDS.map((s) => (
          <button
            key={s}
            onClick={() => changeSpeed(s)}
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
        <span className="ml-auto text-xs text-[var(--text-muted)]">en-US · WaveNet-D</span>
      </div>
    </div>
  );
}
