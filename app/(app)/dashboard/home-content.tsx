"use client";

import { useState } from "react";
import { Target, Music, CheckSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type TaskItem = {
  id: string;
  title: string;
  done?: boolean;
  isFocus?: boolean;
};

const FOCUS_NOW_TASKS: TaskItem[] = [
  { id: "1", title: "Revisar apresentação", isFocus: true },
];

const TODAY_TASKS: TaskItem[] = [
  { id: "2", title: "Escrever dissertação", isFocus: true },
  { id: "3", title: "Ler 3 capítulos", isFocus: true },
  { id: "4", title: "Escrever e-mails", done: true },
];

type EnergyState = "calmo" | "presente" | "focado";

const weekdays = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
const months = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];

function formatDate(date: Date) {
  return `${weekdays[date.getDay()]} - ${date.getDate()} de ${months[date.getMonth()]}`;
}

export function HomeContent({ userName }: { userName: string }) {
  const [energy, setEnergy] = useState<EnergyState>("presente");
  const today = formatDate(new Date());

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="size-14 shrink-0 rounded-full bg-[#b8d4e8]" />
          <div>
            <h1 className="text-2xl font-bold text-[#1a1a1a]">Olá, {userName}</h1>
            <p className="text-sm text-[#6b6b6b]">{today}</p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <p className="flex items-center gap-1.5 text-sm font-medium text-[#1a1a1a]">
            Como está sua energia agora?
            <span className="text-[#6b6b6b]" aria-hidden>ⓘ</span>
          </p>
          <div className="flex gap-2">
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
                className={cn(
                  "flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                  energy === value
                    ? "border-[#7eb8da] bg-[#7eb8da]/10 text-[#1a1a1a]"
                    : "border-[#d0d0d0] bg-white text-[#6b6b6b] hover:border-[#a0a0a0]"
                )}
              >
                {Icon && <Icon className="size-4" />}
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <section className="rounded-2xl bg-white/80 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[#1a1a1a]">Foque agora</h2>
        <p className="mb-4 text-sm text-[#6b6b6b]">Escolhida para seu momento.</p>
        <ul className="space-y-3">
          {FOCUS_NOW_TASKS.map((task) => (
            <li
              key={task.id}
              className="flex items-center gap-3 rounded-xl border border-[#e8e8e8] bg-white px-4 py-3"
            >
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full border-2 border-[#6b6b6b]" />
              <span className="flex-1 text-[#1a1a1a]">{task.title}</span>
              <Target className="size-5 text-[#6b6b6b]" />
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl bg-white/80 p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-[#1a1a1a]">Hoje</h2>
        <ul className="space-y-3">
          {TODAY_TASKS.map((task) => (
            <li
              key={task.id}
              className="flex items-center gap-3 rounded-xl border border-[#e8e8e8] bg-white px-4 py-3"
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
              {!task.done && task.isFocus && (
                <Target className="size-5 shrink-0 text-[#6b6b6b]" />
              )}
            </li>
          ))}
        </ul>
        <Button
          asChild
          className="mt-4 w-full rounded-xl bg-[#1a1a1a] text-white hover:bg-[#333]"
        >
          <a href="/tarefas">Ver todas</a>
        </Button>
      </section>
    </div>
  );
}
