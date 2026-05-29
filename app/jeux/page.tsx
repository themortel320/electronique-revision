"use client";

import { useState, useCallback, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Flame, RotateCcw, CheckCircle, XCircle } from "lucide-react";
import { useXP } from "@/components/xp-bar";
import { XP_REWARDS } from "@/lib/xp";
import { submitScore } from "@/lib/leaderboard";
import { getPseudo } from "@/lib/user";

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

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatOhm(val: number): string {
  if (val >= 1e6) return `${+(val / 1e6).toFixed(val % 1e6 === 0 ? 0 : 2)} MΩ`;
  if (val >= 1e3) return `${+(val / 1e3).toFixed(val % 1e3 === 0 ? 0 : 2)} kΩ`;
  return `${+val.toFixed(val < 1 ? 2 : 0)} Ω`;
}
function rnd(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5); }

type Q = {
  d1: typeof DIGIT_COLORS[0]; d2: typeof DIGIT_COLORS[0];
  mult: typeof MULT_COLORS[0]; tol: typeof TOL_COLORS[0];
  correct: string; options: string[];
};

// ── Generate question with SIMILAR distractors ────────────────────────────────
function makeQuestion(): Q {
  const d1   = DIGIT_COLORS[rnd(1, 9)];
  const d2   = DIGIT_COLORS[rnd(0, 9)];
  const multIdx = rnd(0, 6);
  const mult = MULT_COLORS[multIdx];
  const tol  = TOL_COLORS[rnd(0, 3)];
  const value = (d1.digit * 10 + d2.digit) * mult.mult;
  const correct = `${formatOhm(value)} ${tol.tol}`;

  const wrongs = new Set<string>();
  let safety = 0;

  while (wrongs.size < 3 && safety++ < 600) {
    const strategy = rnd(0, 2);
    let wd1 = d1, wd2 = d2, wm = mult, wt = tol;

    if (strategy === 0) {
      // Same mult, change one digit by ±1..2 (close but different)
      if (rnd(0, 1) === 0) {
        const delta = rnd(1, 2) * (rnd(0, 1) === 0 ? 1 : -1);
        const nd = Math.max(1, Math.min(9, d1.digit + delta));
        wd1 = DIGIT_COLORS[nd];
      } else {
        const delta = rnd(1, 3) * (rnd(0, 1) === 0 ? 1 : -1);
        const nd = Math.max(0, Math.min(9, d2.digit + delta));
        wd2 = DIGIT_COLORS[nd];
      }
      // Occasionally flip tolerance too
      if (Math.random() > 0.6) wt = TOL_COLORS[rnd(0, 3)];
    } else if (strategy === 1) {
      // Same digits, adjacent multiplier (×10 or ÷10)
      const delta = rnd(0, 1) === 0 ? 1 : -1;
      const newIdx = Math.max(0, Math.min(6, multIdx + delta));
      wm = MULT_COLORS[newIdx];
      // Possibly change a digit slightly too
      if (Math.random() > 0.5) {
        const nd2 = Math.max(0, Math.min(9, d2.digit + (rnd(0,1) === 0 ? 1 : -1)));
        wd2 = DIGIT_COLORS[nd2];
      }
    } else {
      // Same digits + mult, different tolerance only
      wt = TOL_COLORS[rnd(0, 3)];
    }

    if (wd1.digit === 0) continue; // no leading zero
    const wval = (wd1.digit * 10 + wd2.digit) * wm.mult;
    if (wval <= 0) continue;
    const w = `${formatOhm(wval)} ${wt.tol}`;
    if (w !== correct) wrongs.add(w);
  }

  const options = shuffle([correct, ...[...wrongs]]);
  return { d1, d2, mult, tol, correct, options };
}

