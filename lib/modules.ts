import { CourseModule } from "@/types";

export const courseModules: CourseModule[] = [
  {
    id: "foundations",
    subject: "electronics" as const,
    title: "Lois fondamentales",
    summary: "Loi d'Ohm, puissance électrique, Kirchhoff et résistances en série/parallèle.",
    notions: [
      "La tension U (en volts) est la 'pression' électrique entre deux points",
      "Le courant I (en ampères) est le débit d'électrons dans le circuit",
      "La résistance R (en ohms Ω) s'oppose au passage du courant",
      "Loi des mailles : la somme des tensions dans une boucle fermée = 0",
      "Loi des nœuds : la somme des courants entrants = courants sortants",
    ],
    formulas: ["U = R × I", "P = U × I", "Vout = Vin × R2/(R1+R2)"],
    formulaDetails: [
      {
        expr: "U = R × I",
        use: "Calculer la tension aux bornes d'une résistance connaissant le courant qui la traverse. Aussi écrite I = U/R (trouver le courant) ou R = U/I (identifier une résistance inconnue).",
        tip: "Astuce : imagine une tuyauterie — U est la pression, I le débit, R le rétrécissement du tuyau.",
      },
      {
        expr: "P = U × I",
        use: "Calculer la puissance dissipée en chaleur. Permet de vérifier qu'un composant ne brûle pas (ex : résistance 1/4 W ne doit pas dépasser 0.25 W).",
        tip: "Équivalences : P = R × I² ou P = U² / R. Utiles quand tu n'as pas les trois grandeurs.",
      },
      {
        expr: "Req = R1 + R2",
        use: "Résistances en série — même courant, tensions qui s'additionnent. La résistance totale augmente.",
      },
      {
        expr: "1/Req = 1/R1 + 1/R2",
        use: "Résistances en parallèle — même tension, courants qui se divisent. La résistance totale diminue toujours en dessous de la plus petite.",
      },
      {
        expr: "Vout = Vin × R2 / (R1 + R2)",
        use: "Diviseur de tension : obtenir une tension inférieure à Vin sans ampli. Utilisé pour adapter des niveaux logiques, polariser un transistor, lire un capteur résistif.",
        tip: "R2 est la résistance côté GND. Plus R2 est grande, plus Vout est proche de Vin.",
      },
    ],
    lesson: {
      analogy:
        "Imagine un tuyau d'eau : la tension U est la pression de l'eau, le courant I est le débit qui coule, et la résistance R est le rétrécissement du tuyau. Plus il est étroit, moins d'eau passe — et plus la pression y est grande.",
      diagramId: "ohm",
      diagramCaption: "Circuit simple : batterie 12 V, résistance 470 Ω. Le courant I = U/R circule dans la boucle.",
      steps: [
        "Comprendre les 3 grandeurs : U (volts) = tension, c'est la 'force' qui pousse les électrons. I (ampères) = courant, c'est la quantité d'électrons qui circule par seconde. R (ohms) = résistance, c'est ce qui s'oppose à ce passage.",
        "La loi d'Ohm les relie : U = R × I. Si tu connais deux valeurs, tu calcules la troisième. Exemple : R = 470 Ω, U = 12 V → I = 12 / 470 ≈ 25 mA.",
        "Résistances en série (bout à bout) : les tensions s'additionnent, le courant est identique partout. Req = R1 + R2. C'est comme mettre deux rétrécissements de tuyau à la suite.",
        "Résistances en parallèle (côte à côte) : la tension est la même aux bornes de chaque résistance, les courants se divisent. Req = (R1 × R2)/(R1 + R2). Req est toujours inférieure à la plus petite résistance.",
        "Le diviseur de tension : deux résistances en série permettent d'obtenir une tension intermédiaire. Vout = Vin × R2/(R1+R2). Très utilisé pour adapter des niveaux de signal.",
        "La puissance dissipée par une résistance : P = U × I (en watts). Si P dépasse la valeur de la résistance (ex. 0.25 W pour une résistance 1/4 W), elle surchauffe. Toujours vérifier !",
      ],
    },
    example:
      "Vin = 12 V, R1 = 1 kΩ, R2 = 2 kΩ → Vout = 12 × 2/(1+2) = 8 V. Courant total = 12/3000 = 4 mA.",
    qa: [
      {
        keywords: ["ohm", "formule", "loi", "tension", "courant", "résistance"],
        answer:
          "La loi d'Ohm dit que U = R × I. Si tu connais deux des trois grandeurs (U, R, I), tu peux toujours calculer la troisième. Exemple : R = 470 Ω, I = 10 mA → U = 470 × 0.01 = 4.7 V.",
      },
      {
        keywords: ["puissance", "watt", "chauffe", "brûle", "dissipe"],
        answer:
          "La puissance se calcule avec P = U × I (en watts). Une résistance 1/4 W peut dissiper max 0.25 W. Si P calculée > valeur de la résistance, elle surchauffe. Exemple : U = 5 V, I = 100 mA → P = 0.5 W → il faut une résistance 1 W minimum.",
      },
      {
        keywords: ["série", "addition", "s'additionne"],
        answer:
          "En série, les résistances s'additionnent : Req = R1 + R2 + ... Le courant est identique dans tous les composants, mais la tension se répartit proportionnellement aux résistances.",
      },
      {
        keywords: ["parallèle", "diminue", "branche"],
        answer:
          "En parallèle, la résistance équivalente est toujours inférieure à la plus petite résistance. Pour deux résistances : Req = (R1 × R2)/(R1 + R2). La tension est la même aux bornes de chaque branche.",
      },
      {
        keywords: ["diviseur", "vout", "vin", "adapter"],
        answer:
          "Le diviseur de tension Vout = Vin × R2/(R1+R2) sert à réduire une tension. Par exemple pour adapter une sortie 5 V vers une entrée 3.3 V d'un microcontrôleur : R1 = 10 kΩ, R2 = 20 kΩ → Vout = 5 × 20/30 ≈ 3.33 V.",
      },
      {
        keywords: ["kirchhoff", "maille", "nœud", "boucle"],
        answer:
          "Kirchhoff (mailles) : la somme des tensions dans une boucle fermée = 0. Kirchhoff (nœuds) : ce qui entre = ce qui sort en courant. Ces deux lois permettent de résoudre n'importe quel circuit complexe.",
      },
    ],
  },

  {
    id: "passive",
    subject: "electronics" as const,
    title: "Composants passifs",
    summary: "Condensateurs (charge/décharge, τ = RC) et bobines (inductance).",
    notions: [
      "Le condensateur stocke de l'énergie sous forme de champ électrique",
      "Il se charge progressivement selon une courbe exponentielle",
      "À t = τ (1 tau), le condensateur atteint ~63% de la tension finale",
      "À t = 5τ, il est considéré chargé à ~99%",
      "La bobine s'oppose aux variations brusques de courant",
    ],
    formulas: ["τ = R × C", "uC(t) = Umax(1−e^(−t/RC))"],
    formulaDetails: [
      {
        expr: "τ = R × C",
        use: "Calculer la constante de temps d'un circuit RC. Elle détermine la vitesse de charge/décharge du condensateur. Unités : R en ohms, C en farads → τ en secondes.",
        tip: "Pour un délai d'1 seconde, utilise par exemple R = 10 kΩ et C = 100 µF (10 000 × 0.0001 = 1 s).",
      },
      {
        expr: "uC(t) = Umax × (1 − e^(−t/RC))",
        use: "Donne la tension aux bornes du condensateur à l'instant t pendant la charge. À t = τ : uC ≈ 0.63 × Umax. À t = 5τ : uC ≈ 0.99 × Umax.",
      },
      {
        expr: "uC(t) = U0 × e^(−t/RC)",
        use: "Tension pendant la décharge depuis U0. Le condensateur libère son énergie selon une décroissance exponentielle.",
      },
      {
        expr: "uL = L × (di/dt)",
        use: "Tension aux bornes d'une bobine proportionnelle à la variation du courant. Si le courant change vite, la bobine génère une tension élevée (risque de surtension lors de coupures).",
        tip: "C'est pour cela qu'on met une diode de roue libre en parallèle avec une bobine (relais, moteur).",
      },
    ],
    lesson: {
      analogy:
        "Un condensateur, c'est comme un réservoir d'eau : il se remplit progressivement, au début très vite, puis de plus en plus lentement. La résistance en série est comme un robinet qui limite le débit de remplissage.",
      diagramId: "rc",
      diagramCaption: "Circuit RC : la résistance limite le courant de charge. Uc monte en courbe exponentielle.",
      steps: [
        "Le condensateur stocke de l'énergie sous forme de charge électrique. Sa capacité C se mesure en Farads (F) — en pratique µF, nF ou pF. Il ne laisse pas passer le courant continu une fois chargé.",
        "La constante de temps τ = R × C (en secondes si R en ohms et C en farads) détermine la vitesse de charge. C'est le temps pour atteindre 63% de la tension finale.",
        "La charge suit une courbe exponentielle : Uc(t) = E × (1 − e^(−t/τ)). À t = τ : 63%. À t = 2τ : 86%. À t = 5τ : 99% → on considère le condensateur 'chargé'.",
        "La décharge est aussi exponentielle mais décroissante : Uc(t) = U0 × e^(−t/τ). Le condensateur restitue son énergie progressivement.",
        "La bobine (inductance) est le dual du condensateur : elle s'oppose aux variations brusques de COURANT (pas de tension). Sa loi : uL = L × (di/dt). Toujours ajouter une diode de protection en parallèle sur une bobine !",
      ],
    },
    example:
      "R = 47 kΩ, C = 10 µF → τ = 47 000 × 0.00001 = 0.47 s. Le condensateur est 'chargé' (99%) après 5 × 0.47 = 2.35 s.",
    qa: [
      {
        keywords: ["tau", "constante", "temps", "rc"],
        answer:
          "τ = R × C en secondes. C'est le temps pour atteindre 63% de la tension finale. En pratique, on considère le circuit 'stabilisé' après 5τ. Exemple : R = 10 kΩ, C = 100 µF → τ = 1 s → stable après 5 s.",
      },
      {
        keywords: ["charge", "décharge", "exponentielle", "courbe"],
        answer:
          "La charge suit uC(t) = Umax × (1 − e^(−t/RC)). La décharge suit uC(t) = U0 × e^(−t/RC). Ces courbes sont exponentielles : rapides au début, lentes à la fin.",
      },
      {
        keywords: ["condensateur", "capacité", "stocke", "energie"],
        answer:
          "Un condensateur stocke de l'énergie électrique. Sa capacité C se mesure en Farads (F). En pratique on utilise µF (micro), nF (nano) ou pF (pico). Formule : Q = C × U (charge en coulombs).",
      },
      {
        keywords: ["bobine", "inductance", "opposition", "courant"],
        answer:
          "Une bobine résiste aux changements brusques de courant (propriété d'inertie électrique). Sa tension est uL = L × (di/dt). Utilisée dans les filtres, les alimentations à découpage, et les transformateurs.",
      },
      {
        keywords: ["diode", "roue libre", "surtension", "protection"],
        answer:
          "Quand on coupe le courant dans une bobine, elle génère une surtension qui peut détruire les composants. On protège le circuit avec une diode de roue libre (roue libre) en antiparallèle avec la bobine.",
      },
    ],
  },

  {
    id: "diodes",
    subject: "electronics" as const,
    title: "Diodes",
    summary: "Diode classique, Zener (régulation) et LED avec résistance de protection.",
    notions: [
      "Une diode laisse passer le courant dans un sens uniquement (anode → cathode)",
      "Seuil de conduction : ~0.7 V pour le silicium, ~0.3 V pour Schottky",
      "La diode Zener conduit en inverse à partir de sa tension Vz",
      "La LED est une diode qui émet de la lumière quand elle conduit",
      "Toujours mettre une résistance en série avec une LED !",
    ],
    formulas: ["R_LED = (Vcc − Vf) / I_LED"],
    formulaDetails: [
      {
        expr: "R_LED = (Vcc − Vf) / I_LED",
        use: "Calculer la résistance de protection pour une LED. Vcc = tension d'alimentation, Vf = chute de tension directe de la LED (2 V rouge, 3.2 V bleue/blanche), I_LED = courant souhaité (typiquement 10–20 mA).",
        tip: "Toujours choisir la valeur normalisée E24 supérieure pour ne pas dépasser le courant max de la LED.",
      },
      {
        expr: "Vout ≈ Vz",
        use: "La diode Zener maintient une tension constante Vz à ses bornes en polarisation inverse. Utilisée pour stabiliser une alimentation, créer une tension de référence ou protéger une entrée.",
      },
      {
        expr: "If > 0 si Vd > Vf",
        use: "Une diode classique ne conduit (If > 0) que si la tension appliquée dépasse son seuil Vf (~0.7 V Si). En dessous, elle est bloquée.",
      },
    ],
    lesson: {
      analogy:
        "Une diode, c'est comme un clapet anti-retour sur un tuyau d'eau : le liquide passe dans un sens, mais est bloqué dans l'autre. La diode est un 'sens unique' pour le courant électrique.",
      diagramId: "led",
      diagramCaption: "Circuit LED : la résistance R limite le courant pour protéger la LED.",
      steps: [
        "La diode laisse passer le courant de l'anode (A, patte longue d'une LED) vers la cathode (K, patte courte). Dans l'autre sens, elle bloque.",
        "Pour conduire, une diode silicium a besoin d'au moins 0.7 V (c'est son seuil Vf). Pour une LED, ce seuil dépend de la couleur : rouge ≈ 2 V, vert ≈ 2.1 V, bleu/blanc ≈ 3.2 V.",
        "Ne jamais brancher une LED directement sur une alimentation ! Sans résistance de protection, le courant monte jusqu'à brûler la LED. Toujours calculer R = (Vcc − Vf) / I avec I typiquement 10–20 mA.",
        "La diode Zener est une diode spéciale qui conduit en inverse à partir d'une tension précise (Vz = 3.3 V, 5.1 V, etc.). Elle sert à réguler ou stabiliser une tension. Exemple : Vz = 5.1 V → Vout = 5.1 V quelle que soit la charge.",
        "Pour identifier les broches d'une diode : la bande blanche sur le boîtier marque la cathode (K). Pour une LED : patte longue = anode (+), patte courte = cathode (−).",
      ],
    },
    example:
      "LED bleue (Vf = 3.2 V) sur alimentation 5 V, I = 15 mA → R = (5 − 3.2) / 0.015 = 120 Ω. On choisit 150 Ω (sécurité).",
    qa: [
      {
        keywords: ["led", "résistance", "calcul", "série"],
        answer:
          "Formule : R = (Vcc − Vf) / I. Vf dépend de la couleur : rouge ≈ 1.8–2.2 V, vert/jaune ≈ 2.1 V, bleu/blanc ≈ 3–3.4 V. I typique = 10–20 mA (0.01–0.02 A). Exemple : 5V, LED rouge 2V, I = 20 mA → R = (5−2)/0.02 = 150 Ω.",
      },
      {
        keywords: ["zener", "régulation", "stabiliser", "référence"],
        answer:
          "La Zener conduit en inverse à partir de sa tension de claquage Vz (ex: 5.1 V). Elle maintient Vout ≈ Vz tant que le courant est suffisant. Circuit : R de limitation en série avec la Zener entre Vcc et GND, Vout pris aux bornes de la Zener.",
      },
      {
        keywords: ["seuil", "0.7", "conduction", "bloquée"],
        answer:
          "La diode silicium a un seuil à ~0.7 V. En dessous, elle est bloquée (pas de courant). Au-dessus, elle conduit avec une chute quasi-constante de 0.7 V. La diode Schottky a un seuil plus bas (~0.2–0.4 V) et est plus rapide.",
      },
      {
        keywords: ["sens", "anode", "cathode", "polarité"],
        answer:
          "La diode conduit de l'anode (A, triangle) vers la cathode (K, barre). Sur une LED, la patte longue est l'anode (+), la patte courte est la cathode (−). Sur un boîtier, la bande blanche marque la cathode.",
      },
    ],
  },

  {
    id: "transistors",
    subject: "electronics" as const,
    title: "Transistors BJT",
    summary: "NPN/PNP, modes bloqué/actif/saturé, commutation et amplification.",
    notions: [
      "Le transistor BJT a 3 broches : Base (B), Collecteur (C), Émetteur (E)",
      "NPN : courant de base positif → courant collecteur amplifié",
      "Gain en courant β (hFE) : typiquement 50–500",
      "Mode bloqué (OFF) : Ib ≈ 0 → Ic ≈ 0",
      "Mode saturé (ON) : Ic max, Vce ≈ 0.2 V",
      "Mode actif : zone d'amplification linéaire",
    ],
    formulas: ["Ic ≈ β × Ib", "Rb = (Vcmd − 0.7) / Ib"],
    formulaDetails: [
      {
        expr: "Ic ≈ β × Ib",
        use: "En mode actif, le courant collecteur est le gain β multiplié par le courant de base. β est indiqué sur la fiche technique (datasheet). Sert pour calculer le point de fonctionnement d'un amplificateur.",
        tip: "En commutation, on force une sursaturation (Ib > Ic/β) pour garantir que le transistor est bien 'fermé'.",
      },
      {
        expr: "Rb = (Vcmd − Vbe) / Ib",
        use: "Calculer la résistance de base pour piloter un transistor en commutation. Vcmd = tension de commande (ex : 3.3 V ou 5 V), Vbe = 0.7 V, Ib = Ic_charge / β_sat (avec β_sat = 10 pour une bonne marge).",
        tip: "Toujours diviser β par 5 à 10 en commutation (β_sat) pour s'assurer que le transistor sature bien même avec des variations de β.",
      },
      {
        expr: "Ie = Ic + Ib",
        use: "Le courant d'émetteur est la somme des courants de collecteur et de base. Dans les calculs pratiques (Ic >> Ib), on approxime Ie ≈ Ic.",
      },
    ],
    lesson: {
      analogy:
        "Le transistor BJT est un robinet électronique : une toute petite commande (courant de base) contrôle un grand débit (courant collecteur). C'est comme une vanne d'eau hydraulique pilotée par une pression de commande.",
      diagramId: "transistor",
      diagramCaption: "Transistor NPN en commutation : Ib commande Ic. La résistance Rb protège la base.",
      steps: [
        "Le transistor BJT a 3 broches : Base (B) = l'entrée de commande, Collecteur (C) = là où arrive le courant principal, Émetteur (E) = la sortie (reliée au GND pour un NPN).",
        "NPN en commutation : si Ib ≈ 0 → transistor bloqué (interrupteur ouvert, Ic = 0). Si on injecte Ib suffisant → transistor saturé (interrupteur fermé, Ic = max et Vce ≈ 0.2 V).",
        "Le gain β (ou hFE) relie base et collecteur : Ic = β × Ib. β vaut typiquement 50 à 500 selon le transistor. Toujours vérifier la fiche technique (datasheet).",
        "Pour calculer la résistance de base Rb : 1) Trouver le courant Ic de la charge. 2) Choisir β_sat = 10 (sécurité). 3) Ib = Ic / β_sat. 4) Rb = (Vcmd − 0.7) / Ib.",
        "Toujours protéger les charges inductives (relais, moteur) avec une diode de roue libre (1N4007) en antiparallèle : anode côté collecteur, cathode côté VCC. Sans elle, la bobine génère une surtension qui détruit le transistor.",
        "PNP : même principe mais tout est inversé. Le courant de base va de l'émetteur vers la base. La charge est côté émetteur (VCC). Moins courant que NPN mais utile pour les commandes 'high-side'.",
      ],
    },
    example:
      "Commande d'un relais (Ic = 100 mA) depuis une GPIO 3.3 V. β_sat = 10 → Ib = 10 mA. Rb = (3.3 − 0.7)/0.01 = 260 Ω → choisir 270 Ω.",
    qa: [
      {
        keywords: ["npn", "pnp", "différence"],
        answer:
          "NPN : courant de base (B→E) déclenche un courant C→E. C'est le plus courant. PNP : courant de base (E→B) déclenche un courant E→C. La commande est 'active basse'. Pour choisir : NPN si la commande est côté GND (lowside switch), PNP si elle est côté Vcc (highside switch).",
      },
      {
        keywords: ["beta", "gain", "amplification", "hfe"],
        answer:
          "β (ou hFE) est le gain en courant du transistor. Ic = β × Ib. Un β de 100 signifie qu'1 mA de base déclenche 100 mA au collecteur. β varie avec la température et le courant — consulte toujours la datasheet.",
      },
      {
        keywords: ["saturation", "commutation", "switch", "interrupteur"],
        answer:
          "En saturation, le transistor est complètement 'fermé' (comme un interrupteur ON). Vce ≈ 0.2 V, le courant collecteur est max. Pour saturer, on fournit plus de courant de base que β_normal nécessite (on 'force' avec β_sat = 10). Rb = (Vcmd − 0.7) / Ib_sat.",
      },
      {
        keywords: ["résistance", "base", "calcul", "rb"],
        answer:
          "Pour calculer Rb : 1) Identifie le courant à commuter Ic. 2) Choisis β_sat = 10 (sécurité). 3) Ib = Ic / β_sat. 4) Rb = (Vcmd − 0.7) / Ib. Exemple : Ic = 500 mA, Vcmd = 5 V → Ib = 50 mA → Rb = (5−0.7)/0.05 = 86 Ω → choisir 82 Ω.",
      },
      {
        keywords: ["relais", "moteur", "piloter", "charge"],
        answer:
          "Pour piloter une charge inductive (relais, moteur) : 1) Utilise un transistor NPN en commutation. 2) Calcule Rb selon le courant de la bobine. 3) Ajoute une diode de roue libre (1N4007) en antiparallèle avec la charge pour protéger le transistor des surtensions.",
      },
    ],
  },

  {
    id: "kirchhoff",
    subject: "electronics" as const,
    title: "Lois de Kirchhoff",
    summary: "Analyser n'importe quel circuit complexe avec les lois des nœuds et des mailles.",
    notions: [
      "Loi des nœuds (KCL) : la somme des courants entrant dans un nœud = somme des courants sortants",
      "Loi des mailles (KVL) : la somme algébrique des tensions dans une boucle fermée = 0",
      "Un nœud est un point de connexion entre ≥ 2 branches",
      "Une maille est un chemin fermé dans le circuit",
      "On peut orienter les courants arbitrairement (un résultat négatif = sens opposé, c'est normal)",
    ],
    formulas: ["ΣI_entrant = ΣI_sortant", "ΣU = 0 (maille fermée)"],
    formulaDetails: [
      {
        expr: "ΣI_entrant = ΣI_sortant",
        use: "Loi des nœuds (KCL) : en tout nœud du circuit, le courant total qui entre est égal au courant total qui sort. C'est une conséquence directe de la conservation de la charge électrique.",
        tip: "Méthode : attribue un sens au courant dans chaque branche (flèche). KCL donne autant d'équations qu'il y a de nœuds − 1.",
      },
      {
        expr: "ΣU = 0 (maille fermée)",
        use: "Loi des mailles (KVL) : en parcourant une boucle fermée, la somme des tensions est nulle. Les générateurs ajoutent de la tension, les résistances en consomment.",
        tip: "Convention : une source dans le sens de parcours est +, à contre-sens est −. Une chute R×I est − dans le sens du courant choisi.",
      },
      {
        expr: "U_source = R1×I1 + R2×I2 + …",
        use: "Forme développée de KVL pour une maille : la tension de la source est égale à la somme des chutes de tension sur chaque résistance traversée.",
      },
    ],
    lesson: {
      analogy:
        "Kirchhoff, c'est la comptabilité de l'électricité : 'ce qui entre doit sortir' (nœuds = bilan courant) et 'les gains = les pertes' (mailles = bilan tension). Aucun électron ne se perd, aucune tension ne disparaît.",
      steps: [
        "Loi des nœuds (KCL) : en tout point de jonction du circuit, la somme des courants entrants égale la somme des courants sortants. ΣI_entrant = ΣI_sortant. C'est la conservation de la charge.",
        "Méthode KCL : attribue une flèche (sens arbitraire) à chaque courant de branche. Écris l'équation pour chaque nœud. Si un résultat est négatif, le courant réel est dans le sens inverse — c'est normal !",
        "Loi des mailles (KVL) : en parcourant n'importe quelle boucle fermée, la somme algébrique de toutes les tensions est nulle. ΣU = 0.",
        "Méthode KVL : choisis un sens de parcours (horaire ou antihoraire). Les sources rencontrées dans leur sens de flèche sont positives. Les chutes sur les résistances (R×I) sont négatives dans le sens du courant.",
        "Application : un circuit à 2 mailles et 3 inconnues → écrire 1 équation KCL + 2 équations KVL → système de 3 équations → résoudre par substitution.",
        "Vérification : une fois trouvé, remplace les valeurs dans toutes tes équations. Toutes doivent être vérifiées, sinon il y a une erreur de signe quelque part.",
      ],
    },
    example:
      "Circuit : 12 V, R1=4 Ω, R2=8 Ω en série. KVL : 12 = 4I + 8I → I = 1 A. U_R1 = 4 V, U_R2 = 8 V. Vérif : 4+8 = 12 V ✓",
    qa: [
      {
        keywords: ["nœud", "kcl", "courant", "entrant", "sortant"],
        answer:
          "KCL (Kirchhoff Current Law) : en un nœud, ΣI_entrant = ΣI_sortant. Exemple : si I1 = 3 A et I2 = 2 A entrent, alors I3 = 5 A sort. C'est la conservation de la charge : les électrons ne disparaissent pas dans un nœud.",
      },
      {
        keywords: ["maille", "kvl", "tension", "boucle"],
        answer:
          "KVL (Kirchhoff Voltage Law) : en parcourant une boucle fermée, ΣU = 0. En pratique : U_source = U_R1 + U_R2 + … Méthode : 1) Choisir un sens de parcours. 2) Sommer les tensions avec leur signe. 3) Résoudre l'équation.",
      },
      {
        keywords: ["méthode", "résolution", "circuit", "complexe", "analyser"],
        answer:
          "Méthode générale : 1) Identifier les nœuds et attribuer des courants. 2) KCL sur chaque nœud (sauf un). 3) KVL sur chaque maille indépendante. 4) Résoudre le système. Un courant négatif = sens réel opposé à celui supposé, c'est normal.",
      },
      {
        keywords: ["série", "parallèle", "kirchhoff"],
        answer:
          "Kirchhoff unifie série et parallèle : en série KCL dit que le courant est identique partout. En parallèle, KVL dit que la tension est identique aux bornes de chaque branche.",
      },
    ],
  },

  {
    id: "rc-filters",
    subject: "electronics" as const,
    title: "Filtres RC",
    summary: "Passe-bas et passe-haut : fréquence de coupure, comportement en fréquence, applications.",
    notions: [
      "Un filtre RC laisse passer certaines fréquences et en atténue d'autres",
      "Passe-bas : laisse les basses fréquences, coupe les hautes (R série + C vers GND)",
      "Passe-haut : laisse les hautes fréquences, coupe les basses (C série + R vers GND)",
      "À la fréquence de coupure fc, le signal est atténué à 70.7% (−3 dB)",
      "La pente d'atténuation est de −20 dB par décade (×10 en fréquence)",
    ],
    formulas: ["fc = 1 / (2π × R × C)", "Vout/Vin = 1/√(1+(f/fc)²)"],
    formulaDetails: [
      {
        expr: "fc = 1 / (2π × R × C)",
        use: "Calcule la fréquence de coupure du filtre RC. En dessous de fc (passe-bas) ou au-dessus (passe-haut), le signal passe quasi intact. À fc, il est à 70.7% de son amplitude (−3 dB).",
        tip: "Simplification : fc ≈ 0.159 / (R × C). Pour fc = 1 kHz avec R = 10 kΩ → C = 0.159/10000/1000 ≈ 16 nF → choisir 15 nF.",
      },
      {
        expr: "Vout/Vin = 1/√(1+(f/fc)²)",
        use: "Gain en amplitude du filtre passe-bas selon la fréquence f. À f << fc : gain ≈ 1. À f = fc : gain = 0.707. À f = 10 × fc : gain ≈ 0.1 (−20 dB, très atténué).",
      },
      {
        expr: "φ = −arctan(f/fc)",
        use: "Déphasage introduit par le filtre passe-bas. À fc : φ = −45°. Peut affecter les systèmes audio ou de mesure si mal pris en compte.",
      },
      {
        expr: "τ = RC = 1/(2π·fc)",
        use: "La constante de temps RC est l'inverse de 2π×fc. Le même circuit RC sert de filtre (fréquentiel) et de circuit de charge/décharge (temporel). Un seul composant, deux usages.",
        tip: "Filtre passe-bas en régime sinusoïdal = intégrateur en régime impulsionnel.",
      },
    ],
    lesson: {
      analogy:
        "Un filtre RC, c'est comme un filtre de café : le papier laisse passer le liquide (basses fréquences = passe-bas) mais retient le marc (hautes fréquences). En électronique, la 'taille des trous' est réglée par R et C.",
      diagramId: "rc-filter",
      diagramCaption: "Filtre passe-bas RC : R en série, C vers la masse. La fréquence de coupure fc sépare ce qui passe de ce qui est atténué.",
      steps: [
        "Un signal électrique peut être composé de plusieurs fréquences (basses, hautes). Un filtre laisse passer certaines et atténue les autres.",
        "Filtre passe-bas RC : R en série avec la source, C en parallèle vers GND. Le condensateur court-circuite les hautes fréquences vers la masse. À basse fréquence, Xc est grand → Vout ≈ Vin. À haute fréquence, Xc ≈ 0 → Vout ≈ 0.",
        "Filtre passe-haut RC : C en série, R vers GND. Inverse du passe-bas. Bloque le courant continu (DC) et les basses fréquences. Utilisé en audio pour couper le 'fond de bruit'.",
        "La fréquence de coupure fc = 1 / (2π × R × C). C'est la fréquence limite à laquelle le signal est atténué de 3 dB (70.7% de son amplitude). Au-delà (passe-bas) : −20 dB par décade.",
        "Calcul pratique : fc = 0.159 / (R × C). Pour fc = 1 kHz avec R = 10 kΩ → C = 0.159 / (10 000 × 1 000) ≈ 16 nF.",
        "Application courante : un microcontrôleur lit un capteur bruité → filtre passe-bas avant l'entrée ADC. Un ampli audio → filtre passe-haut pour couper le DC. Un signal carré → filtre → signal triangulaire ou sinusoïdal approché.",
      ],
    },
    example:
      "R = 10 kΩ, C = 10 nF → fc = 1/(2π × 10 000 × 10×10⁻⁹) ≈ 1 592 Hz ≈ 1.6 kHz. Tout signal au-dessus de 1.6 kHz sera atténué.",
    qa: [
      {
        keywords: ["fréquence", "coupure", "calcul", "fc"],
        answer:
          "fc = 1 / (2π × R × C). Exemples : R=10kΩ + C=16nF → fc≈1kHz. R=100kΩ + C=160nF → fc≈10Hz. R=1kΩ + C=160pF → fc≈1MHz. Plus R ou C est grand, plus fc est basse (filtre 'lent').",
      },
      {
        keywords: ["passe-bas", "basses", "fréquences", "coupe"],
        answer:
          "Filtre passe-bas RC : R en série, C en parallèle vers GND. À basse fréquence, le condensateur a une impédance élevée → toute la tension passe en Vout. À haute fréquence, l'impédance du condensateur chute → court-circuit → Vout ≈ 0 V.",
      },
      {
        keywords: ["passe-haut", "hautes", "grave", "dc"],
        answer:
          "Filtre passe-haut RC : C en série, R en parallèle vers GND. À haute fréquence : le condensateur laisse passer → signal transmis. À basse fréquence : le condensateur bloque → Vout ≈ 0 V. Très utilisé pour bloquer la composante continue (DC blocking en audio).",
      },
      {
        keywords: ["application", "utilisation", "quoi", "sert"],
        answer:
          "Filtres RC utilisés partout : 1) Anti-aliasing avant un ADC (microcontrôleur). 2) Filtre audio (couper les aigus/graves). 3) Débouncing de bouton. 4) Séparation AC/DC. 5) Retard avec comparateur. 6) Génération de signal triangulaire à partir d'un carré.",
      },
      {
        keywords: ["db", "décibel", "atténuation", "gain"],
        answer:
          "−3 dB ↔ facteur 0.707 en tension. −20 dB ↔ facteur 0.1. À 10×fc (passe-bas), l'atténuation est d'environ −20 dB. La pente d'un filtre RC 1er ordre est −20 dB/décade (−6 dB/octave en audio).",
      },
    ],
  },
  /* ─────────────── AOP ─────────────── */
  {
    id: "op-amp",
    subject: "electronics" as const,
    title: "Amplificateur opérationnel (AOP)",
    summary: "Fonctionnement idéal de l'AOP, montages inverseur et non-inverseur, comparateur.",
    notions: [
      "L'AOP idéal a un gain différentiel infini, une impédance d'entrée infinie et une impédance de sortie nulle",
      "Règles d'or : la tension entre + et − est nulle (V+ = V−), aucun courant n'entre dans les entrées",
      "Montage inverseur : la sortie est l'opposé amplifié de l'entrée",
      "Montage non-inverseur : amplifie sans inverser le signe",
      "Comparateur : compare V+ et V−, sature en haute ou basse tension",
    ],
    formulas: [
      "Av = −R2/R1 (inverseur)",
      "Av = 1 + R2/R1 (non-inverseur)",
      "Vout = Av × Vin",
    ],
    formulaDetails: [
      {
        expr: "Av = −R2/R1",
        use: "Gain du montage inverseur. Le signe − indique que la sortie est déphasée de 180°. Ex : R1=10kΩ, R2=100kΩ → Av = −10 (amplification × 10 avec inversion).",
        tip: "Règle d'or : V− = V+ = 0V (entrée + à GND). Tout le courant traversant R1 passe dans R2.",
      },
      {
        expr: "Av = 1 + R2/R1",
        use: "Gain du montage non-inverseur. Toujours ≥ 1. La sortie suit l'entrée avec le même signe.",
        tip: "Si R2=0 (court-circuit) et R1=∞ (absent) → Av=1 : c'est un suiveur de tension, très utile pour isoler des étages.",
      },
      {
        expr: "Vout = Av × Vin",
        use: "Tension de sortie = gain × entrée. Attention : en pratique limitée par les rails d'alimentation (ex : ±12V). Si Vout calculé dépasse les rails, l'AOP sature.",
        tip: "Un AOP alimenté en ±15V ne peut pas donner Vout = 50V même si Av × Vin = 50V.",
      },
    ],
    lesson: {
      analogy:
        "L'AOP est comme un chef d'orchestre avec une règle absolue : il fait tout pour que V+ et V− soient égales. Si V+ > V−, il monte la sortie. Si V+ < V−, il la baisse. Le réseau de résistances autour de lui détermine comment ce 'rattrapage' se traduit en gain.",
      diagramId: "op-amp",
      diagramCaption: "Montage non-inverseur : Vout = (1 + R2/R1) × Vin. R1 et R2 fixent le gain.",
      steps: [
        "L'AOP idéal a 2 entrées : V+ (non-inverseuse, +) et V− (inverseuse, −), et une sortie. Son gain interne est quasi-infini, mais on le limite avec un réseau de contre-réaction.",
        "Règle d'or n°1 : V+ = V− (la différence est nulle quand l'AOP est en régime linéaire avec contre-réaction négative). Cette règle est le point de départ de tout calcul d'AOP.",
        "Règle d'or n°2 : aucun courant n'entre dans les entrées + et −. Toute l'entrée est 'vue' comme un circuit ouvert.",
        "Montage inverseur (entrée sur V− via R1, contre-réaction R2) : Av = −R2/R1. Le signe − signifie que la sortie est l'opposé de l'entrée. Utilisation : amplifier un signal en l'inversant.",
        "Montage non-inverseur (entrée sur V+, diviseur R1/R2 sur V−) : Av = 1 + R2/R1. Toujours positif, toujours ≥ 1. La sortie suit l'entrée.",
        "Suiveur de tension : R2=0, R1=infini → Av=1. Vout = Vin exactement. Utilité : isoler deux étages (le suiveur présente une haute impédance d'entrée et une basse impédance de sortie).",
        "Comparateur : sans contre-réaction, l'AOP compare V+ et V−. Si V+ > V−, Vout sature à +Vcc. Si V+ < V−, Vout sature à −Vcc. Utilisé dans les thermostats, détecteurs de seuil, Schmitt triggers.",
      ],
    },
    example:
      "Montage inverseur : R1 = 5 kΩ, R2 = 50 kΩ, Vin = 0.5 V → Av = −50/5 = −10. Vout = −10 × 0.5 = −5 V. La sortie est bien l'opposé amplifié.",
    qa: [
      {
        keywords: ["inverseur", "signe", "phase", "opposé"],
        answer:
          "Le montage inverseur a un gain Av = −R2/R1. Le signe − signifie que Vout = −(R2/R1)×Vin. Si Vin est positif, Vout est négatif. C'est utile pour créer des signaux différentiels ou des soustracteurs.",
      },
      {
        keywords: ["suiveur", "buffer", "impédance", "isoler"],
        answer:
          "Le suiveur de tension est un AOP en montage non-inverseur avec R2=0 et sans R1 → Av=1. Vout = Vin exactement. Sert à 'tamponner' un signal : impédance d'entrée très haute, impédance de sortie très basse, donc pas de chute de tension due à la charge.",
      },
      {
        keywords: ["comparateur", "seuil", "saturation", "comparer"],
        answer:
          "Sans contre-réaction, l'AOP est comparateur : si V+ > V−, Vout ≈ +Vcc. Si V+ < V−, Vout ≈ −Vcc. Utilisé pour détecter un dépassement de seuil (ex : thermostat, détecteur de lumière).",
      },
      {
        keywords: ["règles", "or", "idéal", "courant", "tension"],
        answer:
          "Règles d'or de l'AOP idéal : 1) V+ = V− (la tension différentielle est nulle). 2) I+ = I− = 0 (aucun courant dans les entrées). Ces règles permettent de résoudre n'importe quel circuit AOP linéaire facilement.",
      },
    ],
  },
  /* ─────────────── MAINTENANCE ─────────────── */
  {
    id: "instruments-mesure",
    subject: "electronics" as const,
    title: "Instruments de mesure",
    summary: "Utilisation du multimètre, de l'oscilloscope et du générateur de signaux pour mesurer et diagnostiquer.",
    notions: [
      "Le multimètre mesure la tension (V), le courant (A) et la résistance (Ω) — toujours vérifier le calibre avant de mesurer",
      "En mode voltmètre : se branche EN PARALLÈLE avec le composant (impédance interne très élevée)",
      "En mode ampèremètre : se branche EN SÉRIE dans le circuit (impédance interne très faible)",
      "L'oscilloscope affiche la tension en fonction du temps — idéal pour les signaux variables (AC, impulsions)",
      "La base de temps (time/div) règle l'échelle temporelle, la sensibilité verticale (V/div) règle l'amplitude",
      "Le générateur de signaux produit des signaux sinusoïdaux, carrés ou triangulaires à fréquence réglable",
      "La sonde oscilloscope × 10 divise le signal par 10 pour protéger l'oscilloscope (et voir des tensions élevées)",
    ],
    formulas: [
      "Résistance : R = U / I (mesure indirecte)",
      "Période : T = 1/f",
      "Tension efficace : Ueff = Umax / √2 (sinusoïdal)",
    ],
    formulaDetails: [
      {
        expr: "R = U / I",
        use: "Mesure indirecte d'une résistance : mesurer la tension aux bornes ET le courant qui la traverse (circuit alimenté). Sinon, le multimètre en mode Ω mesure directement (composant hors tension).",
        tip: "ATTENTION : toujours mettre le circuit hors tension avant de mesurer une résistance au multimètre. Une résistance mesurée en circuit alimenté donnera une valeur erronée.",
      },
      {
        expr: "T = 1 / f",
        use: "Sur l'oscilloscope : repère une période complète sur l'axe temporel. T = nombre de divisions × base de temps (time/div). La fréquence est l'inverse de la période.",
        tip: "Exemple : signal sinusoïdal occupe 4 divisions, base de temps = 1 ms/div → T = 4 ms → f = 250 Hz.",
      },
      {
        expr: "Ueff = Umax / √2 ≈ Umax × 0.707",
        use: "La tension efficace (RMS) d'un signal sinusoïdal. Le multimètre en mode AC affiche directement la valeur efficace. L'oscilloscope affiche la valeur crête (Umax).",
        tip: "230 V secteur = valeur efficace. La valeur crête est 230 × √2 ≈ 325 V. Important en sécurité !",
      },
    ],
    example:
      "Mesurer la fréquence d'un signal à l'oscilloscope : base de temps = 500 µs/div, une période = 6 divisions → T = 6 × 500 µs = 3 ms → f = 1/0.003 ≈ 333 Hz.",
    qa: [
      {
        keywords: ["multimètre", "branchement", "tension", "voltmètre", "parallèle"],
        answer:
          "En mode voltmètre (V) : brancher les sondes EN PARALLÈLE avec le composant à mesurer. Rouge sur le point le plus positif, noir sur la masse (GND). Ne jamais brancher un voltmètre en série : il a une résistance interne très élevée (~10 MΩ) mais court-circuiterait la source s'il était en série.",
      },
      {
        keywords: ["ampèremètre", "courant", "série", "ampère"],
        answer:
          "En mode ampèremètre (A) : OUVRIR le circuit à l'endroit voulu et brancher l'ampèremètre EN SÉRIE pour que le courant le traverse. Commencer par le calibre le plus élevé puis diminuer. JAMAIS brancher un ampèremètre en parallèle (résistance interne quasi nulle → court-circuit).",
      },
      {
        keywords: ["oscilloscope", "réglage", "calibrage", "sonde", "div"],
        answer:
          "Réglages clés de l'oscilloscope : 1) V/div (sensibilité verticale) : ajuster pour que le signal occupe 4-6 divisions. 2) Time/div (base de temps) : ajuster pour voir 2-3 périodes. 3) Trigger (déclenchement) : stabilise l'affichage. 4) Couplage AC pour voir les variations, DC pour la tension absolue.",
      },
      {
        keywords: ["continuité", "bip", "tester", "câble", "rupture"],
        answer:
          "Mode continuité (buzzer) : teste si deux points sont reliés électriquement. Le multimètre bipe si la résistance est < quelques ohms. Utile pour : vérifier un câble, tester une soudure, contrôler qu'une piste PCB n'est pas coupée. CIRCUIT HORS TENSION obligatoire.",
      },
      {
        keywords: ["diode", "test", "vérifier", "anode", "cathode"],
        answer:
          "Mode diode sur le multimètre : il affiche la chute de tension directe. Diode silicium : ~0.5–0.7V. LED : 1.8–3.4V selon la couleur. Si le multimètre affiche '1' (hors calibre) dans les deux sens → diode claquée (circuit ouvert). Si 0 dans les deux sens → diode en court-circuit.",
      },
    ],
  },

  {
    id: "diagnostic-pannes",
    subject: "electronics" as const,
    title: "Diagnostic de pannes",
    summary: "Méthodologie systématique pour identifier et corriger les pannes dans les circuits électroniques.",
    notions: [
      "Une panne est soit un circuit ouvert (rupture → plus de courant), soit un court-circuit (résistance nulle → trop de courant)",
      "Méthode de la dichotomie : couper le circuit en deux, tester le milieu, recommencer",
      "Toujours vérifier l'alimentation EN PREMIER (80% des pannes viennent de là)",
      "Inspecter visuellement avant de mesurer : composants brûlés, soudures froides, condensateurs gonflés",
      "La prise en charge implique de ne JAMAIS court-circuiter une alimentation pour 'tester'",
      "Le signal injection et signal tracing : injecter un signal connu, suivre sa propagation au point de perte",
    ],
    formulas: [
      "Vout ≠ attendu → chercher où le signal se perd",
      "R_mesurée >> R_nominale → rupture ou contact mauvais",
      "R_mesurée ≈ 0 → court-circuit",
    ],
    formulaDetails: [
      {
        expr: "Méthode dichotomie",
        use: "Diviser le circuit en deux, tester le point milieu. Si OK → la panne est dans la seconde moitié. Si KO → la panne est dans la première moitié. Répéter jusqu'à isoler le composant défaillant.",
        tip: "Sur une chaîne de traitement de signal (amplificateur, filtre, convertisseur…), toujours commencer au milieu de la chaîne.",
      },
      {
        expr: "Test de tension: mesurer VCC, GND, Vout",
        use: "Séquence systématique : 1) VCC présente ? 2) GND correct (0V) ? 3) Tension d'entrée du bloc OK ? 4) Tension de sortie du bloc OK ? La panne est dans le premier bloc où la sortie diffère de l'attendu.",
        tip: "Ne pas oublier les fusibles, interrupteurs et connecteurs : ils représentent une grande partie des pannes réelles.",
      },
      {
        expr: "Composant chaud au toucher → suspect",
        use: "Un composant anormalement chaud (transistor, régulateur, résistance) est souvent en surcharge. Cela peut indiquer un court-circuit en aval, une valeur de composant incorrecte, ou un composant défaillant.",
      },
    ],
    example:
      "Panne d'un ampli audio : 1) Alim OK (±15V) ✓. 2) Signal à l'entrée de l'AOP OK ✓. 3) Sortie de l'AOP = 0V alors qu'attendu ≠ 0V → AOP défaillant. On change le composant.",
    qa: [
      {
        keywords: ["panne", "méthode", "diagnostic", "chercher", "trouver"],
        answer:
          "Méthode en 5 étapes : 1) Inspection visuelle (composants brûlés, soudures froides, traces de claquage). 2) Vérifier l'alimentation (tensions, fusibles). 3) Mesurer les tensions aux points clés. 4) Utiliser la dichotomie pour isoler le bloc défaillant. 5) Tester/remplacer le composant suspect.",
      },
      {
        keywords: ["circuit ouvert", "rupture", "coupure", "discontinuité"],
        answer:
          "Un circuit ouvert est une rupture dans la continuité électrique. Symptômes : tension nulle là où elle devrait être présente, résistance infinie là où elle devrait être finie. Causes : soudure froide, piste PCB coupée, composant grillé (résistance oxydée), connecteur desserré. Détecter avec le mode continuité (buzzer) du multimètre.",
      },
      {
        keywords: ["court-circuit", "cc", "fusion", "fusible"],
        answer:
          "Un court-circuit est une connexion non voulue à faible résistance entre deux points. Symptômes : fusible soufflé, composant très chaud, tension d'alimentation s'effondre à la mise sous tension. Trouver avec le mode Ω (résistance → 0 Ω entre les deux points). Chercher une soudure en excès, un fil pincé, un condensateur claqué.",
      },
      {
        keywords: ["soudure froide", "mauvais contact", "intermittent"],
        answer:
          "Soudure froide = mauvaise soudure qui fait intermittent. La soudure a une apparence terne, grumeleuse ou fissurée (au lieu d'être brillante et lisse). Causes : mouvement pendant le refroidissement, flux insuffisant, température trop basse. Refaire la soudure avec de l'étain neuf et un bon flux.",
      },
      {
        keywords: ["condensateur", "gonflé", "claqué", "ESR"],
        answer:
          "Condensateur électrolytique gonflé (bombé au sommet) ou avec un électrolyte qui fuit = DÉFAILLANT, à changer immédiatement. Très fréquent dans les alimentations. Peut aussi être claqué sans signe visible : mesurer son ESR (résistance série équivalente) avec un testeur ESR. Un ESR élevé → condensateur à changer.",
      },
    ],
  },

  {
    id: "soudure-montage",
    subject: "electronics" as const,
    title: "Soudure et montage",
    summary: "Techniques de soudure traversante (THT) et CMS (SMD), outils, qualité de soudure et dessoudure.",
    notions: [
      "La soudure est un alliage métallique (étain/plomb ou sans plomb) qui crée une liaison électrique et mécanique",
      "THT (Through Hole Technology) : composants à pattes insérées dans des trous percés — facile, robuste",
      "CMS / SMD (Surface Mount Device) : composants soudés en surface — plus petits, automatisables",
      "La bonne soudure est brillante, lisse, en forme de volcan et mouille bien la patte et le pad",
      "Température du fer à souder : 320–380°C pour étain sans plomb, 280–320°C pour Sn/Pb",
      "Le flux est un agent chimique qui enlève l'oxyde des surfaces et améliore la mouillabilité",
      "Ne jamais chauffer un composant plus de 3–5 secondes d'affilée (risque de destruction)",
    ],
    formulas: [
      "Temps de soudure : 2–3 s par joint (THT)",
      "Épaisseur étain CMS : pâte à braser ~0.15 mm",
    ],
    formulaDetails: [
      {
        expr: "Soudure THT : 4 étapes",
        use: "1) Chauffer simultanément la patte ET le pad (pas juste l'un ou l'autre). 2) Amener l'étain côté opposé au fer (pas sur la panne). 3) Laisser l'étain couler 1–2 s. 4) Retirer l'étain puis le fer. Ne pas souffler ni bouger la pièce.",
        tip: "L'étain doit couler vers la chaleur, pas être poussé par le fer. Si vous devez insister, la surface est oxydée → appliquer du flux.",
      },
      {
        expr: "Soudure CMS : procédé four",
        use: "1) Déposer la pâte à braser par pochoir. 2) Placer les composants CMS (pick & place). 3) Passer au four de refusion (reflow). 4) Inspection visuelle ou aux rayons X. Température de pic : ~245°C (sans plomb).",
        tip: "Pour une soudure CMS manuelle (station air chaud) : préchauffer le PCB, appliquer flux, déposer l'étain sur les pads, poser le composant, chauffer à l'air chaud 350°C en cercles.",
      },
      {
        expr: "Dessoudure à la tresse ou à la pompe",
        use: "Tresse à dessouder : appuyer sur la soudure avec la tresse + fer → la tresse absorbe l'étain par capillarité. Pompe à dessouder : chauffer la soudure, aspirer rapidement. Pour les CI : utiliser une station air chaud + pince.",
        tip: "Ajouter un peu d'étain frais sur une vieille soudure oxydée avant de dessouder — l'étain neuf contient du flux et facilite la dessoudure.",
      },
    ],
    example:
      "Soudure d'une résistance THT : insérer les pattes, plier légèrement pour tenir, chauffer pad + patte 2 s, amener l'étain, laisser couler 1 s, retirer → joint brillant en forme de cône. Couper l'excès de patte avec une pince coupante.",
    qa: [
      {
        keywords: ["température", "fer", "souder", "réglage", "°c"],
        answer:
          "Température recommandée : 320–350°C pour l'étain sans plomb (SAC305), 280–320°C pour l'étain plombé (Sn63/Pb37). Trop chaud → brûle le flux trop vite, risque de délaminage du PCB. Trop froid → soudure froide, mauvaise mouillabilité. Utiliser une station à température contrôlée.",
      },
      {
        keywords: ["bonne soudure", "qualité", "apparence", "reconnaitre"],
        answer:
          "Une BONNE soudure : brillante (ou légèrement mate pour sans plomb), lisse, en forme de cône/volcan qui remonte bien autour de la patte, angle de contact < 90°. Une MAUVAISE soudure : terne et grumeleuse (froide), sphérique (mauvaise mouillabilité), excès d'étain qui recouvre tout, pont entre deux pads.",
      },
      {
        keywords: ["cms", "smd", "surface", "monter", "coller"],
        answer:
          "Pour souder un composant CMS manuellement : 1) Étamer un pad avec un peu d'étain. 2) Tenir le composant avec une pince à épiler. 3) Chauffer l'étain déposé et poser le composant. 4) Souder l'autre côté (ou les autres broches). Utiliser beaucoup de flux pour faciliter.",
      },
      {
        keywords: ["flux", "décapant", "oxyde", "mouillabilité"],
        answer:
          "Le flux est indispensable pour une bonne soudure. Il dissout les oxydes métalliques sur les surfaces, permettant à l'étain de 'mouiller' (s'étaler). Sans flux : soudures grumeleuses et mauvais contact. Types : colophane (rosin), no-clean (reste sur le PCB), hydrosoluble (à nettoyer à l'eau).",
      },
      {
        keywords: ["dessouder", "retirer", "composant", "tresse", "pompe"],
        answer:
          "Méthodes de dessoudure : 1) Tresse à dessouder : chauffer + absorber l'étain. 2) Pompe à dessouder (pistolet) : chauffer puis aspirer. 3) Air chaud (station SMD) : pour les CMS et boîtiers QFP/BGA. Toujours ajouter du flux avant de dessouder pour améliorer la fluidité de l'étain.",
      },
    ],
  },

  /* ─────────────── FABRICATION ─────────────── */
  {
    id: "fabrication-pcb",
    subject: "electronics" as const,
    title: "Fabrication de circuits imprimés (PCB)",
    summary: "Conception, technologie et procédés de fabrication des circuits imprimés (PCB).",
    notions: [
      "PCB (Printed Circuit Board) = circuit imprimé : un support isolant avec des pistes conductrices en cuivre",
      "Le substrat le plus courant est le FR4 (fibre de verre époxy), épaisseur standard 1.6 mm",
      "Les couches de cuivre (layers) : simple face (1 couche), double face (2 couches), multicouche (4, 6, 8...)",
      "Les composants THT traversent le PCB avec leurs pattes. Les CMS/SMD sont collés en surface",
      "Les vias sont des trous métallisés qui relient des pistes sur des couches différentes",
      "Le vernis épargne (solder mask) protège les pistes et empêche les ponts de soudure involontaires",
      "La sérigraphie (silkscreen) imprime les repères de composants (références, polarités) en blanc",
    ],
    formulas: [
      "Largeur piste : W = I / (k × ΔT^0.44 × A^0.725) (formule IPC-2221)",
      "Impédance piste (microstrip) : Z ≈ 87/√(εr+1.41) × ln(5.98h / (0.8W+T))",
    ],
    formulaDetails: [
      {
        expr: "Règle pratique largeur de piste",
        use: "Règle simple : pour les signaux faibles (< 100 mA), 0.2–0.3 mm suffit. Pour 1 A : prévoir 1 mm minimum. Pour le plan de masse et d'alimentation : 2–3 mm. La largeur détermine la résistance et la capacité de courant de la piste.",
        tip: "Toujours utiliser un calculateur de largeur de piste en ligne (ex : PCBway ou Saturn PCB Toolkit) pour les courants > 500 mA.",
      },
      {
        expr: "Clearance (écartement) minimum",
        use: "L'écartement minimum entre deux pistes dépend de la tension. Règle 50 V/mm pour les circuits basse tension (< 50 V). Pour 230 V secteur : minimum 3 mm sur PCB standard. Les normes IEC et UL imposent des distances précises selon la tension et la catégorie de surtension.",
        tip: "En fabrication pro : clearance minimum 0.1–0.15 mm pour les PCB standard. La tolérance de gravure est ~10% de la largeur.",
      },
      {
        expr: "Procédé de fabrication industriel",
        use: "1) Dépôt de cuivre sur le substrat. 2) Application de résine photosensible (dry film). 3) Insolation UV à travers le film (photomasque). 4) Développement → enlève la résine non exposée. 5) Gravure chimique (chlorure ferrique ou persulfate) → enlève le cuivre non protégé. 6) Strip → enlève la résine restante.",
      },
    ],
    example:
      "PCB double face pour une alimentation 5A : pistes d'alimentation 3 mm, plan de masse complet en face bottom, clearance 0.5 mm, trous de fixation Ø3.2 mm. Commande chez JLCPCB ou PCBway : gerber files (layers + drills + soldermask + silkscreen).",
    qa: [
      {
        keywords: ["gerber", "fichier", "fabrication", "envoyer", "usine"],
        answer:
          "Les fichiers Gerber sont le format standard pour envoyer un PCB en fabrication. Ils contiennent : couches cuivre (GTL/GBL), vernis épargne (GTS/GBS), sérigraphie (GTO/GBO), perçage (DRL/XLN). Exportés depuis les logiciels de CAO (KiCad, Altium, EasyEDA). Fabricants populaires : JLCPCB, PCBway, Eurocircuits.",
      },
      {
        keywords: ["couche", "layer", "multicouche", "face", "double"],
        answer:
          "Single face (1 couche) : pistes d'un seul côté, composants de l'autre. Simple et bon marché. Double face (2 couches) : pistes des deux côtés reliées par des vias. Multicouche (4L, 6L...) : pour circuits denses, avec plans d'alimentation et masse dédiés. Plus de couches = meilleur signal et moins d'interférences.",
      },
      {
        keywords: ["via", "traversant", "borgne", "aveugle"],
        answer:
          "Via traversant : trou métallisé de haut en bas, visible des deux côtés. Standard et économique. Via borgne (blind via) : relie la surface à une couche interne. Via enterré (buried via) : relie deux couches internes. Ces derniers sont plus chers à fabriquer. Diamètre minimum via standard : 0.3 mm (perçage) avec anneau de cuivre 0.6 mm.",
      },
      {
        keywords: ["logiciel", "cad", "conception", "schéma", "routage"],
        answer:
          "Logiciels de conception PCB : KiCad (gratuit, open source, professionnel), EasyEDA (en ligne, gratuit, connecté à LCSC/JLCPCB), Altium Designer (professionnel, payant), Eagle (payant, version gratuite limitée). Flux : Schéma → Netlist → Placement → Routage → DRC (vérification) → Export Gerber.",
      },
      {
        keywords: ["prototypage", "maison", "fabriquer", "graver", "chimique"],
        answer:
          "Fabrication artisanale (proto) : 1) Imprimer le tracé sur film transparent. 2) Insoler une plaque présensibilisée (UV). 3) Développer au soude caustique (NaOH). 4) Graver au chlorure ferrique (FeCl3) ou au persulfate d'ammonium. 5) Nettoyer et percer. Alternative : fraisage CNC (fraiseuse PCB). Pour un proto rapide et fiable, commander en ligne (5 PCBs 10×10 cm pour ~5€ chez JLCPCB).",
      },
    ],
  },

  {
    id: "normes-securite",
    subject: "electronics" as const,
    title: "Normes et sécurité électrique",
    summary: "Sécurité des personnes et des équipements : habilitations, normes, EPI, risques électriques.",
    notions: [
      "La tension dangereuse pour l'homme commence à 25 V AC ou 60 V DC (selon IEC 60479)",
      "Le courant est plus dangereux que la tension : 10 mA = seuil de tétanisation, 100 mA = fibrillation ventriculaire mortelle",
      "Habilitation électrique (France) : B0, B1, B2, BC, BR pour le personnel non électricien et électricien",
      "Les 5 règles de sécurité (travaux hors tension) : Séparer - Condamner - Vérifier l'absence de tension (VAT) - Mettre à la terre - Délimiter la zone",
      "NF C 15-100 : norme française de référence pour les installations électriques basse tension",
      "Marquage CE : conformité aux directives européennes (CEM, basse tension, sécurité)",
      "Norme IP (Indice de Protection) : IP65 = protégé contre la poussière et les jets d'eau",
    ],
    formulas: [
      "Résistance du corps humain : 1 000 Ω (peau sèche) à 500 Ω (peau humide)",
      "I_corps = U_contact / R_corps (loi d'Ohm appliquée au corps)",
      "IP XY : X = protection solides (0-6), Y = protection liquides (0-9)",
    ],
    formulaDetails: [
      {
        expr: "I_corps = U / R_corps",
        use: "À 230V AC avec peau humide (R=500Ω) : I = 230/500 = 0.46 A = 460 mA → MORTEL. À 25V AC avec peau sèche (R=1000Ω) : I = 25/1000 = 25 mA → Tétanisation possible. C'est pourquoi la limite de sécurité est fixée à 25V AC.",
        tip: "Ne jamais sous-estimer les basses tensions en milieu humide (salle de bain, chantier mouillé, atelier).",
      },
      {
        expr: "Indice de Protection IP XY",
        use: "Premier chiffre X (0-6) : protection contre solides et poussières. 6 = étanche total à la poussière. Deuxième chiffre Y (0-9) : protection contre l'eau. 4 = projections tout sens, 5 = jets d'eau, 7 = immersion 30 min, 8 = immersion prolongée.",
        tip: "IP44 = atelier standard. IP65 = extérieur protégé. IP67 = équipement submersible. IP68 = usage sous-marin.",
      },
      {
        expr: "Classe d'équipement électrique",
        use: "Classe I : protection par mise à la terre (le fil vert/jaune). Classe II : double isolation (symbole carré dans carré), pas besoin de terre. Classe III : très basse tension (< 50V AC, < 120V DC), pas de risque électrique.",
        tip: "Vérifier toujours la classe de l'équipement avant intervention. Un outil classe II ne doit PAS être relié à la terre.",
      },
    ],
    example:
      "Intervention sur un tableau électrique : 1) Couper le disjoncteur général. 2) Condamner (cadenas + pancarte). 3) VAT avec voltmètre homologué. 4) Mettre à la terre et en court-circuit les conducteurs. 5) Baliser la zone. Seulement ensuite : travailler.",
    qa: [
      {
        keywords: ["habilitation", "b0", "b1", "b2", "br", "électricien"],
        answer:
          "Habilitations électriques françaises (norme NF C18-510) : B0/H0 = non électricien, peut travailler sous surveillance près des ouvrages. B1/H1 = effectue des travaux hors tension. B2/H2 = prépare et surveille des travaux. BR = dépannage et essais BT. BC/HC = consignation. Le chiffre 1/2 correspond à la tension (BT/HTA).",
      },
      {
        keywords: ["vat", "absence", "tension", "vérifier", "consignation"],
        answer:
          "VAT = Vérification d'Absence de Tension : étape OBLIGATOIRE avant tout travail hors tension. Utiliser un VAT homologué (catégorie CAT III minimum), vérifier que le VAT fonctionne sur une source connue AVANT et APRÈS la vérification. Le principe : on ne fait jamais confiance à un disjoncteur seul.",
      },
      {
        keywords: ["norme", "nf c 15-100", "installation", "basse tension"],
        answer:
          "NF C 15-100 régit les installations électriques basse tension en France. Points clés : disjoncteur différentiel 30 mA obligatoire dans salles d'eau, salle de bain à zones (0, 1, 2, 3), protection par défaut de terre, section des câbles selon courant admissible, couleurs des conducteurs (vert/jaune = terre, bleu = neutre, rouge/brun/noir = phase).",
      },
      {
        keywords: ["cem", "compatibilité", "électromagnétique", "perturbation", "blindage"],
        answer:
          "CEM (Compatibilité ÉlectroMagnétique) : un équipement doit 1) ne pas émettre de perturbations qui gênent d'autres appareils (émission), 2) fonctionner correctement malgré les perturbations extérieures (immunité). En conception PCB : plan de masse continu, filtres sur alimentation, composants sensibles éloignés des sources de bruit, câbles blindés pour signaux faibles.",
      },
      {
        keywords: ["epi", "protection", "individuel", "gants", "chaussures"],
        answer:
          "EPI électriques obligatoires selon la tension : gants isolants (classe 00 pour < 500V, classe 0 pour < 1000V), écran facial anti-arc, casque isolant, chaussures de sécurité isolantes. Vérifier la date de péremption des gants (test annuel obligatoire). Vêtements résistants à l'arc (EPI arc flash) pour les interventions HTA.",
      },
    ],
  },

  /* ─────────────── Transistors avancés ─────────────── */
  {
    id: "transistors-advanced",
    subject: "electronics" as const,
    title: "Transistors BJT & MOSFET",
    summary: "Fonctionnement des transistors bipolaires et à effet de champ, modes de commutation et amplification.",
    notions: [
      "BJT NPN : IB commande IC. IC = β × IB. Transistor = interrupteur commandé en courant",
      "MOSFET : tension VGS commande ID. Transistor commandé en tension (sans courant de grille)",
      "Trois régions : bloqué (off), actif (amplification), saturé (on/commutateur fermé)",
      "En commutation : BJT saturé → VCE ≈ 0.2V. MOSFET saturé → VDS très faible (RDSon)",
      "Le MOSFET est préféré en puissance (RDSon faible, pas de courant de grille)",
    ],
    formulas: [
      "IC = β × IB (BJT actif)",
      "IB = (VCC − VBE) / RB",
      "ID = f(VGS) (MOSFET, loi quadratique)",
    ],
    formulaDetails: [
      {
        expr: "IC = β × IB",
        use: "Relation fondamentale du BJT en régime actif. β (beta ou hFE) est le gain en courant, typiquement 100 à 500. Un courant de base IB de 1 mA contrôle un courant collecteur IC de 100 à 500 mA.",
        tip: "Pour saturer un BJT : IB_réel > IC_max / β. On ajoute un facteur de forçage : IB_forçage = IC_max / (β/10) pour être sûr d'être en saturation.",
      },
      {
        expr: "IB = (VCC − VBE) / RB",
        use: "Calcul du courant de base via une résistance RB depuis VCC. VBE ≈ 0.7V pour un transistor silicium.",
        tip: "Recette de commutation : 1) Calculer IC_max nécessaire. 2) Choisir IB = IC_max/β × 3. 3) Calculer RB = (VCC − 0.7) / IB.",
      },
      {
        expr: "VGS > Vth → MOSFET passant",
        use: "Le MOSFET s'ouvre quand la tension grille-source dépasse le seuil Vth (1 à 4V selon le transistor). Aucun courant de commande nécessaire — idéal pour les microcontrôleurs.",
        tip: "MOSFET canal N : VGS positive pour ouvrir. Canal P : VGS négative. Pour commander avec un µC 3.3V, choisir un MOSFET à logique avec Vth ≤ 2V.",
      },
    ],
    example:
      "Commande d'une LED 100mA avec un BJT NPN (β=200, VCC=5V) : IC=100mA, IB_min=0.5mA, on prend IB=5mA (forçage ×10). RB = (5−0.7)/0.005 = 860Ω → on prend 820Ω.",
    qa: [
      {
        keywords: ["bjt", "bipolaire", "beta", "gain", "courant"],
        answer:
          "BJT = transistor bipolaire à jonction. Le courant IB contrôle IC : IC = β × IB. β (ou hFE) est typiquement 100-500. C'est un amplificateur de courant. VBE ≈ 0.7V (seuil d'activation, comme une diode).",
      },
      {
        keywords: ["mosfet", "grille", "vgs", "effet champ"],
        answer:
          "MOSFET = Metal Oxide Semiconductor Field Effect Transistor. Commandé en tension VGS (pas de courant de grille). Avantages sur BJT : commande facile (µC), faible pertes à l'état passant (RDSon), commutation rapide. Très utilisé en power electronics et numérique.",
      },
      {
        keywords: ["saturation", "commutation", "interrupteur", "allumer"],
        answer:
          "Pour utiliser un transistor comme interrupteur, on le force en saturation : BJT → IB > IC/β × 3 (forçage). MOSFET → VGS bien supérieur à Vth. En saturation : VCE_sat ≈ 0.2V (BJT), VDS_sat = ID×RDSon (MOSFET). Le transistor se comporte comme un interrupteur fermé.",
      },
    ],
  },
];
