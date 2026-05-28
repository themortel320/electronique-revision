"use client";

import { CourseCard } from "@/components/course-card";
import { QuestionCard } from "@/components/question-card";
import { AITutor, AITutorButton } from "@/components/ai-tutor";
import { courseModules } from "@/lib/modules";
import { useState } from "react";

const MAINTENANCE_IDS = ["instruments-mesure", "diagnostic-pannes", "soudure-montage", "normes-securite"];
const FABRICATION_IDS = ["fabrication-pcb"];

const TABS = [
  { id: "maintenance", label: "🔧 Maintenance" },
  { id: "fabrication", label: "🏭 Fabrication" },
  { id: "exercices", label: "🎲 Exercices GPT" },
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
  "Lecture de datasheet et documentation technique",
  "Contrôle qualité et inspection en électronique (AOI, IPC-610)",
];

export default function MaintenancePage() {
  const [tab, setTab] = useState("maintenance");
  const [tutorQuestion, setTutorQuestion] = useState<string | undefined>();
  const [tutorOpen, setTutorOpen] = useState(false);
  const [exerciceSubTab, setExerciceSubTab] = useState<"maintenance" | "fabrication">("maintenance");

  const maintenanceModules = courseModules.filter((m) => MAINTENANCE_IDS.includes(m.id));
  const fabricationModules = courseModules.filter((m) => FABRICATION_IDS.includes(m.id));

  function openTutor(q?: string) {
    setTutorQuestion(q);
    setTutorOpen(true);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-xl">
            🔧
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              Maintenance & Fabrication
            </h1>
            <p className="text-white/50 text-sm">
              Instruments · Diagnostic · Soudure · PCB · Normes — pour tes épreuves pratiques
            </p>
          </div>
        </div>

        {/* Info banner */}
        <div className="p-4 rounded-2xl bg-orange-900/20 border border-orange-700/30 text-sm text-orange-300/90 flex gap-3">
          <span className="text-xl shrink-0">📋</span>
          <div>
            <p className="font-medium mb-1">Cours orientés épreuves de BTS/BEP/BAC Pro</p>
            <p className="text-orange-300/60 text-xs">
              Couvre la maintenance électronique (mesures, diagnostic, soudure, normes) et la fabrication
              (PCB, CMS, datasheet, contrôle qualité).
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-white/5 border border-white/10 rounded-2xl p-1 w-fit flex-wrap">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              tab === t.id
                ? "bg-orange-600 text-white shadow-sm"
                : "text-white/50 hover:text-white"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── MAINTENANCE ── */}
      {tab === "maintenance" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
            {[
              { icon: "📏", label: "Instruments de mesure", desc: "Multimètre, oscilloscope, générateur" },
              { icon: "🔍", label: "Diagnostic de pannes", desc: "Méthode dichotomie, circuit ouvert/CC" },
              { icon: "🔥", label: "Soudure & Montage", desc: "THT, CMS, qualité de soudure" },
              { icon: "⚡", label: "Normes & Sécurité", desc: "Habilitations, IP, NF C 15-100, CEM" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3 p-3 rounded-xl bg-white/3 border border-white/8">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <p className="text-white/80 text-sm font-medium">{item.label}</p>
                  <p className="text-white/40 text-xs">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          {maintenanceModules.length > 0 ? (
            maintenanceModules.map((mod) => (
              <CourseCard key={mod.id} module={mod} onAskTutor={(q) => openTutor(q)} />
            ))
          ) : (
            <div className="p-8 rounded-2xl border border-white/10 text-center text-white/40">
              Chargement des modules de maintenance…
            </div>
          )}
        </div>
      )}

      {/* ── FABRICATION ── */}
      {tab === "fabrication" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
            {[
              { icon: "🖥️", label: "Fabrication PCB", desc: "FR4, couches, vias, gerber, gravure" },
              { icon: "🔬", label: "Assemblage CMS", desc: "SMD, reflow, vague, pâte à braser" },
              { icon: "📄", label: "Lecture Datasheet", desc: "Pinout, caractéristiques, application note" },
              { icon: "✅", label: "Contrôle qualité", desc: "IPC-610, AOI, inspection visuelle" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3 p-3 rounded-xl bg-white/3 border border-white/8">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <p className="text-white/80 text-sm font-medium">{item.label}</p>
                  <p className="text-white/40 text-xs">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Fabrication PCB module */}
          {fabricationModules.map((mod) => (
            <CourseCard key={mod.id} module={mod} onAskTutor={(q) => openTutor(q)} />
          ))}

          {/* Extra content cards for topics not yet in modules.ts */}
          <div className="rounded-2xl border border-white/10 bg-[#0d0d1f] p-5 space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📄</span>
              <div>
                <h3 className="text-white font-semibold">Lecture de Datasheet</h3>
                <p className="text-white/40 text-xs">Documentation technique des composants</p>
              </div>
            </div>
            <div className="space-y-3 text-sm text-white/70">
              <div className="p-3 rounded-xl bg-white/5 border border-white/8">
                <p className="text-white/90 font-medium mb-1">📌 Sections clés d&apos;une datasheet</p>
                <ul className="space-y-1 text-white/60 text-xs list-disc list-inside">
                  <li><strong>Features</strong> : résumé des caractéristiques principales</li>
                  <li><strong>Absolute Maximum Ratings</strong> : limites à ne JAMAIS dépasser (tension max, courant max, température)</li>
                  <li><strong>Electrical Characteristics</strong> : valeurs typiques et garanties en fonctionnement normal</li>
                  <li><strong>Pinout / Pin Description</strong> : identification de chaque broche</li>
                  <li><strong>Application Circuit</strong> : schéma de mise en œuvre recommandé par le fabricant</li>
                  <li><strong>Timing Diagrams</strong> : chronogrammes pour les composants logiques/numériques</li>
                </ul>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/8">
                <p className="text-white/90 font-medium mb-1">💡 Exemple : lire la datasheet d&apos;un régulateur LM7805</p>
                <p className="text-white/60 text-xs">
                  Vin max = 35V, Vout = 5V ±2%, Iout max = 1A, température de jonction max = 125°C.
                  Package TO-220 : broche 1 = INPUT, broche 2 = GND, broche 3 = OUTPUT.
                  Application : condensateurs 0.1µF en entrée et sortie recommandés.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0d0d1f] p-5 space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">✅</span>
              <div>
                <h3 className="text-white font-semibold">Contrôle qualité IPC-610</h3>
                <p className="text-white/40 text-xs">Normes d&apos;acceptabilité des assemblages électroniques</p>
              </div>
            </div>
            <div className="space-y-3 text-sm">
              <div className="p-3 rounded-xl bg-white/5 border border-white/8">
                <p className="text-white/90 font-medium mb-2">Classes IPC</p>
                <div className="grid grid-cols-3 gap-2 text-xs text-white/60">
                  <div className="p-2 rounded-lg bg-green-900/20 border border-green-700/30">
                    <p className="text-green-400 font-bold mb-1">Classe 1</p>
                    <p>Électronique générale — exigences minimales (jouets, appareils grand public sans criticité)</p>
                  </div>
                  <div className="p-2 rounded-lg bg-blue-900/20 border border-blue-700/30">
                    <p className="text-blue-400 font-bold mb-1">Classe 2</p>
                    <p>Électronique dédiée — longue durée de vie souhaitée (téléphones, ordinateurs, automobile)</p>
                  </div>
                  <div className="p-2 rounded-lg bg-red-900/20 border border-red-700/30">
                    <p className="text-red-400 font-bold mb-1">Classe 3</p>
                    <p>Électronique critique — pas de panne admissible (médical, aérospatial, militaire)</p>
                  </div>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/8">
                <p className="text-white/90 font-medium mb-1">Défauts courants à détecter</p>
                <ul className="text-xs text-white/60 space-y-1 list-disc list-inside">
                  <li>Pont de soudure (solder bridge) entre deux pads adjacents</li>
                  <li>Composant mal positionné ou inversé (polarité)</li>
                  <li>Soudure insuffisante (lack of fill) ou excès d&apos;étain (excess solder)</li>
                  <li>Composant tombstone (un seul côté soudé, l&apos;autre soulevé)</li>
                  <li>Pad décollé ou piste arrachée (pad lift)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── EXERCICES GPT ── */}
      {tab === "exercices" && (
        <div className="space-y-5">
          <div className="flex gap-2">
            <button
              onClick={() => setExerciceSubTab("maintenance")}
              className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                exerciceSubTab === "maintenance"
                  ? "bg-orange-600 border-orange-500 text-white"
                  : "border-white/10 text-white/40 hover:text-white"
              }`}
            >
              🔧 Maintenance
            </button>
            <button
              onClick={() => setExerciceSubTab("fabrication")}
              className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                exerciceSubTab === "fabrication"
                  ? "bg-orange-600 border-orange-500 text-white"
                  : "border-white/10 text-white/40 hover:text-white"
              }`}
            >
              🏭 Fabrication
            </button>
          </div>

          <QuestionCard
            defaultChapter={
              exerciceSubTab === "maintenance"
                ? MAINTENANCE_CHAPTERS[0]
                : FABRICATION_CHAPTERS[0]
            }
            onAskTutor={(q) => openTutor(q)}
          />

          <AITutor
            module={
              exerciceSubTab === "maintenance"
                ? maintenanceModules[0]
                : fabricationModules[0]
            }
            initialQuestion={tutorOpen ? tutorQuestion : undefined}
          />
        </div>
      )}

      {/* Floating tutor button */}
      {tab !== "exercices" && (
        <AITutorButton
          module={tab === "maintenance" ? maintenanceModules[0] : fabricationModules[0]}
          initialQuestion={tutorOpen ? tutorQuestion : undefined}
        />
      )}
    </div>
  );
}
