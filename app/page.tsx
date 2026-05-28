import Link from "next/link";
import {
  BookOpen, Calculator, Trophy, Zap, Bot, FlaskConical,
  GraduationCap, LayoutDashboard, ClipboardCheck, Brain,
} from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Cours progressifs",
    desc: "Ohm, Kirchhoff, filtres, AOP, transistors — électronique et maths.",
    href: "/modules",
    cta: "Voir les modules",
    gradient: "from-blue-600 to-cyan-500",
    glow: "shadow-blue-900/30",
    border: "border-blue-700/30",
    bg: "from-blue-900/20 to-cyan-900/10",
  },
  {
    icon: Bot,
    title: "Professeur IA",
    desc: "Pose n'importe quelle question, le Professeur IA répond en contexte.",
    href: "/exercises",
    cta: "Exercices GPT",
    gradient: "from-violet-600 to-purple-500",
    glow: "shadow-violet-900/30",
    border: "border-violet-700/30",
    bg: "from-violet-900/20 to-purple-900/10",
  },
  {
    icon: Calculator,
    title: "Exercices variés",
    desc: "Classiques ou générés par IA — QCM, calcul, vrai/faux, défis.",
    href: "/exercises",
    cta: "S'entraîner",
    gradient: "from-emerald-600 to-teal-500",
    glow: "shadow-emerald-900/30",
    border: "border-emerald-700/30",
    bg: "from-emerald-900/20 to-teal-900/10",
  },
  {
    icon: FlaskConical,
    title: "Graphes interactifs",
    desc: "Courbe de dérivée avec tangente animée, diagramme de Bode.",
    href: "/math",
    cta: "Explorer",
    gradient: "from-orange-600 to-amber-500",
    glow: "shadow-orange-900/30",
    border: "border-orange-700/30",
    bg: "from-orange-900/20 to-amber-900/10",
  },
  {
    icon: LayoutDashboard,
    title: "Dashboard",
    desc: "Radar de compétences, score global, points faibles identifiés.",
    href: "/dashboard",
    cta: "Ma progression",
    gradient: "from-pink-600 to-rose-500",
    glow: "shadow-pink-900/30",
    border: "border-pink-700/30",
    bg: "from-pink-900/20 to-rose-900/10",
  },
  {
    icon: ClipboardCheck,
    title: "Mode Examen",
    desc: "Timer, sans indices, score final avec bilan détaillé.",
    href: "/exam",
    cta: "Passer l'examen",
    gradient: "from-red-600 to-orange-500",
    glow: "shadow-red-900/30",
    border: "border-red-700/30",
    bg: "from-red-900/20 to-orange-900/10",
  },
];

const cheatSheet = [
  { label: "Loi d'Ohm",    formula: "U = R × I",            color: "text-blue-400",    bg: "bg-blue-900/20 border-blue-700/30" },
  { label: "Puissance",     formula: "P = U × I",            color: "text-violet-400",  bg: "bg-violet-900/20 border-violet-700/30" },
  { label: "Série",         formula: "Req = R1 + R2",        color: "text-emerald-400", bg: "bg-emerald-900/20 border-emerald-700/30" },
  { label: "Parallèle",     formula: "1/Req = 1/R1+1/R2",   color: "text-rose-400",    bg: "bg-rose-900/20 border-rose-700/30" },
  { label: "Diviseur",      formula: "Vout=Vin·R2/(R1+R2)", color: "text-amber-400",   bg: "bg-amber-900/20 border-amber-700/30" },
  { label: "Constante RC",  formula: "τ = R × C",            color: "text-cyan-400",    bg: "bg-cyan-900/20 border-cyan-700/30" },
  { label: "Dérivée xⁿ",   formula: "(xⁿ)′ = n·xⁿ⁻¹",     color: "text-indigo-400",  bg: "bg-indigo-900/20 border-indigo-700/30" },
  { label: "Intégrale",     formula: "∫xⁿdx = xⁿ⁺¹/(n+1)", color: "text-teal-400",    bg: "bg-teal-900/20 border-teal-700/30" },
  { label: "AOP inverseur", formula: "Av = −R2/R1",         color: "text-pink-400",    bg: "bg-pink-900/20 border-pink-700/30" },
];

const stats = [
  { value: "10+", label: "Modules de cours", icon: "📚" },
  { value: "∞",   label: "Exercices IA",     icon: "🤖" },
  { value: "6",   label: "Graphes interactifs", icon: "📈" },
  { value: "100%",label: "Gratuit",          icon: "🎁" },
];

