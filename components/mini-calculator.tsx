"use client";

import { Calculator, X, Delete } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const BUTTONS = [
  ["C",  "±",  "%",  "÷"],
  ["7",  "8",  "9",  "×"],
  ["4",  "5",  "6",  "−"],
  ["1",  "2",  "3",  "+"],
  ["0",  ".",  "⌫",  "="],
];

function safeEval(expr: string): string {
  try {
    const sanitized = expr
      .replace(/×/g, "*")
      .replace(/÷/g, "/")
      .replace(/−/g, "-");
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
  const [history, setHistory] = useState<string[]>([]);
  const panelRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  /* Close on outside click */
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        !btnRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  /* Keyboard support */
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setOpen(false); return; }
      const keyMap: Record<string, string> = {
        Enter: "=", Backspace: "⌫", "*": "×", "/": "÷", "-": "−",
      };
      const mapped = keyMap[e.key] ?? e.key;
      const valid = ["0","1","2","3","4","5","6","7","8","9","+","−","×","÷",".","=","⌫","C","%"].includes(mapped);
      if (valid) { e.preventDefault(); press(mapped); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, display, fresh]);

  const press = (key: string) => {
    if (key === "C") { setDisplay("0"); setFresh(true); return; }
    if (key === "=") {
      const result = safeEval(display);
      setHistory((h) => [`${display} = ${result}`, ...h].slice(0, 5));
      setDisplay(result);
      setFresh(true);
      return;
    }
    if (key === "⌫") {
      setDisplay((d) => (d.length <= 1 ? "0" : d.slice(0, -1)));
      setFresh(false);
      return;
    }
    if (key === "±") { setDisplay((d) => (d.startsWith("-") ? d.slice(1) : "-" + d)); return; }
    if (key === "%") { setDisplay(safeEval(`(${display})/100`)); setFresh(true); return; }
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
    const base =
      "flex items-center justify-center rounded-xl font-semibold transition-all active:scale-90 select-none touch-manipulation " +
      /* bigger on mobile */ "h-12 sm:h-11 text-base sm:text-sm";
    if (key === "=") return `${base} bg-violet-600 hover:bg-violet-500 text-white shadow shadow-violet-900/40`;
    if (["÷", "×", "−", "+"].includes(key)) return `${base} bg-violet-900/50 text-violet-300 hover:bg-violet-800/60 border border-violet-700/30`;
    if (["C", "±", "%"].includes(key)) return `${base} bg-white/8 text-white/70 hover:bg-white/15 border border-white/10`;
    if (key === "⌫") return `${base} bg-white/8 text-red-400 hover:bg-red-900/30 border border-white/10`;
    return `${base} bg-white/5 text-white hover:bg-white/12 border border-white/8`;
  };

  return (
    <div className="relative">
      {/* Trigger button */}
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex h-8 w-8 items-center justify-center rounded-xl border transition-all ${
          open
            ? "border-violet-500/60 bg-violet-600/20 text-violet-300"
            : "border-white/10 text-white/50 hover:bg-white/8 hover:text-white"
        }`}
        aria-label="Calculatrice"
        title="Calculatrice (raccourci clavier actif quand ouverte)"
      >
        <Calculator size={15} />
      </button>

      {/* Panel */}
      {open && (
        <div
          ref={panelRef}
          className={`
            absolute right-0 top-full mt-2 z-50
            w-[calc(100vw-2rem)] max-w-[280px]
            sm:w-72
            rounded-2xl border border-white/10 bg-[#0f0f1a]/98 backdrop-blur-xl
            shadow-2xl shadow-black/50
            animate-slide-down
            p-3
          `}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-white/30 uppercase tracking-wider font-medium">Calculatrice</span>
            <button
              onClick={() => setOpen(false)}
              className="p-1 rounded-lg hover:bg-white/10 text-white/30 hover:text-white transition-colors"
            >
              <X size={12} />
            </button>
          </div>

          {/* Display */}
          <div className="mb-3 rounded-xl bg-white/5 border border-white/8 px-4 py-3 text-right min-h-[64px] flex flex-col justify-between">
            {history[0] && (
              <p className="text-xs text-white/20 truncate mb-1">{history[0]}</p>
            )}
            <p className={`font-mono font-bold tracking-tight text-white truncate ${display.length > 12 ? "text-lg" : "text-2xl"}`}>
              {display}
            </p>
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-4 gap-1.5">
            {BUTTONS.flat().map((key, i) => (
              <button
                key={`${key}-${i}`}
                type="button"
                onClick={() => press(key)}
                className={btnStyle(key)}
              >
                {key === "⌫" ? <Delete size={14} /> : key}
              </button>
            ))}
          </div>

          {/* History */}
          {history.length > 1 && (
            <div className="mt-3 border-t border-white/8 pt-2 space-y-0.5">
              {history.slice(1).map((h, i) => (
                <p key={i} className="text-xs text-white/25 text-right font-mono truncate">{h}</p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
