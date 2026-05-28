import { NextResponse } from "next/server";

function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/p>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

export async function GET() {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  const res = await fetch(`https://www.aa.org/api/reflections/${month}/${day}`, {
    headers: { "User-Agent": "Mozilla/5.0" },
    next: { revalidate: 43200 }, // cache 12h — reflection changes daily
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Failed to fetch reflection" }, { status: 502 });
  }

  const json = await res.json();
  const html: string = json.data ?? "";

  // Title
  const titleMatch = html.match(/field--name-title[^>]*>([^<]+)</);
  const title = titleMatch ? titleMatch[1].trim() : "";

  // Date label
  const dateMatch = html.match(/field--name-field-date[^>]*>\s*([^<]+)</);
  const dateLabel = dateMatch ? dateMatch[1].trim() : "";

  // Teaser section → first <strong> = quote, second = source
  const teaserMatch = html.match(/field--name-field-teaser[^>]*>([\s\S]*?)<\/div>/);
  const teaserHtml = teaserMatch ? teaserMatch[1] : "";
  const strongs = [...teaserHtml.matchAll(/<strong>([\s\S]*?)<\/strong>/g)];
  const quote = strongs[0] ? stripHtml(strongs[0][1]) : "";
  const source = strongs[1] ? stripHtml(strongs[1][1]) : "";

  // Body: paragraphs that are NOT the repeated bold quote/source and not just whitespace
  const bodyMatch = html.match(/field--name-body[^>]*>([\s\S]*?)field--name-field-copyright/);
  const bodyHtml = bodyMatch ? bodyMatch[1] : "";
  const paragraphs = [...bodyHtml.matchAll(/<p>([\s\S]*?)<\/p>/g)]
    .map((m) => stripHtml(m[1]))
    .filter((p) => p.length > 2 && !p.startsWith(quote.slice(0, 20)));
  const body = paragraphs.join("\n\n");

  return NextResponse.json({ title, date: dateLabel, quote, source, body });
}
