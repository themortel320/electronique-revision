import { Quiz } from "@/components/quiz";
import { Leaderboard } from "@/components/leaderboard";

export default function QuizPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-2">
          Quiz
        </h1>
        <p className="text-white/50 text-sm">
          4 catégories · 10 questions · Score dans le classement mondial
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 items-start">
        <Quiz />
        <Leaderboard />
      </div>
    </div>
  );
}
