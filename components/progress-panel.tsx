"use client";

import { loadProgress, resetProgress } from "@/lib/progress";
import { getPseudo } from "@/lib/user";
import { BarChart2, CheckCircle2, RotateCcw, XCircle } from "lucide-react";
import { useEffect, useState } from "react";

const categoryLabels: Record<string, string> = {
  ohm: "Loi d'Ohm",
  power: "Puissance",
  "series-parallel": "Série / Parallèle",
  divider: "Diviseur de tension",
  diodes: "Diodes / LED",
  transistors: "Transistors",
};

export function ProgressPanel() {
  const [score, setScore] = useState(0);
  const [history, setHistory] = useState<
    { category: string; success: boolean; expected: number; userAnswer: number; timestamp: string }[]
  >([]);
  const [pseudo, setPseudo] = useState<string | null>(null);

  const load = () => {
    const state = loadProgress();
    setScore(state.score);
    setHistory(state.history);
    setPseudo(getPseudo());
  };

  useEffect(() => {
    load();
  }, []);

  const correct = history.filter((h) => h.success).length;
  const total = history.length;
  const ratio = total > 0 ? Math.round((correct / total) * 100) : 0;

  const reset = () => {
    resetProgress();
    load();
  };

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="card flex items-center gap-3">
          <BarChart2 className="h-6 w-6 text-brand-500" />
          <div>
            <p className="text-xs text-slate-500">Score total</p>
            <p className="text-2xl font-bold">{score}</p>
          </div>
        </div>
        <div className="card flex items-center gap-3">
          <CheckCircle2 className="h-6 w-6 text-green-500" />
          <div>
            <p className="text-xs text-slate-500">Bonnes réponses</p>
            <p className="text-2xl font-bold">
              {correct}/{total}
            </p>
          </div>
        </div>
        <div className="card flex items-center gap-3">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700 dark:bg-brand-900 dark:text-brand-300">
            %
          </div>
          <div>
            <p className="text-xs text-slate-500">Taux de réussite</p>
            <p className="text-2xl font-bold">{ratio}%</p>
          </div>
        </div>
      </div>

      {/* Barre de progression */}
      {total > 0 && (
        <div className="card space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">
              {pseudo ? `Progression de ${pseudo}` : "Progression"}
            </span>
            <span className="text-slate-500">{ratio}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
            <div
              className="progress-bar h-full rounded-full bg-brand-500"
              style={{ width: `${ratio}%` }}
            />
          </div>
        </div>
      )}

      {/* Historique */}
      <div className="card space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Historique récent
          </p>
          {history.length > 0 && (
            <button
              type="button"
              onClick={reset}
              className="flex items-center gap-1 text-xs text-red-500 hover:underline"
            >
              <RotateCcw className="h-3 w-3" />
              Réinitialiser
            </button>
          )}
        </div>

        {history.length === 0 && (
          <p className="py-4 text-center text-sm text-slate-400">
            Aucun exercice réalisé pour le moment.
          </p>
        )}

        <div className="space-y-2">
          {history.slice(0, 15).map((item) => (
            <div
              key={item.timestamp}
              className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2.5 text-sm dark:bg-slate-800"
            >
              {item.success ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 shrink-0 text-red-400" />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">
                  {categoryLabels[item.category] ?? item.category}
                </p>
                <p className="text-xs text-slate-400">
                  Ta réponse : {item.userAnswer} · Attendu : {item.expected}
                </p>
              </div>
              <span className="shrink-0 text-xs text-slate-400">
                {new Date(item.timestamp).toLocaleTimeString("fr-FR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
