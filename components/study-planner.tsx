"use client";

import { getPseudo } from "@/lib/user";
import { PlanItem, StudyDuration, StudySubject } from "@/types";
import { BookOpen, CheckCircle2, Circle, Clock, Dumbbell, HelpCircle, Sparkles, Zap } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

/* ── Plan generation ─────────────────────────────────── */
function buildPlan(subject: StudySubject, duration: StudyDuration): PlanItem[] {
  const items: PlanItem[] = [];

  const addElec = (count: number) => {
    if (count >= 1)
      items.push({ id: "elec-course-1", type: "course", label: "Lois fondamentales", desc: "Ohm, puissance, série/parallèle", minutes: 10, href: "/modules", subject: "electronics", completed: false });
    if (count >= 2)
      items.push({ id: "elec-course-2", type: "course", label: "Composants passifs", desc: "Condensateurs, bobines, τ = RC", minutes: 8, href: "/modules", subject: "electronics", completed: false });
    if (count >= 3)
      items.push({ id: "elec-course-3", type: "course", label: "Diodes & Transistors", desc: "LED, Zener, NPN/PNP", minutes: 10, href: "/modules", subject: "electronics", completed: false });
    items.push({ id: "elec-exo", type: "exercises", label: "Exercices électronique", desc: `${count >= 2 ? 10 : 6} exercices générés`, minutes: count >= 2 ? 15 : 10, href: "/exercises", subject: "electronics", completed: false });
    items.push({ id: "elec-quiz", type: "quiz", label: "Quiz électronique", desc: "10 questions", minutes: 8, href: "/quiz", subject: "electronics", completed: false });
  };

  const addMath = (count: number) => {
    if (count >= 1)
      items.push({ id: "math-course-1", type: "course", label: "Introduction aux dérivées", desc: "Définition, intuition, règle des puissances", minutes: 12, href: "/math", subject: "math", completed: false });
    if (count >= 2)
      items.push({ id: "math-course-2", type: "course", label: "Règles de dérivation", desc: "Produit, quotient, composée, sin/cos", minutes: 10, href: "/math", subject: "math", completed: false });
    items.push({ id: "math-exo", type: "exercises", label: "Exercices dérivées", desc: `${count >= 2 ? 10 : 6} exercices`, minutes: count >= 2 ? 18 : 12, href: "/math", subject: "math", completed: false });
    items.push({ id: "math-quiz", type: "quiz", label: "Quiz dérivées", desc: "10 questions", minutes: 8, href: "/math", subject: "math", completed: false });
  };

  if (subject === "electronics") {
    addElec(duration === 30 ? 1 : duration === 60 ? 2 : 3);
  } else if (subject === "math") {
    addMath(duration === 30 ? 1 : duration === 60 ? 2 : 3);
  } else {
    // both
    addElec(duration === 30 ? 1 : 2);
    addMath(duration === 30 ? 1 : 2);
  }

  return items;
}

const typeIcon = { course: BookOpen, exercises: Dumbbell, quiz: HelpCircle };
const typeColor: Record<PlanItem["type"], string> = {
  course:    "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400",
  exercises: "bg-violet-100 text-violet-600 dark:bg-violet-900/50 dark:text-violet-400",
  quiz:      "bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400",
};
const subjectLabels: Record<StudySubject, string> = { electronics: "Électronique ⚡", math: "Mathématiques ∂", both: "Les deux 🚀" };

