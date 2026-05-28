"use client";

import { useEffect, useRef, useState } from "react";
import { Clock, AlertTriangle, CheckCircle2, XCircle, Trophy } from "lucide-react";
import { generateExercise } from "@/lib/exercise-generator";
import { generateDerivativeExercise } from "@/lib/derivative-generator";
import type { Exercise, ExerciseCategoryAll } from "@/types";

const DURATIONS = [
  { label: "15 min", minutes: 15 },
  { label: "30 min", minutes: 30 },
  { label: "1 heure", minutes: 60 },
];

const CATEGORIES: { id: ExerciseCategoryAll; label: string }[] = [
  { id: "ohm", label: "Loi d'Ohm" },
  { id: "power", label: "Puissance" },
  { id: "series", label: "Série" },
  { id: "parallel", label: "Parallèle" },
  { id: "divider", label: "Diviseur" },
  { id: "diodes", label: "Diodes" },
  { id: "transistors", label: "Transistors" },
  { id: "derivative", label: "Dérivées" },
];

type ExamResult = {
  question: string;
  userAnswer: string;
  correct: boolean;
  expected: string;
  category: string;
};

type Phase = "config" | "running" | "finished";

export function ExamMode() {
  const [phase, setPhase] = useState<Phase>("config");
  const [selectedDuration, setSelectedDuration] = useState(30);
  const [selectedCats, setSelectedCats] = useState<Set<ExerciseCategoryAll>>(
    new Set(["ohm", "power", "series"] as ExerciseCategoryAll[])
  );
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [results, setResults] = useState<ExamResult[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function pickExercise() {
    const cats = Array.from(selectedCats);
    const cat = cats[Math.floor(Math.random() * cats.length)];
    const diff = questionsAnswered < 5 ? "easy" : questionsAnswered < 12 ? "medium" : "hard";
    const ex =
      cat === "derivative"
        ? generateDerivativeExercise(diff)
        : generateExercise(cat as Parameters<typeof generateExercise>[0], diff);
    setExercise(ex);
    setAnswer("");
    setFeedback(null);
    setTimeout(() => inputRef.current?.focus(), 100);
  }

  function startExam() {
    setResults([]);
    setQuestionsAnswered(0);
    setTimeLeft(selectedDuration * 60);
    setPhase("running");
  }

  useEffect(() => {
    if (phase === "running") {
      pickExercise();
      timerRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            clearInterval(timerRef.current!);
            setPhase("finished");
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  function checkAnswer() {
    if (!exercise || feedback) return;
    const raw = answer.trim().replace(",", ".");
    const num = parseFloat(raw);
    const isNumeric = !isNaN(exercise.expected) && Number.isFinite(exercise.expected);

    let correct = false;
    if (isNumeric && Number.isFinite(num)) {
      const tol = Math.max(0.01, Math.abs(exercise.expected) * 0.05);
      correct = Math.abs(num - exercise.expected) <= tol;
    } else {
      correct = raw.toLowerCase() === String(exercise.expected).toLowerCase();
    }

    setFeedback(correct ? "correct" : "wrong");
    setResults((prev) => [
      ...prev,
      {
        question: exercise.question,
        userAnswer: answer,
        correct,
        expected: isNumeric ? `${exercise.expected} ${exercise.unit ?? ""}` : String(exercise.expected),
        category: exercise.category,
      },
    ]);
    setQuestionsAnswered((q) => q + 1);

    setTimeout(() => {
      pickExercise();
    }, 1200);
  }

  function toggleCat(cat: ExerciseCategoryAll) {
    setSelectedCats((prev) => {
      const n = new Set(prev);
      if (n.has(cat)) {
        if (n.size > 1) n.delete(cat);
      } else {
        n.add(cat);
      }
      return n;
    });
  }

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeRatio = timeLeft / (selectedDuration * 60);
  const correctCount = results.filter((r) => r.correct).length;
  const finalScore = Math.round((correctCount / Math.max(results.length, 1)) * 100);

  /* ─── Config screen ─── */
  if (phase === "config") {
    return (
      <div className="max-w-lg mx-auto space-y-6">
        <div className="text-center space-y-2">
          <div className="text-5xl mb-2">📝</div>
          <h2 className="text-2xl font-bold text-white">Mode Examen</h2>
          <p className="text-white/50 text-sm">Pas d'indices, pas d'explications. Chrono activé.</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0d0d1f] p-5 space-y-4">
          <div>
            <p className="text-white/60 text-sm mb-3">Durée</p>
            <div className="flex gap-3">
              {DURATIONS.map(({ label, minutes: m }) => (
                <button
                  key={m}
                  onClick={() => setSelectedDuration(m)}
                  className={`flex-1 py-2 rounded-xl text-sm border transition-all ${
                    m === selectedDuration
                      ? "bg-violet-600 border-violet-500 text-white"
                      : "border-white/10 text-white/50 hover:border-white/30 hover:text-white"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-white/60 text-sm mb-3">Catégories</p>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => toggleCat(id)}
                  className={`px-3 py-1.5 rounded-xl text-sm border transition-all ${
                    selectedCats.has(id)
                      ? "bg-violet-600/40 border-violet-500/60 text-violet-300"
                      : "border-white/10 text-white/40 hover:text-white/60"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={startExam}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-semibold text-lg transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-violet-900/30"
        >
          Commencer l'examen
        </button>
      </div>
    );
  }

  /* ─── Running screen ─── */
  if (phase === "running" && exercise) {
    return (
      <div className="max-w-lg mx-auto space-y-5">
        {/* Timer bar */}
        <div className="rounded-2xl border border-white/10 bg-[#0d0d1f] p-4">
          <div className="flex items-center justify-between mb-2">
            <div className={`flex items-center gap-2 font-mono text-xl font-bold ${timeRatio < 0.25 ? "text-red-400" : timeRatio < 0.5 ? "text-amber-400" : "text-white"}`}>
              <Clock size={20} />
              {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
            </div>
            <div className="text-white/50 text-sm">{questionsAnswered} réponses · {correctCount} ✓</div>
          </div>
          <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${
                timeRatio < 0.25 ? "bg-red-500" : timeRatio < 0.5 ? "bg-amber-400" : "bg-violet-500"
              }`}
              style={{ width: `${timeRatio * 100}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div
          className={`rounded-2xl border p-5 transition-all duration-200 ${
            feedback === "correct"
              ? "border-emerald-500/50 bg-emerald-900/20"
              : feedback === "wrong"
              ? "border-red-500/50 bg-red-900/20"
              : "border-white/10 bg-[#0d0d1f]"
          }`}
        >
          <p className="text-white/40 text-xs uppercase tracking-wider mb-2">{exercise.category}</p>
          <p className="text-white text-base leading-relaxed mb-4">{exercise.question}</p>

          <div className="flex gap-2">
            <input
              ref={inputRef}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && checkAnswer()}
              placeholder="Ta réponse…"
              disabled={!!feedback}
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-violet-500/50 disabled:opacity-50"
            />
            <button
              onClick={checkAnswer}
              disabled={!!feedback || !answer.trim()}
              className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium disabled:opacity-40 transition-colors"
            >
              OK
            </button>
          </div>

          {exercise.unit && !feedback && (
            <p className="text-white/30 text-xs mt-2">Unité attendue : {exercise.unit}</p>
          )}

          {feedback && (
            <div className={`flex items-center gap-2 mt-3 text-sm font-medium ${feedback === "correct" ? "text-emerald-400" : "text-red-400"}`}>
              {feedback === "correct" ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
              {feedback === "correct" ? "Correct !" : `Raté — réponse : ${exercise.expected} ${exercise.unit ?? ""}`}
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ─── Finished screen ─── */
  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="text-center space-y-3">
        <div className="text-5xl">
          {finalScore >= 80 ? "🏆" : finalScore >= 60 ? "👍" : "📚"}
        </div>
        <h2 className="text-2xl font-bold text-white">Examen terminé !</h2>
        <div className="text-5xl font-black bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
          {finalScore}%
        </div>
        <p className="text-white/50 text-sm">
          {correctCount} / {results.length} réponses correctes
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#0d0d1f] p-5 space-y-3 max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
        <p className="text-white/60 text-sm font-medium mb-2">Détail des réponses</p>
        {results.map((r, i) => (
          <div key={i} className={`p-3 rounded-xl border text-sm ${r.correct ? "border-emerald-700/30 bg-emerald-900/10" : "border-red-700/30 bg-red-900/10"}`}>
            <div className="flex items-start gap-2">
              <span className={r.correct ? "text-emerald-400" : "text-red-400"}>
                {r.correct ? "✓" : "✗"}
              </span>
              <div className="flex-1">
                <p className="text-white/70 line-clamp-2">{r.question}</p>
                {!r.correct && (
                  <p className="text-white/40 text-xs mt-1">
                    Ta réponse : <span className="text-red-400">{r.userAnswer || "—"}</span> · Attendu : <span className="text-emerald-400">{r.expected}</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => setPhase("config")}
        className="w-full py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
      >
        Recommencer
      </button>
    </div>
  );
}
