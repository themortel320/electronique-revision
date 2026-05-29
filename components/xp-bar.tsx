"use client";

import { useEffect, useState, useRef } from "react";
import { loadXP, getLevelInfo, addXP, type LevelInfo, type XPResult, LEVELS } from "@/lib/xp";

// ── Level-up toast ────────────────────────────────────────────────────────────
export function LevelUpToast({ result, onDone }: { result: XPResult; onDone: () => void }) {
  const info = result.levelInfo;
  useEffect(() => {
    const t = setTimeout(onDone, 4000);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div
      className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 animate-fade-up"
      style={{ filter: `drop-shadow(0 0 24px ${info.glow})` }}
    >
      <div
        className="flex items-center gap-4 rounded-2xl border px-6 py-4 backdrop-blur-xl"
        style={{ borderColor: `${info.color}55`, background: `linear-gradient(135deg, #0d0d1f, ${info.glow})` }}
      >
        <div className="text-4xl animate-bounce">{info.emoji}</div>
        <div>
          <p className="text-xs text-white/50 uppercase tracking-widest">Niveau atteint !</p>
          <p className="text-xl font-black" style={{ color: info.color }}>
            Niveau {info.level} — {info.title}
          </p>
          <p className="text-xs text-white/40 mt-0.5">+{result.gained} XP</p>
        </div>
        <div
          className="flex h-12 w-12 items-center justify-center rounded-full border-2 text-xl font-black"
          style={{ borderColor: info.color, color: info.color, boxShadow: `0 0 20px ${info.glow}` }}
        >
          {info.level}
        </div>
      </div>
    </div>
  );
}

// ── XP earned notification (smaller) ─────────────────────────────────────────
export function XPToast({ amount, onDone }: { amount: number; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 1800);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-up pointer-events-none">
      <div className="flex items-center gap-2 rounded-xl border border-violet-500/40 bg-violet-900/80 backdrop-blur-xl px-4 py-2.5 shadow-lg shadow-violet-900/30">
        <span className="text-base">⚡</span>
        <span className="text-sm font-bold text-violet-200">+{amount} XP</span>
      </div>
    </div>
  );
}

// ── Compact XP bar for navbar ─────────────────────────────────────────────────
export function NavXPBar() {
  const [info, setInfo] = useState<LevelInfo | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInfo(getLevelInfo(loadXP()));
    // Listen for XP changes via storage events
    const onStorage = () => setInfo(getLevelInfo(loadXP()));
    window.addEventListener("storage", onStorage);
    window.addEventListener("electrolab:xp-update", onStorage);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("electrolab:xp-update", onStorage);
    };
  }, []);

  useEffect(() => {
    function onClickOut(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setShowDetail(false);
    }
    document.addEventListener("mousedown", onClickOut);
    return () => document.removeEventListener("mousedown", onClickOut);
  }, []);

  if (!info) return null;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setShowDetail(v => !v)}
        className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/8 px-2.5 py-1.5 transition-all"
        title={`${info.title} — ${info.xp} XP`}
      >
        <span className="text-base leading-none">{info.emoji}</span>
        <div className="hidden sm:flex flex-col gap-0.5 min-w-[60px]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold" style={{ color: info.color }}>Niv.{info.level}</span>
            <span className="text-[9px] text-white/30">{info.xpInLevel}/{info.isMax ? "∞" : info.xpNeeded}</span>
          </div>
          <div className="h-1 rounded-full bg-white/10 overflow-hidden w-16">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${info.pct}%`, background: info.color, boxShadow: `0 0 6px ${info.glow}` }}
            />
          </div>
        </div>
      </button>

      {/* Detail popup */}
      {showDetail && (
        <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-white/10 bg-[#0d0d1f]/98 backdrop-blur-xl shadow-2xl p-4 z-50 animate-fade-up">
          <div className="flex items-center gap-3 mb-4">
            <div className="text-3xl">{info.emoji}</div>
            <div>
              <p className="font-black text-white" style={{ color: info.color }}>{info.title}</p>
              <p className="text-xs text-white/40">Niveau {info.level} · {info.xp} XP total</p>
            </div>
          </div>

          {/* XP bar */}
          <div className="space-y-1.5 mb-4">
            <div className="flex justify-between text-[10px] text-white/40">
              <span>{info.isMax ? "Niveau maximum" : `Progression vers niveau ${info.level + 1}`}</span>
              <span>{info.pct}%</span>
            </div>
            <div className="h-2 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${info.pct}%`, background: `linear-gradient(90deg, ${info.color}99, ${info.color})`, boxShadow: `0 0 8px ${info.glow}` }}
              />
            </div>
            {!info.isMax && (
              <p className="text-[10px] text-white/30 text-right">{info.xpNeeded - info.xpInLevel} XP restants</p>
            )}
          </div>

          {/* All levels */}
          <div className="space-y-1">
            {LEVELS.map(l => {
              const reached = info.level >= l.level;
              const current = info.level === l.level;
              return (
                <div key={l.level} className={`flex items-center gap-2 rounded-lg px-2 py-1 ${current ? "bg-white/8" : ""}`}>
                  <span className={`text-sm ${reached ? "" : "grayscale opacity-30"}`}>{l.emoji}</span>
                  <span className={`text-xs flex-1 ${reached ? "text-white/70" : "text-white/20"}`}>
                    {l.title}
                  </span>
                  <span className="text-[10px]" style={{ color: reached ? l.color : "transparent" }}>
                    {l.level === 1 ? "0" : l.min} XP
                  </span>
                  {current && <span className="text-[9px] font-bold text-white/40 bg-white/10 px-1.5 py-0.5 rounded-full">En cours</span>}
                  {reached && !current && <span className="text-[10px]" style={{ color: l.color }}>✓</span>}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Hook to trigger XP gain with toast ───────────────────────────────────────
export function useXP() {
  const [toast, setToast] = useState<{ amount: number; key: number } | null>(null);
  const [levelUpResult, setLevelUpResult] = useState<XPResult | null>(null);

  function gainXP(amount: number) {
    const result = addXP(amount);
    // Dispatch event so NavXPBar updates
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("electrolab:xp-update"));
    }
    if (result.leveledUp) {
      setLevelUpResult(result);
    } else {
      setToast({ amount, key: Date.now() });
    }
    return result;
  }

  const toastEl = toast ? (
    <XPToast key={toast.key} amount={toast.amount} onDone={() => setToast(null)} />
  ) : null;

  const levelUpEl = levelUpResult ? (
    <LevelUpToast result={levelUpResult} onDone={() => setLevelUpResult(null)} />
  ) : null;

  return { gainXP, toastEl, levelUpEl };
}
