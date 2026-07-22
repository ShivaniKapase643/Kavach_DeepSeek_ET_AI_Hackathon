"use client";

import { motion } from "framer-motion";
import type { RedFlag } from "@/lib/types";
import { stageColor } from "@/lib/riskEngine";

export default function RedFlagCard({ flag }: { flag: RedFlag }) {
  const color = stageColor(flag.stage as 1 | 2 | 3 | 4 | 5);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
      className="rounded-xl border p-3"
      style={{ borderColor: `${color}55`, backgroundColor: "#161D2E" }}
    >
      <div className="flex items-center gap-2">
        <span
          className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full font-mono text-[11px] font-bold"
          style={{ backgroundColor: `${color}33`, color }}
        >
          {flag.stage}
        </span>
        <span className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
          Red flag detected
        </span>
      </div>
      <p className="mt-2 font-mono text-sm italic text-text-primary">&ldquo;{flag.quote}&rdquo;</p>
      <p className="mt-1 text-xs text-text-muted">{flag.why}</p>
    </motion.div>
  );
}
