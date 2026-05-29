"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft, Send, ChevronRight, RotateCcw,
  Star, AlertCircle, CheckCircle2, XCircle,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────
type View = "home" | "device" | "roulette" | "game" | "results";
type Lang = "FR" | "EN";
type Difficulty = "easy" | "medium" | "hard" | "expert";
type GroqMsg = { role: "user" | "assistant"; content: string };
type ChatMsg  = { role: "customer" | "player"; content: string; ts: number };

interface HiddenData {
  real_fault: string;
  defective_component: string;
  repair_method: string;
  true_clues: string[];
  false_clues: string[];
}
interface Evaluation {
  fault_correct: boolean; component_correct: boolean; repair_correct: boolean;
  fault_score: number; component_score: number; repair_score: number;
  feedback: string;
}

// ── Constants ─────────────────────────────────────────────────────────────────
const DEVICES = [
  { id: "television",      emoji: "📺", fr: "Télévision",       en: "Television"      },
  { id: "washing-machine", emoji: "🫧", fr: "Machine à laver",  en: "Washing Machine" },
  { id: "microwave",       emoji: "📡", fr: "Micro-ondes",       en: "Microwave"       },
  { id: "electric-oven",   emoji: "🔥", fr: "Four électrique",   en: "Electric Oven"   },
  { id: "refrigerator",    emoji: "🧊", fr: "Réfrigérateur",     en: "Refrigerator"    },
  { id: "iron",            emoji: "👔", fr: "Fer à repasser",    en: "Iron"            },
  { id: "vacuum-cleaner",  emoji: "🌀", fr: "Aspirateur",        en: "Vacuum Cleaner"  },
  { id: "air-conditioner", emoji: "❄️", fr: "Climatiseur",       en: "Air Conditioner" },
] as const;

type Device = typeof DEVICES[number];

const DIFF_CONFIG = {
  easy:   { color: "#22c55e", bg: "bg-emerald-900/30", border: "border-emerald-600/50", label: "EASY",   labelFR: "FACILE", mult: 1.0, max: 100 },
  medium: { color: "#eab308", bg: "bg-yellow-900/30",  border: "border-yellow-600/50",  label: "MEDIUM", labelFR: "MOYEN",  mult: 1.5, max: 150 },
  hard:   { color: "#ef4444", bg: "bg-red-900/30",     border: "border-red-600/50",     label: "HARD",   labelFR: "DIFFICILE", mult: 2.0, max: 200 },
  expert: { color: "#a855f7", bg: "bg-purple-900/30",  border: "border-purple-600/50",  label: "EXPERT", labelFR: "EXPERT", mult: 3.0, max: 300 },
};

