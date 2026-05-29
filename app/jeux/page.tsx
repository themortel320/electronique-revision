"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, Flame, RotateCcw, CheckCircle, XCircle } from "lucide-react";

// ── Color data ────────────────────────────────────────────────────────────────
const DIGIT_COLORS = [
  { name: "Noir",   digit: 0, hex: "#111111", light: false },
  { name: "Marron", digit: 1, hex: "#7B3F00", light: false },
  { name: "Rouge",  digit: 2, hex: "#C42020", light: false },
  { name: "Orange", digit: 3, hex: "#F06400", light: false },
  { name: "Jaune",  digit: 4, hex: "#F5C900", light: true  },
  { name: "Vert",   digit: 5, hex: "#2E7D32", light: false },
  { name: "Bleu",   digit: 6, hex: "#1565C0", light: false },
  { name: "Violet", digit: 7, hex: "#6A1B9A", light: false },
  { name: "Gris",   digit: 8, hex: "#616161", light: false },
  { name: "Blanc",  digit: 9, hex: "#F0F0F0", light: true  },
];

const MULT_COLORS = [
  { name: "Noir",   mult: 1,    label: "×1 Ω",    hex: "#111111", light: false },
  { name: "Marron", mult: 10,   label: "×10 Ω",   hex: "#7B3F00", light: false },
  { name: "Rouge",  mult: 100,  label: "×100 Ω",  hex: "#C42020", light: false },
  { name: "Orange", mult: 1e3,  label: "×1 kΩ",   hex: "#F06400", light: false },
  { name: "Jaune",  mult: 1e4,  label: "×10 kΩ",  hex: "#F5C900", light: true  },
  { name: "Vert",   mult: 1e5,  label: "×100 kΩ", hex: "#2E7D32", light: false },
  { name: "Bleu",   mult: 1e6,  label: "×1 MΩ",   hex: "#1565C0", light: false },
  { name: "Or",     mult: 0.1,  label: "×0.1 Ω",  hex: "#C9A42C", light: true  },
  { name: "Argent", mult: 0.01, label: "×0.01 Ω", hex: "#9E9E9E", light: true  },
];

const TOL_COLORS = [
  { name: "Or",     tol: "±5%",  hex: "#C9A42C", light: true  },
  { name: "Argent", tol: "±10%", hex: "#9E9E9E", light: true  },
  { name: "Marron", tol: "±1%",  hex: "#7B3F00", light: false },
  { name: "Rouge",  tol: "±2%",  hex: "#C42020", light: false },
];

// ── Helpers ──────────────────────────────────────────────────────────────────
function formatOhm(val: number): string {
  if (val >= 1e6) return `${+(val / 1e6).toFixed(val % 1e6 === 0 ? 0 : 2)} MΩ`;
  if (val >= 1e3) return `${+(val / 1e3).toFixed(val % 1e3 === 0 ? 0 : 2)} kΩ`;
  return `${+val.toFixed(val < 1 ? 2 : 0)} Ω`;
}
function rnd(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min; }

type Q = { d1: typeof DIGIT_COLORS[0]; d2: typeof DIGIT_COLORS[0]; mult: typeof MULT_COLORS[0]; tol: typeof TOL_COLORS[0]; correct: string; options: string[] };

function makeQuestion(): Q {
  const d1   = DIGIT_COLORS[rnd(1, 9)];
  const d2   = DIGIT_COLORS[rnd(0, 9)];
  const mult = MULT_COLORS[rnd(0, 6)];
  const tol  = TOL_COLORS[rnd(0, 3)];
  const value = (d1.digit * 10 + d2.digit) * mult.mult;
  const correct = `${formatOhm(value)} ${tol.tol}`;

  const wrongs = new Set<string>();
  let safety = 0;
  while (wrongs.size < 3 && safety++ < 200) {
    const wd1  = DIGIT_COLORS[rnd(1, 9)];
    const wd2  = DIGIT_COLORS[rnd(0, 9)];
    const wm   = MULT_COLORS[rnd(0, 6)];
    const wt   = TOL_COLORS[rnd(0, 3)];
    const wval = (wd1.digit * 10 + wd2.digit) * wm.mult;
    const w    = `${formatOhm(wval)} ${wt.tol}`;
    if (w !== correct) wrongs.add(w);
  }
  const options = [correct, ...[...wrongs]].sort(() => Math.random() - 0.5);
  return { d1, d2, mult, tol, correct, options };
}

