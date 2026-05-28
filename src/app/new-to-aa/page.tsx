import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Accordion } from "@/components/ui/Accordion";
import { Badge } from "@/components/ui/Badge";
import {
  Heart, Users, BookOpen, Phone, Star, Shield, MessageCircle, Repeat, Eye,
} from "lucide-react";

export const metadata: Metadata = {
  title: "New to AA",
  description: "Everything you need to know about AA, explained gently. No pressure, no judgment, just clear and kind answers.",
};

const faqItems = [
  {
    id: "what-is-aa",
    title: "What is Alcoholics Anonymous?",
    icon: <Users className="w-4 h-4" />,
    content: (
      <div className="space-y-3">
        <p>
          Alcoholics Anonymous is a fellowship of people who share their experience, strength, and hope
          with each other so that they may solve their common problem and help others to recover from alcoholism.
        </p>
        <p>
          There are no fees, no dues, and no requirements to join. The only requirement for membership is a
          desire to stop drinking. You can show up exactly as you are.
        </p>
        <p>
          AA is not a religious organisation, though it is described as spiritual. You define what &ldquo;Higher Power&rdquo; means to you.
          Many atheists and agnostics have long-term sobriety in AA.
        </p>
      </div>
    ),
  },
  {
    id: "what-happens",
    title: "What happens at a meeting?",
    icon: <MessageCircle className="w-4 h-4" />,
    content: (
      <div className="space-y-3">
        <p>
          Meetings are usually 60 minutes long. Someone reads from AA literature to open, then people share
          their experience — how things were when they drank, what happened that got them into AA, and what life is like now.
        </p>
        <p>
          <strong>You never have to speak.</strong> Listening only is completely acceptable. Many people attend
          dozens of meetings before they say a single word. You can pass if asked to share.
        </p>
        <p>
          Online meetings are very similar. Many have cameras off. You can join from your bed if needed.
        </p>
      </div>
    ),
  },
  {
    id: "what-is-sponsorship",
    title: "What is sponsorship?",
    icon: <Heart className="w-4 h-4" />,
    content: (
      <div className="space-y-3">
        <p>
          A sponsor is someone in AA who has worked the 12 Steps and is willing to guide you through them.
          It is a one-to-one relationship, completely private and confidential.
        </p>
        <p>
          You can ask for a sponsor at a meeting, or approach someone whose sharing resonates with you.
          There is no pressure. Many people take time finding the right person.
        </p>
        <p>
          Some people use the group itself as a sponsor when starting out. What matters is that you are
          connected to the programme, not the exact form that takes.
        </p>
      </div>
    ),
  },
  {
    id: "twelve-steps",
    title: "What are the 12 Steps?",
    icon: <Star className="w-4 h-4" />,
    content: (
      <div className="space-y-3">
        <p>
          The 12 Steps are a set of principles and actions that help alcoholics recover. They are not
          mandatory for attendance — you can come to meetings without working steps.
        </p>
        <p>
          The steps involve admitting powerlessness over alcohol, finding a Higher Power you can work with,
          taking a personal inventory, making amends, and continuing to grow spiritually.
        </p>
        <Link
          href="/steps"
          className="inline-flex items-center gap-1 text-sm text-[var(--accent-sage)] hover:opacity-80 transition-calm"
        >
          Read all 12 Steps →
        </Link>
      </div>
    ),
  },
  {
    id: "autistic-aa",
    title: "What if I am autistic or have sensory needs?",
    icon: <Shield className="w-4 h-4" />,
    content: (
      <div className="space-y-3">
        <p>
          Many autistic people are in AA and find it helpful. The structured nature of meetings, the
          predictable format, and the focus on honesty can suit autistic ways of thinking.
        </p>
        <p>
          Online meetings remove many sensory challenges — no fluorescent lights, no crowds, no unexpected
          physical touch. You can keep your camera off and attend from a familiar space.
        </p>
        <p>
          You do not need to explain your sensory needs to anyone. Bring what you need — headphones, a
          fidget, sunglasses. Nobody will ask why.
        </p>
        <Link
          href="/neurodivergent"
          className="inline-flex items-center gap-1 text-sm text-[var(--accent-sage)] hover:opacity-80 transition-calm"
        >
          Neurodivergent recovery guide →
        </Link>
      </div>
    ),
  },
  {
    id: "hate-phone-calls",
    title: "What if I hate phone calls?",
    icon: <Phone className="w-4 h-4" />,
    content: (
      <div className="space-y-3">
        <p>
          That is very common. Many people in AA prefer text messages. You can text your sponsor, or ask
          a sponsor upfront if they are comfortable with texts over calls.
        </p>
        <p>
          Online meetings are available 24/7 with chat functions. You do not have to speak at all.
          Many people connect through message boards and recovery groups online.
        </p>
        <p>
          The connection matters, not the method.
        </p>
      </div>
    ),
  },
  {
    id: "spirituality",
    title: "What if spirituality frightens me?",
    icon: <Eye className="w-4 h-4" />,
    content: (
      <div className="space-y-3">
        <p>
          This is one of the most common concerns for new people, especially those who have been hurt by
          organised religion. The word &ldquo;God&rdquo; in AA is described as &ldquo;as we understood Him&rdquo; — meaning
          you define it completely.
        </p>
        <p>
          Many people use the group itself as their Higher Power. The collective wisdom and support of
          many people staying sober is a real force. Others use nature, the universe, or a simple principle
          of goodness.
        </p>
        <p>
          There are secular AA meetings specifically for people who prefer a non-religious approach.
        </p>
      </div>
    ),
  },
  {
    id: "relapse",
    title: "What if I relapse?",
    icon: <Repeat className="w-4 h-4" />,
    content: (
      <div className="space-y-3">
        <p>
          A relapse does not mean you have failed. It does not erase your sobriety or your progress.
          It does not mean AA does not work for you, or that you are beyond help.
        </p>
        <p>
          Many people in long-term recovery have had relapses. What matters is coming back.
          You are welcome at any meeting, at any time, no matter what happened.
        </p>
        <p>
          The only requirement is a desire to stop drinking. That desire still counts, even after a relapse.
        </p>
      </div>
    ),
  },
  {
    id: "cannot-speak",
    title: "What if I cannot speak in meetings?",
    icon: <MessageCircle className="w-4 h-4" />,
    content: (
      <div className="space-y-3">
        <p>
          You never have to speak. Passing is always acceptable and respected. Simply say &ldquo;I&apos;ll pass, thank you&rdquo;
          and nobody will pressure you.
        </p>
        <p>
          Listening is a valid way to participate. Many people receive enormous benefit simply from hearing
          others share, without ever speaking themselves.
        </p>
        <p>
          If you have a speech-related disability, sensory issue, or anxiety, online meetings with text
          chat functions are available.
        </p>
      </div>
    ),
  },
];

