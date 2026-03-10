"use client";

import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface RadioButtonProps {
  id: string;
  value: string;
  label: string;
  checked: boolean;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
  icon?: LucideIcon;
}

export function RadioButton({
  id,
  value,
  label,
  checked,
  onChange,
  disabled,
  className,
  icon: Icon,
}: RadioButtonProps) {
  return (
    <button
      id={id}
      type="button"
      disabled={disabled}
      onClick={() => onChange(checked ? "" : value)}
      className={cn(
        // "flex-1 cursor-pointer select-none text-center",
        // "py-2 px-4 rounded-full border transition-all duration-200 text-[#1D1A1A] font-atkinson",
        // "border-border bg-[#F7F7F7]",
        // "shadow-[0_1px_3px_0_rgba(0,0,0,0.1)]",
        // "hover:border-[#1D1A1A] hover:cursor-pointer",
        "flex-1 cursor-pointer select-none",
        "flex items-center justify-center gap-1",
        "py-2 px-4 rounded-full border transition-all duration-200 text-[#1D1A1A] font-atkinson",
        "border-border bg-[#F7F7F7]",
        "shadow-[0_1px_3px_0_rgba(0,0,0,0.1)]",
        "hover:border-[#1D1A1A] hover:cursor-pointer",
        checked && "bg-[rgb(var(--user-theme))]",
        disabled && "opacity-50 cursor-not-allowed",
        className,
      )}
      style={{ fontSize: "var(--label-font-size)" }}
    >
      {Icon && <Icon className="size-3 shrink-0" aria-hidden />}
      {label}
    </button>
  );
}
