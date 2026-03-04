"use client";

import { cn } from "@/lib/utils";

interface RadioButtonProps {
  id: string;
  value: string;
  label: string;
  checked: boolean;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export function RadioButton({
  id,
  value,
  label,
  checked,
  onChange,
  disabled,
  className,
}: RadioButtonProps) {
  return (
    <button
      id={id}
      type="button"
      disabled={disabled}
      onClick={() => onChange(checked ? "" : value)}
      className={cn(
        "flex-1 cursor-pointer select-none text-center",
        "py-2 px-4 rounded-full border text-sm transition-all duration-200 text-[#1D1A1A]",
        "border-border bg-[#F7F7F7]",
        "shadow-[0_1px_3px_0_rgba(0,0,0,0.2)]",
        checked && "bg-[rgb(var(--user-theme))]",
        disabled && "opacity-50 cursor-not-allowed",
        className,
      )}
    >
      {label}
    </button>
  );
}
