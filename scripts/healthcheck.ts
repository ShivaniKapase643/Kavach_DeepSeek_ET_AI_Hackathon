import { config } from "dotenv";
import path from "path";

config({ path: path.resolve(process.cwd(), ".env") });

import { classifyTranscript } from "../lib/gemini";
import { synthesizeSpeech, listVoices, WARNING_VOICE_ID } from "../lib/elevenlabs";
import { getResolvedGeminiModel } from "../lib/gemini";

async function main() {
  console.log("=== KAVACH HEALTHCHECK ===\n");

  if (!process.env.GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY missing from .env");
    process.exit(1);
  }
  if (!process.env.ELEVENLABS_API_KEY) {
    console.error("ELEVENLABS_API_KEY missing from .env");
    process.exit(1);
  }

  console.log("--- Gemini classify test ---");
  const sampleTranscript =
    "Sir this is CBI Mumbai cyber crime branch calling. Your Aadhaar card is linked to a parcel containing illegal drugs. Please stay on this video call and do not disconnect, this is a confidential matter, you cannot tell anyone.";
  try {
    const result = await classifyTranscript(sampleTranscript);
    console.log("Resolved Gemini model:", getResolvedGeminiModel());
    console.log(JSON.stringify(result, null, 2));
  } catch (err) {
    console.error("Gemini classify FAILED:", err);
    process.exit(1);
  }

  console.log("\n--- ElevenLabs voices test ---");
  try {
    const voices = await listVoices();
    const ids: string[] = (voices.voices ?? []).map((v: any) => v.voice_id);
    console.log(`Found ${ids.length} voices.`);
    console.log(
      `Hardcoded WARNING_VOICE_ID (${WARNING_VOICE_ID}) present in account:`,
      ids.includes(WARNING_VOICE_ID)
    );
  } catch (err) {
    console.warn(
      "ElevenLabs voices SKIPPED (key likely scoped without voices_read — not required at runtime since the voice id is hardcoded):",
      err instanceof Error ? err.message : err
    );
  }

  console.log("\n--- ElevenLabs TTS test ---");
  try {
    const audio = await synthesizeSpeech("This is a Kavach healthcheck test.");
    console.log(`TTS OK — received ${audio.byteLength} bytes of audio/mpeg.`);
  } catch (err) {
    console.error("ElevenLabs TTS FAILED:", err);
    process.exit(1);
  }

  console.log("\n=== ALL CHECKS PASSED ===");
}

main().catch((err) => {
  console.error("Healthcheck crashed:", err);
  process.exit(1);
});