export default function NewToAAPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      <div className="mb-12">
        <Badge variant="sage" className="mb-4">Newcomers</Badge>
        <h1 className="text-4xl font-light text-[var(--text-primary)] mb-4 leading-tight">
          Welcome to{" "}
          <em className="not-italic text-[var(--accent-sage)]">recovery.</em>
        </h1>
        <p className="text-xl text-[var(--text-secondary)] font-light leading-relaxed max-w-2xl">
          You do not need to have it figured out. You do not need to be sure.
          You only need to be here.
        </p>
      </div>

      {/* Gentle intro cards */}
      <div className="grid sm:grid-cols-3 gap-4 mb-12">
        {[
          {
            icon: <Heart className="w-5 h-5" />,
            title: "No Judgement",
            text: "AA is a place of radical acceptance. You are welcome exactly as you are today.",
            variant: "sage" as const,
          },
          {
            icon: <Shield className="w-5 h-5" />,
            title: "No Pressure",
            text: "You never have to speak, share, or do anything you are not ready for.",
            variant: "serenity" as const,
          },
          {
            icon: <BookOpen className="w-5 h-5" />,
            title: "Free Forever",
            text: "No fees, no dues. AA costs nothing. It always will.",
            variant: "amber" as const,
          },
        ].map((card) => (
          <Card key={card.title} variant={card.variant} padding="md">
            <span className={`
              w-9 h-9 rounded-xl flex items-center justify-center mb-3
              ${card.variant === "sage" ? "bg-[var(--accent-sage)] text-white" :
                card.variant === "serenity" ? "bg-[var(--accent-serenity)] text-white" :
                "bg-[var(--accent-amber)] text-white"}
            `} aria-hidden>
              {card.icon}
            </span>
            <h3 className="font-semibold text-[var(--text-primary)] mb-1">{card.title}</h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{card.text}</p>
          </Card>
        ))}
      </div>

      {/* FAQ Accordion */}
      <section aria-labelledby="faq-heading">
        <h2
          id="faq-heading"
          className="text-xl font-semibold text-[var(--text-primary)] mb-6"
        >
          Your questions, answered
        </h2>
        <Accordion items={faqItems} allowMultiple />
      </section>

      {/* UK Starter Pack */}
      <Card variant="sage" padding="lg" className="mt-12">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-2xl bg-[var(--accent-sage)] text-white flex items-center justify-center flex-shrink-0" aria-hidden>
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-[var(--text-primary)] mb-1">UK Starter Pack</h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-3">
              AA UK offers a free starter pack with essential information for newcomers.
              It covers what AA is, how it works, and what to expect.
            </p>
            <a
              href="https://www.alcoholics-anonymous.org.uk/about-aa/newcomers/starter-pack"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--accent-sage)] hover:opacity-80 transition-calm"
            >
              Get the UK Starter Pack ↗
            </a>
          </div>
        </div>
      </Card>

      {/* Next steps */}
      <div className="mt-12 text-center space-y-4">
        <p className="text-[var(--text-muted)] text-sm">Ready to take a next step?</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/meetings"
            className="px-6 py-3 rounded-2xl bg-[var(--accent-sage)] text-white text-sm font-medium hover:opacity-90 transition-calm"
          >
            Find a meeting
          </Link>
          <Link
            href="/literature"
            className="px-6 py-3 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-soft)] text-[var(--text-primary)] text-sm font-medium hover:bg-[var(--bg-muted)] transition-calm"
          >
            Read the Big Book
          </Link>
        </div>
      </div>
    </div>
  );
}
