import type { Stage } from "./types";

export type RiskBand = "safe" | "warning" | "danger";

export function bandForScore(score: number): RiskBand {
  if (score >= 75) return "danger";
  if (score >= 35) return "warning";
  return "safe";
}

export function colorForBand(band: RiskBand): string {
  switch (band) {
    case "danger":
      return "#FF3B4E";
    case "warning":
      return "#FFB020";
    case "safe":
      return "#27D18C";
  }
}

export const INTERRUPT_THRESHOLD = 75;

export function stageColor(stage: Stage): string {
  if (stage <= 2) return "#FFB020"; // amber
  if (stage <= 4) return "#FF7A1A"; // orange
  return "#FF3B4E"; // red
}

// Score is authoritative from the classifier response, but we never let it regress
// once a session has established stages — the caller (guardian page state) enforces
// the "never lower a score" rule across successive classify calls.
export function mergeScore(previousPeak: number, incoming: number): number {
  return Math.max(previousPeak, incoming);
}