// ── Resistor SVG ─────────────────────────────────────────────────────────────
function ResistorSVG({ d1, d2, mult, tol, revealed = true }: { d1: typeof DIGIT_COLORS[0]; d2: typeof DIGIT_COLORS[0]; mult: typeof MULT_COLORS[0]; tol: typeof TOL_COLORS[0]; revealed?: boolean }) {
  return (
    <svg viewBox="0 0 340 90" className="w-full max-w-sm mx-auto" style={{ filter: "drop-shadow(0 6px 24px rgba(0,0,0,0.5))" }}>
      {/* Leads */}
      <line x1="0"   y1="45" x2="72"  y2="45" stroke="#9E9E9E" strokeWidth="4" strokeLinecap="round"/>
      <line x1="268" y1="45" x2="340" y2="45" stroke="#9E9E9E" strokeWidth="4" strokeLinecap="round"/>
      {/* Body highlight (top) */}
      <rect x="72"  y="20" width="196" height="50" rx="11" fill="#C8B888"/>
      <rect x="72"  y="20" width="196" height="22" rx="11" fill="#DDD0A0"/>
      {/* Body base */}
      <rect x="72"  y="20" width="196" height="50" rx="11" fill="none" stroke="#A89050" strokeWidth="1.5"/>

      {/* Band labels */}
      {revealed && <>
        {/* Band 1 — digit 1 */}
        <rect x="96"  y="20" width="20" height="50" fill={d1.hex} opacity="0.95"/>
        {/* Band 2 — digit 2 */}
        <rect x="130" y="20" width="20" height="50" fill={d2.hex} opacity="0.95"/>
        {/* Band 3 — multiplier */}
        <rect x="168" y="20" width="20" height="50" fill={mult.hex} opacity="0.95"/>
        {/* Band 4 — tolerance (separated) */}
        <rect x="224" y="20" width="20" height="50" fill={tol.hex} opacity="0.95"/>
      </>}

      {/* Band 1/2/3 are shown always, but "?" when !revealed for tol */}
      {!revealed && <>
        <rect x="96"  y="20" width="20" height="50" fill={d1.hex} opacity="0.95"/>
        <rect x="130" y="20" width="20" height="50" fill={d2.hex} opacity="0.95"/>
        <rect x="168" y="20" width="20" height="50" fill={mult.hex} opacity="0.95"/>
        <rect x="224" y="20" width="20" height="50" fill="#333" opacity="0.7"/>
        <text x="234" y="50" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">?</text>
      </>}

      {/* Band separation lines on body */}
      <line x1="116" y1="20" x2="116" y2="70" stroke="#A89050" strokeWidth="0.5" opacity="0.4"/>
      <line x1="150" y1="20" x2="150" y2="70" stroke="#A89050" strokeWidth="0.5" opacity="0.4"/>
      <line x1="188" y1="20" x2="188" y2="70" stroke="#A89050" strokeWidth="0.5" opacity="0.4"/>
      <line x1="214" y1="20" x2="214" y2="70" stroke="#A89050" strokeWidth="0.5" opacity="0.4"/>

      {/* Band labels under resistor */}
      <text x="106" y="84" textAnchor="middle" fill="#aaa" fontSize="9">1er</text>
      <text x="140" y="84" textAnchor="middle" fill="#aaa" fontSize="9">2e</text>
      <text x="178" y="84" textAnchor="middle" fill="#aaa" fontSize="9">mult</text>
      <text x="234" y="84" textAnchor="middle" fill="#aaa" fontSize="9">tol</text>
    </svg>
  );
}

