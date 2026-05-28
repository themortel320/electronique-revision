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
