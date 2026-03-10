"use client";

import { Task } from "@/types";
import { useTask } from "@/presentation/context/TaskContext";
import { useFocus } from "@/presentation/context/FocusContext";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useRouter } from "next/navigation";
import { FocoDefaultIcon } from "@/components/icons/FocoDefaultIcon";
import { FocoAtivoIcon } from "../icons/FocoAtivoIcon";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: Task;
  detailed?: boolean;
  // Se user estiver na página de tasks, passa a viewedDate para armzenar o origem
  viewedDate?: string;
}

export function TaskCard({
  task,
  detailed = false,
  viewedDate,
}: TaskCardProps) {
  const { toggleComplete } = useTask();
  const { startFocus, activeTask, timerState, isPaused } = useFocus();
  const isMobile = useIsMobile();
  const router = useRouter();

  const isFocusActive =
    activeTask?.id === task.id &&
    (timerState === "focusing" ||
      timerState === "on_break" ||
      timerState === "on_long_rest") &&
    !isPaused;

  const handleFocus = (e: React.MouseEvent) => {
    e.stopPropagation();
    const origin = {
      path: viewedDate ? "/tasks" : "/home",
      viewedDate: viewedDate ?? null,
    } as const;

    startFocus(task, origin);

    if (isMobile) router.push("/focus");
  };

  // Quando o card for clicado
  const handleTaskDetails = (e: React.MouseEvent) => {
    const origin = {
      path: viewedDate ? "/tasks" : "/home",
      viewedDate: viewedDate ?? null,
    } as const;

    router.push(`/task-details/${task.id}`);
  };

  return (
    <div className="flex flex-col gap-1 w-full rounded-md border border-[#DDD9DA] bg-white transition-all duration-200 relative overflow-hidden hover:cursor-pointer hover:border-[#1D1A1A]">
      {/* Detalhado: tags row */}
      {detailed && task.tags.length > 0 && (
        <div className="flex gap-1.5 flex-wrap px-4 pt-3 pb-0">
          {task.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2.5 py-0.5 rounded-[3px] bg-[#F2EFF0] text-[#757373]"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Main row */}
      <div className="flex items-center gap-3 px-4 py-3">
        {/* Checkbox de conclusão */}
        <button
          onClick={() => toggleComplete(task.id)}
          aria-label={
            task.completed ? "Marcar como pendente" : "Marcar como concluída"
          }
          className="z-10 hover:cursor-pointer"
        >
          <span
            className={cn(
              "w-5 h-5 rounded-full border-[1.3px] flex items-center justify-center transition-all duration-200",
              task.completed
                ? "bg-[rgb(var(--user-theme))] border-[rgb(var(--user-theme))]"
                : "border-[#1D1A1A] hover:border-[#757373] hover:bg-gray-100",
            )}
          >
            {task.completed && (
              <svg
                width="10"
                height="8"
                viewBox="0 0 10 8"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M1 4L3.5 6.5L9 1"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </span>
        </button>

        {/* Title */}
        <span
          className={cn(
            "flex-1 text-sm leading-snug",
            task.completed ? "line-through text-[#C4C0C1]" : "text-[#1D1A1A]",
          )}
          onClick={handleTaskDetails}
        >
          {task.title}
        </span>

        {/* Foco icon — desaparece quando concluída a task */}
        {!task.completed && (
          <button
            onClick={handleFocus}
            aria-label="Entrar em modo foco"
            className="z-10 shrink-0 text-[#C4C0C1] hover:text-[#757373] transition-colors hover:cursor-pointer"
          >
            {isFocusActive ? (
              <FocoAtivoIcon className="w-4 h-4" />
            ) : (
              <FocoDefaultIcon className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      {/* Detalhado: prioridade + estimativa */}
      {detailed && (task.priority || task.timeEstimate) && (
        <div className="flex items-center justify-between px-4 pb-3 -mt-1">
          <span className="text-xs text-[#757373] capitalize">
            {task.priority ?? ""}
          </span>
          {task.timeEstimate && (
            <span className="text-xs text-[#757373]">{task.timeEstimate}</span>
          )}
        </div>
      )}
      {isFocusActive && (
        <div className="absolute right-0 top-0 w-2 h-full bg-[rgb(var(--user-theme))]" />
      )}
    </div>
  );
}
