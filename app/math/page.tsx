"use client";

import { CourseCard } from "@/components/course-card";
import { MathQuiz } from "@/components/math-quiz";
import { mathModules } from "@/lib/math-modules";
import { categories as elecCategories, generateExercise } from "@/lib/exercise-generator";
import { generateDerivativeExercise } from "@/lib/derivative-generator";
import { saveResult } from "@/lib/progress";
import { Difficulty, Exercise } from "@/types";
import { CheckCircle2, ChevronDown, RefreshCw, XCircle } from "lucide-react";
import { useState } from "react";

const difficultyColors: Record<Difficulty, string> = {
  easy:   "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
  medium: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  hard:   "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
};
const difficultyLabels: Record<Difficulty, string> = { easy: "Facile", medium: "Moyen", hard: "Difficile" };

function DerivativeExerciser() {
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [showSteps, setShowSteps] = useState(false);
  const [loading, setLoading] = useState(false);

  const gen = async () => {
    setLoading(true);
    setFeedback(null);
    setShowSteps(false);
    setAnswer("");
    try {
      const res = await fetch("/api/math-exercises", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ difficulty }),
      });
      const data = (await res.json()) as { exercise?: Exercise };
      if (data.exercise) setExercise(data.exercise);
    } finally {
      setLoading(false);
    }
  };

  const check = () => {
    if (!exercise) return;
    const cleaned = answer.trim().replace(",", ".");
    if (!cleaned) return;
    const userAnswer = Number(cleaned);
    if (!Number.isFinite(userAnswer)) { setFeedback("wrong"); setShowSteps(true); return; }
    const delta = Math.abs(userAnswer - exercise.expected);
    const tolerance = Math.max(0.05, Math.abs(exercise.expected) * 0.05);
    const ok = delta <= tolerance;
    setFeedback(ok ? "correct" : "wrong");
    saveResult({ id: exercise.id, category: exercise.category, difficulty: exercise.difficulty, success: ok, userAnswer, expected: exercise.expected, timestamp: new Date().toISOString() });
    setShowSteps(true);
  };

  return (
    <section className="space-y-5">
      <div className="card space-y-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Paramètres</p>
        <div>
          <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">Difficulté</p>
          <div className="flex gap-2">
            {(["easy", "medium", "hard"] as Difficulty[]).map((d) => (
              <button key={d} type="button" onClick={() => setDifficulty(d)}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition ${difficulty === d ? difficultyColors[d] : "bg-slate-100 dark:bg-slate-800 dark:text-slate-300"}`}>
                {difficultyLabels[d]}
              </button>
            ))}
          </div>
        </div>
        <button type="button" onClick={gen} disabled={loading}
          className="flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:opacity-60">
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          {loading ? "Génération…" : "Générer un exercice"}
        </button>
      </div>

      {exercise && (
        <div className="animate-fade-up card space-y-4">
          {exercise.hint && (
            <div className="rounded-xl bg-slate-50 px-4 py-2.5 font-mono text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              {exercise.hint}
            </div>
          )}
          <p className="font-semibold text-slate-900 dark:text-slate-100">{exercise.question}</p>

          {feedback === null && (
            <div className="flex gap-2">
              <input value={answer} onChange={(e) => setAnswer(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && check()}
                placeholder="Ta réponse (nombre)"
                className="w-full rounded-xl border border-slate-300 bg-transparent px-4 py-3 font-mono text-sm text-slate-900 outline-none transition focus:ring-2 focus:ring-violet-500 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500" />
              <button type="button" onClick={check}
                className="shrink-0 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-500">
                Vérifier
              </button>
            </div>
          )}

          {feedback && (
            <div className={`flex items-center gap-3 rounded-xl p-4 text-sm font-medium ${feedback === "correct" ? "bg-green-50 text-green-800 dark:bg-green-950 dark:text-green-200" : "bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-200"}`}>
              {feedback === "correct" ? <CheckCircle2 className="h-5 w-5 shrink-0" /> : <XCircle className="h-5 w-5 shrink-0" />}
              <span>{feedback === "correct" ? `Bravo ! f'(x₀) = ${exercise.expected}` : `Pas tout à fait. Réponse : ${exercise.expected}`}</span>
            </div>
          )}

          <div>
            <button type="button" onClick={() => setShowSteps((s) => !s)}
              className="flex items-center gap-1.5 text-sm text-violet-600 hover:underline dark:text-violet-400">
              <ChevronDown className={`h-4 w-4 transition-transform ${showSteps ? "rotate-180" : ""}`} />
              {showSteps ? "Masquer" : "Voir"} la correction détaillée
            </button>
            {showSteps && (
              <ol className="animate-fade-up mt-3 list-decimal space-y-1.5 rounded-xl bg-slate-50 px-5 py-4 font-mono text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                {exercise.steps.map((step) => <li key={step}>{step}</li>)}
              </ol>
            )}
          </div>

          {feedback && (
            <button type="button" onClick={gen}
              className="w-full rounded-xl border border-slate-200 py-2.5 text-sm font-medium transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">
              Prochain exercice →
            </button>
          )}
        </div>
      )}
    </section>
  );
}

export default function MathPage() {
  return (
    <div className="space-y-10">
      <header>
        <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700 dark:bg-violet-950 dark:text-violet-300">
          ∂ Mathématiques
        </div>
        <h1 className="text-3xl font-bold">Dérivées de fonctions</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Cours, exercices générés et quiz — des bases aux règles avancées.
        </p>
      </header>

      <section className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Cours</p>
        {mathModules.map((m) => <CourseCard key={m.id} module={m} />)}
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Exercices</p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Calcul de f'(x₀) — tape la virgule ou le point comme séparateur décimal.
          </p>
        </div>
        <DerivativeExerciser />
      </section>

      <section className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Quiz</p>
        <MathQuiz />
      </section>
    </div>
  );
}
