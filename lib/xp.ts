const XP_KEY = "electrolab:xp";
const LEVEL_KEY = "electrolab:level";

export interface LevelInfo {
  level: number;
  title: string;
  color: string;
  glow: string;
  emoji: string;
  xp: number;
  xpInLevel: number;   // XP earned within current level
  xpNeeded: number;    // XP to next level
  pct: number;         // 0-100 progress to next level
  isMax: boolean;
}

export const LEVELS = [
  { level: 1, min: 0,     max: 150,  title: "Stagiaire",      color: "#9E9E9E", glow: "#9E9E9E44", emoji: "🔩" },
  { level: 2, min: 150,   max: 400,  title: "Technicien",     color: "#4CAF50", glow: "#4CAF5044", emoji: "🔧" },
  { level: 3, min: 400,   max: 800,  title: "Électronicien",  color: "#2196F3", glow: "#2196F344", emoji: "⚡" },
  { level: 4, min: 800,   max: 1500, title: "Ingénieur",      color: "#9C27B0", glow: "#9C27B044", emoji: "🔬" },
  { level: 5, min: 1500,  max: 3000, title: "Expert",         color: "#FF9800", glow: "#FF980044", emoji: "🎛️" },
  { level: 6, min: 3000,  max: 6000, title: "Maître",         color: "#F44336", glow: "#F4433644", emoji: "🏆" },
  { level: 7, min: 6000,  max: Infinity, title: "Légende",    color: "#FFD700", glow: "#FFD70044", emoji: "⭐" },
];

export function getLevelInfo(xp: number): LevelInfo {
  const found = [...LEVELS].reverse().find(l => xp >= l.min) ?? LEVELS[0];
  const next = LEVELS.find(l => l.level === found.level + 1);
  const xpInLevel = xp - found.min;
  const xpNeeded  = next ? next.min - found.min : 1;
  const pct = next ? Math.min(100, Math.round((xpInLevel / xpNeeded) * 100)) : 100;
  return {
    ...found,
    xp,
    xpInLevel,
    xpNeeded,
    pct,
    isMax: !next,
  };
}

export function loadXP(): number {
  if (typeof window === "undefined") return 0;
  return parseInt(localStorage.getItem(XP_KEY) ?? "0", 10) || 0;
}

export function saveXP(xp: number): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(XP_KEY, String(xp));
  localStorage.setItem(LEVEL_KEY, String(getLevelInfo(xp).level));
}

export interface XPResult {
  prevXP: number;
  newXP: number;
  gained: number;
  prevLevel: number;
  newLevel: number;
  leveledUp: boolean;
  levelInfo: LevelInfo;
}

export function addXP(amount: number): XPResult {
  const prevXP = loadXP();
  const prevLevel = getLevelInfo(prevXP).level;
  const newXP = prevXP + amount;
  const levelInfo = getLevelInfo(newXP);
  const newLevel = levelInfo.level;
  saveXP(newXP);
  return { prevXP, newXP, gained: amount, prevLevel, newLevel, leveledUp: newLevel > prevLevel, levelInfo };
}

// XP rewards
export const XP_REWARDS = {
  quizCorrect:      5,
  quizComplete:     25,
  quizPerfect:      50,  // 10/10
  srsReview:        3,
  resistorCorrect:  4,
  resistorStreak5:  15,
  diagnosticEasy:   40,
  diagnosticMedium: 70,
  diagnosticHard:   120,
  diagnosticExpert: 200,
  examComplete:     30,
};