// ── i18n ──────────────────────────────────────────────────────────────────────
const T = {
  FR: {
    home_title: "ElectroDebug", home_sub: "Le jeu de diagnostic électronique",
    home_play: "Jouer", home_key_label: "Clé API Groq (optionnel si déjà configurée)",
    home_key_ph: "gsk_...",
    dev_title: "Choisir un appareil", dev_sub: "Sélectionne l'appareil à diagnostiquer",
    rou_title: "Roulette de difficulté", rou_sub: "Tente ta chance !",
    rou_spin: "Lancer la roulette", rou_spinning: "En cours…", rou_result: "Niveau obtenu !",
    rou_start: "Commencer la partie", rou_mult: "Multiplicateur", rou_max: "Score max",
    game_questions: "Questions", game_score: "Score",
    game_send: "Envoyer", game_typing: "Le client répond…", game_placeholder: "Posez une question…",
    game_notes: "📝 Mes notes", game_notes_ph: "Prends des notes ici…",
    game_history: "📋 Indices relevés",
    game_diag: "🔍 Diagnostic Final",
    game_fault: "Panne identifiée", game_fault_ph: "Ex: Court-circuit sur alim…",
    game_comp: "Composant défaillant", game_comp_ph: "Ex: Condensateur C12 25V…",
    game_repair: "Méthode de réparation", game_repair_ph: "Ex: Remplacer le condensateur…",
    game_submit: "Soumettre le diagnostic",
    res_title: "Résultats", res_score: "Score final",
    res_stars: "étoiles", res_fault: "Panne réelle", res_comp: "Vrai composant",
    res_repair: "Vraie réparation", res_feedback: "Feedback",
    res_true_clues: "Vrais indices donnés", res_false_clues: "Fausses pistes",
    res_again: "Rejouer", res_change: "Changer d'appareil",
    res_your: "Ta réponse", res_correct: "Correct ✓", res_wrong: "Incorrect ✗",
    res_pts: "pts",
  },
  EN: {
    home_title: "ElectroDebug", home_sub: "The electronic diagnostic game",
    home_play: "Play", home_key_label: "Groq API Key (optional if already configured)",
    home_key_ph: "gsk_...",
    dev_title: "Choose a device", dev_sub: "Select the device to diagnose",
    rou_title: "Difficulty Roulette", rou_sub: "Try your luck!",
    rou_spin: "Spin the wheel", rou_spinning: "Spinning…", rou_result: "Level obtained!",
    rou_start: "Start game", rou_mult: "Multiplier", rou_max: "Max score",
    game_questions: "Questions", game_score: "Score",
    game_send: "Send", game_typing: "Customer is typing…", game_placeholder: "Ask a question…",
    game_notes: "📝 My notes", game_notes_ph: "Take notes here…",
    game_history: "📋 Key clues",
    game_diag: "🔍 Final Diagnosis",
    game_fault: "Identified fault", game_fault_ph: "e.g. Short circuit on power supply…",
    game_comp: "Defective component", game_comp_ph: "e.g. Capacitor C12 25V…",
    game_repair: "Repair method", game_repair_ph: "e.g. Replace capacitor…",
    game_submit: "Submit diagnosis",
    res_title: "Results", res_score: "Final score",
    res_stars: "stars", res_fault: "Real fault", res_comp: "Real component",
    res_repair: "Real repair", res_feedback: "Feedback",
    res_true_clues: "True clues given", res_false_clues: "False leads",
    res_again: "Play again", res_change: "Change device",
    res_your: "Your answer", res_correct: "Correct ✓", res_wrong: "Incorrect ✗",
    res_pts: "pts",
  },
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function parseHidden(text: string): HiddenData | null {
  const m = text.match(/---HIDDEN_DATA---\s*([\s\S]*?)\s*---END_HIDDEN---/);
  if (!m) return null;
  try { return JSON.parse(m[1]); } catch { return null; }
}
function parseStory(text: string): string {
  const m = text.match(/---CUSTOMER_STORY---\s*([\s\S]*?)\s*---END_STORY---/);
  return m ? m[1].trim() : text.replace(/---HIDDEN_DATA---[\s\S]*?---END_HIDDEN---/g, "").trim();
}
function parseEvaluation(text: string): Evaluation | null {
  const m = text.match(/---EVALUATION---\s*([\s\S]*?)\s*---END_EVALUATION---/);
  if (!m) return null;
  try { return JSON.parse(m[1]); } catch { return null; }
}
function starsFromScore(score: number, max: number) {
  const pct = score / max;
  if (pct >= 0.9) return 5;
  if (pct >= 0.75) return 4;
  if (pct >= 0.6) return 3;
  if (pct >= 0.4) return 2;
  return 1;
}

// ── DiffBadge ─────────────────────────────────────────────────────────────────
function DiffBadge({ d, lang, small }: { d: Difficulty; lang: Lang; small?: boolean }) {
  const cfg = DIFF_CONFIG[d];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border font-bold uppercase tracking-wider px-2.5 py-0.5 ${cfg.bg} ${cfg.border} ${small ? "text-[10px]" : "text-xs"}`}
      style={{ color: cfg.color }}>
      {lang === "FR" ? cfg.labelFR : cfg.label}
    </span>
  );
}

// ── StarRating ────────────────────────────────────────────────────────────────
function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-1">
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={28} className={i <= n ? "text-amber-400 fill-amber-400" : "text-white/15"} />
      ))}
    </div>
  );
}

// ── VIEW 1: Home ──────────────────────────────────────────────────────────────
function HomeView({ lang, setLang, onPlay }: {
  lang: Lang; setLang: (l: Lang) => void; onPlay: () => void;
}) {
  const t = T[lang];
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="text-center space-y-3">
          <div className="text-8xl mb-2 drop-shadow-[0_0_40px_rgba(249,115,22,0.4)]">🔌</div>
          <h1 className="text-5xl font-black bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
            {t.home_title}
          </h1>
          <p className="text-white/40 text-base">{t.home_sub}</p>
        </div>

        {/* Features preview */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          {[
            { emoji: "📺", text: lang === "FR" ? "8 appareils" : "8 devices" },
            { emoji: "🎰", text: lang === "FR" ? "Roulette difficulté" : "Difficulty roulette" },
            { emoji: "🤖", text: lang === "FR" ? "Client IA Groq" : "Groq AI client" },
            { emoji: "⭐", text: lang === "FR" ? "Score & étoiles" : "Score & stars" },
          ].map(({ emoji, text }) => (
            <div key={text} className="flex items-center gap-2 rounded-xl border border-white/8 bg-white/4 px-3 py-2">
              <span>{emoji}</span>
              <span className="text-white/50">{text}</span>
            </div>
          ))}
        </div>

        {/* Language toggle */}
        <div className="flex justify-center gap-2">
          {(["FR", "EN"] as Lang[]).map(l => (
            <button key={l} onClick={() => setLang(l)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border font-semibold text-sm transition-all ${
                lang === l
                  ? "border-violet-500/60 bg-violet-900/30 text-white"
                  : "border-white/10 text-white/40 hover:text-white hover:border-white/25"
              }`}
            >
              <span>{l === "FR" ? "🇫🇷" : "🇬🇧"}</span>
              {l === "FR" ? "Français" : "English"}
            </button>
          ))}
        </div>

        {/* Play button */}
        <button onClick={onPlay}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white text-lg font-black shadow-lg shadow-orange-900/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          {t.home_play} →
        </button>
      </div>
    </div>
  );
}

