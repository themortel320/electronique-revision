"use client";

import { ExerciseResult } from "@/types";

const KEY = "elec-progress-v1";

export type ProgressState = {
  score: number;
  history: ExerciseResult[];
};

export function loadProgress(): ProgressState {
  if (typeof window === "undefined") return { score: 0, history: [] };
  try {
    return JSON.parse(window.localStorage.getItem(KEY) ?? "null") ?? { score: 0, history: [] };
  } catch {
    return { score: 0, history: [] };
  }
}

export function saveResult(result: ExerciseResult): ProgressState {
  const prev = loadProgress();
  const next: ProgressState = {
    score: prev.score + (result.success ? 10 : 0),
    history: [result, ...prev.history].slice(0, 50),
  };
  window.localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

export function resetProgress(): void {
  window.localStorage.removeItem(KEY);
}
