"use client";

import { useFocus } from "@/presentation/context/FocusContext";
import { useTask } from "@/presentation/context/TaskContext";
import { CircularTimer } from "./CircularTimer";
import { SubtaskList } from "./SubtaskList";
import { Button } from "../ui/button";
import { Pause, Play } from "lucide-react";

export function FocusPanel() {
  const {
    isPaused,
    activeTask,
    formattedTime,
    label,
    nextLabel,
    progress,
    timerState,
    toggleTimer,
    addFiveMinutes,
  } = useFocus();

  const { toggleSubtask } = useTask();

  if (!activeTask) return null;

  // Timer está rodando quando está em um estado ativo E não está pausado
  const isRunning =
    (timerState === "focusing" ||
      timerState === "on_break" ||
      timerState === "on_long_rest") &&
    !isPaused;

  return (
    <div className="flex flex-col items-center gap-6 p-6 md:overflow-y-auto">
      {/* Task title */}
      <h2 className="text-2xl text-[#757373]">{activeTask.title}</h2>

      {/* Timer */}
      <CircularTimer
        progress={progress}
        formattedTime={formattedTime}
        label={label}
        timerState={timerState}
      />

      {/* Próximo + cycle count */}
      <p className="text-sm text-[#757373]">{nextLabel}</p>

      {/* Controls */}
      <div className="flex items-center gap-12">
        <button
          onClick={addFiveMinutes}
          className="underline hover:cursor-pointer"
        >
          + 5 minutos
        </button>
        <Button
          onClick={toggleTimer}
          className="w-16 h-10 hover:cursor-pointer hover:bg-[rgb(var(--user-theme))] hover:text-[#1D1A1A] transition-colors"
        >
          {isRunning ? <Pause /> : <Play />}
        </Button>
      </div>

      {/* Subtasks */}
      {activeTask.subtasks.length > 0 && (
        <SubtaskList
          subtasks={activeTask.subtasks}
          onToggle={(subtaskId) => toggleSubtask(activeTask.id, subtaskId)}
        />
      )}
    </div>
  );
}
