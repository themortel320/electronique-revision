// ── Spaced Repetition — SM-2 inspired algorithm ───────────────────────────────
// Each question has a state: easeFactor, interval (days), nextReview (ISO date)

const KEY = "electrolab:srs";

export type SRSCard = {
  id: string;         // unique: `${categoryId}:${questionIndex}`
  q: string;
  options: string[];
  answer: number;
  explanation: string;
  categoryId: string;
  categoryLabel: string;
  // SM-2 fields
  easeFactor: number; // starts at 2.5
  interval: number;   // days until next review
  repetitions: number;
  nextReview: string; // ISO date
  lastReview?: string;
};

function today(): string {
  return new Date().toISOString().split("T")[0];
}

export function loadSRS(): SRSCard[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function saveSRS(cards: SRSCard[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(cards));
  } catch { /* ignore */ }
}

/** Cards due for review today (nextReview <= today) */
export function getDueCards(cards: SRSCard[], limit = 20): SRSCard[] {
  const t = today();
  const due = cards.filter((c) => c.nextReview <= t);
  // shuffle + limit
  return [...due].sort(() => Math.random() - 0.5).slice(0, limit);
}

/** Update a card after answering. quality: 0 (fail) to 3 (easy) */
export function updateCard(card: SRSCard, quality: 0 | 1 | 2 | 3): SRSCard {
  const ef = Math.max(1.3, card.easeFactor + (0.1 - (3 - quality) * (0.08 + (3 - quality) * 0.02)));

  let interval: number;
  let repetitions = card.repetitions;

  if (quality < 2) {
    // Failed — restart
    interval = 1;
    repetitions = 0;
  } else {
    repetitions += 1;
    if (repetitions === 1) interval = 1;
    else if (repetitions === 2) interval = 3;
    else interval = Math.round(card.interval * ef);
  }

  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + interval);

  return {
    ...card,
    easeFactor: ef,
    interval,
    repetitions,
    nextReview: nextDate.toISOString().split("T")[0],
    lastReview: today(),
  };
}

/** Add new cards from QUIZ_CATEGORIES that aren't already in the SRS deck */
export function seedNewCards(existing: SRSCard[], quizCategories: { id: string; label: string; questions: { q: string; options: string[]; answer: number; explanation: string }[] }[]): SRSCard[] {
  const existingIds = new Set(existing.map((c) => c.id));
  const newCards: SRSCard[] = [];

  for (const cat of quizCategories) {
    if (cat.id === "mixed") continue;
    cat.questions.forEach((q, i) => {
      const id = `${cat.id}:${i}`;
      if (!existingIds.has(id)) {
        newCards.push({
          id,
          q: q.q,
          options: q.options,
          answer: q.answer,
          explanation: q.explanation,
          categoryId: cat.id,
          categoryLabel: cat.label,
          easeFactor: 2.5,
          interval: 0,
          repetitions: 0,
          nextReview: today(), // all new cards are due immediately
        });
      }
    });
  }
  return newCards;
}
