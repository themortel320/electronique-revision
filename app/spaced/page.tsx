"use client";

import { useEffect, useState } from "react";
import { loadSRS, saveSRS, getDueCards, updateCard, seedNewCards, SRSCard } from "@/lib/spaced-repetition";
import { QUIZ_CATEGORIES } from "@/lib/quiz-questions";
import { Brain, CheckCircle2, XCircle, ChevronRight, RotateCcw, BookOpen, Zap } from "lucide-react";

type Phase = "overview" | "reviewing" | "done";

export default function SpacedPage() {
  const [cards, setCards] = useState<SRSCard[]>([]);
  const [dueCards, setDueCards] = useState<SRSCard[]>([]);
  const [phase, setPhase] = useState<Phase>("overview");
  const [queue, setQueue] = useState<SRSCard[]>([]);
  const [current, setCurrent] = useState<SRSCard | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [queueIndex, setQueueIndex] = useState(0);
  const [sessionResults, setSessionResults] = useState({ correct: 0, total: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const existing = loadSRS();
    const seeded = seedNewCards(existing, QUIZ_CATEGORIES);
    const all = [...existing, ...seeded];
    if (seeded.length > 0) saveSRS(all);
    setCards(all);
    setDueCards(getDueCards(all, 20));
    setMounted(true);
  }, []);

  function startSession() {
    const due = getDueCards(cards, 20);
    setQueue(due);
    setCurrent(due[0] ?? null);
    setQueueIndex(0);
    setShowAnswer(false);
    setSessionResults({ correct: 0, total: 0 });
    setPhase("reviewing");
  }

  function grade(quality: 0 | 1 | 2 | 3) {
    if (!current) return;
    const updated = updateCard(current, quality);
    const newCards = cards.map((c) => (c.id === updated.id ? updated : c));
    setCards(newCards);
    saveSRS(newCards);

    const correct = quality >= 2;
    setSessionResults((r) => ({ correct: r.correct + (correct ? 1 : 0), total: r.total + 1 }));

    const next = queueIndex + 1;
    if (next >= queue.length) {
      setPhase("done");
    } else {
      setQueueIndex(next);
      setCurrent(queue[next]);
      setShowAnswer(false);
    }
  }

  const totalCards = cards.length;
  const newCards = cards.filter((c) => c.repetitions === 0 && c.nextReview <= new Date().toISOString().split("T")[0]).length;
  const learnedCards = cards.filter((c) => c.repetitions >= 3).length;

  if (!mounted) return null;

  return (
    <div className="max-w-xl mx-auto px-4 py-8 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center mx-auto shadow-lg shadow-violet-900/30">
          <Brain size={28} className="text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white">Révision Espacée</h1>
        <p className="text-white/40 text-sm">Algorithme SM-2 — revoir au bon moment pour mémoriser durablement</p>
      </div>

      {phase === "overview" && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "À réviser", value: dueCards.length, color: dueCards.length > 0 ? "text-amber-400" : "text-white/40", bg: dueCards.length > 0 ? "border-amber-500/30 bg-amber-900/15" : "border-white/10 bg-white/3" },
              { label: "Nouvelles cartes", value: newCards, color: "text-blue-400", bg: "border-blue-500/20 bg-blue-900/10" },
              { label: "Maîtrisées", value: learnedCards, color: "text-emerald-400", bg: "border-emerald-500/20 bg-emerald-900/10" },
            ].map(({ label, value, color, bg }) => (
              <div key={label} className={`rounded-2xl border p-4 text-center ${bg}`}>
                <p className={`text-2xl font-bold ${color}`}>{value}</p>
                <p className="text-xs text-white/40 mt-1">{label}</p>
              </div>
            ))}
          </div>

          {/* Explanation */}
          <div className="rounded-2xl border border-violet-700/20 bg-violet-950/20 p-5 space-y-3">
            <p className="text-violet-300 text-sm font-semibold flex items-center gap-2">
              <Zap size={14} /> Comment ça marche ?
            </p>
            <ul className="space-y-2 text-sm text-white/60">
              <li className="flex items-start gap-2"><ChevronRight size={14} className="mt-0.5 shrink-0 text-violet-400" />On te montre une question. Tu estimes si tu la connaissais.</li>
              <li className="flex items-start gap-2"><ChevronRight size={14} className="mt-0.5 shrink-0 text-violet-400" />Les questions bien connues reviennent moins souvent. Les difficiles reviennent plus vite.</li>
              <li className="flex items-start gap-2"><ChevronRight size={14} className="mt-0.5 shrink-0 text-violet-400" />Fais une session par jour pour des résultats optimaux.</li>
            </ul>
          </div>

          <button
            onClick={startSession}
            disabled={dueCards.length === 0}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-lg transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-violet-900/30 disabled:opacity-40 disabled:pointer-events-none"
          >
            {dueCards.length === 0
              ? "Aucune carte à réviser aujourd'hui 🎉"
              : `Réviser ${dueCards.length} carte${dueCards.length > 1 ? "s" : ""} →`}
          </button>

          {/* Category breakdown */}
          {totalCards > 0 && (
            <div className="rounded-2xl border border-white/10 bg-[#0d0d1f] p-5 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-white/30 flex items-center gap-1.5">
                <BookOpen size={11} /> Catégories ({totalCards} cartes)
              </p>
              {QUIZ_CATEGORIES.filter((c) => c.id !== "mixed").map((cat) => {
                const catCards = cards.filter((c) => c.categoryId === cat.id);
                const learned = catCards.filter((c) => c.repetitions >= 3).length;
                const pct = catCards.length > 0 ? Math.round((learned / catCards.length) * 100) : 0;
                return (
                  <div key={cat.id} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-white/60">{cat.emoji} {cat.label}</span>
                      <span className="text-white/30">{learned}/{catCards.length} maîtrisées</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/8 overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${cat.color} transition-all duration-500`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {phase === "reviewing" && current && (
        <div className="space-y-5">
          {/* Progress */}
          <div className="flex items-center justify-between text-xs text-white/40">
            <span>Carte {queueIndex + 1} / {queue.length}</span>
            <span className="text-emerald-400">{sessionResults.correct} correctes</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-white/8 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-300"
              style={{ width: `${(queueIndex / queue.length) * 100}%` }}
            />
          </div>

          {/* Card */}
          <div className="rounded-2xl border border-white/10 bg-[#0d0d1f] overflow-hidden">
            <div className="p-5">
              <p className="text-xs text-white/30 font-medium uppercase tracking-wider mb-3">
                {current.categoryLabel}
              </p>
              <p className="text-white text-lg font-semibold leading-snug">{current.q}</p>
            </div>

            {!showAnswer ? (
              <div className="border-t border-white/8 p-4">
                <button
                  onClick={() => setShowAnswer(true)}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600/30 to-indigo-600/30 border border-violet-500/30 text-violet-300 font-medium hover:brightness-110 transition-all"
                >
                  Voir la réponse
                </button>
              </div>
            ) : (
              <div className="border-t border-white/8 p-5 space-y-4">
                {/* Options with correct highlighted */}
                <div className="grid gap-2 sm:grid-cols-2">
                  {current.options.map((opt, i) => (
                    <div
                      key={i}
                      className={`rounded-xl border px-4 py-2.5 text-sm ${
                        i === current.answer
                          ? "border-emerald-500/60 bg-emerald-900/20 text-emerald-300 font-medium"
                          : "border-white/5 text-white/25"
                      }`}
                    >
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/8 text-xs mr-2">
                        {String.fromCharCode(65 + i)}
                      </span>
                      {opt}
                    </div>
                  ))}
                </div>

                <div className="rounded-xl bg-white/3 border border-white/8 px-4 py-3 text-sm text-white/60 leading-relaxed">
                  {current.explanation}
                </div>

                {/* Self-grade */}
                <div>
                  <p className="text-xs text-white/40 mb-2 text-center">Tu le savais ?</p>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { label: "Non 😔", q: 0 as const, cls: "border-red-700/40 bg-red-900/20 text-red-300 hover:bg-red-900/30" },
                      { label: "Vaguement", q: 1 as const, cls: "border-orange-700/40 bg-orange-900/20 text-orange-300 hover:bg-orange-900/30" },
                      { label: "À peu près", q: 2 as const, cls: "border-blue-700/40 bg-blue-900/20 text-blue-300 hover:bg-blue-900/30" },
                      { label: "Oui ! 🎉", q: 3 as const, cls: "border-emerald-700/40 bg-emerald-900/20 text-emerald-300 hover:bg-emerald-900/30" },
                    ].map(({ label, q, cls }) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => grade(q)}
                        className={`rounded-xl border px-2 py-2.5 text-xs font-medium transition-all ${cls}`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {phase === "done" && (
        <div className="rounded-2xl border border-white/10 bg-[#0d0d1f] p-8 flex flex-col items-center gap-5 text-center">
          <div className="text-5xl">
            {sessionResults.correct / sessionResults.total >= 0.8 ? "🏆" : sessionResults.correct / sessionResults.total >= 0.5 ? "👍" : "📚"}
          </div>
          <div>
            <p className="text-4xl font-extrabold text-white mb-1">{sessionResults.correct}/{sessionResults.total}</p>
            <p className="text-white/50 text-sm">bonnes réponses</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => { setPhase("overview"); setDueCards(getDueCards(cards, 20)); }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-colors"
            >
              <CheckCircle2 size={14} />
              Terminer
            </button>
            {getDueCards(cards, 20).length > 0 && (
              <button
                onClick={startSession}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-white/60 hover:text-white text-sm font-medium transition-colors"
              >
                <RotateCcw size={14} />
                Encore
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
