import Link from "next/link";
import {
  BookOpen, Zap, FlaskConical, Wrench, Globe,
  Target, ClipboardList, ClipboardCheck,
  BarChart2, Brain, CalendarDays, Trophy,
  ChevronRight, Gamepad2,
} from "lucide-react";

// ── Data ──────────────────────────────────────────────────────────────────────
const SECTIONS = [
  {
    id: "apprendre",
    title: "📚 Apprendre",
    subtitle: "Cours structurés avec schémas, analogies et explications pas à pas",
    color: "from-blue-600/20 to-cyan-600/10",
    border: "border-blue-700/30",
    accent: "text-blue-400",
    badge: "bg-blue-900/40 text-blue-300 border-blue-700/30",
    items: [
      {
        href: "/modules",
        icon: <Zap size={20} className="text-amber-400" />,
        label: "Électronique",
        desc: "Cours complets avec schémas SVG et explications pas à pas",
        tag: "10 modules",
        gradient: "from-amber-600 to-orange-600",
        subs: ["⚡ Lois électriques", "🔋 Composants passifs", "💡 Semi-conducteurs", "🎛️ Circuits avancés"],
      },
      {
        href: "/math",
        icon: <FlaskConical size={20} className="text-violet-400" />,
        label: "Mathématiques",
        desc: "Graphes interactifs et exercices générés par IA",
        tag: "4 modules",
        gradient: "from-violet-600 to-purple-600",
        subs: ["∂ Dérivées", "∫ Intégrales", "∑ Suites", "〜 Trigonométrie"],
      },
      {
        href: "/maintenance",
        icon: <Wrench size={20} className="text-orange-400" />,
        label: "Maintenance & Fabrication",
        desc: "Pour tes épreuves pratiques BTS / BAC Pro",
        tag: "5 modules",
        gradient: "from-orange-600 to-red-600",
        subs: ["📏 Mesure", "🔍 Diagnostic", "🔥 Soudure", "🏭 Fabrication PCB"],
      },
      {
        href: "/english",
        icon: <Globe size={20} className="text-blue-400" />,
        label: "Anglais technique",
        desc: "Vocabulaire, décrire un circuit, rédiger un rapport de panne",
        tag: "Quiz intégré",
        gradient: "from-blue-600 to-sky-600",
        subs: ["📖 Vocabulary", "🔌 Describe circuits", "🔍 Fault finding", "✏️ Quiz"],
      },
    ],
  },
  {
    id: "entrainer",
    title: "✏️ S'entraîner",
    subtitle: "Exercices, quiz et examens pour tester tes connaissances",
    color: "from-emerald-600/20 to-teal-600/10",
    border: "border-emerald-700/30",
    accent: "text-emerald-400",
    badge: "bg-emerald-900/40 text-emerald-300 border-emerald-700/30",
    items: [
      {
        href: "/exercises",
        icon: <ClipboardList size={20} className="text-emerald-400" />,
        label: "Exercices guidés",
        desc: "Calculs pas à pas, correction détaillée, niveaux facile → difficile",
        tag: "Générateur IA",
        gradient: "from-emerald-600 to-teal-600",
        subs: ["📐 Électronique", "∂ Maths", "🔧 Maintenance"],
      },
      {
        href: "/quiz",
        icon: <Target size={20} className="text-pink-400" />,
        label: "Quiz rapide",
        desc: "+300 questions par catégorie, classement mondial hebdomadaire",
        tag: "Classement",
        gradient: "from-pink-600 to-rose-600",
        subs: ["⚡ Électronique", "∂ Maths", "🔧 Pratique", "🌍 Anglais"],
      },
      {
        href: "/exam",
        icon: <ClipboardCheck size={20} className="text-red-400" />,
        label: "Mode Examen",
        desc: "Chronomètre, sans aide, bilan détaillé à la fin",
        tag: "Conditions réelles",
        gradient: "from-red-600 to-orange-600",
        subs: ["⏱️ Chronométré", "🚫 Sans aide", "📊 Bilan final"],
      },
      {
        href: "/jeux",
        icon: <Gamepad2 size={20} className="text-amber-400" />,
        label: "Code couleur",
        desc: "Apprends le code couleur des résistances en jouant",
        tag: "🎨 Jeux",
        gradient: "from-amber-500 to-yellow-600",
        subs: ["🔍 Lire les bandes", "🖊️ Encoder", "🔥 Expert"],
      },
      {
        href: "/jeux/diagnostic",
        icon: <Gamepad2 size={20} className="text-orange-400" />,
        label: "ElectroDebug",
        desc: "Joue au technicien — diagnostique une panne réelle avec l'IA",
        tag: "🔌 IA",
        gradient: "from-orange-500 to-red-600",
        subs: ["📺 8 appareils", "🎰 Roulette difficulté", "🤖 Client IA"],
      },
    ],
  },
  {
    id: "progresser",
    title: "📊 Progresser",
    subtitle: "Suis ta progression et mémorise durablement avec des outils intelligents",
    color: "from-violet-600/20 to-purple-600/10",
    border: "border-violet-700/30",
    accent: "text-violet-400",
    badge: "bg-violet-900/40 text-violet-300 border-violet-700/30",
    items: [
      {
        href: "/spaced",
        icon: <Brain size={20} className="text-indigo-400" />,
        label: "Révision espacée",
        desc: "Algorithme SM-2 (comme Anki) — mémorisation optimale sur le long terme",
        tag: "Recommandé",
        gradient: "from-indigo-600 to-violet-600",
        subs: ["🃏 Flashcards", "📅 Planning auto", "🔁 SM-2"],
      },
      {
        href: "/dashboard",
        icon: <BarChart2 size={20} className="text-violet-400" />,
        label: "Tableau de bord",
        desc: "Radar des compétences, historique, points faibles identifiés",
        tag: "Stats complètes",
        gradient: "from-violet-600 to-purple-600",
        subs: ["📡 Radar", "📋 Historique", "⚠️ Points faibles"],
      },
      {
        href: "/study",
        icon: <CalendarDays size={20} className="text-cyan-400" />,
        label: "Plan de révision",
        desc: "Programme personnalisé selon ta durée disponible et ta matière",
        tag: "Personnalisé",
        gradient: "from-cyan-600 to-blue-600",
        subs: ["📅 Programme", "🎯 Par matière", "⏳ Par durée"],
      },
    ],
  },
];