export default function Home() {
  return (
    <div className="space-y-16">

      {/* ══ HERO ══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden rounded-3xl border border-white/8 bg-gradient-to-br from-[#0d0d2a] via-[#0f0f1f] to-[#0a0a1a] px-6 py-20 text-center">

        {/* Background orbs */}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="animate-float-slow animate-pulse-glow absolute -left-24 -top-24 h-96 w-96 rounded-full bg-violet-600/20 blur-[80px]" />
          <div className="animate-float-mid  animate-pulse-glow absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-blue-600/20 blur-[80px]" />
          <div className="animate-float-fast absolute left-1/2 top-1/4 h-64 w-64 -translate-x-1/2 rounded-full bg-cyan-600/10 blur-[60px]" />
          {/* Grid overlay */}
          <div className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "40px 40px" }}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-3xl">
          {/* Badge */}
          <div className="animate-fade-up mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-900/30 px-4 py-2 text-sm font-medium text-violet-300">
            <Brain className="h-4 w-4 text-violet-400" />
            Plateforme IA d'apprentissage
            <span className="ml-1 rounded-full bg-violet-500/20 px-2 py-0.5 text-xs text-violet-400">v2</span>
          </div>

          <h1 className="animate-fade-up-1 text-5xl font-black leading-tight tracking-tight text-white md:text-6xl lg:text-7xl">
            Maîtrise<br />
            <span className="gradient-text">l'électronique</span><br />
            <span className="text-white/70 text-4xl md:text-5xl font-bold">& les maths</span>
          </h1>

          <p className="animate-fade-up-2 mt-6 text-base text-white/50 md:text-lg max-w-xl mx-auto">
            Cours interactifs · Exercices générés par IA · Professeur IA · 
            Graphes dynamiques · Mode examen · Dashboard de progression
          </p>

          <div className="animate-fade-up-3 mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/modules"
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 to-blue-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-900/40 transition hover:shadow-violet-700/50 hover:scale-105 active:scale-95"
            >
              <span className="shimmer pointer-events-none absolute inset-0 rounded-2xl" />
              🚀 Commencer maintenant
            </Link>
            <Link
              href="/exam"
              className="rounded-2xl border border-white/10 bg-white/5 px-8 py-3.5 text-sm font-semibold text-white/80 transition hover:bg-white/10 hover:text-white hover:border-white/20 active:scale-95"
            >
              📝 Mode Examen
            </Link>
          </div>
        </div>
      </section>

      {/* ══ STATS BAR ══════════════════════════════════════════ */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map(({ value, label, icon }, i) => (
          <div
            key={label}
            className="animate-fade-up rounded-2xl border border-white/8 bg-white/3 p-4 text-center"
            style={{ animationDelay: `${i * 0.07}s` }}
          >
            <div className="text-2xl mb-1">{icon}</div>
            <div className="text-2xl font-black bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
              {value}
            </div>
            <div className="text-xs text-white/40 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* ══ FEATURE CARDS ════════════════════════════════════════ */}
      <section>
        <p className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-5 text-center">
          Tout ce qu'il te faut
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, desc, href, cta, gradient, glow, border, bg }, i) => (
            <Link
              key={href + title}
              href={href}
              className={`animate-fade-up group relative overflow-hidden rounded-2xl border ${border} bg-gradient-to-br ${bg} p-5 flex flex-col gap-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${glow} hover:border-white/20`}
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} shadow-lg shadow-black/30`}>
                <Icon className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="font-bold text-white">{title}</h2>
                <p className="mt-1 text-sm text-white/50 leading-relaxed">{desc}</p>
              </div>
              <span className={`text-sm font-medium bg-gradient-to-r ${gradient} bg-clip-text text-transparent group-hover:underline`}>
                {cta} →
              </span>
              {/* Hover glow */}
              <div className={`pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
            </Link>
          ))}
        </div>
      </section>

      {/* ══ CHEAT SHEET ════════════════════════════════════════════ */}
      <section className="rounded-3xl border border-white/8 bg-white/2 p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10" />
          <p className="text-xs font-semibold uppercase tracking-widest text-white/30">
            Aide-mémoire rapide
          </p>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10" />
        </div>
        <div className="grid gap-2.5 sm:grid-cols-2 md:grid-cols-3">
          {cheatSheet.map(({ label, formula, color, bg }, i) => (
            <div
              key={label}
              className={`animate-fade-up flex items-center justify-between gap-2 rounded-xl border ${bg} px-4 py-3 transition-all hover:-translate-y-0.5 hover:shadow-md`}
              style={{ animationDelay: `${i * 0.04}s` }}
            >
              <span className="text-sm text-white/50">{label}</span>
              <code className={`shrink-0 font-mono text-sm font-bold ${color}`}>{formula}</code>
            </div>
          ))}
        </div>
        <div className="mt-5 text-center">
          <Link href="/modules" className="text-sm text-violet-400 hover:text-violet-300 transition-colors">
            Voir tous les cours avec formules détaillées →
          </Link>
        </div>
      </section>

      {/* ══ CTA BOTTOM ════════════════════════════════════════════ */}
      <section className="rounded-3xl border border-violet-700/30 bg-gradient-to-r from-violet-900/30 via-blue-900/20 to-violet-900/30 p-8 text-center relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/4 top-0 h-40 w-40 rounded-full bg-violet-500/10 blur-3xl" />
          <div className="absolute right-1/4 bottom-0 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl" />
        </div>
        <div className="relative z-10">
          <GraduationCap className="mx-auto mb-3 h-10 w-10 text-violet-400" />
          <h2 className="text-2xl font-black text-white mb-2">Prêt à progresser ?</h2>
          <p className="text-white/50 text-sm mb-6 max-w-md mx-auto">
            Commence par un module de cours ou lance directement un défi avec le Professeur IA.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/modules" className="rounded-2xl bg-violet-600 hover:bg-violet-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:scale-105 active:scale-95">
              📚 Cours électronique
            </Link>
            <Link href="/math" className="rounded-2xl bg-blue-600 hover:bg-blue-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:scale-105 active:scale-95">
              ∂ Cours maths
            </Link>
            <Link href="/study" className="rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 px-6 py-2.5 text-sm font-semibold text-white/70 hover:text-white transition active:scale-95">
              📅 Plan de révision
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
