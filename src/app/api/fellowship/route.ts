import { NextResponse } from "next/server";

interface Member {
  id: string;
  nickname: string;
  phone: string;
  city: string;
  joinedAt: string;
}

const SEED: Member[] = [
  { id: "1", nickname: "Michael O.",  phone: "+31612345678",   city: "Amsterdam, NL",  joinedAt: "2026-01-15" },
  { id: "2", nickname: "Sarah T.",    phone: "+447912345678",  city: "London, UK",      joinedAt: "2026-02-03" },
  { id: "3", nickname: "Jan V.",      phone: "+31687654321",   city: "Rotterdam, NL",   joinedAt: "2026-02-18" },
  { id: "4", nickname: "Emma B.",     phone: "+32456789012",   city: "Brussels, BE",    joinedAt: "2026-03-05" },
  { id: "5", nickname: "Thomas K.",   phone: "+49170123456",   city: "Berlin, DE",      joinedAt: "2026-03-22" },
  { id: "6", nickname: "Lena M.",     phone: "+31623456789",   city: "Utrecht, NL",     joinedAt: "2026-04-10" },
];

// In-memory store — resets on cold start, sufficient for demo
let members: Member[] = [...SEED];

export async function GET() {
  return NextResponse.json({ members });
}

export async function POST(req: Request) {
  const body = await req.json();
  const { nickname, phone, city } = body ?? {};
  if (!nickname?.trim() || !phone?.trim() || !city?.trim()) {
    return NextResponse.json({ error: "All fields required" }, { status: 400 });
  }
  const member: Member = {
    id: Date.now().toString(),
    nickname: nickname.trim(),
    phone: phone.trim(),
    city: city.trim(),
    joinedAt: new Date().toISOString().split("T")[0],
  };
  members = [member, ...members];
  return NextResponse.json({ members });
}
