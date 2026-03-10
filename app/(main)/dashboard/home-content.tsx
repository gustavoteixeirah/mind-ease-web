"use client";

import Link from "next/link";
import { useState } from "react";
import { Target, Leaf, CheckSquare, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTasks } from "@/lib/tasks/tasks-context";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { useStackApp, useUser as useStackUser } from "@stackframe/stack";
import type { EnergyLevel } from "@/types";
import { RadioButton } from "@/components/ui/radio-button";
import { useUser } from "@/presentation/context/UserContext";
import { useTask } from "@/presentation/context/TaskContext";
import { TaskCard } from "@/components/tasks/TaskCard";

type EnergyState = "calmo" | "presente" | "focado";

const weekdays = [
  "Domingo",
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
];
const months = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
];

function formatDate(date: Date) {
  return `${weekdays[date.getDay()]} - ${date.getDate()} de ${months[date.getMonth()]}`;
}

export function HomeContent() {
  // const user = useUser();
  // const userName =
  //   user?.displayName?.split(" ")[0] ||
  //   user?.primaryEmail?.split("@")[0] ||
  //   "Jane";
  const stackUser = useStackUser();
  const userName =
    stackUser?.displayName?.split(" ")[0] ||
    stackUser?.primaryEmail?.split("@")[0] ||
    "Jane";
  const { todayEnergy, setTodayEnergy, isLoading: userLoading } = useUser();
  const { focusNowTask, todayTasks, isLoading: tasksLoading } = useTask();
  const today = formatDate(new Date());
  const isLoading = userLoading || tasksLoading;

  const energyOptions: {
    value: EnergyLevel;
    label: string;
    icon: React.ElementType;
  }[] = [
    { value: "calmo", label: "Calmo", icon: Leaf },
    { value: "presente", label: "Presente", icon: Circle },
    { value: "focado", label: "Focado", icon: Target },
  ];

  return (
    <>
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-6 pt-8 md:pt-2 md:p-6">
        <div className="flex items-center gap-4">
          <div
            className="size-12 shrink-0 rounded-full bg-[rgb(var(--user-theme))] sm:size-14"
            aria-hidden="true"
          />
          <div>
            <h1
              className="text-[#1a1a1a] font-atkinson leading-none"
              style={{ fontSize: "var(--title-font-size)" }}
            >
              Olá, {userName}
            </h1>
            <p
              className="text-[#6b6b6b] font-atkinson"
              aria-label={`Data: ${today}`}
              style={{ fontSize: "var(--label-font-size)" }}
            >
              {today}
            </p>
          </div>
        </div>
        <div
          className="flex flex-col gap-2"
          role="group"
          aria-label="Como está sua energia agora?"
        >
          <p
            className="font-normal text-[#1a1a1a]"
            style={{ fontSize: "var(--body-font-size)" }}
          >
            Como está sua energia agora?
          </p>
          <div
            className="flex flex-wrap gap-2"
            role="group"
            aria-label="Nível de energia"
          >
            {energyOptions.map(({ value, label, icon }) => (
              <RadioButton
                key={value}
                id={`energy-${value}`}
                value={value}
                label={label}
                icon={icon}
                checked={todayEnergy === value}
                onChange={(val) => {
                  if (val) setTodayEnergy(val as EnergyLevel);
                }}
                disabled={isLoading}
              />
            ))}
          </div>
        </div>
      </header>
      <Card className="p-6 pb-25 flex flex-col gap-7 md:pb-10 md:flex-1 md:min-h-0 md:pr-0">
        <div className="flex flex-col gap-7 md:overflow-y-auto md:flex-1 md:min-h-0 md:pr-4">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-12 rounded-xl bg-muted animate-pulse"
                />
              ))}
            </div>
          ) : (
            <>
              {/* Foque agora */}
              <section aria-labelledby="foque-agora-heading">
                <h2
                  id="foque-agora-heading"
                  style={{ fontSize: "var(--title-font-size)" }}
                  className="font-atkinson text-foreground"
                >
                  Foque agora
                </h2>
                <p
                  style={{ fontSize: "var(--label-font-size)" }}
                  className="text-muted-foreground mb-3"
                >
                  Escolhida para seu momento.
                </p>

                {focusNowTask ? (
                  <TaskCard task={focusNowTask} />
                ) : (
                  <p
                    style={{ fontSize: "var(--body-font-size)" }}
                    className="text-muted-foreground"
                  >
                    {todayEnergy
                      ? "Nenhuma tarefa pendente para seu nível de energia."
                      : "Selecione sua energia para ver a sugestão de foco."}
                  </p>
                )}
              </section>
              <hr />

              {/* Hoje */}
              <section aria-labelledby="hoje-heading">
                <h2
                  id="hoje-heading"
                  style={{ fontSize: "var(--title-font-size)" }}
                  className="font-atkinson text-foreground mb-3"
                >
                  Hoje
                </h2>

                {(() => {
                  const otherTasks = todayTasks
                    .filter((t) => t.id !== focusNowTask?.id)
                    .slice(0, 3);

                  return otherTasks.length === 0 ? (
                    <p
                      style={{ fontSize: "var(--body-font-size)" }}
                      className="text-muted-foreground"
                    >
                      Nenhuma outra tarefa para hoje.
                    </p>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {otherTasks.map((task) => (
                        <TaskCard key={task.id} task={task} />
                      ))}
                    </div>
                  );
                })()}

                <Button
                  asChild
                  className="mt-4 w-full rounded-xl bg-[#1D1A1A] text-white hover:bg-[#333]"
                >
                  <Link href="/tarefas">Ver todas</Link>
                </Button>
              </section>
            </>
          )}
        </div>
      </Card>
    </>
  );
}
