import { NextRequest, NextResponse } from "next/server";
import { synthesizeSpeech } from "@/lib/elevenlabs";
import { warningTextFor } from "@/lib/warnings";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const language = typeof body?.language === "string" ? body.language : "hi-en";

    const text = warningTextFor(language);
    const audio = await synthesizeSpeech(text);

    return new NextResponse(audio, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("[/api/interrupt]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Interrupt synthesis failed" },
      { status: 500 }
    );
  }
}
