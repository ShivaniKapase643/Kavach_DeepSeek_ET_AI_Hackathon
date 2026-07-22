// Voice picked via GET https://api.elevenlabs.io/v1/voices — "Adam" (pNInz6obpgDQGcFmaJgB):
// a deep, authoritative male voice that reads clearly in code-mixed Hindi-English and
// other Indian languages under eleven_multilingual_v2 / eleven_flash_v2_5. Used both for
// the live interrupt warning and for narrating the demo scam call script.
export const WARNING_VOICE_ID = "pNInz6obpgDQGcFmaJgB";

const STT_URL = "https://api.elevenlabs.io/v1/speech-to-text";
const TTS_URL = (voiceId: string) => `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;
const VOICES_URL = "https://api.elevenlabs.io/v1/voices";

function getKey(): string {
  const key = process.env.ELEVENLABS_API_KEY;
  if (!key) throw new Error("ELEVENLABS_API_KEY is not set");
  return key;
}

export async function transcribeAudio(blob: Blob): Promise<{ text: string; language: string }> {
  const key = getKey();
  const form = new FormData();
  form.append("file", blob, "audio.webm");
  form.append("model_id", "scribe_v1");

  const res = await fetch(STT_URL, {
    method: "POST",
    headers: { "xi-api-key": key },
    body: form,
  });

  if (!res.ok) {
    if (res.status >= 400 && res.status < 500) {
      // Likely silent/empty/too-short audio chunk — don't throw, just treat as no speech.
      return { text: "", language: "" };
    }
    const body = await res.text();
    throw new Error(`ElevenLabs STT error ${res.status}: ${body}`);
  }

  const data = await res.json();
  return {
    text: typeof data.text === "string" ? data.text : "",
    language: data.language_code ?? data.language ?? "",
  };
}

export async function synthesizeSpeech(text: string, voiceId: string = WARNING_VOICE_ID): Promise<ArrayBuffer> {
  const key = getKey();

  const res = await fetch(TTS_URL(voiceId), {
    method: "POST",
    headers: {
      "xi-api-key": key,
      "Content-Type": "application/json",
      Accept: "audio/mpeg",
    },
    body: JSON.stringify({
      text,
      model_id: "eleven_flash_v2_5",
      voice_settings: { stability: 0.4, similarity_boost: 0.75 },
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`ElevenLabs TTS error ${res.status}: ${body}`);
  }

  return res.arrayBuffer();
}

export async function listVoices(): Promise<any> {
  const key = getKey();
  const res = await fetch(VOICES_URL, { headers: { "xi-api-key": key } });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`ElevenLabs voices error ${res.status}: ${body}`);
  }
  return res.json();
}
