"use client";

import { CourseModule } from "@/types";
import { ChevronDown, Info, Lightbulb, MessageCircle } from "lucide-react";
import { useState } from "react";
import { ModuleQA } from "./module-qa";
import { AITutor } from "./ai-tutor";

const iconsByModule: Record<string, string> = {
  foundations:           "⚡",
  passive:               "🔋",
  diodes:                "💡",
  transistors:           "🔌",
  kirchhoff:             "🔀",
  "rc-filters":          "🎛️",
  "op-amp":              "🔬",
  "transistors-advanced":"⚙️",
  "derivative-basics":   "∂",
  "derivative-rules":    "∑",
  integrals:             "∫",
  sequences:             "𝑛",
  trigonometry:          "〜",
};

const accentByModule: Record<string, { border: string; bg: string; text: string }> = {
  foundations:           { border: "border-amber-500/50",  bg: "from-amber-900/30 to-amber-800/10",  text: "text-amber-300" },
  passive:               { border: "border-blue-500/50",   bg: "from-blue-900/30 to-blue-800/10",    text: "text-blue-300" },
  diodes:                { border: "border-yellow-500/50", bg: "from-yellow-900/30 to-yellow-800/10",text: "text-yellow-300" },
  transistors:           { border: "border-violet-500/50", bg: "from-violet-900/30 to-violet-800/10",text: "text-violet-300" },
  kirchhoff:             { border: "border-emerald-500/50",bg: "from-emerald-900/30 to-emerald-800/10",text: "text-emerald-300" },
  "rc-filters":          { border: "border-cyan-500/50",   bg: "from-cyan-900/30 to-cyan-800/10",    text: "text-cyan-300" },
  "op-amp":              { border: "border-pink-500/50",   bg: "from-pink-900/30 to-pink-800/10",    text: "text-pink-300" },
  "transistors-advanced":{ border: "border-orange-500/50", bg: "from-orange-900/30 to-orange-800/10",text: "text-orange-300" },
  "derivative-basics":   { border: "border-violet-500/50", bg: "from-violet-900/30 to-violet-800/10",text: "text-violet-300" },
  "derivative-rules":    { border: "border-blue-500/50",   bg: "from-blue-900/30 to-blue-800/10",    text: "text-blue-300" },
  integrals:             { border: "border-indigo-500/50", bg: "from-indigo-900/30 to-indigo-800/10",text: "text-indigo-300" },
  sequences:             { border: "border-teal-500/50",   bg: "from-teal-900/30 to-teal-800/10",    text: "text-teal-300" },
  trigonometry:          { border: "border-rose-500/50",   bg: "from-rose-900/30 to-rose-800/10",    text: "text-rose-300" },
};

const DEFAULT_ACCENT = { border: "border-violet-500/50", bg: "from-violet-900/30 to-violet-800/10", text: "text-violet-300" };

type Props = {
  module: CourseModule;
  onAskTutor?: (question: string) => void;
};

export function CourseCard({ module, onAskTutor }: Props) {
  const [open, setOpen] = useState(false);
  const [activeFormula, setActiveFormula] = useState<number | null>(null);
  const [showTutor, setShowTutor] = useState(false);

  const accent = accentByModule[module.id] ?? DEFAULT_ACCENT;
  const icon = iconsByModule[module.id] ?? "📘";

  return (
    <article className={`rounded-2xl border border-white/8 bg-[#0d0d1f] overflow-hidden transition-all duration-300 hover:border-white/15 hover:shadow-lg hover:shadow-violet-900/10`}>
      {/* Header */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-start gap-4 text-left p-5"
      >
        <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl bg-gradient-to-br ${accent.bg} border ${accent.border}`}>
          {icon}
        </span>
        <div className="flex-1 min-w-0">
          <h3 className={`font-bold text-white`}>{module.title}</h3>
          <p className="mt-0.5 line-clamp-2 text-sm text-white/50">
            {module.summary}
          </p>
          {!open && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {module.formulas.slice(0, 3).map((f) => (
                <code
                  key={f}
                  className={`rounded-lg border ${accent.border} bg-white/5 px-2 py-0.5 text-xs font-mono ${accent.text}`}
                >
                  {f}
                </code>
              ))}
            </div>
          )}
        </div>
        <ChevronDown
          className={`mt-1 h-4 w-4 shrink-0 text-white/30 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Expandable content */}
      {open && (
        <div className="animate-fade-up mt-0 space-y-5 border-t border-white/8 px-5 pb-5 pt-5">

          {/* Notions */}
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/30">
              Notions clés
            </p>
            <ul className="space-y-2">
              {module.notions.map((item, i) => (
                <li
                  key={item}
                  className="animate-fade-up flex items-start gap-2.5 text-sm text-white/70"
                  style={{ animationDelay: `${i * 0.04}s` }}
                >
                  <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${accent.text} bg-current`} />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Formulas */}
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/30">
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
                        ? `${accent.border} bg-white/5`
                        : "border-white/8 bg-white/3 hover:border-white/20 hover:bg-white/5"
                    }`}
                  >
                    <code className={`font-mono text-sm font-bold ${accent.text}`}>
                      {fd.expr}
                    </code>
                    <Info className={`h-3.5 w-3.5 shrink-0 transition ${activeFormula === i ? accent.text : "text-white/20 group-hover:text-white/50"}`} />
                  </button>

                  {activeFormula === i && (
                    <div className={`animate-fade-up rounded-b-xl border-x border-b ${accent.border} border-l-4 bg-white/3 px-4 py-3 space-y-2`}>
                      <p className="text-sm text-white/70">{fd.use}</p>
                      {fd.tip && (
                        <div className="flex items-start gap-2 rounded-lg bg-amber-900/20 border border-amber-700/30 px-3 py-2">
                          <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-400" />
                          <p className="text-xs text-amber-300">{fd.tip}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Exemple */}
          <div className={`rounded-xl border-l-4 ${accent.border} px-4 py-3 text-sm bg-white/3`}>
            <p className={`mb-1 text-xs font-semibold uppercase tracking-wider ${accent.text}`}>
              Exemple concret
            </p>
            <p className="text-white/70">{module.example}</p>
          </div>

          {/* Q&A + AI Tutor button */}
          <ModuleQA qa={module.qa} moduleId={module.id} />

          {/* AI Tutor section */}
          <div className="pt-2 border-t border-white/8">
            {!showTutor ? (
              <button
                onClick={() => setShowTutor(true)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${accent.border} bg-gradient-to-r ${accent.bg} text-sm ${accent.text} hover:brightness-110 transition-all`}
              >
                <MessageCircle size={14} />
                Poser une question au Professeur IA
              </button>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-white/40">Professeur IA — {module.title}</p>
                  <button
                    onClick={() => setShowTutor(false)}
                    className="text-xs text-white/30 hover:text-white/60 transition-colors"
                  >
                    Fermer
                  </button>
                </div>
                <AITutor module={module} onClose={() => setShowTutor(false)} inline />
              </div>
            )}
          </div>
        </div>
      )}
    </article>
  );
}
