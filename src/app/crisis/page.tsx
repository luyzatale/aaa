import type { Metadata } from "next";
import Link from "next/link";
import BreathingExercise from "@/components/features/BreathingExercise";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  Phone, Video, Heart, Shield, Droplets, Utensils, Moon, Wind, Users
} from "lucide-react";

export const metadata: Metadata = {
  title: "Crisis Support",
  description: "Grounding tools, emergency contacts, and gentle support for moments of crisis. You are not alone.",
};

const helplines = [
  {
    name: "Samaritans",
    number: "116 123",
    tel: "116123",
    desc: "UK. Free. 24/7. For anyone in emotional distress.",
    region: "UK",
  },
  {
    name: "Drinkline",
    number: "0300 123 1110",
    tel: "03001231110",
    desc: "UK. Free. For people worried about their drinking.",
    region: "UK",
  },
  {
    name: "988 Suicide & Crisis Lifeline",
    number: "988",
    tel: "988",
    desc: "US. Free. 24/7. Call or text.",
    region: "US",
  },
  {
    name: "SAMHSA Helpline",
    number: "1-800-662-4357",
    tel: "18006624357",
    desc: "US. Free. 24/7. Substance use support.",
    region: "US",
  },
  {
    name: "Crisis Text Line",
    number: "Text HOME to 741741",
    tel: null,
    desc: "US, UK, CA. Free. For people who prefer text.",
    region: "Text",
  },
];

const urgeSurfingSteps = [
  "Notice the urge without acting on it. Just observe it.",
  "Name it: 'I am having an urge to drink.'",
  "Remember: urges are like waves. They peak and then they pass.",
  "Urges typically last 15-30 minutes if you don't act on them.",
  "Focus on your breathing. You don't have to fight the urge — just ride it.",
  "When the urge passes, note: it passed. It always does.",
];

const delayTechniques = [
  { icon: <Droplets className="w-4 h-4" />, action: "Drink a large glass of cold water" },
  { icon: <Phone className="w-4 h-4" />, action: "Text your sponsor or a recovery contact" },
  { icon: <Video className="w-4 h-4" />, action: "Join the 24/7 marathon AA meeting" },
  { icon: <Moon className="w-4 h-4" />, action: "Lie down and set a 20-minute alarm" },
  { icon: <Utensils className="w-4 h-4" />, action: "Eat something — even just crackers" },
  { icon: <Wind className="w-4 h-4" />, action: "Do 5 minutes of box breathing" },
  { icon: <Heart className="w-4 h-4" />, action: "Read the Serenity Prayer slowly, three times" },
  { icon: <Users className="w-4 h-4" />, action: "Go somewhere safe — a coffee shop, a friend's home" },
];

