"use client";

import { Badge } from "@/components/ui/Badge";
import FellowshipSection from "@/components/features/FellowshipSection";
import { useT } from "@/lib/i18n";

export default function FellowshipPage() {
  const { t } = useT();
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
      <div className="mb-10">
        <Badge variant="amber" className="mb-4">{t.fellowship.badge}</Badge>
        <h1 className="text-4xl font-light text-[var(--text-primary)] mb-4 leading-tight">
          {t.fellowship.titlePrefix}{" "}
          <em className="not-italic text-[var(--accent-amber)]">{t.fellowship.titleEm}</em>
        </h1>
        <p className="text-lg text-[var(--text-secondary)] font-light leading-relaxed max-w-2xl">
          {t.fellowship.subtitle}
        </p>
      </div>
      <FellowshipSection />
    </div>
  );
}
