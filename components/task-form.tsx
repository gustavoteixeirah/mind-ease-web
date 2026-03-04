"use client";

import {
  MentalEffort,
  NewTask,
  Priority,
  Subtask,
  Task,
  WhenOption,
} from "@/types";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { RadioButton } from "./ui/radio-button";
import { Textarea } from "./ui/textarea";
import React, { useState } from "react";
import { ArrowDown, X, Calendar as CalendarIcon } from "lucide-react";
import { FocoDefaultIcon } from "./icons/FocoDefaultIcon";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { toast } from "sonner";

type TaskFormProps = {
  defaultValues?: Task;
  onSubmit?: (data: Task) => void;
};

export default function TaskForm({ defaultValues, onSubmit }: TaskFormProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Form states
  const [title, setTitle] = useState(defaultValues?.title || "");
  const [when, setWhen] = useState(defaultValues?.when || undefined);
  const [scheduledDate, setScheduledDate] = useState<string | null>(
    defaultValues?.scheduledDate ?? null,
  );
  const [mentalEffort, setMentalEffort] = useState(
    defaultValues?.mentalEffort || undefined,
  );
  const [priority, setPriority] = useState(
    defaultValues?.priority || undefined,
  );
  const [timeEstimate, setTimeEstimate] = useState(
    defaultValues?.timeEstimate || "",
  );
  const [description, setDescription] = useState(
    defaultValues?.description || "",
  );

  // Subtasks states
  const [subTasks, setSubTasks] = useState<Subtask[]>(
    defaultValues?.subtasks || [],
  );
  const [newSubTask, setNewSubTask] = useState("");
  const [isAddingSubTask, setIsAddingSubTask] = useState(false);

  const handleAddSubTask = () => {
    if (newSubTask.trim()) {
      setSubTasks((prev) => [
        ...prev,
        { id: crypto.randomUUID(), text: newSubTask.trim(), completed: false },
      ]);
      setNewSubTask("");
    }
    setIsAddingSubTask(false);
  };

  const handleRemoveSubTask = (index: number) => {
    setSubTasks((prev) => prev.filter((_, i) => i !== index));
  };

  // Tags states
  const [tags, setTags] = useState<string[]>(defaultValues?.tags || []);
  const [newTag, setNewTag] = useState("");

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newTag.trim()) {
      if (!tags.includes(newTag.trim())) {
        setTags((prev) => [...prev, newTag.trim()]);
      }
      setNewTag("");
    }
  };

  const handleRemoveTag = (index: number) => {
    setTags((prev) => prev.filter((_, i) => i !== index));
  };

  // Recomendação Foco
  function parseTimeEstimateToMinutes(value: string): number {
    const hours = value.match(/(\d+)\s*h/i);
    const minutes = value.match(/(\d+)\s*min/i);
    return (
      (hours ? parseInt(hours[1]) * 60 : 0) +
      (minutes ? parseInt(minutes[1]) : 0)
    );
  }

  // Sugerir modo foco quando:
  // - Esforço mental for "exigente"
  // - Prioridade = "Alta" + Agora
  // - Tempo estimado > 30min
  // "Exigente" + "Alta" + "Agora"
  const isFocoRecommended =
    (mentalEffort === "exigente" && (when === "agora" || when === "hoje")) ||
    (!!timeEstimate && parseTimeEstimateToMinutes(timeEstimate) > 30) ||
    (priority === "alta" && when === "agora");

  //Submit
  const handleSubmit = () => {
    if (!title) {
      toast.error("O título da tarefa é obrigatório.");
      return;
    }

    const data: NewTask = {
      title,
      when,
      scheduledDate: when === "escolher" ? scheduledDate : null,
      mentalEffort,
      priority,
      timeEstimate,
      description,
      subtasks: subTasks,
      tags,
    };
    onSubmit?.(data as Task);
  };

  return (
    <div className="flex flex-col gap-10">
      {/* Titulo tarefa */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="nome-tarefa">Tarefa*</Label>
        <Input
          id="nome-tarefa"
          placeholder="O que precisa ser feito?"
          maxLength={100}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="placeholder:text-muted-foreground placeholder:text-sm"
        />
      </div>

      {/* Para quando isso deve ser feito? */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="when">Para quando isso deve ser feito?</Label>
        <div className="flex gap-3 justify-between flex-wrap">
          <RadioButton
            id="agora"
            value="agora"
            label="Agora"
            checked={when === "agora"}
            onChange={(val) => setWhen((val as WhenOption) || undefined)}
          />
          <RadioButton
            id="hoje"
            value="hoje"
            label="Hoje"
            checked={when === "hoje"}
            onChange={(val) => setWhen((val as WhenOption) || undefined)}
          />
          <RadioButton
            id="amanha"
            value="amanha"
            label="Amanhã"
            checked={when === "amanha"}
            onChange={(val) => setWhen((val as WhenOption) || undefined)}
          />
          <RadioButton
            id="qualquer"
            value="qualquer"
            label="Qualquer dia"
            checked={when === "qualquer"}
            onChange={(val) => setWhen((val as WhenOption) || undefined)}
          />

          {/* Escolher data */}
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className={cn(
                  "flex-1 py-2 px-4 rounded-full border text-sm text-center flex items-center gap-1 justify-center transition-all duration-200 text-[#1D1A1A]",
                  "border-border bg-[#F7F7F7]",
                  "shadow-[0_1px_3px_0_rgba(0,0,0,0.2)]",
                  when === "escolher" &&
                    scheduledDate &&
                    "bg-[rgb(var(--user-theme))]",
                )}
              >
                {scheduledDate && when === "escolher"
                  ? new Date(scheduledDate + "T00:00:00").toLocaleDateString(
                      "pt-BR",
                      { day: "2-digit", month: "short" },
                    )
                  : "Escolher data"}
                <CalendarIcon className="w-3.5 h-3.5" strokeWidth={1.5} />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={
                  scheduledDate
                    ? new Date(scheduledDate + "T00:00:00")
                    : undefined
                }
                onSelect={(date) => {
                  if (date) {
                    setScheduledDate(date.toISOString().split("T")[0]);
                    setWhen("escolher");
                  }
                }}
                disabled={{ before: new Date() }}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Esforço mental */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="esforco">Esforço mental</Label>
        <div className="flex gap-3 justify-between flex-wrap">
          <RadioButton
            id="leve"
            value="leve"
            label="Leve"
            checked={mentalEffort === "leve"}
            onChange={(val) =>
              setMentalEffort((val as MentalEffort) || undefined)
            }
          />
          <RadioButton
            id="normal"
            value="normal"
            label="Normal"
            checked={mentalEffort === "normal"}
            onChange={(val) =>
              setMentalEffort((val as MentalEffort) || undefined)
            }
          />
          <RadioButton
            id="exigente"
            value="exigente"
            label="Exigente"
            checked={mentalEffort === "exigente"}
            onChange={(val) =>
              setMentalEffort((val as MentalEffort) || undefined)
            }
          />
        </div>
      </div>

      {/* Sub-tarefas */}
      <div className="flex flex-col gap-2">
        <button
          className="underline text-left w-fit"
          onClick={() => setIsAddingSubTask(true)}
        >
          + Criar sub-tarefa
        </button>

        {/* Existing sub-tasks */}
        {subTasks.map((task, index) => (
          <div
            key={task.id}
            className="flex items-center justify-between px-4 py-3 border rounded-lg border-[#DDD9DA] text-[#1D1A1A]"
          >
            <span>{task.text}</span>
            <button
              onClick={() => handleRemoveSubTask(index)}
              className="text-[#1D1A1A] hover:opacity-60 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}

        {/* Input de subtask nova */}
        {isAddingSubTask && (
          <Input
            autoFocus
            placeholder="Nome da sub-tarefa"
            value={newSubTask}
            onChange={(e) => setNewSubTask(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAddSubTask();
              if (e.key === "Escape") setIsAddingSubTask(false);
            }}
            onBlur={handleAddSubTask}
            className="placeholder:text-muted-foreground placeholder:text-sm"
          />
        )}
      </div>

      {/* Mais detalhes */}
      <div className="p-4 border rounded-lg border-[#DDD9DA]">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setIsDetailsOpen((prev) => !prev)}
        >
          <h2 className="text-[#1D1A1A]">Mais detalhes</h2>
          <ArrowDown
            className="text-[#1D1A1A] w-[20px] transition-transform duration-200"
            style={{
              transform: isDetailsOpen ? "rotate(180deg)" : "rotate(0deg)",
            }}
            strokeWidth={1}
          />
        </div>

        {/* Content de mais detalhes */}
        <div
          className="overflow-hidden transition-all duration-300 ease-in-out"
          style={{ maxHeight: isDetailsOpen ? "500px" : "0px" }}
        >
          <div className="relative flex flex-col gap-6 mt-6">
            {/* Prioridade */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="data-tarefa">Prioridade</Label>
              <div className="flex gap-3 justify-between flex-wrap">
                <RadioButton
                  id="baixa"
                  value="baixa"
                  label="Baixa"
                  checked={priority === "baixa"}
                  onChange={(val) =>
                    setPriority((val as Priority) || undefined)
                  }
                />
                <RadioButton
                  id="prioridade-normal"
                  value="normal"
                  label="Normal"
                  checked={priority === "normal"}
                  onChange={(val) =>
                    setPriority((val as Priority) || undefined)
                  }
                />
                <RadioButton
                  id="alta"
                  value="alta"
                  label="Alta"
                  checked={priority === "alta"}
                  onChange={(val) =>
                    setPriority((val as Priority) || undefined)
                  }
                />
              </div>
            </div>
            {/* Tempo estimado */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="time-estimate">Tempo estimado</Label>
              <Input
                id="time-estimate"
                placeholder="ex: 25min, 1h, 2h..."
                maxLength={100}
                value={timeEstimate}
                onChange={(e) => setTimeEstimate(e.target.value)}
                className="placeholder:text-muted-foreground placeholder:text-sm"
              />
            </div>
            {/* Descrição */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                placeholder="Deixe mais contexto..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={200}
                className="placeholder:text-muted-foreground placeholder:text-sm"
              />
            </div>
            {/* Tags */}
            <div className="flex flex-col gap-2">
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-2 px-4 py-3 border rounded-lg border-[#DDD9DA] min-h-[56px]">
                <input
                  placeholder="Nome da tag"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={handleAddTag}
                  className="w-full bg-transparent outline-none text-sm placeholder:text-muted-foreground"
                />
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="flex items-center gap-1 px-3 py-1 bg-[#F0EEEF] rounded-sm text-sm text-[#1D1A1A]"
                  >
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(index)}
                      className="hover:opacity-60 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {isFocoRecommended && (
          <div className="text-[#757373] flex gap-2 items-center text-sm">
            <FocoDefaultIcon className="text-[#DDD9DA]" /> Essa tarefa combina
            com o modo foco.
          </div>
        )}
        <Button className="w-full border bg-transparent border-[#DDD9DA] font-normal text-[#757373]">
          Criar tarefa + Foco
        </Button>
        <Button className="w-full" onClick={handleSubmit}>
          Criar tarefa
        </Button>
      </div>
    </div>
  );
}
