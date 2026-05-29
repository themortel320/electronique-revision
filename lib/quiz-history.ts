// ── Quiz session history (localStorage) ──────────────────────────────────────

const KEY = "electrolab:quiz-history";
const MAX = 50; // keep last 50 sessions

export type QuizSession = {
  id: string;
  category: string;
  categoryLabel: string;
  date: string; // ISO
  score: number; // 0–100
  correct: number;
  total: number;
  wrongQuestions: { q: string; chosen: string; correct: string; explanation: string }[];
};

export function saveQuizSession(s: QuizSession) {
  try {
    const history = loadQuizHistory();
    history.unshift(s);
    localStorage.setItem(KEY, JSON.stringify(history.slice(0, MAX)));
  } catch { /* ignore */ }
}

export function loadQuizHistory(): QuizSession[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function clearQuizHistory() {
  try { localStorage.removeItem(KEY); } catch { /* ignore */ }
}
