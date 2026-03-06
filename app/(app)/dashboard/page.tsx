import { stackServerApp } from "@/stack/server";
import { HomeContent } from "./home-content";

export default async function DashboardPage() {
  const user = await stackServerApp.getUser();
  const userName = user?.displayName?.split(" ")[0] || user?.primaryEmail?.split("@")[0] || "Jane";

  return (
    <div className="p-6 md:p-8">
      <HomeContent userName={userName} />
    </div>
  );
}
