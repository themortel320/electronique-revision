"use client";

import { upsertLeaderboard } from "@/lib/leaderboard";
import { getPseudo } from "@/lib/user";
import { CheckCircle2, XCircle } from "lucide-react";
import { useState } from "react";

const QUESTIONS = [
  {
    q: "Quelle est la loi d'Ohm ?",
    options: ["P = U × I", "U = R × I", "R = P / I²", "I = P × U"],
    answer: 1,
    explanation: "U = R × I : la tension est égale à la résistance multipliée par le courant.",
  },
  {
    q: "Quelle unité mesure la résistance ?",
    options: ["Volt (V)", "Ampère (A)", "Watt (W)", "Ohm (Ω)"],
    answer: 3,
    explanation: "La résistance se mesure en Ohm (Ω), du nom du physicien Georg Ohm.",
  },
  {
    q: "Une LED nécessite toujours…",
    options: ["Une bobine en série", "Une résistance en série", "Un condensateur en parallèle", "Rien d'autre"],
    answer: 1,
    explanation: "Sans résistance série, le courant n'est pas limité et la LED grille immédiatement.",
  },
  {
    q: "En série, la résistance équivalente est…",
    options: ["R1 × R2", "R1 × R2 / (R1+R2)", "R1 + R2", "1/(1/R1 + 1/R2)"],
    answer: 2,
    explanation: "En série, les résistances s'additionnent : Req = R1 + R2.",
  },
  {
    q: "Quelle formule donne la puissance dissipée ?",
    options: ["P = R / I", "P = U + I", "P = U × I", "P = U / R²"],
    answer: 2,
    explanation: "P = U × I, aussi écrit P = R × I² ou P = U² / R.",
  },
  {
    q: "La constante de temps d'un circuit RC est…",
    options: ["τ = R + C", "τ = R / C", "τ = R × C", "τ = C / R"],
    answer: 2,
    explanation: "τ = R × C en secondes. À t = τ, le condensateur est chargé à ~63%.",
  },
  {
    q: "Un transistor NPN en saturation se comporte comme…",
    options: ["Un interrupteur ouvert", "Une résistance élevée", "Un interrupteur fermé", "Une diode"],
    answer: 2,
    explanation: "En saturation, le transistor laisse passer le courant : c'est l'état ON (interrupteur fermé).",
  },
  {
    q: "La diode Zener est utilisée pour…",
    options: ["Amplifier un signal", "Réguler une tension", "Stocker de l'énergie", "Mesurer le courant"],
    answer: 1,
    explanation: "La Zener maintient une tension approximativement constante en polarisation inverse.",
  },
  {
    q: "Dans un diviseur de tension, Vout = ?",
    options: ["Vin × R1/(R1+R2)", "Vin × R2/(R1+R2)", "Vin / (R1 × R2)", "Vin + R2/R1"],
    answer: 1,
    explanation: "Vout = Vin × R2 / (R1 + R2). R2 est la résistance en bas (côté GND).",
  },
  {
    q: "La loi des mailles de Kirchhoff dit que…",
    options: [
      "La somme des courants entrant = sortant",
      "La somme des tensions dans une maille = 0",
      "La résistance totale est toujours minimale",
      "Le courant est constant dans tout le circuit",
    ],
    answer: 1,
    explanation: "Kirchhoff (mailles) : la somme algébrique des tensions dans une maille fermée vaut 0.",
  },
];

type Phase = "idle" | "answering" | "feedback" | "done";

