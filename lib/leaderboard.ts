"use client";

const KEY = "elec-leaderboard-v1";

export type LeaderboardEntry = {
  pseudo: string;
  score: number;
  correct: number;
  total: number;
  date: string;
};

export function getLeaderboard(): LeaderboardEntry[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(KEY) ?? "[]") as LeaderboardEntry[];
  } catch {
    return [];
  }
}

export function upsertLeaderboard(entry: LeaderboardEntry): void {
  const board = getLeaderboard();
  const idx = board.findIndex((e) => e.pseudo === entry.pseudo);
  if (idx >= 0) {
    // Keep best score per pseudo
    if (entry.score > board[idx].score) {
      board[idx] = entry;
    }
  } else {
    board.push(entry);
  }
  board.sort((a, b) => b.score - a.score);
  window.localStorage.setItem(KEY, JSON.stringify(board.slice(0, 20)));
}
