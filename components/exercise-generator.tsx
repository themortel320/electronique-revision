"use client";

import { categories } from "@/lib/exercise-generator";
import { saveResult } from "@/lib/progress";
import { Difficulty, Exercise, ExerciseCategory } from "@/types";
import { CheckCircle2, ChevronDown, RefreshCw, XCircle } from "lucide-react";
import { useState } from "react";

const difficultyLabels: Record<Difficulty, string> = {
  easy: "Facile",
  medium: "Moyen",
  hard: "Difficile",
};

const difficultyColors: Record<Difficulty, string> = {
  easy: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
  medium: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  hard: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
};

export function ExerciseGenerator() {
  const [category, setCategory] = useState<ExerciseCategory>("ohm");
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [showSteps, setShowSteps] = useState(false);
  const [loading, setLoading] = useState(false);

  const createExercise = async () => {
    setLoading(true);
    setFeedback(null);
    setShowSteps(false);
    setAnswer("");
    try {
      const res = await fetch("/api/exercises", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, difficulty }),
      });
      const data = (await res.json()) as { exercise?: Exercise };
      if (data.exercise) setExercise(data.exercise);
    } finally {
      setLoading(false);
    }
  };

  const check = () => {
    if (!exercise) return;
    // Accepter la virgule comme séparateur décimal (usage français)
    const cleaned = answer.trim().replace(",", ".");
    if (!cleaned) return;
    const userAnswer = Number(cleaned);
    if (!Number.isFinite(userAnswer)) {
      setFeedback("wrong");
      setShowSteps(true);
      return;
    }
    const delta = Math.abs(userAnswer - exercise.expected);
    // Tolérance : 5% de la valeur attendue, minimum 0.01 (jamais 0.5 qui serait trop laxiste)
    const tolerance = Math.max(0.01, Math.abs(exercise.expected) * 0.05);
    const ok = delta <= tolerance;
    setFeedback(ok ? "correct" : "wrong");
    saveResult({
      id: exercise.id,
      category: exercise.category,
      difficulty: exercise.difficulty,
      success: ok,
      userAnswer,
      expected: exercise.expected,
      timestamp: new Date().toISOString(),
    });
    setShowSteps(true);
  };

  return (
    <section className="space-y-5">
      {/* Contrôles */}
      <div className="card space-y-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Paramètres
        </p>

        <div>
          <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">Catégorie</p>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCategory(c.id)}
                className={`rounded-xl px-3 py-2 text-sm font-medium transition ${
                  category === c.id
                    ? "bg-brand-600 text-white"
                    : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">Difficulté</p>
          <div className="flex gap-2">
            {(["easy", "medium", "hard"] as Difficulty[]).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDifficulty(d)}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                  difficulty === d
                    ? difficultyColors[d]
                    : "bg-slate-100 dark:bg-slate-800"
                }`}
              >
                {difficultyLabels[d]}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={createExercise}
          disabled={loading}
          className="flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-500 disabled:opacity-60"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          {loading ? "Génération…" : "Générer un exercice"}
        </button>
      </div>

      {/* Exercice */}
      {exercise && (
        <div className="animate-fade-up card space-y-4">
          <div className="flex items-start justify-between gap-3">
            <p className="font-semibold leading-snug text-slate-900 dark:text-slate-100">{exercise.question}</p>
            <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${difficultyColors[exercise.difficulty]}`}>
              {difficultyLabels[exercise.difficulty]}
            </span>
          </div>

          {/* Zone de réponse */}
          {feedback === null && (
            <div className="flex gap-2">
              <input
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && check()}
                placeholder={`Ta réponse (${exercise.unit})`}
                className="w-full rounded-xl border border-slate-300 bg-transparent px-4 py-3 text-sm text-slate-900 outline-none transition focus:ring-2 focus:ring-brand-500 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500"
              />
              <button
                type="button"
                onClick={check}
                className="shrink-0 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
              >
                Vérifier
              </button>
            </div>
          )}

          {/* Feedback */}
          {feedback && (
            <div
              className={`flex items-center gap-3 rounded-xl p-4 text-sm font-medium ${
                feedback === "correct"
                  ? "bg-green-50 text-green-800 dark:bg-green-950 dark:text-green-200"
                  : "bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-200"
              }`}
            >
              {feedback === "correct" ? (
                <CheckCircle2 className="h-5 w-5 shrink-0" />
              ) : (
                <XCircle className="h-5 w-5 shrink-0" />
              )}
              <span>
                {feedback === "correct"
                  ? `Bravo ! Réponse : ${exercise.expected} ${exercise.unit}`
                  : `Pas tout à fait. Réponse attendue : ${exercise.expected} ${exercise.unit}`}
              </span>
            </div>
          )}

          {/* Correction dépliable */}
          <div>
            <button
              type="button"
              onClick={() => setShowSteps((s) => !s)}
              className="flex items-center gap-1.5 text-sm text-brand-600 hover:underline"
            >
              <ChevronDown className={`h-4 w-4 transition-transform ${showSteps ? "rotate-180" : ""}`} />
              {showSteps ? "Masquer" : "Voir"} la correction détaillée
            </button>
            {showSteps && (
              <ol className="animate-fade-up mt-3 list-decimal space-y-1.5 rounded-xl bg-slate-50 px-5 py-4 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                {exercise.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            )}
          </div>

          {feedback && (
            <button
              type="button"
              onClick={createExercise}
              className="w-full rounded-xl border border-slate-200 py-2.5 text-sm font-medium transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              Prochain exercice →
            </button>
          )}
        </div>
      )}
    </section>
  );
}
