import { createGroq } from "@ai-sdk/groq";
import { generateObject } from "ai";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "edge";

const groq = createGroq({ apiKey: process.env.GROQ_API_KEY });

const questionSchema = z.object({
  type: z.enum(["qcm", "calcul", "vrai_faux", "trouver_erreur"]),
  enonce: z.string(),
  contexte_reel: z.string().optional(),
  choix: z.array(z.string()).optional(),
  reponse_index: z.number().optional(),
  reponse_texte: z.string().optional(),
  expected_number: z.number().optional(),
  unit: z.string().optional(),
  explication_detaillee: z.string(),
  indice: z.string(),
  difficulte: z.number().min(1).max(5),
});

export type GeneratedQuestion = z.infer<typeof questionSchema>;

export async function POST(req: NextRequest) {
  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json(
      { error: "GROQ_API_KEY non configurée." },
      { status: 500 }
    );
  }

  const { subject, chapter, difficulty, history } = (await req.json()) as {
    subject: string;
    chapter: string;
    difficulty: "débutant" | "intermédiaire" | "avancé";
    history?: string[];
  };

  const historyClause = history?.length
    ? `\n\nÉvite absolument de reposer ces questions récentes :\n${history.map((q, i) => `${i + 1}. ${q}`).join("\n")}`
    : "";

  const prompt = `Tu es un générateur d'exercices pédagogiques expert.

Génère UNE question originale sur : **${chapter}** (matière : ${subject})
Niveau : **${difficulty}**

Contraintes de variété OBLIGATOIRES :
- Varie le type : QCM, calcul direct, vrai/faux, ou "trouver l'erreur"
- Varie les valeurs numériques (utilise des nombres concrets et réalistes)
- Varie la formulation (commence différemment à chaque fois)
- Parfois inclus un contexte réel (circuit dans une maison, voiture, téléphone, etc.)
- Parfois pose une question piège ou contre-intuitive
- Pour QCM : 4 choix avec un seul correct, les mauvais doivent être plausibles

Pour les questions de calcul numérique : fournis expected_number et unit.
Pour QCM : fournis choix[] et reponse_index (0-based).
Pour vrai/faux : reponse_texte = "vrai" ou "faux".${historyClause}

Réponds en JSON valide uniquement.`;

  const { object } = await generateObject({
    model: groq("llama-3.3-70b-versatile"),
    schema: questionSchema,
    prompt,
    temperature: 0.9,
  });

  return NextResponse.json({ question: object });
}
