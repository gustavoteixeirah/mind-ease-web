"use client";

import { useState } from "react";
import { useTask } from "@/presentation/context/TaskContext";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, ArrowLeft, ArrowRight } from "lucide-react";

// --- Helpers ---

function formatDateLabel(isoDate: string): string {
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const todayStr = today.toISOString().split("T")[0];
  const tomorrowStr = tomorrow.toISOString().split("T")[0];
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  if (isoDate === todayStr) return "Hoje";
  if (isoDate === tomorrowStr) return "Amanhã";
  if (isoDate === yesterdayStr) return "Ontem";

  return new Date(isoDate + "T00:00:00").toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });
}

function shiftDate(isoDate: string, days: number): string {
  const date = new Date(isoDate + "T00:00:00");
  date.setDate(date.getDate() + days);
  return date.toISOString().split("T")[0];
}

export function DateNavigator() {
  const { viewedDate, setViewedDate } = useTask();
  const [calendarOpen, setCalendarOpen] = useState(false);

  const handlePrev = () => setViewedDate(shiftDate(viewedDate, -1));
  const handleNext = () => setViewedDate(shiftDate(viewedDate, +1));

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center flex-row gap-2">
        {/* Dia anterior */}
        <button
          onClick={handlePrev}
          aria-label="Dia anterior"
          className="p-1 rounded-lg text-[#1D1A1A] hover:bg-[#F0EEEF] hover:cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-5 h-5" strokeWidth={1.5} />
        </button>

        {/* Date label */}
        <h2 className="text-lg font-medium text-[#1D1A1A]">
          {formatDateLabel(viewedDate)}
        </h2>
      </div>

      {/* Calendar picker + next day */}
      <div className="flex items-center gap-1">
        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
          <PopoverTrigger asChild>
            <button
              aria-label="Escolher data"
              className="p-1 rounded-lg text-[#1D1A1A] hover:bg-[#F0EEEF] hover:cursor-pointer transition-colors"
            >
              <CalendarIcon className="w-5 h-5" strokeWidth={1.5} />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={new Date(viewedDate + "T00:00:00")}
              onSelect={(date) => {
                if (date) {
                  setViewedDate(date.toISOString().split("T")[0]);
                  setCalendarOpen(false);
                }
              }}
            />
          </PopoverContent>
        </Popover>

        <button
          onClick={handleNext}
          aria-label="Próximo dia"
          className="p-1 rounded-lg text-[#1D1A1A] hover:bg-[#F0EEEF] hover:cursor-pointer transition-colors"
        >
          <ArrowRight className="w-5 h-5" strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}
