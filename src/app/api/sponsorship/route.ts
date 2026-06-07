import { NextResponse } from "next/server";
import { put, get } from "@vercel/blob";

const BLOB_PATH = "sponsorship/entries.json";

interface ChecklistItem {
  text: string;
  checked: boolean;
}

interface SponsorshipEntry {
  id: string;
  date: string;
  type?: "note" | "checklist";
  notes?: string;
  title?: string;
  items?: ChecklistItem[];
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
  const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));
  return NextResponse.json({ entries: sorted });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const { date, type, notes, title, items } = body ?? {};

  if (!date || typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "valid date required" }, { status: 400 });
  }

  if (type === "checklist") {
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "items required for checklist" }, { status: 400 });
    }
  } else {
    if (!notes || typeof notes !== "string" || !notes.trim()) {
      return NextResponse.json({ error: "notes required" }, { status: 400 });
    }
  }

  const { entries, ok } = await readEntries();
  if (!ok) return NextResponse.json({ error: "Storage error" }, { status: 503 });

  const newEntry: SponsorshipEntry = type === "checklist"
    ? { id: Date.now().toString(), date, type: "checklist", title: title?.trim() || undefined, items }
    : { id: Date.now().toString(), date, notes: (notes as string).trim() };

  const updated = [...entries, newEntry].sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));
  const saved = await writeEntries(updated);
  if (!saved) return NextResponse.json({ error: "Failed to save." }, { status: 500 });
  return NextResponse.json({ entries: updated });
}

export async function PATCH(req: Request) {
  const body = await req.json().catch(() => null);
  const { id, notes, title, items } = body ?? {};

  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const { entries, ok } = await readEntries();
  if (!ok) return NextResponse.json({ error: "Storage error" }, { status: 503 });

  const updated = entries.map((e) => {
    if (e.id !== id) return e;
    if (items !== undefined) {
      return { ...e, title: title?.trim() || undefined, items };
    }
    if (!notes || typeof notes !== "string" || !notes.trim()) return e;
    return { ...e, notes: notes.trim() };
  });

  const sorted = updated.sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));
  const saved = await writeEntries(sorted);
  if (!saved) return NextResponse.json({ error: "Failed to save." }, { status: 500 });
  return NextResponse.json({ entries: sorted });
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
  return NextResponse.json({ entries: updated.sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id)) });
}
