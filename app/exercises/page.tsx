import { ExerciseGenerator } from "@/components/exercise-generator";
import { MiniCalculator } from "@/components/mini-calculator";
import { CircuitDiagram } from "@/components/circuit-diagram";

export default function ExercisesPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Exercices</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Génération aléatoire · Correction pas à pas · Calculatrice intégrée (bouton bas-droite)
        </p>
      </header>

      <ExerciseGenerator />

      <div>
        <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">
          Schémas de référence
        </p>
        <CircuitDiagram />
      </div>

      <MiniCalculator />
    </div>
  );
}
