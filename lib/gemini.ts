import type { ClassifyResult, TriageResult } from "./types";

// Some newer API keys/projects lose free access to the pinned "gemini-2.5-flash" name
// ("no longer available to new users") even though older keys still resolve it fine.
// "gemini-flash-latest" is a Google-maintained alias that resolves within whatever the
// key is actually entitled to, so it's kept as a universal fallback ahead of the older
// pinned 2.0 name.
const GEMINI_MODELS = ["gemini-2.5-flash", "gemini-flash-latest", "gemini-2.0-flash"] as const;

let resolvedModel: string | null = null;

export function getResolvedGeminiModel(): string | null {
  return resolvedModel;
}

export const CLASSIFIER_PROMPT = `You are a fraud-detection classifier for Indian "digital arrest" scam calls. You receive
a live, partial transcript of an ongoing phone or video call. It may be code-mixed
Hindi-English or any Indian language, and transcription may be imperfect.

Digital arrest scams follow a rigid five-stage script:
1 IMPERSONATION — caller claims to be CBI, ED, Customs, TRAI, Police, RBI, courier
  company, or any government authority.
2 ACCUSATION — claims the victim's Aadhaar, SIM, bank account, or a parcel is linked to
  money laundering, drugs, or human trafficking.
3 ISOLATION — instructs the victim to stay on video, not disconnect, not tell family,
  frames it as confidential or a national security matter.
4 FEAR AND PRESSURE — threatens immediate arrest, cites non-bailable sections, shows a
  fake warrant or ID, applies sustained time pressure.
5 EXTRACTION — demands transfer to a "verification account" or "RBI safe account", or
  asks for OTP, card, or banking credentials.

GROUND TRUTH: No Indian agency — CBI, ED, Customs, RBI, or Police — ever conducts
arrests, interrogations, or fund verification over a phone or video call. There is no
such thing as a "digital arrest" in Indian law. Any call exhibiting this script is
fraudulent. There is no legitimate counterpart to this pattern.

SCORING:
  1 stage detected        -> 35
  2 stages detected       -> 70
  3 or more stages        -> 90
  Stage 3 detected at all -> minimum 85
  Stage 5 detected at all -> minimum 85
  No stages               -> 0
Take the maximum of applicable rules. Never lower a score once stages are established.

Be decisive. Do not hedge. Ordinary conversation, customer service, or a genuine bank
call with no impersonation and no fund demand scores 0.

For each detected stage, return the exact phrase from the transcript that triggered it.
Return strict JSON only. No markdown, no commentary.
{ "stages_detected": [], "stage_label": "", "risk_score": 0,
  "red_flags": [{"stage":1,"quote":"","why":""}], "detected_language": "", "reason": "" }`;

const TRIAGE_PROMPT = `You are a fraud-detection assistant for Indian citizens checking a suspicious message, screenshot, or call recording transcript for scam signals — especially "digital arrest" scams (fake CBI/ED/Customs/Police/RBI calls), but also UPI fraud, phishing links, fake courier/parcel scams, lottery/prize scams, loan-app harassment, and sextortion.

GROUND TRUTH: No Indian government agency ever demands money, OTPs, or "verification transfers" over call, SMS, or WhatsApp, and never conducts arrests over video call. Legitimate banks never ask for OTP/PIN/CVV.

Analyse the given content and respond with strict JSON only, no markdown, no commentary, in this exact shape:
{
  "verdict": "SCAM" | "SUSPICIOUS" | "LIKELY_SAFE",
  "confidence": 0,
  "red_flags": ["short phrase describing each red flag found"],
  "what_to_do": ["actionable step 1", "actionable step 2", "..."],
  "complaint_draft": "a ready-to-file complaint paragraph suitable for cybercrime.gov.in describing what happened, in first person"
}

Be decisive: obvious scams get SCAM with confidence >= 85. Ambiguous but concerning content gets SUSPICIOUS. Clearly benign content gets LIKELY_SAFE with red_flags as an empty array and complaint_draft as an empty string.`;

interface GeminiPart {
  text?: string;
  inlineData?: { mimeType: string; data: string };
}

async function callGemini(parts: GeminiPart[], systemInstruction: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set");

  let lastError: unknown = null;

  for (const model of GEMINI_MODELS) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ role: "user", parts }],
              systemInstruction: { role: "system", parts: [{ text: systemInstruction }] },
              generationConfig: { responseMimeType: "application/json", temperature: 0.1 },
            }),
          }
        );

        if (res.status >= 500) {
          lastError = new Error(`Gemini ${model} returned ${res.status}`);
          if (attempt === 0) continue;
          break;
        }

        if (res.status === 404) {
          lastError = new Error(`Gemini model ${model} not found (404)`);
          break;
        }

        if (!res.ok) {
          const body = await res.text();
          throw new Error(`Gemini ${model} error ${res.status}: ${body}`);
        }

        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) throw new Error("Gemini returned no text content");

        resolvedModel = model;
        return text;
      } catch (err) {
        lastError = err;
        if (attempt === 0 && !(err instanceof Error && err.message.includes("404"))) continue;
        break;
      }
    }
  }

  throw lastError instanceof Error ? lastError : new Error("All Gemini models failed");
}

function stripFences(raw: string): string {
  return raw
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();
}

export async function classifyTranscript(transcript: string): Promise<ClassifyResult> {
  if (!transcript.trim()) {
    return {
      stages_detected: [],
      stage_label: "",
      risk_score: 0,
      red_flags: [],
      detected_language: "",
      reason: "Empty transcript",
    };
  }

  const raw = await callGemini(
    [{ text: `Transcript so far:\n"""\n${transcript}\n"""` }],
    CLASSIFIER_PROMPT
  );

  const parsed = JSON.parse(stripFences(raw));
  return {
    stages_detected: Array.isArray(parsed.stages_detected) ? parsed.stages_detected : [],
    stage_label: parsed.stage_label ?? "",
    risk_score: typeof parsed.risk_score === "number" ? parsed.risk_score : 0,
    red_flags: Array.isArray(parsed.red_flags) ? parsed.red_flags : [],
    detected_language: parsed.detected_language ?? "",
    reason: parsed.reason ?? "",
  };
}

export async function triageContent(params: {
  mode: "text" | "image";
  text?: string;
  imageBase64?: string;
  imageMimeType?: string;
  language: string;
}): Promise<TriageResult> {
  const parts: GeminiPart[] = [];

  if (params.mode === "image" && params.imageBase64) {
    parts.push({
      inlineData: {
        mimeType: params.imageMimeType || "image/png",
        data: params.imageBase64,
      },
    });
    parts.push({
      text: `Analyse this screenshot for scam signals. Respond in ${params.language}. Output the JSON described in your instructions.`,
    });
  } else {
    parts.push({
      text: `Content to analyse:\n"""\n${params.text ?? ""}\n"""\nRespond in ${params.language}. Output the JSON described in your instructions.`,
    });
  }

  const raw = await callGemini(parts, TRIAGE_PROMPT);
  const parsed = JSON.parse(stripFences(raw));

  return {
    verdict: parsed.verdict ?? "SUSPICIOUS",
    confidence: typeof parsed.confidence === "number" ? parsed.confidence : 50,
    red_flags: Array.isArray(parsed.red_flags) ? parsed.red_flags : [],
    what_to_do: Array.isArray(parsed.what_to_do) ? parsed.what_to_do : [],
    complaint_draft: parsed.complaint_draft ?? "",
  };
}
