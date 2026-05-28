"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Moon, Sun, Trophy, Zap, LayoutDashboard,
  ClipboardCheck, Menu, X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getPseudo } from "@/lib/user";
import { loadStreak } from "@/lib/progress";
import { MiniCalculator } from "./mini-calculator";

const links = [
  { href: "/study",     label: "📅 Plan" },
  { href: "/modules",   label: "Cours" },
  { href: "/math",      label: "∂ Maths" },
  { href: "/exercises", label: "Exercices" },
  { href: "/quiz",      label: "Quiz" },
  { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={13} /> },
  { href: "/exam",      label: "Examen",    icon: <ClipboardCheck size={13} /> },
];

export function Navbar() {
  const [dark, setDark] = useState(false);
  const [pseudo, setPseudo] = useState<string | null>(null);
  const [streak, setStreak] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const isDark = window.localStorage.getItem("theme") === "dark";
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
    setPseudo(getPseudo());
    setStreak(loadStreak().current);
  }, []);

  /* Close mobile menu on route change */
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const toggle = () => {
    document.documentElement.classList.add("theme-transitioning");
    setTimeout(() => document.documentElement.classList.remove("theme-transitioning"), 500);
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    window.localStorage.setItem("theme", next ? "dark" : "light");
  };

  const linkClass = (href: string) => {
    const active = pathname === href;
    return `flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm transition-all whitespace-nowrap ${
      active
        ? "bg-violet-600/20 text-violet-300 font-medium"
        : "text-white/50 hover:text-white hover:bg-white/8"
    }`;
  };

  return (
    <header className="sticky top-0 z-30 border-b border-white/8 bg-[#070d1f]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center gap-2 px-3 sm:px-4 py-2.5">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold tracking-tight text-white shrink-0 mr-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-600 shadow shadow-violet-900/50 shrink-0">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span className="hidden sm:block bg-gradient-to-r from-violet-300 to-blue-300 bg-clip-text text-transparent">
            ElectroLab
          </span>
        </Link>

        {/* Desktop Nav — scrollable on medium screens */}
        <nav className="hidden lg:flex items-center gap-0.5 flex-1 overflow-x-auto no-scrollbar">
          {links.map(({ href, label, icon }) => (
            <Link key={href} href={href} className={linkClass(href)}>
              {icon}
              {label}
            </Link>
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

        {/* Spacer on desktop when no nav */}
        <div className="flex-1 lg:hidden" />

        {/* Right-side actions */}
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

          {/* Calculator — always visible */}
          <MiniCalculator />

          {/* Theme toggle */}
          <button
            onClick={toggle}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 text-white/50 transition hover:bg-white/8 hover:text-white shrink-0"
            aria-label="Changer le thème"
          >
            {dark ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          {/* Mobile menu toggle */}
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
        <div className="lg:hidden border-t border-white/8 bg-[#070d1f]/98 backdrop-blur-md">
          <nav className="px-3 py-3 grid grid-cols-2 gap-1">
            {[...links, { href: "/leaderboard", label: "🏆 Classement", icon: undefined }].map(
              ({ href, label, icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={
                    linkClass(href) +
                    " py-3 justify-start text-base"
                  }
                >
                  {icon}
                  {label}
                </Link>
              )
            )}
          </nav>

          {/* Mobile bottom strip */}
          <div className="flex items-center justify-between px-4 py-2 border-t border-white/8">
            {pseudo && (
              <span className="text-xs text-violet-300 font-medium">{pseudo}</span>
            )}
            {streak >= 2 && (
              <span className="text-xs text-orange-400">🔥 {streak} en série</span>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
