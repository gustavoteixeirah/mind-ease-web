"use client";

import { useRouter } from "next/navigation";
import { useFocus } from "@/presentation/context/FocusContext";
import { useIsMobile } from "@/hooks/useIsMobile";
import { TimerInline } from "./TimerInline";
import { cn } from "@/lib/utils";

interface FocusFooterProps {
  onReopen?: () => void;
}

export function FocusFooter({ onReopen }: FocusFooterProps) {
  const router = useRouter();
  const isMobile = useIsMobile();

  const { activeTask, timerState, isPaused, formattedTime, label, progress } =
    useFocus();

  if (!activeTask || timerState === "idle" || timerState === "cycle_done")
    return null;

  const isRunning =
    (timerState === "focusing" ||
      timerState === "on_break" ||
      timerState === "on_long_rest") &&
    !isPaused;

  if (!isRunning) return null;

  const handleExpand = () => {
    if (isMobile) {
      router.push("/focus");
    } else {
      onReopen?.();
    }
  };

  return (
    <div
      role="status"
      aria-label={`Modo Foco ativo: ${activeTask.title}`}
      onClick={handleExpand}
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 flex flex-row items-center justify-center gap-2 px-4 py-1",
        "mb-16 md:mb-0 md:left-auto md:right-4 md:bottom-4 md:rounded-2xl md:w-80 md:border md:border-gray-200 md:shadow-xl",
        "bg-[rgb(var(--user-theme))] border-t border-gray-100",
        "transition-all duration-300 ease-out",
        "hover:bg-[#1D1A1A] hover:text-white hover:cursor-pointer",
      )}
    >
      <div className="flex gap-1 items-center">
        <p className="text-sm leading-none mb-0.5">{label}</p>
        {/* <p className="text-sm font-medium truncate leading-snug">
          {activeTask.title}
        </p> */}
      </div>
      <div>·</div>
      <div>
        <TimerInline progress={progress} formattedTime={formattedTime} />
      </div>
    </div>
  );
}
