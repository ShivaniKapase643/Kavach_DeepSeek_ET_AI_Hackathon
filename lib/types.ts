export type Stage = 1 | 2 | 3 | 4 | 5;

export const STAGE_LABELS: Record<Stage, string> = {
  1: "IMPERSONATION",
  2: "ACCUSATION",
  3: "ISOLATION",
  4: "FEAR",
  5: "EXTRACTION",
};

export interface RedFlag {
  stage: Stage;
  quote: string;
  why: string;
}

export interface ClassifyResult {
  stages_detected: Stage[];
  stage_label: string;
  risk_score: number;
  red_flags: RedFlag[];
  detected_language: string;
  reason: string;
}

export interface TranscribeResult {
  text: string;
  language: string;
}

export type Verdict = "SCAM" | "SUSPICIOUS" | "LIKELY_SAFE";

export interface TriageResult {
  verdict: Verdict;
  confidence: number;
  red_flags: string[];
  what_to_do: string[];
  complaint_draft: string;
}

export type TriageMode = "text" | "image" | "audio";

export interface TranscriptLine {
  id: string;
  timestamp: string;
  text: string;
}

export type CallStatus = "IDLE" | "LISTENING" | "THREAT_DETECTED";
