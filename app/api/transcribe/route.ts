import { NextRequest, NextResponse } from "next/server";
import { transcribeAudio } from "@/lib/elevenlabs";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const audio = form.get("audio");

    if (!audio || !(audio instanceof Blob) || audio.size === 0) {
      return NextResponse.json({ text: "", language: "" });
    }

    const result = await transcribeAudio(audio);
    return NextResponse.json(result);
  } catch (err) {
    console.error("[/api/transcribe]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Transcription failed" },
      { status: 500 }
    );
  }
}
