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
];
