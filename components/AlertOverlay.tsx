"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ShieldAlert, PhoneCall, X } from "lucide-react";

interface AlertOverlayProps {
  open: boolean;
  spokenText: string;
  audioUrl: string | null;
  onDismiss: () => void;
}

export default function AlertOverlay({ open, spokenText, audioUrl, onDismiss }: AlertOverlayProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/92 p-6 py-12"
        >
          <div
            className="pointer-events-none fixed inset-0 animate-border-pulse"
            style={{
              background: "radial-gradient(ellipse at center, transparent 30%, rgba(255,59,78,0.4) 100%)",
            }}
          />
          <div className="relative z-10 flex max-w-2xl flex-col items-center gap-5 text-center sm:gap-6">
            <ShieldAlert className="h-12 w-12 sm:h-14 sm:w-14 text-danger animate-pulse" />
            <h1 className="text-[44px] leading-[0.95] sm:text-[72px] md:text-[96px] font-extrabold tracking-tight text-danger">
              HANG UP NOW
            </h1>
            <p className="text-lg sm:text-2xl font-semibold text-text-primary">
              This is a digital arrest scam.
            </p>
            {spokenText && (
              <p className="max-w-xl rounded-xl border border-border bg-panel/70 p-4 font-mono text-sm text-text-muted sm:text-base">
                {spokenText}
              </p>
            )}
            <div className="mt-2 flex flex-col items-center gap-4 sm:flex-row">
              <a
                href="tel:1930"
                className="flex items-center gap-2 rounded-xl bg-danger px-8 py-4 text-lg font-bold text-white shadow-[0_0_40px_rgba(255,59,78,0.5)] transition-transform hover:scale-105"
              >
                <PhoneCall className="h-5 w-5" /> CALL 1930
              </a>
              <button
                onClick={onDismiss}
                className="flex items-center gap-2 rounded-xl border border-border px-6 py-4 text-sm font-semibold text-text-muted transition-colors hover:border-text-muted hover:text-text-primary"
              >
                <X className="h-4 w-4" /> Dismiss
              </button>
            </div>
          </div>
          {audioUrl && <audio src={audioUrl} autoPlay />}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
