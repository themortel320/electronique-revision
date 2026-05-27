"use client";

import { getPseudo } from "@/lib/user";
import { upsertLeaderboard } from "@/lib/leaderboard";
import { CheckCircle2, XCircle } from "lucide-react";
import { useState } from "react";

const QUESTIONS = [
  {
    q: "Quelle est la dérivée de f(x) = x⁴ ?",
    options: ["4x³", "x³", "4x⁵", "4x"],
    answer: 0,
    explanation: "(xⁿ)' = n·xⁿ⁻¹ → (x⁴)' = 4·x³.",
  },
  {
    q: "Quelle est la dérivée de f(x) = 7 ?",
    options: ["7", "7x", "1", "0"],
    answer: 3,
    explanation: "La dérivée d'une constante est toujours 0.",
  },
  {
    q: "Quelle est la dérivée de f(x) = eˣ ?",
    options: ["eˣ⁻¹", "x·eˣ", "eˣ", "1/eˣ"],
    answer: 2,
    explanation: "(eˣ)' = eˣ. C'est sa propriété fondamentale — elle est sa propre dérivée.",
  },
  {
    q: "Quelle est la dérivée de f(x) = sin(x) ?",
    options: ["−sin(x)", "cos(x)", "−cos(x)", "1/cos(x)"],
    answer: 1,
    explanation: "(sin x)' = cos x. Séquence : sin → cos → −sin → −cos → sin...",
  },
  {
    q: "Quelle est la dérivée de f(x) = 3x² + 2x − 1 ?",
    options: ["6x + 2", "3x + 2", "6x² + 2", "6x − 1"],
    answer: 0,
    explanation: "(3x²)' = 6x, (2x)' = 2, (−1)' = 0 → f'(x) = 6x + 2.",
  },
  {
    q: "Pour la règle du produit (fg)', on a :",
    options: ["f'·g'", "f'g + fg'", "f'g − fg'", "(f'g) / g²"],
    answer: 1,
    explanation: "(fg)' = f'g + fg'. Moyen mnémo : prime-seconde + première-prime-seconde.",
  },
  {
    q: "Quelle est la dérivée de f(x) = ln(x) ?",
    options: ["x", "1/x²", "1/x", "e^x"],
    answer: 2,
    explanation: "(ln x)' = 1/x, pour x > 0.",
  },
  {
    q: "Par la règle de la composée, (sin(3x))' vaut :",
    options: ["sin(3)", "cos(3x)", "3cos(3x)", "−3sin(3x)"],
    answer: 2,
    explanation: "Composée : f(g(x)) avec f=sin, g=3x. f'(g(x))·g'(x) = cos(3x) × 3 = 3cos(3x).",
  },
  {
    q: "Si f'(x) > 0 sur [a, b], alors f est :",
    options: ["Décroissante", "Constante", "Croissante", "Nulle"],
    answer: 2,
    explanation: "f'(x) > 0 ↔ f croissante. f'(x) < 0 ↔ f décroissante. f'(x) = 0 → extremum potentiel.",
  },
  {
    q: "Quelle est la dérivée de f(x) = √x = x^(1/2) ?",
    options: ["2√x", "1/(2√x)", "√x / 2", "2x^(3/2)"],
    answer: 1,
    explanation: "(x^½)' = ½·x^(½−1) = ½·x^(−½) = 1/(2x^½) = 1/(2√x).",
  },
];

type Phase = "idle" | "answering" | "feedback" | "done";

