import { NextResponse } from "next/server";
import { put, get } from "@vercel/blob";

interface GratitudeEntry {
  id: string;
  date: string;
  items: string[];
}

const BLOB_PATH = "gratitudes/entries.json";

async function readEntries(): Promise<{ entries: GratitudeEntry[]; ok: boolean }> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return { entries: [], ok: false };
  try {
    const res = await get(BLOB_PATH, { access: "private" });
    if (!res) return { entries: [], ok: true };
    const text = await new Response(res.stream).text();
    return { entries: JSON.parse(text), ok: true };
  } catch {
    return { entries: [], ok: false };
  }
}

async function saveEntries(entries: GratitudeEntry[]): Promise<void> {
  await put(BLOB_PATH, JSON.stringify(entries), {
    access: "private",
    allowOverwrite: true,
    addRandomSuffix: false,
    contentType: "application/json",
  });
}

export async function GET() {
  const { entries } = await readEntries();
  const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id));
  return NextResponse.json({ entries: sorted });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const items: string[] = body?.items;
  if (!Array.isArray(items) || items.every((i) => !i?.trim())) {
    return NextResponse.json({ error: "items required" }, { status: 400 });
  }
  const { entries, ok } = await readEntries();
  if (!ok) return NextResponse.json({ error: "Storage unavailable." }, { status: 503 });
  const newEntry: GratitudeEntry = {
    id: Date.now().toString(),
    date: body.date ?? new Date().toISOString().split("T")[0],
    items: items.filter((i) => i?.trim()),
  };
  const updated = [...entries, newEntry].sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id));
  try {
    await saveEntries(updated);
  } catch (err) {
    console.error("[gratitudes] save failed:", err);
    return NextResponse.json({ error: "Failed to save." }, { status: 500 });
  }
  return NextResponse.json({ entries: updated });
}

export async function DELETE(req: Request) {
  const body = await req.json().catch(() => null);
  const { id } = body ?? {};
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const { entries, ok } = await readEntries();
  if (!ok) return NextResponse.json({ error: "Storage unavailable." }, { status: 503 });
  const updated = entries.filter((e) => e.id !== id).sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id));
  try {
    await saveEntries(updated);
  } catch (err) {
    console.error("[gratitudes] delete failed:", err);
    return NextResponse.json({ error: "Failed to delete." }, { status: 500 });
  }
  return NextResponse.json({ entries: updated });
}
