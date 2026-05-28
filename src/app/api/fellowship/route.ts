import { NextResponse } from "next/server";
import { put, list } from "@vercel/blob";

interface Member {
  id: string;
  nickname: string;
  phone: string;
  city: string;
  joinedAt: string;
}

const BLOB_PATH = "fellowship/members.json";

async function readMembers(): Promise<Member[]> {
  try {
    const { blobs } = await list({ prefix: "fellowship/members" });
    if (!blobs.length) return [];
    const res = await fetch(blobs[0].downloadUrl);
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

async function saveMembers(members: Member[]): Promise<void> {
  await put(BLOB_PATH, JSON.stringify(members), {
    access: "private",
    allowOverwrite: true,
    addRandomSuffix: false,
    contentType: "application/json",
  });
}

export async function GET() {
  const members = await readMembers();
  return NextResponse.json({ members });
}

export async function POST(req: Request) {
  const body = await req.json();
  const { nickname, phone, city } = body ?? {};
  if (!nickname?.trim() || !phone?.trim() || !city?.trim()) {
    return NextResponse.json({ error: "All fields required" }, { status: 400 });
  }
  const members = await readMembers();
  const newMember: Member = {
    id: Date.now().toString(),
    nickname: nickname.trim(),
    phone: phone.trim(),
    city: city.trim(),
    joinedAt: new Date().toISOString().split("T")[0],
  };
  const updated = [newMember, ...members];
  await saveMembers(updated);
  return NextResponse.json({ members: updated });
}
