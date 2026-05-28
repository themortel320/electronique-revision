"use client";

import { useState } from "react";

type Section = "vocab" | "describe" | "fault" | "quiz";

const TABS: { id: Section; label: string; emoji: string }[] = [
  { id: "vocab",    label: "Vocabulary",    emoji: "📖" },
  { id: "describe", label: "Describe a circuit", emoji: "🔌" },
  { id: "fault",    label: "Fault finding", emoji: "🔍" },
  { id: "quiz",     label: "English quiz",  emoji: "✏️" },
];

// ── Vocabulary ──────────────────────────────────────────────────────────────
const VOCAB_GROUPS = [
  {
    title: "Basic components",
    items: [
      { en: "Resistor",        fr: "Résistance",           note: "limits current" },
      { en: "Capacitor",       fr: "Condensateur",         note: "stores charge" },
      { en: "Inductor / coil", fr: "Bobine",               note: "opposes current change" },
      { en: "Diode",           fr: "Diode",                note: "one-way valve for current" },
      { en: "LED",             fr: "LED",                  note: "Light Emitting Diode" },
      { en: "Transistor",      fr: "Transistor",           note: "switch or amplifier" },
      { en: "Op-amp",          fr: "Amplificateur opérationnel", note: "AOP" },
      { en: "Relay",           fr: "Relais",               note: "electrically-controlled switch" },
      { en: "Fuse",            fr: "Fusible",              note: "protection against overcurrent" },
      { en: "Switch",          fr: "Interrupteur",         note: "opens/closes a circuit" },
    ],
  },
  {
    title: "Measurements & units",
    items: [
      { en: "Voltage / Potential difference", fr: "Tension",   note: "V – volts" },
      { en: "Current",      fr: "Courant",       note: "A – amperes" },
      { en: "Resistance",   fr: "Résistance",    note: "Ω – ohms" },
      { en: "Power",        fr: "Puissance",     note: "W – watts" },
      { en: "Frequency",    fr: "Fréquence",     note: "Hz – hertz" },
      { en: "Period",       fr: "Période",       note: "s – seconds, T = 1/f" },
      { en: "Capacitance",  fr: "Capacité",      note: "F – farads (µF, nF, pF)" },
      { en: "Inductance",   fr: "Inductance",    note: "H – henrys" },
      { en: "Impedance",    fr: "Impédance",     note: "Ω – total AC resistance" },
      { en: "Gain",         fr: "Gain",          note: "dB – decibels" },
    ],
  },
  {
    title: "PCB & manufacturing",
    items: [
      { en: "Printed Circuit Board (PCB)", fr: "Circuit imprimé",  note: "" },
      { en: "Track / Trace",  fr: "Piste",           note: "copper conductor on PCB" },
      { en: "Pad",            fr: "Pastille",         note: "soldering point" },
      { en: "Via",            fr: "Via",              note: "inter-layer connection hole" },
      { en: "Solder",         fr: "Soudure / étain",  note: "metallic alloy to join parts" },
      { en: "Soldering iron",  fr: "Fer à souder",    note: "" },
      { en: "Solder mask",     fr: "Vernis épargne",  note: "protects copper tracks" },
      { en: "Silkscreen",      fr: "Sérigraphie",     note: "reference markings on PCB" },
      { en: "Through-hole (THT)", fr: "Traversant",  note: "component leg through PCB" },
      { en: "Surface Mount (SMD/CMS)", fr: "Composant monté en surface", note: "" },
      { en: "Reflow oven",     fr: "Four de refusion", note: "SMD assembly" },
      { en: "Wave soldering",  fr: "Soudure à la vague", note: "THT mass production" },
    ],
  },
  {
    title: "Test & maintenance",
    items: [
      { en: "Multimeter",         fr: "Multimètre",          note: "measures V, I, R" },
      { en: "Oscilloscope",       fr: "Oscilloscope",        note: "displays signals vs time" },
      { en: "Signal generator",   fr: "Générateur de signaux", note: "" },
      { en: "Short circuit",      fr: "Court-circuit",       note: "unintended low-resistance path" },
      { en: "Open circuit",       fr: "Circuit ouvert",      note: "broken connection" },
      { en: "Cold solder joint",  fr: "Soudure froide",      note: "poor electrical contact" },
      { en: "Fault / Failure",    fr: "Panne / Défaillance",  note: "" },
      { en: "Troubleshoot",       fr: "Dépanner",            note: "systematically find a fault" },
      { en: "Replace",            fr: "Remplacer",           note: "" },
      { en: "Test bench",         fr: "Banc de test",        note: "" },
      { en: "Grounding",          fr: "Mise à la terre",     note: "GND / Earth" },
      { en: "Datasheet",          fr: "Fiche technique",     note: "component documentation" },
    ],
  },
];

