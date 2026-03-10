"use client";

import { useRouter } from "next/navigation";
import { useTask } from "@/presentation/context/TaskContext";
import { useFocus } from "@/presentation/context/FocusContext";
import { Card } from "@/components/ui/card";
import TaskForm from "@/components/task-form";
import { NewTask } from "@/types/task";
import { useParams } from "next/navigation";
import { useIsMobile } from "@/hooks/useIsMobile";
import ModalPanel from "@/components/tasks/ModalPanel";
import { useEffect, useState } from "react";
import HeaderBackButton from "@/components/ui/header-back-button";

export default function TaskDetailsModal() {
  const router = useRouter();
  const { deleteTask, updateTask } = useTask();
  const { id } = useParams();
  const { tasks } = useTask();
  const task = tasks.find((t) => t.id === id);
  const isMobile = useIsMobile();

  // Checa se está no mobile ou desktop para evitar problemas de mismatch no SSR
  // useIsMobile inicialmente retorna false
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const handleSubmit = async (data: NewTask) => {
    await updateTask(task.id, data);
    router.back();
  };

  const handleDelete = async () => {
    await deleteTask(task.id);
    router.back();
  };

  return (
    <>
      {isMobile ? (
        <>
          <div
            className="absolute inset-0 bg-white z-10"
            style={{
              backgroundColor: "var(--background)",
              backgroundImage:
                "radial-gradient(circle at top left, rgb(var(--user-theme) / 0.5) 0%, transparent 60%)",
              backgroundRepeat: "no-repeat",
            }}
          >
            <HeaderBackButton title="Detalhes da tarefa" />
            <Card className="p-6 pt-10 pb-25">
              <TaskForm
                mode="edit"
                defaultValues={task}
                onSubmit={handleSubmit}
                onDelete={handleDelete}
              />
            </Card>
          </div>
        </>
      ) : (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={() => router.back()}
          />
          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] pointer-events-auto flex flex-col">
              <ModalPanel onClose={() => router.back()} mode="details" />
              <div className="flex-1 min-h-0 px-6 pb-6 overflow-y-auto scroll-smooth">
                <TaskForm
                  mode="edit"
                  defaultValues={task}
                  onSubmit={handleSubmit}
                  onDelete={handleDelete}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
