import type { CategorieTransaction } from "@/types";

// labels d'affichage pour chaque categorie
const LABELS: Record<CategorieTransaction, string> = {
  alimentation: "Alimentation",
  transport: "Transport",
  automobile: "Automobile",
  logement: "Logement",
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

// liste ordonnee des categories de depense pour les filtres
export const CATEGORIES_FILTRE: Array<CategorieTransaction | "toutes"> = [
  "toutes",
  "alimentation",
  "transport",
  "automobile",
  "logement",
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
