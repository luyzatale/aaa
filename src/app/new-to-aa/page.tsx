"use client";

import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Accordion } from "@/components/ui/Accordion";
import { Badge } from "@/components/ui/Badge";
import {
  Heart, Users, BookOpen, Phone, Star, Shield, MessageCircle, Repeat, Eye,
} from "lucide-react";
import { useT } from "@/lib/i18n";

const FAQ_ICONS: Record<string, React.ReactNode> = {
  "what-is-aa": <Users className="w-4 h-4" />,
  "what-happens": <MessageCircle className="w-4 h-4" />,
  "what-is-sponsorship": <Heart className="w-4 h-4" />,
  "twelve-steps": <Star className="w-4 h-4" />,
  "autistic-aa": <Shield className="w-4 h-4" />,
  "hate-phone-calls": <Phone className="w-4 h-4" />,
  "spirituality": <Eye className="w-4 h-4" />,
  "relapse": <Repeat className="w-4 h-4" />,
  "cannot-speak": <MessageCircle className="w-4 h-4" />,
};

const CARD_ICONS = [
  <Heart className="w-5 h-5" key="heart" />,
  <Shield className="w-5 h-5" key="shield" />,
  <BookOpen className="w-5 h-5" key="book" />,
];

const CARD_VARIANTS = ["sage", "serenity", "amber"] as const;

export default function NewToAAPage() {
  const { t } = useT();

  const faqItems = t.newToAA.faq.map((item) => ({
    id: item.id,
    title: item.title,
    icon: FAQ_ICONS[item.id],
    content: (
      <div className="space-y-3">
        {item.paragraphs.map((para, i) => (
          <p key={i}>
            {i === 0 && item.boldSentence
              ? <><strong>{item.boldSentence}</strong> {para.replace(item.boldSentence, "").trim()}</>
              : para}
          </p>
        ))}
        {item.link && (
          <Link
            href={item.link.href}
            className="inline-flex items-center gap-1 text-sm text-[var(--accent-sage)] hover:opacity-80 transition-calm"
          >
            {item.link.text}
          </Link>
        )}
      </div>
    ),
  }));

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      <div className="mb-12">
        <Badge variant="sage" className="mb-4">{t.newToAA.badge}</Badge>
        <h1 className="text-4xl font-light text-[var(--text-primary)] mb-4 leading-tight">
          {t.newToAA.titlePrefix}{" "}
          <em className="not-italic text-[var(--accent-sage)]">{t.newToAA.titleEm}</em>
        </h1>
        <p className="text-xl text-[var(--text-secondary)] font-light leading-relaxed max-w-2xl">
          {t.newToAA.subtitle}
        </p>
      </div>

      {/* Gentle intro cards */}
      <div className="grid sm:grid-cols-3 gap-4 mb-12">
        {t.newToAA.cards.map((card, i) => {
          const variant = CARD_VARIANTS[i];
          return (
            <Card key={card.title} variant={variant} padding="md">
              <span className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${
                variant === "sage" ? "bg-[var(--accent-sage)] text-white" :
                variant === "serenity" ? "bg-[var(--accent-serenity)] text-white" :
                "bg-[var(--accent-amber)] text-white"
              }`} aria-hidden>
                {CARD_ICONS[i]}
              </span>
              <h3 className="font-semibold text-[var(--text-primary)] mb-1">{card.title}</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{card.text}</p>
            </Card>
          );
        })}
      </div>

      {/* FAQ Accordion */}
      <section aria-labelledby="faq-heading">
        <h2
          id="faq-heading"
          className="text-xl font-semibold text-[var(--text-primary)] mb-6"
        >
          {t.newToAA.faqTitle}
        </h2>
        <Accordion items={faqItems} allowMultiple />
      </section>

      {/* Next steps */}
      <div className="mt-12 text-center space-y-4">
        <p className="text-[var(--text-muted)] text-sm">{t.newToAA.readyNextStep}</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/meetings"
            className="px-6 py-3 rounded-2xl bg-[var(--accent-sage)] text-white text-sm font-medium hover:opacity-90 transition-calm"
          >
            {t.newToAA.findMeeting}
          </Link>
          <Link
            href="/literature"
            className="px-6 py-3 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-soft)] text-[var(--text-primary)] text-sm font-medium hover:bg-[var(--bg-muted)] transition-calm"
          >
            {t.newToAA.readBigBook}
          </Link>
        </div>
      </div>
    </div>
  );
}
