import { NextRequest, NextResponse } from "next/server";
import { classifyTranscript } from "@/lib/gemini";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const transcript = typeof body?.transcript === "string" ? body.transcript : "";

    const result = await classifyTranscript(transcript);
    return NextResponse.json(result);
  } catch (err) {
    console.error("[/api/classify]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Classification failed" },
      { status: 500 }
    );
  }
}
