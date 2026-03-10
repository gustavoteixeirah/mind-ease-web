"use client";

import { useTask } from "@/presentation/context/TaskContext";
import { DateNavigator } from "@/components/DateNavigator";
import { TaskGroup } from "@/components/tasks/TaskGroup";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import HeaderSimple from "@/components/ui/header-simple";

export default function TasksPage() {
  const {
    tasksByEffort,
    detailsVisible,
    setDetailsVisible,
    viewedDate,
    isLoading,
  } = useTask();

  const hasAnyTasks =
    tasksByEffort.leve.length > 0 ||
    tasksByEffort.normal.length > 0 ||
    tasksByEffort.exigente.length > 0;

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Header */}
      <HeaderSimple title="Suas tarefas">
        <div className="flex items-center gap-2">
          <Switch
            id="details-toggle"
            checked={detailsVisible}
            onCheckedChange={setDetailsVisible}
            className="hover:cursor-pointer"
          />
          <Label
            htmlFor="details-toggle"
            className="text-sm text-[#757373] cursor-pointer"
          >
            Ver detalhes
          </Label>
        </div>
      </HeaderSimple>

      {/* Task list card */}
      <Card className="flex flex-col h-full gap-6 pb-28 md:pb-8 md:gap-10">
        {/* Navegador de datas */}
        <div className="p-4 md:px-6 md:pb-0">
          <DateNavigator />
        </div>

        <div className="h-full px-4 md:pl-6 md:pr-3 md:overflow-y-auto">
          {/* Loading state */}
          {isLoading && (
            <div className="flex flex-col gap-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-12 rounded-xl bg-[#F0EEEF] animate-pulse"
                />
              ))}
            </div>
          )}

          {/* Empty state */}
          {!isLoading && !hasAnyTasks && (
            <div className="flex flex-col items-center justify-center py-12 text-center gap-2">
              <p className="text-sm text-[#1D1A1A]">
                Nenhuma tarefa para este dia.
              </p>
              <p className="text-xs text-[#757373]">
                Use o botão + para criar uma nova.
              </p>
            </div>
          )}

          {/* Task groups */}
          {!isLoading && hasAnyTasks && (
            <div className="flex flex-col gap-12">
              <TaskGroup
                effort="leve"
                tasks={tasksByEffort.leve}
                detailed={detailsVisible}
                viewedDate={viewedDate}
              />
              <TaskGroup
                effort="normal"
                tasks={tasksByEffort.normal}
                detailed={detailsVisible}
                viewedDate={viewedDate}
              />
              <TaskGroup
                effort="exigente"
                tasks={tasksByEffort.exigente}
                detailed={detailsVisible}
                viewedDate={viewedDate}
              />
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
