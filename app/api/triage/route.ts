import { NextRequest, NextResponse } from "next/server";
import { triageContent } from "@/lib/gemini";
import { transcribeAudio } from "@/lib/elevenlabs";
import type { TriageMode } from "@/lib/types";

export const runtime = "nodejs";

function parseDataUrl(content: string): { mimeType: string; base64: string } {
  const match = content.match(/^data:([^;]+);base64,(.*)$/s);
  if (match) return { mimeType: match[1], base64: match[2] };
  return { mimeType: "application/octet-stream", base64: content };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const mode: TriageMode = body?.mode;
    const content: string = body?.content ?? "";
    const language: string = body?.language ?? "English";

    if (!content.trim()) {
      return NextResponse.json({ error: "No content provided" }, { status: 400 });
    }

    if (mode === "text") {
      const result = await triageContent({ mode: "text", text: content, language });
      return NextResponse.json(result);
    }

    if (mode === "image") {
      const { mimeType, base64 } = parseDataUrl(content);
      const result = await triageContent({
        mode: "image",
        imageBase64: base64,
        imageMimeType: mimeType,
        language,
      });
      return NextResponse.json(result);
    }

    if (mode === "audio") {
      const { mimeType, base64 } = parseDataUrl(content);
      const buffer = Buffer.from(base64, "base64");
      const blob = new Blob([buffer], { type: mimeType || "audio/mpeg" });

      const { text: transcript } = await transcribeAudio(blob);

      if (!transcript.trim()) {
        return NextResponse.json({
          verdict: "LIKELY_SAFE",
          confidence: 40,
          red_flags: [],
          what_to_do: [
            "We couldn't detect any speech in this recording. Try a clearer recording or paste the conversation as text instead.",
          ],
          complaint_draft: "",
        });
      }

      const result = await triageContent({ mode: "text", text: transcript, language });
      return NextResponse.json(result);
    }

    return NextResponse.json({ error: "Invalid mode" }, { status: 400 });
  } catch (err) {
    console.error("[/api/triage]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Triage failed" },
      { status: 500 }
    );
  }
}
