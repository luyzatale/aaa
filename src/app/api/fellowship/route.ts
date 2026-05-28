import { NextResponse } from "next/server";
import { put, list, get } from "@vercel/blob";

interface Member {
  id: string;
  nickname: string;
  phone: string;
  city: string;
  joinedAt: string;
}

const BLOB_PATH = "fellowship/members.json";

async function readMembers(): Promise<{ members: Member[]; debug?: string }> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return { members: [], debug: "no token" };
  }
  try {
    const res = await get(BLOB_PATH, { access: "private" });
    if (!res) return { members: [], debug: "get returned null" };
    const text = await new Response(res.stream).text();
    return { members: JSON.parse(text) };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.constructor.name + ": " + err.message : String(err);
    return { members: [], debug: msg };
  }
}

async function saveMembers(members: Member[]): Promise<void> {
  const result = await put(BLOB_PATH, JSON.stringify(members), {
    access: "private",
    allowOverwrite: true,
    addRandomSuffix: false,
    contentType: "application/json",
  });
  console.log("[fellowship] saved blob:", result.url);
}

export async function GET() {
  const { members, debug } = await readMembers();
  console.log("[fellowship] GET returning", members.length, "members", debug ?? "");
  return NextResponse.json({ members, debug });
}

export async function DELETE(req: Request) {
  const { id } = (await req.json()) ?? {};
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const { members } = await readMembers();
  const updated = members.filter((m) => m.id !== id);
  if (updated.length === members.length) {
    return NextResponse.json({ error: "Member not found" }, { status: 404 });
  }
  try {
    await saveMembers(updated);
  } catch (err) {
    console.error("[fellowship] saveMembers failed:", err);
    return NextResponse.json({ error: "Failed to remove." }, { status: 500 });
  }
  return NextResponse.json({ members: updated });
}

export async function POST(req: Request) {
  const body = await req.json();
  const { nickname, phone, city } = body ?? {};
  if (!nickname?.trim() || !phone?.trim() || !city?.trim()) {
    return NextResponse.json({ error: "All fields required" }, { status: 400 });
  }
  const { members } = await readMembers();
  const newMember: Member = {
    id: Date.now().toString(),
    nickname: nickname.trim(),
    phone: phone.trim(),
    city: city.trim(),
    joinedAt: new Date().toISOString().split("T")[0],
  };
  const updated = [newMember, ...members];
  try {
    await saveMembers(updated);
  } catch (err) {
    console.error("[fellowship] saveMembers failed:", err);
    return NextResponse.json({ error: "Failed to save. Please try again.", debug: String(err) }, { status: 500 });
  }
  return NextResponse.json({ members: updated });
}
