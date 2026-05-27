"use client";

import { CourseModule } from "@/types";
import { ChevronDown, Info, Lightbulb } from "lucide-react";
import { useState } from "react";
import { ModuleQA } from "./module-qa";

const iconsByModule: Record<string, string> = {
  foundations: "⚡",
  passive:     "🔋",
  diodes:      "💡",
  transistors: "🔌",
  kirchhoff:   "🔀",
  "rc-filters":"🎛️",
};

const colorsByModule: Record<string, string> = {
  foundations: "bg-amber-50 dark:bg-amber-950/30",
  passive:     "bg-blue-50 dark:bg-blue-950/30",
  diodes:      "bg-yellow-50 dark:bg-yellow-950/30",
  transistors: "bg-violet-50 dark:bg-violet-950/30",
  kirchhoff:   "bg-emerald-50 dark:bg-emerald-950/30",
  "rc-filters":"bg-cyan-50 dark:bg-cyan-950/30",
};

const accentByModule: Record<string, string> = {
  foundations: "border-amber-400",
  passive:     "border-blue-400",
  diodes:      "border-yellow-400",
  transistors: "border-violet-400",
  kirchhoff:   "border-emerald-400",
  "rc-filters":"border-cyan-400",
};

type Props = { module: CourseModule };

export function CourseCard({ module }: Props) {
  const [open, setOpen] = useState(false);
  const [activeFormula, setActiveFormula] = useState<number | null>(null);

  return (
    <article className={`card-glow card overflow-hidden transition-all duration-300`}>
      {/* Header */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-start gap-4 text-left"
      >
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-2xl ${colorsByModule[module.id] ?? "bg-slate-100 dark:bg-slate-800"}`}
        >
          {iconsByModule[module.id] ?? "📘"}
        </span>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-slate-900 dark:text-slate-100">{module.title}</h3>
          <p className="mt-0.5 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">
            {module.summary}
          </p>
          {/* Formules en aperçu */}
          {!open && (
            <div className="mt-2 flex flex-wrap gap-1">
              {module.formulas.slice(0, 3).map((f) => (
                <code
                  key={f}
                  className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-mono text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                >
                  {f}
                </code>
              ))}
            </div>
          )}
        </div>
        <ChevronDown
          className={`mt-1 h-4 w-4 shrink-0 text-slate-400 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Contenu expandable */}
      {open && (
        <div className="animate-fade-up mt-5 space-y-5 border-t border-slate-100 pt-5 dark:border-slate-800">

          {/* Notions */}
          <div>
            <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Notions clés
            </p>
            <ul className="space-y-2">
              {module.notions.map((item, i) => (
                <li
                  key={item}
                  className="animate-fade-up flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300"
                  style={{ animationDelay: `${i * 0.04}s` }}
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Formules avec descriptions */}
          <div>
            <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Formules — clique pour comprendre
            </p>
            <div className="space-y-2">
              {module.formulaDetails.map((fd, i) => (
                <div key={fd.expr} className="animate-fade-up" style={{ animationDelay: `${i * 0.05}s` }}>
                  <button
                    type="button"
                    onClick={() => setActiveFormula(activeFormula === i ? null : i)}
                    className={`group flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-2.5 text-left transition ${
                      activeFormula === i
                        ? "border-brand-400 bg-brand-50 dark:border-brand-600 dark:bg-brand-950/40"
                        : "border-slate-200 bg-slate-50 hover:border-brand-300 hover:bg-brand-50/50 dark:border-slate-700 dark:bg-slate-800/60 dark:hover:border-brand-700"
                    }`}
                  >
                    <code className="font-mono text-sm font-bold text-brand-700 dark:text-brand-300">
                      {fd.expr}
                    </code>
                    <Info
                      className={`h-3.5 w-3.5 shrink-0 transition ${
                        activeFormula === i ? "text-brand-500" : "text-slate-400 group-hover:text-brand-400"
                      }`}
                    />
                  </button>

                  {activeFormula === i && (
                    <div className={`animate-fade-up rounded-b-xl border-x border-b px-4 py-3 ${accentByModule[module.id] ? `border-l-4 ${accentByModule[module.id]}` : ""} border-brand-200 bg-white dark:border-brand-800 dark:bg-slate-900`}>
                      <p className="text-sm text-slate-700 dark:text-slate-300">{fd.use}</p>
                      {fd.tip && (
                        <div className="mt-2 flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2 dark:bg-amber-950/40">
                          <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
                          <p className="text-xs text-amber-800 dark:text-amber-300">{fd.tip}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Exemple */}
          <div
            className={`rounded-xl border-l-4 px-4 py-3 text-sm ${accentByModule[module.id] ?? "border-brand-400"} bg-slate-50 dark:bg-slate-800/60`}
          >
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
              Exemple concret
            </p>
            <p className="text-slate-700 dark:text-slate-300">{module.example}</p>
          </div>

          {/* Q&A */}
          <ModuleQA qa={module.qa} moduleId={module.id} />
        </div>
      )}
    </article>
  );
}
