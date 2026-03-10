"use client";

import type { ReactNode } from "react";
import { UserProvider } from "../context/UserContext";
import { TaskProvider } from "../context/TaskContext";
import { FocusProvider } from "../context/FocusContext";

interface ClientProvidersProps {
  userId: string | null;
  children: ReactNode;
}

export function ClientProviders({ userId, children }: ClientProvidersProps) {
  return (
    <UserProvider userId={userId}>
      <TaskProvider>
        <FocusProvider>{children}</FocusProvider>
      </TaskProvider>
    </UserProvider>
  );
}
