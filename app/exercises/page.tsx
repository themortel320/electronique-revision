"use client";

import { ExerciseGenerator } from "@/components/exercise-generator";
import { CircuitDiagram } from "@/components/circuit-diagram";
import { BodeChart } from "@/components/bode-chart";
import { QuestionCard } from "@/components/question-card";
import { AITutor, AITutorButton } from "@/components/ai-tutor";
import { courseModules } from "@/lib/modules";
import { useState } from "react";

const TABS = [
  { id: "classic", label: "⚡ Exercices classiques" },
  { id: "gpt", label: "🤖 Exercices GPT" },
  { id: "bode", label: "📊 Filtres & Bode" },
  { id: "schemas", label: "🔌 Schémas" },
];

export default function ExercisesPage() {
  const [tab, setTab] = useState("classic");
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
          Exercices Électronique
        </h1>
        <p className="text-white/50 text-sm">
          Exercices classiques · Exercices GPT · Filtres & Bode · Schémas
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 bg-white/5 border border-white/10 rounded-2xl p-1 w-fit">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
              tab === t.id
                ? "bg-violet-600 text-white shadow-sm"
                : "text-white/50 hover:text-white"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "classic" && (
        <div>
          <ExerciseGenerator />
        </div>
      )}

      {tab === "gpt" && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-violet-900/20 border border-violet-700/30">
            <p className="text-violet-300 text-sm">
              🤖 Exercices générés par GPT-4o — chaque question est unique, variée, avec explication détaillée.
            </p>
          </div>

          {tutorOpen ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <QuestionCard
                defaultChapter="Loi d'Ohm & associations de résistances"
                onAskTutor={(q) => {
                  setTutorQuestion(q);
                  setTutorOpen(true);
                }}
              />
              <AITutor
                module={courseModules[0]}
                initialQuestion={tutorQuestion}
                onClose={() => setTutorOpen(false)}
                inline
              />
            </div>
          ) : (
            <QuestionCard
              defaultChapter="Loi d'Ohm & associations de résistances"
              onAskTutor={openTutor}
            />
          )}
        </div>
      )}

      {tab === "bode" && (
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-bold text-white mb-1">Diagramme de Bode interactif</h2>
            <p className="text-white/40 text-sm mb-4">
              Choisis le type de filtre et ajuste les paramètres pour voir le diagramme en temps réel.
            </p>
            <BodeChart />
          </div>
        </div>
      )}

      {tab === "schemas" && (
        <div>
          <CircuitDiagram />
        </div>
      )}

      {!tutorOpen && <AITutorButton module={courseModules[0]} initialQuestion={tutorQuestion} />}
    </div>
  );
}
