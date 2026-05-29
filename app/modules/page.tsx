"use client";

import { CourseCard } from "@/components/course-card";
import { CourseGroup } from "@/components/course-group";
import { courseModules } from "@/lib/modules";
import Link from "next/link";
import { Search, Star, X } from "lucide-react";
import { useState, useEffect, useMemo } from "react";

const FAV_KEY = "electrolab:fav-modules";

function loadFavs(): Set<string> {
  try { return new Set(JSON.parse(localStorage.getItem(FAV_KEY) ?? "[]")); }
  catch { return new Set(); }
}
function saveFavs(ids: Set<string>) {
  try { localStorage.setItem(FAV_KEY, JSON.stringify([...ids])); } catch { /**/ }
}

// ── Subcategory grouping ──────────────────────────────────────────────────────
const GROUPS = [
  {
    title: "Lois électriques",
    subtitle: "Les fondations indispensables de tout circuit",
    emoji: "⚡",
    accent: "text-amber-400",
    border: "border-amber-700/25",
    bg: "bg-amber-900/8",
    ids: ["foundations", "kirchhoff"],
  },
  {
    title: "Composants passifs",
    subtitle: "Résistances, condensateurs, bobines",
    emoji: "🔋",
    accent: "text-blue-400",
    border: "border-blue-700/25",
    bg: "bg-blue-900/8",
    ids: ["passive"],
  },
  {
    title: "Semi-conducteurs",
    subtitle: "Diodes, transistors — les composants actifs",
    emoji: "💡",
    accent: "text-yellow-400",
    border: "border-yellow-700/25",
    bg: "bg-yellow-900/8",
    ids: ["diodes", "transistors", "transistors-advanced"],
  },
  {
    title: "Circuits avancés",
    subtitle: "Filtres RC, amplificateurs opérationnels",
    emoji: "🎛️",
    accent: "text-cyan-400",
    border: "border-cyan-700/25",
    bg: "bg-cyan-900/8",
    ids: ["rc-filters", "op-amp"],
  },
];

export default function ModulesPage() {
  const [query, setQuery] = useState("");
  const [favs, setFavs] = useState<Set<string>>(new Set());
  const [showFavsOnly, setShowFavsOnly] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setFavs(loadFavs()); setMounted(true); }, []);

  function toggleFav(id: string) {
    setFavs((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      saveFavs(next);
      return next;
    });
  }

  // Filtered view (search or favs)
  const filteredIds = useMemo(() => {
    const q = query.toLowerCase().trim();
    return courseModules
      .filter((m) => {
        if (showFavsOnly && mounted && !favs.has(m.id)) return false;
        if (!q) return true;
        return (
          m.title.toLowerCase().includes(q) ||
          m.summary.toLowerCase().includes(q) ||
          m.notions.some((n) => n.toLowerCase().includes(q)) ||
          m.formulas.some((f) => f.toLowerCase().includes(q))
        );
      })
      .map((m) => m.id);
  }, [query, favs, showFavsOnly, mounted]);

  const isFiltering = query.trim() !== "" || (showFavsOnly && mounted);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
          ⚡ Électronique
        </h1>
        <p className="mt-1 text-sm text-white/40">
          Clique sur un module pour dérouler le cours, les schémas SVG et les formules.
        </p>
      </header>

      {/* Search + filter */}
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
            <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70">
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

      {/* Results */}
      {isFiltering ? (
        <div className="space-y-2">
          {filteredIds.length === 0 ? (
            <p className="rounded-2xl border border-white/8 p-8 text-center text-sm text-white/30">
              {showFavsOnly ? "Aucun favori." : `Aucun résultat pour « ${query} ».`}
            </p>
          ) : (
            filteredIds.map((id) => {
              const mod = courseModules.find((m) => m.id === id)!;
              return (
                <div key={id} className="relative group">
                  <CourseCard module={mod} />
                  {mounted && (
                    <button onClick={() => toggleFav(id)}
                      className={`absolute top-4 right-12 z-10 p-1.5 rounded-lg transition-all opacity-0 group-hover:opacity-100 ${favs.has(id) ? "opacity-100 text-amber-400" : "text-white/20 hover:text-amber-400"}`}
                    >
                      <Star size={14} className={favs.has(id) ? "fill-amber-400" : ""} />
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      ) : (
        /* Grouped view */
        <div className="space-y-4">
          {GROUPS.map((group, gi) => {
            const mods = group.ids
              .map((id) => courseModules.find((m) => m.id === id))
              .filter(Boolean) as typeof courseModules;
            if (mods.length === 0) return null;
            return (
              <CourseGroup
                key={group.title}
                title={group.title}
                subtitle={group.subtitle}
                emoji={group.emoji}
                accentClass={group.accent}
                borderClass={group.border}
                bgClass={group.bg}
                defaultOpen={gi === 0}
              >
                {mods.map((mod) => (
                  <div key={mod.id} className="relative group">
                    <CourseCard module={mod} />
                    {mounted && (
                      <button onClick={() => toggleFav(mod.id)}
                        className={`absolute top-4 right-12 z-10 p-1.5 rounded-lg transition-all opacity-0 group-hover:opacity-100 ${favs.has(mod.id) ? "opacity-100 text-amber-400" : "text-white/20 hover:text-amber-400"}`}
                      >
                        <Star size={14} className={favs.has(mod.id) ? "fill-amber-400" : ""} />
                      </button>
                    )}
                  </div>
                ))}
              </CourseGroup>
            );
          })}
        </div>
      )}

      <div className="rounded-2xl border border-dashed border-white/10 p-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-white/40">Tu veux tester ce que tu as appris ?</p>
        <div className="flex gap-2">
          <Link href="/exercises" className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-500 transition-colors">Exercices →</Link>
          <Link href="/quiz" className="rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-white/60 hover:text-white hover:border-white/20 transition-colors">Quiz →</Link>
        </div>
      </div>
    </div>
  );
}
