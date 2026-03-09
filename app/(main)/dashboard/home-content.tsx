"use client";

import Link from "next/link";
import { useState } from "react";
import { useUser } from "@stackframe/stack";
import { Target, Music, CheckSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTasks } from "@/lib/tasks/tasks-context";
import { cn } from "@/lib/utils";

type EnergyState = "calmo" | "presente" | "focado";

const weekdays = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
const months = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];

function formatDate(date: Date) {
  return `${weekdays[date.getDay()]} - ${date.getDate()} de ${months[date.getMonth()]}`;
}

export function HomeContent() {
  const user = useUser();
  const userName =
    user?.displayName?.split(" ")[0] ||
    user?.primaryEmail?.split("@")[0] ||
    "Jane";
  const [energy, setEnergy] = useState<EnergyState>("presente");
  const { focusNowTask, todayTasks, toggleTask, focusNowId } = useTasks();
  const today = formatDate(new Date());

  return (
    <div className="mx-auto max-w-3xl space-y-6 sm:space-y-8 p-4 sm:p-0">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="size-12 shrink-0 rounded-full bg-[#b8d4e8] sm:size-14" aria-hidden="true" />
          <div>
            <h1 className="text-xl font-bold text-[#1a1a1a] sm:text-2xl">Olá, {userName}</h1>
            <p className="text-sm text-[#6b6b6b]" aria-label={`Data: ${today}`}>{today}</p>
          </div>
        </div>
        <div className="flex flex-col gap-2" role="group" aria-label="Como está sua energia agora?">
          <p className="text-sm font-medium text-[#1a1a1a]">
            Como está sua energia agora?
          </p>
          <div className="flex flex-wrap gap-2">
            {(
              [
                { value: "calmo" as const, label: "Calmo", icon: Music },
                { value: "presente" as const, label: "Presente", icon: null },
                { value: "focado" as const, label: "Focado", icon: Target },
              ] as const
            ).map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => setEnergy(value)}
                aria-pressed={energy === value}
                aria-label={`Energia: ${label}`}
                className={cn(
                  "flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
                  energy === value
                    ? "border-[#7eb8da] bg-[#7eb8da]/10 text-[#1a1a1a]"
                    : "border-[#d0d0d0] bg-white text-[#6b6b6b] hover:border-[#a0a0a0]"
                )}
              >
                {Icon && <Icon className="size-4" aria-hidden="true" />}
                {label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <section className="rounded-2xl bg-white/80 p-4 shadow-sm sm:p-6" aria-labelledby="foque-agora-heading">
        <h2 id="foque-agora-heading" className="text-lg font-semibold text-[#1a1a1a]">Foque agora</h2>
        <p className="mb-4 text-sm text-[#6b6b6b]">Escolhida para seu momento.</p>
        <ul className="space-y-3" role="list">
          {focusNowTask ? (
            <li
              role="button"
              tabIndex={0}
              onClick={() => toggleTask(focusNowTask.id)}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggleTask(focusNowTask.id); } }}
              aria-label={focusNowTask.done ? `Tarefa concluída: ${focusNowTask.title}. Pressione Enter para desmarcar.` : `Tarefa: ${focusNowTask.title}. Pressione Enter para marcar como concluída.`}
              className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#e8e8e8] bg-white px-4 py-3 transition-colors hover:bg-[#f8f8f8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              {focusNowTask.done ? (
                <CheckSquare className="size-5 shrink-0 text-[#3b82f6]" />
              ) : (
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full border-2 border-[#6b6b6b]" />
              )}
              <span
                className={cn(
                  "flex-1",
                  focusNowTask.done ? "text-[#6b6b6b] line-through" : "text-[#1a1a1a]"
                )}
              >
                {focusNowTask.title}
              </span>
              <Target className="size-5 shrink-0 text-[#6b6b6b]" />
            </li>
          ) : (
            <li className="rounded-xl border border-dashed border-[#e8e8e8] px-4 py-3 text-center text-sm text-[#6b6b6b]">
              Nenhuma tarefa em foco.{" "}
              <Link href="/tarefas" className="font-medium text-[#1a1a1a] underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 rounded" aria-label="Ir para Tarefas e escolher uma tarefa em foco">
                Escolher na aba Tarefas
              </Link>
            </li>
          )}
        </ul>
      </section>

      <section className="rounded-2xl bg-white/80 p-4 shadow-sm sm:p-6" aria-labelledby="hoje-heading">
        <h2 id="hoje-heading" className="mb-4 text-lg font-semibold text-[#1a1a1a]">Hoje</h2>
        <ul className="space-y-3" role="list">
          {todayTasks.map((task) => (
            <li
              key={task.id}
              role="button"
              tabIndex={0}
              onClick={() => toggleTask(task.id)}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggleTask(task.id); } }}
              aria-label={task.done ? `Concluída: ${task.title}. Pressione Enter para desmarcar.` : `${task.title}. Pressione Enter para marcar como concluída.`}
              className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#e8e8e8] bg-white px-4 py-3 transition-colors hover:bg-[#f8f8f8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
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
              {!task.done && task.id === focusNowId && (
                <Target className="size-5 shrink-0 text-[#6b6b6b]" />
              )}
            </li>
          ))}
        </ul>
        <Button
          asChild
          className="mt-4 w-full rounded-xl bg-[#1a1a1a] text-white hover:bg-[#333] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          <Link href="/tarefas" aria-label="Ver todas as tarefas">Ver todas</Link>
        </Button>
      </section>
    </div>
  );
}
