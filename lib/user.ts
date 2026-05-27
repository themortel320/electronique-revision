"use client";

const KEY = "elec-pseudo-v1";

export function getPseudo(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(KEY);
}

export function setPseudo(name: string): void {
  window.localStorage.setItem(KEY, name.trim());
}

export function clearPseudo(): void {
  window.localStorage.removeItem(KEY);
}
