"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

type Props = {
  title: string;
  subtitle?: string;
  emoji: string;
  accentClass?: string; // e.g. "text-amber-400"
  borderClass?: string; // e.g. "border-amber-700/30"
  bgClass?: string;     // e.g. "bg-amber-900/10"
  defaultOpen?: boolean;
  children: React.ReactNode;
};

export function CourseGroup({
  title, subtitle, emoji,
  accentClass = "text-violet-400",
  borderClass = "border-white/10",
  bgClass = "bg-white/3",
  defaultOpen = true,
  children,
}: Props) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={`rounded-2xl border ${borderClass} ${bgClass} overflow-hidden`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3 px-5 py-4 text-left hover:bg-white/3 transition-colors"
      >
        <span className="text-xl">{emoji}</span>
        <div className="flex-1">
          <p className={`font-bold text-sm ${accentClass}`}>{title}</p>
          {subtitle && <p className="text-xs text-white/35 mt-0.5">{subtitle}</p>}
        </div>
        <ChevronDown
          className={`h-4 w-4 text-white/25 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="border-t border-white/8 p-3 space-y-2">
          {children}
        </div>
      )}
    </div>
  );
}
