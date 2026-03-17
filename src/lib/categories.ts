import type { CategorieTransaction } from "@/types";

// labels d'affichage pour chaque categorie
const LABELS: Record<CategorieTransaction, string> = {
  alimentation: "Alimentation",
  transport: "Transport",
  automobile: "Automobile",
  loyer: "Loyer",
  electricite: "Electricite",
  eau: "Eau",
  gaz: "Gaz",
  forfait_tel: "Forfait tel",
  box_internet: "Box internet",
  assurances: "Assurances",
  loisirs: "Loisirs",
  sante: "Sante",
  restauration: "Restauration",
  bar_cafe: "Bar & Cafe",
  abonnements: "Abonnements",
  shopping: "Shopping",
  beaute: "Beaute",
  animaux: "Animaux",
  maison: "Maison",
  cadeaux: "Cadeaux",
  education: "Education",
  voyage: "Voyage",
  revenus: "Revenus",
  epargne: "Epargne",
  divers: "Divers",
};

// retourne le label d'affichage pour une categorie
export function labelCategorie(cat: string): string {
  return LABELS[cat as CategorieTransaction] ?? cat;
}

// liste ordonnee des categories pour les filtres
export const CATEGORIES_FILTRE: Array<CategorieTransaction | "toutes"> = [
  "toutes",
  "alimentation",
  "transport",
  "automobile",
  "loyer",
  "electricite",
  "eau",
  "gaz",
  "forfait_tel",
  "box_internet",
  "assurances",
  "loisirs",
  "sante",
  "restauration",
  "bar_cafe",
  "abonnements",
  "shopping",
  "beaute",
  "animaux",
  "maison",
  "cadeaux",
  "education",
  "voyage",
  "revenus",
  "epargne",
  "divers",
];
