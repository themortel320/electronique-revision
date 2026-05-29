import { Leaderboard } from "@/components/leaderboard";

export default function LeaderboardPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Classement</h1>
        <p className="mt-1 text-sm text-white/40">
          Les meilleurs scores de la semaine — quiz, jeux & diagnostic.
        </p>
      </header>
      <Leaderboard />
    </div>
  );
}