// ── VIEW 2: Device selection ──────────────────────────────────────────────────
function DeviceView({ lang, onSelect }: { lang: Lang; onSelect: (d: Device) => void }) {
  const t = T[lang];
  const [hover, setHover] = useState<string | null>(null);
  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
      <div>
        <h2 className="text-2xl font-black text-white">{t.dev_title}</h2>
        <p className="text-white/40 text-sm mt-1">{t.dev_sub}</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {DEVICES.map(d => (
          <button key={d.id} onClick={() => onSelect(d)}
            onMouseEnter={() => setHover(d.id)}
            onMouseLeave={() => setHover(null)}
            className={`flex flex-col items-center gap-3 p-5 rounded-2xl border transition-all ${
              hover === d.id
                ? "border-amber-500/50 bg-amber-900/20 scale-105 shadow-lg shadow-amber-900/30"
                : "border-white/8 bg-white/4 hover:border-white/20"
            }`}
          >
            <span className="text-5xl">{d.emoji}</span>
            <span className="text-sm font-semibold text-white text-center leading-tight">
              {lang === "FR" ? d.fr : d.en}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── VIEW 3: Roulette ──────────────────────────────────────────────────────────
const CARD_W = 88;
const ROULETTE_COUNT = 60;
const LAND_IDX = 50;

function pickWinner(): Difficulty {
  const r = Math.random();
  if (r < 0.4) return "easy";
  if (r < 0.7) return "medium";
  if (r < 0.9) return "hard";
  return "expert";
}
function makeStrip(winner: Difficulty): Difficulty[] {
  const arr: Difficulty[] = Array.from({ length: ROULETTE_COUNT }, () => {
    const r = Math.random();
    return r < 0.4 ? "easy" : r < 0.7 ? "medium" : r < 0.9 ? "hard" : "expert";
  });
  arr[LAND_IDX] = winner;
  return arr;
}

function RouletteView({ lang, device, onResult }: { lang: Lang; device: Device; onResult: (d: Difficulty) => void }) {
  const t = T[lang];
  const [winner]  = useState<Difficulty>(pickWinner);
  const [strip]   = useState<Difficulty[]>(() => makeStrip(winner));
  const [spinning, setSpinning] = useState(false);
  const [done, setDone] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);

  function spin() {
    if (spinning || done) return;
    const cw = containerRef.current?.offsetWidth ?? 600;
    const finalX = cw / 2 - (LAND_IDX * CARD_W + CARD_W / 2);
    if (stripRef.current) {
      stripRef.current.style.transition = "transform 6s cubic-bezier(0.04, 0.82, 0.17, 1)";
      stripRef.current.style.transform = `translateX(${finalX}px)`;
    }
    setSpinning(true);
    setTimeout(() => { setSpinning(false); setDone(true); }, 6300);
  }

  const cfg = DIFF_CONFIG[winner];
  const devLabel = lang === "FR" ? device.fr : device.en;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="text-4xl mb-2">{device.emoji}</div>
        <p className="text-white/40 text-sm font-medium">{devLabel}</p>
        <h2 className="text-2xl font-black text-white mt-1">{t.rou_title}</h2>
        <p className="text-white/35 text-sm">{t.rou_sub}</p>
      </div>

      {/* Roulette wheel */}
      <div className="relative">
        {/* Center cursor */}
        <div className="absolute top-0 bottom-0 left-1/2 z-20 flex flex-col items-center pointer-events-none" style={{ transform: "translateX(-50%)" }}>
          <div className="w-0 h-0 border-l-[8px] border-r-[8px] border-t-[12px] border-l-transparent border-r-transparent border-t-white" />
          <div className="w-0.5 flex-1 bg-white/90 shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
          <div className="w-0 h-0 border-l-[8px] border-r-[8px] border-b-[12px] border-l-transparent border-r-transparent border-b-white" />
        </div>
        {/* Left/right fade */}
        <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none rounded-l-2xl"
          style={{ background: "linear-gradient(to right, #070d1f, transparent)" }} />
        <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none rounded-r-2xl"
          style={{ background: "linear-gradient(to left, #070d1f, transparent)" }} />
        {/* Track */}
        <div ref={containerRef}
          className="overflow-hidden rounded-2xl border border-white/8 bg-[#0d0d1f]"
          style={{ height: 96 }}
        >
          <div ref={stripRef} className="flex h-full items-center"
            style={{ willChange: "transform" }}
          >
            {strip.map((d, i) => {
              const c = DIFF_CONFIG[d];
              return (
                <div key={i} style={{ width: CARD_W, flexShrink: 0 }} className="px-1.5 h-full flex items-center">
                  <div className={`w-full h-16 rounded-xl border flex flex-col items-center justify-center ${c.bg} ${c.border}`}>
                    <span className="text-[10px] font-black tracking-widest" style={{ color: c.color }}>
                      {lang === "FR" ? c.labelFR : c.label}
                    </span>
                    <span className="text-[9px] text-white/30 mt-0.5">×{c.mult}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Spin button */}
      {!done && (
        <button onClick={spin} disabled={spinning}
          className={`w-full py-4 rounded-2xl text-white font-black text-lg transition-all ${
            spinning
              ? "bg-white/10 cursor-not-allowed"
              : "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-violet-900/40"
          }`}
        >
          {spinning ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
              {t.rou_spinning}
            </span>
          ) : t.rou_spin}
        </button>
      )}

      {/* Result */}
      {done && (
        <div className={`rounded-2xl border p-6 text-center space-y-4 ${cfg.bg} ${cfg.border}`}
          style={{ animation: "fadeUp .4s ease" }}
        >
          <p className="text-sm text-white/50">{t.rou_result}</p>
          <DiffBadge d={winner} lang={lang} />
          <div className="flex justify-center gap-6 text-sm">
            <div className="text-center">
              <p className="text-white/30 text-xs">{t.rou_mult}</p>
              <p className="font-black text-xl" style={{ color: cfg.color }}>×{cfg.mult}</p>
            </div>
            <div className="w-px bg-white/10" />
            <div className="text-center">
              <p className="text-white/30 text-xs">{t.rou_max}</p>
              <p className="font-black text-xl" style={{ color: cfg.color }}>{cfg.max} pts</p>
            </div>
          </div>
          <button onClick={() => onResult(winner)}
            className="w-full py-3.5 rounded-xl text-white font-bold transition-all hover:brightness-110"
            style={{ background: `linear-gradient(135deg, ${cfg.color}99, ${cfg.color}55)`, border: `1px solid ${cfg.color}44` }}
          >
            {t.rou_start} →
          </button>
        </div>
      )}
    </div>
  );
}

// ── VIEW 4: Game ──────────────────────────────────────────────────────────────
function GameView({
  lang, device, difficulty, apiKey,
  onResults,
}: {
  lang: Lang; device: Device; difficulty: Difficulty; apiKey: string;
  onResults: (ev: Evaluation, hid: HiddenData, diag: { fault: string; component: string; repair: string }) => void;
}) {
  const t = T[lang];
  const cfg = DIFF_CONFIG[difficulty];

  const [groqHist, setGroqHist] = useState<GroqMsg[]>([]);
  const [chat, setChat] = useState<ChatMsg[]>([]);
  const [hiddenData, setHiddenData] = useState<HiddenData | null>(null);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");
  const [notes, setNotes] = useState("");
  const [clues, setClues] = useState<string[]>([]);
  const [qCount, setQCount] = useState(0);
  const [score, setScore] = useState(0);
  const [diag, setDiag] = useState({ fault: "", component: "", repair: "" });
  const [mobileTab, setMobileTab] = useState<"chat" | "tools">("chat");

  const chatEndRef = useRef<HTMLDivElement>(null);

  async function callApi(history: GroqMsg[], type: string) {
    const res = await fetch("/api/diagnostic", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type, history,
        device: lang === "FR" ? device.fr : device.en,
        difficulty,
        lang,
        playerKey: apiKey || undefined,
      }),
    });
    const data = await res.json();
    if (!res.ok || data.error) throw new Error(data.error ?? "API error");
    return data.content as string;
  }

  // Init game
  useEffect(() => {
    const startMsg: GroqMsg = { role: "user", content: "START_GAME" };
    callApi([startMsg], "init")
      .then(content => {
        const hid = parseHidden(content);
        const story = parseStory(content);
        setHiddenData(hid);
        setGroqHist([startMsg, { role: "assistant", content }]);
        setChat([{ role: "customer", content: story, ts: Date.now() }]);
        setLoading(false);
      })
      .catch(() => {
        setChat([{ role: "customer", content: "⚠️ Impossible de démarrer la partie. Vérifie ta clé API.", ts: Date.now() }]);
        setLoading(false);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, loading]);

  async function sendMessage() {
    const msg = input.trim();
    if (!msg || loading) return;
    setInput("");

    const playerMsg: GroqMsg = { role: "user", content: msg };
    const newHist = [...groqHist, playerMsg];

    setChat(c => [...c, { role: "player", content: msg, ts: Date.now() }]);
    setQCount(n => n + 1);
    setLoading(true);

    // Extract key info as note
    if (msg.length > 15) setClues(c => [...c.slice(-7), `Q${qCount + 1}: ${msg.slice(0, 60)}${msg.length > 60 ? "…" : ""}`]);

    try {
      const content = await callApi(newHist, "chat");
      const finalHist: GroqMsg[] = [...newHist, { role: "assistant", content }];
      setGroqHist(finalHist);
      setChat(c => [...c, { role: "customer", content, ts: Date.now() }]);
      // Simple scoring: +5 per relevant question
      setScore(s => s + 5);
    } catch {
      setChat(c => [...c, { role: "customer", content: "⚠️ Erreur réseau. Réessaie.", ts: Date.now() }]);
    }
    setLoading(false);
  }

  async function submitDiagnosis() {
    if (!diag.fault.trim() && !diag.component.trim()) return;
    setLoading(true);
    const diagMsg: GroqMsg = {
      role: "user",
      content: `---DIAGNOSIS---\nFault: ${diag.fault}\nComponent: ${diag.component}\nRepair: ${diag.repair}`,
    };
    const newHist = [...groqHist, diagMsg];
    try {
      const content = await callApi(newHist, "evaluate");
      const ev = parseEvaluation(content);
      if (ev) {
        const base = (ev.fault_score ?? 0) + (ev.component_score ?? 0) + (ev.repair_score ?? 0) + score;
        const finalScore = Math.round(base * cfg.mult);
        onResults({ ...ev }, hiddenData!, diag);
        // Pass score separately via the evaluation
        (ev as Evaluation & { total: number }).total = finalScore;
        onResults(ev, hiddenData!, diag);
      } else {
        setChat(c => [...c, { role: "customer", content: "⚠️ Impossible d'évaluer. Réessaie.", ts: Date.now() }]);
      }
    } catch {
      setChat(c => [...c, { role: "customer", content: "⚠️ Erreur lors de l'évaluation.", ts: Date.now() }]);
    }
    setLoading(false);
  }

  const devLabel = lang === "FR" ? device.fr : device.en;

  // ── Inner panels ──
  const InfoPanel = () => (
    <div className="space-y-4">
      <div className="rounded-2xl border border-white/8 bg-[#0d0d1f] p-5 text-center space-y-3">
        <div className="text-6xl">{device.emoji}</div>
        <p className="font-bold text-white text-sm">{devLabel}</p>
        <DiffBadge d={difficulty} lang={lang} />
        <div className="grid grid-cols-2 gap-2 text-xs mt-2">
          <div className="rounded-xl bg-white/5 p-2.5">
            <p className="text-white/30">{t.game_questions}</p>
            <p className="font-black text-white text-lg">{qCount}<span className="text-white/25">/15</span></p>
          </div>
          <div className="rounded-xl bg-white/5 p-2.5">
            <p className="text-white/30">{t.game_score}</p>
            <p className="font-black text-amber-400 text-lg">{score}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const ToolPanel = () => (
    <div className="space-y-3 h-full flex flex-col">
      {/* Notes */}
      <div className="rounded-2xl border border-white/8 bg-[#0d0d1f] p-3 space-y-2">
        <p className="text-xs font-semibold text-white/50">{t.game_notes}</p>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder={t.game_notes_ph}
          rows={4}
          className="w-full bg-white/3 border border-white/8 rounded-xl px-3 py-2 text-xs text-white/70 placeholder-white/20 resize-none focus:outline-none focus:ring-2 focus:ring-violet-500/30"
        />
      </div>

      {/* Auto clues */}
      {clues.length > 0 && (
        <div className="rounded-2xl border border-white/8 bg-[#0d0d1f] p-3 space-y-1.5">
          <p className="text-xs font-semibold text-white/50">{t.game_history}</p>
          {clues.map((c, i) => (
            <p key={i} className="text-[11px] text-white/35 leading-snug">{c}</p>
          ))}
        </div>
      )}

      {/* Diagnosis form */}
      <div className="rounded-2xl border border-amber-700/30 bg-amber-900/10 p-3 space-y-3 flex-1">
        <p className="text-xs font-bold text-amber-300">{t.game_diag}</p>
        {([
          { key: "fault" as const,     label: t.game_fault, ph: t.game_fault_ph },
          { key: "component" as const, label: t.game_comp,  ph: t.game_comp_ph  },
          { key: "repair" as const,    label: t.game_repair,ph: t.game_repair_ph },
        ]).map(({ key, label, ph }) => (
          <div key={key} className="space-y-1">
            <label className="text-[11px] text-white/40">{label}</label>
            <input
              value={diag[key]}
              onChange={e => setDiag(d => ({ ...d, [key]: e.target.value }))}
              placeholder={ph}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
            />
          </div>
        ))}
        <button
          onClick={submitDiagnosis}
          disabled={loading || (!diag.fault && !diag.component)}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:opacity-30 disabled:cursor-not-allowed text-white text-xs font-bold transition-all"
        >
          {t.game_submit} →
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-7xl mx-auto px-3 py-4 gap-4">

      {/* Mobile tabs */}
      <div className="flex sm:hidden gap-1 bg-white/5 border border-white/10 rounded-xl p-1">
        {(["chat", "tools"] as const).map(tab => (
          <button key={tab} onClick={() => setMobileTab(tab)}
            className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${mobileTab === tab ? "bg-violet-600 text-white" : "text-white/40"}`}
          >
            {tab === "chat" ? "💬 Chat" : "🔧 Outils"}
          </button>
        ))}
      </div>

      {/* Desktop: 3 columns */}
      <div className="flex flex-1 gap-4 overflow-hidden">

        {/* LEFT — Info (desktop only) */}
        <div className="hidden lg:block w-52 shrink-0 overflow-y-auto">
          <InfoPanel />
        </div>

        {/* CENTER — Chat */}
        <div className={`flex flex-col flex-1 min-w-0 rounded-2xl border border-white/8 bg-[#0d0d1f] overflow-hidden ${mobileTab === "tools" ? "hidden sm:flex" : "flex"}`}>
          {/* Chat header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-white/8 shrink-0">
            <span className="text-2xl">{device.emoji}</span>
            <div>
              <p className="text-sm font-bold text-white">{devLabel}</p>
              <div className="flex items-center gap-2">
                <DiffBadge d={difficulty} lang={lang} small />
                <span className="text-[10px] text-white/30">{qCount}/15 questions</span>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {chat.map((msg, i) => (
              <div key={i} className={`flex gap-2.5 ${msg.role === "player" ? "flex-row-reverse" : ""}`}>
                {msg.role === "customer" && (
                  <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center bg-white/10 text-lg">
                    👤
                  </div>
                )}
                <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  msg.role === "customer"
                    ? "bg-white/6 border border-white/8 text-white/80 rounded-tl-sm"
                    : "bg-gradient-to-br from-violet-600/80 to-indigo-700/80 border border-violet-500/30 text-white rounded-tr-sm"
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-2.5">
                <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center bg-white/10 text-lg">👤</div>
                <div className="bg-white/6 border border-white/8 rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-white/40 flex items-center gap-2">
                  <span>{t.game_typing}</span>
                  <span className="flex gap-1">
                    {[0,1,2].map(i => (
                      <span key={i} className="w-1.5 h-1.5 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: `${i*0.15}s` }} />
                    ))}
                  </span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className="px-3 pb-3 pt-2 border-t border-white/8 shrink-0">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
                disabled={loading}
                placeholder={t.game_placeholder}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-violet-500/40 disabled:opacity-50"
              />
              <button onClick={sendMessage} disabled={loading || !input.trim()}
                className="w-10 h-10 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all shrink-0"
              >
                <Send size={15} className="text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT — Tools */}
        <div className={`w-72 shrink-0 overflow-y-auto ${mobileTab === "chat" ? "hidden sm:block" : "block"}`}>
          <div className="hidden lg:block mb-3">
            <InfoPanel />
          </div>
          <ToolPanel />
        </div>
      </div>
    </div>
  );
}

// ── VIEW 5: Results ───────────────────────────────────────────────────────────
function ResultsView({
  lang, device, difficulty, evaluation, hiddenData, diagnosis,
  onReplay, onChangeDevice,
}: {
  lang: Lang; device: Device; difficulty: Difficulty;
  evaluation: Evaluation; hiddenData: HiddenData;
  diagnosis: { fault: string; component: string; repair: string };
  onReplay: () => void; onChangeDevice: () => void;
}) {
  const t = T[lang];
  const cfg = DIFF_CONFIG[difficulty];

  const base = (evaluation.fault_score ?? 0) + (evaluation.component_score ?? 0) + (evaluation.repair_score ?? 0);
  const finalScore = Math.round(base * cfg.mult);
  const stars = starsFromScore(finalScore, cfg.max);

  const [displayScore, setDisplayScore] = useState(0);
  useEffect(() => {
    let cur = 0;
    const step = Math.ceil(finalScore / 60);
    const id = setInterval(() => {
      cur = Math.min(cur + step, finalScore);
      setDisplayScore(cur);
      if (cur >= finalScore) clearInterval(id);
    }, 20);
    return () => clearInterval(id);
  }, [finalScore]);

  const CmpRow = ({ label, correct, yours, truth }: { label: string; correct: boolean; yours: string; truth: string }) => (
    <div className={`rounded-xl border p-3 space-y-1 ${correct ? "border-emerald-600/30 bg-emerald-900/10" : "border-red-600/30 bg-red-900/10"}`}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-white/60">{label}</span>
        {correct
          ? <span className="text-xs text-emerald-400 font-bold flex items-center gap-1"><CheckCircle2 size={12}/>{t.res_correct}</span>
          : <span className="text-xs text-red-400 font-bold flex items-center gap-1"><XCircle size={12}/>{t.res_wrong}</span>
        }
      </div>
      <p className="text-xs text-white/40">{t.res_your} : <span className="text-white/65 italic">&ldquo;{yours || "—"}&rdquo;</span></p>
      {!correct && <p className="text-xs text-emerald-400">✓ {truth}</p>}
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-6" style={{ animation: "fadeUp .5s ease" }}>
      {/* Score */}
      <div className="rounded-3xl border border-white/8 bg-[#0d0d1f] p-8 text-center space-y-4">
        <p className="text-white/30 text-sm">{t.res_score}</p>
        <div className="text-7xl font-black tabular-nums" style={{ color: cfg.color }}>{displayScore}</div>
        <p className="text-white/30 text-sm">{lang === "FR" ? cfg.labelFR : cfg.label} — ×{cfg.mult} — max {cfg.max} {t.res_pts}</p>
        <Stars n={stars} />
        <p className="text-white/40 text-sm">{stars} / 5 {t.res_stars}</p>
      </div>

      {/* Diagnosis comparison */}
      <div className="space-y-2">
        <CmpRow label={t.res_fault}  correct={evaluation.fault_correct}     yours={diagnosis.fault}     truth={hiddenData?.real_fault ?? "?"} />
        <CmpRow label={t.res_comp}   correct={evaluation.component_correct} yours={diagnosis.component} truth={hiddenData?.defective_component ?? "?"} />
        <CmpRow label={t.res_repair} correct={evaluation.repair_correct}    yours={diagnosis.repair}    truth={hiddenData?.repair_method ?? "?"} />
      </div>

      {/* Feedback */}
      {evaluation.feedback && (
        <div className="rounded-2xl border border-violet-700/30 bg-violet-900/15 p-4">
          <p className="text-xs font-semibold text-violet-300 mb-1">{t.res_feedback}</p>
          <p className="text-sm text-white/60 leading-relaxed">{evaluation.feedback}</p>
        </div>
      )}

      {/* Clues reveal */}
      {hiddenData && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-2xl border border-emerald-700/25 bg-emerald-900/10 p-4 space-y-2">
            <p className="text-xs font-semibold text-emerald-400">✅ {t.res_true_clues}</p>
            {hiddenData.true_clues.map((c, i) => <p key={i} className="text-xs text-white/50 flex gap-1.5"><span className="text-emerald-500 shrink-0">·</span>{c}</p>)}
          </div>
          <div className="rounded-2xl border border-red-700/25 bg-red-900/10 p-4 space-y-2">
            <p className="text-xs font-semibold text-red-400">❌ {t.res_false_clues}</p>
            {hiddenData.false_clues.map((c, i) => <p key={i} className="text-xs text-white/50 flex gap-1.5"><span className="text-red-500 shrink-0">·</span>{c}</p>)}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <button onClick={onReplay}
          className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:brightness-110 text-white font-bold text-sm transition-all flex items-center justify-center gap-2"
        >
          <RotateCcw size={15} /> {t.res_again}
        </button>
        <button onClick={onChangeDevice}
          className="flex-1 py-3 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white font-semibold text-sm transition-all"
        >
          {t.res_change}
        </button>
      </div>
    </div>
  );
}

// ── Main orchestrator ─────────────────────────────────────────────────────────
export default function DiagnosticGame() {
  const [view,       setView]       = useState<View>("home");
  const [lang,       setLang]       = useState<Lang>("FR");
  const [apiKey] = useState("");
  const [device,     setDevice]     = useState<Device | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [hiddenData, setHiddenData] = useState<HiddenData | null>(null);
  const [diagnosis,  setDiagnosis]  = useState({ fault: "", component: "", repair: "" });


  function handleResults(ev: Evaluation, hid: HiddenData, diag: { fault: string; component: string; repair: string }) {
    setEvaluation(ev); setHiddenData(hid); setDiagnosis(diag);
    setView("results");
  }

  return (
    <div className="min-h-screen">
      {/* Sticky nav */}
      <div className="sticky top-0 z-30 border-b border-white/8 bg-[#070d1f]/95 backdrop-blur-md">
        <div className="flex items-center gap-3 px-4 py-2.5 max-w-7xl mx-auto">
          <Link href="/jeux" className="text-white/30 hover:text-white/70 transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <span className="text-lg">🔌</span>
          <span className="font-black text-white">ElectroDebug</span>
          {device && (
            <span className="flex items-center gap-1 text-xs text-white/30">
              <ChevronRight size={12} />
              {device.emoji} {lang === "FR" ? device.fr : device.en}
            </span>
          )}
          {difficulty && (
            <span className="flex items-center gap-1">
              <ChevronRight size={12} className="text-white/20" />
              <DiffBadge d={difficulty} lang={lang} small />
            </span>
          )}
          <div className="ml-auto flex gap-1.5">
            {(["FR", "EN"] as Lang[]).map(l => (
              <button key={l} onClick={() => setLang(l)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${lang === l ? "bg-violet-600 text-white" : "text-white/30 hover:text-white"}`}
              >
                {l === "FR" ? "🇫🇷" : "🇬🇧"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Views */}
      {view === "home" && (
        <HomeView lang={lang} setLang={setLang} onPlay={() => setView("device")} />
      )}
      {view === "device" && (
        <DeviceView lang={lang} onSelect={d => { setDevice(d); setView("roulette"); }} />
      )}
      {view === "roulette" && device && (
        <RouletteView lang={lang} device={device} onResult={d => { setDifficulty(d); setView("game"); }} />
      )}
      {view === "game" && device && difficulty && (
        <GameView lang={lang} device={device} difficulty={difficulty} apiKey={apiKey}
          onResults={handleResults} />
      )}
      {view === "results" && device && difficulty && evaluation && hiddenData && (
        <ResultsView
          lang={lang} device={device} difficulty={difficulty}
          evaluation={evaluation} hiddenData={hiddenData} diagnosis={diagnosis}
          onReplay={() => { setView("roulette"); setEvaluation(null); }}
          onChangeDevice={() => { setView("device"); setDevice(null); setDifficulty(null); setEvaluation(null); }}
        />
      )}

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
