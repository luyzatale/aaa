import { NextResponse } from "next/server";
import { put, get } from "@vercel/blob";

const BLOB_PATH = "sobriety/data.json";

interface SobrietyData {
  startDate: string; // "YYYY-MM-DD"
}

async function readData(): Promise<{ data: SobrietyData | null; ok: boolean }> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return { data: null, ok: false };
  try {
    const res = await get(BLOB_PATH, { access: "private" });
    if (!res) return { data: null, ok: true };
    const text = await new Response(res.stream).text();
    return { data: JSON.parse(text), ok: true };
  } catch {
    return { data: null, ok: false };
  }
}

export async function GET() {
  const { data } = await readData();
  return NextResponse.json({ startDate: data?.startDate ?? null });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const { startDate } = body ?? {};
  if (!startDate || typeof startDate !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(startDate)) {
    return NextResponse.json({ error: "valid startDate required" }, { status: 400 });
  }
  try {
    await put(BLOB_PATH, JSON.stringify({ startDate }), {
      access: "private",
      allowOverwrite: true,
      addRandomSuffix: false,
      contentType: "application/json",
    });
  } catch (err) {
    console.error("[sobriety] save failed:", err);
    return NextResponse.json({ error: "Failed to save." }, { status: 500 });
  }
  return NextResponse.json({ startDate });
}
