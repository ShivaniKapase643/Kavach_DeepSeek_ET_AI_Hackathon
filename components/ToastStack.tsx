"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertOctagon, X } from "lucide-react";

export interface ToastMessage {
  id: string;
  text: string;
}

interface ToastStackProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export default function ToastStack({ toasts, onDismiss }: ToastStackProps) {
  return (
    <div className="pointer-events-none fixed bottom-4 left-1/2 z-[60] flex w-full max-w-md -translate-x-1/2 flex-col gap-2 px-4">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="pointer-events-auto flex items-start gap-3 rounded-xl border border-danger/40 bg-panel-raised p-3.5 shadow-lg"
          >
            <AlertOctagon className="mt-0.5 h-4 w-4 flex-shrink-0 text-danger" />
            <p className="flex-1 text-sm text-text-primary">{toast.text}</p>
            <button
              onClick={() => onDismiss(toast.id)}
              className="flex-shrink-0 text-text-muted hover:text-text-primary"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
