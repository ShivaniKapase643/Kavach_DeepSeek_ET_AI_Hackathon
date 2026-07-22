"use client";

import { Mic, Square, PlayCircle, RotateCcw, AlertTriangle } from "lucide-react";

interface ControlBarProps {
  isListening: boolean;
  isDemoRunning: boolean;
  onStart: () => void;
  onStop: () => void;
  onRunDemo: () => void;
  onReset: () => void;
  micError: string | null;
}

export default function ControlBar({
  isListening,
  isDemoRunning,
  onStart,
  onStop,
  onRunDemo,
  onReset,
  micError,
}: ControlBarProps) {
  const busy = isListening || isDemoRunning;

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row">
        {!isListening ? (
          <button
            onClick={onStart}
            disabled={isDemoRunning}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3.5 font-semibold text-[#04141C] transition-transform hover:scale-[1.02] disabled:opacity-40 disabled:hover:scale-100"
          >
            <Mic className="h-5 w-5" /> START LISTENING
          </button>
        ) : (
          <button
            onClick={onStop}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-danger px-5 py-3.5 font-semibold text-danger transition-colors hover:bg-danger/10"
          >
            <Square className="h-5 w-5" /> STOP
          </button>
        )}

        <button
          onClick={onRunDemo}
          disabled={isListening || isDemoRunning}
          className="flex flex-1 flex-col items-center justify-center gap-0.5 rounded-xl border border-border bg-panel-raised px-5 py-3 font-semibold text-text-primary transition-colors hover:border-accent disabled:opacity-40"
        >
          <span className="flex items-center gap-2">
            <PlayCircle className="h-5 w-5" /> RUN DEMO CALL
          </span>
          <span className="text-[10px] font-normal text-text-muted">(real pipeline, local audio)</span>
        </button>

        <button
          onClick={onReset}
          disabled={busy}
          className="flex items-center justify-center gap-2 rounded-xl border border-border px-5 py-3.5 font-semibold text-text-muted transition-colors hover:border-text-muted hover:text-text-primary disabled:opacity-30"
        >
          <RotateCcw className="h-5 w-5" /> RESET
        </button>
      </div>

      {micError && (
        <div className="flex items-start gap-3 rounded-xl border border-danger/40 bg-danger/10 p-4 animate-fade-slide-in">
          <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-danger" />
          <div className="text-sm text-text-primary">
            <p className="font-semibold">Microphone access denied</p>
            <p className="mt-1 text-text-muted">
              Kavach needs microphone access to listen for scam calls. Click the padlock icon in your
              browser&rsquo;s address bar, allow microphone access for this site, then click{" "}
              <span className="text-accent">START LISTENING</span> again.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
