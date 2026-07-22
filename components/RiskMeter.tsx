"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, animate } from "framer-motion";
import { bandForScore, colorForBand } from "@/lib/riskEngine";

interface RiskMeterProps {
  score: number;
  stageLabel: string;
  analysing?: boolean;
}

const SIZE = 320;
const CX = SIZE / 2;
const CY = SIZE / 2 - 10;
const R = 130;
const STROKE = 24;

function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy - r * Math.sin(rad) };
}

function arcPath(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polar(cx, cy, r, startAngle);
  const end = polar(cx, cy, r, endAngle);
  const largeArcFlag = Math.abs(startAngle - endAngle) > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
}

export default function RiskMeter({ score, stageLabel, analysing }: RiskMeterProps) {
  const band = bandForScore(score);
  const color = colorForBand(band);
  const [displayScore, setDisplayScore] = useState(0);
  const springProgress = useSpring(0, { stiffness: 60, damping: 18, mass: 0.6 });

  const fullPath = arcPath(CX, CY, R, 180, 0);

  useEffect(() => {
    springProgress.set(score / 100);
    const controls = animate(displayScore, score, {
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplayScore(Math.round(v)),
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [score]);

  const tickAngle = 180 - 1.8 * 75;
  const tickInner = polar(CX, CY, R - 14, tickAngle);
  const tickOuter = polar(CX, CY, R + 14, tickAngle);
  const tickLabelPos = polar(CX, CY, R + 32, tickAngle);

  const danger = band === "danger";

  return (
    <div className="relative flex flex-col items-center">
      <div className={`relative ${danger ? "animate-pulse-glow" : ""}`}>
        <svg
          width={SIZE}
          height={SIZE / 2 + 30}
          viewBox={`0 0 ${SIZE} ${SIZE / 2 + 30}`}
          className={danger ? "drop-shadow-[0_0_45px_rgba(255,59,78,0.55)]" : ""}
        >
          <path d={fullPath} stroke="#232C42" strokeWidth={STROKE} fill="none" strokeLinecap="round" />
          <motion.path
            d={fullPath}
            stroke={color}
            strokeWidth={STROKE}
            fill="none"
            strokeLinecap="round"
            style={{ pathLength: springProgress }}
            strokeDasharray="1 1"
          />
          <line
            x1={tickInner.x}
            y1={tickInner.y}
            x2={tickOuter.x}
            y2={tickOuter.y}
            stroke="#FF3B4E"
            strokeWidth={3}
          />
          <text
            x={tickLabelPos.x}
            y={tickLabelPos.y}
            textAnchor="middle"
            fill="#FF3B4E"
            fontFamily="var(--font-jetbrains-mono)"
            fontSize={11}
            fontWeight={700}
            letterSpacing={1}
          >
            INTERRUPT
          </text>
        </svg>

        {analysing && (
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
            <div className="h-full w-full bg-[length:400px_100%] bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
          </div>
        )}

        <div className="absolute inset-x-0 top-[64%] flex -translate-y-1/2 flex-col items-center">
          <span
            className="font-mono font-bold text-[56px] sm:text-[72px] leading-none mono-tabular"
            style={{ color }}
          >
            {displayScore}
          </span>
          {analysing && (
            <span className="mt-1 text-[11px] font-mono text-accent tracking-widest animate-pulse">
              ANALYSING…
            </span>
          )}
        </div>
      </div>
      <p className="mt-2 font-mono text-sm tracking-[0.2em] text-text-muted uppercase text-center">
        {stageLabel || "No stage detected"}
      </p>
    </div>
  );
}