// ── Describe a circuit phrases ───────────────────────────────────────────────
const PHRASES = [
  {
    category: "Describing a component",
    examples: [
      { en: "R1 is a 470 Ω resistor connected in series with the LED.", fr: "R1 est une résistance de 470 Ω connectée en série avec la LED." },
      { en: "C1 is a 100 µF electrolytic capacitor used to filter the supply voltage.", fr: "C1 est un condensateur électrolytique de 100 µF utilisé pour filtrer la tension d'alimentation." },
      { en: "Q1 is an NPN transistor acting as a switch to drive the relay.", fr: "Q1 est un transistor NPN fonctionnant comme interrupteur pour piloter le relais." },
      { en: "The op-amp U1 is configured as a non-inverting amplifier with a gain of 10.", fr: "L'AOP U1 est configuré en amplificateur non-inverseur avec un gain de 10." },
    ],
  },
  {
    category: "Describing a connection",
    examples: [
      { en: "The output of the rectifier is connected to the input of the voltage regulator.", fr: "La sortie du redresseur est connectée à l'entrée du régulateur de tension." },
      { en: "Pin 3 of the IC is tied to ground through a 10 kΩ pull-down resistor.", fr: "La broche 3 du CI est reliée à la masse via une résistance de tirage de 10 kΩ." },
      { en: "The two capacitors are wired in parallel across the power rails.", fr: "Les deux condensateurs sont câblés en parallèle sur les rails d'alimentation." },
      { en: "The cathode of the diode is connected to the positive terminal of the battery.", fr: "La cathode de la diode est connectée à la borne positive de la batterie." },
    ],
  },
  {
    category: "Describing a measurement",
    examples: [
      { en: "I measured a voltage of 4.95 V at the output, which is within the specified tolerance.", fr: "J'ai mesuré une tension de 4,95 V en sortie, ce qui est dans la tolérance spécifiée." },
      { en: "The current drawn by the circuit is approximately 35 mA.", fr: "Le courant consommé par le circuit est d'environ 35 mA." },
      { en: "Using an oscilloscope, I observed a square wave signal at 1 kHz with an amplitude of 3.3 V.", fr: "À l'oscilloscope, j'ai observé un signal carré à 1 kHz avec une amplitude de 3,3 V." },
      { en: "The resistance between the two test points is infinite, indicating an open circuit.", fr: "La résistance entre les deux points de test est infinie, indiquant un circuit ouvert." },
    ],
  },
  {
    category: "Explaining a function",
    examples: [
      { en: "The purpose of this circuit is to regulate the output voltage to a stable 5 V.", fr: "Le rôle de ce circuit est de réguler la tension de sortie à un niveau stable de 5 V." },
      { en: "The filter removes high-frequency noise from the signal.", fr: "Le filtre supprime le bruit haute fréquence du signal." },
      { en: "This stage amplifies the sensor signal before it is processed by the microcontroller.", fr: "Cet étage amplifie le signal du capteur avant qu'il soit traité par le microcontrôleur." },
      { en: "The transistor saturates when the base voltage exceeds 0.7 V, allowing current to flow through the load.", fr: "Le transistor sature lorsque la tension de base dépasse 0,7 V, permettant au courant de traverser la charge." },
    ],
  },
];

// ── Fault finding report phrases ─────────────────────────────────────────────
const FAULT_PHRASES = [
  {
    step: "1. Observation",
    examples: [
      "The circuit does not power on.",
      "The output voltage is 0 V instead of the expected 12 V.",
      "The LED remains off even when the switch is closed.",
      "An abnormal smell / heat is coming from component R3.",
      "The signal on the oscilloscope shows excessive noise.",
    ],
  },
  {
    step: "2. Hypothesis",
    examples: [
      "The fuse may be blown.",
      "There could be a short circuit between tracks A and B.",
      "The electrolytic capacitor C2 appears to be swollen and may have failed.",
      "R5 may have drifted out of tolerance due to overheating.",
      "The solder joint on pin 4 of U1 looks suspect (cold joint).",
    ],
  },
  {
    step: "3. Tests performed",
    examples: [
      "I checked the supply voltage at TP1 using a multimeter: 0 V measured, 5 V expected → fault confirmed upstream.",
      "I measured the resistance across C2 in-circuit: 2 Ω (expected > 1 MΩ) → capacitor short-circuited.",
      "I used the continuity mode to verify track integrity between J1 pin 2 and R3 pin 1: open circuit detected.",
      "I injected a 1 kHz signal at the amplifier input and probed the output: no signal present → amplifier stage faulty.",
    ],
  },
  {
    step: "4. Conclusion & action",
    examples: [
      "The root cause is a blown fuse F1. I replaced it with a 500 mA slow-blow fuse.",
      "Capacitor C2 was short-circuited. After replacement, the circuit operates correctly.",
      "The cold solder joint on U1 pin 4 was re-soldered; the fault was resolved.",
      "R3 had drifted from 10 kΩ to 47 kΩ due to thermal stress. It was replaced and the output voltage returned to nominal.",
    ],
  },
];

