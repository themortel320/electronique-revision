"use client";

import { CourseCard } from "@/components/course-card";
import { CourseGroup } from "@/components/course-group";
import { QuestionCard } from "@/components/question-card";
import { AITutor, AITutorButton } from "@/components/ai-tutor";
import { courseModules } from "@/lib/modules";
import { useState } from "react";

// IDs dans modules.ts
const MAINTENANCE_GROUPS = [
  {
    title: "Instruments de mesure",
    subtitle: "Multimètre, oscilloscope, générateur de signaux",
    emoji: "📏",
    accent: "text-orange-400",
    border: "border-orange-700/25",
    bg: "bg-orange-900/8",
    ids: ["instruments-mesure"],
  },
  {
    title: "Diagnostic de pannes",
    subtitle: "Méthode dichotomique, court-circuit, circuit ouvert",
    emoji: "🔍",
    accent: "text-red-400",
    border: "border-red-700/25",
    bg: "bg-red-900/8",
    ids: ["diagnostic-pannes"],
  },
  {
    title: "Soudure & Montage",
    subtitle: "Soudure THT et CMS, brasage, qualité",
    emoji: "🔥",
    accent: "text-yellow-400",
    border: "border-yellow-700/25",
    bg: "bg-yellow-900/8",
    ids: ["soudure-montage"],
  },
  {
    title: "Normes & Sécurité",
    subtitle: "Habilitations électriques, IP, NF C 15-100, CEM",
    emoji: "⚡",
    accent: "text-green-400",
    border: "border-green-700/25",
    bg: "bg-green-900/8",
    ids: ["normes-securite"],
  },
];

const FABRICATION_GROUPS = [
  {
    title: "Conception PCB",
    subtitle: "FR4, couches, vias, fichiers gerber, gravure chimique",
    emoji: "🖥️",
    accent: "text-sky-400",
    border: "border-sky-700/25",
    bg: "bg-sky-900/8",
    ids: ["fabrication-pcb"],
    inline: null,
  },
  {
    title: "Lecture de Datasheet",
    subtitle: "Pinout, caractéristiques, application note",
    emoji: "📄",
    accent: "text-indigo-400",
    border: "border-indigo-700/25",
    bg: "bg-indigo-900/8",
    ids: [],
    inline: (
      <div className="space-y-3 text-sm text-white/70 px-1">
        <div className="p-3 rounded-xl bg-white/5 border border-white/8">
          <p className="text-white/90 font-medium mb-2">📌 Sections clés d&apos;une datasheet</p>
          <ul className="space-y-1 text-white/60 text-xs list-disc list-inside">
            <li><strong>Features</strong> : résumé des caractéristiques principales</li>
            <li><strong>Absolute Maximum Ratings</strong> : limites à ne JAMAIS dépasser</li>
            <li><strong>Electrical Characteristics</strong> : valeurs typiques et garanties</li>
            <li><strong>Pinout / Pin Description</strong> : identification de chaque broche</li>
            <li><strong>Application Circuit</strong> : schéma recommandé par le fabricant</li>
          </ul>
        </div>
        <div className="p-3 rounded-xl bg-white/5 border border-white/8">
          <p className="text-white/90 font-medium mb-1">💡 Exemple : LM7805</p>
          <p className="text-white/60 text-xs">
            Vin max = 35V · Vout = 5V ±2% · Iout max = 1A · T° jonction max = 125°C
            <br/>Package TO-220 : broche 1 = INPUT · 2 = GND · 3 = OUTPUT
          </p>
        </div>
      </div>
    ),
  },
  {
    title: "Contrôle qualité IPC-610",
    subtitle: "Classes IPC, défauts courants, inspection AOI",
    emoji: "✅",
    accent: "text-emerald-400",
    border: "border-emerald-700/25",
    bg: "bg-emerald-900/8",
    ids: [],
    inline: (
      <div className="space-y-3 px-1">
        <div className="grid grid-cols-3 gap-2 text-xs text-white/60">
          {[
            { label: "Classe 1", desc: "Grand public — exigences minimales", color: "green" },
            { label: "Classe 2", desc: "Longue durée de vie (auto, téléphones)", color: "blue" },
            { label: "Classe 3", desc: "Critique — médical, aérospatial", color: "red" },
          ].map(({ label, desc, color }) => (
            <div key={label} className={`p-2 rounded-lg bg-${color}-900/20 border border-${color}-700/30`}>
              <p className={`text-${color}-400 font-bold mb-1`}>{label}</p>
              <p>{desc}</p>
            </div>
          ))}
        </div>
        <div className="p-3 rounded-xl bg-white/5 border border-white/8 text-xs text-white/60">
          <p className="text-white/90 font-medium mb-1">Défauts courants</p>
          <ul className="space-y-0.5 list-disc list-inside">
            <li>Pont de soudure entre deux pads</li>
            <li>Composant mal positionné ou inversé</li>
            <li>Tombstone (un seul côté soudé)</li>
            <li>Pad décollé / piste arrachée</li>
          </ul>
        </div>
      </div>
    ),
  },
];

