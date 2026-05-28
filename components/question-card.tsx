"use client";

import { useState, useEffect } from "react";
import {
  Loader2, Lightbulb, MessageCircle, RefreshCw, CheckCircle2, XCircle, Flame, Shuffle
} from "lucide-react";
import type { GeneratedQuestion } from "@/app/api/generate-question/route";
import { saveResult, loadStreak, addToQuestionHistory, loadQuestionHistory } from "@/lib/progress";

type Chapter = { id: string; label: string; subject: string };

const CHAPTERS: Chapter[] = [
  { id: "Loi d'Ohm & associations de résistances", label: "Loi d'Ohm", subject: "Électronique" },
  { id: "Circuits RC/RL/RLC", label: "RC/RL/RLC", subject: "Électronique" },
  { id: "Amplificateur opérationnel (AOP)", label: "AOP", subject: "Électronique" },
  { id: "Filtres électroniques", label: "Filtres", subject: "Électronique" },
  { id: "Transistors BJT et MOSFET", label: "Transistors", subject: "Électronique" },
  { id: "Puissance et énergie électrique", label: "Puissance", subject: "Électronique" },
  // Maintenance
  { id: "Instruments de mesure (multimètre, oscilloscope)", label: "Instruments de mesure", subject: "Maintenance" },
  { id: "Diagnostic de pannes électroniques", label: "Diagnostic de pannes", subject: "Maintenance" },
  { id: "Soudure et montage THT/CMS", label: "Soudure & Montage", subject: "Maintenance" },
  { id: "Normes et sécurité électrique (habilitations, IP, CEM)", label: "Normes & Sécurité", subject: "Maintenance" },
  // Fabrication
  { id: "Fabrication de circuits imprimés PCB (gerber, couches, vias)", label: "Fabrication PCB", subject: "Fabrication" },
  { id: "Composants CMS/SMD et procédés d'assemblage (reflow, vague)", label: "Assemblage CMS", subject: "Fabrication" },
  { id: "Lecture de datasheet et documentation technique", label: "Lecture Datasheet", subject: "Fabrication" },
  { id: "Contrôle qualité et inspection en électronique (AOI, IPC-610)", label: "Contrôle qualité", subject: "Fabrication" },
  // Mathématiques
  { id: "Dérivées : règles de base", label: "Dérivées (base)", subject: "Mathématiques" },
  { id: "Dérivées : règles du produit, quotient, composée", label: "Dérivées (avancé)", subject: "Mathématiques" },
  { id: "Primitives et intégrales", label: "Intégrales", subject: "Mathématiques" },
  { id: "Suites numériques", label: "Suites", subject: "Mathématiques" },
  { id: "Trigonométrie", label: "Trigonométrie", subject: "Mathématiques" },
];

const DIFFICULTIES = [
  { id: "débutant", label: "Débutant" },
  { id: "intermédiaire", label: "Intermédiaire" },
  { id: "avancé", label: "Avancé" },
] as const;

type Difficulty = "débutant" | "intermédiaire" | "avancé";

interface QuestionCardProps {
  defaultChapter?: string;
  onAskTutor?: (question: string) => void;
}

