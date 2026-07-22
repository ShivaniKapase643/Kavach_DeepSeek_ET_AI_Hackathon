"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ShieldCheck,
  ShieldQuestion,
  PhoneCall,
  ExternalLink,
  Copy,
  Check,
} from "lucide-react";
import type { TriageResult } from "@/lib/types";

const VERDICT_META = {
  SCAM: { label: "SCAM", color: "#FF3B4E", Icon: AlertTriangle },
  SUSPICIOUS: { label: "SUSPICIOUS", color: "#FFB020", Icon: ShieldQuestion },
  LIKELY_SAFE: { label: "LIKELY SAFE", color: "#27D18C", Icon: ShieldCheck },
} as const;

export default function VerdictCard({ result }: { result: TriageResult }) {
  const [copied, setCopied] = useState(false);
  const meta = VERDICT_META[result.verdict] ?? VERDICT_META.SUSPICIOUS;
  const { Icon } = meta;

  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (Math.min(100, Math.max(0, result.confidence)) / 100) * circumference;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result.complaint_draft);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard API unavailable — silently ignore, textarea remains selectable
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-5"
    >
      <div
        className="flex flex-col items-center gap-6 rounded-2xl border p-6 sm:flex-row sm:p-8"
        style={{ borderColor: `${meta.color}55`, backgroundColor: `${meta.color}0D` }}
      >
        <div className="flex items-center gap-4">
          <Icon className="h-12 w-12 flex-shrink-0" style={{ color: meta.color }} />
          <div>
            <p className="text-xs uppercase tracking-widest text-text-muted">Verdict</p>
            <p className="text-3xl font-extrabold sm:text-4xl" style={{ color: meta.color }}>
              {meta.label}
            </p>
          </div>
        </div>

        <div className="relative flex items-center justify-center sm:ml-auto" style={{ width: 96, height: 96 }}>
          <svg width="96" height="96" viewBox="0 0 96 96" className="-rotate-90">
            <circle cx="48" cy="48" r="40" stroke="#232C42" strokeWidth="8" fill="none" />
            <motion.circle
              cx="48"
              cy="48"
              r="40"
              stroke={meta.color}
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            />
          </svg>
          <span className="absolute font-mono text-lg font-bold" style={{ color: meta.color }}>
            {result.confidence}%
          </span>
        </div>
      </div>

      {result.red_flags.length > 0 && (
        <div className="rounded-xl border border-border bg-panel p-5 sm:p-6">
          <h3 className="mb-3 text-sm font-bold uppercase tracking-widest text-text-muted">Why</h3>
          <ul className="space-y-2">
            {result.red_flags.map((flag, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-warning" />
                <span>{flag}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {result.what_to_do.length > 0 && (
        <div className="rounded-xl border border-border bg-panel p-5 sm:p-6">
          <h3 className="mb-3 text-sm font-bold uppercase tracking-widest text-text-muted">
            What to do now
          </h3>
          <ol className="space-y-2">
            {result.what_to_do.map((step, i) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-panel-raised font-mono text-xs font-bold text-accent">
                  {i + 1}
                </span>
                <span className="pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {result.complaint_draft && (
        <div className="rounded-xl border border-border bg-panel p-5 sm:p-6">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-widest text-text-muted">
              Ready-to-file complaint
            </h3>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-text-muted transition-colors hover:border-accent hover:text-text-primary"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-safe" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <textarea
            readOnly
            value={result.complaint_draft}
            rows={6}
            className="w-full resize-none rounded-lg border border-border bg-[#0D1220] p-3 font-mono text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <a
          href="tel:1930"
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-danger px-5 py-3.5 font-semibold text-white transition-transform hover:scale-[1.02]"
        >
          <PhoneCall className="h-5 w-5" /> CALL 1930
        </a>
        <a
          href="https://cybercrime.gov.in"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border px-5 py-3.5 font-semibold text-text-primary transition-colors hover:border-accent"
        >
          <ExternalLink className="h-5 w-5" /> Report at cybercrime.gov.in
        </a>
      </div>
    </motion.div>
  );
}
