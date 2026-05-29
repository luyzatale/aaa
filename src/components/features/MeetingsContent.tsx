"use client";

import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Users, Video, Globe, Heart, Clock, Shield, ChevronRight, Info, ExternalLink } from "lucide-react";
import { useT } from "@/lib/i18n";

interface AANLMeeting {
  id: number;
  name: string;
  day: number;
  time: string;
  end_time: string;
  conference_url: string;
  conference_url_notes?: string;
  notes?: string;
  types: string[];
  attendance_option: string;
}

const TYPE_LABELS: Record<string, string> = {
  O: "Open", C: "Gesloten", EN: "English", NL: "NL",
  W: "Vrouwen", B: "Beginners", SP: "Speaker", "12x12": "12×12", TPC: "Thema",
};
const SKIP_TYPES = new Set(["ONL", "RGNW", "RGZ", "RGZW"]);
const DAY_NAMES = ["Zondag", "Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag", "Zaterdag"];

function cleanName(name: string) {
  return name.replace(new RegExp(` - (${DAY_NAMES.join("|")})$`, "i"), "").trim();
}

const ONLINE_MEETING_URLS: Record<string, string> = {
  "in-the-rooms": "https://www.intherooms.com",
  "aa-uk-online": "https://www.alcoholics-anonymous.org.uk/find-a-meeting",
  "aa-online": "https://www.aa-intergroup.org/meetings",
  "aa-brazil": "https://www.aa.org.br/virtual/",
};

const ONLINE_MEETING_TAGS: Record<string, string[]> = {
  "in-the-rooms": ["Free", "Many types", "Global"],
  "aa-uk-online": ["UK", "Official", "Beginner"],
  "aa-online": ["Global", "Secular", "LGBTQ+"],
  "aa-brazil": ["Brasil", "Português", "Official"],
};

const MEETING_TYPE_ICONS = [
  <Users className="w-4 h-4" key="users" />,
  <Shield className="w-4 h-4" key="shield" />,
  <Heart className="w-4 h-4" key="heart" />,
  <ChevronRight className="w-4 h-4" key="chevron" />,
  <Globe className="w-4 h-4" key="globe" />,
  <Clock className="w-4 h-4" key="clock" />,
];

interface Props {
  nlMeetings: AANLMeeting[];
  todayNLMeetings: AANLMeeting[];
  todayDayName: string;
}

