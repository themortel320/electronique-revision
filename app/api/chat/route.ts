import { createGroq } from "@ai-sdk/groq";
import { streamText } from "ai";
import { NextRequest } from "next/server";

export const runtime = "edge";

const groq = createGroq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  if (!process.env.GROQ_API_KEY) {
    return new Response(
      JSON.stringify({ error: "GROQ_API_KEY non configurée. Ajoute-la dans .env.local." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const { messages, courseContext } = (await req.json()) as {
    messages: { role: "user" | "assistant"; content: string }[];
    courseContext?: {
      title: string;
      subject: string;
      summary: string;
      formulas: string[];
      notions: string[];
    };
  };

  const systemPrompt = courseContext
    ? `Tu es le Professeur IA d'ElectroLab, expert en ${courseContext.subject === "math" ? "mathématiques" : "électronique"}.

Cours actuel : "${courseContext.title}"
Résumé : ${courseContext.summary}
Notions clés : ${courseContext.notions.join(", ")}
Formules importantes : ${courseContext.formulas.join(" | ")}

Instructions :
- Réponds TOUJOURS en français, de façon claire et pédagogique
- Utilise des exemples chiffrés concrets quand c'est utile
- Pour les formules, écris-les de façon lisible : ex "U = R × I"
- Guide l'étudiant par des questions plutôt que de donner directement la réponse
- Sois encourageant et bienveillant
- Réponds de façon concise (3-6 phrases max sauf si une explication longue est nécessaire)`
    : `Tu es le Professeur IA d'ElectroLab, expert en électronique et mathématiques. 
Réponds toujours en français, de façon pédagogique, claire et encourageante.
Utilise des exemples concrets et des formules lisibles.`;

  const result = streamText({
    model: groq("llama-3.3-70b-versatile"),
    system: systemPrompt,
    messages,
    maxTokens: 800,
    temperature: 0.7,
  });

  return result.toDataStreamResponse();
}
