"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Trophy, Zap, ChevronDown, Menu, X,
  FlaskConical, Wrench, Globe,
  Target, ClipboardList, ClipboardCheck,
  BarChart2, Brain, CalendarDays, Gamepad2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { getPseudo } from "@/lib/user";
import { loadStreak } from "@/lib/progress";
import { MiniCalculator } from "./mini-calculator";
import { NavXPBar } from "./xp-bar";

// ── Category definitions ──────────────────────────────────────────────────────
type NavItem = { href: string; label: string; desc: string; icon: React.ReactNode };

const CATEGORIES = [
  {
    id: "apprendre",
    label: "Apprendre",
    emoji: "📚",
    color: "from-blue-600 to-cyan-600",
    items: [
      { href: "/modules",     label: "Électronique", desc: "Ohm, filtres, transistors, AOP",  icon: <Zap size={15} className="text-amber-400" /> },
      { href: "/math",        label: "Mathématiques",desc: "Dérivées, intégrales, suites, trigo", icon: <FlaskConical size={15} className="text-violet-400" /> },
      { href: "/maintenance", label: "Maintenance",  desc: "Instruments, diagnostic, fabrication", icon: <Wrench size={15} className="text-orange-400" /> },
      { href: "/english",     label: "Anglais technique", desc: "Vocabulaire, rapports, descriptions", icon: <Globe size={15} className="text-blue-400" /> },
    ] as NavItem[],
  },
  {
    id: "entrainer",
    label: "S'entraîner",
    emoji: "✏️",
    color: "from-emerald-600 to-teal-600",
    items: [
      { href: "/exercises", label: "Exercices",         desc: "Calculs guidés par IA",              icon: <ClipboardList size={15} className="text-emerald-400" /> },
      { href: "/quiz",      label: "Quiz",              desc: "10 questions, classement mondial",    icon: <Target size={15} className="text-pink-400" /> },
      { href: "/exam",      label: "Mode Examen",       desc: "Chrono, sans aide, bilan détaillé",  icon: <ClipboardCheck size={15} className="text-red-400" /> },
      { href: "/jeux",       label: "🎨 Code couleur",    desc: "Jeu : résistances & bandes couleur",  icon: <Gamepad2 size={15} className="text-amber-400" /> },
      { href: "/jeux/diagnostic", label: "🔌 ElectroDebug", desc: "Diagnostic IA — répare une panne",    icon: <Gamepad2 size={15} className="text-orange-400" /> },
    ] as NavItem[],
  },
  {
    id: "progresser",
    label: "Progresser",
    emoji: "📊",
    color: "from-violet-600 to-purple-600",
    items: [
      { href: "/dashboard", label: "Dashboard",        desc: "Radar, scores, points faibles",         icon: <BarChart2 size={15} className="text-violet-400" /> },
      { href: "/spaced",    label: "Révision espacée", desc: "Algorithme SM-2 type Anki",             icon: <Brain size={15} className="text-indigo-400" /> },
      { href: "/study",     label: "Plan de révision", desc: "Programme personnalisé par durée",      icon: <CalendarDays size={15} className="text-cyan-400" /> },
    ] as NavItem[],
  },
] as const;

