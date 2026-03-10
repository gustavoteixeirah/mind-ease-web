"use client";

import { useMemo } from "react";
import type { TimerState } from "@/types";

interface CircularTimerProps {
  progress: number; // 0–1, quanto do bloco atual já se passou
  formattedTime: string; // "13:20"
  label: string; // "Em foco" | "Em pausa" | etc.
  timerState: TimerState;
  size?: "sm" | "lg"; // sm = footer/panel, lg = full focus page
}

const SIZE_MAP = {
  sm: { diameter: 80, stroke: 4, fontSize: "text-lg", labelSize: "text-xs" },
  lg: { diameter: 220, stroke: 7, fontSize: "text-5xl", labelSize: "text-sm" },
};

// Cor do arco de progresso muda com base na fase em que estamos
const STATE_COLOR: Record<TimerState, string> = {
  idle: "#93c5fd", // blue-300
  focusing: "#3b82f6", // blue-500
  on_break: "#86efac", // green-300
  on_long_rest: "#6ee7b7", // emerald-300
  cycle_done: "#93c5fd", // blue-300
};

export function CircularTimer({
  progress,
  formattedTime,
  label,
  timerState,
  size = "lg",
}: CircularTimerProps) {
  const { diameter, stroke, fontSize, labelSize } = SIZE_MAP[size];

  const { radius, circumference, strokeDashoffset, cx } = useMemo(() => {
    const cx = diameter / 2;
    const radius = cx - stroke * 2;
    const circumference = 2 * Math.PI * radius;
    // Dashoffset goes from circumference (empty) → 0 (full)
    const strokeDashoffset = circumference * (1 - progress);
    return { radius, circumference, strokeDashoffset, cx };
  }, [diameter, stroke, progress]);

  const arcColor = STATE_COLOR[timerState];

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: diameter, height: diameter }}
      role="timer"
      aria-label={`${formattedTime} — ${label}`}
    >
      <svg
        width={diameter}
        height={diameter}
        className="-rotate-90 absolute inset-0"
        aria-hidden="true"
      >
        {/* Track ring */}
        <circle
          cx={cx}
          cy={cx}
          r={radius}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth={stroke}
        />

        {/* Progresso arc */}
        <circle
          cx={cx}
          cy={cx}
          r={radius}
          fill="none"
          stroke={arcColor}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{
            transition: "stroke-dashoffset 1s linear, stroke 0.6s ease",
          }}
        />
      </svg>

      {/* Tempo + label */}
      <div className="relative flex flex-col items-center leading-tight">
        <span
          className={`${fontSize} font-light tabular-nums tracking-tight text-gray-800`}
        >
          {formattedTime}
        </span>
        {size === "lg" && (
          <span className={`${labelSize} text-gray-400 mt-1`}>{label}</span>
        )}
      </div>
    </div>
  );
}
