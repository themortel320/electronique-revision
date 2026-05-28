"use client";

import katex from "katex";
import { useMemo } from "react";

interface FormulaProps {
  math: string;
  display?: boolean;
  className?: string;
}

export function Formula({ math, display = false, className = "" }: FormulaProps) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(math, {
        throwOnError: false,
        displayMode: display,
        output: "html",
        trust: false,
      });
    } catch {
      return `<span class="text-red-400">${math}</span>`;
    }
  }, [math, display]);

  return (
    <span
      className={`katex-render ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

interface FormulaCardProps {
  expr: string;
  latexExpr?: string;
  use: string;
  tip?: string;
  color?: "violet" | "blue" | "amber" | "emerald";
}

const colorMap = {
  violet: "from-violet-900/40 to-violet-800/20 border-violet-700/40 text-violet-300",
  blue:   "from-blue-900/40 to-blue-800/20 border-blue-700/40 text-blue-300",
  amber:  "from-amber-900/40 to-amber-800/20 border-amber-700/40 text-amber-300",
  emerald:"from-emerald-900/40 to-emerald-800/20 border-emerald-700/40 text-emerald-300",
};

export function FormulaCard({ expr, latexExpr, use, tip, color = "violet" }: FormulaCardProps) {
  const colors = colorMap[color];

  return (
    <div className={`rounded-2xl border bg-gradient-to-br ${colors} p-4 space-y-2`}>
      <div className="font-mono text-lg font-bold tracking-wide">
        {latexExpr ? (
          <Formula math={latexExpr} display />
        ) : (
          <span>{expr}</span>
        )}
      </div>
      <p className="text-white/70 text-sm">{use}</p>
      {tip && (
        <p className="text-xs text-white/40 border-t border-white/10 pt-2 mt-2">
          💡 {tip}
        </p>
      )}
    </div>
  );
}
