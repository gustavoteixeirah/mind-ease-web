"use client";

import { MobileNav } from "./MobileNav";
import { DesktopSidebar } from "./DesktopSidebar";

// Vai determinar qual menu mostrar, baseado no tamanho da tela
export function AppNav() {
  return (
    <>
      <div className="md:hidden">
        <MobileNav />
      </div>
      <div className="hidden md:block">
        <DesktopSidebar />
      </div>
    </>
  );
}
