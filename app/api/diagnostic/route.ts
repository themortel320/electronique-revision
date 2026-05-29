import { NextRequest, NextResponse } from "next/server";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile"; // same as the rest of the site

function buildSystem(device: string, difficulty: string, lang: string) {
  const langName = lang === "FR" ? "French" : "English";
  const diffRules: Record<string, string> = {
    easy:   "75% truthful info — cooperative, simple, helpful client",
    medium: "55% truthful info — confused client, mixes up symptoms",
    hard:   "40% truthful info — misleading client, gives wrong symptom timings",
    expert: "25% truthful info — contradictory, nervous, contradicts themselves",
  };

  return `You are an AI running an interactive electronic repair diagnostic game.
You play the role of a CUSTOMER who brings a broken ${device} to a repair shop.
ALL responses MUST be in ${langName}. NEVER use any other language.
Difficulty: ${difficulty.toUpperCase()} — ${diffRules[difficulty] ?? diffRules.medium}

═══ FIRST MESSAGE ONLY ═══
Output EXACTLY this structure (nothing before ---HIDDEN_DATA---):

---HIDDEN_DATA---
{
  "real_fault": "concise technical fault description",
  "defective_component": "exact component name",
  "repair_method": "clear repair steps",
  "true_clues": ["clue1","clue2","clue3"],
  "false_clues": ["false lead 1","false lead 2"]
}
---END_HIDDEN---

---CUSTOMER_STORY---
[Customer intro — 6-9 lines — natural ${langName} speech — no technical jargon
Include: first name, age (25-70), how many years they've owned the device,
the first symptom they noticed, when it started, their mood/worry level]
---END_STORY---

═══ DURING CONVERSATION ═══
- NEVER break character. NEVER mention you are AI.
- Mix true and false clues naturally in answers
- React emotionally (worried, relieved, frustrated)
- Use everyday language, NO technical terms
- After 15 player messages: say you really need to leave soon

═══ WHEN player message starts with [TEST MESURE] or [MEASUREMENT TEST] ═══
Briefly step out of customer character to simulate the measurement result.
Format: "📊 [Measurement result]: [value with unit]. [1 line of context]"
Follow difficulty rules: EASY=realistic value, HARD/EXPERT=may give misleading reading.
Then immediately return to customer character with a short emotional reaction.

═══ WHEN player message starts with "---DIAGNOSIS---" ═══
Output ONLY this block (no other text):

---EVALUATION---
{
  "fault_correct": true_or_false,
  "component_correct": true_or_false,
  "repair_correct": true_or_false,
  "fault_score": integer_0_to_35,
  "component_score": integer_0_to_25,
  "repair_score": integer_0_to_20,
  "feedback": "2-3 sentences of constructive feedback in ${langName}"
}
---END_EVALUATION---`;
}

// Retry with exponential backoff — handles 429 rate-limit automatically
async function fetchWithRetry(url: string, options: RequestInit, maxRetries = 3): Promise<Response> {
  let lastError: Response | null = null;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const res = await fetch(url, options);
    if (res.status !== 429) return res;          // success or non-retriable error
    lastError = res;
    const retryAfter = res.headers.get("Retry-After");
    const delay = retryAfter ? parseInt(retryAfter) * 1000 : (attempt + 1) * 1500;
    await new Promise(r => setTimeout(r, delay)); // wait before retry
  }
  return lastError!;
}

export async function POST(req: NextRequest) {
  try {
    const { type, device, difficulty, lang, history, playerKey, maxTokens } = await req.json();

    const apiKey = playerKey || process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Clé API Groq manquante. Ajoute GROQ_API_KEY dans .env.local" },
        { status: 401 }
      );
    }

    const res = await fetchWithRetry(GROQ_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.8,
        max_tokens: maxTokens ?? (type === "init" ? 1200 : type === "evaluate" ? 500 : 450),
        messages: [
          { role: "system", content: buildSystem(device, difficulty, lang) },
          ...history,
        ],
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      let errMsg = `Groq ${res.status}`;
      try {
        const j = JSON.parse(errText);
        errMsg = j?.error?.message ?? errMsg;
      } catch { /**/ }
      return NextResponse.json({ error: errMsg }, { status: res.status });
    }

    const data = await res.json();
    const content: string = data.choices?.[0]?.message?.content ?? "";
    if (!content) {
      return NextResponse.json({ error: "Réponse vide de Groq" }, { status: 502 });
    }
    return NextResponse.json({ content });
  } catch (e) {
    return NextResponse.json({ error: `Erreur réseau : ${String(e)}` }, { status: 500 });
  }
}
