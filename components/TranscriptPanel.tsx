"use client";

import { useEffect, useRef } from "react";
import type { TranscriptLine } from "@/lib/types";

interface TranscriptPanelProps {
  lines: TranscriptLine[];
}

export default function TranscriptPanel({ lines }: TranscriptPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines.length]);

  return (
    <div
      ref={scrollRef}
      className="h-full min-h-[220px] flex-1 overflow-y-auto rounded-xl border border-border bg-[#0D1220] p-4"
    >
      {lines.length === 0 ? (
        <div className="flex h-full min-h-[200px] flex-col items-center justify-center gap-4 text-text-muted">
          <div className="flex h-8 items-end gap-1">
            {[0, 1, 2, 3, 4].map((i) => (
              <span
                key={i}
                className="w-1.5 rounded-full bg-accent/40 animate-wave"
                style={{ height: "100%", animationDelay: `${i * 0.12}s` }}
              />
            ))}
          </div>
          <p className="font-mono text-sm">Waiting for audio…</p>
        </div>
      ) : (
        <div className="space-y-2">
          {lines.map((line) => (
            <p key={line.id} className="font-mono text-sm leading-relaxed animate-fade-slide-in">
              <span className="mr-2 text-text-muted">[{line.timestamp}]</span>
              <span className="text-text-primary">{line.text}</span>
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
