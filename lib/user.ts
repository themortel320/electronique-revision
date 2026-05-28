"use client";

const PSEUDO_KEY = "elec-pseudo-v1";
const TOKEN_KEY = "elec-user-token-v1";

// ─── Pseudo ───────────────────────────────────────────────────────────────────

export function getPseudo(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(PSEUDO_KEY);
}

export function setPseudo(name: string): void {
  window.localStorage.setItem(PSEUDO_KEY, name.trim());
}

export function clearPseudo(): void {
  window.localStorage.removeItem(PSEUDO_KEY);
}

// ─── User token (unique per browser, persists across sessions) ────────────────

export function getUserToken(): string {
  if (typeof window === "undefined") return "anon";
  let token = window.localStorage.getItem(TOKEN_KEY);
  if (!token) {
    token = crypto.randomUUID();
    window.localStorage.setItem(TOKEN_KEY, token);
  }
  return token;
}

// ─── Pseudo availability (calls the API) ─────────────────────────────────────

export async function checkPseudoAvailable(name: string): Promise<{ available: boolean; owned?: boolean }> {
  try {
    const token = getUserToken();
    const res = await fetch(`/api/pseudo?name=${encodeURIComponent(name)}&token=${encodeURIComponent(token)}`);
    return await res.json();
  } catch {
    return { available: true }; // fail open
  }
}

export async function reservePseudo(name: string): Promise<{ ok: boolean; taken?: boolean }> {
  try {
    const token = getUserToken();
    const res = await fetch("/api/pseudo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, token }),
    });
    return await res.json();
  } catch {
    return { ok: true }; // fail open
  }
}
