import { NextResponse } from "next/server";
import { put, get } from "@vercel/blob";

interface GratitudeEntry {
  id: string;
  date: string;
  items: string[];
}

const BLOB_PATH = "gratitudes/entries.json";

async function readEntries(): Promise<GratitudeEntry[]> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return [];
  try {
    const res = await get(BLOB_PATH, { access: "private" });
    if (!res) return [];
    const text = await new Response(res.stream).text();
    return JSON.parse(text);
  } catch {
    return [];
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
  const entries = await readEntries();
  return NextResponse.json({ entries });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const items: string[] = body?.items;
  if (!Array.isArray(items) || items.every((i) => !i?.trim())) {
    return NextResponse.json({ error: "items required" }, { status: 400 });
  }
  const entries = await readEntries();
  const newEntry: GratitudeEntry = {
    id: Date.now().toString(),
    date: body.date ?? new Date().toISOString().split("T")[0],
    items: items.filter((i) => i?.trim()),
  };
  const updated = [newEntry, ...entries];
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
  const entries = await readEntries();
  const updated = entries.filter((e) => e.id !== id);
  try {
    await saveEntries(updated);
  } catch (err) {
    console.error("[gratitudes] delete failed:", err);
    return NextResponse.json({ error: "Failed to delete." }, { status: 500 });
  }
  return NextResponse.json({ entries: updated });
}
