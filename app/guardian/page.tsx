"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ShieldHalf } from "lucide-react";

import RiskMeter from "@/components/RiskMeter";
import StageRail from "@/components/StageRail";
import TranscriptPanel from "@/components/TranscriptPanel";
import RedFlagCard from "@/components/RedFlagCard";
import AlertOverlay from "@/components/AlertOverlay";
import ControlBar from "@/components/ControlBar";
import ToastStack, { type ToastMessage } from "@/components/ToastStack";

import { INTERRUPT_THRESHOLD, mergeScore } from "@/lib/riskEngine";
import { warningTextFor } from "@/lib/warnings";
import { sliceAudioBufferToWav } from "@/lib/wav";
import type {
  CallStatus,
  ClassifyResult,
  RedFlag,
  TranscribeResult,
  TranscriptLine,
} from "@/lib/types";

function formatElapsed(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

function makeId() {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function StatusPill({ status }: { status: CallStatus }) {
  if (status === "THREAT_DETECTED") {
    return (
      <span className="flex items-center gap-2 whitespace-nowrap rounded-full border border-danger bg-danger/15 px-3 py-1.5 text-[11px] font-bold tracking-widest text-danger shadow-[0_0_20px_rgba(255,59,78,0.4)] animate-pulse-glow sm:text-xs">
        <span className="h-2 w-2 rounded-full bg-danger" /> THREAT DETECTED
      </span>
    );
  }
  if (status === "LISTENING") {
    return (
      <span className="flex items-center gap-2 whitespace-nowrap rounded-full border border-accent bg-accent/10 px-3 py-1.5 text-[11px] font-bold tracking-widest text-accent sm:text-xs">
        <span className="h-2 w-2 animate-pulse rounded-full bg-accent" /> LISTENING
      </span>
    );
  }
  return (
    <span className="flex items-center gap-2 whitespace-nowrap rounded-full border border-border px-3 py-1.5 text-[11px] font-bold tracking-widest text-text-muted sm:text-xs">
      <span className="h-2 w-2 rounded-full border border-text-muted" /> IDLE
    </span>
  );
}

export default function GuardianPage() {
  const [status, setStatus] = useState<CallStatus>("IDLE");
  const [transcriptLines, setTranscriptLines] = useState<TranscriptLine[]>([]);
  const [redFlags, setRedFlags] = useState<RedFlag[]>([]);
  const [riskScore, setRiskScore] = useState(0);
  const [stagesDetected, setStagesDetected] = useState<number[]>([]);
  const [stageLabel, setStageLabel] = useState("");
  const [detectedLanguage, setDetectedLanguage] = useState("");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [micError, setMicError] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [isDemoRunning, setIsDemoRunning] = useState(false);
  const [analysing, setAnalysing] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertAudioUrl, setAlertAudioUrl] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const demoAudioRef = useRef<HTMLAudioElement | null>(null);
  const demoStopRef = useRef<() => void>(() => {});
  const audioContextRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const chunkQueueRef = useRef<Blob[]>([]);
  const processingRef = useRef(false);
  const rollingTranscriptRef = useRef("");
  const peakScoreRef = useRef(0);
  const alertFiredRef = useRef(false);
  const elapsedRef = useRef(0);
  const detectedLanguageRef = useRef("");
  const objectUrlsRef = useRef<string[]>([]);

  useEffect(() => {
    elapsedRef.current = elapsedSeconds;
  }, [elapsedSeconds]);

  useEffect(() => {
    detectedLanguageRef.current = detectedLanguage;
  }, [detectedLanguage]);

  useEffect(() => {
    if (isListening || isDemoRunning) {
      timerRef.current = setInterval(() => setElapsedSeconds((s) => s + 1), 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isListening, isDemoRunning]);

  useEffect(() => {
    return () => {
      mediaRecorderRef.current?.stop();
      streamRef.current?.getTracks().forEach((t) => t.stop());
      demoStopRef.current();
      demoAudioRef.current?.pause();
      objectUrlsRef.current.forEach((u) => URL.revokeObjectURL(u));
    };
  }, []);

  const pushToast = useCallback((text: string) => {
    const id = makeId();
    setToasts((t) => [...t, { id, text }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 6000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const triggerAlert = useCallback(
    async (language: string) => {
      if (alertFiredRef.current) return;
      alertFiredRef.current = true;
      setStatus("THREAT_DETECTED");
      setAlertOpen(true);
      try {
        const res = await fetch("/api/interrupt", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ language }),
        });
        if (!res.ok) throw new Error("Interrupt audio request failed");
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        objectUrlsRef.current.push(url);
        setAlertAudioUrl(url);
      } catch (err) {
        pushToast(
          err instanceof Error
            ? err.message
            : "Could not play the spoken warning, but the alert is still active."
        );
      }
    },
    [pushToast]
  );

  const runClassify = useCallback(
    async (transcript: string) => {
      setAnalysing(true);
      try {
        const res = await fetch("/api/classify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ transcript }),
        });
        if (!res.ok) throw new Error("Classification request failed");
        const result: ClassifyResult = await res.json();

        if (result.stage_label) setStageLabel(result.stage_label);
        if (result.detected_language) setDetectedLanguage(result.detected_language.toUpperCase());

        setStagesDetected((prev) =>
          Array.from(new Set([...prev, ...result.stages_detected])).sort((a, b) => a - b)
        );

        if (result.red_flags.length > 0) {
          setRedFlags((prev) => {
            const existingKeys = new Set(prev.map((f) => `${f.stage}-${f.quote}`));
            const fresh = result.red_flags.filter((f) => !existingKeys.has(`${f.stage}-${f.quote}`));
            if (fresh.length === 0) return prev;
            return [...[...fresh].reverse(), ...prev];
          });
        }

        const merged = mergeScore(peakScoreRef.current, result.risk_score);
        peakScoreRef.current = merged;
        setRiskScore(merged);

        if (merged >= INTERRUPT_THRESHOLD) {
          triggerAlert(result.detected_language || detectedLanguageRef.current || "hi-en");
        }
      } catch (err) {
        pushToast(err instanceof Error ? err.message : "Network error while classifying transcript.");
      } finally {
        setAnalysing(false);
      }
    },
    [triggerAlert, pushToast]
  );

  const processChunk = useCallback(
    async (blob: Blob) => {
      try {
        const ext = blob.type.includes("wav") ? "wav" : "webm";
        const form = new FormData();
        form.append("audio", blob, `chunk.${ext}`);
        const res = await fetch("/api/transcribe", { method: "POST", body: form });
        if (!res.ok) throw new Error("Transcription request failed");
        const { text, language }: TranscribeResult = await res.json();

        if (language) {
          setDetectedLanguage((prev) => prev || language.toUpperCase());
        }

        if (text && text.trim()) {
          const ts = formatElapsed(elapsedRef.current);
          setTranscriptLines((prev) => [...prev, { id: makeId(), timestamp: ts, text: text.trim() }]);
          rollingTranscriptRef.current = rollingTranscriptRef.current
            ? `${rollingTranscriptRef.current} ${text.trim()}`
            : text.trim();
          runClassify(rollingTranscriptRef.current);
        }
      } catch (err) {
        pushToast(err instanceof Error ? err.message : "Network error while transcribing audio.");
      }
    },
    [runClassify, pushToast]
  );

  const drainQueue = useCallback(async () => {
    if (processingRef.current) return;
    processingRef.current = true;
    while (chunkQueueRef.current.length > 0) {
      const blob = chunkQueueRef.current.shift()!;
      await processChunk(blob);
    }
    processingRef.current = false;
  }, [processChunk]);

  const enqueueChunk = useCallback(
    (blob: Blob) => {
      chunkQueueRef.current.push(blob);
      drainQueue();
    },
    [drainQueue]
  );

  const primeAudioContext = () => {
    try {
      const Ctx =
        window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (Ctx && !audioContextRef.current) {
        audioContextRef.current = new Ctx();
      }
      if (audioContextRef.current && audioContextRef.current.state === "suspended") {
        audioContextRef.current.resume();
      }
    } catch {
      // AudioContext unsupported — non-fatal, autoplay may just be blocked later
    }
  };

  const handleStart = async () => {
    primeAudioContext();
    setMicError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const recorder = new MediaRecorder(stream, { mimeType: "audio/webm;codecs=opus" });
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) enqueueChunk(e.data);
      };
      recorder.start(4000);
      mediaRecorderRef.current = recorder;

      setIsListening(true);
      setStatus((prev) => (prev === "THREAT_DETECTED" ? prev : "LISTENING"));
    } catch (err) {
      setMicError(
        err instanceof Error
          ? err.message
          : "Could not access the microphone. Please check your browser permissions."
      );
    }
  };

  const handleStop = () => {
    mediaRecorderRef.current?.stop();
    mediaRecorderRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setIsListening(false);
    setStatus((prev) => (prev === "THREAT_DETECTED" ? prev : "IDLE"));
  };

  const handleRunDemo = async () => {
    primeAudioContext();
    setMicError(null);
    try {
      const res = await fetch("/demo/scam-call.mp3");
      if (!res.ok) throw new Error("Could not load the demo call audio file.");
      const arrayBuffer = await res.arrayBuffer();

      const Ctx =
        window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctx) throw new Error("This browser does not support the Web Audio API.");
      const decodeCtx = new Ctx();
      const audioBuffer = await decodeCtx.decodeAudioData(arrayBuffer);
      const totalDuration = audioBuffer.duration;

      // Play the real file aloud — independent of the analysis pipeline below, which
      // slices the same decoded PCM data directly rather than capturing element playback.
      const audioEl = new Audio("/demo/scam-call.mp3");
      demoAudioRef.current = audioEl;
      await audioEl.play();

      setIsDemoRunning(true);
      setStatus((prev) => (prev === "THREAT_DETECTED" ? prev : "LISTENING"));

      const CHUNK_SECONDS = 4;
      let cursor = 0;
      let stopped = false;
      demoStopRef.current = () => {
        stopped = true;
      };

      const pump = async () => {
        while (cursor < totalDuration && !stopped) {
          const chunkStart = cursor;
          const chunkEnd = Math.min(totalDuration, cursor + CHUNK_SECONDS);
          const blob = sliceAudioBufferToWav(audioBuffer, chunkStart, chunkEnd);
          enqueueChunk(blob);
          cursor = chunkEnd;
          if (cursor < totalDuration && !stopped) {
            await new Promise((resolve) => setTimeout(resolve, CHUNK_SECONDS * 1000));
          }
        }
        decodeCtx.close().catch(() => {});
        if (!stopped) {
          setIsDemoRunning(false);
          setStatus((prev) => (prev === "THREAT_DETECTED" ? prev : "IDLE"));
        }
      };
      pump();
    } catch (err) {
      setIsDemoRunning(false);
      pushToast(err instanceof Error ? err.message : "Could not start the demo call.");
    }
  };

  const handleReset = () => {
    mediaRecorderRef.current?.stop();
    mediaRecorderRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    demoStopRef.current();
    if (demoAudioRef.current) {
      demoAudioRef.current.pause();
      demoAudioRef.current.onended = null;
      demoAudioRef.current = null;
    }

    chunkQueueRef.current = [];
    processingRef.current = false;
    rollingTranscriptRef.current = "";
    peakScoreRef.current = 0;
    alertFiredRef.current = false;

    objectUrlsRef.current.forEach((u) => URL.revokeObjectURL(u));
    objectUrlsRef.current = [];

    setIsListening(false);
    setIsDemoRunning(false);
    setStatus("IDLE");
    setTranscriptLines([]);
    setRedFlags([]);
    setRiskScore(0);
    setStagesDetected([]);
    setStageLabel("");
    setDetectedLanguage("");
    setElapsedSeconds(0);
    setMicError(null);
    setAnalysing(false);
    setAlertOpen(false);
    setAlertAudioUrl(null);
  };

  const handleDismissAlert = () => {
    setAlertOpen(false);
  };

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-border bg-bg/90 px-4 backdrop-blur sm:px-6">
        <Link href="/" className="flex flex-shrink-0 items-center gap-2 font-extrabold tracking-wide">
          <ShieldHalf className="h-6 w-6 text-danger" />
          <span className="hidden sm:inline">KAVACH</span>
        </Link>

        <StatusPill status={status} />

        <div className="flex flex-shrink-0 items-center gap-2 sm:gap-3">
          <span className="rounded-full border border-border bg-panel px-2.5 py-1 font-mono text-[11px] text-text-muted sm:px-3 sm:text-xs">
            {detectedLanguage || "—"}
          </span>
          <span className="font-mono text-xs text-text-muted mono-tabular sm:text-sm">
            {formatElapsed(elapsedSeconds)}
          </span>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:flex-row lg:items-start">
        <section className="flex flex-1 flex-col gap-6 lg:w-[60%] lg:flex-none">
          <div className="flex flex-col items-center rounded-2xl border border-border bg-panel p-6 sm:p-8">
            <RiskMeter score={riskScore} stageLabel={stageLabel} analysing={analysing} />
          </div>

          <div className="rounded-2xl border border-border bg-panel p-4 sm:p-6">
            <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-text-muted">
              Scam Script Stages
            </h2>
            <StageRail activeStages={stagesDetected} />
          </div>

          <div className="rounded-2xl border border-border bg-panel p-4 sm:p-6">
            <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-text-muted">
              Controls
            </h2>
            <ControlBar
              isListening={isListening}
              isDemoRunning={isDemoRunning}
              onStart={handleStart}
              onStop={handleStop}
              onRunDemo={handleRunDemo}
              onReset={handleReset}
              micError={micError}
            />
          </div>
        </section>

        <section className="flex flex-1 flex-col gap-6 lg:w-[40%] lg:flex-none">
          <div className="flex min-h-[320px] flex-1 flex-col rounded-2xl border border-border bg-panel p-4 sm:p-6">
            <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-text-muted">
              Live Transcript
            </h2>
            <TranscriptPanel lines={transcriptLines} />
          </div>

          <div className="rounded-2xl border border-border bg-panel p-4 sm:p-6">
            <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-text-muted">
              Red Flags
            </h2>
            {redFlags.length === 0 ? (
              <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-text-muted">
                No red flags detected yet.
              </p>
            ) : (
              <div className="space-y-3">
                <AnimatePresence initial={false}>
                  {redFlags.map((flag) => (
                    <RedFlagCard key={`${flag.stage}-${flag.quote}`} flag={flag} />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </section>
      </main>

      <AlertOverlay
        open={alertOpen}
        spokenText={warningTextFor(detectedLanguage || "hi-en")}
        audioUrl={alertAudioUrl}
        onDismiss={handleDismissAlert}
      />

      <ToastStack toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
