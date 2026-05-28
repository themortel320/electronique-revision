"use client";

import { submitScore } from "@/lib/leaderboard";
import { getPseudo, setPseudo, checkPseudoAvailable, reservePseudo, getUserToken } from "@/lib/user";
import { CheckCircle2, XCircle, Trophy, RotateCcw, ChevronRight, Loader2, User, BookOpen, ChevronDown } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { QUIZ_CATEGORIES, QuizCategory, QuizQuestion } from "@/lib/quiz-questions";

type Phase = "setup" | "select" | "answering" | "feedback" | "done";

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export function Quiz() {
  const [phase, setPhase] = useState<Phase>("setup");
  const [pseudoState, setPseudoState] = useState("");
  const [pseudoInput, setPseudoInput] = useState("");
  const [pseudoError, setPseudoError] = useState("");
  const [pseudoLoading, setPseudoLoading] = useState(false);
  const [category, setCategory] = useState<QuizCategory | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  // Load existing pseudo on mount
  useEffect(() => {
    const saved = getPseudo();
    if (saved) {
      setPseudoState(saved);
      setPseudoInput(saved);
      setPhase("select");
    }
    // Ensure token exists
    getUserToken();
  }, []);

  const question = questions[index];
  const isCorrect = selected === question?.answer;

  // ── Setup: choose/validate pseudo ──────────────────────────────────────────
  async function confirmPseudo() {
    const name = pseudoInput.trim();
    if (name.length < 2) {
      setPseudoError("Minimum 2 caractères.");
      return;
    }
    if (name.length > 16) {
      setPseudoError("Maximum 16 caractères.");
      return;
    }
    if (!/^[a-zA-Z0-9_\-àâéèêëîïôùûü]+$/.test(name)) {
      setPseudoError("Lettres, chiffres, _ et - uniquement.");
      return;
    }

    setPseudoLoading(true);
    setPseudoError("");

    const { available, owned } = await checkPseudoAvailable(name);

    if (!available && !owned) {
      setPseudoError("Ce pseudo est déjà pris cette semaine. Choisis-en un autre !");
      setPseudoLoading(false);
      return;
    }

    // Reserve it
    const res = await reservePseudo(name);
    if (!res.ok && res.taken) {
      setPseudoError("Ce pseudo vient d'être pris. Choisis-en un autre !");
      setPseudoLoading(false);
      return;
    }

    setPseudo(name);
    setPseudoState(name);
    setPseudoLoading(false);
    setPhase("select");
  }

  // ── Start quiz ──────────────────────────────────────────────────────────────
  function startQuiz(cat: QuizCategory) {
    const qs = cat.id === "mixed"
      ? shuffle(QUIZ_CATEGORIES.filter(c => c.id !== "mixed").flatMap(c => c.questions)).slice(0, 10)
      : shuffle(cat.questions).slice(0, 10);
    setCategory(cat);
    setQuestions(qs);
    setIndex(0);
    setScore(0);
    setSelected(null);
    setSubmitted(false);
    setSheetOpen(false);
    setAnimKey((k) => k + 1);
    setPhase("answering");
  }

  function pick(i: number) {
    if (phase !== "answering") return;
    setSelected(i);
    setPhase("feedback");
    if (i === question.answer) setScore((s) => s + 1);
  }

  async function next() {
    const finalScore = score + (isCorrect ? 1 : 0);
    if (index + 1 >= questions.length) {
      const pct = Math.round((finalScore / questions.length) * 100);
      if (!submitted) {
        setSubmitted(true);
        await submitScore({
          pseudo: pseudoState,
          score: pct,
          correct: finalScore,
          total: questions.length,
          category: category?.id ?? "electronics",
          date: new Date().toISOString(),
        });
      }
      setScore(finalScore);
      setPhase("done");
    } else {
      setIndex((i) => i + 1);
      setSelected(null);
      setPhase("answering");
      setAnimKey((k) => k + 1);
    }
  }

  const grade = useMemo(() => {
    const ratio = score / (questions.length || 1);
    if (ratio >= 0.9) return { label: "Expert ⚡", color: "text-amber-400" };
    if (ratio >= 0.7) return { label: "Avancé 🔋", color: "text-green-400" };
    if (ratio >= 0.5) return { label: "En progrès 📈", color: "text-blue-400" };
    return { label: "Débutant 🔌", color: "text-slate-400" };
  }, [score, questions.length]);

  // ── Phase: setup (choose pseudo) ───────────────────────────────────────────
  if (phase === "setup") {
    return (
      <div className="rounded-2xl border border-white/10 bg-[#0d0d1f] p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center text-2xl mx-auto">
            <User size={24} className="text-white" />
          </div>
          <h2 className="text-xl font-bold text-white">Choisis ton pseudo</h2>
          <p className="text-white/40 text-sm">
            Il sera unique cette semaine — les autres joueurs ne peuvent pas le prendre.
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              value={pseudoInput}
              onChange={(e) => { setPseudoInput(e.target.value); setPseudoError(""); }}
              onKeyDown={(e) => e.key === "Enter" && confirmPseudo()}
              placeholder="Ton pseudo (2-16 caractères)"
              maxLength={16}
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
            />
            <button
              onClick={confirmPseudo}
              disabled={pseudoLoading || pseudoInput.trim().length < 2}
              className="px-5 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium disabled:opacity-40 transition-colors flex items-center gap-2"
            >
              {pseudoLoading ? <Loader2 size={14} className="animate-spin" /> : "OK"}
            </button>
          </div>

          {pseudoError && (
            <p className="text-red-400 text-sm flex items-center gap-1.5">
              <XCircle size={14} /> {pseudoError}
            </p>
          )}

          <p className="text-white/20 text-xs">
            Lettres, chiffres, _ et - uniquement · Reset chaque lundi
          </p>
        </div>
      </div>
    );
  }

  // ── Phase: select category ─────────────────────────────────────────────────
  if (phase === "select") {
    return (
      <div className="space-y-5">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <span className="text-white/40 text-sm">Joueur :</span>
            <span className="text-violet-300 font-semibold text-sm">{pseudoState}</span>
            <button
              onClick={() => { setPhase("setup"); }}
              className="text-white/20 hover:text-white/50 text-xs underline transition-colors"
            >
              changer
            </button>
          </div>
          <h2 className="text-2xl font-bold text-white">Choisir un quiz</h2>
          <p className="text-white/40 text-sm">10 questions · Score dans le classement de la semaine</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {QUIZ_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => startQuiz(cat)}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 p-5 text-left transition-all hover:border-white/20 hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-br ${cat.color} transition-opacity`} />
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">{cat.emoji}</span>
                <div>
                  <p className="text-white font-semibold">{cat.label}</p>
                  <p className="text-white/40 text-xs">
                    {cat.id === "mixed" ? "Toutes catégories mélangées" : `${cat.questions.length} questions disponibles`}
                  </p>
                </div>
                <ChevronRight size={16} className="ml-auto text-white/20 group-hover:text-white/60 transition-colors" />
              </div>
              <div className={`h-1 w-12 rounded-full bg-gradient-to-r ${cat.color} opacity-60`} />
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ── Phase: done ────────────────────────────────────────────────────────────
  if (phase === "done") {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="rounded-2xl border border-white/10 bg-[#0d0d1f] p-8 flex flex-col items-center gap-6 text-center">
        <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${category?.color} flex items-center justify-center text-4xl shadow-lg`}>
          🎯
        </div>
        <div>
          <p className="text-5xl font-extrabold text-white mb-1">{score}/{questions.length}</p>
          <p className="text-white/50 text-sm mb-2">{pct}% de réussite</p>
          <p className={`text-lg font-semibold ${grade.color}`}>{grade.label}</p>
        </div>

        <div className="w-full max-w-xs">
          <div className="h-3 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${category?.color} transition-all duration-1000`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-white/50">
          <Trophy size={14} className="text-amber-400" />
          Score de {pct} pts enregistré pour <span className="text-violet-300 font-medium">{pseudoState}</span>
        </div>

        <div className="flex gap-3 flex-wrap justify-center">
          <button
            onClick={() => startQuiz(category!)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-sm font-medium transition-colors"
          >
            <RotateCcw size={14} />
            Rejouer
          </button>
          <button
            onClick={() => setPhase("select")}
            className={`px-5 py-2.5 rounded-xl bg-gradient-to-r ${category?.color} text-white text-sm font-medium transition-all hover:opacity-90`}
          >
            Autre catégorie
          </button>
        </div>
      </div>
    );
  }

  // ── Phase: answering / feedback ────────────────────────────────────────────
  const cheatSheet = category?.cheatSheet;

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0d0d1f] p-5 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span>{category?.emoji}</span>
          <span className="text-white/40 text-xs font-medium uppercase tracking-wider">{category?.label}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-white/40 text-xs">{score} / {index} bonne{score > 1 ? "s" : ""}</span>
          {cheatSheet && (
            <button
              onClick={() => setSheetOpen((v) => !v)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                sheetOpen
                  ? "border-violet-500/50 bg-violet-900/30 text-violet-300"
                  : "border-white/10 text-white/40 hover:text-white hover:border-white/20"
              }`}
            >
              <BookOpen size={11} />
              Aide
              <ChevronDown size={11} className={`transition-transform ${sheetOpen ? "rotate-180" : ""}`} />
            </button>
          )}
        </div>
      </div>

      {/* Cheat sheet panel */}
      {cheatSheet && sheetOpen && (
        <div className="rounded-xl border border-violet-700/30 bg-violet-950/30 p-4 space-y-2">
          <p className="text-violet-300 text-xs font-semibold uppercase tracking-wider mb-3">
            📋 {cheatSheet.title}
          </p>
          <div className="space-y-1.5">
            {cheatSheet.rows.map((row, i) => (
              <div key={i} className="grid grid-cols-[auto_1fr] gap-3 items-baseline">
                <code className="text-violet-200 text-xs font-mono bg-violet-900/40 px-2 py-0.5 rounded whitespace-nowrap">
                  {row.formula}
                </code>
                <div className="text-xs text-white/50 leading-tight">
                  <span className="text-white/70">{row.label}</span>
                  {row.note && <span className="text-white/30"> · {row.note}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${category?.color} transition-all duration-300`}
          style={{ width: `${(index / (questions.length || 1)) * 100}%` }}
        />
      </div>

      <p className="text-xs text-white/30 font-medium">Question {index + 1} / {questions.length}</p>

      <p key={`q-${animKey}`} className="text-lg font-semibold text-white leading-snug">
        {question?.q}
      </p>

      <div key={`opts-${animKey}`} className="grid gap-2 sm:grid-cols-2">
        {question?.options.map((option, i) => {
          let cls = "rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all text-white/70 border-white/10 hover:border-white/30 hover:text-white hover:bg-white/5";
          if (phase === "feedback") {
            if (i === question.answer) cls = "rounded-xl border px-4 py-3 text-left text-sm font-medium border-emerald-500/60 bg-emerald-900/20 text-emerald-300";
            else if (i === selected) cls = "rounded-xl border px-4 py-3 text-left text-sm font-medium border-red-500/40 bg-red-900/10 text-red-400";
            else cls = "rounded-xl border px-4 py-3 text-left text-sm font-medium text-white/20 border-white/5 opacity-50";
          }
          return (
            <button key={option} type="button" className={cls} onClick={() => pick(i)}>
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-xs font-bold text-white/50 mr-2">
                {String.fromCharCode(65 + i)}
              </span>
              {option}
            </button>
          );
        })}
      </div>

      {phase === "feedback" && (
        <div className={`flex items-start gap-3 rounded-xl p-4 text-sm ${
          isCorrect
            ? "bg-emerald-900/20 border border-emerald-700/30 text-emerald-300"
            : "bg-red-900/10 border border-red-700/20 text-red-300"
        }`}>
          {isCorrect ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /> : <XCircle className="mt-0.5 h-4 w-4 shrink-0" />}
          <span>{question?.explanation}</span>
        </div>
      )}

      {phase === "feedback" && (
        <button
          type="button"
          onClick={next}
          className={`w-full rounded-xl py-3 text-sm font-semibold text-white transition-all bg-gradient-to-r ${category?.color} hover:opacity-90 active:scale-[0.98]`}
        >
          {index + 1 < questions.length ? "Question suivante →" : "Voir mes résultats"}
        </button>
      )}
    </div>
  );
}