export function Quiz() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [animKey, setAnimKey] = useState(0);

  const question = QUESTIONS[index];
  const isCorrect = selected === question?.answer;
  const progress = ((index) / QUESTIONS.length) * 100;

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
        score: (score + (isCorrect ? 0 : 0)) * 10,
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
    if (ratio >= 0.9) return { label: "Expert ⚡", color: "text-amber-500" };
    if (ratio >= 0.7) return { label: "Avancé 🔋", color: "text-green-500" };
    if (ratio >= 0.5) return { label: "En progrès 📈", color: "text-blue-500" };
    return { label: "Débutant 🔌", color: "text-slate-500" };
  };

  if (phase === "idle") {
    return (
      <div className="card flex flex-col items-center gap-5 py-12 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-violet-500 text-3xl text-white shadow-glow">
          ⚡
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Quiz Électronique</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            10 questions · Résultats dans le classement
          </p>
        </div>
        <button
          type="button"
          onClick={start}
          className="rounded-xl bg-brand-600 px-8 py-3 font-semibold text-white transition hover:bg-brand-500 active:scale-95"
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
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-violet-500 text-4xl shadow-glow">
          🎯
        </div>
        <div>
          <p className="text-5xl font-extrabold text-slate-900 dark:text-slate-100">
            {score}/{QUESTIONS.length}
          </p>
          <p className={`mt-2 text-lg font-semibold ${g.color}`}>{g.label}</p>
        </div>
        <div className="w-full max-w-xs space-y-1">
          <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Réussite</span>
            <span>{Math.round((score / QUESTIONS.length) * 100)}%</span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
            <div
              className="progress-bar h-full rounded-full bg-gradient-to-r from-brand-500 to-violet-500"
              style={{ width: `${(score / QUESTIONS.length) * 100}%` }}
            />
          </div>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">Score enregistré dans le classement.</p>
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
      {/* Barre de progression */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs font-medium">
          <span className="text-slate-500 dark:text-slate-400">Question {index + 1}/{QUESTIONS.length}</span>
          <span className="text-brand-600 dark:text-brand-400">{score} bonne{score > 1 ? "s" : ""}</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
          <div
            className="progress-bar h-full rounded-full bg-gradient-to-r from-brand-500 to-violet-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <p key={`q-${animKey}`} className="animate-fade-up text-lg font-semibold leading-snug text-slate-900 dark:text-slate-100">
        {question.q}
      </p>

      {/* Options */}
      <div key={`opts-${animKey}`} className="animate-fade-up grid gap-2 sm:grid-cols-2">
        {question.options.map((option, i) => {
          let style =
            "rounded-xl border px-4 py-3 text-left text-sm font-medium transition text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-brand-400 hover:bg-brand-50/60 dark:hover:bg-slate-800 dark:hover:border-brand-600";

          if (phase === "feedback") {
            if (i === question.answer) {
              style =
                "rounded-xl border px-4 py-3 text-left text-sm font-medium border-green-400 bg-green-50 text-green-800 dark:border-green-600 dark:bg-green-950/60 dark:text-green-300 animate-pop";
            } else if (i === selected) {
              style =
                "rounded-xl border px-4 py-3 text-left text-sm font-medium border-red-400 bg-red-50 text-red-800 dark:border-red-600 dark:bg-red-950/60 dark:text-red-300 animate-shake";
            } else {
              style =
                "rounded-xl border px-4 py-3 text-left text-sm font-medium text-slate-400 border-slate-200 dark:border-slate-700 dark:text-slate-600 opacity-50";
            }
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

      {/* Feedback */}
      {phase === "feedback" && (
        <div
          className={`animate-fade-up flex items-start gap-3 rounded-xl p-4 text-sm ${
            isCorrect
              ? "bg-green-50 text-green-800 dark:bg-green-950 dark:text-green-200"
              : "bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-200"
          }`}
        >
          {isCorrect ? (
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          ) : (
            <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
          )}
          <span>{question.explanation}</span>
        </div>
      )}

      {phase === "feedback" && (
        <button
          type="button"
          onClick={next}
          className="w-full rounded-xl bg-brand-600 py-3 text-sm font-semibold text-white transition hover:bg-brand-500"
        >
          {index + 1 < QUESTIONS.length ? "Question suivante →" : "Voir mes résultats"}
        </button>
      )}
    </div>
  );
}
