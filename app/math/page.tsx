"use client";

import { CourseCard } from "@/components/course-card";
import { CourseGroup } from "@/components/course-group";
import { DerivativeGraph } from "@/components/derivative-graph";
import { QuestionCard } from "@/components/question-card";
import { AITutor, AITutorButton } from "@/components/ai-tutor";
import { mathModules } from "@/lib/math-modules";
import { useState } from "react";

// ── Subcategory grouping ──────────────────────────────────────────────────────
const GROUPS = [
  {
    title: "Dérivées",
    subtitle: "Taux de variation, règles de dérivation, étude de fonctions",
    emoji: "∂",
    accent: "text-violet-400",
    border: "border-violet-700/25",
    bg: "bg-violet-900/8",
    ids: ["derivative-basics", "derivative-rules"],
  },
  {
    title: "Intégrales & Primitives",
    subtitle: "Calcul d'aires, théorème fondamental de l'analyse",
    emoji: "∫",
    accent: "text-indigo-400",
    border: "border-indigo-700/25",
    bg: "bg-indigo-900/8",
    ids: ["integrals"],
  },
  {
    title: "Suites numériques",
    subtitle: "Suites arithmétiques, géométriques, convergence, récurrence",
    emoji: "∑",
    accent: "text-teal-400",
    border: "border-teal-700/25",
    bg: "bg-teal-900/8",
    ids: ["sequences"],
  },
  {
    title: "Trigonométrie",
    subtitle: "Cercle trigonométrique, identités, formules d'addition",
    emoji: "〜",
    accent: "text-rose-400",
    border: "border-rose-700/25",
    bg: "bg-rose-900/8",
    ids: ["trigonometry"],
  },
];

const TABS = [
  { id: "cours",     label: "📚 Cours" },
  { id: "graph",     label: "📈 Graphes" },
  { id: "exercices", label: "🎲 Exercices GPT" },
];

export default function MathPage() {
  const [tab, setTab] = useState("cours");
  const [tutorQuestion, setTutorQuestion] = useState<string | undefined>();
  const [tutorOpen, setTutorOpen] = useState(false);

  function openTutor(q?: string) { setTutorQuestion(q); setTutorOpen(true); }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
      <header>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
          ∂ Mathématiques
        </h1>
        <p className="text-white/40 text-sm mt-1">
          Dérivées · Intégrales · Suites · Trigonométrie — avec graphes interactifs et exercices IA.
        </p>
      </header>

      {/* Tabs */}
      <div className="flex gap-1.5 bg-white/5 border border-white/10 rounded-2xl p-1 w-fit">
        {TABS.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              tab === t.id ? "bg-violet-600 text-white shadow-sm" : "text-white/50 hover:text-white"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Cours groupés */}
      {tab === "cours" && (
        <div className="space-y-4">
          {GROUPS.map((group, gi) => {
            const mods = group.ids.map((id) => mathModules.find((m) => m.id === id)).filter(Boolean) as typeof mathModules;
            if (mods.length === 0) return null;
            return (
              <CourseGroup
                key={group.title}
                title={group.title}
                subtitle={group.subtitle}
                emoji={group.emoji}
                accentClass={group.accent}
                borderClass={group.border}
                bgClass={group.bg}
                defaultOpen={gi === 0}
              >
                {mods.map((mod) => (
                  <CourseCard key={mod.id} module={mod} onAskTutor={openTutor} />
                ))}
              </CourseGroup>
            );
          })}
        </div>
      )}

      {tab === "graph" && (
        <div className="rounded-2xl border border-white/10 bg-[#0d0d1f] p-5 space-y-4">
          <div>
            <h2 className="text-base font-bold text-white mb-1">Graphe de dérivée interactif</h2>
            <p className="text-white/40 text-sm">Déplace le curseur pour voir la tangente en temps réel.</p>
          </div>
          <DerivativeGraph />
        </div>
      )}

      {tab === "exercices" && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-violet-900/20 border border-violet-700/30">
            <p className="text-violet-300 text-sm">
              🤖 Exercices générés par IA — variété maximale, questions uniques à chaque fois.
            </p>
          </div>
          {tutorOpen ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <QuestionCard defaultChapter="Dérivées : règles de base" onAskTutor={(q) => { setTutorQuestion(q); setTutorOpen(true); }} />
              <AITutor module={mathModules[0]} initialQuestion={tutorQuestion} onClose={() => setTutorOpen(false)} inline />
            </div>
          ) : (
            <QuestionCard defaultChapter="Dérivées : règles de base" onAskTutor={openTutor} />
          )}
        </div>
      )}

      {!tutorOpen && <AITutorButton module={mathModules[0]} initialQuestion={tutorQuestion} />}
    </div>
  );
}
