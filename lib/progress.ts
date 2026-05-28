"use client";

import type { ExerciseCategory, Difficulty } from "@/types";

const KEY = "elec-progress-v2";
const STREAK_KEY = "elec-streak";
const HISTORY_KEY = "elec-question-history";

export type ExerciseResult = {
  id: string;
  category: ExerciseCategory | "derivative" | string;
  difficulty: Difficulty;
  correct: boolean;
  userAnswer: string;
  expected: string;
  timestamp: string;
};

export type ProgressState = {
  score: number;
  results: ExerciseResult[];
};

export function loadProgress(): ProgressState {
  if (typeof window === "undefined") return { score: 0, results: [] };
  try {
    return JSON.parse(window.localStorage.getItem(KEY) ?? "null") ?? { score: 0, results: [] };
  } catch {
    return { score: 0, results: [] };
  }
}

export function saveResult(result: ExerciseResult): ProgressState {
  const prev = loadProgress();
  const next: ProgressState = {
    score: prev.score + (result.correct ? 10 : 0),
    results: [result, ...prev.results].slice(0, 100),
  };
  window.localStorage.setItem(KEY, JSON.stringify(next));

  // Streak update
  updateStreak(result.correct);

  return next;
}

export function resetProgress(): void {
  window.localStorage.removeItem(KEY);
  window.localStorage.removeItem(STREAK_KEY);
}

/* ── Streak helpers ── */
export type StreakState = { current: number; best: number };

export function loadStreak(): StreakState {
  if (typeof window === "undefined") return { current: 0, best: 0 };
  try {
    return JSON.parse(window.localStorage.getItem(STREAK_KEY) ?? "null") ?? { current: 0, best: 0 };
  } catch {
    return { current: 0, best: 0 };
  }
}

export function updateStreak(correct: boolean): StreakState {
  const prev = loadStreak();
  const next: StreakState = correct
    ? { current: prev.current + 1, best: Math.max(prev.best, prev.current + 1) }
    : { current: 0, best: prev.best };
  window.localStorage.setItem(STREAK_KEY, JSON.stringify(next));
  return next;
}

/* ── Question history (anti-répétition) ── */
export function loadQuestionHistory(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(HISTORY_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function addToQuestionHistory(questionEnonce: string): void {
  const prev = loadQuestionHistory();
  const next = [questionEnonce, ...prev].slice(0, 10);
  window.localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
}
