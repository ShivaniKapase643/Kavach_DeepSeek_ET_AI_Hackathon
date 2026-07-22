"use client";

import { STAGE_LABELS, type Stage } from "@/lib/types";
import { stageColor } from "@/lib/riskEngine";

interface StageRailProps {
  activeStages: number[];
}

const STAGES: Stage[] = [1, 2, 3, 4, 5];

export default function StageRail({ activeStages }: StageRailProps) {
  return (
    <div className="grid grid-cols-5 gap-1.5 sm:gap-3">
      {STAGES.map((stage) => {
        const active = activeStages.includes(stage);
        const color = stageColor(stage);
        return (
          <div
            key={stage}
            className={`rounded-xl border px-1 py-2.5 sm:px-1.5 sm:py-4 text-center transition-colors duration-300 ${
              active ? "animate-scale-pop" : ""
            }`}
            style={
              active
                ? {
                    backgroundColor: `${color}22`,
                    borderColor: color,
                    boxShadow: `0 0 20px ${color}33`,
                  }
                : { backgroundColor: "#161D2E", borderColor: "#232C42" }
            }
          >
            <div
              className="font-mono text-[9px] sm:text-xs font-bold tracking-widest"
              style={{ color: active ? color : "#8794AC" }}
            >
              0{stage}
            </div>
            <div
              className="mt-1 text-[6.5px] leading-tight sm:text-[8.5px] font-semibold"
              style={{ color: active ? "#F2F5FA" : "#8794AC" }}
            >
              {STAGE_LABELS[stage]}
            </div>
          </div>
        );
      })}
    </div>
  );
}
