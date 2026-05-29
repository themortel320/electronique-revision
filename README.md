# ⚡ ElectroLab

Plateforme de révision interactive pour l'électronique et les mathématiques — cours animés avec schémas SVG, quiz, révision espacée (SRS), mode examen, classement mondial.

> 🔗 **[electrolab.vercel.app](https://electrolab.vercel.app)** — essaie en live

---

## ✨ Fonctionnalités

### 📚 Cours
- **Cours pédagogiques** structurés en 3 onglets : Cours / Formules / Exemple
- **Analogies simples** avant chaque formule (plus de "lâcher de formules")
- **Schémas SVG interactifs** : circuits RC, transistors, AOP, filtres, LED, diviseur de tension...
- **Mode pas à pas** : avance étape par étape avec le bouton Suivant
- **Favoris** : épingle tes cours préférés
- **Recherche globale** en temps réel sur titres, formules et notions
- **Professeur IA** (Groq Llama 3.3) : pose une question directement dans chaque cours

### 🎯 Quiz & Entraînement
- **Quiz thématiques** : Électronique, Maintenance, Fabrication, Maths, Anglais technique, Défi mixte
- **+300 questions** choisies aléatoirement (jamais les mêmes)
- **Explication des erreurs** : bonne réponse + pourquoi tu as eu tort
- **Tableau de formules** contextuel pendant le quiz (aide)
- **Historique des sessions** avec détail des erreurs
- **Partage de score** en un clic (Share API / presse-papier)

### 🧠 Révision espacée (SRS)
- Algorithme **SM-2** (comme Anki) sur toutes les questions de quiz
- Les cartes difficiles reviennent vite, les maîtrisées moins souvent
- Barre de progression par catégorie
- Auto-peuplé dès la première visite

### 📝 Mode Examen
- Chronomètre configurable (15 min / 30 min / 1 h)
- Catégories au choix
- Aucune aide, correction à la fin
- Difficulté progressive automatique

### 🏆 Classement mondial
- Scores globaux via **Upstash Redis**
- Reset automatique chaque lundi
- Pseudo unique par semaine
- Filtrage par catégorie

### 📊 Dashboard
- Radar des compétences par catégorie
- Graphique barre correct/raté
- Suggestions personnalisées ("À retravailler")
- Historique de toutes les sessions de quiz

---

## 🛠️ Stack technique

| Technologie | Usage |
|---|---|
| **Next.js 14** (App Router) | Framework frontend + API routes |
| **TypeScript** | Typage strict |
| **Tailwind CSS** | Styles |
| **Framer Motion** | Animations |
| **Chart.js** | Radar, Bode plots |
| **KaTeX** | Rendu LaTeX |
| **Groq Llama 3.3** (via Vercel AI SDK) | Professeur IA + génération d'exercices |
| **Upstash Redis** | Classement mondial persistant |
| **SVG natif** | Schémas de circuits |

---

## 🚀 Lancer le projet

```bash
git clone https://github.com/themortel320/electronique-revision.git
cd electronique-revision
npm install
npm run dev
```

### Variables d'environnement

Crée un fichier `.env.local` :

```env
# IA (Groq — gratuit)
GROQ_API_KEY=sk-...

# Classement mondial (Upstash Redis — optionnel)
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...
```

Sans ces clés, le site fonctionne entièrement en local (IA désactivée, classement local).

---

## 📁 Architecture

```
app/
├── modules/        → Cours électronique
├── math/           → Cours maths (dérivées, intégrales, suites, trigo)
├── maintenance/    → Maintenance & fabrication PCB
├── english/        → Anglais technique
├── quiz/           → Quiz avec classement
├── exam/           → Mode examen chronométré
├── spaced/         → Révision espacée (SRS)
├── dashboard/      → Tableau de bord
└── api/            → Routes IA, leaderboard, pseudo

components/
├── course-card.tsx       → Cours avec onglets + schéma SVG + mode pas à pas
├── circuit-diagrams.tsx  → Schémas SVG des circuits
├── quiz.tsx              → Quiz complet avec historique et partage
├── exam-mode.tsx         → Mode examen
├── leaderboard.tsx       → Classement mondial
├── progress-dashboard.tsx→ Dashboard avec radar chart
└── mini-calculator.tsx   → Calculatrice flottante

lib/
├── modules.ts            → Contenu des cours électronique
├── math-modules.ts       → Contenu des cours maths
├── quiz-questions.ts     → +300 questions par catégorie
├── quiz-history.ts       → Sauvegarde locale des sessions
├── spaced-repetition.ts  → Algorithme SM-2
└── leaderboard.ts        → Client API classement
```

---

## 📱 PWA

Le site est installable comme application mobile ou desktop (Progressive Web App).

---

## 📄 Licence

MIT — libre d'utilisation et de modification.
