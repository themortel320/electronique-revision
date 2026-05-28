import { CourseModule } from "@/types";

export const mathModules: CourseModule[] = [
  {
    id: "derivative-basics",
    subject: "math",
    title: "Introduction aux dérivées",
    summary: "Définition, intuition géométrique et dérivées des fonctions usuelles.",
    notions: [
      "La dérivée f'(x) mesure le taux de variation instantané de f en x",
      "Géométriquement : f'(x₀) est la pente de la tangente à la courbe en x₀",
      "Si f'(x) > 0 : f est croissante. Si f'(x) < 0 : f est décroissante",
      "Si f'(x) = 0 : potentiel extremum (maximum ou minimum local)",
      "Notation : f'(x), df/dx, ou ẏ (physique)",
    ],
    formulas: ["f'(x) = lim[h→0] (f(x+h)−f(x))/h", "(xⁿ)' = n·xⁿ⁻¹", "(c)' = 0"],
    formulaDetails: [
      {
        expr: "f'(x) = lim[h→0] (f(x+h)−f(x))/h",
        use: "Définition formelle de la dérivée. Le taux de variation entre x et x+h, quand h tend vers 0. En pratique, on n'utilise jamais cette formule pour calculer — on utilise les règles de dérivation.",
        tip: "Intuition : imagine la pente d'une droite entre deux points très proches sur la courbe. Quand les points se rapprochent indéfiniment, on obtient la pente de la tangente.",
      },
      {
        expr: "(xⁿ)' = n·xⁿ⁻¹",
        use: "Règle des puissances — la plus utilisée. Descendre l'exposant devant et diminuer l'exposant de 1. Valable pour tout n réel.",
        tip: "(x²)' = 2x. (x³)' = 3x². (x)' = 1. (√x)' = (x^½)' = ½·x^(-½) = 1/(2√x).",
      },
      {
        expr: "(c)' = 0",
        use: "La dérivée d'une constante est 0. Logique : une constante ne varie pas, donc son taux de variation est nul.",
      },
      {
        expr: "(eˣ)' = eˣ",
        use: "La fonction exponentielle est sa propre dérivée — propriété unique et fondamentale. (e^(ax))' = a·e^(ax).",
        tip: "C'est pour ça que eˣ est omniprésente en physique et en modélisation de phénomènes de croissance.",
      },
      {
        expr: "(ln x)' = 1/x",
        use: "Dérivée du logarithme naturel, définie pour x > 0. Utilisée pour transformer des produits en sommes lors de dérivations complexes.",
      },
    ],
    lesson: {
      analogy:
        "Imagine que tu roules en voiture. Ta position est f(t). La dérivée f'(t), c'est ton compteur de vitesse : elle te dit à quelle vitesse ta position change à chaque instant. Si f'(t) > 0 tu avances, si f'(t) < 0 tu recules, si f'(t) = 0 tu es à l'arrêt.",
      steps: [
        "La dérivée mesure le taux de variation instantané d'une fonction. Géométriquement, f'(x₀) est la pente de la droite tangente à la courbe en x₀.",
        "Définition formelle : f'(x) = lim[h→0] (f(x+h)−f(x))/h. En pratique, on ne calcule jamais avec cette limite — on utilise des règles.",
        "Règle fondamentale des puissances : (xⁿ)' = n·xⁿ⁻¹. Tu 'descends' l'exposant devant et tu le diminues de 1. Exemples : (x²)' = 2x, (x³)' = 3x², (x)' = 1, (constante)' = 0.",
        "La dérivée est linéaire : (af + bg)' = af' + bg'. Ça veut dire qu'on peut dériver terme à terme. (3x² − 5x + 2)' = 6x − 5.",
        "Étude de variations : si f'(x) > 0 sur un intervalle → f est croissante. Si f'(x) < 0 → f décroissante. Là où f'(x) = 0, chercher un maximum ou minimum local.",
        "Dérivées à mémoriser : (eˣ)' = eˣ (unique !), (ln x)' = 1/x, (sin x)' = cos x, (cos x)' = −sin x.",
      ],
    },
    example:
      "f(x) = 3x² − 5x + 2. En appliquant (xⁿ)' = nxⁿ⁻¹ terme à terme : f'(x) = 6x − 5. En x=2 : f'(2) = 12 − 5 = 7 (pente de la tangente en x=2).",
    qa: [
      {
        keywords: ["dérivée", "définition", "c'est quoi", "signifie"],
        answer:
          "La dérivée f'(x) mesure à quelle vitesse f varie en x. Si f représente une position, f' est la vitesse. Géométriquement, c'est la pente de la tangente à la courbe au point (x, f(x)). Formule : f'(x) = lim[h→0] (f(x+h)−f(x))/h.",
      },
      {
        keywords: ["puissance", "xn", "règle", "exposant"],
        answer:
          "(xⁿ)' = n·xⁿ⁻¹. Tu 'descends' l'exposant en facteur et tu le diminues de 1. Exemples : (x⁴)' = 4x³. (x²)' = 2x. (x)' = 1. (x⁰)' = (1)' = 0. Ça marche même pour n fractionnaire : (√x)' = 1/(2√x).",
      },
      {
        keywords: ["constante", "nombre", "chiffre", "dérivée"],
        answer:
          "La dérivée d'une constante est 0. (5)' = 0. (π)' = 0. (−3)' = 0. Logique : une constante ne change pas, donc son taux de variation est nul.",
      },
      {
        keywords: ["croissante", "décroissante", "sens", "variation"],
        answer:
          "Si f'(x) > 0 sur un intervalle → f est croissante sur cet intervalle. Si f'(x) < 0 → f est décroissante. Si f'(x) = 0 → f a un extremum potentiel (min ou max). C'est la base de l'étude de fonctions.",
      },
      {
        keywords: ["exponentielle", "ex", "e^x"],
        answer:
          "(eˣ)' = eˣ. La fonction exponentielle est sa propre dérivée, c'est sa propriété fondamentale. Pour e^(ax) : (e^(ax))' = a·e^(ax). Exemple : (e^(3x))' = 3e^(3x).",
      },
    ],
  },

  {
    id: "derivative-rules",
    subject: "math",
    title: "Règles de dérivation",
    summary: "Linéarité, produit, quotient, composée et dérivées de sin/cos.",
    notions: [
      "Règle de linéarité : (af + bg)' = af' + bg'",
      "Règle du produit : (fg)' = f'g + fg'",
      "Règle du quotient : (f/g)' = (f'g − fg') / g²",
      "Règle de la composée (chain rule) : (f∘g)'(x) = f'(g(x)) × g'(x)",
      "(sin x)' = cos x  et  (cos x)' = −sin x",
    ],
    formulas: [
      "(fg)' = f'g + fg'",
      "(f/g)' = (f'g − fg') / g²",
      "(f(g(x)))' = f'(g(x))·g'(x)",
    ],
    formulaDetails: [
      {
        expr: "(af + bg)' = af' + bg'",
        use: "Linéarité : la dérivée est une opération linéaire. On peut dériver terme à terme et sortir les constantes. C'est la règle la plus simple et la plus utilisée.",
        tip: "Exemple : (3x² + 2x − 5)' = 3·(x²)' + 2·(x)' − 0 = 3·2x + 2·1 = 6x + 2.",
      },
      {
        expr: "(fg)' = f'g + fg'",
        use: "Règle du produit : pour dériver un produit de deux fonctions. Formule mnémotechnique : 'prime-seconde + première-prime-seconde'. Attention : (fg)' ≠ f'·g'.",
        tip: "Exemple : (x²·eˣ)' = 2x·eˣ + x²·eˣ = eˣ(2x + x²). On factorise eˣ à la fin.",
      },
      {
        expr: "(f/g)' = (f'g − fg') / g²",
        use: "Règle du quotient : 'haut' = f, 'bas' = g. La formule se lit : (prime-bas − haut-prime-bas) / bas². Valable partout où g(x) ≠ 0.",
        tip: "Moyen mnémo : 'lo-d-hi minus hi-d-lo, over lo-lo'. f'g au numérateur est positif, fg' est négatif — l'ordre compte !",
      },
      {
        expr: "(f(g(x)))' = f'(g(x))·g'(x)",
        use: "Règle de la composée (chain rule) : pour dériver une fonction à l'intérieur d'une autre. On dérive la fonction extérieure (en gardant l'intérieur), puis on multiplie par la dérivée de l'intérieur.",
        tip: "Exemple : (sin(3x))' = cos(3x) × (3x)' = 3cos(3x). L'intérieur est u=3x, u'=3.",
      },
      {
        expr: "(sin x)' = cos x",
        use: "Dérivée du sinus est le cosinus. En radians uniquement. (cos x)' = −sin x. Ces deux fonctions 'tournent' lors de la dérivation : sin → cos → −sin → −cos → sin...",
        tip: "(sin(ax))' = a·cos(ax). (cos(ax))' = −a·sin(ax). Ne pas oublier le a par la règle de la composée.",
      },
    ],
    lesson: {
      analogy:
        "Les règles de dérivation sont comme des recettes de cuisine : chaque 'plat' (type de fonction) a sa recette. Maîtrise les recettes de base, et tu peux dériver n'importe quelle fonction, même les plus complexes.",
      steps: [
        "Règle du produit (fg)' = f'g + fg' : pour dériver un produit, on dérive le premier en gardant le second, puis on garde le premier en dérivant le second, et on additionne. Mnémo : 'prime-seconde + première-prime-seconde'.",
        "Erreur classique : (fg)' ≠ f' × g'. Le produit des dérivées n'est PAS la dérivée du produit ! Exemple correct : (x²·eˣ)' = 2x·eˣ + x²·eˣ = eˣ(2x + x²).",
        "Règle du quotient (f/g)' = (f'g − fg') / g² : 'haut-prime × bas − haut × bas-prime, le tout sur bas²'. L'ordre du numérateur compte (signe − pas +).",
        "Règle de la composée (f(g(x)))' = f'(g(x))·g'(x) : on identifie l'intérieur u=g(x) et l'extérieur f. On dérive l'extérieur (en gardant l'intérieur intact) et on multiplie par la dérivée de l'intérieur.",
        "Exemples composée : (sin(3x))' = cos(3x) × 3 = 3cos(3x). (e^(x²))' = e^(x²) × 2x. ((2x+1)³)' = 3(2x+1)² × 2 = 6(2x+1)².",
        "Valeurs de sin/cos à maîtriser : (sin x)' = cos x, (cos x)' = −sin x. Avec composée : (sin(ax+b))' = a·cos(ax+b).",
      ],
    },
    example:
      "f(x) = x²·sin(x). Règle du produit : f'(x) = (x²)'·sin(x) + x²·(sin x)' = 2x·sin(x) + x²·cos(x). En x=0 : f'(0) = 0.",
    qa: [
      {
        keywords: ["produit", "fg", "deux fonctions", "multiplié"],
        answer:
          "(fg)' = f'g + fg'. Exemple : f(x) = x³·eˣ. f'(x) = 3x²·eˣ + x³·eˣ = eˣ(3x² + x³). Moyen mnémo : 'prime de la première × deuxième + première × prime de la deuxième'.",
      },
      {
        keywords: ["quotient", "fraction", "divisé", "rapport"],
        answer:
          "(f/g)' = (f'g − fg') / g². Exemple : f(x) = x/sin(x). f'(x) = (1·sin(x) − x·cos(x)) / sin²(x). Attention : le signe − au numérateur est crucial, l'ordre compte.",
      },
      {
        keywords: ["composée", "chain", "intérieur", "extérieur", "imbriquée"],
        answer:
          "(f(g(x)))' = f'(g(x))·g'(x). Méthode : 1) Identifier l'intérieur u=g(x) et l'extérieur f. 2) Dériver f en conservant u. 3) Multiplier par u'. Exemple : (cos(x²))' = −sin(x²) × 2x = −2x·sin(x²).",
      },
      {
        keywords: ["sin", "cos", "sinus", "cosinus"],
        answer:
          "(sin x)' = cos x. (cos x)' = −sin x. Avec la composée : (sin(ax+b))' = a·cos(ax+b). (cos(ax+b))' = −a·sin(ax+b). Les fonctions trig tournent à la dérivation : sin → cos → −sin → −cos → sin...",
      },
      {
        keywords: ["linéarité", "somme", "terme", "addition"],
        answer:
          "La dérivée est linéaire : (af + bg)' = af' + bg'. On dérive terme à terme. Exemple : (5x³ − 2x + 7)' = 5·3x² − 2·1 + 0 = 15x² − 2. Aussi : (f + g)' = f' + g'.",
      },
    ],
  },
  /* ─────────────── Primitives & Intégrales ─────────────── */
  {
    id: "integrals",
    subject: "math",
    title: "Primitives & Intégrales",
    summary: "Calcul de primitives, théorème fondamental de l'analyse, intégrale définie et calcul d'aires.",
    notions: [
      "Une primitive de f est une fonction F telle que F'(x) = f(x)",
      "L'intégrale définie ∫ₐᵇ f(x)dx représente l'aire algébrique sous la courbe entre a et b",
      "Théorème fondamental : ∫ₐᵇ f(x)dx = F(b) − F(a) où F est une primitive de f",
      "Les règles de primitives sont l'inverse des règles de dérivation",
      "La constante d'intégration +C apparaît toujours dans les primitives (intégrales indéfinies)",
    ],
    formulas: [
      "∫ xⁿ dx = xⁿ⁺¹/(n+1) + C  (n≠−1)",
      "∫ eˣ dx = eˣ + C",
      "∫ cos x dx = sin x + C",
      "∫ₐᵇ f(x)dx = F(b) − F(a)",
    ],
    formulaDetails: [
      {
        expr: "∫ xⁿ dx = xⁿ⁺¹/(n+1) + C",
        use: "Primitive des puissances — inverse de la règle (xⁿ)' = nxⁿ⁻¹. On augmente l'exposant de 1 et on divise par ce nouvel exposant.",
        tip: "∫x²dx = x³/3 + C. ∫x⁵dx = x⁶/6 + C. ∫1dx = x + C. Cas particulier : ∫x⁻¹dx = ∫(1/x)dx = ln|x| + C.",
      },
      {
        expr: "∫ eˣ dx = eˣ + C",
        use: "L'exponentielle est sa propre primitive, comme elle est sa propre dérivée. ∫ eᵃˣ dx = eᵃˣ/a + C (règle de la composée inversée).",
        tip: "∫ e²ˣ dx = e²ˣ/2 + C. ∫ e⁻ˣ dx = −e⁻ˣ + C. Le signe change quand l'exposant est négatif.",
      },
      {
        expr: "∫ₐᵇ f(x)dx = F(b) − F(a)",
        use: "Théorème fondamental de l'analyse. Pour calculer une intégrale définie : trouver une primitive F, puis évaluer F(b) − F(a). Le +C disparaît dans la soustraction.",
        tip: "Notation crochet : [F(x)]ₐᵇ = F(b) − F(a). Attention au signe : l'aire est négative si f(x) < 0 sur [a,b].",
      },
    ],
    lesson: {
      analogy:
        "L'intégration est l'opération inverse de la dérivation : si la dérivée 'descend' une marche (x² → 2x), l'intégrale 'remonte' (2x → x²). Géométriquement, l'intégrale définie c'est l'aire sous la courbe — comme sommer des colonnes infiniment fines.",
      steps: [
        "Une primitive F de f est une fonction telle que F'(x) = f(x). Il en existe une infinité : si F est une primitive, alors F + C (C constante) en est une autre. D'où le +C dans les intégrales indéfinies.",
        "Règle des puissances inversée : ∫xⁿdx = xⁿ⁺¹/(n+1) + C. On monte l'exposant de 1 et on divise par ce nouvel exposant. Exemples : ∫x²dx = x³/3 + C, ∫x⁴dx = x⁵/5 + C.",
        "Primitives à mémoriser : ∫eˣdx = eˣ + C, ∫(1/x)dx = ln|x| + C, ∫cos(x)dx = sin(x) + C, ∫sin(x)dx = −cos(x) + C.",
        "Intégrale définie ∫ₐᵇf(x)dx = F(b) − F(a) : le +C disparaît dans la soustraction. Méthode : trouver une primitive, évaluer en b, soustraire la valeur en a. Notation crochet : [F(x)]ₐᵇ.",
        "Interprétation géométrique : si f(x) ≥ 0 sur [a,b], l'intégrale = aire entre la courbe et l'axe x. Si f change de signe, les zones négatives soustraient de l'aire positive.",
        "Erreur courante : oublier le +C dans les primitives indéfinies, ou inverser a et b dans l'intégrale définie (∫ₐᵇ = −∫ᵦₐ).",
      ],
    },
    example:
      "Calcule ∫₀² (x² + 1) dx. Primitive : F(x) = x³/3 + x. [F(x)]₀² = (8/3 + 2) − (0) = 8/3 + 6/3 = 14/3 ≈ 4.67.",
    qa: [
      {
        keywords: ["primitive", "différence", "intégrale", "lien"],
        answer:
          "Primitive F de f : F'(x) = f(x). Il en existe une infinité (différent d'une constante). L'intégrale définie ∫ₐᵇ f(x)dx = F(b) − F(a) utilise n'importe quelle primitive (la constante C se simplifie). Intuition : l'intégration est l'opération inverse de la dérivation.",
      },
      {
        keywords: ["aire", "surface", "géométrique", "sous la courbe"],
        answer:
          "∫ₐᵇ f(x)dx = aire algébrique sous la courbe. Si f(x) > 0 sur [a,b] → aire positive. Si f(x) < 0 → aire négative (en dessous de l'axe). Pour l'aire totale, calculer ∫|f(x)|dx ou séparer les zones positives et négatives.",
      },
      {
        keywords: ["cos", "sin", "sinus", "trig", "primitives"],
        answer:
          "∫ sin(x)dx = −cos(x) + C. ∫ cos(x)dx = sin(x) + C. Avec la composée : ∫ sin(ax)dx = −cos(ax)/a + C. ∫ cos(ax)dx = sin(ax)/a + C.",
      },
    ],
  },
  /* ─────────────── Suites numériques ─────────────── */
  {
    id: "sequences",
    subject: "math",
    title: "Suites numériques",
    summary: "Suites arithmétiques, géométriques, convergence, limite et raisonnement par récurrence.",
    notions: [
      "Une suite est une liste ordonnée de nombres : u₀, u₁, u₂, ..., uₙ",
      "Suite arithmétique : chaque terme = terme précédent + raison r constante",
      "Suite géométrique : chaque terme = terme précédent × raison q constante",
      "Une suite converge si elle tend vers une limite finie quand n → +∞",
      "Suite géométrique : converge si |q| < 1, diverge si |q| > 1",
    ],
    formulas: [
      "uₙ = u₀ + n·r (arithmétique)",
      "uₙ = u₀ · qⁿ (géométrique)",
      "Sₙ = n(u₀ + uₙ)/2 (somme arithmétique)",
      "Sₙ = u₀ · (1 − qⁿ)/(1 − q) (somme géométrique, q≠1)",
    ],
    formulaDetails: [
      {
        expr: "uₙ = u₀ + n·r",
        use: "Terme général d'une suite arithmétique. u₀ = premier terme, r = raison (différence entre termes consécutifs), n = rang (à partir de 0).",
        tip: "Raison r = uₙ₊₁ − uₙ (constante). Suite croissante si r > 0, décroissante si r < 0. Ex : 2, 5, 8, 11 → r = 3, u₀ = 2, uₙ = 2 + 3n.",
      },
      {
        expr: "uₙ = u₀ · qⁿ",
        use: "Terme général d'une suite géométrique. q = raison (quotient entre termes consécutifs). Si |q| < 1, les termes tendent vers 0.",
        tip: "Raison q = uₙ₊₁ / uₙ (constante). Ex : 3, 6, 12, 24 → q = 2, u₀ = 3, uₙ = 3 × 2ⁿ.",
      },
      {
        expr: "Sₙ = u₀(1 − qⁿ)/(1 − q)",
        use: "Somme des n premiers termes d'une suite géométrique. Très utile en finance (annuités, intérêts composés) et en physique (condensateur).",
        tip: "Si n → ∞ et |q| < 1 : Sₙ → u₀/(1 − q). C'est la somme d'une série géométrique convergente.",
      },
    ],
    lesson: {
      analogy:
        "Suite arithmétique = escalier (on monte ou descend d'un pas constant). Suite géométrique = bactéries qui doublent (on multiplie par un facteur constant). L'une grandit linéairement, l'autre de façon exponentielle.",
      steps: [
        "Une suite est une liste ordonnée de nombres. Chaque nombre est un 'terme' noté uₙ (n = rang, à partir de 0 ou 1 selon la convention).",
        "Suite arithmétique : on ajoute la même valeur à chaque fois. Raison r = uₙ₊₁ − uₙ (constante). Terme général : uₙ = u₀ + n·r. Exemple : 2, 5, 8, 11 → r = 3, uₙ = 2 + 3n.",
        "Suite géométrique : on multiplie par la même valeur à chaque fois. Raison q = uₙ₊₁/uₙ (constante). Terme général : uₙ = u₀ × qⁿ. Exemple : 3, 6, 12, 24 → q = 2, uₙ = 3 × 2ⁿ.",
        "Somme des n premiers termes — arithmétique : Sₙ = n × (u₀ + uₙ₋₁) / 2 (moyenne × nombre de termes). Géométrique : Sₙ = u₀ × (1 − qⁿ)/(1 − q) pour q ≠ 1.",
        "Convergence : une suite arithmétique (r ≠ 0) diverge toujours (→ +∞ ou −∞). Une suite géométrique converge vers 0 si |q| < 1, diverge si |q| > 1. Si q = 1 : constante.",
        "Récurrence : pour prouver qu'une propriété P(n) est vraie pour tout n, montrer P(0) (initialisation), puis supposer P(n) vraie et prouver P(n+1) (hérédité).",
      ],
    },
    example:
      "Suite géométrique : u₀ = 1 000, q = 1.05 (placement bancaire à 5%/an). u₁₀ = 1000 × 1.05¹⁰ ≈ 1 629 €. La valeur double en environ 14 ans (règle des 72 : 72/5 ≈ 14).",
    qa: [
      {
        keywords: ["arithmétique", "raison", "différence", "constante"],
        answer:
          "Suite arithmétique : uₙ₊₁ = uₙ + r (on ajoute toujours r). Terme général : uₙ = u₀ + n×r. Somme : Sₙ = n(u₀+uₙ)/2 = n(2u₀+(n−1)r)/2. Ex : 1, 4, 7, 10 → r=3, uₙ = 1 + 3n.",
      },
      {
        keywords: ["géométrique", "rapport", "multiplier", "croissance"],
        answer:
          "Suite géométrique : uₙ₊₁ = uₙ × q (on multiplie toujours par q). Terme général : uₙ = u₀ × qⁿ. Ex : 2, 6, 18, 54 → q=3, uₙ = 2 × 3ⁿ. Applications : intérêts composés, population, décroissance radioactive.",
      },
      {
        keywords: ["convergence", "limite", "tend", "infini"],
        answer:
          "Une suite (uₙ) converge vers L si uₙ → L quand n → +∞. Suite arithmétique : diverge toujours (sauf si r=0). Suite géométrique : converge vers 0 si |q|<1, diverge si |q|>1, reste constante si q=1.",
      },
    ],
  },
  /* ─────────────── Trigonométrie ─────────────── */
  {
    id: "trigonometry",
    subject: "math",
    title: "Trigonométrie",
    summary: "Fonctions sin, cos, tan, identités remarquables, cercle trigonométrique et formules.",
    notions: [
      "Le cercle trigonométrique est un cercle de rayon 1 centré en O",
      "Pour un angle θ (en radians) : le point M a pour coordonnées (cos θ, sin θ)",
      "tan θ = sin θ / cos θ (non défini quand cos θ = 0)",
      "Identité fondamentale : cos²θ + sin²θ = 1 (Pythagore sur le cercle unité)",
      "Radians : π rad = 180°. Conversion : θ(rad) = θ(°) × π/180",
    ],
    formulas: [
      "cos²θ + sin²θ = 1",
      "tan θ = sin θ / cos θ",
      "sin(a+b) = sin a cos b + cos a sin b",
      "cos(a+b) = cos a cos b − sin a sin b",
    ],
    formulaDetails: [
      {
        expr: "cos²θ + sin²θ = 1",
        use: "Identité de Pythagore — la plus importante. Permet d'exprimer sin en fonction de cos et vice versa. Utilisée pour simplifier des expressions et résoudre des équations.",
        tip: "Variantes : sin²θ = 1 − cos²θ. cos²θ = 1 − sin²θ. 1 + tan²θ = 1/cos²θ.",
      },
      {
        expr: "sin(a+b) = sin a cos b + cos a sin b",
        use: "Formule d'addition des angles. Permet de calculer sin(75°) = sin(45°+30°), de linéariser des produits trig, et de passer de sin(2x) à une forme développée.",
        tip: "sin(2x) = 2 sin x cos x. cos(2x) = cos²x − sin²x = 1 − 2sin²x = 2cos²x − 1.",
      },
      {
        expr: "Valeurs exactes clés",
        use: "À mémoriser : sin(0)=0, sin(30°)=1/2, sin(45°)=√2/2, sin(60°)=√3/2, sin(90°)=1. Pour cos : même valeurs mais dans l'ordre inverse (cos=sin(90°−θ)).",
        tip: "Moyen mnémo pour sin : 0 → √0/2, 30° → √1/2, 45° → √2/2, 60° → √3/2, 90° → √4/2. On fait passer √0 à √4 au numérateur !",
      },
    ],
    lesson: {
      analogy:
        "Imagine un point qui tourne sur une roue de rayon 1. Sa hauteur à chaque instant, c'est sin(θ). Sa position horizontale, c'est cos(θ). Ces deux fonctions décrivent tous les mouvements circulaires : alternateurs, signaux AC, ondes sonores.",
      steps: [
        "Le cercle trigonométrique : cercle de rayon 1 centré en O. Pour un angle θ (en radians), le point M sur le cercle a pour coordonnées (cos θ, sin θ).",
        "Conversion degrés ↔ radians : θ(rad) = θ(°) × π/180. Repères : 0° = 0, 30° = π/6, 45° = π/4, 60° = π/3, 90° = π/2, 180° = π, 360° = 2π.",
        "Valeurs exactes à mémoriser — sin : sin(0)=0, sin(30°)=1/2, sin(45°)=√2/2, sin(60°)=√3/2, sin(90°)=1. Pour cos, c'est l'ordre inverse : cos(0)=1, cos(30°)=√3/2, cos(45°)=√2/2, cos(60°)=1/2, cos(90°)=0.",
        "Identité fondamentale : cos²θ + sin²θ = 1 (Pythagore sur le cercle unité). Dérivées : (sin x)' = cos x et (cos x)' = −sin x. Et tan θ = sin θ / cos θ.",
        "Formules d'addition : sin(a+b) = sin a cos b + cos a sin b. cos(a+b) = cos a cos b − sin a sin b. Permettent de calculer sin(75°) ou de simplifier des expressions.",
        "Formules doubles : sin(2x) = 2 sin x cos x. cos(2x) = cos²x − sin²x = 1 − 2sin²x. Très utiles pour les intégrales de fonctions trigonométriques.",
      ],
    },
    example:
      "Résoudre sin(x) = √3/2 sur [0, 2π]. sin(x) = √3/2 → x = π/3 ou x = π − π/3 = 2π/3. Solutions : x ∈ {π/3, 2π/3} ≈ {1.047, 2.094}.",
    qa: [
      {
        keywords: ["radians", "degrés", "conversion", "π"],
        answer:
          "Conversion : θ(rad) = θ(°) × π/180. Inverse : θ(°) = θ(rad) × 180/π. Valeurs clés : 0°=0, 30°=π/6, 45°=π/4, 60°=π/3, 90°=π/2, 180°=π, 360°=2π.",
      },
      {
        keywords: ["identité", "pythagore", "carré", "unité"],
        answer:
          "L'identité fondamentale cos²θ + sin²θ = 1 vient du théorème de Pythagore appliqué au cercle unité. Elle génère : sin²θ = 1−cos²θ, 1+tan²θ = 1/cos²θ. Très utile pour simplifier et résoudre des équations trigonométriques.",
      },
      {
        keywords: ["cercle", "trigonométrique", "coordonnées", "angle"],
        answer:
          "Cercle trigo de rayon 1. Pour un angle θ, le point M sur le cercle a : x = cos θ, y = sin θ. Cadrans : Q1 (0 à π/2) : sin>0, cos>0. Q2 (π/2 à π) : sin>0, cos<0. Q3 (π à 3π/2) : sin<0, cos<0. Q4 (3π/2 à 2π) : sin<0, cos>0.",
      },
    ],
  },
];