const MAINTENANCE_CHAPTERS = [
  "Instruments de mesure (multimètre, oscilloscope)",
  "Diagnostic de pannes électroniques",
  "Soudure et montage THT/CMS",
  "Normes et sécurité électrique (habilitations, IP, CEM)",
];
const FABRICATION_CHAPTERS = [
  "Fabrication de circuits imprimés PCB (gerber, couches, vias)",
  "Composants CMS/SMD et procédés d'assemblage (reflow, vague)",
  "Contrôle qualité et inspection en électronique (AOI, IPC-610)",
];

const TABS = [
  { id: "maintenance", label: "🔧 Maintenance" },
  { id: "fabrication", label: "🏭 Fabrication" },
  { id: "exercices",   label: "🎲 Exercices GPT" },
];

export default function MaintenancePage() {
  const [tab, setTab] = useState("maintenance");
  const [tutorQuestion, setTutorQuestion] = useState<string | undefined>();
  const [tutorOpen, setTutorOpen] = useState(false);
  const [exerciceSubTab, setExerciceSubTab] = useState<"maintenance" | "fabrication">("maintenance");

  function openTutor(q?: string) { setTutorQuestion(q); setTutorOpen(true); }

  const maintenanceModules = courseModules.filter((m) =>
    ["instruments-mesure","diagnostic-pannes","soudure-montage","normes-securite"].includes(m.id)
  );
  const fabricationModules = courseModules.filter((m) => m.id === "fabrication-pcb");

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
      {/* Header */}
      <header>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-xl">
            🔧
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              Maintenance & Fabrication
            </h1>
            <p className="text-white/40 text-sm">
              Instruments · Diagnostic · Soudure · PCB · Normes
            </p>
          </div>
        </div>
        <div className="p-3 rounded-2xl bg-orange-900/20 border border-orange-700/30 text-sm text-orange-300/80 flex gap-2 items-start">
          <span className="shrink-0">📋</span>
          <span>Cours orientés épreuves pratiques BTS / BAC Pro — maintenance électronique &amp; fabrication PCB.</span>
        </div>
      </header>

      {/* Section tabs */}
      <div className="flex gap-1.5 bg-white/5 border border-white/10 rounded-2xl p-1 w-fit flex-wrap">
        {TABS.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              tab === t.id ? "bg-orange-600 text-white shadow-sm" : "text-white/50 hover:text-white"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── MAINTENANCE ── */}
      {tab === "maintenance" && (
        <div className="space-y-4">
          {MAINTENANCE_GROUPS.map((group, gi) => {
            const mods = group.ids.map((id) => maintenanceModules.find((m) => m.id === id)).filter(Boolean) as typeof maintenanceModules;
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
                {mods.length > 0 ? (
                  mods.map((mod) => <CourseCard key={mod.id} module={mod} onAskTutor={openTutor} />)
                ) : (
                  <p className="text-white/30 text-sm text-center py-3">Module bientôt disponible.</p>
                )}
              </CourseGroup>
            );
          })}
        </div>
      )}

      {/* ── FABRICATION ── */}
      {tab === "fabrication" && (
        <div className="space-y-4">
          {FABRICATION_GROUPS.map((group, gi) => {
            const mods = group.ids.map((id) => fabricationModules.find((m) => m.id === id)).filter(Boolean) as typeof fabricationModules;
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
                {mods.length > 0 && mods.map((mod) => <CourseCard key={mod.id} module={mod} onAskTutor={openTutor} />)}
                {group.inline}
                {mods.length === 0 && !group.inline && (
                  <p className="text-white/30 text-sm text-center py-3">Module bientôt disponible.</p>
                )}
              </CourseGroup>
            );
          })}
        </div>
      )}

      {/* ── EXERCICES GPT ── */}
      {tab === "exercices" && (
        <div className="space-y-5">
          <div className="flex gap-2">
            {(["maintenance", "fabrication"] as const).map((st) => (
              <button key={st} onClick={() => setExerciceSubTab(st)}
                className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                  exerciceSubTab === st
                    ? "bg-orange-600 border-orange-500 text-white"
                    : "border-white/10 text-white/40 hover:text-white"
                }`}
              >
                {st === "maintenance" ? "🔧 Maintenance" : "🏭 Fabrication"}
              </button>
            ))}
          </div>
          <QuestionCard
            defaultChapter={
              exerciceSubTab === "maintenance" ? MAINTENANCE_CHAPTERS[0] : FABRICATION_CHAPTERS[0]
            }
            onAskTutor={openTutor}
          />
          <AITutor
            module={exerciceSubTab === "maintenance" ? maintenanceModules[0] : fabricationModules[0]}
            initialQuestion={tutorOpen ? tutorQuestion : undefined}
          />
        </div>
      )}

      {tab !== "exercices" && (
        <AITutorButton
          module={tab === "maintenance" ? maintenanceModules[0] : fabricationModules[0]}
          initialQuestion={tutorOpen ? tutorQuestion : undefined}
        />
      )}
    </div>
  );
}
