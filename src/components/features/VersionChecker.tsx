"use client";

import { useEffect, useRef, useState } from "react";
import { RefreshCw } from "lucide-react";
import { useT } from "@/lib/i18n";

const POLL_INTERVAL = 3 * 60 * 1000; // 3 minutes

export default function VersionChecker() {
  const { lang } = useT();
  const initialVersion = useRef<string | null>(null);
  const [outdated, setOutdated] = useState(false);

  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch("/api/version", { cache: "no-store" });
        const { version } = await res.json();
        if (initialVersion.current === null) {
          initialVersion.current = version;
        } else if (version !== initialVersion.current) {
          setOutdated(true);
        }
      } catch {}
    };

    check();
    const id = setInterval(check, POLL_INTERVAL);
    return () => clearInterval(id);
  }, []);

  if (!outdated) return null;

  const label = lang === "pt"
    ? "Nova versão disponível"
    : "New version available";
  const btn = lang === "pt" ? "Atualizar" : "Refresh";

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-4 py-3 rounded-2xl shadow-calm-lg bg-[var(--bg-card)] border border-[var(--border-soft)] animate-fade-up">
      <RefreshCw className="w-4 h-4 text-[var(--accent-sage)] flex-shrink-0" aria-hidden />
      <span className="text-sm text-[var(--text-primary)]">{label}</span>
      <button
        onClick={() => window.location.reload()}
        className="px-3 py-1.5 rounded-xl text-xs font-medium bg-[var(--accent-sage)] text-white hover:opacity-90 transition-calm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-sage)]"
      >
        {btn}
      </button>
    </div>
  );
}