export function QuestionCard({ defaultChapter, onAskTutor }: QuestionCardProps) {
  const [chapter, setChapter] = useState(defaultChapter ?? CHAPTERS[0].id);
  const [difficulty, setDifficulty] = useState<Difficulty>("débutant");
  const [question, setQuestion] = useState<GeneratedQuestion | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [showExplication, setShowExplication] = useState(false);
  const [streak, setStreak] = useState({ current: 0, best: 0 });
  const [hasApiKey, setHasApiKey] = useState(true);

  useEffect(() => {
    setStreak(loadStreak());
  }, []);

  async function generateQuestion(random = false) {
    setLoading(true);
    setError(null);
    setQuestion(null);
    setFeedback(null);
    setUserAnswer("");
    setSelectedChoice(null);
    setShowHint(false);
    setShowExplication(false);

    const targetChapter = random
      ? CHAPTERS[Math.floor(Math.random() * CHAPTERS.length)].id
      : chapter;

    const randomDiff = random
      ? DIFFICULTIES[Math.floor(Math.random() * DIFFICULTIES.length)].id
      : difficulty;

    if (random) setChapter(targetChapter);

    const history = loadQuestionHistory();

    try {
      const res = await fetch("/api/generate-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: CHAPTERS.find((c) => c.id === targetChapter)?.subject ?? "Électronique",
          chapter: targetChapter,
          difficulty: randomDiff,
          history,
        }),
      });

      const data = await res.json();
      if (data.error) {
        if (data.error.includes("API_KEY") || data.error.includes("API key")) {
          setHasApiKey(false);
          setError("Clé API Gemini non configurée.");
        } else {
          setError(data.error);
        }
        return;
      }

      setQuestion(data.question);
      addToQuestionHistory(data.question.enonce);
    } catch {
      setError("Erreur réseau. Vérifie ta connexion.");
    } finally {
      setLoading(false);
    }
  }

  function checkAnswer() {
    if (!question || feedback) return;

    let correct = false;

    if (question.type === "qcm") {
      correct = selectedChoice === question.reponse_index;
    } else if (question.type === "calcul") {
      if (question.expected_number !== undefined) {
        const num = parseFloat(userAnswer.trim().replace(",", ".").replace(/\s/g, ""));
        // Tolérance de 10% ou au moins 0.5 pour les petits nombres
        const tol = Math.max(0.5, Math.abs(question.expected_number) * 0.10);
        correct = Number.isFinite(num) && Math.abs(num - question.expected_number) <= tol;
      } else if (question.reponse_texte) {
        // Comparaison souple : ignore casse, espaces, et caractères spéciaux simples
        const normalize = (s: string) => s.toLowerCase().trim().replace(/\s+/g, " ");
        correct = normalize(userAnswer) === normalize(question.reponse_texte);
      }
    } else if (question.type === "vrai_faux") {
      correct = userAnswer.toLowerCase() === (question.reponse_texte ?? "").toLowerCase();
    } else {
      // trouver_erreur : comparaison souple (mots-clés)
      if (question.reponse_texte) {
        const normalize = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9àâéèêëîïôùûü\s]/g, "").replace(/\s+/g, " ");
        const userNorm = normalize(userAnswer);
        const expectedNorm = normalize(question.reponse_texte);
        // Correct si l'utilisateur contient les mots-clés principaux de la réponse
        const keywords = expectedNorm.split(" ").filter(w => w.length > 3);
        const matchCount = keywords.filter(k => userNorm.includes(k)).length;
        correct = userNorm === expectedNorm || (keywords.length > 0 && matchCount >= Math.ceil(keywords.length * 0.6));
      }
    }

    setFeedback(correct ? "correct" : "wrong");
    setShowExplication(true);

    const result = saveResult({
      id: Date.now().toString(),
      category: chapter,
      difficulty: difficulty as "easy" | "medium" | "hard",
      correct,
      userAnswer,
      expected: question.reponse_texte ?? String(question.expected_number ?? ""),
      timestamp: new Date().toISOString(),
    });
    setStreak(loadStreak());
  }

  const chaptersBySubject = CHAPTERS.reduce<Record<string, Chapter[]>>((acc, c) => {
    if (!acc[c.subject]) acc[c.subject] = [];
    acc[c.subject].push(c);
    return acc;
  }, {});

  const difficultyColors: Record<string, string> = {
    1: "text-emerald-400",
    2: "text-emerald-400",
    3: "text-amber-400",
    4: "text-orange-400",
    5: "text-red-400",
  };

  return (
    <div className="space-y-5">
      {/* Streak */}
      {streak.current >= 2 && (
        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-orange-900/30 border border-orange-700/40 w-fit">
          <Flame className="text-orange-400" size={18} />
          <span className="text-orange-300 font-bold text-sm">{streak.current} en série !</span>
          {streak.best >= 5 && <span className="text-orange-400/60 text-xs">· Meilleur : {streak.best}</span>}
        </div>
      )}

      {/* Config */}
      <div className="rounded-2xl border border-white/10 bg-[#0d0d1f] p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-white/50 text-xs mb-2 block uppercase tracking-wider">Chapitre</label>
            <select
              value={chapter}
              onChange={(e) => setChapter(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50"
            >
              {Object.entries(chaptersBySubject).map(([subject, chaps]) => (
                <optgroup key={subject} label={subject} className="bg-[#0d0d1f]">
                  {chaps.map((c) => (
                    <option key={c.id} value={c.id} className="bg-[#0d0d1f]">
                      {c.label}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
          <div>
            <label className="text-white/50 text-xs mb-2 block uppercase tracking-wider">Niveau</label>
            <div className="flex gap-2">
              {DIFFICULTIES.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setDifficulty(d.id)}
                  className={`flex-1 py-2 rounded-xl text-sm border transition-all ${
                    difficulty === d.id
                      ? "bg-violet-600 border-violet-500 text-white"
                      : "border-white/10 text-white/40 hover:text-white/60 hover:border-white/20"
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => generateQuestion(false)}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
            Générer une question
          </button>
          <button
            onClick={() => generateQuestion(true)}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl border border-white/10 hover:border-white/30 text-white/50 hover:text-white text-sm transition-all flex items-center gap-2"
            title="Défi aléatoire"
          >
            <Shuffle size={16} />
            Défi
          </button>
        </div>

        {!hasApiKey && (
          <div className="p-3 rounded-xl bg-amber-900/20 border border-amber-700/30 text-amber-300 text-xs">
            ⚠️ Clé Groq non configurée. Ajoute <code className="bg-black/30 px-1 rounded">GROQ_API_KEY</code> dans <code className="bg-black/30 px-1 rounded">.env.local</code> — gratuit sur console.groq.com.
          </div>
        )}
        {error && hasApiKey && (
          <p className="text-red-400 text-sm">{error}</p>
        )}
      </div>

      {/* Question display */}
      {question && (
        <div
          className={`rounded-2xl border p-5 space-y-4 transition-all duration-300 ${
            feedback === "correct"
              ? "border-emerald-500/50 bg-emerald-900/10"
              : feedback === "wrong"
              ? "border-red-500/50 bg-red-900/10"
              : "border-white/10 bg-[#0d0d1f]"
          }`}
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-medium ${difficultyColors[String(question.difficulte)] ?? "text-white/50"}`}>
                  {"★".repeat(question.difficulte ?? 1)}{"☆".repeat(5 - (question.difficulte ?? 1))}
                </span>
                <span className="text-white/30 text-xs px-2 py-0.5 rounded-full border border-white/10 capitalize">
                  {question.type.replace("_", " ")}
                </span>
              </div>
              {question.contexte_reel && (
                <p className="text-blue-400/70 text-xs italic">📍 {question.contexte_reel}</p>
              )}
            </div>
          </div>

          <p className="text-white text-[15px] leading-relaxed">{question.enonce}</p>

          {/* QCM */}
          {question.type === "qcm" && question.choix && (
            <div className="space-y-2">
              {question.choix.map((choice, i) => (
                <button
                  key={i}
                  onClick={() => !feedback && setSelectedChoice(i)}
                  disabled={!!feedback}
                  className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all ${
                    feedback
                      ? i === question.reponse_index
                        ? "border-emerald-500/60 bg-emerald-900/20 text-emerald-300"
                        : selectedChoice === i && i !== question.reponse_index
                        ? "border-red-500/40 bg-red-900/10 text-red-400"
                        : "border-white/10 text-white/40"
                      : selectedChoice === i
                      ? "border-violet-500 bg-violet-900/30 text-white"
                      : "border-white/10 hover:border-white/30 text-white/70 hover:text-white"
                  }`}
                >
                  <span className="text-white/30 mr-3">{String.fromCharCode(65 + i)}.</span>
                  {choice}
                </button>
              ))}
            </div>
          )}

          {/* Calcul / Vrai-Faux */}
          {(question.type === "calcul" || question.type === "trouver_erreur") && (
            <div className="flex gap-2">
              <input
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && checkAnswer()}
                disabled={!!feedback}
                placeholder={question.type === "calcul" ? `Valeur numérique${question.unit ? ` (${question.unit})` : ""}…` : "Ta réponse…"}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-violet-500/50 disabled:opacity-50"
              />
            </div>
          )}

          {question.type === "vrai_faux" && !feedback && (
            <div className="flex gap-3">
              {["vrai", "faux"].map((v) => (
                <button
                  key={v}
                  onClick={() => setUserAnswer(v)}
                  className={`flex-1 py-2.5 rounded-xl border text-sm font-medium transition-all capitalize ${
                    userAnswer === v
                      ? v === "vrai" ? "border-emerald-500 bg-emerald-900/30 text-emerald-300" : "border-red-500 bg-red-900/20 text-red-300"
                      : "border-white/10 text-white/50 hover:text-white hover:border-white/30"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          )}

          {/* Actions */}
          {!feedback && (
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={checkAnswer}
                disabled={question.type === "qcm" ? selectedChoice === null : !userAnswer.trim()}
                className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium disabled:opacity-40 transition-colors"
              >
                Valider
              </button>
              <button
                onClick={() => setShowHint(!showHint)}
                className="px-4 py-2 rounded-xl border border-white/10 hover:border-white/30 text-white/50 hover:text-white text-sm transition-colors flex items-center gap-2"
              >
                <Lightbulb size={14} />
                Indice
              </button>
              {onAskTutor && (
                <button
                  onClick={() => onAskTutor(`Aide-moi avec cette question : ${question.enonce}`)}
                  className="px-4 py-2 rounded-xl border border-violet-700/40 hover:border-violet-500/60 text-violet-400/70 hover:text-violet-400 text-sm transition-colors flex items-center gap-2"
                >
                  <MessageCircle size={14} />
                  Demander au Professeur IA
                </button>
              )}
            </div>
          )}

          {showHint && (
            <div className="p-3 rounded-xl bg-amber-900/20 border border-amber-700/30 text-amber-300 text-sm flex gap-2">
              <Lightbulb size={16} className="shrink-0 mt-0.5" />
              {question.indice}
            </div>
          )}

          {/* Feedback */}
          {feedback && (
            <div className="space-y-2">
              <div className={`flex items-center gap-2 text-sm font-medium ${feedback === "correct" ? "text-emerald-400" : "text-red-400"}`}>
                {feedback === "correct" ? (
                  <><CheckCircle2 size={18} /> Excellent ! {streak.current >= 3 && `🔥 ${streak.current} d'affilée !`}</>
                ) : (
                  <><XCircle size={18} /> Pas tout à fait…</>
                )}
              </div>
              {feedback === "wrong" && (
                <div className="px-3 py-2 rounded-lg bg-emerald-900/20 border border-emerald-700/30 text-emerald-300 text-sm">
                  ✅ Bonne réponse :{" "}
                  <span className="font-semibold">
                    {question.type === "qcm" && question.choix && question.reponse_index !== undefined
                      ? question.choix[question.reponse_index]
                      : question.type === "calcul" && question.expected_number !== undefined
                      ? `${question.expected_number}${question.unit ? ` ${question.unit}` : ""}`
                      : question.reponse_texte ?? "—"}
                  </span>
                </div>
              )}
            </div>
          )}

          {showExplication && (
            <div className="p-4 rounded-xl bg-white/3 border border-white/10 space-y-1">
              <p className="text-white/50 text-xs uppercase tracking-wider mb-2">Explication</p>
              <p className="text-white/80 text-sm leading-relaxed">{question.explication_detaillee}</p>
              {onAskTutor && feedback === "wrong" && (
                <button
                  onClick={() => onAskTutor(`J'ai raté cette question : "${question.enonce}". La bonne réponse était "${question.reponse_texte ?? question.expected_number}". Peux-tu m'expliquer pourquoi ?`)}
                  className="mt-3 text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-colors"
                >
                  <MessageCircle size={12} />
                  Demander une explication détaillée au Professeur IA
                </button>
              )}
            </div>
          )}

          {feedback && (
            <button
              onClick={() => generateQuestion(false)}
              className="w-full py-2 rounded-xl border border-white/10 hover:border-violet-500/50 text-white/60 hover:text-violet-400 text-sm transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw size={14} />
              Question suivante
            </button>
          )}
        </div>
      )}
    </div>
  );
}
