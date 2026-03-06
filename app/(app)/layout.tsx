import { AppSidebar } from "@/components/app-sidebar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <main className="flex-1 overflow-auto bg-gradient-to-b from-[#f0f4f8] to-[#e8eef4]">
        {children}
      </main>
    </div>
  );
}
