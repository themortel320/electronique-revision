import Link from "next/link";
import { BookOpen, Calculator, Trophy, Zap } from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Cours progressifs",
    desc: "Ohm, Kirchhoff, condensateurs, diodes, transistors — du débutant à l'intermédiaire.",
    href: "/modules",
    cta: "Voir les modules",
    iconBg: "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400",
    delay: "animate-fade-up-1",
  },
  {
    icon: Calculator,
    title: "Exercices générés",
    desc: "Exercices aléatoires avec correction détaillée étape par étape. Difficulté réglable.",
    href: "/exercises",
    cta: "S'entraîner",
    iconBg: "bg-violet-100 text-violet-600 dark:bg-violet-900/50 dark:text-violet-400",
    delay: "animate-fade-up-2",
  },
  {
    icon: Zap,
    title: "Quiz interactif",
    desc: "10 questions · feedback immédiat · explication à chaque réponse.",
    href: "/quiz",
    cta: "Lancer le quiz",
    iconBg: "bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400",
    delay: "animate-fade-up-3",
  },
  {
    icon: Trophy,
    title: "Classement",
    desc: "Retrouve ton score et compare-toi aux autres joueurs.",
    href: "/leaderboard",
    cta: "Voir le classement",
    iconBg: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400",
    delay: "animate-fade-up-4",
  },
];

const cheatSheet = [
  { label: "Loi d'Ohm",      formula: "U = R × I",               color: "text-blue-600 dark:text-blue-400"    },
  { label: "Puissance",       formula: "P = U × I",               color: "text-violet-600 dark:text-violet-400" },
  { label: "Série",           formula: "Req = R1 + R2",           color: "text-emerald-600 dark:text-emerald-400" },
  { label: "Parallèle",       formula: "1/Req = 1/R1 + 1/R2",    color: "text-rose-600 dark:text-rose-400"     },
  { label: "Diviseur",        formula: "Vout = Vin·R2/(R1+R2)",   color: "text-amber-600 dark:text-amber-400"   },
  { label: "Constante RC",    formula: "τ = R × C",               color: "text-cyan-600 dark:text-cyan-400"     },
];

export default function Home() {
  return (
    <div className="space-y-14">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white px-6 py-16 text-center dark:border-slate-700/50 dark:bg-slate-900">

        {/* Orbs flottants */}
        <div
          aria-hidden
          className="animate-float-slow animate-pulse-glow pointer-events-none absolute -left-16 -top-16 h-72 w-72 rounded-full bg-blue-400/20 blur-3xl dark:bg-blue-600/15"
        />
        <div
          aria-hidden
          className="animate-float-mid animate-pulse-glow pointer-events-none absolute -bottom-20 -right-16 h-80 w-80 rounded-full bg-violet-400/20 blur-3xl dark:bg-violet-600/15"
        />
        <div
          aria-hidden
          className="animate-float-slow pointer-events-none absolute left-1/2 top-0 h-48 w-48 -translate-x-1/2 rounded-full bg-brand-300/15 blur-2xl"
        />

        {/* Contenu */}
        <div className="relative z-10 mx-auto max-w-2xl">
          <div className="animate-fade-up mb-5 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5 text-sm font-medium text-brand-700 dark:border-brand-800 dark:bg-brand-950/60 dark:text-brand-300">
            <Zap className="h-3.5 w-3.5" />
            Plateforme éducative interactive
          </div>

          <h1 className="animate-fade-up-1 text-4xl font-extrabold leading-tight tracking-tight text-slate-900 dark:text-slate-100 md:text-5xl lg:text-6xl">
            Maîtrise les bases de<br />
            <span className="gradient-text">l'électronique</span>
          </h1>

          <p className="animate-fade-up-2 mt-5 text-base text-slate-500 dark:text-slate-400 md:text-lg">
            Cours clairs, exercices générés automatiquement, quiz interactif,
            schémas et suivi de progression — tout en un.
          </p>

          <div className="animate-fade-up-3 mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/modules"
              className="group relative overflow-hidden rounded-xl bg-brand-600 px-7 py-3 text-sm font-semibold text-white shadow-glow transition hover:bg-brand-500 active:scale-95"
            >
              <span className="shimmer pointer-events-none absolute inset-0 rounded-xl" />
              Commencer les cours
            </Link>
            <Link
              href="/quiz"
              className="rounded-xl border border-slate-300 bg-white px-7 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:border-brand-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              Tester mes connaissances
            </Link>
          </div>
        </div>
      </section>

      {/* ── Feature cards ── */}
      <section className="grid gap-4 sm:grid-cols-2">
        {features.map(({ icon: Icon, title, desc, href, cta, iconBg, delay }) => (
          <Link
            key={href}
            href={href}
            className={`card card-glow group flex flex-col gap-4 ${delay}`}
          >
            <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconBg}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h2 className="font-bold text-slate-900 dark:text-slate-100">{title}</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{desc}</p>
            </div>
            <span className="text-sm font-medium text-brand-600 transition group-hover:underline dark:text-brand-400">
              {cta} →
            </span>
          </Link>
        ))}
      </section>

      {/* ── Aide-mémoire ── */}
      <section className="rounded-2xl border border-dashed border-slate-300 bg-white/60 p-6 backdrop-blur dark:border-slate-700 dark:bg-slate-900/60">
        <p className="mb-5 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Aide-mémoire rapide
        </p>
        <div className="grid gap-2.5 sm:grid-cols-2 md:grid-cols-3">
          {cheatSheet.map(({ label, formula, color }, i) => (
            <div
              key={label}
              className="animate-fade-up flex items-center justify-between gap-2 rounded-xl border border-slate-100 bg-white px-4 py-2.5 shadow-sm transition hover:border-brand-200 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-brand-800"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <span className="text-sm text-slate-500 dark:text-slate-400">{label}</span>
              <code className={`shrink-0 font-mono text-sm font-bold ${color}`}>{formula}</code>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
