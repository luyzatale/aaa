import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Users, Video, Globe, Heart, Clock, Shield, ChevronRight, Info, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "Meetings",
  description: "Find AA meetings online and in-person. 24/7 availability, beginner-friendly, with anxiety support guidance.",
};

const onlineMeetings = [
  {
    id: "marathon",
    name: "24/7 Marathon Meeting",
    description: "A continuously running AA meeting, 24 hours a day, 7 days a week. Available whenever you need it.",
    location: "New Zealand (Online)",
    meetingId: "2923712604",
    password: "No password required",
    type: "Video",
    alwaysOn: true,
    tags: ["24/7", "No password", "Video"],
    joinUrl: "https://zoom.us/j/2923712604",
    notes: "This meeting runs continuously. You can join and leave at any time.",
  },
  {
    id: "in-the-rooms",
    name: "In The Rooms",
    description: "A large platform for online AA meetings. Free to join. Many meeting types available.",
    location: "Global",
    type: "Various",
    tags: ["Free", "Many types", "Global"],
    joinUrl: "https://www.intherooms.com",
    notes: "Create a free account to access hundreds of daily online meetings.",
  },
  {
    id: "aa-uk-online",
    name: "AA UK Online Meetings",
    description: "Official AA UK directory of online meetings including beginner and specialist meetings.",
    location: "UK",
    type: "Various",
    tags: ["UK", "Official", "Beginner"],
    joinUrl: "https://www.alcoholics-anonymous.org.uk/find-a-meeting",
    notes: "Use the meeting finder to filter by type, time, and location.",
  },
  {
    id: "aa-online",
    name: "AA Online Intergroup",
    description: "International AA online meetings. Includes secular, LGBTQ+, and specialist meetings.",
    location: "Global",
    type: "Various",
    tags: ["Global", "Secular", "LGBTQ+"],
    joinUrl: "https://www.aa-intergroup.org/meetings",
    notes: "Searchable directory of online AA meetings around the world.",
  },
];

const meetingTypes = [
  {
    type: "Open Meetings",
    description: "Anyone can attend — you do not need to identify as alcoholic.",
    best: "First meeting, bringing a friend or family member",
    icon: <Users className="w-4 h-4" />,
  },
  {
    type: "Closed Meetings",
    description: "For people with a desire to stop drinking only.",
    best: "Deeper sharing, more privacy",
    icon: <Shield className="w-4 h-4" />,
  },
  {
    type: "Speaker Meetings",
    description: "One person shares their full story. No participation required.",
    best: "Social anxiety, not ready to share",
    icon: <Heart className="w-4 h-4" />,
  },
  {
    type: "Step Meetings",
    description: "Discussion of one of the 12 Steps.",
    best: "Step work, understanding the programme",
    icon: <ChevronRight className="w-4 h-4" />,
  },
  {
    type: "Beginner Meetings",
    description: "Focused on newcomers and the basics of the programme.",
    best: "First 90 days, newcomers",
    icon: <Globe className="w-4 h-4" />,
  },
  {
    type: "Meditation Meetings",
    description: "Quiet meditation followed by gentle sharing.",
    best: "Sensory sensitivity, need for calm",
    icon: <Clock className="w-4 h-4" />,
  },
];

const anxietyGuide = [
  "Your camera can stay off. Nobody will ask why.",
  "You do not have to speak. You can say 'I'll pass' if asked to share.",
  "You can leave at any time. There is no judgement.",
  "Listening only is a completely valid way to attend.",
  "Feeling anxious before a meeting is normal. Many people do.",
  "Online meetings allow you to join from your own safe space.",
  "You can attend the same meeting repeatedly — familiarity helps.",
];

// AA Nederland online meetings
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

