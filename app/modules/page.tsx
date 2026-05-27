import { CourseCard } from "@/components/course-card";
import { courseModules } from "@/lib/modules";
import Link from "next/link";

export default function ModulesPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Cours</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Clique sur un module pour dérouler les notions, formules et exemples.
        </p>
      </header>

      <div className="space-y-3">
        {courseModules.map((module) => (
          <CourseCard key={module.id} module={module} />
        ))}
      </div>

      <div className="rounded-2xl border border-dashed border-brand-300 bg-brand-50 p-5 dark:border-brand-800 dark:bg-brand-950">
        <p className="font-semibold text-brand-700 dark:text-brand-300">
          Tu veux tester ce que tu as appris ?
        </p>
        <p className="mt-1 text-sm text-brand-600 dark:text-brand-400">
          Lance un exercice ou passe le quiz pour valider tes connaissances.
        </p>
        <div className="mt-3 flex gap-2">
          <Link
            href="/exercises"
            className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-500"
          >
            Exercices →
          </Link>
          <Link
            href="/quiz"
            className="rounded-xl border border-brand-300 px-4 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-100 dark:border-brand-700 dark:text-brand-300"
          >
            Quiz →
          </Link>
        </div>
      </div>
    </div>
  );
}
