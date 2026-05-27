import { generateDerivativeExercise } from "@/lib/derivative-generator";
import { Difficulty } from "@/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { difficulty?: Difficulty };
    const difficulty = body.difficulty ?? "easy";
    const exercise = generateDerivativeExercise(difficulty);
    return NextResponse.json({ exercise });
  } catch {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }
}
