"use client";

import { useRouter, useParams } from "next/navigation";
import { useTask } from "@/presentation/context/TaskContext";
import { useFocus } from "@/presentation/context/FocusContext";
import HeaderBackButton from "@/components/ui/header-back-button";
import { Card } from "@/components/ui/card";
import TaskForm from "@/components/task-form";
import { NewTask } from "@/types/task";
import { useIsMobile } from "@/hooks/useIsMobile";

export default function TaskDetailsPage() {
  const router = useRouter();
  const { deleteTask, tasks, updateTask } = useTask();
  const { id } = useParams();
  const isMobile = useIsMobile();

  const task = tasks.find((t) => t.id === id);

  if (!task) return <div>Task not found</div>;

  const handleSubmit = async (data: NewTask) => {
    await updateTask(task.id, data);
    router.back();
  };

  const handleDelete = async () => {
    console.log("delte task");
    await deleteTask(task.id);
    router.back();
  };

  return (
    <>
      <HeaderBackButton title="Detalhes da tarefa" />
      <Card className="p-6 pt-10 pb-25">
        <TaskForm
          mode="edit"
          defaultValues={task}
          onSubmit={handleSubmit}
          onDelete={handleDelete}
        />
      </Card>
    </>
  );
}
