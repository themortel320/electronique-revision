"use client";

import { fetchLeaderboard, LeaderboardEntry } from "@/lib/leaderboard";
import { getPseudo } from "@/lib/user";
import { Trophy, Globe, HardDrive, RefreshCw, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { QUIZ_CATEGORIES } from "@/lib/quiz-questions";

const medals = ["🥇", "🥈", "🥉"];

const CATEGORY_COLORS: Record<string, string> = {
  electronics: "text-violet-400",
  maintenance: "text-orange-400",
  fabrication: "text-green-400",
  math: "text-blue-400",
  mixed: "text-pink-400",
  resistor: "text-amber-400",
  "diagnostic-easy":   "text-emerald-400",
  "diagnostic-medium": "text-yellow-400",
  "diagnostic-hard":   "text-orange-400",
  "diagnostic-expert": "text-red-400",
};

const CATEGORY_EMOJIS: Record<string, string> = {
  electronics: "⚡",
  maintenance: "🔧",
  fabrication: "🏭",
  math: "∂",
  mixed: "🎯",
  resistor: "🎨",
  "diagnostic-easy":   "🔌",
  "diagnostic-medium": "🔌",
  "diagnostic-hard":   "🔌",
  "diagnostic-expert": "🔌",
};

const CATEGORY_LABELS: Record<string, string> = {
  resistor: "Code couleur",
  "diagnostic-easy":   "Diagnostic Facile",
  "diagnostic-medium": "Diagnostic Moyen",
  "diagnostic-hard":   "Diagnostic Difficile",
  "diagnostic-expert": "Diagnostic Expert",
};

export function Leaderboard() {
  const [board, setBoard] = useState<LeaderboardEntry[]>([]);
  const [me, setMe] = useState<string | null>(null);
  const [shared, setShared] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [resetDate, setResetDate] = useState<string | null>(null);
  const [countdown, setCountdown] = useState("");

  async function load() {
    setLoading(true);
    const { entries, shared: s, resetDate: rd } = await fetchLeaderboard();
    setBoard(entries);
    setShared(s);
    setMe(getPseudo());
    if (rd) setResetDate(rd);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  // Countdown timer
  useEffect(() => {
    if (!resetDate) return;
    const tick = () => {
      const diff = new Date(resetDate).getTime() - Date.now();
      if (diff <= 0) { setCountdown("Reset imminent"); return; }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      setCountdown(d > 0 ? `${d}j ${h}h ${m}m` : `${h}h ${m}m`);
    };
    tick();
    const id = setInterval(tick, 60000);
    return () => clearInterval(id);
  }, [resetDate]);

  const allCats = board.map(e => e.category).filter((v, i, a) => a.indexOf(v) === i);
  const categories = ["all", ...QUIZ_CATEGORIES.map((c) => c.id), ...allCats.filter(c => !QUIZ_CATEGORIES.find(q => q.id === c))];

  const filtered = filter === "all"
    ? board
    : board.filter((e) => e.category === filter);

  const sorted = [...filtered].sort((a, b) => b.score - a.score).slice(0, 20);

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0d0d1f] p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Trophy className="text-amber-400" size={20} />
          <h2 className="text-xl font-bold text-white">Classement</h2>
          <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border ${
            shared
              ? "border-green-700/40 bg-green-900/20 text-green-400"
              : "border-white/10 bg-white/5 text-white/40"
          }`}>
            {shared ? <><Globe size={10} /> Global</> : <><HardDrive size={10} /> Local</>}
          </span>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="text-white/30 hover:text-white/60 transition-colors"
          title="Rafraîchir"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Reset timer */}
      {shared && countdown && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/8 text-xs text-white/40">
          <Clock size={12} className="text-white/30" />
          <span>Classement de la semaine · reset dans <span className="text-white/60 font-medium">{countdown}</span></span>
        </div>
      )}

      {!shared && (
        <div className="p-3 rounded-xl bg-amber-900/20 border border-amber-700/30 text-amber-300 text-xs">
          💡 Scores visibles uniquement sur cet appareil. Pour un classement partagé entre tous les joueurs,
          configure <code className="bg-black/30 px-1 rounded">UPSTASH_REDIS_REST_URL</code> et{" "}
          <code className="bg-black/30 px-1 rounded">UPSTASH_REDIS_REST_TOKEN</code> sur Vercel
          (gratuit sur <a href="https://upstash.com" target="_blank" rel="noreferrer" className="underline">upstash.com</a>).
        </div>
      )}

      {/* Category filter */}
      <div className="flex gap-1.5 flex-wrap">
        {categories.map((cat) => {
          const catObj = QUIZ_CATEGORIES.find((c) => c.id === cat);
          return (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all ${
                filter === cat
                  ? "border-violet-500 bg-violet-900/30 text-violet-300"
                  : "border-white/10 text-white/40 hover:text-white hover:border-white/20"
              }`}
            >
              {cat === "all" ? "🏆 Tous" : `${catObj?.emoji ?? CATEGORY_EMOJIS[cat] ?? ""} ${catObj?.label ?? CATEGORY_LABELS[cat] ?? cat}`}
            </button>
          );
        })}
      </div>

      {/* Board */}
      {loading ? (
        <div className="py-8 text-center text-white/30 text-sm flex flex-col items-center gap-2">
          <RefreshCw size={20} className="animate-spin" />
          Chargement…
        </div>
      ) : sorted.length === 0 ? (
        <div className="py-10 text-center space-y-2">
          <Trophy className="mx-auto text-white/10" size={40} />
          <p className="text-white/40 font-semibold">Aucun score encore</p>
          <p className="text-white/20 text-sm">Complète un quiz pour apparaître ici !</p>
        </div>
      ) : (
        <div className="space-y-2">
          {sorted.map((entry, i) => {
            const isMe = entry.pseudo === me;
            const emoji = CATEGORY_EMOJIS[entry.category] ?? "❓";
            const color = CATEGORY_COLORS[entry.category] ?? "text-white/40";

            return (
              <div
                key={`${entry.pseudo}-${entry.category}-${i}`}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all ${
                  isMe
                    ? "border border-violet-500/40 bg-violet-900/15"
                    : "bg-white/3 hover:bg-white/5"
                }`}
              >
                <span className="w-6 text-center text-lg shrink-0">
                  {medals[i] ?? <span className="text-white/30 text-sm font-bold">{i + 1}</span>}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="truncate font-semibold text-white text-sm">
                    {entry.pseudo}
                    {isMe && (
                      <span className="ml-2 text-xs font-normal text-violet-400">(toi)</span>
                    )}
                  </p>
                  <p className={`text-xs ${color} flex items-center gap-1`}>
                    {emoji} {QUIZ_CATEGORIES.find((c) => c.id === entry.category)?.label ?? CATEGORY_LABELS[entry.category] ?? entry.category}
                    <span className="text-white/20 mx-1">·</span>
                    <span className="text-white/30">{entry.correct}/{entry.total} bonnes réponses</span>
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-lg font-bold text-white">{entry.score}</span>
                  <span className="text-white/30 text-xs"> pts</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
