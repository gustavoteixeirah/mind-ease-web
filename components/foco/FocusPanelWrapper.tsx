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
  const { activeTask, isPanelOpen, setIsPanelOpen } = useFocus();
  const pathname = usePathname();
  const isMobile = useIsMobile();

  const isOnFocusPage = pathname === "/focus";

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
        <aside className="md:w-80 md:h-full flex-shrink-0">
          <Card className="h-full flex flex-col overflow-hidden">
            <header className="px-6 pt-3 flex flex-row items-center justify-between flex-shrink-0">
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
