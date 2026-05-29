import { NextResponse } from "next/server";
import { put, get } from "@vercel/blob";

const BLOB_PATH = "sponsorship/entries.json";

interface SponsorshipEntry {
  id: string;
  date: string; // "YYYY-MM-DD"
  notes: string;
}

async function readEntries(): Promise<{ entries: SponsorshipEntry[]; ok: boolean }> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return { entries: [], ok: false };
  try {
    const res = await get(BLOB_PATH, { access: "private" });
    if (!res) return { entries: [], ok: true };
    const text = await new Response(res.stream).text();
    const parsed = JSON.parse(text);
    return { entries: Array.isArray(parsed) ? parsed : [], ok: true };
  } catch {
    return { entries: [], ok: false };
  }
}

async function writeEntries(entries: SponsorshipEntry[]): Promise<boolean> {
  try {
    await put(BLOB_PATH, JSON.stringify(entries), {
      access: "private",
      allowOverwrite: true,
      addRandomSuffix: false,
      contentType: "application/json",
    });
    return true;
  } catch {
    return false;
  }
}

export async function GET() {
  const { entries, ok } = await readEntries();
  if (!ok) return NextResponse.json({ error: "Storage error" }, { status: 503 });
  return NextResponse.json({ entries });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const { date, notes } = body ?? {};
  if (!date || typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "valid date required" }, { status: 400 });
  }
  if (!notes || typeof notes !== "string" || !notes.trim()) {
    return NextResponse.json({ error: "notes required" }, { status: 400 });
  }
  const { entries, ok } = await readEntries();
  if (!ok) return NextResponse.json({ error: "Storage error" }, { status: 503 });
  const newEntry: SponsorshipEntry = {
    id: Date.now().toString(),
    date,
    notes: notes.trim(),
  };
  const updated = [newEntry, ...entries];
  const saved = await writeEntries(updated);
  if (!saved) return NextResponse.json({ error: "Failed to save." }, { status: 500 });
  return NextResponse.json({ entries: updated });
}

export async function DELETE(req: Request) {
  const body = await req.json().catch(() => null);
  const { id } = body ?? {};
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const { entries, ok } = await readEntries();
  if (!ok) return NextResponse.json({ error: "Storage error" }, { status: 503 });
  const updated = entries.filter((e) => e.id !== id);
  const saved = await writeEntries(updated);
  if (!saved) return NextResponse.json({ error: "Failed to save." }, { status: 500 });
  return NextResponse.json({ entries: updated });
}
