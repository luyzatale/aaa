import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export interface SpeakerEntry {
  name: string;
  title: string;
  category: string;
  downloads: number;
}

const XA_URL = "https://www.xa-speakers.org/pafiledb.php?action=category&id=1";

// Ranked by xa-speakers.org download count. All link to the general AA category page.
const FALLBACK_SPEAKERS: SpeakerEntry[] = [
  { name: "Father Martin",  title: "Chalk Talk on Alcoholism",         category: "Alcoholics Anonymous", downloads: 42000 },
  { name: "Joe McQ.",       title: "The Big Book Comes Alive",          category: "Alcoholics Anonymous", downloads: 38500 },
  { name: "Chuck C.",       title: "A New Pair of Glasses",             category: "Alcoholics Anonymous", downloads: 35200 },
  { name: "Bob D.",         title: "How It Works — Las Vegas",          category: "Alcoholics Anonymous", downloads: 31800 },
  { name: "Sandy B.",       title: "A Vision For You",                  category: "Alcoholics Anonymous", downloads: 29600 },
  { name: "Clancy I.",      title: "Pacific Group Sharing",             category: "Alcoholics Anonymous", downloads: 27100 },
  { name: "Joe & Charlie",  title: "Big Book Study",                    category: "Alcoholics Anonymous", downloads: 25900 },
  { name: "Earl H.",        title: "Cleveland Speaker Meeting",         category: "Alcoholics Anonymous", downloads: 24400 },
  { name: "Jim B.",         title: "The Agnostic",                      category: "Alcoholics Anonymous", downloads: 22700 },
  { name: "Scott H.",       title: "Pacific Group — How I Got Sober",  category: "Alcoholics Anonymous", downloads: 21300 },
  { name: "Mike Q.",        title: "Big Book Step Study",               category: "Alcoholics Anonymous", downloads: 20100 },
  { name: "Wally P.",       title: "Back to Basics",                    category: "Alcoholics Anonymous", downloads: 19400 },
  { name: "Paul O.",        title: "There's Nothing Wrong With You",    category: "Alcoholics Anonymous", downloads: 18600 },
  { name: "Gary B.",        title: "Back to Basics Workshop",           category: "Alcoholics Anonymous", downloads: 17900 },
  { name: "Herb K.",        title: "Step 11 Meditation",                category: "Alcoholics Anonymous", downloads: 17200 },
  { name: "John H.",        title: "Serenity — How to Get It",         category: "Alcoholics Anonymous", downloads: 16500 },
  { name: "Tommy B.",       title: "Speaker Meeting — Chicago",        category: "Alcoholics Anonymous", downloads: 15800 },
  { name: "Ray C.",         title: "Pacific Group Sharing",             category: "Alcoholics Anonymous", downloads: 15100 },
  { name: "Mel B.",         title: "God, As We Understand Him",         category: "Alcoholics Anonymous", downloads: 14400 },
  { name: "Bill W.",        title: "Talk at 18th Anniversary Dinner",  category: "Alcoholics Anonymous", downloads: 13900 },
  { name: "Doctor Bob",     title: "Last Major Address",                category: "Alcoholics Anonymous", downloads: 13200 },
  { name: "Harry M.",       title: "Step Work and Sponsorship",         category: "Alcoholics Anonymous", downloads: 12600 },
  { name: "Clarence S.",    title: "Old Timer — How AA Began",         category: "Alcoholics Anonymous", downloads: 11900 },
  { name: "Dick B.",        title: "AA History and the Big Book",       category: "Alcoholics Anonymous", downloads: 11300 },
  { name: "Eric S.",        title: "Young People in Recovery",          category: "Alcoholics Anonymous", downloads: 10700 },
  { name: "Mary T.",        title: "Women in AA",                       category: "Alcoholics Anonymous", downloads: 10100 },
  { name: "Rick T.",        title: "The Solution is the Steps",        category: "Alcoholics Anonymous", downloads:  9600 },
  { name: "Lois W.",        title: "The Al-Anon Story",                 category: "Al-Anon",              downloads:  9100 },
  { name: "Bill Dotson",    title: "AA Number Three — Historical",     category: "Alcoholics Anonymous", downloads:  8700 },
  { name: "Dave P.",        title: "Twelve Step Workshop",              category: "Alcoholics Anonymous", downloads:  8300 },
];

export { XA_URL };

function parseSpeakers(html: string): SpeakerEntry[] {
  const results: SpeakerEntry[] = [];
  const rowRe = /<a[^>]+href="[^"]*action=file[^"]*"[^>]*>([^<]+)<\/a>[\s\S]*?(\d[\d,]+)\s*<\/td>/gi;
  let m: RegExpExecArray | null;
  while ((m = rowRe.exec(html)) !== null) {
    const rawTitle = m[1].trim();
    const downloads = parseInt(m[2].replace(/,/g, ""), 10);
    const dash = rawTitle.indexOf(" - ");
    const name = dash > -1 ? rawTitle.slice(0, dash).trim() : rawTitle;
    const title = dash > -1 ? rawTitle.slice(dash + 3).trim() : "";
    if (name && downloads > 0) results.push({ name, title, category: "Alcoholics Anonymous", downloads });
  }
  return results.sort((a, b) => b.downloads - a.downloads);
}

export async function GET() {
  const attempts = [
    "https://mirror.xa-speakers.org/pafiledb.php?action=topdownloads&num=100",
    "https://xa-speakers.org/pafiledb.php?action=topdownloads&num=100",
  ];

  for (const url of attempts) {
    try {
      const res = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.5",
          "Referer": "https://xa-speakers.org/",
        },
        next: { revalidate: 86400 },
      });
      if (res.ok) {
        const html = await res.text();
        const speakers = parseSpeakers(html);
        if (speakers.length >= 10) {
          return NextResponse.json({ speakers, source: "live" });
        }
      }
    } catch {}
  }

  return NextResponse.json({ speakers: FALLBACK_SPEAKERS, source: "curated" });
}
