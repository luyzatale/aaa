import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const text: string = body?.text;

  if (!text || typeof text !== "string" || text.trim().length === 0) {
    return NextResponse.json({ error: "text is required" }, { status: 400 });
  }

  const apiKey = process.env.GOOGLE_TTS_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "TTS not configured" }, { status: 503 });
  }

  const res = await fetch(
    `https://texttospeech.googleapis.com/v1beta1/text:synthesize?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        input: { text: text.slice(0, 5000) },
        voice: { languageCode: "en-US", name: "en-US-Journey-D" },
        audioConfig: { audioEncoding: "MP3" },
      }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    console.error("Google TTS error:", err);
    return NextResponse.json({ error: "TTS request failed" }, { status: res.status });
  }

  const data = await res.json();
  const audio = Buffer.from(data.audioContent as string, "base64");

  return new NextResponse(audio, {
    headers: {
      "Content-Type": "audio/mpeg",
      "Content-Length": String(audio.length),
      "Cache-Control": "private, max-age=3600",
    },
  });
}
