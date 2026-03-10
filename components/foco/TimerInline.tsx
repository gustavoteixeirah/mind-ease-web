"use client";

interface TimerInlineProps {
  progress?: number; // 0–1, quanto do bloco atual já se passou
  formattedTime: string; // "13:20"
}

export function TimerInline({ progress, formattedTime }: TimerInlineProps) {
  return <div>{formattedTime}</div>;
}
