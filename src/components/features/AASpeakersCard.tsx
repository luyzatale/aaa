"use client";

import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Mic, RefreshCw, ExternalLink, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SpeakerEntry } from "@/app/api/xa-speakers/route";

const PAGE_SIZE = 10;

export default function AASpeakersCard() {
  const [speakers, setSpeakers] = useState<SpeakerEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rotating, setRotating] = useState(false);

  useEffect(() => {
    fetch("/api/xa-speakers")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data.speakers)) setSpeakers(data.speakers); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const totalPages = Math.ceil(speakers.length / PAGE_SIZE);
  const visible = speakers.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);
  const globalStart = page * PAGE_SIZE;

  const handleNext = useCallback(() => {
    setRotating(true);
    setTimeout(() => setRotating(false), 600);
    setPage((p) => (p + 1) % totalPages);
  }, [totalPages]);

  return (
    <Card padding="lg" className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[var(--accent-serenity-light)] flex items-center justify-center flex-shrink-0" aria-hidden>
            <Mic className="w-4 h-4 text-[var(--accent-serenity)]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[var(--text-primary)]">AA Speakers</p>
            <p className="text-xs text-[var(--text-muted)]">xa-speakers.org · most downloaded</p>
          </div>
        </div>
        {!loading && totalPages > 1 && (
          <button
            onClick={handleNext}
            aria-label="Next 10 speakers"
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-calm",
              "bg-[var(--bg-muted)] text-[var(--text-secondary)] hover:bg-[var(--border-soft)]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-sage)]"
            )}
          >
            <RefreshCw className={cn("w-3 h-3 transition-transform duration-500", rotating && "rotate-180")} aria-hidden />
            Next 10
          </button>
        )}
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3 animate-pulse">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-5 h-3 bg-[var(--border-soft)] rounded flex-shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 bg-[var(--border-soft)] rounded w-3/4" />
                <div className="h-2.5 bg-[var(--border-soft)] rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <ol className="space-y-2" aria-label="Top AA speakers">
          {visible.map((speaker, i) => (
            <li key={`${speaker.name}-${i}`}>
              <a
                href={speaker.url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-calm group",
                  "hover:bg-[var(--bg-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-sage)]"
                )}
              >
                <span className="text-xs font-bold text-[var(--text-muted)] w-5 text-center flex-shrink-0" aria-hidden>
                  {globalStart + i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--text-primary)] truncate group-hover:text-[var(--accent-serenity)] transition-calm">
                    {speaker.name}
                  </p>
                  {speaker.title && (
                    <p className="text-xs text-[var(--text-muted)] truncate">{speaker.title}</p>
                  )}
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {speaker.downloads > 0 && (
                    <span className="text-xs text-[var(--text-muted)]">
                      {speaker.downloads.toLocaleString()}↓
                    </span>
                  )}
                  <ExternalLink className="w-3 h-3 text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-calm" aria-hidden />
                </div>
              </a>
            </li>
          ))}
        </ol>
      )}

      {/* Footer */}
      <div className="pt-1 border-t border-[var(--border-soft)] flex items-center justify-between">
        <p className="text-xs text-[var(--text-muted)]">
          {!loading && totalPages > 1 && `${page + 1} / ${totalPages} · `}
          Free AA recordings
        </p>
        <a
          href="https://www.xa-speakers.org/pafiledb.php?action=category&id=1&sortby=downloads"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs text-[var(--accent-sage)] hover:opacity-80 transition-calm"
        >
          Browse all <ChevronRight className="w-3 h-3" aria-hidden />
        </a>
      </div>
    </Card>
  );
}
