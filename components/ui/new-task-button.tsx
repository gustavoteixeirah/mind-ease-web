"use client";

import { useRouter } from "next/navigation";

export function NewTaskButton() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/new-task");
  };

  return <button onClick={handleClick}>+</button>;
}
