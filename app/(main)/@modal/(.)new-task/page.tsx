"use client";

import { useRouter } from "next/navigation";
import TaskForm from "@/components/task-form";
import { useTask } from "@/presentation/context/TaskContext";
import { useFocus } from "@/presentation/context/FocusContext";
import { Card } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/useIsMobile";
import { NewTask } from "@/types/task";
import ModalPanel from "@/components/tasks/ModalPanel";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import HeaderBackButton from "@/components/ui/header-back-button";

export default function NewTaskModal() {
  const router = useRouter();
  const { createTask } = useTask();
  const { startFocus } = useFocus();
  const isMobile = useIsMobile();

  // Checa se está no mobile ou desktop para evitar problemas de mismatch no SSR
  // useIsMobile inicialmente retorna false
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Evita scroll do body no mobile quando modal aberto
  useEffect(() => {
    if (mounted && isMobile) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [mounted, isMobile]);

  const handleSubmit = async (data: NewTask) => {
    await createTask(data);
    router.back();
  };

  const handleSubmitWithFocus = async (data: NewTask) => {
    const created = await createTask(data);
    startFocus(created, { path: "/home", viewedDate: null });
    router.back();
  };

  return (
    <>
      {isMobile ? (
        <>
          <div
            className="fixed inset-0 bg-white z-10 overflow-y-auto"
            style={{
              backgroundColor: "var(--background)",
              backgroundImage:
                "radial-gradient(circle at top left, rgb(var(--user-theme) / 0.5) 0%, transparent 60%)",
              backgroundRepeat: "no-repeat",
            }}
          >
            <HeaderBackButton title="Criar nova tarefa" />
            <Card className="p-6 pt-10 pb-25">
              <TaskForm
                mode="create"
                onSubmit={handleSubmit}
                onSubmitWithFocus={handleSubmitWithFocus}
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
              {/* Header */}
              <ModalPanel onClose={() => router.back()} mode="create" />
              {/* Form */}
              <div className="flex-1 min-h-0 px-6 pb-6 overflow-y-auto scroll-smooth">
                <TaskForm
                  mode="create"
                  onSubmit={handleSubmit}
                  onSubmitWithFocus={handleSubmitWithFocus}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
