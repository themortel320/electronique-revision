"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Moon, Sun, Trophy, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { getPseudo } from "@/lib/user";

const links = [
  { href: "/study",       label: "📅 Plan"     },
  { href: "/modules",     label: "Cours"       },
  { href: "/math",        label: "∂ Maths"     },
  { href: "/exercises",   label: "Exercices"   },
  { href: "/quiz",        label: "Quiz"        },
  { href: "/progress",    label: "Progression" },
];

export function Navbar() {
  const [dark, setDark] = useState(false);
  const [pseudo, setPseudo] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const isDark = window.localStorage.getItem("theme") === "dark";
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
    setPseudo(getPseudo());
  }, []);

  const toggle = () => {
    // Activer les transitions couleur pendant le basculement uniquement
    document.documentElement.classList.add("theme-transitioning");
    setTimeout(() => {
      document.documentElement.classList.remove("theme-transitioning");
    }, 500);

    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    window.localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <header className="sticky top-0 z-10 border-b border-slate-200/80 bg-white/90 backdrop-blur dark:border-slate-800/80 dark:bg-slate-950/90">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-bold tracking-tight text-slate-900 dark:text-slate-100"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-600">
            <Zap className="h-4 w-4 text-white" />
          </div>
          ElectroLab
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-0.5 text-sm">
          {links.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`rounded-lg px-3 py-2 transition ${
                  active
                    ? "bg-brand-50 font-semibold text-brand-700 dark:bg-brand-950/60 dark:text-brand-300"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                }`}
              >
                {label}
              </Link>
            );
          })}

          <Link
            href="/leaderboard"
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 transition ${
              pathname === "/leaderboard"
                ? "bg-amber-50 font-semibold text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
            }`}
          >
            <Trophy className="h-3.5 w-3.5 text-amber-500" />
            Classement
          </Link>

          {/* Pseudo badge */}
          {pseudo && (
            <span className="ml-1 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 dark:border-brand-800 dark:bg-brand-950/60 dark:text-brand-300">
              {pseudo}
            </span>
          )}

          {/* Dark toggle */}
          <button
            type="button"
            onClick={toggle}
            className="ml-1 flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
            aria-label="Changer le thème"
          >
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </nav>
      </div>
    </header>
  );
}
