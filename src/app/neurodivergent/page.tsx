import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Accordion } from "@/components/ui/Accordion";
import { NEURODIVERGENT_CONTENT } from "@/lib/recovery-content";
import { Heart, Shield, Zap, Clock, CheckCircle, Star } from "lucide-react";

export const metadata: Metadata = {
  title: "Neurodivergent Recovery",
  description: "Recovery support for autistic people, people with ADHD, and those with sensory sensitivity. Low-demand, compassionate, practical.",
};

export default function NeurodivergentPage() {
  const topicItems = NEURODIVERGENT_CONTENT.topics.map((t) => ({
    id: t.id,
    title: t.title,
    content: <p className="leading-relaxed">{t.content}</p>,
  }));

  const routines = [
    {
      time: "Morning",
      icon: <Clock className="w-4 h-4" />,
      items: [
        "Say the Serenity Prayer (aloud or silently)",
        "Read one sentence of AA literature",
        "Eat something before doing anything else",
        "Set one recovery intention for the day",
      ],
    },
    {
      time: "Evening",
      icon: <Star className="w-4 h-4" />,
      items: [
        "Note three things you are grateful for",
        "Mini inventory: did anything disturb you today?",
        "Text or message your sponsor",
        "Plan your next meeting",
      ],
    },
    {
      time: "Overwhelm Protocol",
      icon: <Shield className="w-4 h-4" />,
      items: [
        "Stop. Sit down if you can.",
        "5-4-3-2-1 grounding (see Prayers page)",
        "Do NOT make any decisions right now",
        "Text one person: 'I'm struggling'",
        "Join the marathon meeting, camera off",
      ],
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      <div className="mb-10">
        <Badge variant="serenity" className="mb-4">Neurodivergent Recovery</Badge>
        <h1 className="text-4xl font-light text-[var(--text-primary)] mb-4 leading-tight">
          Your brain is not{" "}
          <em className="not-italic text-[var(--accent-serenity)]">broken.</em>
        </h1>
        <p className="text-xl text-[var(--text-secondary)] font-light leading-relaxed max-w-2xl">
          {NEURODIVERGENT_CONTENT.intro}
        </p>
      </div>

      {/* Validation cards */}
      <div className="grid sm:grid-cols-3 gap-4 mb-12">
        {[
          {
            icon: <Heart className="w-5 h-5" />,
            title: "Masking is exhausting",
            text: "If you have spent years hiding yourself, you are allowed to be tired. Recovery can be practised authentically.",
            variant: "serenity" as const,
          },
          {
            icon: <Shield className="w-5 h-5" />,
            title: "Sensory needs are valid",
            text: "You do not need to explain or justify your sensory needs at meetings or in recovery. They are real.",
            variant: "sage" as const,
          },
          {
            icon: <Zap className="w-5 h-5" />,
            title: "Tiny steps count",
            text: "Executive dysfunction is real. One small recovery action still counts. You are still doing recovery.",
            variant: "amber" as const,
          },
        ].map((card) => (
          <Card key={card.title} variant={card.variant} padding="md">
            <span className={`
              w-9 h-9 rounded-xl flex items-center justify-center mb-3
              ${card.variant === "serenity" ? "bg-[var(--accent-serenity)] text-white" :
                card.variant === "sage" ? "bg-[var(--accent-sage)] text-white" :
                "bg-[var(--accent-amber)] text-white"}
            `} aria-hidden>
              {card.icon}
            </span>
            <h3 className="font-semibold text-[var(--text-primary)] mb-1 text-sm">{card.title}</h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{card.text}</p>
          </Card>
        ))}
      </div>

      {/* Topics accordion */}
      <section aria-labelledby="topics-heading" className="mb-12">
        <h2
          id="topics-heading"
          className="text-xl font-semibold text-[var(--text-primary)] mb-5"
        >
          Understanding Your Recovery
        </h2>
        <Accordion items={topicItems} allowMultiple />
      </section>

      {/* Tiny actions */}
      <section aria-labelledby="tiny-actions-heading" className="mb-12">
        <h2
          id="tiny-actions-heading"
          className="text-xl font-semibold text-[var(--text-primary)] mb-2"
        >
          Tiny Sober Actions
        </h2>
        <p className="text-sm text-[var(--text-muted)] mb-5">
          When executive function is low. One of these counts as doing recovery today.
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          {NEURODIVERGENT_CONTENT.tinySoberActions.map((action, i) => (
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
          Low-Demand Recovery Routines
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {routines.map((routine) => (
            <Card key={routine.time} padding="md">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[var(--accent-sage)]" aria-hidden>{routine.icon}</span>
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
          Meeting Preparation Checklist
        </h2>
        <p className="text-sm text-[var(--text-secondary)] mb-4">
          Before joining an online meeting:
        </p>
        <div className="grid sm:grid-cols-2 gap-2">
          {[
            "Choose a comfortable, familiar location",
            "Have water or a warm drink nearby",
            "Wear comfortable clothing",
            "Turn camera off if it helps",
            "Keep mute on until/unless you speak",
            "Have headphones if helpful",
            "Remind yourself: you can leave at any time",
            "Prepare a short 'pass' phrase if asked to share",
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
              <CheckCircle className="w-3.5 h-3.5 text-[var(--accent-sage)] flex-shrink-0 mt-0.5" aria-hidden />
              {item}
            </div>
          ))}
        </div>
      </Card>

      <div className="text-center space-y-3">
        <p className="text-sm text-[var(--text-muted)]">
          You are welcome in AA, exactly as you are.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/meetings" className="px-6 py-3 rounded-2xl bg-[var(--accent-serenity)] text-white text-sm font-medium hover:opacity-90 transition-calm">
            Find a meeting
          </Link>
          <Link href="/crisis" className="px-6 py-3 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-soft)] text-[var(--text-primary)] text-sm font-medium hover:bg-[var(--bg-muted)] transition-calm">
            Crisis support
          </Link>
        </div>
      </div>
    </div>
  );
}
