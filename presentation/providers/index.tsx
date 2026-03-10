import type { ReactNode } from "react";
import { getCurrentUserId } from "@/utils/users";
import { ClientProviders } from "./ClientProviders";

export async function AppProviders({ children }: { children: ReactNode }) {
  const userId = await getCurrentUserId();
  return <ClientProviders userId={userId}>{children}</ClientProviders>;
}
