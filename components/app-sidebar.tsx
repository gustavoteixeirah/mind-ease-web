"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ListTodo, Settings, Plus, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/tarefas", label: "Tarefas", icon: ListTodo },
  { href: "/perfil", label: "Perfil", icon: Settings },
] as const;

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-[72px] shrink-0 flex-col items-center gap-2 rounded-2xl bg-[#1a1a1a] py-4 text-white">
      <nav className="flex flex-1 flex-col gap-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-1 rounded-xl px-3 py-2.5 text-xs font-medium transition-colors",
                isActive ? "bg-white/15 text-white" : "text-white/70 hover:bg-white/10 hover:text-white"
              )}
            >
              <Icon className="size-6" />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
      <button
        type="button"
        className="flex size-12 items-center justify-center rounded-xl bg-white/10 text-white hover:bg-white/15"
        aria-label="Adicionar"
      >
        <Plus className="size-6" />
      </button>
      <Link
        href="/"
        className="mt-auto flex flex-col items-center gap-1 rounded-xl px-3 py-2.5 text-xs font-medium text-white/70 hover:bg-white/10 hover:text-white"
      >
        <LogOut className="size-6" />
        <span>Sair</span>
      </Link>
    </aside>
  );
}