export function MathQuiz() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [animKey, setAnimKey] = useState(0);

  const question = QUESTIONS[index];
  const isCorrect = selected === question?.answer;
  const progress = (index / QUESTIONS.length) * 100;

  const start = () => {
    setPhase("answering");
    setIndex(0);
    setScore(0);
    setSelected(null);
    setAnimKey((k) => k + 1);
  };

  const pick = (i: number) => {
    if (phase !== "answering") return;
    setSelected(i);
    setPhase("feedback");
    if (i === question.answer) setScore((s) => s + 1);
  };

  const next = () => {
    if (index + 1 >= QUESTIONS.length) {
      const pseudo = getPseudo() ?? "Anonyme";
      upsertLeaderboard({
        pseudo,
        score: score * 10,
        correct: score,
        total: QUESTIONS.length,
        date: new Date().toISOString(),
      });
      setPhase("done");
    } else {
      setIndex((i) => i + 1);
      setSelected(null);
      setPhase("answering");
      setAnimKey((k) => k + 1);
    }
  };

  const grade = () => {
    const ratio = score / QUESTIONS.length;
    if (ratio >= 0.9) return { label: "Expert ∂ — maîtrise totale", color: "text-amber-500" };
    if (ratio >= 0.7) return { label: "Avancé — bien joué !", color: "text-green-500" };
    if (ratio >= 0.5) return { label: "En progrès — continue", color: "text-blue-500" };
    return { label: "Débutant — relis le cours", color: "text-slate-500" };
  };

  if (phase === "idle") {
    return (
      <div className="card flex flex-col items-center gap-5 py-12 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 text-3xl text-white shadow-glow">
          ∂
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Quiz Dérivées</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            10 questions · Règles, fonctions usuelles, interprétation
          </p>
        </div>
        <button
          type="button"
          onClick={start}
          className="rounded-xl bg-violet-600 px-8 py-3 font-semibold text-white transition hover:bg-violet-500 active:scale-95"
        >
          Lancer le quiz
        </button>
      </div>
    );
  }

  if (phase === "done") {
    const g = grade();
    return (
      <div className="card animate-scale-in flex flex-col items-center gap-6 py-10 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 text-4xl text-white shadow-glow">
          ∂
        </div>
        <div>
          <p className="text-5xl font-extrabold text-slate-900 dark:text-slate-100">{score}/{QUESTIONS.length}</p>
          <p className={`mt-2 text-lg font-semibold ${g.color}`}>{g.label}</p>
        </div>
        <div className="w-full max-w-xs space-y-1">
          <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Réussite</span>
            <span>{Math.round((score / QUESTIONS.length) * 100)}%</span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
            <div
              className="progress-bar h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-500"
              style={{ width: `${(score / QUESTIONS.length) * 100}%` }}
            />
          </div>
        </div>
        <button
          type="button"
          onClick={start}
          className="rounded-xl border border-slate-300 px-6 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          Rejouer
        </button>
      </div>
    );
  }

  return (
    <div className="card space-y-5">
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs font-medium">
          <span className="text-slate-500 dark:text-slate-400">Question {index + 1}/{QUESTIONS.length}</span>
          <span className="text-violet-600 dark:text-violet-400">{score} bonne{score > 1 ? "s" : ""}</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
          <div
            className="progress-bar h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <p key={`q-${animKey}`} className="animate-fade-up text-lg font-semibold leading-snug text-slate-900 dark:text-slate-100">
        {question.q}
      </p>

      <div key={`opts-${animKey}`} className="animate-fade-up grid gap-2 sm:grid-cols-2">
        {question.options.map((option, i) => {
          let style =
            "rounded-xl border px-4 py-3 text-left text-sm font-medium transition text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-violet-400 hover:bg-violet-50/60 dark:hover:bg-slate-800 dark:hover:border-violet-600 font-mono";

          if (phase === "feedback") {
            if (i === question.answer)
              style = "rounded-xl border px-4 py-3 text-left text-sm font-medium font-mono border-green-400 bg-green-50 text-green-800 dark:border-green-600 dark:bg-green-950/60 dark:text-green-300 animate-pop";
            else if (i === selected)
              style = "rounded-xl border px-4 py-3 text-left text-sm font-medium font-mono border-red-400 bg-red-50 text-red-800 dark:border-red-600 dark:bg-red-950/60 dark:text-red-300 animate-shake";
            else
              style = "rounded-xl border px-4 py-3 text-left text-sm font-medium font-mono border-slate-200 dark:border-slate-700 opacity-40 text-slate-400 dark:text-slate-600";
          }

          return (
            <button key={option} type="button" className={style} onClick={() => pick(i)}>
              <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                {String.fromCharCode(65 + i)}
              </span>
              {option}
            </button>
          );
        })}
      </div>

      {phase === "feedback" && (
        <div className={`animate-fade-up flex items-start gap-3 rounded-xl p-4 text-sm ${isCorrect ? "bg-green-50 text-green-800 dark:bg-green-950 dark:text-green-200" : "bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-200"}`}>
          {isCorrect ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /> : <XCircle className="mt-0.5 h-4 w-4 shrink-0" />}
          <span>{question.explanation}</span>
        </div>
      )}

      {phase === "feedback" && (
        <button type="button" onClick={next} className="w-full rounded-xl bg-violet-600 py-3 text-sm font-semibold text-white transition hover:bg-violet-500">
          {index + 1 < QUESTIONS.length ? "Question suivante →" : "Voir mes résultats"}
        </button>
      )}
    </div>
  );
}
