"use client";

import { CourseModule } from "@/types";
import { DIAGRAMS } from "@/components/circuit-diagrams";
import {
  ChevronDown,
  Lightbulb,
  MessageCircle,
  Zap,
  BookOpen,
  FlaskConical,
  PenLine,
} from "lucide-react";
import { useState } from "react";
import { ModuleQA } from "./module-qa";
import { AITutor } from "./ai-tutor";

const iconsByModule: Record<string, string> = {
  foundations:            "⚡",
  passive:                "🔋",
  diodes:                 "💡",
  transistors:            "🔌",
  kirchhoff:              "🔀",
  "rc-filters":           "🎛️",
  "op-amp":               "🔬",
  "transistors-advanced": "⚙️",
  "derivative-basics":    "∂",
  "derivative-rules":     "∑",
  integrals:              "∫",
  sequences:              "𝑛",
  trigonometry:           "〜",
};

const accentByModule: Record<string, { border: string; bg: string; text: string; pill: string }> = {
  foundations:            { border: "border-amber-500/50",   bg: "from-amber-900/30 to-amber-800/10",    text: "text-amber-300",   pill: "bg-amber-900/40 text-amber-300" },
  passive:                { border: "border-blue-500/50",    bg: "from-blue-900/30 to-blue-800/10",      text: "text-blue-300",    pill: "bg-blue-900/40 text-blue-300" },
  diodes:                 { border: "border-yellow-500/50",  bg: "from-yellow-900/30 to-yellow-800/10",  text: "text-yellow-300",  pill: "bg-yellow-900/40 text-yellow-300" },
  transistors:            { border: "border-violet-500/50",  bg: "from-violet-900/30 to-violet-800/10",  text: "text-violet-300",  pill: "bg-violet-900/40 text-violet-300" },
  kirchhoff:              { border: "border-emerald-500/50", bg: "from-emerald-900/30 to-emerald-800/10",text: "text-emerald-300", pill: "bg-emerald-900/40 text-emerald-300" },
  "rc-filters":           { border: "border-cyan-500/50",    bg: "from-cyan-900/30 to-cyan-800/10",      text: "text-cyan-300",    pill: "bg-cyan-900/40 text-cyan-300" },
  "op-amp":               { border: "border-pink-500/50",    bg: "from-pink-900/30 to-pink-800/10",      text: "text-pink-300",    pill: "bg-pink-900/40 text-pink-300" },
  "transistors-advanced": { border: "border-orange-500/50",  bg: "from-orange-900/30 to-orange-800/10",  text: "text-orange-300",  pill: "bg-orange-900/40 text-orange-300" },
  "derivative-basics":    { border: "border-violet-500/50",  bg: "from-violet-900/30 to-violet-800/10",  text: "text-violet-300",  pill: "bg-violet-900/40 text-violet-300" },
  "derivative-rules":     { border: "border-blue-500/50",    bg: "from-blue-900/30 to-blue-800/10",      text: "text-blue-300",    pill: "bg-blue-900/40 text-blue-300" },
  integrals:              { border: "border-indigo-500/50",  bg: "from-indigo-900/30 to-indigo-800/10",  text: "text-indigo-300",  pill: "bg-indigo-900/40 text-indigo-300" },
  sequences:              { border: "border-teal-500/50",    bg: "from-teal-900/30 to-teal-800/10",      text: "text-teal-300",    pill: "bg-teal-900/40 text-teal-300" },
  trigonometry:           { border: "border-rose-500/50",    bg: "from-rose-900/30 to-rose-800/10",      text: "text-rose-300",    pill: "bg-rose-900/40 text-rose-300" },
};

const DEFAULT_ACCENT = {
  border: "border-violet-500/50",
  bg: "from-violet-900/30 to-violet-800/10",
  text: "text-violet-300",
  pill: "bg-violet-900/40 text-violet-300",
};

type Tab = "cours" | "formules" | "exemple";

type Props = {
  module: CourseModule;
  onAskTutor?: (question: string) => void;
};

