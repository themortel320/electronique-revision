import { generateExercise } from "@/lib/exercise-generator";
import { Difficulty, ExerciseCategory } from "@/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      category?: ExerciseCategory;
      difficulty?: Difficulty;
    };

    const category = body.category ?? "ohm";
    const difficulty = body.difficulty ?? "easy";
    const exercise = generateExercise(category, difficulty);
    return NextResponse.json({ exercise });
  } catch {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }
}
