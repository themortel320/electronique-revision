"use client";

import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { Radar, Bar } from "react-chartjs-2";
import { useEffect, useState } from "react";
import { loadProgress } from "@/lib/progress";
import { loadQuizHistory, QuizSession } from "@/lib/quiz-history";
import { Trophy, Target, Flame, Clock, TrendingUp, RotateCcw, ChevronRight, AlertCircle } from "lucide-react";
import Link from "next/link";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

type CategoryStats = {
  label: string;
  total: number;
  correct: number;
};

const CATEGORY_LABELS: Record<string, string> = {
  ohm: "Loi d'Ohm",
  power: "Puissance",
  series: "Série",
  parallel: "Parallèle",
  divider: "Diviseur",
  diodes: "Diodes",
  transistors: "Transistors",
  derivative: "Dérivées",
};

function loadStreakFromStorage(): number {
  try {
    return parseInt(localStorage.getItem("streak") ?? "0");
  } catch {
    return 0;
  }
}

export function ProgressDashboard() {
  const [stats, setStats] = useState<ReturnType<typeof loadProgress> | null>(null);
  const [streak, setStreak] = useState(0);
  const [quizHistory, setQuizHistory] = useState<QuizSession[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setStats(loadProgress());
    setStreak(loadStreakFromStorage());
    setQuizHistory(loadQuizHistory());
  }, []);

  if (!mounted || !stats) return null;

  const results = stats.results ?? [];
  const totalAnswered = results.length;
  const totalCorrect = results.filter((r) => r.correct).length;
  const accuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

  // Per-category stats
  const catMap: Record<string, CategoryStats> = {};
  for (const r of results) {
    const cat = r.category ?? "unknown";
    if (!catMap[cat]) catMap[cat] = { label: CATEGORY_LABELS[cat] ?? cat, total: 0, correct: 0 };
    catMap[cat].total++;
    if (r.correct) catMap[cat].correct++;
  }
  const catEntries = Object.entries(catMap);

  const radarLabels = catEntries.map(([, s]) => s.label);
  const radarData = catEntries.map(([, s]) => (s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0));

  const radarChartData = {
    labels: radarLabels.length > 0 ? radarLabels : ["En attente"],
    datasets: [
      {
        label: "Score (%)",
        data: radarData.length > 0 ? radarData : [0],
        backgroundColor: "rgba(124,58,237,0.25)",
        borderColor: "rgba(124,58,237,0.8)",
        borderWidth: 2,
        pointBackgroundColor: "rgb(124,58,237)",
      },
    ],
  };

  const barData = {
    labels: catEntries.map(([, s]) => s.label),
    datasets: [
      {
        label: "Correctes",
        data: catEntries.map(([, s]) => s.correct),
        backgroundColor: "rgba(34,197,94,0.7)",
        borderRadius: 6,
      },
      {
        label: "Ratées",
        data: catEntries.map(([, s]) => s.total - s.correct),
        backgroundColor: "rgba(239,68,68,0.6)",
        borderRadius: 6,
      },
    ],
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        min: 0,
        max: 100,
        ticks: { stepSize: 25, color: "rgba(255,255,255,0.4)", backdropColor: "transparent" },
        grid: { color: "rgba(255,255,255,0.08)" },
        pointLabels: { color: "rgba(255,255,255,0.6)", font: { size: 11 } },
        angleLines: { color: "rgba(255,255,255,0.08)" },
      },
    },
    plugins: {
      legend: { display: false },
    },
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: "y" as const,
    scales: {
      x: {
        stacked: true,
        grid: { color: "rgba(255,255,255,0.06)" },
        ticks: { color: "rgba(255,255,255,0.4)" },
      },
      y: {
        stacked: true,
        grid: { color: "rgba(255,255,255,0.06)" },
        ticks: { color: "rgba(255,255,255,0.6)" },
      },
    },
    plugins: {
      legend: { labels: { color: "rgba(255,255,255,0.6)", boxWidth: 12 } },
    },
  };

  const weakest = catEntries
    .filter(([, s]) => s.total >= 2)
    .sort(([, a], [, b]) => a.correct / a.total - b.correct / b.total)
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* KPI cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            icon: <Trophy className="text-amber-400" size={20} />,
            label: "Score total",
            value: `${stats.score ?? 0} pts`,
            color: "from-amber-900/30 to-amber-800/10 border-amber-700/30",
          },
          {
            icon: <Target className="text-blue-400" size={20} />,
            label: "Précision",
            value: `${accuracy}%`,
            color: "from-blue-900/30 to-blue-800/10 border-blue-700/30",
          },
          {
            icon: <Flame className="text-orange-400" size={20} />,
            label: "Série",
            value: `${streak} 🔥`,
            color: "from-orange-900/30 to-orange-800/10 border-orange-700/30",
          },
          {
            icon: <TrendingUp className="text-emerald-400" size={20} />,
            label: "Exercices",
            value: `${totalAnswered}`,
            color: "from-emerald-900/30 to-emerald-800/10 border-emerald-700/30",
          },
        ].map(({ icon, label, value, color }) => (
          <div key={label} className={`rounded-2xl border bg-gradient-to-br ${color} p-4`}>
            <div className="flex items-center gap-2 mb-1">{icon}<span className="text-white/50 text-xs">{label}</span></div>
            <p className="text-2xl font-bold text-white">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar chart */}
        <div className="rounded-2xl border border-white/10 bg-[#0d0d1f] p-5">
          <p className="text-white/60 text-sm font-medium mb-4">Radar des compétences</p>
          <div className="h-[240px]">
            <Radar data={radarChartData} options={radarOptions} />
          </div>
        </div>

        {/* Bar chart */}
        {catEntries.length > 0 ? (
          <div className="rounded-2xl border border-white/10 bg-[#0d0d1f] p-5">
            <p className="text-white/60 text-sm font-medium mb-4">Résultats par catégorie</p>
            <div className="h-[240px]">
              <Bar data={barData} options={barOptions} />
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-[#0d0d1f] p-5 flex items-center justify-center">
            <p className="text-white/30 text-sm text-center">Complète des exercices pour voir tes stats !</p>
          </div>
        )}
      </div>

      {/* Weakest topics */}
      {weakest.length > 0 && (
        <div className="rounded-2xl border border-red-900/30 bg-red-950/20 p-5">
          <p className="text-red-400 text-sm font-medium mb-3 flex items-center gap-2">
            <RotateCcw size={14} /> À retravailler
          </p>
          <div className="space-y-3">
            {weakest.map(([key, s]) => {
              const pct = Math.round((s.correct / s.total) * 100);
              return (
                <div key={key}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-white/70">{s.label}</span>
                    <span className="text-white/40">{pct}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-red-500/60 transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent activity */}
      {results.length > 0 && (
        <div className="rounded-2xl border border-white/10 bg-[#0d0d1f] p-5">
          <p className="text-white/60 text-sm font-medium mb-3 flex items-center gap-2">
            <Clock size={14} /> Activité récente (exercices)
          </p>
          <div className="space-y-2 max-h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
            {[...results].reverse().slice(0, 12).map((r, i) => (
              <div key={i} className="flex items-center gap-3 text-sm py-1 border-b border-white/5">
                <span className={r.correct ? "text-emerald-400" : "text-red-400"}>
                  {r.correct ? "✓" : "✗"}
                </span>
                <span className="text-white/50 flex-1 truncate">{CATEGORY_LABELS[r.category ?? ""] ?? r.category}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${r.correct ? "bg-emerald-900/40 text-emerald-400" : "bg-red-900/40 text-red-400"}`}>
                  {r.correct ? "+10" : "−0"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quiz history */}
      {quizHistory.length > 0 && (
        <div className="rounded-2xl border border-white/10 bg-[#0d0d1f] p-5">
          <p className="text-white/60 text-sm font-medium mb-4 flex items-center gap-2">
            <Trophy size={14} className="text-amber-400" /> Historique des quiz ({quizHistory.length})
          </p>
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {quizHistory.map((s) => (
              <div key={s.id} className="rounded-xl border border-white/8 bg-white/3 px-4 py-3 text-sm">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-white/80">{s.categoryLabel}</span>
                  <span className={`font-bold text-sm ${s.score >= 80 ? "text-emerald-400" : s.score >= 50 ? "text-amber-400" : "text-red-400"}`}>
                    {s.score}%
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-white/30">
                  <span>{s.correct}/{s.total} correctes</span>
                  <span>{new Date(s.date).toLocaleDateString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
                </div>
                {s.wrongQuestions.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {s.wrongQuestions.slice(0, 2).map((w, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-xs text-white/30">
                        <AlertCircle size={10} className="mt-0.5 shrink-0 text-red-400/60" />
                        <span className="line-clamp-1">{w.q} → {w.correct}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Suggestions */}
      <div className="rounded-2xl border border-indigo-700/20 bg-indigo-950/20 p-5 space-y-3">
        <p className="text-indigo-300 text-sm font-semibold flex items-center gap-2">
          <TrendingUp size={14} /> Améliore ta progression
        </p>
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            { label: "Révision espacée", desc: "Mémorise durablement avec l'algo SM-2", href: "/spaced", emoji: "🧠" },
            { label: "Mode examen", desc: "Simule les conditions d'épreuve", href: "/exam", emoji: "📝" },
            { label: "Quiz", desc: "Teste tes connaissances en 10 questions", href: "/quiz", emoji: "🎯" },
          ].map(({ label, desc, href, emoji }) => (
            <Link
              key={href}
              href={href}
              className="flex items-start gap-3 rounded-xl border border-white/8 bg-white/3 hover:bg-white/5 hover:border-white/15 p-4 transition-all"
            >
              <span className="text-2xl">{emoji}</span>
              <div>
                <p className="text-sm font-medium text-white/80">{label}</p>
                <p className="text-xs text-white/40 mt-0.5">{desc}</p>
              </div>
              <ChevronRight size={14} className="ml-auto mt-1 text-white/20 shrink-0" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