// ── Color reference table ─────────────────────────────────────────────────────
function ColorTable() {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0d0d1f] overflow-hidden text-xs">
      <div className="px-4 py-2 bg-white/5 border-b border-white/8 font-semibold text-white/60">
        📖 Tableau des codes couleurs
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-white/30 text-[10px]">
              <th className="px-3 py-1.5 text-left">Couleur</th>
              <th className="px-3 py-1.5 text-center">Chiffre</th>
              <th className="px-3 py-1.5 text-center">Multiplicateur</th>
              <th className="px-3 py-1.5 text-center">Tolérance</th>
            </tr>
          </thead>
          <tbody>
            {DIGIT_COLORS.map((c, i) => {
              const mc = MULT_COLORS.find(m => m.name === c.name);
              const tc = TOL_COLORS.find(t => t.name === c.name);
              return (
                <tr key={c.name} className={i % 2 === 0 ? "bg-white/2" : ""}>
                  <td className="px-3 py-1.5 flex items-center gap-2">
                    <span className="w-4 h-4 rounded shrink-0 border border-white/10" style={{ background: c.hex }}/>
                    <span className="text-white/70">{c.name}</span>
                  </td>
                  <td className="px-3 py-1.5 text-center text-white/60">{c.digit}</td>
                  <td className="px-3 py-1.5 text-center text-white/60">{mc?.label ?? "—"}</td>
                  <td className="px-3 py-1.5 text-center text-white/60">{tc?.tol ?? "—"}</td>
                </tr>
              );
            })}
            {[
              { name: "Or",     hex: "#C9A42C", label: "×0.1 Ω",  tol: "±5%"  },
              { name: "Argent", hex: "#9E9E9E", label: "×0.01 Ω", tol: "±10%" },
            ].map((c, i) => (
              <tr key={c.name} className={i % 2 === 0 ? "bg-white/2" : ""}>
                <td className="px-3 py-1.5 flex items-center gap-2">
                  <span className="w-4 h-4 rounded shrink-0 border border-white/10" style={{ background: c.hex }}/>
                  <span className="text-white/70">{c.name}</span>
                </td>
                <td className="px-3 py-1.5 text-center text-white/30">—</td>
                <td className="px-3 py-1.5 text-center text-white/60">{c.label}</td>
                <td className="px-3 py-1.5 text-center text-white/60">{c.tol}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-4 py-2 bg-white/3 border-t border-white/8 text-white/30 text-[10px]">
        Moyen mnémotechnique : <span className="text-white/50 font-medium">N</span>oir · <span className="text-white/50 font-medium">M</span>arron · <span className="text-white/50 font-medium">R</span>ouge · <span className="text-white/50 font-medium">O</span>range · <span className="text-white/50 font-medium">J</span>aune · <span className="text-white/50 font-medium">V</span>ert · <span className="text-white/50 font-medium">B</span>leu · <span className="text-white/50 font-medium">V</span>iolet · <span className="text-white/50 font-medium">G</span>ris · <span className="text-white/50 font-medium">B</span>lanc
      </div>
    </div>
  );
}

// ── Encode mode ──────────────────────────────────────────────────────────────
type EncodeQ = { d1: typeof DIGIT_COLORS[0]; d2: typeof DIGIT_COLORS[0]; mult: typeof MULT_COLORS[0]; tol: typeof TOL_COLORS[0]; label: string };

function makeEncodeQuestion(): EncodeQ {
  const d1   = DIGIT_COLORS[rnd(1, 9)];
  const d2   = DIGIT_COLORS[rnd(0, 9)];
  const mult = MULT_COLORS[rnd(0, 6)];
  const tol  = TOL_COLORS[rnd(0, 3)];
  const value = (d1.digit * 10 + d2.digit) * mult.mult;
  return { d1, d2, mult, tol, label: `${formatOhm(value)} ${tol.tol}` };
}

function EncodeMode({ score, streak, onCorrect, onWrong }: { score: number; streak: number; onCorrect: () => void; onWrong: () => void }) {
  const [q, setQ] = useState<EncodeQ>(makeEncodeQuestion);
  const [sel, setSel] = useState<{ d1: string | null; d2: string | null; mult: string | null; tol: string | null }>({ d1: null, d2: null, mult: null, tol: null });
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);
  const [active, setActive] = useState<"d1" | "d2" | "mult" | "tol">("d1");

  const BAND_LABELS = [
    { key: "d1" as const,   label: "1er chiffre",   colors: DIGIT_COLORS },
    { key: "d2" as const,   label: "2e chiffre",    colors: DIGIT_COLORS },
    { key: "mult" as const, label: "Multiplicateur", colors: MULT_COLORS  },
    { key: "tol" as const,  label: "Tolérance",     colors: TOL_COLORS   },
  ];

  function selectColor(band: typeof active, name: string) {
    setSel(prev => ({ ...prev, [band]: name }));
    const next = band === "d1" ? "d2" : band === "d2" ? "mult" : band === "mult" ? "tol" : "tol";
    if (band !== "tol") setActive(next);
  }

  function verify() {
    const ok = sel.d1 === q.d1.name && sel.d2 === q.d2.name && sel.mult === q.mult.name && sel.tol === q.tol.name;
    setResult(ok ? "correct" : "wrong");
    if (ok) onCorrect(); else onWrong();
  }

  function next() {
    setQ(makeEncodeQuestion());
    setSel({ d1: null, d2: null, mult: null, tol: null });
    setResult(null);
    setActive("d1");
  }

  // Preview resistor with selected colors
  const previewD1   = DIGIT_COLORS.find(c => c.name === sel.d1)   ?? { hex: "#444", light: false, name: "?", digit: 0 };
  const previewD2   = DIGIT_COLORS.find(c => c.name === sel.d2)   ?? { hex: "#444", light: false, name: "?", digit: 0 };
  const previewMult = MULT_COLORS.find(c => c.name === sel.mult)  ?? { hex: "#444", light: false, name: "?", mult: 1, label: "?" };
  const previewTol  = TOL_COLORS.find(c => c.name === sel.tol)    ?? { hex: "#444", light: false, name: "?", tol: "?" };

  return (
    <div className="space-y-5">
      {/* Score bar */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-sm">
          <span className="text-white/40">Score :</span>
          <span className="font-bold text-white tabular-nums">{score}</span>
        </div>
        {streak >= 2 && (
          <div className="flex items-center gap-1 text-sm text-amber-400 font-bold">
            <Flame size={14} /> {streak} combo
          </div>
        )}
      </div>

      {/* Target value */}
      <div className="rounded-2xl border border-violet-700/30 bg-violet-900/20 p-5 text-center">
        <p className="text-xs text-violet-300/60 mb-1">Code cette résistance :</p>
        <p className="text-3xl font-black text-white tracking-tight">{q.label}</p>
      </div>

      {/* Resistor preview */}
      <div className="rounded-2xl border border-white/8 bg-[#0d0d1f] py-6 px-2">
        <ResistorSVG d1={previewD1 as typeof DIGIT_COLORS[0]} d2={previewD2 as typeof DIGIT_COLORS[0]} mult={previewMult as typeof MULT_COLORS[0]} tol={previewTol as typeof TOL_COLORS[0]} />
      </div>

      {/* Band selectors */}
      {result === null && (
        <div className="space-y-3">
          {/* Band tabs */}
          <div className="flex gap-1.5 flex-wrap">
            {BAND_LABELS.map(({ key, label }) => {
              const chosen = sel[key];
              const c = (key === "d1" || key === "d2") ? DIGIT_COLORS.find(x => x.name === chosen) : key === "mult" ? MULT_COLORS.find(x => x.name === chosen) : TOL_COLORS.find(x => x.name === chosen);
              return (
                <button key={key} onClick={() => setActive(key)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${active === key ? "border-violet-500/60 bg-violet-900/30 text-violet-300" : "border-white/10 text-white/40 hover:text-white"}`}
                >
                  {c && <span className="w-3 h-3 rounded-sm border border-white/20 shrink-0" style={{ background: c.hex }}/>}
                  {label}
                  {chosen && <span className="text-white/30">({chosen})</span>}
                </button>
              );
            })}
          </div>

          {/* Color picker */}
          <div className="rounded-2xl border border-white/10 bg-white/3 p-3">
            <p className="text-xs text-white/30 mb-2">{BAND_LABELS.find(b => b.key === active)?.label} :</p>
            <div className="flex flex-wrap gap-2">
              {(active === "d1" || active === "d2" ? DIGIT_COLORS : active === "mult" ? MULT_COLORS : TOL_COLORS).map((c) => (
                <button key={c.name} onClick={() => selectColor(active, c.name)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all ${sel[active] === c.name ? "border-white/50 ring-2 ring-white/30 scale-105" : "border-white/10 hover:border-white/30"}`}
                  style={{ background: c.hex }}
                >
                  <span className={c.light ? "text-black/80" : "text-white/90"}>{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            disabled={!sel.d1 || !sel.d2 || !sel.mult || !sel.tol}
            onClick={verify}
            className="w-full py-3 rounded-2xl bg-violet-600 hover:bg-violet-500 disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold text-sm transition-all"
          >
            Vérifier →
          </button>
        </div>
      )}

      {/* Result */}
      {result !== null && (
        <div className={`rounded-2xl border p-5 space-y-3 ${result === "correct" ? "border-emerald-600/40 bg-emerald-900/20" : "border-red-600/40 bg-red-900/20"}`}>
          <div className="flex items-center gap-2 font-bold text-sm">
            {result === "correct" ? <CheckCircle size={18} className="text-emerald-400"/> : <XCircle size={18} className="text-red-400"/>}
            <span className={result === "correct" ? "text-emerald-300" : "text-red-300"}>
              {result === "correct" ? "Parfait ! ✨" : "Pas tout à fait…"}
            </span>
          </div>
          {result === "wrong" && (
            <div className="text-xs text-white/60 space-y-1">
              <p className="text-white/80 font-medium">La bonne réponse :</p>
              {[
                { band: "1er chiffre", correct: q.d1.name, chosen: sel.d1, hex: q.d1.hex },
                { band: "2e chiffre",  correct: q.d2.name, chosen: sel.d2, hex: q.d2.hex },
                { band: "Multiplicateur", correct: q.mult.name, chosen: sel.mult, hex: q.mult.hex },
                { band: "Tolérance",  correct: q.tol.name, chosen: sel.tol, hex: q.tol.hex },
              ].map(({ band, correct, chosen, hex }) => (
                <div key={band} className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm border border-white/10" style={{ background: hex }}/>
                  <span className="text-white/40">{band} :</span>
                  <span className={chosen === correct ? "text-emerald-400" : "text-red-400 line-through text-[10px]"}>{chosen ?? "—"}</span>
                  {chosen !== correct && <span className="text-emerald-400">→ {correct}</span>}
                </div>
              ))}
            </div>
          )}
          <button onClick={next} className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-sm font-semibold transition-all">
            Question suivante →
          </button>
        </div>
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function JeuxPage() {
  const [mode, setMode] = useState<"decode" | "encode">("decode");
  const [showTable, setShowTable] = useState(false);
  const [expertMode, setExpertMode] = useState(false);

  // Score state
  const [score, setScore]   = useState(0);
  const [streak, setStreak] = useState(0);
  const [best, setBest]     = useState(0);
  const [total, setTotal]   = useState(0);

  // Decode state
  const [q, setQ]           = useState<Q>(makeQuestion);
  const [chosen, setChosen] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);

  const onCorrect = useCallback(() => {
    const combo = Math.min(streak + 1, 5);
    const pts = 10 * combo;
    setScore(s => { const next = s + pts; setBest(b => Math.max(b, next)); return next; });
    setStreak(s => s + 1);
    setTotal(t => t + 1);
  }, [streak]);

  const onWrong = useCallback(() => {
    setStreak(0);
    setTotal(t => t + 1);
  }, []);

  function answer(opt: string) {
    if (answered) return;
    setChosen(opt);
    setAnswered(true);
    if (opt === q.correct) onCorrect(); else onWrong();
  }

  function nextQuestion() {
    setQ(makeQuestion());
    setChosen(null);
    setAnswered(false);
  }

  function reset() {
    setScore(0); setStreak(0); setTotal(0);
    setQ(makeQuestion()); setChosen(null); setAnswered(false);
  }

  const accuracy = total > 0 ? Math.round((score / 10 / total) * 100) : 100;

  return (
    <div className="max-w-xl mx-auto px-4 py-10 space-y-6">
      {/* Header */}
      <header className="space-y-1">
        <div className="flex items-center gap-3 mb-3">
          <Link href="/" className="text-white/30 hover:text-white/70 transition-colors">
            <ArrowLeft size={18}/>
          </Link>
          <div className="text-2xl">🎨</div>
          <div>
            <h1 className="text-2xl font-black text-white">Code couleur des résistances</h1>
            <p className="text-white/35 text-sm">Lis ou encode les bandes comme un pro !</p>
          </div>
        </div>

        {/* Stats bar */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 rounded-xl border border-white/8 bg-white/4 px-3 py-1.5 text-xs">
            <span className="text-white/40">Score</span>
            <span className="font-bold text-white tabular-nums">{score}</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-xl border border-white/8 bg-white/4 px-3 py-1.5 text-xs">
            <span className="text-white/40">Meilleur</span>
            <span className="font-bold text-amber-400 tabular-nums">{best}</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-xl border border-white/8 bg-white/4 px-3 py-1.5 text-xs">
            <span className="text-white/40">Précision</span>
            <span className={`font-bold tabular-nums ${accuracy >= 80 ? "text-emerald-400" : accuracy >= 50 ? "text-amber-400" : "text-red-400"}`}>{accuracy}%</span>
          </div>
          {streak >= 2 && (
            <div className="flex items-center gap-1 rounded-xl border border-amber-700/40 bg-amber-900/20 px-3 py-1.5 text-xs text-amber-300 font-bold animate-pulse">
              <Flame size={12}/> Combo ×{Math.min(streak, 5)}
            </div>
          )}
          <button onClick={reset} className="ml-auto text-white/20 hover:text-white/50 transition-colors" title="Réinitialiser">
            <RotateCcw size={14}/>
          </button>
        </div>
      </header>

      {/* Mode + options */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex gap-1 bg-white/5 border border-white/10 rounded-xl p-1">
          {(["decode", "encode"] as const).map(m => (
            <button key={m} onClick={() => setMode(m)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${mode === m ? "bg-violet-600 text-white" : "text-white/40 hover:text-white"}`}
            >
              {m === "decode" ? "🔍 Lire les couleurs" : "🖊️ Encoder une valeur"}
            </button>
          ))}
        </div>
        <button onClick={() => setExpertMode(v => !v)}
          className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${expertMode ? "border-orange-600/50 bg-orange-900/20 text-orange-300" : "border-white/10 text-white/30 hover:text-white"}`}
        >
          {expertMode ? "🔥 Expert" : "💡 Aide ON"}
        </button>
        <button onClick={() => setShowTable(v => !v)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${showTable ? "border-blue-600/50 bg-blue-900/20 text-blue-300" : "border-white/10 text-white/30 hover:text-white"}`}
        >
          <BookOpen size={12}/> Tableau
        </button>
      </div>

      {/* Color table */}
      {showTable && <ColorTable />}

      {/* ── DECODE MODE ── */}
      {mode === "decode" && (
        <div className="space-y-5">
          {/* Resistor */}
          <div className="rounded-2xl border border-white/8 bg-[#0d0d1f] py-8 px-4 space-y-4">
            <ResistorSVG d1={q.d1} d2={q.d2} mult={q.mult} tol={q.tol} />

            {/* Color name labels (hidden in expert mode) */}
            {!expertMode && (
              <div className="flex justify-center gap-3 mt-2 flex-wrap">
                {[
                  { label: "1er", color: q.d1 },
                  { label: "2e",  color: q.d2 },
                  { label: "×",   color: q.mult },
                  { label: "tol", color: q.tol },
                ].map(({ label, color }) => (
                  <div key={label} className="flex flex-col items-center gap-1">
                    <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border border-white/10 ${color.light ? "text-black" : "text-white"}`} style={{ background: color.hex }}>
                      {color.name}
                    </span>
                    <span className="text-[10px] text-white/25">{label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <p className="text-sm text-white/50 text-center font-medium">Quelle est la valeur de cette résistance ?</p>

          {/* MCQ options */}
          <div className="grid grid-cols-2 gap-2">
            {q.options.map((opt) => {
              const isCorrect = opt === q.correct;
              const isChosen  = opt === chosen;
              let cls = "border-white/10 bg-white/3 text-white/70 hover:border-white/20 hover:bg-white/6 hover:text-white";
              if (answered) {
                if (isCorrect) cls = "border-emerald-500/60 bg-emerald-900/25 text-emerald-300 font-semibold";
                else if (isChosen) cls = "border-red-500/60 bg-red-900/25 text-red-300 line-through";
                else cls = "border-white/5 bg-white/1 text-white/25";
              }
              return (
                <button key={opt} onClick={() => answer(opt)}
                  disabled={answered}
                  className={`rounded-xl border px-3 py-3 text-sm text-left font-mono transition-all ${cls}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {/* Feedback */}
          {answered && (
            <div className={`rounded-2xl border p-4 space-y-2 ${chosen === q.correct ? "border-emerald-600/40 bg-emerald-900/15" : "border-red-600/40 bg-red-900/15"}`}>
              <div className="flex items-center gap-2 text-sm font-bold">
                {chosen === q.correct
                  ? <><CheckCircle size={16} className="text-emerald-400"/> <span className="text-emerald-300">Bravo ! {streak >= 3 ? `🔥 Combo ×${Math.min(streak,5)} !` : ""}</span></>
                  : <><XCircle size={16} className="text-red-400"/> <span className="text-red-300">Raté !</span></>
                }
              </div>
              <p className="text-xs text-white/50">
                Calcul : <span className="text-white/80 font-mono">{q.d1.name}({q.d1.digit}) | {q.d2.name}({q.d2.digit}) → {q.d1.digit}{q.d2.digit} × {q.mult.label} = <strong className="text-white">{q.correct}</strong></span>
              </p>
              <button onClick={nextQuestion}
                className="w-full mt-1 py-2.5 rounded-xl bg-white/8 hover:bg-white/12 text-white text-sm font-semibold transition-all"
              >
                Question suivante →
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── ENCODE MODE ── */}
      {mode === "encode" && (
        <EncodeMode score={score} streak={streak} onCorrect={onCorrect} onWrong={onWrong} />
      )}

      {/* Footer hint */}
      <p className="text-center text-[11px] text-white/15">
        Moyen mnémotechnique : <span className="text-white/30">N M R O J V B V G B</span>
        — Noir Marron Rouge Orange Jaune Vert Bleu Violet Gris Blanc
      </p>
    </div>
  );
}
