import { AppSidebar } from "@/components/app-sidebar";
import { FocusPanelWrapper } from "@/components/foco/FocusPanelWrapper";
import { AppNav } from "@/components/navigation/AppNav";
import { PreferencesProvider } from "@/lib/preferences/preferences-context";
import { TasksProvider } from "@/lib/tasks/tasks-context";
import { stackServerApp } from "@/stack/server";
import { redirect } from "next/navigation";

export default async function AppLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  const user = await stackServerApp.getUser();
  if (!user) {
    redirect("/");
  }

  return (
    <TasksProvider>
      <PreferencesProvider>
        {/* <div className="md:flex md:flex-row md:p-7 md:pl-30 md:gap-3 md:h-screen md:overflow-hidden"> */}
        <div className="md:flex md:flex-row md:p-10 md:pl-30 md:gap-3 md:h-screen md:overflow-hidden">
          <AppNav />
          <main id="main-content" className="h-full w-full">
            {children}
          </main>
          <FocusPanelWrapper />
          {modal}
        </div>
      </PreferencesProvider>
    </TasksProvider>
  );
}
