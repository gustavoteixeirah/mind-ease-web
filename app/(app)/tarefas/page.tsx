"use client";

import Link from "next/link";
import { useTasks } from "@/lib/tasks/tasks-context";
import { cn } from "@/lib/utils";
import { CheckSquare, Target } from "lucide-react";

/**
 * Página de Tarefas – integrada ao mesmo context da Home.
 * useTasks() fornece: tasks, toggleTask, setFocusNow, addTask, focusNowTask, todayTasks.
 * Quem for implementar o CRUD completo pode usar esses dados e funções.
 */
export default function TarefasPage() {
  const { tasks, toggleTask, setFocusNow, focusNowId } = useTasks();

  return (
    <div className="p-6 md:p-8">
      <h1 className="text-2xl font-bold text-[#1a1a1a]">Tarefas</h1>
      <p className="mt-2 text-sm text-[#6b6b6b]">
        Mesmas tarefas da Home. Marque concluída ou defina como &quot;Foque agora&quot;.
      </p>

      <ul className="mt-6 space-y-3">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#e8e8e8] bg-white px-4 py-3 transition-colors hover:bg-[#f8f8f8]"
            onClick={() => toggleTask(task.id)}
          >
            {task.done ? (
              <CheckSquare className="size-5 shrink-0 text-[#3b82f6]" />
            ) : (
              <span className="flex size-5 shrink-0 items-center justify-center rounded border-2 border-[#6b6b6b]" />
            )}
            <span
              className={cn(
                "flex-1",
                task.done ? "text-[#6b6b6b] line-through" : "text-[#1a1a1a]"
              )}
            >
              {task.title}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setFocusNow(focusNowId === task.id ? null : task.id);
              }}
              className={cn(
                "rounded-lg px-2 py-1 text-xs font-medium",
                focusNowId === task.id
                  ? "bg-[#7eb8da]/20 text-[#1a1a1a]"
                  : "text-[#6b6b6b] hover:bg-[#f0f0f0]"
              )}
            >
              {focusNowId === task.id ? "Em foco" : "Focar"}
            </button>
            {focusNowId === task.id && <Target className="size-5 text-[#6b6b6b]" />}
          </li>
        ))}
      </ul>

      <p className="mt-8 text-sm text-[#6b6b6b]">
        <Link href="/dashboard" className="font-medium text-[#1a1a1a] underline">
          Voltar à Home
        </Link>
      </p>
    </div>
  );
}
