"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, LayoutList, Settings, Plus, LogOut } from "lucide-react";
import { useStackApp } from "@stackframe/stack";

// --- Items de nav ---

const navItems = [
  { href: "/dashboard", label: "Home", Icon: Home },
  { href: "/tasks", label: "Tarefas", Icon: LayoutList },
  { href: "/perfil", label: "Perfil", Icon: Settings },
];

export function DesktopSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const app = useStackApp();

  const handleNewTask = () => {
    router.push("/new-task");
  };

  const handleLogout = async () => {
    const user = await app.getUser();
    await user?.signOut();
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-[120px] z-40 flex flex-col items-center py-6 gap-2">
      {/* container */}
      <div className="flex flex-col items-center flex-1 w-[88px] bg-[#1D1A1A] rounded-[44px] py-6 gap-1">
        {/* links de nav */}
        <div className="flex flex-col items-center gap-1 flex-1 w-full px-3">
          {navItems.map(({ href, label, Icon }) => {
            const isActive = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex flex-col items-center gap-1 w-full py-3 px-2 rounded-2xl transition-colors",
                  isActive
                    ? "text-white"
                    : "text-[#757373] hover:text-[#C4C0C1]",
                )}
              >
                <Icon
                  className="w-5 h-5"
                  strokeWidth={isActive ? 2 : 1.5}
                  fill={isActive ? "currentColor" : "none"}
                />
                <span className="text-[10px] leading-none">{label}</span>
              </Link>
            );
          })}
        </div>

        {/* Botão de criar tasks */}
        <div className="w-full px-3 py-2">
          <button
            onClick={handleNewTask}
            aria-label="Criar nova tarefa"
            className="w-full aspect-square rounded-xl bg-[#DCE9F5] flex items-center justify-center hover:bg-blue-200 transition-colors"
          >
            <Plus className="w-5 h-5 text-[#1D1A1A]" strokeWidth={2} />
          </button>
        </div>

        {/* espaçamento */}
        <div className="flex-1" />

        {/* Sair */}
        <div className="w-full px-3 pb-2">
          <button
            onClick={handleLogout}
            aria-label="Sair"
            className="flex flex-col items-center gap-1 w-full py-3 px-2 rounded-2xl text-[#757373] hover:text-[#C4C0C1] transition-colors"
          >
            <LogOut className="w-5 h-5" strokeWidth={1.5} />
            <span className="text-[10px] leading-none">Sair</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
