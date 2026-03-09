"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, LayoutList, Settings, Plus } from "lucide-react";

// --- Items de nav ---
const navItems = [
  { href: "/dashboard", label: "Home", Icon: Home },
  { href: "/tasks", label: "Tarefas", Icon: LayoutList },
  { href: "/perfil", label: "Perfil", Icon: Settings },
];

export function MobileNav() {
  const pathname = usePathname();
  const router = useRouter();

  const handleNewTask = () => {
    router.push("/new-task");
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#F0EEEF] flex items-center px-2 h-16">
      <div className="flex flex-1 items-center justify-around">
        {navItems.map(({ href, label, Icon }) => {
          const isActive = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-0.5 px-4 py-1 group"
              aria-current={isActive ? "page" : undefined}
            >
              <Icon
                className={cn(
                  "w-5 h-5 transition-colors",
                  isActive
                    ? "text-[#1D1A1A]"
                    : "text-[#757373] group-hover:text-[#757373]",
                )}
                fill={isActive ? "#D9D9D9" : "none"}
              />
              <span
                className={cn(
                  "text-[10px] transition-colors",
                  isActive
                    ? "text-[#1D1A1A]"
                    : "text-[#757373] group-hover:text-[#757373]",
                )}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Botão de criar tasks */}
      <button
        onClick={handleNewTask}
        aria-label="Criar nova tarefa"
        className="w-12 h-12 rounded-xl bg-[rgb(var(--user-theme))] flex items-center justify-center mr-2 hover:bg-[#757373] hover:text-[#F7F7F7] transition-colors"
      >
        <Plus className="w-5 h-5" strokeWidth={2} />
      </button>
    </nav>
  );
}
