"use client";

const LOCAL_KEY = "elec-leaderboard-v2";

export type LeaderboardEntry = {
  pseudo: string;
  score: number;
  correct: number;
  total: number;
  category: string;
  date: string;
};

// ─── Local storage (fallback / offline) ───────────────────────────────────────

export function getLocalLeaderboard(): LeaderboardEntry[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(LOCAL_KEY) ?? "[]") as LeaderboardEntry[];
  } catch {
    return [];
  }
}

function saveLocal(entry: LeaderboardEntry) {
  const board = getLocalLeaderboard();
  const idx = board.findIndex((e) => e.pseudo === entry.pseudo && e.category === entry.category);
  if (idx >= 0) {
    if (entry.score > board[idx].score) board[idx] = entry;
  } else {
    board.push(entry);
  }
  board.sort((a, b) => b.score - a.score);
  window.localStorage.setItem(LOCAL_KEY, JSON.stringify(board.slice(0, 50)));
}

// ─── API (global shared) ──────────────────────────────────────────────────────

export async function fetchLeaderboard(): Promise<{ entries: LeaderboardEntry[]; shared: boolean; resetDate?: string }> {
  try {
    const res = await fetch("/api/leaderboard");
    const data = await res.json();
    if (data.source === "redis") {
      return { entries: data.entries as LeaderboardEntry[], shared: true, resetDate: data.resetDate };
    }
  } catch {
    // network error → fall back to local
  }
  return { entries: getLocalLeaderboard(), shared: false };
}

export async function submitScore(entry: LeaderboardEntry): Promise<void> {
  // Always save locally
  saveLocal(entry);

  // Try to share globally
  try {
    await fetch("/api/leaderboard", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entry),
    });
  } catch {
    // silently fail — score is saved locally
  }
}
