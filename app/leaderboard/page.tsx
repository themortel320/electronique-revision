import { Leaderboard } from "@/components/leaderboard";

export default function LeaderboardPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Classement</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Les meilleurs scores du quiz — mis à jour après chaque partie.
        </p>
      </header>
      <Leaderboard />
    </div>
  );
}
