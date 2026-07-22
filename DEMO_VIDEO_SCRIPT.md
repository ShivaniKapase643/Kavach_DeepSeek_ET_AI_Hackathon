# Kavach — Demo Video Runbook (2.5 minutes)

Record at 1920×1080, Chrome or Edge desktop, tab audio on. Have `/`, `/guardian`, and `/triage`
pre-loaded in separate tabs. Do a dry run of "Run Demo Call" once before recording so Next.js has
already compiled all routes — the first hit always includes a dev-server compile delay.

| Time | Shot | Voiceover / on-screen action |
|---|---|---|
| **0:00–0:15** | Home page (`/`) hero, slow scroll to stat tiles | "Digital arrest scams have stolen ₹4,057 crore from almost 3 lakh Indians. Every defence today acts after the call ends. Kavach acts during it." |
| **0:15–0:25** | Click **Open Live Guardian** → `/guardian` idle state | "This is Kavach Guardian — a live console that listens to a call as it happens." |
| **0:25–0:35** | Click **RUN DEMO CALL** | "I'll run a real recorded scam call through the exact same pipeline a live call would use — real transcription, real classification, no mocks." |
| **0:35–0:55** | Transcript panel filling in live with the opening small-talk lines; risk gauge sitting at 0 (green) | "The call opens innocently — the caller is just confirming an identity. The risk score stays at zero. No stage detected." |
| **0:55–1:15** | Stage 01 (IMPERSONATION) chip lights up amber as the caller claims to be CBI; gauge ticks up | "The moment the caller claims to be CBI, Stage 1 lights up and the gauge starts climbing — Gemini is classifying the live transcript in real time." |
| **1:15–1:35** | Stage 02 (ACCUSATION) and Stage 03 (ISOLATION) light up in sequence; red flag cards slide in on the right with the exact quoted phrases | "Accusation — Aadhaar linked to a parcel of drugs. Isolation — stay on video, don't tell your family. Each red flag shows the exact phrase that triggered it." |
| **1:35–1:55** | Stage 04 (FEAR) lights up red-orange; gauge crosses the INTERRUPT tick at 75 and glows red | "Once isolation and fear-based threats appear, the score is locked above 85 — this is the point no legitimate call would ever reach." |
| **1:55–2:10** | Full-screen "HANG UP NOW" alert overlay fires; spoken Hindi warning plays over it | "Kavach interrupts immediately — full-screen warning, and a spoken alert in the caller's own detected language, so the victim hears it even if they've stopped reading." |
| **2:10–2:20** | Click **CALL 1930** button on the overlay (don't actually place the call — hover/point) | "One tap routes straight to the national cybercrime helpline." |
| **2:20–2:35** | Switch to `/triage`, paste the sample scam SMS, click **ANALYSE**, show verdict card animating in with confidence ring and complaint draft | "For messages instead of live calls, Triage gives the same verdict, the red flags, next steps, and a ready-to-file complaint for cybercrime.gov.in in seconds." |
| **2:35–2:30** | Cut to `/pitch` roadmap section briefly, then team slide | "Team DeepSeek, built for ET AI Hackathon 2.0 — Kavach." |

## Notes for the recording session

- **Let the demo call run uninterrupted.** The pipeline paces itself in 4-second real-time
  windows matching the audio, so don't skip ahead — the reveal of each stage lighting up as the
  script escalates is the core "wow" moment.
- **Gemini free-tier rate limits:** if you're on a free-tier API key, spacing repeated full runs
  a minute or two apart avoids 429s. A single full run at the pipeline's natural 4-second cadence
  stays within free-tier per-minute limits.
- **Audio:** make sure the recording software captures system/tab audio, not just microphone —
  both the demo call playback and the spoken interrupt warning need to be audible in the final cut.
- **Fallback take:** if a network hiccup causes a visible error toast during recording, that's
  fine to leave in — it demonstrates the "never crashes, always surfaces a toast" requirement
  rather than undermining the demo.
