import { StudyPlanner } from "@/components/study-planner";

export default function StudyPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Plan de révision</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Choisis ton sujet et ta durée — une session guidée est générée automatiquement.
        </p>
      </header>
      <StudyPlanner />
    </div>
  );
}
