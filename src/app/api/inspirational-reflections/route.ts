import { NextResponse } from "next/server";
import { put, get } from "@vercel/blob";

const BLOB_PATH = "sponsorship/inspirational-reflections.json";

interface ReflectionEntry {
  id: string;
  date: string;
  text: string;
}

async function readEntries(): Promise<{ entries: ReflectionEntry[]; ok: boolean }> {
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

async function writeEntries(entries: ReflectionEntry[]): Promise<boolean> {
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
  const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id));
  return NextResponse.json({ entries: sorted });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const { text, date } = body ?? {};
  if (!text || typeof text !== "string" || !text.trim()) {
    return NextResponse.json({ error: "text required" }, { status: 400 });
  }
  const { entries, ok } = await readEntries();
  if (!ok) return NextResponse.json({ error: "Storage error" }, { status: 503 });
  const newEntry: ReflectionEntry = {
    id: Date.now().toString(),
    date: date ?? new Date().toISOString().split("T")[0],
    text: text.trim(),
  };
  const updated = [...entries, newEntry].sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id));
  const saved = await writeEntries(updated);
  if (!saved) return NextResponse.json({ error: "Failed to save." }, { status: 500 });
  return NextResponse.json({ entries: updated });
}

export async function PATCH(req: Request) {
  const body = await req.json().catch(() => null);
  const { id, text } = body ?? {};
  if (!id || !text || typeof text !== "string" || !text.trim()) {
    return NextResponse.json({ error: "id and text required" }, { status: 400 });
  }
  const { entries, ok } = await readEntries();
  if (!ok) return NextResponse.json({ error: "Storage error" }, { status: 503 });
  const updated = entries.map((e) => e.id === id ? { ...e, text: text.trim() } : e).sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id));
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
  const updated = entries.filter((e) => e.id !== id).sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id));
  const saved = await writeEntries(updated);
  if (!saved) return NextResponse.json({ error: "Failed to save." }, { status: 500 });
  return NextResponse.json({ entries: updated });
}
