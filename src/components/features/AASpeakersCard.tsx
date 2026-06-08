import { Card } from "@/components/ui/Card";
import { Mic, ExternalLink } from "lucide-react";

const XA_URL = "https://www.xa-speakers.org";

export default function AASpeakersCard() {
  return (
    <Card padding="lg" className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-2xl bg-[var(--accent-serenity-light)] flex items-center justify-center flex-shrink-0" aria-hidden>
          <Mic className="w-4 h-4 text-[var(--accent-serenity)]" />
        </div>
        <div>
          <p className="text-sm font-semibold text-[var(--text-primary)]">AA Speakers</p>
          <p className="text-xs text-[var(--text-muted)]">Free AA speaker recordings</p>
        </div>
      </div>
      <a
        href={XA_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[var(--accent-serenity-light)] text-[var(--accent-serenity)] text-sm font-medium hover:opacity-80 transition-calm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-serenity)] flex-shrink-0"
      >
        Browse <ExternalLink className="w-3.5 h-3.5" aria-hidden />
      </a>
    </Card>
  );
}
