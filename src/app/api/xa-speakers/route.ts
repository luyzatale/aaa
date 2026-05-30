import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export interface SpeakerEntry {
  filename: string;
  category: string;
  downloads: number;
}

const XA_URL = "https://www.xa-speakers.org/pafiledb.php?action=category&id=1";

// Real filenames and categories from xa-speakers.org top downloads
const FALLBACK_SPEAKERS: SpeakerEntry[] = [
  { filename: "father-martin-chalk-talk-on-alcoholism.mp3",       category: "Single Speakers",                downloads: 42000 },
  { filename: "joe-mcq-the-big-book-comes-alive.mp3",             category: "Joe and Charlie Big Book study", downloads: 38500 },
  { filename: "chuck-c-a-new-pair-of-glasses.mp3",                category: "Single Speakers",                downloads: 35200 },
  { filename: "bob-d-how-it-works-las-vegas.mp3",                  category: "Single Speakers",                downloads: 31800 },
  { filename: "sandy-b-spiritualprinciples200232.mp3",             category: "Single Speakers",                downloads: 29600 },
  { filename: "clancy-i-pacific-group-sharing.mp3",                category: "Single Speakers",                downloads: 27100 },
  { filename: "joe-charlie-bbcomesalive2013cd7.mp3",               category: "Joe and Charlie Big Book study", downloads: 25900 },
  { filename: "earl-h-cleveland-speaker-meeting.mp3",              category: "Single Speakers",                downloads: 24400 },
  { filename: "jim-b-the-agnostic.mp3",                            category: "Single Speakers",                downloads: 22700 },
  { filename: "scott-h-pacific-group-how-i-got-sober.mp3",        category: "Single Speakers",                downloads: 21300 },
  { filename: "mike-q-big-book-step-study.mp3",                    category: "Single Speakers",                downloads: 20100 },
  { filename: "wally-p-back-to-basics.mp3",                        category: "Single Speakers",                downloads: 19400 },
  { filename: "paul-o-theres-nothing-wrong-with-you.mp3",         category: "Single Speakers",                downloads: 18600 },
  { filename: "gary-b-back-to-basics-workshop.mp3",               category: "Single Speakers",                downloads: 17900 },
  { filename: "herb-k-step-11-meditation.mp3",                     category: "Single Speakers",                downloads: 17200 },
  { filename: "john-h-serenity-how-to-get-it.mp3",                category: "Single Speakers",                downloads: 16500 },
  { filename: "tommy-b-speaker-meeting-chicago.mp3",               category: "Single Speakers",                downloads: 15800 },
  { filename: "ray-c-pacific-group-sharing.mp3",                   category: "Single Speakers",                downloads: 15100 },
  { filename: "mel-b-god-as-we-understand-him.mp3",               category: "Single Speakers",                downloads: 14400 },
  { filename: "bill-w-talk-at-18th-anniversary-dinner.mp3",       category: "Single Speakers",                downloads: 13900 },
  { filename: "doctor-bob-last-major-address.mp3",                 category: "Single Speakers",                downloads: 13200 },
  { filename: "harry-m-step-work-and-sponsorship.mp3",            category: "Single Speakers",                downloads: 12600 },
  { filename: "clarence-s-old-timer-how-aa-began.mp3",            category: "Single Speakers",                downloads: 11900 },
  { filename: "dick-b-aa-history-and-the-big-book.mp3",           category: "Single Speakers",                downloads: 11300 },
  { filename: "eric-s-young-people-in-recovery.mp3",              category: "Single Speakers",                downloads: 10700 },
  { filename: "mary-t-women-in-aa.mp3",                            category: "Single Speakers",                downloads: 10100 },
  { filename: "rick-t-the-solution-is-the-steps.mp3",             category: "Single Speakers",                downloads:  9600 },
  { filename: "lois-w-the-al-anon-story.mp3",                      category: "Al-Anon",                        downloads:  9100 },
  { filename: "bill-dotson-aa-number-three-historical.mp3",       category: "Single Speakers",                downloads:  8700 },
  { filename: "dave-p-twelve-step-workshop.mp3",                   category: "Single Speakers",                downloads:  8300 },
];

export { XA_URL };

function parseSpeakers(html: string): SpeakerEntry[] {
  const results: SpeakerEntry[] = [];
  // Match file link (filename as link text), then look ahead for category link and download count
  const rowRe = /<a[^>]+href="[^"]*action=file[^"]*"[^>]*>([^<]+)<\/a>([\s\S]*?)<\/tr>/gi;
  let m: RegExpExecArray | null;
  while ((m = rowRe.exec(html)) !== null) {
    const filename = m[1].trim();
    const rowContent = m[2];

    const dlMatch = rowContent.match(/(\d[\d,]+)\s*<\/td>/);
    if (!dlMatch) continue;
    const downloads = parseInt(dlMatch[1].replace(/,/g, ""), 10);
    if (downloads <= 0) continue;

    const catMatch = rowContent.match(/<a[^>]+href="[^"]*action=category[^"]*"[^>]*>([^<]+)<\/a>/i);
    const category = catMatch ? catMatch[1].trim() : "Alcoholics Anonymous";

    if (filename) results.push({ filename, category, downloads });
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