// ── Resistor SVG ──────────────────────────────────────────────────────────────
function ResistorSVG({
  d1, d2, mult, tol, showLabels = true,
}: {
  d1: typeof DIGIT_COLORS[0]; d2: typeof DIGIT_COLORS[0];
  mult: typeof MULT_COLORS[0]; tol: typeof TOL_COLORS[0];
  showLabels?: boolean;
}) {
  return (
    <svg viewBox="0 0 340 90" className="w-full max-w-sm mx-auto" style={{ filter: "drop-shadow(0 6px 24px rgba(0,0,0,0.5))" }}>
      <line x1="0"   y1="45" x2="72"  y2="45" stroke="#9E9E9E" strokeWidth="4" strokeLinecap="round"/>
      <line x1="268" y1="45" x2="340" y2="45" stroke="#9E9E9E" strokeWidth="4" strokeLinecap="round"/>
      <rect x="72"  y="20" width="196" height="50" rx="11" fill="#C8B888"/>
      <rect x="72"  y="20" width="196" height="22" rx="11" fill="#DDD0A0"/>
      <rect x="72"  y="20" width="196" height="50" rx="11" fill="none" stroke="#A89050" strokeWidth="1.5"/>
      <rect x="96"  y="20" width="20" height="50" fill={d1.hex}   opacity="0.95"/>
      <rect x="130" y="20" width="20" height="50" fill={d2.hex}   opacity="0.95"/>
      <rect x="168" y="20" width="20" height="50" fill={mult.hex} opacity="0.95"/>
      <rect x="224" y="20" width="20" height="50" fill={tol.hex}  opacity="0.95"/>
      <line x1="116" y1="20" x2="116" y2="70" stroke="#A89050" strokeWidth="0.5" opacity="0.4"/>
      <line x1="150" y1="20" x2="150" y2="70" stroke="#A89050" strokeWidth="0.5" opacity="0.4"/>
      <line x1="188" y1="20" x2="188" y2="70" stroke="#A89050" strokeWidth="0.5" opacity="0.4"/>
      <line x1="214" y1="20" x2="214" y2="70" stroke="#A89050" strokeWidth="0.5" opacity="0.4"/>
      {showLabels && <>
        <text x="106" y="84" textAnchor="middle" fill="#888" fontSize="9">1er</text>
        <text x="140" y="84" textAnchor="middle" fill="#888" fontSize="9">2e</text>
        <text x="178" y="84" textAnchor="middle" fill="#888" fontSize="9">mult</text>
        <text x="234" y="84" textAnchor="middle" fill="#888" fontSize="9">tol</text>
      </>}
    </svg>
  );
}