async function getAANLOnlineMeetings(): Promise<AANLMeeting[]> {
  try {
    const res = await fetch("https://aa-nederland.nl/wp-json/tsml/meetings", {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data: AANLMeeting[] = await res.json();
    return data.filter((m) => m.attendance_option === "online" && m.conference_url);
  } catch {
    return [];
  }
}

export default async function MeetingsPage() {
  const nlMeetings = await getAANLOnlineMeetings();

  const dayStr = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    timeZone: "Europe/Amsterdam",
  }).format(new Date());
  const todayDay = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(dayStr);
  const todayDayName = DAY_NAMES[todayDay] ?? "";

  const todayNLMeetings = nlMeetings
    .filter((m) => m.day === todayDay)
    .sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
      <div className="mb-10">
        <Badge variant="sage" className="mb-4">Meetings</Badge>
        <h1 className="text-4xl font-light text-[var(--text-primary)] mb-4 leading-tight">
          You are welcome{" "}
          <em className="not-italic text-[var(--accent-sage)]">exactly as you are.</em>
        </h1>
        <p className="text-lg text-[var(--text-secondary)] font-light leading-relaxed max-w-2xl">
          Meetings are the heart of AA. There is no obligation to speak.
          No performance is required.
        </p>
      </div>

      {/* 24/7 Marathon Meeting - highlighted */}
      <Card variant="sage" padding="lg" className="mb-8">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-[var(--accent-sage)] text-white flex items-center justify-center flex-shrink-0" aria-hidden>
            <Video className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h2 className="font-semibold text-[var(--text-primary)]">24/7 Marathon Meeting</h2>
              <span className="px-2 py-0.5 rounded-full bg-[var(--accent-sage)] text-white text-xs font-medium">
                Live Now
              </span>
            </div>
            <p className="text-sm text-[var(--text-secondary)]">
              A continuously running AA meeting — 24 hours a day, 7 days a week.
              Available whenever you need it, including 3am.
            </p>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-3 mb-4 text-sm">
          <div className="bg-[var(--bg-card)] rounded-2xl p-3">
            <span className="text-xs text-[var(--text-muted)] uppercase tracking-wide block mb-1">Meeting ID</span>
            <span className="font-mono font-medium text-[var(--text-primary)]">2923712604</span>
          </div>
          <div className="bg-[var(--bg-card)] rounded-2xl p-3">
            <span className="text-xs text-[var(--text-muted)] uppercase tracking-wide block mb-1">Password</span>
            <span className="text-[var(--accent-sage)] font-medium">No password needed</span>
          </div>
        </div>
        <a
          href="https://zoom.us/j/2923712604"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[var(--accent-sage)] text-white text-sm font-medium hover:opacity-90 transition-calm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-sage)]"
        >
          <Video className="w-4 h-4" aria-hidden />
          Join Now via Zoom
        </a>
      </Card>

      {/* Anxiety guide */}
      <Card variant="serenity" padding="lg" className="mb-10">
        <div className="flex items-start gap-3 mb-4">
          <Shield className="w-5 h-5 text-[var(--accent-serenity)] flex-shrink-0 mt-0.5" aria-hidden />
          <div>
            <h2 className="font-semibold text-[var(--text-primary)] mb-1">
              Too anxious to join?
            </h2>
            <p className="text-sm text-[var(--text-secondary)]">
              These are true. All of them.
            </p>
          </div>
        </div>
        <ul className="space-y-2" aria-label="Meeting anxiety reassurances">
          {anxietyGuide.map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-[var(--text-secondary)]">
              <span className="w-5 h-5 rounded-full bg-[var(--accent-serenity-light)] text-[var(--accent-serenity)] text-xs flex items-center justify-center flex-shrink-0 mt-0.5 font-medium" aria-hidden>
                {i + 1}
              </span>
              {item}
            </li>
          ))}
        </ul>
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
              Alle days <ExternalLink className="w-3.5 h-3.5" aria-hidden />
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
                  (t) => !SKIP_TYPES.has(t) && TYPE_LABELS[t]
                );
                return (
                  <Card key={meeting.id} padding="md" className="space-y-3">
                    <div>
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="text-lg font-light text-[var(--accent-sage)] tabular-nums">
                          {meeting.time}
                        </span>
                        {visibleTypes.map((t) => (
                          <Badge key={t} variant="muted">{TYPE_LABELS[t]}</Badge>
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

      {/* Other online meetings */}
      <section aria-labelledby="online-meetings-heading" className="mb-12">
        <h2
          id="online-meetings-heading"
          className="text-xl font-semibold text-[var(--text-primary)] mb-5"
        >
          More Online Meetings
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {onlineMeetings.slice(1).map((meeting) => (
            <Card key={meeting.id} padding="md" className="space-y-3">
              <div>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {meeting.tags.map((tag) => (
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
                href={meeting.joinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl
                  bg-[var(--accent-sage-light)] text-[var(--accent-sage)] text-sm font-medium
                  hover:bg-[var(--accent-sage)]/20 transition-calm
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-sage)]"
              >
                Visit ↗
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
          Types of Meetings
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {meetingTypes.map((mt) => (
            <Card key={mt.type} variant="muted" padding="md">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[var(--accent-sage)]" aria-hidden>{mt.icon}</span>
                <h3 className="font-medium text-[var(--text-primary)] text-sm">{mt.type}</h3>
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-2">
                {mt.description}
              </p>
              <p className="text-xs text-[var(--text-muted)]">
                <span className="font-medium">Best for:</span> {mt.best}
              </p>
            </Card>
          ))}
        </div>
      </section>

      <div className="mt-10 text-center">
        <Link
          href="/new-to-aa"
          className="text-sm text-[var(--accent-sage)] hover:opacity-80 transition-calm"
        >
          What to expect at your first meeting →
        </Link>
      </div>
    </div>
  );
}
