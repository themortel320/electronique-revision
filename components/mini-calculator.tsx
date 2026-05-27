"use client";

import { Calculator, X } from "lucide-react";
import { useState } from "react";

const BUTTONS = [
  ["C", "±", "%", "÷"],
  ["7", "8", "9", "×"],
  ["4", "5", "6", "−"],
  ["1", "2", "3", "+"],
  ["0", ".", "⌫", "="],
];

function safeEval(expr: string): string {
  try {
    const sanitized = expr
      .replace(/×/g, "*")
      .replace(/÷/g, "/")
      .replace(/−/g, "-");
    // Only allow safe math characters
    if (!/^[0-9+\-*/.() ]+$/.test(sanitized)) return "Erreur";
    // eslint-disable-next-line no-new-func
    const result = new Function(`return (${sanitized})`)() as number;
    if (!isFinite(result)) return "Erreur";
    return String(parseFloat(result.toFixed(8)));
  } catch {
    return "Erreur";
  }
}

export function MiniCalculator() {
  const [open, setOpen] = useState(false);
  const [display, setDisplay] = useState("0");
  const [fresh, setFresh] = useState(true);

  const press = (key: string) => {
    if (key === "C") {
      setDisplay("0");
      setFresh(true);
      return;
    }
    if (key === "=") {
      const result = safeEval(display);
      setDisplay(result);
      setFresh(true);
      return;
    }
    if (key === "⌫") {
      setDisplay((d) => (d.length <= 1 ? "0" : d.slice(0, -1)));
      setFresh(false);
      return;
    }
    if (key === "±") {
      setDisplay((d) => (d.startsWith("-") ? d.slice(1) : "-" + d));
      return;
    }
    if (key === "%") {
      const result = safeEval(`(${display})/100`);
      setDisplay(result);
      setFresh(true);
      return;
    }
    const isOp = ["÷", "×", "−", "+"].includes(key);
    if (fresh && !isOp) {
      setDisplay(key === "." ? "0." : key);
      setFresh(false);
    } else {
      setDisplay((d) => (d === "0" && !isOp ? key : d + key));
      setFresh(false);
    }
  };

  const btnStyle = (key: string) => {
    const base = "flex items-center justify-center rounded-xl text-sm font-semibold transition active:scale-95 h-11";
    if (key === "=") return `${base} bg-brand-600 text-white hover:bg-brand-500 col-span-1`;
    if (["÷", "×", "−", "+"].includes(key))
      return `${base} bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-300 hover:bg-brand-200`;
    if (["C", "±", "%"].includes(key))
      return `${base} bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200 hover:bg-slate-300`;
    return `${base} bg-white border border-slate-200 dark:bg-slate-800 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700`;
  };

  return (
    <>
      {/* FAB bouton */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600 shadow-xl transition hover:bg-brand-500 active:scale-95"
        aria-label="Calculatrice"
      >
        {open ? <X className="h-5 w-5 text-white" /> : <Calculator className="h-5 w-5 text-white" />}
      </button>

      {/* Panel */}
      {open && (
        <div className="animate-fade-up fixed bottom-24 right-6 z-40 w-64 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl dark:border-slate-700 dark:bg-slate-900">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Calculatrice
          </p>
          {/* Affichage */}
          <div className="mb-3 overflow-hidden rounded-xl bg-slate-50 px-3 py-2 text-right dark:bg-slate-800">
            <p className="truncate text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">{display}</p>
          </div>

          {/* Touches */}
          <div className="grid grid-cols-4 gap-1.5">
            {BUTTONS.flat().map((key, i) => (
              <button
                key={`${key}-${i}`}
                type="button"
                onClick={() => press(key)}
                className={btnStyle(key)}
              >
                {key}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
