"use client";

import { Card } from "@/components/ui/card";
import TaskForm from "@/components/task-form";
import HeaderBackButton from "@/components/ui/header-back-button";

export default function novaTarefa() {
  return (
    <>
      <HeaderBackButton title="Criar nova tarefa" />
      <Card className="p-6 pt-10">
        <TaskForm onSubmit={(task) => console.log(task)} />
      </Card>
    </>
  );
}
