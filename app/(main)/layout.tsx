import { AppSidebar } from "@/components/app-sidebar";
import { PreferencesProvider } from "@/lib/preferences/preferences-context";
import { TasksProvider } from "@/lib/tasks/tasks-context";
import { stackServerApp } from "@/stack/server";
import { redirect } from "next/navigation";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await stackServerApp.getUser();
  if (!user) {
    redirect("/");
  }

  return (
    <TasksProvider>
      <PreferencesProvider>
        <div className="flex min-h-screen">
          <a
            href="#main-content"
            className="sr-only rounded-lg bg-[#1a1a1a] px-4 py-2 text-white focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:block focus:h-auto focus:w-auto focus:overflow-visible focus:[clip:auto] focus:whitespace-normal focus:outline-none focus:ring-2 focus:ring-[#7eb8da] focus:ring-offset-2"
          >
            Pular para o conteúdo principal
          </a>
          <AppSidebar />
          <main id="main-content" className="flex-1 overflow-auto bg-gradient-to-b from-[#f5f7fa] to-[#e8ecf1]" role="main" aria-label="Conteúdo principal">
            {children}
          </main>
        </div>
      </PreferencesProvider>
    </TasksProvider>
  );
}