// ── Dropdown component ────────────────────────────────────────────────────────
function NavDropdown({ id, label, emoji, color, items, pathname }: {
  id: string; label: string; emoji: string; color: string;
  items: NavItem[]; pathname: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isActive = items.some((i) => i.href === pathname);

  useEffect(() => {
    function onClickOut(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOut);
    return () => document.removeEventListener("mousedown", onClickOut);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm transition-all whitespace-nowrap ${
          isActive
            ? "bg-violet-600/20 text-violet-300 font-medium"
            : "text-white/50 hover:text-white hover:bg-white/8"
        }`}
      >
        <span className="text-base leading-none">{emoji}</span>
        {label}
        <ChevronDown size={12} className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-2 w-64 rounded-2xl border border-white/10 bg-[#0d0d1f]/98 backdrop-blur-xl shadow-2xl shadow-black/50 p-1.5 z-50 animate-fade-up">
          <div className={`mb-1.5 px-3 py-1.5 text-xs font-semibold uppercase tracking-widest bg-gradient-to-r ${color} bg-clip-text text-transparent`}>
            {label}
          </div>
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`flex items-start gap-3 rounded-xl px-3 py-2.5 transition-all ${
                pathname === item.href
                  ? "bg-white/8 text-white"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span className="mt-0.5 shrink-0">{item.icon}</span>
              <div>
                <p className="text-sm font-medium leading-tight">{item.label}</p>
                <p className="text-xs text-white/30 mt-0.5 leading-tight">{item.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main Navbar ───────────────────────────────────────────────────────────────
export function Navbar() {
  const [pseudo, setPseudo] = useState<string | null>(null);
  const [streak, setStreak] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    setPseudo(getPseudo());
    setStreak(loadStreak().current);
  }, []);

  useEffect(() => { setMobileOpen(false); setMobileExpanded(null); }, [pathname]);

  return (
    <header className="sticky top-0 z-30 border-b border-white/8 bg-[#070d1f]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center gap-2 px-3 sm:px-4 py-2.5">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold tracking-tight text-white shrink-0 mr-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-600 shadow shadow-violet-900/50 shrink-0">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span className="hidden sm:block bg-gradient-to-r from-violet-300 to-blue-300 bg-clip-text text-transparent">
            ElectroLab
          </span>
        </Link>

        {/* Desktop Nav — dropdowns */}
        <nav className="hidden lg:flex items-center gap-0.5 flex-1">
          {CATEGORIES.map((cat) => (
            <NavDropdown key={cat.id} {...cat} pathname={pathname} />
          ))}
          <Link
            href="/leaderboard"
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm transition-all whitespace-nowrap ${
              pathname === "/leaderboard"
                ? "bg-amber-500/15 text-amber-300 font-medium"
                : "text-white/50 hover:text-white hover:bg-white/8"
            }`}
          >
            <Trophy size={13} className="text-amber-400" />
            Classement
          </Link>
        </nav>

        <div className="flex-1 lg:hidden" />

        {/* Right actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          {streak >= 2 && (
            <span className="hidden sm:flex items-center gap-1 text-xs text-orange-400 bg-orange-900/30 border border-orange-700/30 rounded-full px-2 py-0.5 shrink-0">
              🔥 {streak}
            </span>
          )}
          {pseudo && (
            <span className="hidden md:block rounded-full border border-violet-700/40 bg-violet-900/30 px-3 py-1 text-xs font-medium text-violet-300 shrink-0 max-w-[100px] truncate">
              {pseudo}
            </span>
          )}
          <NavXPBar />
          <MiniCalculator />
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="lg:hidden flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 text-white/50 hover:text-white hover:bg-white/8 shrink-0"
            aria-label="Menu"
          >
            {mobileOpen ? <X size={15} /> : <Menu size={15} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-white/8 bg-[#070d1f]/98 backdrop-blur-md divide-y divide-white/5">
          {CATEGORIES.map((cat) => (
            <div key={cat.id}>
              <button
                onClick={() => setMobileExpanded((v) => v === cat.id ? null : cat.id)}
                className="flex w-full items-center justify-between px-4 py-3 text-sm text-white/60"
              >
                <span className="flex items-center gap-2 font-medium">
                  <span>{cat.emoji}</span>{cat.label}
                </span>
                <ChevronDown size={13} className={`transition-transform ${mobileExpanded === cat.id ? "rotate-180" : ""}`} />
              </button>
              {mobileExpanded === cat.id && (
                <div className="pb-2 px-2 grid grid-cols-2 gap-1">
                  {cat.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm transition-all ${
                        pathname === item.href ? "bg-white/10 text-white" : "text-white/50 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div className="px-2 py-2">
            <Link
              href="/leaderboard"
              className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm w-full transition-all ${
                pathname === "/leaderboard" ? "bg-amber-500/15 text-amber-300" : "text-white/50 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Trophy size={14} className="text-amber-400" />
              🏆 Classement
            </Link>
          </div>
          {(pseudo || streak >= 2) && (
            <div className="flex items-center justify-between px-4 py-2">
              {pseudo && <span className="text-xs text-violet-300 font-medium">{pseudo}</span>}
              {streak >= 2 && <span className="text-xs text-orange-400">🔥 {streak} jours</span>}
            </div>
          )}
        </div>
      )}
    </header>
  );
}
