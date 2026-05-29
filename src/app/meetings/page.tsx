import type { Metadata } from "next";
import MeetingsContent from "@/components/features/MeetingsContent";

export const metadata: Metadata = {
  title: "Meetings",
  description: "Find AA meetings online and in-person. 24/7 availability, beginner-friendly, with anxiety support guidance.",
};

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

const DAY_NAMES = ["Zondag", "Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag", "Zaterdag"];

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
    <MeetingsContent
      nlMeetings={nlMeetings}
      todayNLMeetings={todayNLMeetings}
      todayDayName={todayDayName}
    />
  );
}
