"use client";

import { useRef, useState } from "react";
import {
  FileText,
  ImageIcon,
  Mic,
  UploadCloud,
  X,
  Loader2,
  ScanSearch,
  AlertOctagon,
} from "lucide-react";
import Nav from "@/components/Nav";
import VerdictCard from "@/components/VerdictCard";
import type { TriageMode, TriageResult } from "@/lib/types";

type Tab = "text" | "image" | "audio";

const TABS: { id: Tab; label: string; icon: typeof FileText }[] = [
  { id: "text", label: "TEXT", icon: FileText },
  { id: "image", label: "SCREENSHOT", icon: ImageIcon },
  { id: "audio", label: "RECORDING", icon: Mic },
];

const LANGUAGES = [
  { label: "English", value: "English" },
  { label: "हिन्दी", value: "Hindi" },
  { label: "ಕನ್ನಡ", value: "Kannada" },
  { label: "தமிழ்", value: "Tamil" },
  { label: "తెలుగు", value: "Telugu" },
  { label: "मराठी", value: "Marathi" },
  { label: "বাংলা", value: "Bengali" },
];

const SMS_PLACEHOLDER = `Dear Customer, your SBI account will be SUSPENDED today due to KYC expiry. Update immediately to avoid blocking: http://sbi-kyc-verify.tk Action required within 2 hours. - SBI Bank`;

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.readAsDataURL(file);
  });
}

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function TriagePage() {
  const [tab, setTab] = useState<Tab>("text");
  const [textContent, setTextContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioDuration, setAudioDuration] = useState<number | null>(null);
  const [language, setLanguage] = useState("English");
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TriageResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  const switchTab = (t: Tab) => {
    setTab(t);
    setResult(null);
    setError(null);
  };

  const handleImageFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file (PNG, JPG, or WEBP).");
      return;
    }
    setError(null);
    if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    setImageFile(file);
    setImagePreviewUrl(URL.createObjectURL(file));
  };

  const removeImage = () => {
    if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    setImageFile(null);
    setImagePreviewUrl(null);
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  const handleAudioFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.type.startsWith("audio/")) {
      setError("Please upload an audio file.");
      return;
    }
    setError(null);
    setAudioFile(file);
    setAudioDuration(null);
    const url = URL.createObjectURL(file);
    const probe = new Audio(url);
    probe.addEventListener("loadedmetadata", () => {
      setAudioDuration(probe.duration);
      URL.revokeObjectURL(url);
    });
  };

  const removeAudio = () => {
    setAudioFile(null);
    setAudioDuration(null);
    if (audioInputRef.current) audioInputRef.current.value = "";
  };

  const hasInput =
    tab === "text" ? textContent.trim().length > 0 : tab === "image" ? !!imageFile : !!audioFile;

  const handleAnalyse = async () => {
    if (!hasInput || loading) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      let content: string;
      const mode: TriageMode = tab;

      if (tab === "text") {
        content = textContent;
      } else if (tab === "image" && imageFile) {
        content = await fileToDataUrl(imageFile);
      } else if (tab === "audio" && audioFile) {
        content = await fileToDataUrl(audioFile);
      } else {
        setLoading(false);
        return;
      }

      const res = await fetch("/api/triage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, content, language }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || "Analysis failed. Please try again.");
      }

      const json: TriageResult = await res.json();
      setResult(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Nav />

      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold sm:text-4xl">Not sure about a message or a call?</h1>
          <p className="mt-3 text-text-muted">
            Paste it, upload it, or send the recording. You will get an answer in seconds.
          </p>
        </div>

        <div className="mt-10 rounded-2xl border border-border bg-panel p-4 sm:p-6">
          <div className="grid grid-cols-3 gap-2 rounded-xl border border-border bg-[#0D1220] p-1.5">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => switchTab(id)}
                className={`flex items-center justify-center gap-1.5 rounded-lg px-2 py-2.5 text-xs font-bold tracking-wide transition-colors sm:text-sm ${
                  tab === id
                    ? "bg-accent text-[#04141C]"
                    : "text-text-muted hover:text-text-primary"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>

          <div className="mt-5">
            {tab === "text" && (
              <textarea
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                placeholder={SMS_PLACEHOLDER}
                rows={8}
                className="w-full resize-none rounded-xl border border-border bg-[#0D1220] p-4 font-mono text-sm text-text-primary placeholder:text-text-muted/60 focus:outline-none focus:ring-1 focus:ring-accent"
              />
            )}

            {tab === "image" && (
              <div>
                {!imageFile ? (
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragActive(true);
                    }}
                    onDragLeave={() => setDragActive(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDragActive(false);
                      handleImageFiles(e.dataTransfer.files);
                    }}
                    onClick={() => imageInputRef.current?.click()}
                    className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-10 text-center transition-colors ${
                      dragActive ? "border-accent bg-accent/5" : "border-border hover:border-text-muted"
                    }`}
                  >
                    <UploadCloud className="h-10 w-10 text-text-muted" />
                    <div>
                      <p className="font-semibold text-text-primary">
                        Drag and drop a screenshot here
                      </p>
                      <p className="mt-1 text-sm text-text-muted">or click to browse — PNG, JPG, WEBP</p>
                    </div>
                    <input
                      ref={imageInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageFiles(e.target.files)}
                    />
                  </div>
                ) : (
                  <div className="relative overflow-hidden rounded-xl border border-border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imagePreviewUrl ?? ""}
                      alt="Uploaded screenshot preview"
                      className="max-h-96 w-full object-contain bg-[#0D1220]"
                    />
                    <button
                      onClick={removeImage}
                      className="absolute right-3 top-3 flex items-center gap-1.5 rounded-lg bg-black/70 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur hover:bg-black/90"
                    >
                      <X className="h-3.5 w-3.5" /> Remove
                    </button>
                    <div className="border-t border-border bg-panel-raised px-4 py-2 text-xs text-text-muted">
                      {imageFile.name} · {formatSize(imageFile.size)}
                    </div>
                  </div>
                )}
              </div>
            )}

            {tab === "audio" && (
              <div>
                {!audioFile ? (
                  <div
                    onClick={() => audioInputRef.current?.click()}
                    className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border p-10 text-center transition-colors hover:border-text-muted"
                  >
                    <Mic className="h-10 w-10 text-text-muted" />
                    <div>
                      <p className="font-semibold text-text-primary">Upload a call recording</p>
                      <p className="mt-1 text-sm text-text-muted">or click to browse — MP3, WAV, M4A</p>
                    </div>
                    <input
                      ref={audioInputRef}
                      type="file"
                      accept="audio/*"
                      className="hidden"
                      onChange={(e) => handleAudioFiles(e.target.files)}
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-between rounded-xl border border-border bg-[#0D1220] p-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-panel-raised">
                        <Mic className="h-5 w-5 text-accent" />
                      </span>
                      <div>
                        <p className="font-mono text-sm text-text-primary">{audioFile.name}</p>
                        <p className="font-mono text-xs text-text-muted">
                          {audioDuration !== null ? formatDuration(audioDuration) : "…"} ·{" "}
                          {formatSize(audioFile.size)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={removeAudio}
                      className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-text-muted hover:text-text-primary"
                    >
                      <X className="h-3.5 w-3.5" /> Remove
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="mt-5">
            <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-text-muted">
              Response language
            </label>
            <div className="flex flex-wrap gap-2">
              {LANGUAGES.map((l) => (
                <button
                  key={l.value}
                  onClick={() => setLanguage(l.value)}
                  className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                    language === l.value
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-border text-text-muted hover:text-text-primary"
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="mt-5 flex items-start gap-3 rounded-xl border border-danger/40 bg-danger/10 p-4">
              <AlertOctagon className="mt-0.5 h-5 w-5 flex-shrink-0 text-danger" />
              <p className="text-sm text-text-primary">{error}</p>
            </div>
          )}

          <button
            onClick={handleAnalyse}
            disabled={!hasInput || loading}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-6 py-4 text-base font-bold text-[#04141C] transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" /> Analysing…
              </>
            ) : (
              <>
                <ScanSearch className="h-5 w-5" /> ANALYSE
              </>
            )}
          </button>
        </div>

        {result && (
          <div className="mt-10">
            <VerdictCard result={result} />
          </div>
        )}
      </main>
    </div>
  );
}
