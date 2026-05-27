import { Quiz } from "@/components/quiz";
import { Leaderboard } from "@/components/leaderboard";

export default function QuizPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Quiz rapide</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          10 questions · Progression question par question · Score sauvegardé
        </p>
      </header>
      <Quiz />
      <Leaderboard />
    </div>
  );
}