// ── Color table tab ───────────────────────────────────────────────────────────
function ColorTable() {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-white/10 bg-[#0d0d1f] overflow-hidden text-xs">
        <div className="px-4 py-3 bg-white/5 border-b border-white/8">
          <p className="font-semibold text-white/80 text-sm">Code couleur — 4 bandes</p>
          <p className="text-white/35 text-xs mt-0.5">Chiffres (bandes 1 & 2) · Multiplicateur (bande 3) · Tolérance (bande 4)</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-white/30 text-[10px] border-b border-white/5">
                <th className="px-3 py-2 text-left">Couleur</th>
                <th className="px-3 py-2 text-center">Chiffre</th>
                <th className="px-3 py-2 text-center">Multiplicateur</th>
                <th className="px-3 py-2 text-center">Tolérance</th>
              </tr>
            </thead>
            <tbody>
              {DIGIT_COLORS.map((c, i) => {
                const mc = MULT_COLORS.find(m => m.name === c.name);
                const tc = TOL_COLORS.find(t => t.name === c.name);
                return (
                  <tr key={c.name} className={`border-b border-white/4 ${i % 2 === 0 ? "" : "bg-white/2"}`}>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded shrink-0 border border-white/10" style={{ background: c.hex }}/>
                        <span className="text-white/70">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-center font-mono text-white/70 font-bold">{c.digit}</td>
                    <td className="px-3 py-2 text-center text-white/55">{mc?.label ?? "—"}</td>
                    <td className="px-3 py-2 text-center text-white/55">{tc?.tol ?? "—"}</td>
                  </tr>
                );
              })}
              {[
                { name: "Or",     hex: "#C9A42C", label: "×0.1 Ω",  tol: "±5%"  },
                { name: "Argent", hex: "#9E9E9E", label: "×0.01 Ω", tol: "±10%" },
              ].map((c, i) => (
                <tr key={c.name} className={`border-b border-white/4 ${i % 2 === 0 ? "" : "bg-white/2"}`}>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded shrink-0 border border-white/10" style={{ background: c.hex }}/>
                      <span className="text-white/70">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2 text-center text-white/25">—</td>
                  <td className="px-3 py-2 text-center text-white/55">{c.label}</td>
                  <td className="px-3 py-2 text-center text-white/55">{c.tol}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Resistor anatomy diagram */}
      <div className="rounded-2xl border border-white/10 bg-[#0d0d1f] p-5 space-y-4">
        <p className="text-sm font-semibold text-white/80">Anatomie d&apos;une résistance 4 bandes</p>
        <svg viewBox="0 0 340 110" className="w-full max-w-sm mx-auto">
          <line x1="0" y1="45" x2="72" y2="45" stroke="#9E9E9E" strokeWidth="4" strokeLinecap="round"/>
          <line x1="268" y1="45" x2="340" y2="45" stroke="#9E9E9E" strokeWidth="4" strokeLinecap="round"/>
          <rect x="72" y="20" width="196" height="50" rx="11" fill="#C8B888"/>
          <rect x="72" y="20" width="196" height="22" rx="11" fill="#DDD0A0"/>
          <rect x="72" y="20" width="196" height="50" rx="11" fill="none" stroke="#A89050" strokeWidth="1.5"/>
          <rect x="96"  y="20" width="20" height="50" fill="#7B3F00" opacity="0.9"/>
          <rect x="130" y="20" width="20" height="50" fill="#2E7D32" opacity="0.9"/>
          <rect x="168" y="20" width="20" height="50" fill="#F06400" opacity="0.9"/>
          <rect x="224" y="20" width="20" height="50" fill="#C9A42C" opacity="0.9"/>
          {/* Annotations */}
          <line x1="106" y1="72" x2="106" y2="85" stroke="#666" strokeWidth="1"/>
          <text x="106" y="95" textAnchor="middle" fill="#aaa" fontSize="8.5">1er chiffre</text>
          <line x1="140" y1="72" x2="140" y2="85" stroke="#666" strokeWidth="1"/>
          <text x="140" y="95" textAnchor="middle" fill="#aaa" fontSize="8.5">2e chiffre</text>
          <line x1="178" y1="72" x2="178" y2="85" stroke="#666" strokeWidth="1"/>
          <text x="178" y="95" textAnchor="middle" fill="#aaa" fontSize="8.5">Multiplicateur</text>
          <line x1="234" y1="72" x2="234" y2="85" stroke="#666" strokeWidth="1"/>
          <text x="234" y="95" textAnchor="middle" fill="#aaa" fontSize="8.5">Tolérance</text>
          <text x="106" y="105" textAnchor="middle" fill="#7B3F00" fontSize="8" fontWeight="bold">Marron=1</text>
          <text x="140" y="105" textAnchor="middle" fill="#4CAF50" fontSize="8" fontWeight="bold">Vert=5</text>
          <text x="178" y="105" textAnchor="middle" fill="#F06400" fontSize="8" fontWeight="bold">Orange=×1k</text>
          <text x="234" y="105" textAnchor="middle" fill="#C9A42C" fontSize="8" fontWeight="bold">Or=±5%</text>
        </svg>
        <p className="text-center text-xs text-white/40 font-mono">Marron | Vert | Orange | Or → 15 × 1000 = <strong className="text-white/70">15 kΩ ±5%</strong></p>
      </div>

      {/* Mnemonic */}
      <div className="rounded-2xl border border-white/10 bg-[#0d0d1f] p-4">
        <p className="text-xs font-semibold text-white/60 mb-2">💡 Moyen mnémotechnique</p>
        <div className="flex flex-wrap gap-1.5">
          {[
            { letter: "N", name: "Noir",   color: "#111", digit: "0" },
            { letter: "M", name: "Marron", color: "#7B3F00", digit: "1" },
            { letter: "R", name: "Rouge",  color: "#C42020", digit: "2" },
            { letter: "O", name: "Orange", color: "#F06400", digit: "3" },
            { letter: "J", name: "Jaune",  color: "#F5C900", digit: "4" },
            { letter: "V", name: "Vert",   color: "#2E7D32", digit: "5" },
            { letter: "B", name: "Bleu",   color: "#1565C0", digit: "6" },
            { letter: "V", name: "Violet", color: "#6A1B9A", digit: "7" },
            { letter: "G", name: "Gris",   color: "#616161", digit: "8" },
            { letter: "B", name: "Blanc",  color: "#E0E0E0", digit: "9" },
          ].map(({ letter, name, color, digit }) => (
            <div key={name} className="flex flex-col items-center gap-0.5">
              <span className="w-7 h-7 rounded-lg border border-white/10 flex items-center justify-center text-xs font-black" style={{ background: color, color: ["Jaune","Blanc"].includes(name) ? "#000" : "#fff" }}>{letter}</span>
              <span className="text-[9px] text-white/30">{digit}</span>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-white/25 mt-2 italic">
          &quot;<span className="text-white/40">N</span>oir <span className="text-white/40">M</span>arron <span className="text-white/40">R</span>ouge <span className="text-white/40">O</span>range <span className="text-white/40">J</span>aune <span className="text-white/40">V</span>ert <span className="text-white/40">B</span>leu <span className="text-white/40">V</span>iolet <span className="text-white/40">G</span>ris <span className="text-white/40">B</span>lanc&quot;
        </p>
      </div>
    </div>
  );
}

// ── Encode mode (colors shuffled each question) ───────────────────────────────
type EncodeQ = { d1: typeof DIGIT_COLORS[0]; d2: typeof DIGIT_COLORS[0]; mult: typeof MULT_COLORS[0]; tol: typeof TOL_COLORS[0]; label: string };

function makeEncodeQuestion(): EncodeQ {
  const d1   = DIGIT_COLORS[rnd(1, 9)];
  const d2   = DIGIT_COLORS[rnd(0, 9)];
  const mult = MULT_COLORS[rnd(0, 6)];
  const tol  = TOL_COLORS[rnd(0, 3)];
  const value = (d1.digit * 10 + d2.digit) * mult.mult;
  return { d1, d2, mult, tol, label: `${formatOhm(value)} ${tol.tol}` };
}

function makeShuffles() {
  return {
    digits: shuffle(DIGIT_COLORS),
    mults:  shuffle(MULT_COLORS),
    tols:   shuffle(TOL_COLORS),
  };
}

type Shuffles = ReturnType<typeof makeShuffles>;

function EncodeMode({ onCorrect, onWrong }: { onCorrect: () => void; onWrong: () => void }) {
  const [q, setQ]           = useState<EncodeQ>(makeEncodeQuestion);
  const [sh, setSh]         = useState<Shuffles>(makeShuffles);
  const [sel, setSel]       = useState<{ d1: string|null; d2: string|null; mult: string|null; tol: string|null }>({ d1:null,d2:null,mult:null,tol:null });
  const [result, setResult] = useState<"correct"|"wrong"|null>(null);
  const [active, setActive] = useState<"d1"|"d2"|"mult"|"tol">("d1");

  const BANDS = [
    { key: "d1"   as const, label: "1er chiffre",   colors: sh.digits },
    { key: "d2"   as const, label: "2e chiffre",    colors: sh.digits },
    { key: "mult" as const, label: "Multiplicateur", colors: sh.mults  },
    { key: "tol"  as const, label: "Tolérance",     colors: sh.tols   },
  ];

  function pick(band: typeof active, name: string) {
    setSel(prev => ({ ...prev, [band]: name }));
    if (band === "d1")   setActive("d2");
    else if (band === "d2")   setActive("mult");
    else if (band === "mult") setActive("tol");
  }

  function verify() {
    const ok = sel.d1 === q.d1.name && sel.d2 === q.d2.name && sel.mult === q.mult.name && sel.tol === q.tol.name;
    setResult(ok ? "correct" : "wrong");
    if (ok) onCorrect(); else onWrong();
  }

  function next() {
    const nq = makeEncodeQuestion();
    setQ(nq); setSh(makeShuffles());
    setSel({ d1:null, d2:null, mult:null, tol:null });
    setResult(null); setActive("d1");
  }

  // Build preview resistor
  const pD1   = (DIGIT_COLORS.find(c => c.name === sel.d1)   ?? { hex:"#333", light:false, name:"?", digit:0 }) as typeof DIGIT_COLORS[0];
  const pD2   = (DIGIT_COLORS.find(c => c.name === sel.d2)   ?? { hex:"#333", light:false, name:"?", digit:0 }) as typeof DIGIT_COLORS[0];
  const pMult = (MULT_COLORS.find(c => c.name === sel.mult)  ?? { hex:"#333", light:false, name:"?", mult:1, label:"?" }) as typeof MULT_COLORS[0];
  const pTol  = (TOL_COLORS.find(c => c.name === sel.tol)    ?? { hex:"#333", light:false, name:"?", tol:"?" }) as typeof TOL_COLORS[0];

  return (
    <div className="space-y-5">
      {/* Target */}
      <div className="rounded-2xl border border-violet-700/30 bg-violet-900/20 p-5 text-center">
        <p className="text-xs text-violet-300/60 mb-1">Code cette résistance :</p>
        <p className="text-3xl font-black text-white tracking-tight">{q.label}</p>
      </div>

      {/* Preview */}
      <div className="rounded-2xl border border-white/8 bg-[#0d0d1f] py-6 px-2">
        <ResistorSVG d1={pD1} d2={pD2} mult={pMult} tol={pTol} showLabels />
      </div>

      {result === null && (
        <div className="space-y-3">
          {/* Band tabs */}
          <div className="flex gap-1.5 flex-wrap">
            {BANDS.map(({ key, label }) => {
              const chosen = sel[key];
              const allColors = [...DIGIT_COLORS, ...MULT_COLORS, ...TOL_COLORS];
              const c = allColors.find(x => x.name === chosen);
              return (
                <button key={key} onClick={() => setActive(key)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${active === key ? "border-violet-500/60 bg-violet-900/30 text-violet-300" : "border-white/10 text-white/40 hover:text-white"}`}
                >
                  {c && <span className="w-3 h-3 rounded-sm border border-white/20 shrink-0" style={{ background: c.hex }}/>}
                  {label}
                  {chosen && <span className="text-white/30 ml-1">({chosen})</span>}
                </button>
              );
            })}
          </div>

          {/* Shuffled color picker */}
          <div className="rounded-2xl border border-white/10 bg-white/3 p-3">
            <p className="text-xs text-white/30 mb-2">{BANDS.find(b => b.key === active)?.label} :</p>
            <div className="flex flex-wrap gap-2">
              {BANDS.find(b => b.key === active)!.colors.map((c) => (
                <button key={c.name} onClick={() => pick(active, c.name)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                    sel[active] === c.name
                      ? "border-white/60 ring-2 ring-white/25 scale-105"
                      : "border-white/10 hover:border-white/30 hover:scale-105"
                  }`}
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

      {result !== null && (
        <div className={`rounded-2xl border p-5 space-y-3 ${result === "correct" ? "border-emerald-600/40 bg-emerald-900/20" : "border-red-600/40 bg-red-900/20"}`}>
          <div className="flex items-center gap-2 font-bold text-sm">
            {result === "correct"
              ? <><CheckCircle size={18} className="text-emerald-400"/><span className="text-emerald-300">Parfait ! ✨</span></>
              : <><XCircle size={18} className="text-red-400"/><span className="text-red-300">Pas tout à fait…</span></>
            }
          </div>
          {result === "wrong" && (
            <div className="text-xs text-white/60 space-y-1.5">
              <p className="text-white/80 font-medium mb-1">Bonne réponse :</p>
              {([
                { band: "1er chiffre",    correct: q.d1.name,   chosen: sel.d1,   hex: q.d1.hex   },
                { band: "2e chiffre",     correct: q.d2.name,   chosen: sel.d2,   hex: q.d2.hex   },
                { band: "Multiplicateur", correct: q.mult.name, chosen: sel.mult, hex: q.mult.hex },
                { band: "Tolérance",      correct: q.tol.name,  chosen: sel.tol,  hex: q.tol.hex  },
              ] as const).map(({ band, correct, chosen, hex }) => (
                <div key={band} className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm border border-white/10 shrink-0" style={{ background: hex }}/>
                  <span className="text-white/40">{band} :</span>
                  {chosen === correct
                    ? <span className="text-emerald-400">{correct} ✓</span>
                    : <><span className="text-red-400 line-through text-[10px]">{chosen ?? "—"}</span><span className="text-emerald-400 ml-1">→ {correct}</span></>
                  }
                </div>
              ))}
            </div>
          )}
          <button onClick={next} className="w-full mt-1 py-2.5 rounded-xl bg-white/8 hover:bg-white/12 text-white text-sm font-semibold transition-all">
            Question suivante →
          </button>
        </div>
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function JeuxPage() {
  const [tab, setTab] = useState<"decode"|"encode"|"table">("decode");
  const [expertMode, setExpertMode] = useState(false);
  const { gainXP, toastEl, levelUpEl } = useXP();

  const [score,  setScore]  = useState(0);
  const [streak, setStreak] = useState(0);
  const [best,   setBest]   = useState(0);
  const [total,  setTotal]  = useState(0);
  const [correct, setCorrect] = useState(0);
  const lbRef = useRef({ total: 0, correct: 0 });

  // Decode state
  const [q,        setQ]        = useState<Q>(makeQuestion);
  const [chosen,   setChosen]   = useState<string|null>(null);
  const [answered, setAnswered] = useState(false);

  const onCorrect = useCallback(() => {
    const newStreak = streak + 1;
    const combo = Math.min(newStreak, 5);
    const pts = 10 * combo;
    setScore(s => { const n = s + pts; setBest(b => Math.max(b, n)); return n; });
    setStreak(newStreak);
    setTotal(t => t + 1);
    setCorrect(c => c + 1);
    lbRef.current.total += 1;
    lbRef.current.correct += 1;
    gainXP(XP_REWARDS.resistorCorrect);
    if (newStreak === 5) gainXP(XP_REWARDS.resistorStreak5);
    // Submit to leaderboard every 10 questions
    const { total: nt, correct: nc } = lbRef.current;
    if (nt > 0 && nt % 10 === 0) {
      const pseudo = getPseudo();
      if (pseudo) {
        const acc = Math.round((nc / nt) * 100);
        submitScore({ pseudo, score: acc, correct: nc, total: nt, category: "resistor", date: new Date().toISOString() });
      }
    }
  }, [streak, gainXP]);

  const onWrong = useCallback(() => {
    setStreak(0);
    setTotal(t => t + 1);
    lbRef.current.total += 1;
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
    setScore(0); setStreak(0); setTotal(0); setCorrect(0);
    lbRef.current = { total: 0, correct: 0 };
    setQ(makeQuestion()); setChosen(null); setAnswered(false);
  }

  const accuracy = total > 0 ? Math.round((score / 10 / total) * 100) : 100;

  const TABS = [
    { id: "decode" as const, label: "🔍 Lire les couleurs" },
    { id: "encode" as const, label: "🖊️ Encoder" },
    { id: "table"  as const, label: "📖 Tableau" },
  ];

  return (
    <>
    {toastEl}{levelUpEl}
    <div className="max-w-xl mx-auto px-4 py-10 space-y-6">
      {/* Header */}
      <header>
        <div className="flex items-center gap-3 mb-3">
          <Link href="/" className="text-white/30 hover:text-white/70 transition-colors">
            <ArrowLeft size={18}/>
          </Link>
          <span className="text-2xl">🎨</span>
          <div>
            <h1 className="text-2xl font-black text-white">Code couleur des résistances</h1>
            <p className="text-white/35 text-sm">Lis ou encode les bandes comme un pro !</p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-xl border border-white/8 bg-white/4 px-3 py-1.5 text-xs">
            <span className="text-white/40">Score</span>
            <span className="font-bold text-white tabular-nums">{score}</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-xl border border-white/8 bg-white/4 px-3 py-1.5 text-xs">
            <span className="text-white/40">Best</span>
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
          <div className="flex items-center gap-2 ml-auto">
            {tab === "decode" && (
              <button onClick={() => setExpertMode(v => !v)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${expertMode ? "border-orange-600/50 bg-orange-900/20 text-orange-300" : "border-white/10 text-white/30 hover:text-white"}`}
              >
                {expertMode ? "🔥 Expert" : "💡 Aide"}
              </button>
            )}
            <button onClick={reset} className="text-white/20 hover:text-white/50 transition-colors p-1" title="Reset">
              <RotateCcw size={14}/>
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex gap-1 bg-white/5 border border-white/10 rounded-2xl p-1">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex-1 px-2 py-2 rounded-xl text-xs font-medium transition-all ${tab === t.id ? "bg-violet-600 text-white shadow-sm" : "text-white/40 hover:text-white"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── DECODE ── */}
      {tab === "decode" && (
        <div className="space-y-5">
          <div className="rounded-2xl border border-white/8 bg-[#0d0d1f] py-8 px-4 space-y-4">
            <ResistorSVG d1={q.d1} d2={q.d2} mult={q.mult} tol={q.tol} showLabels={!expertMode} />
            {!expertMode && (
              <div className="flex justify-center gap-3 flex-wrap">
                {[
                  { label: "1er", color: q.d1   },
                  { label: "2e",  color: q.d2   },
                  { label: "×",   color: q.mult },
                  { label: "tol", color: q.tol  },
                ].map(({ label, color }) => (
                  <div key={label} className="flex flex-col items-center gap-1">
                    <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border border-white/10 ${color.light ? "text-black" : "text-white"}`}
                      style={{ background: color.hex }}>
                      {color.name}
                    </span>
                    <span className="text-[10px] text-white/25">{label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <p className="text-sm text-white/50 text-center font-medium">Quelle est la valeur de cette résistance ?</p>

          <div className="grid grid-cols-2 gap-2">
            {q.options.map((opt) => {
              const isCorrect = opt === q.correct;
              const isChosen  = opt === chosen;
              let cls = "border-white/10 bg-white/3 text-white/70 hover:border-white/25 hover:bg-white/6 hover:text-white";
              if (answered) {
                if (isCorrect) cls = "border-emerald-500/60 bg-emerald-900/25 text-emerald-200 font-semibold";
                else if (isChosen) cls = "border-red-500/60 bg-red-900/25 text-red-300 line-through";
                else cls = "border-white/5 bg-white/1 text-white/25";
              }
              return (
                <button key={opt} onClick={() => answer(opt)} disabled={answered}
                  className={`rounded-xl border px-3 py-3 text-sm font-mono text-left transition-all ${cls}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {answered && (
            <div className={`rounded-2xl border p-4 space-y-2 ${chosen === q.correct ? "border-emerald-600/40 bg-emerald-900/15" : "border-red-600/40 bg-red-900/15"}`}>
              <div className="flex items-center gap-2 text-sm font-bold">
                {chosen === q.correct
                  ? <><CheckCircle size={16} className="text-emerald-400"/><span className="text-emerald-300">Bravo ! {streak >= 3 ? `🔥 ×${Math.min(streak,5)} combo` : ""}</span></>
                  : <><XCircle size={16} className="text-red-400"/><span className="text-red-300">Raté — la réponse était <span className="font-mono text-white">{q.correct}</span></span></>
                }
              </div>
              <p className="text-xs text-white/40 font-mono">
                {q.d1.name}({q.d1.digit}) | {q.d2.name}({q.d2.digit}) → {q.d1.digit}{q.d2.digit} × {q.mult.label} = <strong className="text-white/80">{q.correct}</strong>
              </p>
              <button onClick={nextQuestion}
                className="w-full mt-1 py-2.5 rounded-xl bg-white/8 hover:bg-white/12 text-white text-sm font-semibold transition-all"
              >
                Résistance suivante →
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── ENCODE ── */}
      {tab === "encode" && <EncodeMode onCorrect={onCorrect} onWrong={onWrong} />}

      {/* ── TABLE ── */}
      {tab === "table" && <ColorTable />}
    </div>
    </>
  );
}
