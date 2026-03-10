"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { UserProvider } from "../context/UserContext";
import { TaskProvider } from "../context/TaskContext";
import { FocusProvider } from "../context/FocusContext";
import { useUser } from "../context/UserContext";

const fontSizeMap = {
  compacto: { label: "13px", body: "14px", title: "24px" },
  conforto: { label: "14px", body: "16px", title: "26px" },
  acessivel: { label: "16px", body: "18px", title: "32px" },
};

function ThemeApplier() {
  const { preferences } = useUser();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", preferences.colorTheme);
  }, [preferences.colorTheme]);

  return null;
}

function FontSizeApplier() {
  const { preferences } = useUser();

  useEffect(() => {
    const sizes = fontSizeMap[preferences.textSize] ?? fontSizeMap.conforto;
    const root = document.documentElement;
    root.style.setProperty("--label-font-size", sizes.label);
    root.style.setProperty("--body-font-size", sizes.body);
    root.style.setProperty("--title-font-size", sizes.title);
  }, [preferences.textSize]);

  return null;
}

interface ClientProvidersProps {
  userId: string | null;
  children: ReactNode;
}

export function ClientProviders({ userId, children }: ClientProvidersProps) {
  return (
    <UserProvider userId={userId}>
      <FontSizeApplier />
      <ThemeApplier />
      <TaskProvider>
        <FocusProvider>{children}</FocusProvider>
      </TaskProvider>
    </UserProvider>
  );
}
