"use client";

import { useFocus } from "@/presentation/context/FocusContext";
import { FocusPanel } from "./FocusPanel";
import { FocusFooter } from "./FocusFooter";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useIsMobile } from "@/hooks/useIsMobile";
import { Card } from "../ui/card";
import { X } from "lucide-react";

export function FocusPanelWrapper() {
  const { activeTask } = useFocus();
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const pathname = usePathname();
  const isMobile = useIsMobile();

  const isOnFocusPage = pathname === "/focus";

  // Open panel when a new task is focused (desktop only)
  useEffect(() => {
    if (activeTask) setIsPanelOpen(true);
  }, [activeTask?.id]);

  if (!activeTask) return null;

  // Mobile: footer aparece em todo lugar exceto no /focus
  // Desktop: footer aparece quando o painel de foco está fechado
  const showFooter = isOnFocusPage
    ? false
    : isMobile
      ? true // mobile: always show footer when session active (not on /focus)
      : !isPanelOpen; // desktop: only when panel is closed

  // const showPanel = !isOnFocusPage && isPanelOpen;
  const showPanel = !isOnFocusPage && isPanelOpen && !isMobile; // panel only shows on desktop when open

  return (
    <>
      {showPanel && (
        <aside>
          <Card className="h-full">
            <header className="px-6 flex flex-row items-center justify-between">
              <h2 className="font-(--font-atkinson-family) text-[18px]">
                Modo Foco
              </h2>
              <button
                onClick={() => setIsPanelOpen(false)}
                className="text-[#DDD9DA] hover:cursor-pointer hover:text-[#757373] transition-colors"
              >
                <X />
              </button>
            </header>
            <FocusPanel />
          </Card>
        </aside>
      )}

      {showFooter && <FocusFooter onReopen={() => setIsPanelOpen(true)} />}
    </>
  );
}