export default function CrisisPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      <div className="mb-10">
        <Badge variant="serenity" className="mb-4">Crisis Support</Badge>
        <h1 className="text-4xl font-light text-[var(--text-primary)] mb-4 leading-tight">
          You are not alone{" "}
          <em className="not-italic text-[var(--accent-serenity)]">in this moment.</em>
        </h1>
        <p className="text-xl text-[var(--text-secondary)] font-light leading-relaxed max-w-2xl">
          This is not a permanent state. Whatever you are feeling right now
          will change. You have survived difficult moments before.
        </p>
      </div>

      {/* Immediate breathing */}
      <Card variant="serenity" padding="lg" className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Wind className="w-4 h-4 text-[var(--accent-serenity)]" aria-hidden />
          <h2 className="font-semibold text-[var(--text-primary)]">Start Here — Breathe</h2>
        </div>
        <p className="text-sm text-[var(--text-secondary)] mb-4">
          Before anything else. One minute of breathing can change everything.
        </p>
        <BreathingExercise />
      </Card>

      {/* Helplines */}
      <section aria-labelledby="helplines-heading" className="mb-10">
        <h2
          id="helplines-heading"
          className="text-xl font-semibold text-[var(--text-primary)] mb-5"
        >
          Reach Out Now
        </h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {helplines.map((line) => (
            <Card key={line.name} padding="md" className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-medium text-[var(--text-primary)] text-sm">{line.name}</h3>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">{line.desc}</p>
                </div>
                <Badge variant="muted">{line.region}</Badge>
              </div>
              {line.tel ? (
                <a
                  href={`tel:${line.tel}`}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[var(--accent-serenity)] text-white text-sm font-medium hover:opacity-90 transition-calm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-serenity)]"
                  aria-label={`Call ${line.name}: ${line.number}`}
                >
                  <Phone className="w-3.5 h-3.5" aria-hidden />
                  {line.number}
                </a>
              ) : (
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[var(--accent-serenity-light)] text-[var(--accent-serenity)] text-sm font-medium">
                  <Phone className="w-3.5 h-3.5" aria-hidden />
                  {line.number}
                </div>
              )}
            </Card>
          ))}
        </div>
      </section>

      {/* 24/7 meeting */}
      <Card variant="sage" padding="lg" className="mb-10">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-2xl bg-[var(--accent-sage)] text-white flex items-center justify-center flex-shrink-0" aria-hidden>
            <Video className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="font-semibold text-[var(--text-primary)]">24/7 AA Meeting — Available Right Now</h2>
            </div>
            <p className="text-sm text-[var(--text-secondary)] mb-3">
              A continuously running AA meeting. No password. Camera off is fine.
              You can sit and listen. That is all.
            </p>
            <a
              href="https://zoom.us/j/2923712604"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[var(--accent-sage)] text-white text-sm font-medium hover:opacity-90 transition-calm"
            >
              <Video className="w-4 h-4" aria-hidden />
              Join Meeting ID: 2923712604
            </a>
          </div>
        </div>
      </Card>

      {/* Urge surfing */}
      <section aria-labelledby="urge-heading" className="mb-10">
        <h2
          id="urge-heading"
          className="text-xl font-semibold text-[var(--text-primary)] mb-3"
        >
          Urge Surfing
        </h2>
        <p className="text-sm text-[var(--text-muted)] mb-5">
          A craving is not a command. You can feel it without acting on it.
        </p>
        <Card padding="lg">
          <ol className="space-y-3">
            {urgeSurfingSteps.map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[var(--accent-serenity-light)] text-[var(--accent-serenity)] text-xs flex items-center justify-center flex-shrink-0 mt-0.5 font-semibold" aria-hidden>
                  {i + 1}
                </span>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{step}</p>
              </li>
            ))}
          </ol>
        </Card>
      </section>

      {/* Delay techniques */}
      <section aria-labelledby="delay-heading" className="mb-12">
        <h2
          id="delay-heading"
          className="text-xl font-semibold text-[var(--text-primary)] mb-3"
        >
          Delay the Drink
        </h2>
        <p className="text-sm text-[var(--text-muted)] mb-5">
          Do one of these right now. You do not have to do all of them.
          One is enough.
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          {delayTechniques.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-soft)]"
            >
              <span className="text-[var(--accent-sage)] flex-shrink-0" aria-hidden>{item.icon}</span>
              <span className="text-sm text-[var(--text-secondary)]">{item.action}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Grounding reminder */}
      <Card variant="amber" padding="lg" className="mb-8">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-[var(--accent-amber)] flex-shrink-0 mt-0.5" aria-hidden />
          <div>
            <h2 className="font-semibold text-[var(--text-primary)] mb-2">
              If you are having suicidal thoughts
            </h2>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-3">
              Please reach out right now. Samaritans (116 123 in the UK) are available 24 hours
              a day. You can also text HOME to 741741 in the US, UK, and Canada.
              You do not have to be in immediate danger to call. Feeling this way is reason enough.
            </p>
            <a
              href="tel:116123"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[var(--accent-amber)] text-white text-sm font-medium hover:opacity-90 transition-calm"
            >
              <Phone className="w-4 h-4" aria-hidden />
              Call 116 123 now
            </a>
          </div>
        </div>
      </Card>

      <div className="text-center">
        <p className="text-sm text-[var(--text-muted)] mb-4">
          This moment will pass. You have handled difficult moments before.
        </p>
        <Link
          href="/prayers"
          className="text-sm text-[var(--accent-serenity)] hover:opacity-80 transition-calm"
        >
          Read the Serenity Prayer →
        </Link>
      </div>
    </div>
  );
}
