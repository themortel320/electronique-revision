"use client";

// ── Shared drawing helpers ────────────────────────────────────────────────────
const W = "#c9d1ff"; // wire color
const C = "#a78bfa"; // component highlight
const T = "#e2e8f0"; // text color
const DIM = "#64748b"; // dim label

function Wire({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={W} strokeWidth={2} strokeLinecap="round" />;
}

function Battery({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <line x1={x} y1={y - 12} x2={x} y2={y + 12} stroke={C} strokeWidth={4} />
      <line x1={x} y1={y - 6} x2={x} y2={y + 6} stroke={C} strokeWidth={2} />
      <text x={x + 8} y={y - 4} fill={T} fontSize={10} fontWeight="bold">+</text>
      <text x={x + 8} y={y + 10} fill={DIM} fontSize={10}>−</text>
      <text x={x - 22} y={y + 4} fill={DIM} fontSize={9} textAnchor="middle">E</text>
    </g>
  );
}

function Resistor({ x, y, label, vertical = false }: { x: number; y: number; label?: string; vertical?: boolean }) {
  const w = 30, h = 12;
  return (
    <g transform={vertical ? `rotate(90, ${x}, ${y})` : ""}>
      <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={3}
        fill="#1e1b4b" stroke={C} strokeWidth={1.5} />
      <text x={x} y={vertical ? y + 18 : y - 16} fill={T} fontSize={9} textAnchor="middle">{label}</text>
    </g>
  );
}

function Capacitor({ x, y, label }: { x: number; y: number; label?: string }) {
  return (
    <g>
      <line x1={x - 8} y1={y - 10} x2={x - 8} y2={y + 10} stroke={C} strokeWidth={2.5} />
      <line x1={x + 8} y1={y - 10} x2={x + 8} y2={y + 10} stroke={C} strokeWidth={2.5} />
      <text x={x} y={y - 18} fill={T} fontSize={9} textAnchor="middle">{label}</text>
    </g>
  );
}

function LED({ x, y }: { x: number; y: number }) {
  return (
    <g>
      {/* Triangle (anode side) */}
      <polygon points={`${x - 8},${y - 8} ${x - 8},${y + 8} ${x + 8},${y}`}
        fill="#fbbf24" stroke="#fbbf24" strokeWidth={1} opacity={0.9} />
      {/* Bar (cathode) */}
      <line x1={x + 8} y1={y - 8} x2={x + 8} y2={y + 8} stroke="#fbbf24" strokeWidth={2} />
      {/* Light rays */}
      <line x1={x + 12} y1={y - 10} x2={x + 18} y2={y - 16} stroke="#fde68a" strokeWidth={1.5} />
      <line x1={x + 14} y1={y - 4} x2={x + 21} y2={y - 8} stroke="#fde68a" strokeWidth={1.5} />
      <text x={x} y={y + 22} fill={T} fontSize={9} textAnchor="middle">LED</text>
    </g>
  );
}

function Diode({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <polygon points={`${x - 8},${y - 8} ${x - 8},${y + 8} ${x + 8},${y}`}
        fill="#7c3aed" stroke={C} strokeWidth={1.5} />
      <line x1={x + 8} y1={y - 8} x2={x + 8} y2={y + 8} stroke={C} strokeWidth={2} />
      <text x={x} y={y + 22} fill={DIM} fontSize={9} textAnchor="middle">A → K</text>
    </g>
  );
}

function Ground({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <line x1={x - 10} y1={y} x2={x + 10} y2={y} stroke={DIM} strokeWidth={2} />
      <line x1={x - 6} y1={y + 4} x2={x + 6} y2={y + 4} stroke={DIM} strokeWidth={2} />
      <line x1={x - 2} y1={y + 8} x2={x + 2} y2={y + 8} stroke={DIM} strokeWidth={2} />
    </g>
  );
}

function Label({ x, y, text, color = T, size = 10 }: { x: number; y: number; text: string; color?: string; size?: number }) {
  return <text x={x} y={y} fill={color} fontSize={size} textAnchor="middle">{text}</text>;
}

// ── DIAGRAM 1 : Loi d'Ohm — circuit basique ───────────────────────────────────
export function DiagramOhm() {
  return (
    <svg viewBox="0 0 320 160" className="w-full max-w-sm mx-auto" role="img" aria-label="Circuit loi d'Ohm">
      {/* Top wire */}
      <Wire x1={30} y1={30} x2={290} y2={30} />
      {/* Bottom wire */}
      <Wire x1={30} y1={130} x2={290} y2={130} />
      {/* Left wire */}
      <Wire x1={30} y1={30} x2={30} y2={130} />
      {/* Right wire */}
      <Wire x1={290} y1={30} x2={290} y2={130} />

      {/* Battery left */}
      <Battery x={30} y={80} />
      <Label x={30} y={155} text="12 V" color={C} />

      {/* Resistor top center */}
      <Resistor x={160} y={30} label="R = 470 Ω" />

      {/* Labels */}
      <Label x={160} y={155} text="I = U/R = 12/470 ≈ 25 mA" color={T} size={9} />

      {/* Arrow showing current */}
      <polygon points="200,24 215,30 200,36" fill="#a78bfa" opacity={0.7} />
      <Label x={220} y={18} text="I →" color={C} size={9} />

      {/* U annotation */}
      <line x1={15} y1={40} x2={15} y2={120} stroke={C} strokeWidth={1} strokeDasharray="3,3" />
      <polygon points="11,42 15,30 19,42" fill={C} opacity={0.7} />
      <polygon points="11,118 15,130 19,118" fill={C} opacity={0.7} />
      <Label x={5} y={82} text="U" color={C} size={11} />
    </svg>
  );
}

// ── DIAGRAM 2 : Résistances série ─────────────────────────────────────────────
export function DiagramSeries() {
  return (
    <svg viewBox="0 0 360 160" className="w-full max-w-sm mx-auto" role="img" aria-label="Résistances série">
      <Wire x1={20} y1={30} x2={340} y2={30} />
      <Wire x1={20} y1={130} x2={340} y2={130} />
      <Wire x1={20} y1={30} x2={20} y2={130} />
      <Wire x1={340} y1={30} x2={340} y2={130} />
      <Battery x={20} y={80} />

      <Resistor x={120} y={30} label="R1 = 100 Ω" />
      <Resistor x={230} y={30} label="R2 = 200 Ω" />

      {/* Same current arrow */}
      <polygon points="170,24 185,30 170,36" fill="#a78bfa" opacity={0.8} />
      <polygon points="275,24 290,30 275,36" fill="#a78bfa" opacity={0.8} />

      <Label x={180} y={155} text="Req = R1 + R2 = 300 Ω · Même courant partout" color={T} size={9} />
      <Label x={180} y={110} text="← même I →" color={DIM} size={9} />
    </svg>
  );
}

// ── DIAGRAM 3 : Résistances parallèle ────────────────────────────────────────
export function DiagramParallel() {
  return (
    <svg viewBox="0 0 340 200" className="w-full max-w-sm mx-auto" role="img" aria-label="Résistances parallèle">
      {/* Main top/bottom rails */}
      <Wire x1={20} y1={30} x2={310} y2={30} />
      <Wire x1={20} y1={170} x2={310} y2={170} />
      <Wire x1={20} y1={30} x2={20} y2={170} />
      <Wire x1={310} y1={30} x2={310} y2={170} />
      <Battery x={20} y={100} />

      {/* Branch 1 */}
      <Wire x1={120} y1={30} x2={120} y2={65} />
      <Resistor x={120} y={90} label="R1" vertical={true} />
      <Wire x1={120} y1={120} x2={120} y2={170} />

      {/* Branch 2 */}
      <Wire x1={220} y1={30} x2={220} y2={65} />
      <Resistor x={220} y={90} label="R2" vertical={true} />
      <Wire x1={220} y1={120} x2={220} y2={170} />

      {/* Labels */}
      <Label x={120} y={15} text="I1" color="#34d399" size={10} />
      <Label x={220} y={15} text="I2" color="#60a5fa" size={10} />
      <Label x={170} y={195} text="Req = (R1×R2)/(R1+R2)  ·  Même tension aux bornes" color={T} size={9} />
      <Label x={170} y={180} text="I total = I1 + I2" color={DIM} size={9} />
    </svg>
  );
}

// ── DIAGRAM 4 : Circuit LED ───────────────────────────────────────────────────
export function DiagramLED() {
  return (
    <svg viewBox="0 0 340 160" className="w-full max-w-sm mx-auto" role="img" aria-label="Circuit LED">
      <Wire x1={30} y1={30} x2={300} y2={30} />
      <Wire x1={30} y1={130} x2={300} y2={130} />
      <Wire x1={30} y1={30} x2={30} y2={130} />
      <Wire x1={300} y1={30} x2={300} y2={130} />
      <Battery x={30} y={80} />
      <Label x={30} y={150} text="5 V" color={C} size={9} />

      <Resistor x={130} y={30} label="R = 150 Ω" />
      <LED x={230} y={30} />

      <Label x={170} y={155} text="R = (Vcc−Vf)/I = (5−2)/0.02 = 150 Ω" color={T} size={9} />
    </svg>
  );
}

// ── DIAGRAM 5 : Circuit RC (charge) ──────────────────────────────────────────
export function DiagramRC() {
  return (
    <svg viewBox="0 0 340 200" className="w-full max-w-sm mx-auto" role="img" aria-label="Circuit RC">
      {/* Circuit */}
      <Wire x1={30} y1={30} x2={300} y2={30} />
      <Wire x1={30} y1={170} x2={300} y2={170} />
      <Wire x1={30} y1={30} x2={30} y2={170} />
      <Wire x1={300} y1={30} x2={300} y2={170} />
      <Battery x={30} y={100} />
      <Label x={30} y={190} text="E" color={C} size={9} />

      <Resistor x={140} y={30} label="R" />
      <Wire x1={230} y1={30} x2={230} y2={55} />
      <Capacitor x={230} y={80} label="C" />
      <Wire x1={230} y1={110} x2={230} y2={170} />

      {/* Tension Uc arrow */}
      <line x1={250} y1={60} x2={250} y2={120} stroke="#60a5fa" strokeWidth={1.5} strokeDasharray="4,3" />
      <polygon points="246,62 250,50 254,62" fill="#60a5fa" opacity={0.8} />
      <polygon points="246,118 250,130 254,118" fill="#60a5fa" opacity={0.8} />
      <Label x={272} y={92} text="Uc(t)" color="#60a5fa" size={10} />

      {/* Curve hint */}
      <path d="M 40 175 Q 80 165 120 158 Q 160 148 190 143 Q 220 140 260 138" stroke="#a78bfa" strokeWidth={1.5} fill="none" strokeDasharray="3,2" />
      <Label x={180} y={195} text="Uc(t) = E·(1−e^(−t/RC))   τ = R×C" color={T} size={9} />
    </svg>
  );
}

// ── DIAGRAM 6 : Transistor NPN commutation ───────────────────────────────────
export function DiagramTransistor() {
  return (
    <svg viewBox="0 0 300 220" className="w-full max-w-sm mx-auto" role="img" aria-label="Transistor NPN commutation">
      {/* VCC */}
      <Label x={180} y={15} text="VCC" color={C} size={10} />
      <Wire x1={180} y1={18} x2={180} y2={50} />

      {/* Collector load (LED/relay) */}
      <Resistor x={180} y={70} label="Rc" vertical={true} />
      <Wire x1={180} y1={95} x2={180} y2={120} />

      {/* Transistor body */}
      <circle cx={180} cy={140} r={22} fill="#1e1b4b" stroke={C} strokeWidth={1.5} />
      <Label x={180} y={144} text="NPN" color={T} size={9} />

      {/* Collector */}
      <Wire x1={180} y1={118} x2={180} y2={130} />
      {/* Emitter */}
      <Wire x1={180} y1={150} x2={180} y2={190} />
      <Ground x={180} y={200} />

      {/* Base */}
      <Wire x1={158} y1={140} x2={80} y2={140} />
      <Resistor x={55} y={140} label="Rb" vertical={false} />
      <Wire x1={30} y1={140} x2={20} y2={140} />
      <Label x={10} y={140} text="Vcmd" color="#34d399" size={9} />

      {/* Labels */}
      <Label x={200} y={135} text="C" color={DIM} size={10} />
      <Label x={200} y={158} text="E" color={DIM} size={10} />
      <Label x={165} y={155} text="B" color={DIM} size={10} />

      <Label x={150} y={215} text="Ib commande Ic = β×Ib" color={T} size={9} />
    </svg>
  );
}

// ── DIAGRAM 7 : AOP non-inverseur ─────────────────────────────────────────────
export function DiagramOpAmp() {
  return (
    <svg viewBox="0 0 340 180" className="w-full max-w-sm mx-auto" role="img" aria-label="AOP non-inverseur">
      {/* AOP triangle */}
      <polygon points="140,50 140,140 220,95" fill="#1e1b4b" stroke={C} strokeWidth={1.5} />
      <Label x={175} y={98} text="AOP" color={T} size={9} />

      {/* V+ input */}
      <Wire x1={30} y1={75} x2={140} y2={75} />
      <Label x={15} y={78} text="Vin" color="#34d399" size={10} />
      <Label x={130} y={70} text="+" color="#34d399" size={12} />

      {/* V− input / R1 feedback */}
      <Label x={130} y={120} text="−" color="#f87171" size={12} />
      <Wire x1={140} y1={112} x2={100} y2={112} />
      <Wire x1={100} y1={112} x2={100} y2={155} />

      {/* R1 to GND */}
      <Resistor x={100} y={155} label="R1" vertical={true} />
      <Wire x1={100} y1={173} x2={100} y2={178} />
      <Ground x={100} y={178} />

      {/* R2 feedback */}
      <Wire x1={100} y1={112} x2={100} y2={95} />
      <Wire x1={100} y1={95} x2={270} y2={95} />
      <Resistor x={185} y={95} label="R2" />

      {/* Output */}
      <Wire x1={220} y1={95} x2={310} y2={95} />
      <Label x={320} y={98} text="Vout" color={C} size={10} />

      <Label x={170} y={175} text="Av = 1 + R2/R1   Vout = Av × Vin" color={T} size={9} />
    </svg>
  );
}

// ── DIAGRAM 8 : Filtre RC passe-bas ──────────────────────────────────────────
export function DiagramFilterRC() {
  return (
    <svg viewBox="0 0 340 180" className="w-full max-w-sm mx-auto" role="img" aria-label="Filtre RC passe-bas">
      {/* Input */}
      <Label x={20} y={78} text="Vin" color="#34d399" size={10} />
      <Wire x1={35} y1={75} x2={80} y2={75} />

      {/* Resistor */}
      <Resistor x={115} y={75} label="R" />
      <Wire x1={150} y1={75} x2={190} y2={75} />

      {/* Node point */}
      <circle cx={190} cy={75} r={4} fill={C} />

      {/* Capacitor to ground */}
      <Wire x1={190} y1={75} x2={190} y2={100} />
      <Capacitor x={190} y={120} label="C" />
      <Wire x1={190} y1={140} x2={190} y2={155} />
      <Ground x={190} y={155} />

      {/* Output */}
      <Wire x1={190} y1={75} x2={290} y2={75} />
      <Label x={310} y={78} text="Vout" color={C} size={10} />

      {/* Bode hint */}
      <path d="M 50 160 L 130 160 Q 165 160 180 145 L 230 110" stroke="#a78bfa" strokeWidth={2} fill="none" />
      <Label x={50} y={175} text="fc" color={DIM} size={9} />
      <line x1={50} y1={162} x2={50} y2={170} stroke={DIM} strokeWidth={1} />

      <Label x={170} y={175} text="fc = 1/(2π·R·C)   −20 dB/décade" color={T} size={9} />
    </svg>
  );
}

// ── DIAGRAM 9 : Diviseur de tension ──────────────────────────────────────────
export function DiagramDivider() {
  return (
    <svg viewBox="0 0 260 220" className="w-full max-w-xs mx-auto" role="img" aria-label="Diviseur de tension">
      {/* Top */}
      <Label x={130} y={18} text="Vin" color={C} size={11} />
      <Wire x1={130} y1={22} x2={130} y2={50} />

      {/* R1 */}
      <Resistor x={130} y={75} label="R1" vertical={true} />
      <Wire x1={130} y1={100} x2={130} y2={120} />

      {/* Node */}
      <circle cx={130} cy={120} r={4} fill="#34d399" />
      <Wire x1={130} y1={120} x2={210} y2={120} />
      <Label x={225} y={123} text="Vout" color="#34d399" size={10} />

      {/* R2 */}
      <Resistor x={130} y={148} label="R2" vertical={true} />
      <Wire x1={130} y1={172} x2={130} y2={192} />
      <Ground x={130} y={195} />

      <Label x={130} y={215} text="Vout = Vin × R2 / (R1 + R2)" color={T} size={9} />
    </svg>
  );
}

// ── DIAGRAM 10 : Diode Zener régulateur ──────────────────────────────────────
export function DiagramZener() {
  return (
    <svg viewBox="0 0 300 180" className="w-full max-w-sm mx-auto" role="img" aria-label="Diode Zener régulation">
      {/* Vin */}
      <Label x={20} y={65} text="Vin" color={C} size={10} />
      <Wire x1={35} y1={62} x2={80} y2={62} />

      {/* R série */}
      <Resistor x={115} y={62} label="R" />
      <Wire x1={150} y1={62} x2={200} y2={62} />

      {/* Node */}
      <circle cx={200} cy={62} r={4} fill="#34d399" />
      <Wire x1={200} y1={62} x2={270} y2={62} />
      <Label x={285} y={65} text="Vout" color="#34d399" size={9} />

      {/* Zener (vertical, inversée) */}
      <Wire x1={200} y1={62} x2={200} y2={90} />
      <polygon points={`192,107 208,107 200,90`} fill="#7c3aed" stroke={C} strokeWidth={1.5} />
      <line x1={192} y1={107} x2={208} y2={107} stroke={C} strokeWidth={2} />
      {/* Zener ticks */}
      <line x1={192} y1={107} x2={186} y2={113} stroke={C} strokeWidth={2} />
      <line x1={208} y1={107} x2={214} y2={101} stroke={C} strokeWidth={2} />
      <Wire x1={200} y1={110} x2={200} y2={145} />
      <Ground x={200} y={148} />

      <Label x={225} y={100} text="Vz" color={C} size={10} />
      <Label x={150} y={170} text="Vout ≈ Vz (tension constante)" color={T} size={9} />
    </svg>
  );
}

// ── Registry ──────────────────────────────────────────────────────────────────
export const DIAGRAMS: Record<string, React.FC> = {
  ohm:         DiagramOhm,
  series:      DiagramSeries,
  parallel:    DiagramParallel,
  divider:     DiagramDivider,
  led:         DiagramLED,
  rc:          DiagramRC,
  transistor:  DiagramTransistor,
  "op-amp":    DiagramOpAmp,
  "rc-filter": DiagramFilterRC,
  zener:       DiagramZener,
};
