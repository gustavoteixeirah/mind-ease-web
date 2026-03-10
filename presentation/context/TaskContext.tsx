"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import type { Task, NewTask, MentalEffort, EnergyLevel } from "@/types";
import { useUser } from "./UserContext";

const TODAY = new Date().toISOString().split("T")[0];

/** Maps the user's energy level to the matching mental effort tier. */
const energyToEffort: Record<EnergyLevel, MentalEffort> = {
  calmo: "leve",
  presente: "normal",
  focado: "exigente",
};

/* Retorna true se a tarefa pertence a uma determinada string de data ISO. */
function taskBelongsToDate(task: Task, date: string): boolean {
  switch (task.when) {
    case "agora":
    case "hoje":
      return date === TODAY;
    case "amanha": {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return date === tomorrow.toISOString().split("T")[0];
    }
    case "qualquer":
      return true;
    case "escolher":
      return task.scheduledDate === date;
    default:
      return false;
  }
}

interface TaskContextValue {
  // State
  tasks: Task[];
  viewedDate: string;
  detailsVisible: boolean;
  isLoading: boolean;

  // Derived lists (memoized)
  todayTasks: Task[];
  focusNowTask: Task | null;
  tasksByEffort: {
    leve: Task[];
    normal: Task[];
    exigente: Task[];
  };

  // Actions
  setViewedDate: (date: string) => void;
  setDetailsVisible: (visible: boolean) => void;
  createTask: (task: NewTask) => Promise<Task>;
  updateTask: (id: string, changes: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleComplete: (id: string) => Promise<void>;
  toggleSubtask: (taskId: string, subtaskId: string) => Promise<void>;
}

// --- Context ---

const TaskContext = createContext<TaskContextValue | null>(null);

// --- Provider ---

export function TaskProvider({ children }: { children: ReactNode }) {
  const { userId, todayEnergy } = useUser();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [viewedDate, setViewedDate] = useState<string>(TODAY);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Pega todas tasks do usuário current
  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    const loadTasks = async () => {
      try {
        const res = await fetch(`/api/tasks?userId=${userId}`);
        const data = await res.json();
        setTasks(data);
      } catch (err) {
        console.error("Failed to load tasks:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadTasks();
  }, [userId]);

  // --- Derived: tarefas de hoje, com listagem determinada pela energia ---

  const todayTasks = useMemo(() => {
    const forToday = tasks.filter((t) => taskBelongsToDate(t, TODAY));

    if (!todayEnergy) return forToday;

    const matchingEffort = energyToEffort[todayEnergy];
    const priorityScore: Record<Task["priority"], number> = {
      alta: 3,
      normal: 2,
      baixa: 1,
    };

    return [...forToday].sort((a, b) => {
      const aMatch = a.mentalEffort === matchingEffort ? 1 : 0;
      const bMatch = b.mentalEffort === matchingEffort ? 1 : 0;
      if (bMatch !== aMatch) return bMatch - aMatch;

      return priorityScore[b.priority] - priorityScore[a.priority];
    });
  }, [tasks, todayEnergy]);

  // --- Derived: a tarefa de "Focar Agora" ---

  const focusNowTask = useMemo(() => {
    if (!todayEnergy) return null;
    const matchingEffort = energyToEffort[todayEnergy];
    return (
      todayTasks.find(
        (t) => t.mentalEffort === matchingEffort && !t.completed,
      ) ?? null
    );
  }, [todayTasks, todayEnergy]);

  // --- Derived: tarefas do dia escolhido, agrupado por esforço ---

  // const tasksByEffort = useMemo(() => {
  //   const forDate = tasks.filter((t) => taskBelongsToDate(t, viewedDate));
  //   return {
  //     leve: forDate.filter((t) => t.mentalEffort === "leve"),
  //     normal: forDate.filter((t) => t.mentalEffort === "normal"),
  //     exigente: forDate.filter((t) => t.mentalEffort === "exigente"),
  //   };
  // }, [tasks, viewedDate]);

  const tasksByEffort = useMemo(() => {
    const forDate = tasks
      .filter((t) => taskBelongsToDate(t, viewedDate))
      .sort((a, b) => Number(a.completed) - Number(b.completed));

    return {
      leve: forDate.filter((t) => t.mentalEffort === "leve"),
      normal: forDate.filter((t) => t.mentalEffort === "normal"),
      exigente: forDate.filter((t) => t.mentalEffort === "exigente"),
    };
  }, [tasks, viewedDate]);

  const createTask = useCallback(
    async (newTask: NewTask): Promise<Task> => {
      if (!userId) throw new Error("No user logged in");

      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newTask, userId }),
      });
      const created: Task = await res.json();
      setTasks((prev) => [...prev, created]);
      return created;
    },
    [userId],
  );

  const updateTask = useCallback(async (id: string, changes: Partial<Task>) => {
    // Optimistic update
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...changes } : t)),
    );

    await fetch(`/api/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(changes),
    });
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    // Optimistic update
    setTasks((prev) => prev.filter((t) => t.id !== id));

    await fetch(`/api/tasks/${id}`, { method: "DELETE" });
  }, []);

  const toggleComplete = useCallback(
    async (id: string) => {
      const task = tasks.find((t) => t.id === id);
      if (!task) return;
      await updateTask(id, { completed: !task.completed });
    },
    [tasks, updateTask],
  );

  const toggleSubtask = useCallback(
    async (taskId: string, subtaskId: string) => {
      const task = tasks.find((t) => t.id === taskId);
      if (!task) return;

      const updatedSubtasks = task.subtasks.map((st) =>
        st.id === subtaskId ? { ...st, completed: !st.completed } : st,
      );

      await updateTask(taskId, { subtasks: updatedSubtasks });
    },
    [tasks, updateTask],
  );

  return (
    <TaskContext.Provider
      value={{
        tasks,
        viewedDate,
        detailsVisible,
        isLoading,
        todayTasks,
        focusNowTask,
        tasksByEffort,
        setViewedDate,
        setDetailsVisible,
        createTask,
        updateTask,
        deleteTask,
        toggleComplete,
        toggleSubtask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTask(): TaskContextValue {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error("useTask must be used inside <TaskProvider>");
  return ctx;
}
