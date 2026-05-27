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
  subject: "electronics" | "math";
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
  category: ExerciseCategory | "derivative";
  difficulty: Difficulty;
  question: string;
  expected: number;
  unit: string;
  steps: string[];
  /** Extra display for math (e.g. function definition) */
  hint?: string;
};

export type ExerciseResult = {
  id: string;
  category: ExerciseCategory | "derivative";
  difficulty: Difficulty;
  success: boolean;
  userAnswer: number;
  expected: number;
  timestamp: string;
};

export type StudySubject = "electronics" | "math" | "both";
export type StudyDuration = 30 | 60 | 120;

export type PlanItem = {
  id: string;
  type: "course" | "exercises" | "quiz";
  label: string;
  desc: string;
  minutes: number;
  href?: string;
  subject: "electronics" | "math";
  completed: boolean;
};
