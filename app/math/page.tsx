"use client";

import { CourseCard } from "@/components/course-card";
import { DerivativeGraph } from "@/components/derivative-graph";
import { QuestionCard } from "@/components/question-card";
import { AITutor, AITutorButton } from "@/components/ai-tutor";
import { mathModules } from "@/lib/math-modules";
import { useState } from "react";

const TABS = [
  { id: "cours", label: "📚 Cours" },
  { id: "graph", label: "📈 Graphes" },
  { id: "exercices", label: "🎲 Exercices GPT" },
];

export default function MathPage() {
  const [tab, setTab] = useState("cours");
  const [tutorQuestion, setTutorQuestion] = useState<string | undefined>();
  const [tutorOpen, setTutorOpen] = useState(false);

  function openTutor(q?: string) {
    setTutorQuestion(q);
    setTutorOpen(true);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent mb-2">
          Mathématiques
        </h1>
        <p className="text-white/50 text-sm">
          Dérivées · Primitives · Suites · Trigonométrie — avec graphes interactifs et exercices IA.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-white/5 border border-white/10 rounded-2xl p-1 w-fit">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              tab === t.id
                ? "bg-violet-600 text-white shadow-sm"
                : "text-white/50 hover:text-white"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "cours" && (
        <div className="space-y-4">
          {mathModules.map((mod) => (
            <CourseCard
              key={mod.id}
              module={mod}
              onAskTutor={(q) => openTutor(q)}
            />
          ))}
        </div>
      )}

      {tab === "graph" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white mb-1">Graphe de dérivée interactif</h2>
            <p className="text-white/40 text-sm mb-4">
              Déplace le curseur pour voir la tangente en temps réel. f(x) en violet, f′(x) en cyan.
            </p>
            <DerivativeGraph />
          </div>
        </div>
      )}

      {tab === "exercices" && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-violet-900/20 border border-violet-700/30">
            <p className="text-violet-300 text-sm">
              🤖 Exercices générés par GPT-4o — variété maximale, questions uniques à chaque fois.
              Active l'accès au <strong>Professeur IA</strong> pour des explications en cas de blocage.
            </p>
          </div>

          {tutorOpen ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <QuestionCard
                defaultChapter="Dérivées : règles de base"
                onAskTutor={(q) => {
                  setTutorQuestion(q);
                  setTutorOpen(true);
                }}
              />
              <AITutor
                module={mathModules[0]}
                initialQuestion={tutorQuestion}
                onClose={() => setTutorOpen(false)}
                inline
              />
            </div>
          ) : (
            <QuestionCard
              defaultChapter="Dérivées : règles de base"
              onAskTutor={openTutor}
            />
          )}
        </div>
      )}

      {/* Floating AI tutor (outside inline mode) */}
      {!tutorOpen && (
        <AITutorButton
          module={mathModules[0]}
          initialQuestion={tutorQuestion}
        />
      )}
    </div>
  );
}
