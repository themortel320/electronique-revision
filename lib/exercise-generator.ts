import { Difficulty, Exercise, ExerciseCategory } from "@/types";

const rand = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const round = (value: number, digits = 2) =>
  Number.parseFloat(value.toFixed(digits));

export const categories: { id: ExerciseCategory; label: string }[] = [
  { id: "ohm", label: "Loi d'Ohm" },
  { id: "power", label: "Puissance" },
  { id: "series-parallel", label: "Serie / Parallele" },
  { id: "divider", label: "Diviseur de tension" },
  { id: "diodes", label: "Diodes / LED" },
  { id: "transistors", label: "Transistors BJT" }
];

export function generateExercise(
  category: ExerciseCategory,
  difficulty: Difficulty
): Exercise {
  const id = `${category}-${Date.now()}`;
  const factor = difficulty === "easy" ? 1 : difficulty === "medium" ? 2 : 3;

  switch (category) {
    case "ohm": {
      const r = rand(100, 1000 * factor);
      const i = rand(5, 20 * factor) / 1000;
      const u = round(r * i, 2);
      return {
        id,
        category,
        difficulty,
        question: `Calcule la tension U pour R = ${r} ohms et I = ${round(i * 1000)} mA.`,
        expected: u,
        unit: "V",
        steps: [
          "Appliquer la loi d'Ohm: U = R x I.",
          `Convertir I en A si besoin: I = ${i} A.`,
          `U = ${r} x ${i} = ${u} V.`
        ]
      };
    }
    case "power": {
      const u = rand(5, 24);
      const i = rand(50, 500 * factor) / 1000;
      const p = round(u * i, 3);
      return {
        id,
        category,
        difficulty,
        question: `Calcule la puissance pour U = ${u} V et I = ${round(i * 1000)} mA.`,
        expected: p,
        unit: "W",
        steps: [`P = U x I`, `P = ${u} x ${i} = ${p} W`]
      };
    }
    case "series-parallel":
    case "series":
    case "parallel": {
      const r1 = rand(100, 1000);
      const r2 = rand(100, 1000);
      if (category === "series") {
        const req = r1 + r2;
        return {
          id, category, difficulty,
          question: `Calcule Req de ${r1} ohms et ${r2} ohms en série.`,
          expected: req, unit: "ohms",
          steps: ["En série: Req = R1 + R2.", `Req = ${r1} + ${r2} = ${req} ohms.`]
        };
      }
      const req = round((r1 * r2) / (r1 + r2), 2);
      return {
        id, category, difficulty,
        question: `Calcule Req de ${r1} ohms et ${r2} ohms en parallele.`,
        expected: req, unit: "ohms",
        steps: ["En parallele: Req = (R1 × R2)/(R1 + R2).", `Req = (${r1} × ${r2}) / (${r1} + ${r2}) = ${req} ohms.`]
      };
    }
    case "divider": {
      const vin = rand(5, 15);
      const r1 = rand(1000, 5000 * factor);
      const r2 = rand(1000, 5000 * factor);
      const vout = round(vin * (r2 / (r1 + r2)), 2);
      return {
        id,
        category,
        difficulty,
        question: `Vin = ${vin}V, R1 = ${r1} ohms, R2 = ${r2} ohms. Calcule Vout.`,
        expected: vout,
        unit: "V",
        steps: [
          "Utiliser Vout = Vin x R2 / (R1 + R2).",
          `Vout = ${vin} x ${r2} / (${r1} + ${r2}) = ${vout} V.`
        ]
      };
    }
    case "diodes": {
      const vcc = rand(5, 15);
      const vf = round(rand(18, 34) / 10, 1);
      const i = rand(10, 25) / 1000;
      const r = round((vcc - vf) / i, 0);
      return {
        id,
        category,
        difficulty,
        question: `Dimensionne R LED pour Vcc=${vcc}V, Vf=${vf}V, I=${round(i * 1000)}mA.`,
        expected: r,
        unit: "ohms",
        steps: [
          "Formule: R = (Vcc - Vf) / I.",
          `R = (${vcc} - ${vf}) / ${i} = ${r} ohms.`
        ]
      };
    }
    case "transistors": {
      const vcmd = difficulty === "hard" ? 3.3 : 5;
      const ib = rand(1, 8 * factor) / 1000;
      const rb = round((vcmd - 0.7) / ib, 0);
      return {
        id,
        category,
        difficulty,
        question: `Calcule Rb pour Vcmd=${vcmd}V et Ib=${round(ib * 1000)}mA (Vbe=0.7V).`,
        expected: rb,
        unit: "ohms",
        steps: [
          "Formule: Rb = (Vcmd - Vbe) / Ib.",
          `Rb = (${vcmd} - 0.7) / ${ib} = ${rb} ohms.`
        ]
      };
    }
    default: {
      return {
        id,
        category,
        difficulty,
        question: "Exercice non disponible pour cette catégorie.",
        expected: 0,
        unit: "",
        steps: [],
      };
    }
  }
}
