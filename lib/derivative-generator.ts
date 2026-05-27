import { Difficulty, Exercise } from "@/types";

function r(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function superscript(n: number): string {
  const map: Record<number, string> = { 2: "²", 3: "³", 4: "⁴", 5: "⁵" };
  return map[n] ?? `^${n}`;
}

function formatPoly(coef: number, n: number, sign: "first" | "rest" = "rest"): string {
  if (n === 0) {
    if (sign === "first") return `${coef}`;
    return coef >= 0 ? ` + ${coef}` : ` − ${Math.abs(coef)}`;
  }
  if (n === 1) {
    const term = Math.abs(coef) === 1 ? "x" : `${Math.abs(coef)}x`;
    if (sign === "first") return coef < 0 ? `−${term}` : term;
    return coef >= 0 ? ` + ${term}` : ` − ${term}`;
  }
  const term = Math.abs(coef) === 1 ? `x${superscript(n)}` : `${Math.abs(coef)}x${superscript(n)}`;
  if (sign === "first") return coef < 0 ? `−${term}` : term;
  return coef >= 0 ? ` + ${term}` : ` − ${term}`;
}

function evalPoly(terms: { c: number; n: number }[], x: number): number {
  return terms.reduce((sum, { c, n }) => sum + c * Math.pow(x, n), 0);
}

export function generateDerivativeExercise(difficulty: Difficulty): Exercise {
  const id = `derivative-${Date.now()}`;
  const x0 = r(1, 3); // point d'évaluation

  if (difficulty === "easy") {
    // f(x) = a·xⁿ (terme unique, n de 1 à 4)
    const n = r(1, 4);
    const a = r(1, 8) * (Math.random() > 0.3 ? 1 : -1);

    const fDisplay = `f(x) = ${formatPoly(a, n, "first")}`;
    const derivCoef = n * a;
    const derivN = n - 1;

    let fpDisplay: string;
    if (derivN === 0) fpDisplay = `f'(x) = ${derivCoef}`;
    else fpDisplay = `f'(x) = ${formatPoly(derivCoef, derivN, "first")}`;

    const result = Math.round(derivCoef * Math.pow(x0, derivN) * 1000) / 1000;

    return {
      id,
      category: "derivative",
      difficulty,
      hint: fDisplay,
      question: `${fDisplay}. Calcule f'(${x0}).`,
      expected: result,
      unit: "",
      steps: [
        `Règle des puissances : (xⁿ)' = n·xⁿ⁻¹`,
        `(${a}·x${superscript(n)})' = ${n} × ${a} · x${superscript(n - 1)} = ${formatPoly(derivCoef, derivN, "first")}`,
        `f'(x) = ${fpDisplay.replace("f'(x) = ", "")}`,
        `f'(${x0}) = ${derivCoef} × ${x0}${derivN > 0 ? superscript(derivN) : ""} = ${result}`,
      ],
    };
  }

  if (difficulty === "medium") {
    // f(x) = ax² + bx + c (trinôme)
    const a = r(1, 6) * (Math.random() > 0.3 ? 1 : -1);
    const b = r(1, 8) * (Math.random() > 0.4 ? 1 : -1);
    const c = r(0, 10) * (Math.random() > 0.4 ? 1 : -1);

    const fStr =
      formatPoly(a, 2, "first") +
      (b !== 0 ? formatPoly(b, 1) : "") +
      (c !== 0 ? formatPoly(c, 0) : "");
    const fDisplay = `f(x) = ${fStr}`;

    const da = 2 * a;
    const db = b;
    const fpStr =
      formatPoly(da, 1, "first") + (db !== 0 ? formatPoly(db, 0) : "");
    const fpDisplay = `f'(x) = ${fpStr}`;

    const result = da * x0 + db;

    return {
      id,
      category: "derivative",
      difficulty,
      hint: fDisplay,
      question: `${fDisplay}. Calcule f'(${x0}).`,
      expected: result,
      unit: "",
      steps: [
        `On dérive terme à terme (linéarité) :`,
        `(${formatPoly(a, 2, "first")})' = ${formatPoly(da, 1, "first")}`,
        b !== 0 ? `(${formatPoly(b, 1, "first")})' = ${b}` : "(constante)' = 0",
        `f'(x) = ${fpStr}`,
        `f'(${x0}) = ${da}×${x0} + ${db} = ${da * x0} + ${db} = ${result}`,
      ],
    };
  }

  // Hard : terme cubique + terme linéaire + composée exponentielle ou sin
  const useExp = Math.random() > 0.5;
  const a = r(1, 4);
  const b = r(1, 5);

  if (useExp) {
    // f(x) = ax³ + b·e^(x)
    const fDisplay = `f(x) = ${a}x³ + ${b}eˣ`;
    const fpDisplay = `f'(x) = ${3 * a}x² + ${b}eˣ`;
    const result = Math.round((3 * a * x0 * x0 + b * Math.exp(x0)) * 100) / 100;

    return {
      id,
      category: "derivative",
      difficulty,
      hint: fDisplay,
      question: `${fDisplay}. Calcule f'(${x0}) (arrondi à 2 décimales).`,
      expected: result,
      unit: "",
      steps: [
        `(${a}x³)' = ${3 * a}x²  (règle des puissances)`,
        `(${b}eˣ)' = ${b}eˣ  (eˣ est sa propre dérivée)`,
        `f'(x) = ${3 * a}x² + ${b}eˣ`,
        `f'(${x0}) = ${3 * a}×${x0}² + ${b}×e^${x0}`,
        `f'(${x0}) = ${3 * a * x0 * x0} + ${b}×${Math.round(Math.exp(x0) * 10000) / 10000} ≈ ${result}`,
      ],
    };
  } else {
    // f(x) = ax³ + b·sin(x)
    const fDisplay = `f(x) = ${a}x³ + ${b}sin(x)`;
    const fpDisplay = `f'(x) = ${3 * a}x² + ${b}cos(x)`;
    const result = Math.round((3 * a * x0 * x0 + b * Math.cos(x0)) * 100) / 100;

    return {
      id,
      category: "derivative",
      difficulty,
      hint: fDisplay,
      question: `${fDisplay}. Calcule f'(${x0}) en radians (arrondi à 2 décimales).`,
      expected: result,
      unit: "",
      steps: [
        `(${a}x³)' = ${3 * a}x²  (règle des puissances)`,
        `(${b}sin x)' = ${b}cos(x)  (dérivée du sinus)`,
        `f'(x) = ${3 * a}x² + ${b}cos(x)`,
        `f'(${x0}) = ${3 * a}×${x0}² + ${b}×cos(${x0})`,
        `f'(${x0}) = ${3 * a * x0 * x0} + ${b}×${Math.round(Math.cos(x0) * 10000) / 10000} ≈ ${result}`,
      ],
    };
  }
}