/* ── Timer hook ──────────────────────────────────────── */
function useTimer(active: boolean) {
  const [elapsed, setElapsed] = useState(0);
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    if (active) {
      ref.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    } else {
      if (ref.current) clearInterval(ref.current);
    }
    return () => { if (ref.current) clearInterval(ref.current); };
  }, [active]);
  const mm = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const ss = String(elapsed % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

/* ── Main component ──────────────────────────────────── */
export function StudyPlanner() {
  const [phase, setPhase] = useState<"config" | "active" | "done">("config");
  const [subject, setSubject] = useState<StudySubject>("electronics");
  const [duration, setDuration] = useState<StudyDuration>(60);
  const [plan, setPlan] = useState<PlanItem[]>([]);
  const timer = useTimer(phase === "active");
  const pseudo = getPseudo() ?? "Toi";

  const start = () => {
    setPlan(buildPlan(subject, duration));
    setPhase("active");
  };

  const toggle = (id: string) => {
    setPlan((prev) => {
      const next = prev.map((item) => item.id === id ? { ...item, completed: !item.completed } : item);
      if (next.every((i) => i.completed)) {
        setTimeout(() => setPhase("done"), 500);
      }
      return next;
    });
  };

  const totalMin = plan.reduce((s, i) => s + i.minutes, 0);
  const doneCount = plan.filter((i) => i.completed).length;
  const progress = plan.length > 0 ? (doneCount / plan.length) * 100 : 0;

  /* Config screen */
  if (phase === "config") {
    return (
      <div className="card space-y-7">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 text-brand-600 dark:bg-brand-900/50 dark:text-brand-400">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-bold text-slate-900 dark:text-slate-100">Plan de révision</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Bonjour {pseudo} ! Configure ta session d'aujourd'hui.
            </p>
          </div>
        </div>

        {/* Sujet */}
        <div>
          <p className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-300">Que veux-tu réviser ?</p>
          <div className="grid gap-2 sm:grid-cols-3">
            {(["electronics", "math", "both"] as StudySubject[]).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSubject(s)}
                className={`flex flex-col items-center gap-2 rounded-xl border-2 py-4 text-sm font-medium transition active:scale-95 ${
                  subject === s
                    ? "border-brand-500 bg-brand-50 text-brand-700 dark:border-brand-500 dark:bg-brand-950/50 dark:text-brand-300"
                    : "border-slate-200 bg-white hover:border-brand-300 dark:border-slate-700 dark:bg-slate-900"
                }`}
              >
                <span className="text-2xl">{s === "electronics" ? "⚡" : s === "math" ? "∂" : "🚀"}</span>
                <span>{s === "electronics" ? "Électronique" : s === "math" ? "Mathématiques" : "Les deux"}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Durée */}
        <div>
          <p className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-300">Combien de temps ?</p>
          <div className="flex gap-2">
            {([30, 60, 120] as StudyDuration[]).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDuration(d)}
                className={`flex-1 rounded-xl py-3 text-sm font-semibold transition ${
                  duration === d
                    ? "bg-brand-600 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
                }`}
              >
                {d === 30 ? "30 min" : d === 60 ? "1 heure" : "2 heures"}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={start}
          className="group relative w-full overflow-hidden rounded-xl bg-brand-600 py-3.5 text-sm font-bold text-white shadow-glow transition hover:bg-brand-500"
        >
          <span className="shimmer pointer-events-none absolute inset-0" />
          Commencer la session →
        </button>
      </div>
    );
  }

  /* Done screen */
  if (phase === "done") {
    return (
      <div className="card animate-scale-in flex flex-col items-center gap-6 py-12 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-violet-500 text-4xl shadow-glow">
          🏆
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Session terminée !</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Durée : {timer} · {subjectLabels[subject]}
          </p>
        </div>
        <p className="text-slate-600 dark:text-slate-300">
          Bravo {pseudo}, tu as complété {plan.length} tâches. Continue comme ça !
        </p>
        <button
          type="button"
          onClick={() => { setPhase("config"); setPlan([]); }}
          className="rounded-xl border border-slate-300 px-6 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          Nouvelle session
        </button>
      </div>
    );
  }

  /* Active session */
  return (
    <div className="space-y-4">
      {/* Header session */}
      <div className="card flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Session en cours</p>
          <p className="font-bold text-slate-900 dark:text-slate-100">{subjectLabels[subject]}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
            <Clock className="h-4 w-4" />
            {timer}
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400">{doneCount}/{plan.length} tâches</p>
            <p className="text-xs text-slate-400">~{totalMin} min prévues</p>
          </div>
        </div>
      </div>

      {/* Barre de progression */}
      <div className="rounded-xl bg-white px-4 py-3 dark:bg-slate-900">
        <div className="mb-1.5 flex justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Progression</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
          <div className="progress-bar h-full rounded-full bg-gradient-to-r from-brand-500 to-violet-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Liste des tâches */}
      <div className="space-y-2">
        {plan.map((item, i) => {
          const Icon = typeIcon[item.type];
          return (
            <div
              key={item.id}
              className={`animate-fade-up card flex items-center gap-4 transition-all ${item.completed ? "opacity-60" : ""}`}
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              {/* Check toggle */}
              <button
                type="button"
                onClick={() => toggle(item.id)}
                className="shrink-0 transition hover:scale-110"
              >
                {item.completed ? (
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                ) : (
                  <Circle className="h-6 w-6 text-slate-300 dark:text-slate-600" />
                )}
              </button>

              {/* Icon type */}
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${typeColor[item.type]}`}>
                <Icon className="h-4 w-4" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className={`font-semibold text-slate-900 dark:text-slate-100 ${item.completed ? "line-through" : ""}`}>
                  {item.label}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{item.desc} · ~{item.minutes} min</p>
              </div>

              {/* Link */}
              {item.href && !item.completed && (
                <Link
                  href={item.href}
                  className="shrink-0 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Ouvrir →
                </Link>
              )}
            </div>
          );
        })}
      </div>

      {/* Marquer tout comme fait */}
      <button
        type="button"
        onClick={() => {
          setPlan((p) => p.map((i) => ({ ...i, completed: true })));
          setTimeout(() => setPhase("done"), 400);
        }}
        className="w-full rounded-xl border border-dashed border-slate-300 py-2.5 text-sm text-slate-500 transition hover:border-brand-400 hover:text-brand-600 dark:border-slate-700 dark:hover:border-brand-600 dark:hover:text-brand-400"
      >
        Tout marquer comme terminé
      </button>
    </div>
  );
}