export function CourseCard({ module, onAskTutor }: Props) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("cours");
  const [activeFormula, setActiveFormula] = useState<number | null>(null);
  const [showTutor, setShowTutor] = useState(false);

  const accent = accentByModule[module.id] ?? DEFAULT_ACCENT;
  const icon = iconsByModule[module.id] ?? "📘";
  const DiagramComponent = module.lesson?.diagramId ? DIAGRAMS[module.lesson.diagramId] : null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tabs: { id: Tab; label: string; Icon: React.ComponentType<any> }[] = [
    { id: "cours",    label: "Cours",    Icon: BookOpen },
    { id: "formules", label: "Formules", Icon: PenLine },
    { id: "exemple",  label: "Exemple",  Icon: FlaskConical },
  ];

  return (
    <article
      className={`rounded-2xl border border-white/8 bg-[#0d0d1f] overflow-hidden transition-all duration-300
        hover:border-white/15 hover:shadow-lg hover:shadow-violet-900/10`}
    >
      {/* ── Header ── */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-start gap-4 text-left p-5"
      >
        <span
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl
            bg-gradient-to-br ${accent.bg} border ${accent.border}`}
        >
          {icon}
        </span>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-white">{module.title}</h3>
          <p className="mt-0.5 line-clamp-2 text-sm text-white/50">{module.summary}</p>
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

      {/* ── Expanded body ── */}
      {open && (
        <div className="border-t border-white/8">

          {/* Tab bar */}
          <div className="flex gap-1 border-b border-white/8 px-4 pt-3 pb-0">
            {tabs.map(({ id, label, Icon: TabIcon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={`flex items-center gap-1.5 rounded-t-lg px-4 py-2 text-xs font-semibold transition-all
                  ${tab === id
                    ? `border border-b-0 border-white/10 ${accent.text} bg-white/5`
                    : "text-white/30 hover:text-white/60"
                  }`}
              >
                <TabIcon size={12} />
                {label}
              </button>
            ))}
          </div>

          <div className="p-5 space-y-5">
            {/* ── TAB : COURS ── */}
            {tab === "cours" && (
              <div className="space-y-5">

                {/* Analogy hook */}
                {module.lesson?.analogy && (
                  <div className="flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-900/15 px-4 py-3">
                    <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1">
                        Pour commencer — une analogie
                      </p>
                      <p className="text-sm text-amber-100/80">{module.lesson.analogy}</p>
                    </div>
                  </div>
                )}

                {/* SVG Diagram */}
                {DiagramComponent && (
                  <div className="rounded-xl border border-white/8 bg-[#080818] p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-white/30 mb-3">
                      Schéma du circuit
                    </p>
                    <DiagramComponent />
                    {module.lesson?.diagramCaption && (
                      <p className="mt-3 text-center text-xs text-white/40 italic">
                        {module.lesson.diagramCaption}
                      </p>
                    )}
                  </div>
                )}

                {/* Step-by-step explanation */}
                {module.lesson?.steps && module.lesson.steps.length > 0 && (
                  <div>
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/30">
                      Explication pas à pas
                    </p>
                    <ol className="space-y-3">
                      {module.lesson.steps.map((step, i) => (
                        <li key={i} className="flex items-start gap-3 animate-fade-up"
                          style={{ animationDelay: `${i * 0.05}s` }}>
                          <span
                            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold
                              bg-gradient-to-br ${accent.bg} border ${accent.border} ${accent.text}`}
                          >
                            {i + 1}
                          </span>
                          <p className="text-sm text-white/75 leading-relaxed pt-0.5">{step}</p>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                {/* Key notions */}
                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/30">
                    Points à retenir
                  </p>
                  <ul className="space-y-2">
                    {module.notions.map((item, i) => (
                      <li key={item} className="flex items-start gap-2.5 text-sm text-white/65"
                        style={{ animationDelay: `${i * 0.04}s` }}>
                        <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${accent.text} bg-current`} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* ── TAB : FORMULES ── */}
            {tab === "formules" && (
              <div className="space-y-2">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/30">
                  Clique sur une formule pour en savoir plus
                </p>
                {module.formulaDetails.map((fd, i) => (
                  <div key={fd.expr} className="animate-fade-up" style={{ animationDelay: `${i * 0.05}s` }}>
                    <button
                      type="button"
                      onClick={() => setActiveFormula(activeFormula === i ? null : i)}
                      className={`group flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left transition
                        ${activeFormula === i
                          ? `${accent.border} bg-white/5`
                          : "border-white/8 bg-white/3 hover:border-white/20 hover:bg-white/5"
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <Zap className={`h-3.5 w-3.5 shrink-0 ${accent.text} opacity-60`} />
                        <code className={`font-mono text-sm font-bold ${accent.text}`}>{fd.expr}</code>
                      </div>
                      <ChevronDown
                        className={`h-3.5 w-3.5 shrink-0 transition text-white/30 ${activeFormula === i ? "rotate-180" : ""}`}
                      />
                    </button>

                    {activeFormula === i && (
                      <div className={`rounded-b-xl border-x border-b ${accent.border} border-l-4 bg-white/3 px-4 py-3 space-y-2.5`}>
                        <p className="text-sm text-white/75 leading-relaxed">{fd.use}</p>
                        {fd.tip && (
                          <div className="flex items-start gap-2 rounded-lg bg-amber-900/20 border border-amber-700/30 px-3 py-2">
                            <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-400" />
                            <p className="text-xs text-amber-200/80">{fd.tip}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* ── TAB : EXEMPLE ── */}
            {tab === "exemple" && (
              <div className="space-y-4">
                <div className={`rounded-xl border-l-4 ${accent.border} px-4 py-4 bg-white/3`}>
                  <p className={`mb-2 text-xs font-semibold uppercase tracking-wider ${accent.text}`}>
                    Exemple chiffré
                  </p>
                  <p className="text-sm text-white/75 leading-relaxed whitespace-pre-line">{module.example}</p>
                </div>

                {/* Q&A */}
                <ModuleQA qa={module.qa} moduleId={module.id} />
              </div>
            )}

            {/* ── AI Tutor (always visible at bottom) ── */}
            <div className="pt-3 border-t border-white/8">
              {!showTutor ? (
                <button
                  onClick={() => setShowTutor(true)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${accent.border}
                    bg-gradient-to-r ${accent.bg} text-sm ${accent.text} hover:brightness-110 transition-all`}
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
        </div>
      )}
    </article>
  );
}
