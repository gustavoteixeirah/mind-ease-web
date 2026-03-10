"use client";

import { useRouter } from "next/navigation";
import { useTask } from "@/presentation/context/TaskContext";
import { useFocus } from "@/presentation/context/FocusContext";
import HeaderBackButton from "@/components/ui/header-back-button";
import { Card } from "@/components/ui/card";
import TaskForm from "@/components/task-form";
import { useIsMobile } from "@/hooks/useIsMobile";

export default function NewTaskPage() {
  const router = useRouter();
  const { createTask } = useTask();
  const { startFocus } = useFocus();
  const isMobile = useIsMobile();

  const handleSubmit = async (data: NewTask) => {
    await createTask(data);
    router.back();
  };

  const handleSubmitWithFocus = async (data: NewTask) => {
    const created = await createTask(data);
    startFocus(created, { path: "/home", viewedDate: null });

    if (isMobile) {
      router.push("/focus");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <>
      <HeaderBackButton title="Criar nova tarefa" />
      <Card className="p-6 pt-10 pb-25">
        <TaskForm
          mode="create"
          onSubmit={handleSubmit}
          onSubmitWithFocus={handleSubmitWithFocus}
        />
      </Card>
    </>
  );
}
