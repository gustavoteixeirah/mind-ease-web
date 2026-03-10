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

export default function TaskDetailsModal() {
  const router = useRouter();
  const { deleteTask, updateTask } = useTask();
  const { id } = useParams();
  const { tasks } = useTask();
  const task = tasks.find((t) => t.id === id);

  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mobile = window.innerWidth < 768;
    setIsMobile(mobile);
    setMounted(true);
    if (mobile) {
      router.replace(`/task-details/${id}`);
    }
  }, []);

  // Don't render anything until we know the screen size
  if (!mounted || isMobile) return null;

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
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={() => router.back()}
      />
      {/* Modal panel */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto pointer-events-auto">
          {/* Header */}
          <ModalPanel onClose={() => router.back()} mode="details" />

          {/* Form */}
          <div className="px-6 pb-6">
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
  );
}
