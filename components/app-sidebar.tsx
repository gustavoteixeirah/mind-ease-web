"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useStackApp } from "@stackframe/stack";
import { Home, ListTodo, Settings, Plus, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/tarefas", label: "Tarefas", icon: ListTodo },
  { href: "/perfil", label: "Perfil", icon: Settings },
] as const;

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const app = useStackApp();

  const handleSignOut = async () => {
    await app.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <aside className="flex h-screen w-[72px] shrink-0 flex-col items-center gap-2 overflow-hidden rounded-2xl bg-[#1a1a1a] py-4 text-white" aria-label="Navegação principal">
      <nav className="min-h-0 flex-1 overflow-y-auto flex flex-col gap-1" aria-label="Menu">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              aria-current={isActive ? "page" : undefined}
              aria-label={label}
              className={cn(
                "flex flex-col items-center gap-1 rounded-xl px-3 py-2.5 text-xs font-medium transition-colors shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
                isActive ? "bg-white/20 text-white shadow-sm" : "text-white/70 hover:bg-white/10 hover:text-white"
              )}
            >
              <Icon className="size-6" aria-hidden="true" />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
      <Link
        href="/tarefas"
        className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        aria-label="Adicionar tarefa"
      >
        <Plus className="size-6" aria-hidden="true" />
      </Link>
      <button
        type="button"
        onClick={handleSignOut}
        aria-label="Sair da conta"
        className="flex shrink-0 flex-col items-center gap-1 rounded-xl px-3 py-2.5 text-xs font-medium text-white/70 hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        <LogOut className="size-6" aria-hidden="true" />
        <span>Sair</span>
      </button>
    </aside>
  );
}