const CHEATSHEET = [
  { label: "Loi d'Ohm",      formula: "U = R × I",              color: "text-amber-400",   border: "border-amber-700/30" },
  { label: "Puissance",       formula: "P = U × I",              color: "text-blue-400",    border: "border-blue-700/30" },
  { label: "Série",           formula: "Req = R1 + R2",          color: "text-emerald-400", border: "border-emerald-700/30" },
  { label: "Parallèle",       formula: "Req = R1·R2/(R1+R2)",    color: "text-rose-400",    border: "border-rose-700/30" },
  { label: "Diviseur tension",formula: "Vout = Vin·R2/(R1+R2)", color: "text-violet-400",  border: "border-violet-700/30" },
  { label: "Constante RC",    formula: "τ = R × C",              color: "text-cyan-400",    border: "border-cyan-700/30" },
  { label: "Filtre fc",       formula: "fc = 1/(2πRC)",          color: "text-teal-400",    border: "border-teal-700/30" },
  { label: "Dérivée xⁿ",     formula: "(xⁿ)′ = n·xⁿ⁻¹",       color: "text-indigo-400",  border: "border-indigo-700/30" },
];

// ── Page ──────────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <div className="space-y-12">

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-3xl border border-white/8 bg-gradient-to-br from-[#0d0d2a] via-[#0f0f1f] to-[#0a0a1a] px-6 py-16 sm:py-20 text-center">
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-violet-600/20 blur-[80px] animate-pulse" />
          <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-blue-600/15 blur-[80px] animate-pulse" style={{ animationDelay: "1s" }} />
          <div className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)", backgroundSize: "40px 40px" }}
          />
        </div>
        <div className="relative z-10 mx-auto max-w-2xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-900/30 px-4 py-1.5 text-sm font-medium text-violet-300">
            <Zap className="h-3.5 w-3.5" />
            Plateforme de révision électronique & maths
          </div>
          <h1 className="text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            Révise<br />
            <span className="bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
              intelligemment
            </span>
          </h1>
          <p className="mt-5 text-base text-white/50 max-w-lg mx-auto">
            Cours animés · Quiz · Révision espacée · Mode examen · Classement mondial
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link href="/modules"
              className="rounded-2xl bg-gradient-to-r from-violet-600 to-blue-600 px-7 py-3 text-sm font-bold text-white shadow-lg shadow-violet-900/40 hover:scale-105 active:scale-95 transition-transform"
            >
              Commencer →
            </Link>
            <Link href="/spaced"
              className="rounded-2xl border border-white/10 bg-white/5 px-7 py-3 text-sm font-semibold text-white/70 hover:bg-white/10 hover:text-white transition-all"
            >
              🧠 Révision espacée
            </Link>
          </div>
        </div>
      </section>

      {/* ── 3 SECTIONS ────────────────────────────────────────── */}
      {SECTIONS.map((section) => (
        <section key={section.id} className={`rounded-3xl border ${section.border} bg-gradient-to-br ${section.color} p-5 sm:p-6 space-y-4`}>
          {/* Section header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">{section.title}</h2>
              <p className="text-sm text-white/40 mt-0.5">{section.subtitle}</p>
            </div>
          </div>

          {/* Items grid */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {section.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group relative flex flex-col gap-3 rounded-2xl border border-white/8 bg-[#0d0d1f]/80 hover:bg-[#0d0d1f] hover:border-white/15 p-4 transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${item.gradient} shadow shadow-black/30`}>
                    {item.icon}
                  </div>
                  <span className={`text-xs rounded-full border px-2 py-0.5 ${section.badge}`}>
                    {item.tag}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-white text-sm">{item.label}</p>
                  <p className="text-xs text-white/40 mt-1 leading-relaxed">{item.desc}</p>
                </div>
                {"subs" in item && item.subs && (
                  <div className="flex flex-wrap gap-1">
                    {item.subs.map((sub) => (
                      <span key={sub} className="text-[10px] bg-white/10 border border-white/15 rounded-md px-1.5 py-0.5 text-white/60 font-medium">
                        {sub}
                      </span>
                    ))}
                  </div>
                )}
                <div className={`flex items-center gap-1 text-xs font-medium ${section.accent} group-hover:gap-2 transition-all`}>
                  Ouvrir <ChevronRight size={12} />
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}

      {/* ── CLASSEMENT ────────────────────────────────────────── */}
      <section className="rounded-3xl border border-amber-700/30 bg-gradient-to-br from-amber-900/20 to-orange-900/10 p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow shadow-amber-900/30">
              <Trophy size={18} className="text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">🏆 Classement mondial</h2>
              <p className="text-sm text-white/40">Scores en temps réel · Reset chaque lundi</p>
            </div>
          </div>
          <Link
            href="/leaderboard"
            className="flex items-center gap-1.5 rounded-xl border border-amber-700/40 bg-amber-900/30 px-4 py-2 text-sm font-medium text-amber-300 hover:brightness-110 transition-all"
          >
            Voir le classement <ChevronRight size={13} />
          </Link>
        </div>
      </section>

      {/* ── AIDE-MÉMOIRE ──────────────────────────────────────── */}
      <section className="rounded-3xl border border-white/8 bg-white/2 p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-white">⚡ Aide-mémoire rapide</h2>
            <p className="text-xs text-white/30 mt-0.5">Les formules essentielles en un coup d&apos;œil</p>
          </div>
          <Link href="/modules" className="text-xs text-violet-400 hover:text-violet-300 transition-colors">
            Tous les cours →
          </Link>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-4">
          {CHEATSHEET.map(({ label, formula, color, border }) => (
            <div key={label}
              className={`flex items-center justify-between gap-2 rounded-xl border ${border} bg-white/3 hover:bg-white/5 px-3 py-2.5 transition-colors`}
            >
              <span className="text-xs text-white/40 truncate">{label}</span>
              <code className={`shrink-0 font-mono text-xs font-bold ${color}`}>{formula}</code>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
