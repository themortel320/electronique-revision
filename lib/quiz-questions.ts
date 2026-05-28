export type QuizQuestion = {
  q: string;
  options: string[];
  answer: number;
  explanation: string;
};

export type FormulaRow = {
  formula: string;
  label: string;
  note?: string;
};

export type QuizCategory = {
  id: string;
  label: string;
  emoji: string;
  color: string;
  questions: QuizQuestion[];
  cheatSheet?: {
    title: string;
    rows: FormulaRow[];
  };
};

export const QUIZ_CATEGORIES: QuizCategory[] = [
  {
    id: "electronics",
    label: "Électronique",
    emoji: "⚡",
    color: "from-violet-600 to-blue-600",
    cheatSheet: {
      title: "Formules essentielles",
      rows: [
        { formula: "U = R × I", label: "Loi d'Ohm", note: "U en V, R en Ω, I en A" },
        { formula: "P = U × I", label: "Puissance", note: "aussi P = R×I² ou U²/R" },
        { formula: "Req = R1 + R2", label: "Résistances série", note: "courant identique" },
        { formula: "1/Req = 1/R1 + 1/R2", label: "Résistances parallèle", note: "tension identique" },
        { formula: "Vout = Vin × R2/(R1+R2)", label: "Diviseur de tension", note: "R2 côté GND" },
        { formula: "τ = R × C", label: "Constante de temps RC", note: "63% à t=τ, 99% à t=5τ" },
        { formula: "R_LED = (Vcc − Vf) / I", label: "Résistance LED", note: "Vf ≈ 2V rouge, 3.2V bleu" },
        { formula: "Ic = β × Ib", label: "Transistor BJT", note: "β = gain (50–500)" },
      ],
    },
    questions: [
      {
        q: "Quelle est la loi d'Ohm ?",
        options: ["P = U × I", "U = R × I", "R = P / I²", "I = P × U"],
        answer: 1,
        explanation: "U = R × I : la tension est égale à la résistance multipliée par le courant.",
      },
      {
        q: "Quelle unité mesure la résistance ?",
        options: ["Volt (V)", "Ampère (A)", "Watt (W)", "Ohm (Ω)"],
        answer: 3,
        explanation: "La résistance se mesure en Ohm (Ω), du nom du physicien Georg Ohm.",
      },
      {
        q: "Une LED nécessite toujours…",
        options: ["Une bobine en série", "Une résistance en série", "Un condensateur en parallèle", "Rien d'autre"],
        answer: 1,
        explanation: "Sans résistance série, le courant n'est pas limité et la LED grille immédiatement.",
      },
      {
        q: "En série, la résistance équivalente est…",
        options: ["R1 × R2", "R1 × R2 / (R1+R2)", "R1 + R2", "1/(1/R1 + 1/R2)"],
        answer: 2,
        explanation: "En série, les résistances s'additionnent : Req = R1 + R2.",
      },
      {
        q: "Quelle formule donne la puissance dissipée ?",
        options: ["P = R / I", "P = U + I", "P = U × I", "P = U / R²"],
        answer: 2,
        explanation: "P = U × I, aussi écrit P = R × I² ou P = U² / R.",
      },
      {
        q: "La constante de temps d'un circuit RC est…",
        options: ["τ = R + C", "τ = R / C", "τ = R × C", "τ = C / R"],
        answer: 2,
        explanation: "τ = R × C en secondes. À t = τ, le condensateur est chargé à ~63%.",
      },
      {
        q: "Un transistor NPN en saturation se comporte comme…",
        options: ["Un interrupteur ouvert", "Une résistance élevée", "Un interrupteur fermé", "Une diode"],
        answer: 2,
        explanation: "En saturation, le transistor laisse passer le courant : c'est l'état ON (interrupteur fermé).",
      },
      {
        q: "La diode Zener est utilisée pour…",
        options: ["Amplifier un signal", "Réguler une tension", "Stocker de l'énergie", "Mesurer le courant"],
        answer: 1,
        explanation: "La Zener maintient une tension approximativement constante en polarisation inverse.",
      },
      {
        q: "Dans un diviseur de tension, Vout = ?",
        options: ["Vin × R1/(R1+R2)", "Vin × R2/(R1+R2)", "Vin / (R1 × R2)", "Vin + R2/R1"],
        answer: 1,
        explanation: "Vout = Vin × R2 / (R1 + R2). R2 est la résistance en bas (côté GND).",
      },
      {
        q: "La loi des mailles de Kirchhoff dit que…",
        options: [
          "La somme des courants entrant = sortant",
          "La somme des tensions dans une maille = 0",
          "La résistance totale est toujours minimale",
          "Le courant est constant dans tout le circuit",
        ],
        answer: 1,
        explanation: "Kirchhoff (mailles) : la somme algébrique des tensions dans une maille fermée vaut 0.",
      },
    ],
  },

  {
    id: "maintenance",
    label: "Maintenance",
    emoji: "🔧",
    color: "from-orange-600 to-red-600",
    cheatSheet: {
      title: "Aide-mémoire maintenance",
      rows: [
        { formula: "Voltmètre → parallèle", label: "Mesure de tension", note: "impédance ~10 MΩ" },
        { formula: "Ampèremètre → série", label: "Mesure de courant", note: "circuit ouvert avant branchement" },
        { formula: "T = 1 / f", label: "Période / Fréquence", note: "T en s, f en Hz" },
        { formula: "Ueff = Umax / √2", label: "Tension efficace (AC)", note: "≈ Umax × 0.707" },
        { formula: "5 règles sécurité", label: "Travaux hors tension", note: "Séparer · Condamner · VAT · Terre · Baliser" },
        { formula: "IP XY", label: "Indice de Protection", note: "X=solides (0-6), Y=liquides (0-9)" },
        { formula: "B1 → hors tension BT", label: "Habilitations", note: "B2=chargé, BR=dépannage, BC=consignation" },
        { formula: "Soudure bonne → brillante", label: "Qualité soudure", note: "Terne/grumeleuse = froide (mauvaise)" },
      ],
    },
    questions: [
      {
        q: "En mode voltmètre, le multimètre se branche…",
        options: ["En série dans le circuit", "En parallèle avec le composant", "Entre phase et neutre uniquement", "Sur la borne ampère"],
        answer: 1,
        explanation: "Le voltmètre se branche en parallèle car il a une très haute impédance interne (~10 MΩ). Branché en série, il bloquerait le courant.",
      },
      {
        q: "En mode ampèremètre, le multimètre se branche…",
        options: ["En parallèle avec la charge", "Sans toucher le circuit", "En série dans le circuit ouvert", "Aux bornes de l'alimentation"],
        answer: 2,
        explanation: "L'ampèremètre se branche en série après avoir ouvert le circuit. Son impédance est quasi nulle pour ne pas perturber le courant.",
      },
      {
        q: "Que signifie VAT ?",
        options: ["Valeur de Alimentation Totale", "Vérification d'Absence de Tension", "Voltmètre Auto-Testeur", "Validation par Agent Technique"],
        answer: 1,
        explanation: "VAT = Vérification d'Absence de Tension. C'est une étape obligatoire avant tout travail hors tension pour garantir la sécurité.",
      },
      {
        q: "Une soudure froide est reconnaissable à son aspect…",
        options: ["Brillant et lisse", "Terne et grumeleuse", "Sphérique et régulière", "Transparente"],
        answer: 1,
        explanation: "Une soudure froide est terne, grumeleuse ou fissurée (mauvaise mouillabilité). Une bonne soudure est brillante (Sn/Pb) ou légèrement mate (SAC305).",
      },
      {
        q: "Comment tester une diode avec un multimètre ?",
        options: [
          "Mode tension AC, mesurer aux bornes",
          "Mode diode, lire la chute de tension directe (~0.5-0.7V)",
          "Mode continuité, ça bipe dans les deux sens",
          "Mode résistance, lire en kilohms",
        ],
        answer: 1,
        explanation: "Le mode diode affiche la chute de tension directe (~0.5-0.7V Si). Si '1' dans les deux sens = circuit ouvert (diode claquée).",
      },
      {
        q: "Un condensateur électrolytique gonflé (bombé) est…",
        options: ["Normal en fonctionnement chaud", "Défaillant, à remplacer immédiatement", "Simplement saturé, se dégonfle", "Un signe de surcharge passager"],
        answer: 1,
        explanation: "Un condensateur bombé ou avec électrolyte qui fuit est DÉFAILLANT. Il doit être remplacé immédiatement, souvent cause de pannes d'alimentation.",
      },
      {
        q: "Quelle est la méthode de diagnostic par dichotomie ?",
        options: [
          "Tester tous les composants un par un",
          "Diviser le circuit en deux, tester le milieu, recommencer",
          "Remplacer tous les composants suspects",
          "Mesurer uniquement l'alimentation",
        ],
        answer: 1,
        explanation: "La dichotomie divise le circuit en deux et teste le point milieu. Si OK → panne dans la 2e moitié. Si KO → 1re moitié. On répète jusqu'à isoler le composant.",
      },
      {
        q: "À quelle température soude-t-on avec de l'étain sans plomb (SAC305) ?",
        options: ["150–200°C", "220–260°C", "320–380°C", "400–450°C"],
        answer: 2,
        explanation: "L'étain sans plomb SAC305 se soude entre 320–380°C (point de fusion ~217°C + marge). L'étain plombé Sn63/Pb37 se soude à 280–320°C.",
      },
      {
        q: "L'habilitation B1 permet de…",
        options: [
          "Effectuer des consignations électriques",
          "Travailler hors tension sur des ouvrages BT",
          "Superviser uniquement, sans toucher",
          "Intervenir sur la HTA sans restriction",
        ],
        answer: 1,
        explanation: "B1 = électricien habilité qui peut effectuer des travaux hors tension en BT. B2 = prépare et surveille des travaux. BR = dépannage/essais.",
      },
      {
        q: "IP65 signifie…",
        options: [
          "Protégé contre la poussière et les jets d'eau",
          "Protégé contre l'immersion jusqu'à 1m",
          "Non protégé contre l'eau, protégé contre la poussière",
          "Usage maritime uniquement",
        ],
        answer: 0,
        explanation: "IP65 : 6 = étanche total à la poussière, 5 = protégé contre les jets d'eau dans toutes les directions. Convient à l'extérieur protégé.",
      },
    ],
  },

  {
    id: "fabrication",
    label: "Fabrication",
    emoji: "🏭",
    color: "from-green-600 to-teal-600",
    cheatSheet: {
      title: "Aide-mémoire fabrication",
      rows: [
        { formula: "PCB = Printed Circuit Board", label: "Circuit imprimé", note: "substrat FR4 standard" },
        { formula: "THT → patte dans trou", label: "Through Hole", note: "robuste, facile à souder" },
        { formula: "CMS / SMD → surface", label: "Surface Mount", note: "plus petit, automatisable" },
        { formula: "Reflow → four ~245°C", label: "Assemblage CMS", note: "pâte à braser + four" },
        { formula: "Via → trou métallisé", label: "Connexion inter-couches", note: "traversant/borgne/enterré" },
        { formula: "Gerber → fichiers FAB", label: "Fabrication PCB", note: "GTL/GBL + DRL + GTS/GBS" },
        { formula: "IPC-610 Classe 1/2/3", label: "Contrôle qualité", note: "1=grand public, 3=critique" },
        { formula: "Abs. Max Ratings → LIMITE", label: "Datasheet", note: "ne jamais dépasser" },
      ],
    },
    questions: [
      {
        q: "Que signifie PCB ?",
        options: ["Power Control Board", "Printed Circuit Board", "Passive Component Base", "Programmable Control Bus"],
        answer: 1,
        explanation: "PCB = Printed Circuit Board (Circuit Imprimé). C'est un support isolant (FR4) avec des pistes conductrices en cuivre gravées.",
      },
      {
        q: "Le substrat FR4 est composé de…",
        options: ["Aluminium et silicone", "Fibre de verre et résine époxy", "Bakélite et cuivre", "Céramique et polyimide"],
        answer: 1,
        explanation: "FR4 = Flame Retardant 4, un composite de fibre de verre tissée et de résine époxy. C'est le substrat standard pour les PCB basse fréquence.",
      },
      {
        q: "Un via traversant sur un PCB sert à…",
        options: [
          "Monter des composants en surface",
          "Relier électriquement deux couches de cuivre",
          "Marquer la référence du composant",
          "Protéger contre la corrosion",
        ],
        answer: 1,
        explanation: "Un via est un trou percé et métallisé qui permet de passer d'une couche à une autre. Le via traversant traverse tout le PCB de haut en bas.",
      },
      {
        q: "CMS (ou SMD) signifie…",
        options: [
          "Composant Multifonction Standard",
          "Composants Montés en Surface",
          "Circuit Miniaturisé Série",
          "Contrôle Mécanique de Surface",
        ],
        answer: 1,
        explanation: "CMS = Composants Montés en Surface (SMD = Surface Mount Device en anglais). Ces composants se soudent directement sur les pads sans traverser le PCB.",
      },
      {
        q: "Quel procédé utilise-t-on pour assembler des CMS en production ?",
        options: ["Soudure à la vague (wave soldering)", "Four de refusion (reflow)", "Soudure manuelle au fer", "Brasage fort"],
        answer: 1,
        explanation: "Le reflow (refusion) : dépôt de pâte à braser → placement des CMS → passage au four (~245°C pic). La soudure à la vague est plutôt pour les composants THT.",
      },
      {
        q: "Les fichiers Gerber servent à…",
        options: [
          "Simuler le circuit électronique",
          "Décrire la fabrication du PCB pour l'usine",
          "Calculer les valeurs des composants",
          "Programmer les microcontrôleurs",
        ],
        answer: 1,
        explanation: "Les fichiers Gerber (couches cuivre, vernis, sérigraphie, perçage) sont le format standard pour envoyer un PCB en fabrication chez JLCPCB, PCBway, etc.",
      },
      {
        q: "La section 'Absolute Maximum Ratings' d'une datasheet indique…",
        options: [
          "Les valeurs typiques de fonctionnement",
          "Le prix maximum du composant",
          "Les limites à ne jamais dépasser sous peine de destruction",
          "La fréquence maximale du signal d'entrée",
        ],
        answer: 2,
        explanation: "Absolute Maximum Ratings = limites absolues (tension max, courant max, température). Les dépasser, même brièvement, peut détruire définitivement le composant.",
      },
      {
        q: "La norme IPC-610 concerne…",
        options: [
          "Le perçage des PCB",
          "L'acceptabilité des assemblages électroniques",
          "La conception des schémas électroniques",
          "Les tensions de test",
        ],
        answer: 1,
        explanation: "IPC-610 (IPC-A-610) définit les critères d'acceptabilité des assemblages électroniques. Elle définit 3 classes : 1 (grand public), 2 (industriel), 3 (critique).",
      },
      {
        q: "Un composant 'tombstone' (pierre tombale) en CMS, c'est…",
        options: [
          "Un composant claqué par surtension",
          "Un composant soulevé d'un côté pendant le reflow",
          "Un condensateur qui explose en four",
          "Un court-circuit entre deux pads",
        ],
        answer: 1,
        explanation: "Le tombstoning survient quand un CMS 2 broches se soulève d'un côté pendant le reflow (tension de surface inégale). C'est un défaut d'assemblage fréquent sur les résistances 0402.",
      },
      {
        q: "Le vernis épargne (solder mask) sur un PCB sert à…",
        options: [
          "Rendre le PCB plus esthétique",
          "Protéger les pistes et éviter les ponts de soudure involontaires",
          "Isoler thermiquement le substrat",
          "Identifier les couches du PCB",
        ],
        answer: 1,
        explanation: "Le solder mask (vert, rouge, bleu…) recouvre toutes les pistes et zones de cuivre sauf les pads. Il prévient les courts-circuits, protège le cuivre de l'oxydation.",
      },
    ],
  },

  {
    id: "math",
    label: "Mathématiques",
    emoji: "∂",
    color: "from-blue-600 to-cyan-600",
    cheatSheet: {
      title: "Table de dérivation",
      rows: [
        { formula: "(xⁿ)' = n·xⁿ⁻¹", label: "Puissance", note: "ex: (x³)' = 3x²" },
        { formula: "(eˣ)' = eˣ", label: "Exponentielle", note: "elle est sa propre dérivée" },
        { formula: "(ln x)' = 1/x", label: "Logarithme", note: "x > 0" },
        { formula: "(sin x)' = cos x", label: "Sinus", note: "sin→cos→−sin→−cos→sin" },
        { formula: "(cos x)' = −sin x", label: "Cosinus" },
        { formula: "(u+v)' = u'+v'", label: "Somme", note: "linéarité" },
        { formula: "(u·v)' = u'v + uv'", label: "Produit", note: "prime×second + premier×prime du second" },
        { formula: "(u/v)' = (u'v − uv') / v²", label: "Quotient", note: "v ≠ 0" },
        { formula: "(f∘g)' = f'(g)·g'", label: "Composée", note: "dériver l'extérieur × dériver l'intérieur" },
        { formula: "∫xⁿ dx = xⁿ⁺¹/(n+1) + C", label: "Primitive puissance", note: "n ≠ −1" },
        { formula: "sin²x + cos²x = 1", label: "Identité trigo fondamentale" },
      ],
    },
    questions: [
      {
        q: "La dérivée de f(x) = x³ est…",
        options: ["3x", "x²", "3x²", "x³/3"],
        answer: 2,
        explanation: "Règle : (xⁿ)' = n·xⁿ⁻¹. Donc (x³)' = 3·x² = 3x².",
      },
      {
        q: "La dérivée de f(x) = sin(x) est…",
        options: ["-cos(x)", "cos(x)", "-sin(x)", "tan(x)"],
        answer: 1,
        explanation: "(sin x)' = cos x. À mémoriser absolument : sin → cos → -sin → -cos → sin (cycle de 4).",
      },
      {
        q: "La règle du produit : (u·v)' = ?",
        options: ["u'·v'", "u'·v + u·v'", "u'·v - u·v'", "(u'·v') / (u·v)"],
        answer: 1,
        explanation: "Règle du produit : (u·v)' = u'v + uv'. On dérive le premier × le second, plus le premier × la dérivée du second.",
      },
      {
        q: "La dérivée de f(x) = ln(x) est…",
        options: ["1/x²", "e^x", "1/x", "ln(x)/x"],
        answer: 2,
        explanation: "(ln x)' = 1/x pour x > 0. C'est une formule fondamentale à connaître.",
      },
      {
        q: "La règle de la chaîne : (f∘g)'(x) = ?",
        options: ["f'(x) · g'(x)", "f'(g(x)) · g'(x)", "f(g'(x))", "f'(g(x)) + g'(x)"],
        answer: 1,
        explanation: "Règle de la chaîne (fonction composée) : (f(g(x)))' = f'(g(x)) × g'(x). On dérive l'extérieur, on garde l'intérieur, on multiplie par la dérivée de l'intérieur.",
      },
      {
        q: "∫ x² dx = ?",
        options: ["2x + C", "x³ + C", "x³/3 + C", "3x³ + C"],
        answer: 2,
        explanation: "∫xⁿ dx = xⁿ⁺¹/(n+1) + C. Donc ∫x² dx = x³/3 + C. Ne pas oublier la constante d'intégration C.",
      },
      {
        q: "cos(π/2) = ?",
        options: ["0", "1", "-1", "√2/2"],
        answer: 0,
        explanation: "cos(π/2) = cos(90°) = 0. Le cercle trigonométrique : à 90°, la coordonnée x (cosinus) vaut 0.",
      },
      {
        q: "Une suite géométrique de raison q > 1 est…",
        options: ["Décroissante", "Constante", "Croissante", "Convergente vers 0"],
        answer: 2,
        explanation: "Si q > 1, chaque terme est multiplié par un nombre > 1, donc la suite est strictement croissante (si le premier terme est positif).",
      },
      {
        q: "La dérivée de f(x) = e^(2x) est…",
        options: ["e^(2x)", "2e^(2x)", "e^(2x)/2", "2x·e^(2x)"],
        answer: 1,
        explanation: "Règle de la chaîne : (e^(2x))' = e^(2x) × (2x)' = 2·e^(2x). La dérivée de e^u est u'·e^u.",
      },
      {
        q: "sin²(x) + cos²(x) = ?",
        options: ["0", "2", "1", "sin(2x)"],
        answer: 2,
        explanation: "sin²(x) + cos²(x) = 1 est l'identité trigonométrique fondamentale (relation de Pythagore sur le cercle trigonométrique).",
      },
    ],
  },

  {
    id: "mixed",
    label: "Défi mixte",
    emoji: "🎯",
    color: "from-pink-600 to-purple-600",
    cheatSheet: {
      title: "Rappels essentiels",
      rows: [
        { formula: "U = R × I", label: "Loi d'Ohm" },
        { formula: "P = U × I", label: "Puissance" },
        { formula: "(xⁿ)' = n·xⁿ⁻¹", label: "Dérivée puissance" },
        { formula: "(sin x)' = cos x", label: "Dérivée sin" },
        { formula: "τ = R × C", label: "Constante de temps RC" },
        { formula: "Voltmètre → parallèle", label: "Mesure tension" },
        { formula: "Via → trou métallisé", label: "PCB inter-couches" },
        { formula: "IP XY → protection", label: "Indice de protection" },
      ],
    },
    questions: [],
  },
];

// Build "mixed" category by sampling 2-3 questions from each category
const allQuestions = QUIZ_CATEGORIES.filter((c) => c.id !== "mixed").flatMap((c) => c.questions);
const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
QUIZ_CATEGORIES.find((c) => c.id === "mixed")!.questions = shuffled.slice(0, 10);
