"use client";

import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Accordion } from "@/components/ui/Accordion";
import { Heart, Shield, Zap, Clock, CheckCircle, Star } from "lucide-react";
import { useT } from "@/lib/i18n";

export default function NeurodivergentPage() {
  const { t } = useT();

  const topicItems = t.neurodivergent.topics.map((topic) => ({
    id: topic.id,
    title: topic.title,
    content: <p className="leading-relaxed">{topic.content}</p>,
  }));

  const routineIcons = [
    <Clock className="w-4 h-4" key="morning" />,
    <Star className="w-4 h-4" key="evening" />,
    <Shield className="w-4 h-4" key="overwhelm" />,
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      <div className="mb-10">
        <Badge variant="serenity" className="mb-4">{t.neurodivergent.badge}</Badge>
        <h1 className="text-4xl font-light text-[var(--text-primary)] mb-4 leading-tight">
          {t.neurodivergent.titlePrefix}{" "}
          <em className="not-italic text-[var(--accent-serenity)]">{t.neurodivergent.titleEm}</em>
        </h1>
        <p className="text-xl text-[var(--text-secondary)] font-light leading-relaxed max-w-2xl">
          {t.neurodivergent.intro}
        </p>
      </div>

      {/* Validation cards */}
      <div className="grid sm:grid-cols-3 gap-4 mb-12">
        {t.neurodivergent.cards.map((card, i) => {
          const variants = ["serenity", "sage", "amber"] as const;
          const icons = [
            <Heart className="w-5 h-5" key="heart" />,
            <Shield className="w-5 h-5" key="shield" />,
            <Zap className="w-5 h-5" key="zap" />,
          ];
          const variant = variants[i];
          return (
            <Card key={card.title} variant={variant} padding="md">
              <span className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${
                variant === "serenity" ? "bg-[var(--accent-serenity)] text-white" :
                variant === "sage" ? "bg-[var(--accent-sage)] text-white" :
                "bg-[var(--accent-amber)] text-white"
              }`} aria-hidden>
                {icons[i]}
              </span>
              <h3 className="font-semibold text-[var(--text-primary)] mb-1 text-sm">{card.title}</h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{card.text}</p>
            </Card>
          );
        })}
      </div>

      {/* Topics accordion */}
      <section aria-labelledby="topics-heading" className="mb-12">
        <h2
          id="topics-heading"
          className="text-xl font-semibold text-[var(--text-primary)] mb-5"
        >
          {t.neurodivergent.topicsTitle}
        </h2>
        <Accordion items={topicItems} allowMultiple />
      </section>

      {/* Tiny actions */}
      <section aria-labelledby="tiny-actions-heading" className="mb-12">
        <h2
          id="tiny-actions-heading"
          className="text-xl font-semibold text-[var(--text-primary)] mb-2"
        >
          {t.neurodivergent.tinySoberActionsTitle}
        </h2>
        <p className="text-sm text-[var(--text-muted)] mb-5">
          {t.neurodivergent.tinySoberActionsSubtitle}
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          {t.neurodivergent.tinySoberActions.map((action, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-3 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-soft)]"
            >
              <CheckCircle className="w-4 h-4 text-[var(--accent-sage)] flex-shrink-0 mt-0.5" aria-hidden />
              <span className="text-sm text-[var(--text-secondary)]">{action}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Routine templates */}
      <section aria-labelledby="routines-heading" className="mb-12">
        <h2
          id="routines-heading"
          className="text-xl font-semibold text-[var(--text-primary)] mb-5"
        >
          {t.neurodivergent.routinesTitle}
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {t.neurodivergent.routines.map((routine, i) => (
            <Card key={routine.time} padding="md">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[var(--accent-sage)]" aria-hidden>{routineIcons[i]}</span>
                <h3 className="font-medium text-[var(--text-primary)] text-sm">{routine.time}</h3>
              </div>
              <ol className="space-y-2">
                {routine.items.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-[var(--text-secondary)]">
                    <span className="w-4 h-4 rounded-full bg-[var(--bg-muted)] text-[var(--text-muted)] text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5 font-medium" aria-hidden>
                      {idx + 1}
                    </span>
                    {item}
                  </li>
                ))}
              </ol>
            </Card>
          ))}
        </div>
      </section>

      {/* Meeting preparation */}
      <Card variant="sage" padding="lg" className="mb-8">
        <h2 className="font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
          <Shield className="w-4 h-4" aria-hidden />
          {t.neurodivergent.meetingPrepTitle}
        </h2>
        <p className="text-sm text-[var(--text-secondary)] mb-4">
          {t.neurodivergent.meetingPrepSubtitle}
        </p>
        <div className="grid sm:grid-cols-2 gap-2">
          {t.neurodivergent.meetingPrepItems.map((item, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
              <CheckCircle className="w-3.5 h-3.5 text-[var(--accent-sage)] flex-shrink-0 mt-0.5" aria-hidden />
              {item}
            </div>
          ))}
        </div>
      </Card>

      <div className="text-center space-y-3">
        <p className="text-sm text-[var(--text-muted)]">{t.neurodivergent.closingText}</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/meetings" className="px-6 py-3 rounded-2xl bg-[var(--accent-serenity)] text-white text-sm font-medium hover:opacity-90 transition-calm">
            {t.neurodivergent.findMeeting}
          </Link>
          <Link href="/crisis" className="px-6 py-3 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-soft)] text-[var(--text-primary)] text-sm font-medium hover:bg-[var(--bg-muted)] transition-calm">
            {t.neurodivergent.crisisSupport}
          </Link>
        </div>
      </div>
    </div>
  );
}
