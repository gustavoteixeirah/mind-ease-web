"use client";

import { useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks/useIsMobile";

export function NewTaskButton() {
  const router = useRouter();
  const isMobile = useIsMobile();

  const handleClick = () => {
    if (isMobile) {
      router.push("/new-task"); // full page navigation
    } else {
      router.push("/new-task"); // triggers @modal slot on desktop
    }
  };

  return <button onClick={handleClick}>+</button>;
}