export default function MeetingsContent({ nlMeetings, todayNLMeetings, todayDayName }: Props) {
  const { t } = useT();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
      <div className="mb-10">
        <Badge variant="sage" className="mb-4">{t.meetings.badge}</Badge>
        <h1 className="text-4xl font-light text-[var(--text-primary)] mb-4 leading-tight">
          {t.meetings.titlePrefix}{" "}
          <em className="not-italic text-[var(--accent-sage)]">{t.meetings.titleEm}</em>
        </h1>
        <p className="text-lg text-[var(--text-secondary)] font-light leading-relaxed max-w-2xl">
          {t.meetings.subtitle}
        </p>
      </div>

      {/* Anxiety guide */}
      <Card variant="serenity" padding="lg" className="mb-10">
        <div className="flex items-start gap-3 mb-4">
          <Shield className="w-5 h-5 text-[var(--accent-serenity)] flex-shrink-0 mt-0.5" aria-hidden />
          <div>
            <h2 className="font-semibold text-[var(--text-primary)] mb-1">
              {t.meetings.anxietyTitle}
            </h2>
            <p className="text-sm text-[var(--text-secondary)]">
              {t.meetings.anxietySubtitle}
            </p>
          </div>
        </div>
        <ul className="space-y-2" aria-label="Meeting anxiety reassurances">
          {t.meetings.anxietyItems.map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-[var(--text-secondary)]">
              <span className="w-5 h-5 rounded-full bg-[var(--accent-serenity-light)] text-[var(--accent-serenity)] text-xs flex items-center justify-center flex-shrink-0 mt-0.5 font-medium" aria-hidden>
                {i + 1}
              </span>
              {item}
            </li>
          ))}
        </ul>
      </Card>

      {/* 24/7 Marathon Meeting - highlighted */}
      <Card variant="sage" padding="lg" className="mb-8">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-[var(--accent-sage)] text-white flex items-center justify-center flex-shrink-0" aria-hidden>
            <Video className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h2 className="font-semibold text-[var(--text-primary)]">{t.meetings.marathonTitle}</h2>
              <span className="px-2 py-0.5 rounded-full bg-[var(--accent-sage)] text-white text-xs font-medium">
                {t.meetings.liveNow}
              </span>
            </div>
            <p className="text-sm text-[var(--text-secondary)]">
              {t.meetings.marathonDesc}
            </p>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-3 mb-4 text-sm">
          <div className="bg-[var(--bg-card)] rounded-2xl p-3">
            <span className="text-xs text-[var(--text-muted)] uppercase tracking-wide block mb-1">{t.meetings.meetingIdLabel}</span>
            <span className="font-mono font-medium text-[var(--text-primary)]">2923712604</span>
          </div>
          <div className="bg-[var(--bg-card)] rounded-2xl p-3">
            <span className="text-xs text-[var(--text-muted)] uppercase tracking-wide block mb-1">{t.meetings.passwordLabel}</span>
            <span className="text-[var(--accent-sage)] font-medium">{t.meetings.noPasswordNeeded}</span>
          </div>
        </div>
        <a
          href="https://zoom.us/j/2923712604"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[var(--accent-sage)] text-white text-sm font-medium hover:opacity-90 transition-calm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-sage)]"
        >
          <Video className="w-4 h-4" aria-hidden />
          {t.meetings.joinNow}
        </a>
      </Card>

      {/* The Sunrise Serenity Group */}
      <Card padding="md" className="mb-8 space-y-3">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-lg font-light text-[var(--accent-sage)] tabular-nums">07:30</span>
            <Badge variant="muted">Open</Badge>
            <Badge variant="muted">EN</Badge>
          </div>
          <h3 className="font-medium text-[var(--text-primary)] text-sm leading-snug">
            The Sunrise Serenity Group
          </h3>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">tot 08:30 · Every day</p>
        </div>
        <div className="flex items-start gap-2 text-xs text-[var(--text-muted)] bg-[var(--bg-muted)] rounded-xl p-2.5">
          <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" aria-hidden />
          <span>MeetingID: 9769709597 - Pass: 081152</span>
        </div>
        <a
          href="https://zoom.us/j/9769709597"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl
            bg-[var(--accent-sage-light)] text-[var(--accent-sage)] text-sm font-medium
            hover:bg-[var(--accent-sage)]/20 transition-calm
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-sage)]"
        >
          <Video className="w-3.5 h-3.5" aria-hidden />
          Deelnemen via Zoom
        </a>
      </Card>

      {/* AA Nederland Online Meetings – Today */}
      {nlMeetings.length > 0 && (
        <section aria-labelledby="aa-nl-heading" className="mb-12">
          <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
            <div>
              <h2
                id="aa-nl-heading"
                className="text-xl font-semibold text-[var(--text-primary)]"
              >
                AA Nederland Online — {todayDayName}
              </h2>
              <p className="text-sm text-[var(--text-secondary)] mt-1">
                Live online meetings via Zoom, direct vanuit Nederland.
              </p>
            </div>
            <a
              href="https://aa-nederland.nl/vind-een-meeting/#/?type=ONL"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-[var(--accent-sage)] hover:opacity-80 transition-calm"
            >
              Alle dagen <ExternalLink className="w-3.5 h-3.5" aria-hidden />
            </a>
          </div>

          {todayNLMeetings.length === 0 ? (
            <Card padding="md" className="text-center text-sm text-[var(--text-muted)] py-8">
              Geen online meetings vandaag gepland.{" "}
              <a
                href="https://aa-nederland.nl/vind-een-meeting/#/?type=ONL"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--accent-sage)] underline underline-offset-2"
              >
                Bekijk de volledige agenda →
              </a>
            </Card>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {todayNLMeetings.map((meeting) => {
                const visibleTypes = meeting.types.filter(
                  (tp) => !SKIP_TYPES.has(tp) && TYPE_LABELS[tp]
                );
                return (
                  <Card key={meeting.id} padding="md" className="space-y-3">
                    <div>
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="text-lg font-light text-[var(--accent-sage)] tabular-nums">
                          {meeting.time}
                        </span>
                        {visibleTypes.map((tp) => (
                          <Badge key={tp} variant="muted">{TYPE_LABELS[tp]}</Badge>
                        ))}
                      </div>
                      <h3 className="font-medium text-[var(--text-primary)] text-sm leading-snug">
                        {cleanName(meeting.name)}
                      </h3>
                      {meeting.end_time && (
                        <p className="text-xs text-[var(--text-muted)] mt-0.5">
                          tot {meeting.end_time}
                        </p>
                      )}
                    </div>
                    {(meeting.conference_url_notes || meeting.notes) && (
                      <div className="flex items-start gap-2 text-xs text-[var(--text-muted)] bg-[var(--bg-muted)] rounded-xl p-2.5">
                        <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" aria-hidden />
                        <span>{meeting.conference_url_notes ?? meeting.notes}</span>
                      </div>
                    )}
                    <a
                      href={meeting.conference_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl
                        bg-[var(--accent-sage-light)] text-[var(--accent-sage)] text-sm font-medium
                        hover:bg-[var(--accent-sage)]/20 transition-calm
                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-sage)]"
                    >
                      <Video className="w-3.5 h-3.5" aria-hidden />
                      Deelnemen via Zoom
                    </a>
                  </Card>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* AAA Meetings – autism-friendly */}
      <section aria-labelledby="aaa-meetings-heading" className="mb-12">
        <div className="mb-5">
          <h2
            id="aaa-meetings-heading"
            className="text-xl font-semibold text-[var(--text-primary)]"
          >
            {t.meetings.aaaMeetingsTitle}
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            {t.meetings.aaaMeetingsSubtitle}
          </p>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {/* Autism And AA – daily */}
          <Card padding="md" className="space-y-3">
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="text-lg font-light text-[var(--accent-sage)] tabular-nums">17:00</span>
                <Badge variant="muted">Open</Badge>
                <Badge variant="muted">EN</Badge>
                <Badge variant="muted">Every day</Badge>
              </div>
              <h3 className="font-medium text-[var(--text-primary)] text-sm leading-snug">Autism And AA</h3>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">4:00pm GMT · 12:00pm EST · 2:00am AEST</p>
            </div>
            <div className="flex items-start gap-2 text-xs text-[var(--text-muted)] bg-[var(--bg-muted)] rounded-xl p-2.5">
              <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" aria-hidden />
              <span>MeetingID: 636 252 1979 · Pass: AA · Topic discussion open meeting for anyone interested in the Autistic view of AA.</span>
            </div>
            <a
              href="https://zoom.us/j/6362521979"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl
                bg-[var(--accent-sage-light)] text-[var(--accent-sage)] text-sm font-medium
                hover:bg-[var(--accent-sage)]/20 transition-calm
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-sage)]"
            >
              <Video className="w-3.5 h-3.5" aria-hidden />
              Join via Zoom
            </a>
          </Card>

          {/* Autism Friendly AA – Tuesday */}
          <Card padding="md" className="space-y-3">
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="text-lg font-light text-[var(--accent-sage)] tabular-nums">01:00</span>
                <Badge variant="muted">Open</Badge>
                <Badge variant="muted">EN</Badge>
                <Badge variant="muted">Tuesday</Badge>
              </div>
              <h3 className="font-medium text-[var(--text-primary)] text-sm leading-snug">Autism Friendly AA</h3>
            </div>
            <div className="flex items-start gap-2 text-xs text-[var(--text-muted)] bg-[var(--bg-muted)] rounded-xl p-2.5">
              <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" aria-hidden />
              <span>MeetingID: 883 9894 0113 · Pass: Email us · A Neurodiversity affirming and accommodating weekly open topic AA meeting.</span>
            </div>
            <a
              href="https://zoom.us/j/88398940113"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl
                bg-[var(--accent-sage-light)] text-[var(--accent-sage)] text-sm font-medium
                hover:bg-[var(--accent-sage)]/20 transition-calm
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-sage)]"
            >
              <Video className="w-3.5 h-3.5" aria-hidden />
              Join via Zoom
            </a>
          </Card>
        </div>
      </section>

      {/* Other online meetings */}
      <section aria-labelledby="online-meetings-heading" className="mb-12">
        <h2
          id="online-meetings-heading"
          className="text-xl font-semibold text-[var(--text-primary)] mb-5"
        >
          {t.meetings.moreOnlineMeetings}
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {t.meetings.onlineMeetings.map((meeting) => (
            <Card key={meeting.id} padding="md" className="space-y-3">
              <div>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {(ONLINE_MEETING_TAGS[meeting.id] ?? []).map((tag) => (
                    <Badge key={tag} variant="muted">{tag}</Badge>
                  ))}
                </div>
                <h3 className="font-medium text-[var(--text-primary)] mb-1">{meeting.name}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{meeting.description}</p>
              </div>
              {meeting.notes && (
                <div className="flex items-start gap-2 text-xs text-[var(--text-muted)] bg-[var(--bg-muted)] rounded-xl p-2.5">
                  <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" aria-hidden />
                  {meeting.notes}
                </div>
              )}
              <a
                href={ONLINE_MEETING_URLS[meeting.id] ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl
                  bg-[var(--accent-sage-light)] text-[var(--accent-sage)] text-sm font-medium
                  hover:bg-[var(--accent-sage)]/20 transition-calm
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-sage)]"
              >
                {t.meetings.visitLink}
              </a>
            </Card>
          ))}
        </div>
      </section>

      {/* Meeting types */}
      <section aria-labelledby="meeting-types-heading">
        <h2
          id="meeting-types-heading"
          className="text-xl font-semibold text-[var(--text-primary)] mb-5"
        >
          {t.meetings.meetingTypesTitle}
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {t.meetings.meetingTypes.map((mt, i) => (
            <Card key={mt.type} variant="muted" padding="md">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[var(--accent-sage)]" aria-hidden>{MEETING_TYPE_ICONS[i]}</span>
                <h3 className="font-medium text-[var(--text-primary)] text-sm">{mt.type}</h3>
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-2">
                {mt.description}
              </p>
              <p className="text-xs text-[var(--text-muted)]">
                <span className="font-medium">{t.meetings.bestFor}</span> {mt.best}
              </p>
            </Card>
          ))}
        </div>
      </section>

      <div className="mt-10 text-center space-y-3">
        <Link
          href="/new-to-aa"
          className="block text-sm text-[var(--accent-sage)] hover:opacity-80 transition-calm"
        >
          {t.meetings.firstMeetingLink}
        </Link>
        <a
          href="https://www.aa.org.br/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--accent-sage)] transition-calm"
        >
          {t.meetings.aaBrazilLink}
          <ExternalLink className="w-3.5 h-3.5" aria-hidden />
        </a>
      </div>
    </div>
  );
}
