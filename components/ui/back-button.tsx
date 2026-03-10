"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  onBack?: () => void; // custom handler — if provided, used instead of default behavior
  fallback?: string; // where to go if there's no history (defaults to '/home')
}

export function BackButton({ onBack, fallback = "/home" }: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }

    // If there's browser history to go back to, use it.
    // Otherwise fall back to a safe route.
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push(fallback);
    }
  };

  return (
    <button
      className="bg-[#F7F7F7] w-10 h-10 flex items-center justify-center rounded-full shadow-[0_1px_3px_0_rgba(0,0,0,0.2)]"
      onClick={handleBack}
      aria-label="Voltar"
    >
      <ArrowLeft strokeWidth={1.5} />
    </button>
  );
}