// ── English quiz ─────────────────────────────────────────────────────────────
const QUIZ_QUESTIONS = [
  { q: "What does 'short circuit' mean?", options: ["Circuit ouvert", "Court-circuit", "Résistance nulle volontaire", "Signal parasite"], answer: 1, explanation: "A short circuit is an unintended low-resistance connection between two points, which can cause excessive current." },
  { q: "A resistor is used to…", options: ["Store electrical charge", "Limit the current flow", "Amplify a signal", "Convert AC to DC"], answer: 1, explanation: "A resistor limits the flow of current. R = U / I (Ohm's law)." },
  { q: "What is the unit of electrical current?", options: ["Volt (V)", "Ohm (Ω)", "Ampere (A)", "Watt (W)"], answer: 2, explanation: "Current is measured in Amperes (A). Voltage in Volts, Resistance in Ohms, Power in Watts." },
  { q: "'The LED is forward biased' means…", options: ["The LED is reversed", "The LED is correctly polarised and conducting", "The LED is short-circuited", "The LED is damaged"], answer: 1, explanation: "Forward biased means the anode is at a higher potential than the cathode — the LED can conduct and emit light." },
  { q: "What does PCB stand for?", options: ["Power Control Board", "Printed Circuit Board", "Passive Component Base", "Programmable Control Bus"], answer: 1, explanation: "PCB = Printed Circuit Board — a board with copper tracks to connect electronic components." },
  { q: "A 'cold solder joint' refers to…", options: ["A joint made with lead-free solder", "A poor quality joint with high resistance", "A joint made at low temperature on purpose", "A joint between two capacitors"], answer: 1, explanation: "A cold joint has a dull, grainy appearance and poor electrical contact. It occurs when solder didn't flow properly." },
  { q: "What does 'open circuit' mean?", options: ["The circuit is working correctly", "There is a short between GND and VCC", "The circuit path is broken — no current can flow", "The circuit is connected to ground"], answer: 2, explanation: "An open circuit is a break in the current path. Current cannot flow, so the output is typically 0 V or floating." },
  { q: "'Troubleshoot' means…", options: ["Replace all components", "Systematically find and fix a fault", "Test only the power supply", "Write a technical report"], answer: 1, explanation: "Troubleshooting is a systematic process of identifying, analysing and correcting faults in a circuit or system." },
  { q: "What is the role of a capacitor in a power supply filter?", options: ["To limit current", "To smooth out voltage ripple", "To generate AC voltage", "To protect against short circuits"], answer: 1, explanation: "A filter capacitor stores charge during peaks and releases it during troughs, smoothing the output DC voltage." },
  { q: "What does 'gain' mean for an amplifier?", options: ["The power consumed", "The ratio of output signal to input signal", "The bandwidth in Hz", "The supply voltage"], answer: 1, explanation: "Gain = Vout / Vin. For an inverting op-amp: Av = −R2/R1. Expressed in dB: Gain(dB) = 20 × log(Av)." },
];

