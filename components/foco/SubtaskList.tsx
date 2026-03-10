"use client";

import type { Subtask } from "@/types";

interface SubtaskListProps {
  subtasks: Subtask[];
  onToggle: (subtaskId: string) => void;
}

export function SubtaskList({ subtasks, onToggle }: SubtaskListProps) {
  if (subtasks.length === 0) return null;

  const completed = subtasks.filter((s) => s.completed).length;
  const total = subtasks.length;

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-gray-400">Sub-tarefas</span>
        <span className="text-xs text-gray-400">
          {completed}/{total}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1 bg-gray-100 rounded-full mb-4 overflow-hidden">
        <div
          className="h-full bg-[rgb(var(--user-theme))] rounded-full transition-all duration-500 ease-out"
          style={{ width: total > 0 ? `${(completed / total) * 100}%` : "0%" }}
          role="progressbar"
          aria-valuenow={completed}
          aria-valuemin={0}
          aria-valuemax={total}
        />
      </div>

      {/* Subtask items */}
      <ul className="flex flex-col gap-2">
        {subtasks.map((subtask) => (
          <SubtaskItem
            key={subtask.id}
            subtask={subtask}
            onToggle={() => onToggle(subtask.id)}
          />
        ))}
      </ul>
    </div>
  );
}

// --- SubtaskItem ---

interface SubtaskItemProps {
  subtask: Subtask;
  onToggle: () => void;
}

function SubtaskItem({ subtask, onToggle }: SubtaskItemProps) {
  return (
    <li>
      <button
        onClick={onToggle}
        aria-checked={subtask.completed}
        role="checkbox"
        className="
          w-full flex items-center gap-3
          px-4 py-3 rounded-xl
          bg-white border border-gray-100
          hover:border-gray-200 hover:bg-gray-50
          transition-all duration-150
          text-left group
        "
      >
        {/* Checkbox */}
        <span
          className={`
            shrink-0 w-5 h-5 rounded-full border-2
            flex items-center justify-center
            transition-all duration-200
            ${
              subtask.completed
                ? "bg-[rgb(var(--user-theme))] border-[rgb(var(--user-theme))]"
                : "border-gray-300 group-hover:border-[rgb(var(--user-theme))]"
            }
          `}
        >
          {subtask.completed && (
            <svg
              width="10"
              height="8"
              viewBox="0 0 10 8"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M1 4L3.5 6.5L9 1"
                stroke="#1D1A1A"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </span>

        {/* Text */}
        <span
          className={`
            text-sm leading-snug transition-colors duration-200
            ${
              subtask.completed ? "line-through text-gray-300" : "text-gray-700"
            }
          `}
        >
          {subtask.text}
        </span>
      </button>
    </li>
  );
}
