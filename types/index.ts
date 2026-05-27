export type FormulaDetail = {
  expr: string;
  use: string;
  tip?: string;
};

export type QAItem = {
  keywords: string[];
  answer: string;
};

export type CourseModule = {
  id: string;
  title: string;
  summary: string;
  notions: string[];
  formulas: string[];
  formulaDetails: FormulaDetail[];
  example: string;
  qa: QAItem[];
};

export type ExerciseCategory =
  | "ohm"
  | "power"
  | "series-parallel"
  | "divider"
  | "diodes"
  | "transistors";

export type Difficulty = "easy" | "medium" | "hard";

export type Exercise = {
  id: string;
  category: ExerciseCategory;
  difficulty: Difficulty;
  question: string;
  expected: number;
  unit: string;
  steps: string[];
};

export type ExerciseResult = {
  id: string;
  category: ExerciseCategory;
  difficulty: Difficulty;
  success: boolean;
  userAnswer: number;
  expected: number;
  timestamp: string;
};
