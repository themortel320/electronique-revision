"use client";

import { loadProgress, resetProgress } from "@/lib/progress";
import { getPseudo } from "@/lib/user";
import { BarChart2, CheckCircle2, RotateCcw, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";

const categoryLabels: Record<string, string> = {
  ohm: "Loi d'Ohm",
  power: "Puissance",
  series: "Série",
  parallel: "Parallèle",
  "series-parallel": "Série / Parallèle",
  divider: "Diviseur de tension",
  diodes: "Diodes / LED",
  transistors: "Transistors",
  derivative: "Dérivées",
};

export function ProgressPanel() {
  const [score, setScore] = useState(0);
  const [results, setResults] = useState<{ category: string; correct?: boolean; success?: boolean; expected: string | number; userAnswer: string | number; timestamp: string }[]>([]);
  const [pseudo, setPseudo] = useState<string | null>(null);

  const load = () => {
    const state = loadProgress();
    setScore(state.score);
    setResults(state.results ?? []);
    setPseudo(getPseudo());
  };

  useEffect(() => { load(); }, []);

  const correct = results.filter((h) => h.correct ?? h.success).length;
  const total = results.length;
  const ratio = total > 0 ? Math.round((correct / total) * 100) : 0;

  const reset = () => { resetProgress(); load(); };

  return (
    <div className="space-y-5 max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Ma progression</h1>
        <Link href="/dashboard" className="text-sm text-violet-400 hover:text-violet-300 transition-colors">
          Tableau de bord →
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { icon: <BarChart2 className="h-5 w-5 text-violet-400" />, label: "Score total", value: score },
          { icon: <CheckCircle2 className="h-5 w-5 text-emerald-400" />, label: "Bonnes réponses", value: `${correct}/${total}` },
          { icon: <span className="text-lg font-bold text-blue-400">%</span>, label: "Taux de réussite", value: `${ratio}%` },
        ].map(({ icon, label, value }) => (
          <div key={label} className="rounded-2xl border border-white/10 bg-[#0d0d1f] p-4 flex items-center gap-3">
            {icon}
            <div>
              <p className="text-xs text-white/40">{label}</p>
              <p className="text-2xl font-bold text-white">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {total > 0 && (
        <div className="rounded-2xl border border-white/10 bg-[#0d0d1f] p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-white/60">{pseudo ? `Progression de ${pseudo}` : "Progression"}</span>
            <span className="text-white/40">{ratio}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-violet-500 transition-all duration-500" style={{ width: `${ratio}%` }} />
          </div>
        </div>
      )}

      {/* Historique */}
      <div className="rounded-2xl border border-white/10 bg-[#0d0d1f] p-5 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-white/30">Historique récent</p>
          {results.length > 0 && (
            <button onClick={reset} className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors">
              <RotateCcw className="h-3 w-3" /> Réinitialiser
            </button>
          )}
        </div>

        {results.length === 0 && (
          <p className="py-4 text-center text-sm text-white/30">Aucun exercice réalisé pour le moment.</p>
        )}

        <div className="space-y-2 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
          {results.slice(0, 20).map((item, i) => {
            const isCorrect = item.correct ?? item.success ?? false;
            return (
              <div key={`${item.timestamp}-${i}`} className="flex items-center gap-3 rounded-xl bg-white/3 border border-white/8 px-3 py-2.5 text-sm">
                {isCorrect ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                ) : (
                  <XCircle className="h-4 w-4 shrink-0 text-red-400" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white/80 truncate">
                    {categoryLabels[item.category] ?? item.category}
                  </p>
                  <p className="text-xs text-white/30">
                    Réponse : {item.userAnswer} · Attendu : {item.expected}
                  </p>
                </div>
                <span className="shrink-0 text-xs text-white/20">
                  {new Date(item.timestamp).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