export default function EnglishPage() {
  const [tab, setTab] = useState<Section>("vocab");
  const [search, setSearch] = useState("");
  const [flipped, setFlipped] = useState<Record<string, boolean>>({});
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizSelected, setQuizSelected] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);

  const filteredVocab = VOCAB_GROUPS.map((g) => ({
    ...g,
    items: g.items.filter(
      (item) =>
        !search ||
        item.en.toLowerCase().includes(search.toLowerCase()) ||
        item.fr.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter((g) => g.items.length > 0);

  function quizPick(i: number) {
    if (quizSelected !== null) return;
    setQuizSelected(i);
    if (i === QUIZ_QUESTIONS[quizIdx].answer) setQuizScore((s) => s + 1);
  }

  function quizNext() {
    if (quizIdx + 1 >= QUIZ_QUESTIONS.length) { setQuizDone(true); return; }
    setQuizIdx((i) => i + 1);
    setQuizSelected(null);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-xl">
            🇬🇧
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Technical English
            </h1>
            <p className="text-white/50 text-sm">
              Electronics vocabulary · Circuit description · Fault finding reports
            </p>
          </div>
        </div>
        <div className="p-3 rounded-xl bg-blue-900/20 border border-blue-700/30 text-blue-300 text-xs">
          🎯 Designed for BTS/BEP written and oral exams — learn to describe a circuit, explain a fault, and use technical vocabulary in English.
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-white/5 border border-white/10 rounded-2xl p-1 flex-wrap">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              tab === t.id ? "bg-blue-600 text-white" : "text-white/50 hover:text-white"
            }`}
          >
            {t.emoji} {t.label}
          </button>
        ))}
      </div>

      {/* ── VOCABULARY ── */}
      {tab === "vocab" && (
        <div className="space-y-6">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search a word… (English or French)"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
          {filteredVocab.map((group) => (
            <div key={group.title} className="space-y-2">
              <h3 className="text-white/60 text-xs font-semibold uppercase tracking-wider">{group.title}</h3>
              <div className="rounded-2xl border border-white/10 overflow-hidden">
                {group.items.map((item, i) => (
                  <div
                    key={item.en}
                    className={`flex items-start gap-4 px-4 py-3 cursor-pointer transition-colors hover:bg-white/5 ${i !== 0 ? "border-t border-white/5" : ""}`}
                    onClick={() => setFlipped((f) => ({ ...f, [item.en]: !f[item.en] }))}
                  >
                    <div className="flex-1">
                      <p className="text-white font-medium text-sm">{item.en}</p>
                      {item.note && <p className="text-white/30 text-xs mt-0.5 italic">{item.note}</p>}
                    </div>
                    <div className={`text-sm transition-all ${flipped[item.en] ? "text-blue-300 font-medium" : "text-white/20"}`}>
                      {flipped[item.en] ? item.fr : "→ tap to reveal"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── DESCRIBE A CIRCUIT ── */}
      {tab === "describe" && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-white/3 border border-white/8 text-sm text-white/60">
            <p className="text-white/80 font-medium mb-2">💡 How to describe a circuit in English (exam tip)</p>
            <p>Use present tense. Be precise: name the component, give its value, describe its role and connections. Always link the function to the circuit purpose.</p>
          </div>

          {PHRASES.map((group) => (
            <div key={group.category} className="space-y-3">
              <h3 className="text-blue-400 text-sm font-semibold">{group.category}</h3>
              {group.examples.map((ex, i) => (
                <div key={i} className="rounded-xl border border-white/10 bg-[#0d0d1f] p-4 space-y-2">
                  <p className="text-white text-sm font-medium leading-relaxed">🇬🇧 {ex.en}</p>
                  <p className="text-white/40 text-xs leading-relaxed">🇫🇷 {ex.fr}</p>
                </div>
              ))}
            </div>
          ))}

          {/* Model answer example */}
          <div className="rounded-2xl border border-blue-700/30 bg-blue-950/20 p-5 space-y-3">
            <p className="text-blue-300 font-semibold text-sm">📝 Full model answer — PCB fault description</p>
            <div className="space-y-2 text-sm">
              <p className="text-white/80">
                <span className="text-blue-400 font-medium">Observation: </span>
                The board does not power on. The power LED is off and no voltage is present at the output connector.
              </p>
              <p className="text-white/80">
                <span className="text-blue-400 font-medium">Tests performed: </span>
                I measured the supply voltage at TP1 (VCC rail): 0 V instead of the expected 12 V. I then checked fuse F1 using the continuity mode — no continuity was detected, confirming the fuse is blown.
              </p>
              <p className="text-white/80">
                <span className="text-blue-400 font-medium">Root cause: </span>
                Fuse F1 (500 mA) was blown, likely due to an overcurrent event. Visual inspection of the PCB revealed a solder bridge between pins 3 and 4 of connector J2, which caused a short circuit.
              </p>
              <p className="text-white/80">
                <span className="text-blue-400 font-medium">Corrective action: </span>
                The solder bridge was removed using desoldering braid. Fuse F1 was replaced with a new 500 mA slow-blow fuse. After repair, the output voltage measured 12.1 V, which is within the specified tolerance of ±5%.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── FAULT FINDING ── */}
      {tab === "fault" && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-white/3 border border-white/8 text-sm text-white/60">
            <p className="text-white/80 font-medium mb-2">🔍 Fault finding report structure (English exam)</p>
            <p>A good fault report follows 4 steps: Observe → Hypothesize → Test → Conclude. Use precise technical vocabulary and passive voice where appropriate.</p>
          </div>

          {FAULT_PHRASES.map((group) => (
            <div key={group.step} className="rounded-2xl border border-white/10 bg-[#0d0d1f] p-5 space-y-3">
              <h3 className="text-white font-bold text-sm flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-blue-900/40 border border-blue-700/30 text-blue-300 text-xs font-mono">{group.step}</span>
              </h3>
              <ul className="space-y-2">
                {group.examples.map((ex, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-white/70">
                    <span className="text-blue-400 mt-0.5 shrink-0">→</span>
                    <span className="italic">"{ex}"</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Useful connectors */}
          <div className="rounded-2xl border border-white/10 p-5 space-y-3">
            <h3 className="text-white font-bold text-sm">🔗 Useful connectors & linking words</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {[
                ["As a result", "Par conséquent"],
                ["However", "Cependant / Toutefois"],
                ["Therefore", "Donc / C'est pourquoi"],
                ["In order to", "Afin de / Pour"],
                ["Due to", "En raison de"],
                ["This indicates that", "Ceci indique que"],
                ["It was found that", "Il a été constaté que"],
                ["After replacing…", "Après avoir remplacé…"],
                ["No continuity was detected", "Aucune continuité détectée"],
                ["The measurement revealed", "La mesure a révélé"],
              ].map(([en, fr]) => (
                <div key={en} className="flex gap-2 p-2 rounded-lg bg-white/3 border border-white/8">
                  <span className="text-white font-medium shrink-0">{en}</span>
                  <span className="text-white/30">→</span>
                  <span className="text-white/50">{fr}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── QUIZ ── */}
      {tab === "quiz" && (
        <div className="space-y-4">
          {quizDone ? (
            <div className="rounded-2xl border border-white/10 bg-[#0d0d1f] p-8 text-center space-y-4">
              <div className="text-5xl">🎯</div>
              <p className="text-4xl font-extrabold text-white">{quizScore}/{QUIZ_QUESTIONS.length}</p>
              <p className="text-white/50">{Math.round((quizScore / QUIZ_QUESTIONS.length) * 100)}% correct</p>
              <button
                onClick={() => { setQuizIdx(0); setQuizSelected(null); setQuizScore(0); setQuizDone(false); }}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors"
              >
                Retry quiz
              </button>
            </div>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-[#0d0d1f] p-5 space-y-5">
              <div className="flex justify-between items-center">
                <span className="text-white/40 text-xs">Question {quizIdx + 1} / {QUIZ_QUESTIONS.length}</span>
                <span className="text-blue-400 text-xs font-medium">{quizScore} correct</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all" style={{ width: `${(quizIdx / QUIZ_QUESTIONS.length) * 100}%` }} />
              </div>
              <p className="text-white font-semibold text-lg leading-snug">{QUIZ_QUESTIONS[quizIdx].q}</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {QUIZ_QUESTIONS[quizIdx].options.map((opt, i) => {
                  let cls = "rounded-xl border px-4 py-3 text-left text-sm text-white/70 border-white/10 hover:border-blue-500/50 hover:text-white transition-all";
                  if (quizSelected !== null) {
                    if (i === QUIZ_QUESTIONS[quizIdx].answer) cls = "rounded-xl border px-4 py-3 text-left text-sm border-emerald-500/60 bg-emerald-900/20 text-emerald-300";
                    else if (i === quizSelected) cls = "rounded-xl border px-4 py-3 text-left text-sm border-red-500/40 bg-red-900/10 text-red-400";
                    else cls = "rounded-xl border px-4 py-3 text-left text-sm text-white/20 border-white/5 opacity-50";
                  }
                  return (
                    <button key={i} onClick={() => quizPick(i)} disabled={quizSelected !== null} className={cls}>
                      <span className="font-bold mr-2 text-white/30">{String.fromCharCode(65 + i)}.</span>{opt}
                    </button>
                  );
                })}
              </div>
              {quizSelected !== null && (
                <>
                  <div className={`text-sm p-3 rounded-xl border ${quizSelected === QUIZ_QUESTIONS[quizIdx].answer ? "border-emerald-700/30 bg-emerald-900/20 text-emerald-300" : "border-red-700/20 bg-red-900/10 text-red-300"}`}>
                    {QUIZ_QUESTIONS[quizIdx].explanation}
                  </div>
                  <button onClick={quizNext} className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors">
                    {quizIdx + 1 < QUIZ_QUESTIONS.length ? "Next question →" : "See results"}
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
