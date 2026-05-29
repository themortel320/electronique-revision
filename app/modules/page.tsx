"use client";

import { CourseCard } from "@/components/course-card";
import { courseModules } from "@/lib/modules";
import Link from "next/link";
import { Search, Star, X } from "lucide-react";
import { useState, useEffect, useMemo } from "react";

const FAV_KEY = "electrolab:fav-modules";

function loadFavs(): Set<string> {
  try {
    return new Set(JSON.parse(localStorage.getItem(FAV_KEY) ?? "[]"));
  } catch { return new Set(); }
}

function saveFavs(ids: Set<string>) {
  try { localStorage.setItem(FAV_KEY, JSON.stringify([...ids])); } catch { /* ignore */ }
}

export default function ModulesPage() {
  const [query, setQuery] = useState("");
  const [favs, setFavs] = useState<Set<string>>(new Set());
  const [showFavsOnly, setShowFavsOnly] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setFavs(loadFavs());
    setMounted(true);
  }, []);

  function toggleFav(id: string) {
    setFavs((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      saveFavs(next);
      return next;
    });
  }

  const filtered = useMemo(() => {
    let list = courseModules;
    if (showFavsOnly && mounted) list = list.filter((m) => favs.has(m.id));
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.summary.toLowerCase().includes(q) ||
          m.notions.some((n) => n.toLowerCase().includes(q)) ||
          m.formulas.some((f) => f.toLowerCase().includes(q))
      );
    }
    return list;
  }, [query, favs, showFavsOnly, mounted]);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Cours</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Clique sur un module pour dérouler le cours, les schémas et les formules.
        </p>
      </header>

      {/* Search + filter bar */}
      <div className="flex gap-2 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un cours, une formule…"
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-9 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70"
            >
              <X size={14} />
            </button>
          )}
        </div>
        {mounted && (
          <button
            onClick={() => setShowFavsOnly((v) => !v)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
              showFavsOnly
                ? "border-amber-500/50 bg-amber-900/20 text-amber-300"
                : "border-white/10 text-white/40 hover:text-white hover:border-white/20"
            }`}
          >
            <Star size={14} className={showFavsOnly ? "fill-amber-400 text-amber-400" : ""} />
            Favoris {favs.size > 0 && `(${favs.size})`}
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-white/8 bg-white/3 p-8 text-center">
          <p className="text-white/40 text-sm">
            {showFavsOnly ? "Aucun favori enregistré." : `Aucun cours ne correspond à "${query}".`}
          </p>
          {showFavsOnly && (
            <p className="text-white/25 text-xs mt-1">Clique sur ⭐ dans un cours pour l&apos;ajouter.</p>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((module) => (
            <div key={module.id} className="relative group">
              <CourseCard module={module} />
              {/* Fav star overlay */}
              {mounted && (
                <button
                  onClick={() => toggleFav(module.id)}
                  title={favs.has(module.id) ? "Retirer des favoris" : "Ajouter aux favoris"}
                  className={`absolute top-4 right-12 z-10 p-1.5 rounded-lg transition-all opacity-0 group-hover:opacity-100 ${
                    favs.has(module.id)
                      ? "opacity-100 text-amber-400"
                      : "text-white/20 hover:text-amber-400"
                  }`}
                >
                  <Star size={14} className={favs.has(module.id) ? "fill-amber-400" : ""} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="rounded-2xl border border-dashed border-brand-300 bg-brand-50 p-5 dark:border-brand-800 dark:bg-brand-950">
        <p className="font-semibold text-brand-700 dark:text-brand-300">
          Tu veux tester ce que tu as appris ?
        </p>
        <p className="mt-1 text-sm text-brand-600 dark:text-brand-400">
          Lance un exercice ou passe le quiz pour valider tes connaissances.
        </p>
        <div className="mt-3 flex gap-2">
          <Link
            href="/exercises"
            className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-500"
          >
            Exercices →
          </Link>
          <Link
            href="/quiz"
            className="rounded-xl border border-brand-300 px-4 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-100 dark:border-brand-700 dark:text-brand-300"
          >
            Quiz →
          </Link>
        </div>
      </div>
    </div>
  );
}
