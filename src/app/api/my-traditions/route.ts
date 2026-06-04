import { NextResponse } from "next/server";
import { put, get } from "@vercel/blob";

const BLOB_PATH = "traditions/entries.json";

async function read(): Promise<{ entries: Record<string, string>; ok: boolean }> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return { entries: {}, ok: false };
  try {
    const res = await get(BLOB_PATH, { access: "private" });
    if (!res) return { entries: {}, ok: true };
    const text = await new Response(res.stream).text();
    const parsed = JSON.parse(text);
    return { entries: typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {}, ok: true };
  } catch {
    return { entries: {}, ok: false };
  }
}

async function write(entries: Record<string, string>): Promise<boolean> {
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
  const { entries, ok } = await read();
  if (!ok) return NextResponse.json({ error: "Storage error" }, { status: 503 });
  return NextResponse.json({ entries });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const { entries } = body ?? {};
  if (!entries || typeof entries !== "object" || Array.isArray(entries)) {
    return NextResponse.json({ error: "entries required" }, { status: 400 });
  }
  const { ok } = await read();
  if (!ok) return NextResponse.json({ error: "Storage error" }, { status: 503 });
  const saved = await write(entries as Record<string, string>);
  if (!saved) return NextResponse.json({ error: "Failed to save." }, { status: 500 });
  return NextResponse.json({ entries });
}
