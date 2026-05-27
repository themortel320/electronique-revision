"use client";

import { useState } from "react";

const diagrams = [
  { id: "divider", label: "Diviseur de tension", desc: "Vout = Vin × R2 / (R1 + R2)" },
  { id: "led",     label: "LED + résistance",    desc: "R = (Vcc − Vf) / I"          },
  { id: "npn",     label: "Transistor NPN",       desc: "Ic = β × Ib"                 },
] as const;

export function CircuitDiagram() {
  const [active, setActive] = useState<(typeof diagrams)[number]["id"]>("divider");
  const current = diagrams.find((d) => d.id === active)!;

  return (
    <section className="card space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex flex-wrap gap-2">
          {diagrams.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => setActive(d.id)}
              className={`rounded-xl px-3.5 py-2 text-sm font-medium transition active:scale-95 ${
                active === d.id
                  ? "bg-brand-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
        <code className="rounded-lg bg-brand-50 px-3 py-1 text-xs font-mono font-bold text-brand-700 dark:bg-brand-950/50 dark:text-brand-300">
          {current.desc}
        </code>
      </div>

      {/* SVG with explicit light/dark fills */}
      <div className="rounded-xl bg-slate-50 p-6 dark:bg-slate-800/60">
        <svg
          viewBox="0 0 500 240"
          className="w-full"
          style={{ overflow: "visible" }}
        >
          <style>{`
            .wire    { stroke: #64748b; stroke-width: 2; fill: none; }
            .comp    { stroke: #334155; stroke-width: 2; fill: none; }
            .label   { font-size: 12px; font-family: ui-monospace, monospace; fill: #475569; }
            .label-b { font-size: 12px; font-family: ui-monospace, monospace; fill: #1e3a8a; font-weight: 600; }
            .hi      { stroke: #2563eb; stroke-width: 2.5; fill: none; }
            .arrow   { fill: #334155; }

            @media (prefers-color-scheme: dark) {
              .wire    { stroke: #94a3b8; }
              .comp    { stroke: #cbd5e1; }
              .label   { fill: #94a3b8; }
              .label-b { fill: #93c5fd; }
              .hi      { stroke: #60a5fa; }
              .arrow   { fill: #cbd5e1; }
            }
          `}</style>

          {/* Dark mode override via class */}
          <style>{`
            .dark .wire    { stroke: #94a3b8; }
            .dark .comp    { stroke: #cbd5e1; }
            .dark .label   { fill: #94a3b8; }
            .dark .label-b { fill: #93c5fd; }
            .dark .hi      { stroke: #60a5fa; }
            .dark .arrow   { fill: #cbd5e1; }
          `}</style>

          {active === "divider" && (
            <g>
              {/* Fil gauche vertical */}
              <line x1="100" y1="30" x2="100" y2="210" className="wire" />
              {/* R1 */}
              <rect x="82" y="58" width="36" height="56" className="comp" rx="4" />
              <text x="128" y="80" className="label-b">R1</text>
              <text x="128" y="96" className="label">1 kΩ</text>
              {/* R2 */}
              <rect x="82" y="128" width="36" height="56" className="comp" rx="4" />
              <text x="128" y="150" className="label-b">R2</text>
              <text x="128" y="166" className="label">2 kΩ</text>
              {/* Fil Vout */}
              <line x1="100" y1="128" x2="240" y2="128" className="hi" />
              <circle cx="100" cy="128" r="4" fill="#2563eb" className="hi" style={{fill:"#2563eb"}}/>
              <text x="248" y="133" className="label-b">Vout</text>
              {/* Labels extremes */}
              <text x="30" y="34" className="label">Vin +</text>
              <text x="38" y="218" className="label">GND</text>
              <line x1="80" y1="210" x2="120" y2="210" className="wire" />
              <line x1="85" y1="214" x2="115" y2="214" className="wire" />
              <line x1="90" y1="218" x2="110" y2="218" className="wire" />
            </g>
          )}

          {active === "led" && (
            <g>
              {/* Fil horizontal */}
              <line x1="40" y1="120" x2="130" y2="120" className="wire" />
              {/* Résistance */}
              <rect x="130" y="104" width="60" height="32" className="comp" rx="4" />
              <text x="143" y="116" className="label-b">R</text>
              <text x="136" y="128" className="label">470 Ω</text>
              {/* Fil inter */}
              <line x1="190" y1="120" x2="260" y2="120" className="wire" />
              {/* Diode LED (triangle + barre) */}
              <polygon points="260,104 260,136 295,120" className="comp" />
              <line x1="295" y1="104" x2="295" y2="136" className="comp" />
              {/* Rayons LED */}
              <line x1="305" y1="100" x2="318" y2="88" className="hi" strokeDasharray="0" strokeWidth="1.5" />
              <line x1="312" y1="107" x2="327" y2="97" className="hi" strokeDasharray="0" strokeWidth="1.5" />
              {/* Fil fin */}
              <line x1="295" y1="120" x2="380" y2="120" className="wire" />
              {/* Labels */}
              <text x="28" y="112" className="label">Vcc</text>
              <text x="262" y="98" className="label-b">LED</text>
              <text x="335" y="114" className="label">GND</text>
              {/* GND symbol */}
              <line x1="370" y1="120" x2="390" y2="120" className="wire" />
              <line x1="373" y1="126" x2="387" y2="126" className="wire" />
              <line x1="377" y1="132" x2="383" y2="132" className="wire" />
            </g>
          )}

          {active === "npn" && (
            <g>
              {/* Corps du transistor */}
              <line x1="200" y1="60" x2="200" y2="180" className="comp" strokeWidth="3" />
              {/* Base */}
              <line x1="110" y1="120" x2="200" y2="120" className="wire" />
              {/* Collecteur */}
              <line x1="200" y1="80"  x2="310" y2="50"  className="comp" />
              {/* Émetteur avec flèche */}
              <line x1="200" y1="160" x2="310" y2="190" className="comp" />
              <polygon points="293,182 308,189 299,198" className="arrow" />
              {/* Vcc au collecteur */}
              <line x1="310" y1="50"  x2="310" y2="20"  className="wire" />
              <text x="318" y="24" className="label">Vcc</text>
              {/* GND émetteur */}
              <line x1="310" y1="190" x2="310" y2="210" className="wire" />
              <line x1="298" y1="210" x2="322" y2="210" className="wire" />
              <line x1="303" y1="215" x2="317" y2="215" className="wire" />
              <line x1="307" y1="220" x2="313" y2="220" className="wire" />
              {/* Résistance base */}
              <rect x="60" y="108" width="48" height="24" className="comp" rx="4" />
              <text x="72" y="122" className="label-b">Rb</text>
              {/* Signal entrée */}
              <line x1="20" y1="120" x2="60" y2="120" className="hi" />
              <text x="22" y="112" className="label-b">In</text>
              {/* Charge collecteur */}
              <rect x="288" y="50" width="44" height="28" className="comp" rx="4" />
              <text x="295" y="68" className="label">Rc</text>
              {/* Labels */}
              <text x="90" y="100" className="label">B</text>
              <text x="210" y="75" className="label">C</text>
              <text x="210" y="170" className="label">E</text>
              <text x="168" y="200" className="label-b">NPN</text>
            </g>
          )}
        </svg>
      </div>
    </section>
  );
}
