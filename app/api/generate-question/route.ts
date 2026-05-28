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

RÈGLES STRICTES selon le type :

1. Type "qcm" : OBLIGATOIRE → choix (tableau de 4 strings) + reponse_index (0, 1, 2 ou 3)
2. Type "calcul" : OBLIGATOIRE → expected_number (nombre décimal exact) + unit (ex: "Ω", "V", "A", "W")
   - La question doit avoir UNE réponse numérique précise et unique
   - expected_number doit être le résultat correct du calcul, arrondi à 2 décimales
3. Type "vrai_faux" : OBLIGATOIRE → reponse_texte = "vrai" ou "faux" (minuscules)
4. Type "trouver_erreur" : OBLIGATOIRE → reponse_texte avec la correction en 1-2 mots clés

Contraintes de variété :
- Varie les valeurs numériques (nombres concrets et réalistes)
- Varie la formulation
- Parfois ajoute un contexte réel (maison, voiture, téléphone...)
- Pour QCM : les mauvaises réponses doivent être plausibles${historyClause}

IMPORTANT : Vérifie que ta réponse est mathématiquement correcte avant de répondre.
Réponds en JSON valide uniquement.`;

  const { object } = await generateObject({
    model: groq("llama-3.3-70b-versatile"),
    schema: questionSchema,
    prompt,
    temperature: 0.9,
  });

  return NextResponse.json({ question: object });
}
