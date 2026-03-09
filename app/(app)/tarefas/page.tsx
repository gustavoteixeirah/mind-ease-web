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
    <div className="p-4 sm:p-6 md:p-8">
      <h1 className="text-xl font-bold text-[#1a1a1a] sm:text-2xl">Tarefas</h1>
      <p className="mt-2 text-sm text-[#6b6b6b]" id="tarefas-desc">
        Mesmas tarefas da Home. Marque concluída ou defina como &quot;Foque agora&quot;.
      </p>

      <ul className="mt-6 space-y-3" role="list" aria-labelledby="tarefas-desc">
        {tasks.map((task) => (
          <li
            key={task.id}
            role="article"
            className="flex flex-wrap cursor-pointer items-center gap-3 rounded-xl border border-[#e8e8e8] bg-white px-4 py-3 transition-colors hover:bg-[#f8f8f8] focus-within:ring-2 focus-within:ring-[var(--mindease-accent)] focus-within:ring-offset-2"
            onClick={() => toggleTask(task.id)}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggleTask(task.id); } }}
            tabIndex={0}
            aria-label={task.done ? `Concluída: ${task.title}` : task.title}
          >
            {task.done ? (
              <CheckSquare className="size-5 shrink-0 text-[#3b82f6]" aria-hidden="true" />
            ) : (
              <span className="flex size-5 shrink-0 items-center justify-center rounded border-2 border-[#6b6b6b]" aria-hidden="true" />
            )}
            <span
              className={cn(
                "flex-1 min-w-0",
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
              aria-pressed={focusNowId === task.id}
              aria-label={focusNowId === task.id ? `Remover de foco: ${task.title}` : `Definir como foco: ${task.title}`}
              className={cn(
                "rounded-lg px-2 py-1 text-xs font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
                focusNowId === task.id
                  ? "bg-[#7eb8da]/20 text-[#1a1a1a]"
                  : "text-[#6b6b6b] hover:bg-[#f0f0f0]"
              )}
            >
              {focusNowId === task.id ? "Em foco" : "Focar"}
            </button>
            {focusNowId === task.id && <Target className="size-5 text-[#6b6b6b]" aria-hidden="true" />}
          </li>
        ))}
      </ul>

      <p className="mt-8 text-sm text-[#6b6b6b]">
        <Link href="/dashboard" className="font-medium text-[#1a1a1a] underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 rounded" aria-label="Voltar à página inicial">
          Voltar à Home
        </Link>
      </p>
    </div>
  );
}
