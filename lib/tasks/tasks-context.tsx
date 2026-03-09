"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { TaskItem } from "./types";

type TasksContextValue = {
  tasks: TaskItem[];
  focusNowId: string | null;
  toggleTask: (id: string) => void;
  setFocusNow: (id: string | null) => void;
  addTask: (task: Omit<TaskItem, "id">) => void;
  /** Tarefa selecionada para "Foque agora" */
  focusNowTask: TaskItem | null;
  /** Tarefas para a seção "Hoje" (mesmo dia ou sem data) */
  todayTasks: TaskItem[];
};

const TasksContext = createContext<TasksContextValue | null>(null);

const initialTasks: TaskItem[] = [
  { id: "1", title: "Revisar apresentação", isFocus: true },
  { id: "2", title: "Escrever dissertação", isFocus: true },
  { id: "3", title: "Ler 3 capítulos", isFocus: true },
  { id: "4", title: "Escrever e-mails", done: true },
];

export function TasksProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<TaskItem[]>(initialTasks);
  const [focusNowId, setFocusNowId] = useState<string | null>("1");

  const toggleTask = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  }, []);

  const setFocusNow = useCallback((id: string | null) => {
    setFocusNowId(id);
  }, []);

  const addTask = useCallback((task: Omit<TaskItem, "id">) => {
    const id = String(Date.now());
    setTasks((prev) => [...prev, { ...task, id }]);
  }, []);

  const focusNowTask = useMemo(() => {
    if (!focusNowId) return null;
    return tasks.find((t) => t.id === focusNowId) ?? null;
  }, [tasks, focusNowId]);

  const todayTasks = useMemo(
    () => tasks.filter((t) => !t.date || t.date === new Date().toISOString().slice(0, 10)),
    [tasks]
  );

  const value = useMemo(
    () => ({
      tasks,
      focusNowId,
      toggleTask,
      setFocusNow,
      addTask,
      focusNowTask,
      todayTasks,
    }),
    [tasks, focusNowId, toggleTask, setFocusNow, addTask, focusNowTask, todayTasks]
  );

  return (
    <TasksContext.Provider value={value}>{children}</TasksContext.Provider>
  );
}

export function useTasks(): TasksContextValue {
  const ctx = useContext(TasksContext);
  if (!ctx) throw new Error("useTasks must be used inside TasksProvider");
  return ctx;
}
