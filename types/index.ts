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
  | "series"
  | "parallel"
  | "series-parallel"
  | "divider"
  | "diodes"
  | "transistors";

export type Difficulty = "easy" | "medium" | "hard";

export type ExerciseCategoryAll = ExerciseCategory | "derivative";

export type Exercise = {
  id: string;
  category: ExerciseCategoryAll;
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
  category: ExerciseCategoryAll | string;
  difficulty: Difficulty;
  /** Legacy field (kept for old progress data) */
  success?: boolean;
  correct?: boolean;
  userAnswer: string | number;
  expected: string | number;
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
