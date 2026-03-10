"use client";

import { Task, MentalEffort } from "@/types";
import { TaskCard } from "./TaskCard";

interface TaskGroupProps {
  effort: MentalEffort;
  tasks: Task[];
  detailed?: boolean;
  viewedDate?: string;
}

const effortLabel: Record<MentalEffort, string> = {
  leve: "Leve",
  normal: "Normal",
  exigente: "Exigente",
};

export function TaskGroup({
  effort,
  tasks,
  detailed = false,
  viewedDate,
}: TaskGroupProps) {
  // Não renderizar grupos sem tarefas
  if (tasks.length === 0) return null;

  return (
    <div className="flex flex-col gap-4">
      {/* Esforço + Contagem (detalhada) */}
      <div className="flex items-center gap-2">
        <span
          className="text-[#1D1A1A] bg-[#F2EFF0] rounded-full px-5 py-[5px] font-atkinson"
          style={{ fontSize: "var(--label-font-size)" }}
        >
          {effortLabel[effort]}
        </span>
        {detailed && (
          <span
            className="text-[#757373] font-atkinson"
            style={{ fontSize: "var(--label-font-size)" }}
          >
            ({tasks.length})
          </span>
        )}
      </div>

      {/* Task cards */}
      <div className="flex flex-col gap-3">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            detailed={detailed}
            viewedDate={viewedDate}
          />
        ))}
      </div>
    </div>
  );
}
