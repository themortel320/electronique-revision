import { ProgressPanel } from "@/components/progress-panel";

export default function ProgressPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Ma progression</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Score, taux de réussite et historique de tes exercices.
        </p>
      </header>
      <ProgressPanel />
    </div>
  );
}
