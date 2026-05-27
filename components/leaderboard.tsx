"use client";

import { getLeaderboard, LeaderboardEntry } from "@/lib/leaderboard";
import { getPseudo } from "@/lib/user";
import { Trophy } from "lucide-react";
import { useEffect, useState } from "react";

const medals = ["🥇", "🥈", "🥉"];

export function Leaderboard() {
  const [board, setBoard] = useState<LeaderboardEntry[]>([]);
  const [me, setMe] = useState<string | null>(null);

  useEffect(() => {
    setBoard(getLeaderboard());
    setMe(getPseudo());
  }, []);

  if (board.length === 0) {
    return (
      <div className="card flex flex-col items-center gap-3 py-12 text-center">
        <Trophy className="h-10 w-10 text-slate-300 dark:text-slate-600" />
        <p className="font-semibold">Aucun score enregistré</p>
        <p className="text-sm text-slate-500">Complète un quiz pour apparaître ici.</p>
      </div>
    );
  }

  return (
    <div className="card space-y-3">
      <div className="flex items-center gap-2">
        <Trophy className="h-5 w-5 text-amber-500" />
        <h2 className="text-xl font-bold">Classement</h2>
      </div>

      <div className="space-y-2">
        {board.map((entry, i) => {
          const isMe = entry.pseudo === me;
          return (
            <div
              key={`${entry.pseudo}-${i}`}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 transition ${
                isMe
                  ? "border border-brand-300 bg-brand-50 dark:border-brand-700 dark:bg-brand-950"
                  : "bg-slate-50 dark:bg-slate-800"
              }`}
            >
              <span className="w-6 text-center text-lg">
                {medals[i] ?? `${i + 1}`}
              </span>
              <div className="flex-1 min-w-0">
                <p className="truncate font-semibold text-slate-900 dark:text-slate-100">
                  {entry.pseudo}
                  {isMe && (
                    <span className="ml-2 text-xs font-normal text-brand-500 dark:text-brand-400">
                      (toi)
                    </span>
                  )}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {entry.correct}/{entry.total} bonnes réponses
                </p>
              </div>
              <span className="shrink-0 text-lg font-bold text-slate-700 dark:text-slate-200">
                {entry.score} pts
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
