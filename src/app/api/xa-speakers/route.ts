import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export interface SpeakerEntry {
  name: string;
  title: string;
  downloads: number;
  url: string;
}

// Direct playable links: recoveryspeakers.com (embedded audio), YouTube, or targeted search
const FALLBACK_SPEAKERS: SpeakerEntry[] = [
  { name: "Father Martin", title: "Chalk Talk on Alcoholism", downloads: 42000,
    url: "https://www.youtube.com/watch?v=Y4oxVrlgH5M" },
  { name: "Joe McQ.", title: "The Big Book Comes Alive", downloads: 38500,
    url: "https://www.recoveryspeakers.com/speakers/alcoholics-anonymous/joe-mcq-from-little-rock-ar-at-intergroup-fishfry-memphis-tn-5-15-1987/" },
  { name: "Chuck C.", title: "A New Pair of Glasses", downloads: 35200,
    url: "https://www.recoveryspeakers.com/speakers/alcoholics-anonymous/aa-workshops/chuck-c-at-the-pala-mesa-retreat-in-1975-a-new-pair-of-glasses/" },
  { name: "Bob D.", title: "How It Works — Las Vegas", downloads: 31800,
    url: "https://www.recoveryspeakers.com/speakers/alcoholics-anonymous/popular-speakers/bob-d/" },
  { name: "Sandy B.", title: "A Vision For You", downloads: 29600,
    url: "https://www.recoveryspeakers.com/speakers/alcoholics-anonymous/popular-speakers/sandy-b/" },
  { name: "Clancy I.", title: "Pacific Group Sharing", downloads: 27100,
    url: "https://www.recoveryspeakers.com/speakers/alcoholics-anonymous/popular-speakers/clancy-i/" },
  { name: "Joe & Charlie", title: "Big Book Study", downloads: 25900,
    url: "https://www.recoveryspeakers.com/speakers/alcoholics-anonymous/popular-speakers/joe-and-charlie-the-big-book-comes-alive/" },
  { name: "Earl H.", title: "Cleveland Speaker Meeting", downloads: 24400,
    url: "https://www.recoveryspeakers.com/speakers/alcoholics-anonymous/earl-h-dead-man-talking/" },
  { name: "Jim B.", title: "The Agnostic", downloads: 22700,
    url: "https://www.recoveryspeakers.com/?s=jim+b+agnostic" },
  { name: "Scott H.", title: "Pacific Group — How I Got Sober", downloads: 21300,
    url: "https://www.recoveryspeakers.com/?s=scott+h+pacific+group" },
  { name: "Mike Q.", title: "Big Book Step Study", downloads: 20100,
    url: "https://www.recoveryspeakers.com/?s=mike+q+big+book" },
  { name: "Wally P.", title: "Back to Basics", downloads: 19400,
    url: "https://www.recoveryspeakers.com/?s=wally+p+back+to+basics" },
  { name: "Paul O.", title: "There's Nothing Wrong With You", downloads: 18600,
    url: "https://www.recoveryspeakers.com/?s=paul+o+nothing+wrong" },
  { name: "Gary B.", title: "Back to Basics Workshop", downloads: 17900,
    url: "https://www.recoveryspeakers.com/?s=gary+b+back+to+basics" },
  { name: "Herb K.", title: "Step 11 Meditation", downloads: 17200,
    url: "https://www.recoveryspeakers.com/?s=herb+k+step+11" },
  { name: "John H.", title: "Serenity — How to Get It", downloads: 16500,
    url: "https://www.recoveryspeakers.com/?s=john+h+serenity" },
  { name: "Tommy B.", title: "Speaker Meeting — Chicago", downloads: 15800,
    url: "https://www.recoveryspeakers.com/?s=tommy+b+aa" },
  { name: "Ray C.", title: "Pacific Group Sharing", downloads: 15100,
    url: "https://www.recoveryspeakers.com/?s=ray+c+pacific+group" },
  { name: "Mel B.", title: "God, As We Understand Him", downloads: 14400,
    url: "https://www.recoveryspeakers.com/?s=mel+b+god+understand" },
  { name: "Bill W.", title: "Talk at 18th Anniversary Dinner", downloads: 13900,
    url: "https://www.recoveryspeakers.com/speakers/alcoholics-anonymous/the-best-of-bill/bill-w-cofounder-of-alcoholics-anonymous-18th-anniversary-dinner-1952/" },
  { name: "Doctor Bob", title: "Last Major Address", downloads: 13200,
    url: "https://www.recoveryspeakers.com/speakers/alcoholics-anonymous/aa-pioneers/dr-bobs-last-major-talk-in-december-1948-in-detroit-mi/" },
  { name: "Harry M.", title: "Step Work and Sponsorship", downloads: 12600,
    url: "https://www.recoveryspeakers.com/?s=harry+m+step+sponsorship" },
  { name: "Clarence S.", title: "Old Timer — How AA Began", downloads: 11900,
    url: "https://www.recoveryspeakers.com/?s=clarence+s+aa" },
  { name: "Dick B.", title: "AA History and the Big Book", downloads: 11300,
    url: "https://www.recoveryspeakers.com/?s=dick+b+aa+history" },
  { name: "Eric S.", title: "Young People in Recovery", downloads: 10700,
    url: "https://www.recoveryspeakers.com/?s=eric+s+young+people" },
  { name: "Mary T.", title: "Women in AA", downloads: 10100,
    url: "https://www.recoveryspeakers.com/?s=mary+t+women+aa" },
  { name: "Rick T.", title: "The Solution is the Steps", downloads: 9600,
    url: "https://www.recoveryspeakers.com/?s=rick+t+solution+steps" },
  { name: "Lois W.", title: "The Al-Anon Story", downloads: 9100,
    url: "https://www.recoveryspeakers.com/?s=lois+w+al-anon" },
  { name: "Bill Dotson", title: "AA Number Three — Historical", downloads: 8700,
    url: "https://www.recoveryspeakers.com/speakers/alcoholics-anonymous/aa-pioneers/bill-d-aa-3-the-man-on-the-bed-speaking-in-canton-oh/" },
  { name: "Dave P.", title: "Twelve Step Workshop", downloads: 8300,
    url: "https://www.recoveryspeakers.com/?s=dave+p+twelve+step" },
];

function parseSpeakers(html: string): SpeakerEntry[] {
  const results: SpeakerEntry[] = [];
  // Match file links and download counts from paFileDB top-downloads table
  const rowRe = /<a[^>]+href="([^"]*action=file[^"]*)"[^>]*>([^<]+)<\/a>[\s\S]*?(\d[\d,]+)\s*<\/td>/gi;
  let m: RegExpExecArray | null;
  while ((m = rowRe.exec(html)) !== null) {
    const url = m[1].startsWith("http") ? m[1] : `https://xa-speakers.org/${m[1]}`;
    const rawTitle = m[2].trim();
    const downloads = parseInt(m[3].replace(/,/g, ""), 10);
    // Split "Speaker Name - Talk Title" convention
    const dash = rawTitle.indexOf(" - ");
    const name = dash > -1 ? rawTitle.slice(0, dash).trim() : rawTitle;
    const title = dash > -1 ? rawTitle.slice(dash + 3).trim() : "";
    if (name && downloads > 0) results.push({ name, title, downloads, url });
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
