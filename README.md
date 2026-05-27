# ElectroLab

Plateforme web moderne pour reviser les bases de l'electronique.

## Stack
- Next.js (App Router) + React + TypeScript
- Tailwind CSS
- Composants reutilisables

## Fonctionnalites
- Cours progressifs (loi d'Ohm, puissance, Kirchhoff, resistances, diodes, transistors)
- Generateur d'exercices aleatoires par categorie et difficulte
- Corrections detaillees etape par etape
- Schemas interactifs en SVG
- Systeme de score et historique (localStorage)
- Quiz rapide
- Mode sombre

## Lancer le projet
```bash
npm install
npm run dev
```

## Architecture
- `app/` pages (accueil, modules, exercices, progression)
- `components/` composants UI reutilisables
- `lib/` logique metier (modules, generation d'exercices, progression)
- `types/` types TypeScript partages
