// types principaux de l'application axiome

// transaction financiere
export interface Transaction {
  id: string;
  date: Date;
  montant: number;
  categorie: CategorieTransaction;
  marchand: string;
  isRecurring: boolean;
}

// categories de transactions possibles
export type CategorieTransaction =
  | "alimentation"
  | "transport"
  | "loyer"
  | "electricite"
  | "eau"
  | "gaz"
  | "forfait_tel"
  | "box_internet"
  | "assurances"
  | "loisirs"
  | "sante"
  | "restauration"
  | "abonnements"
  | "shopping"
  | "education"
  | "voyage"
  | "revenus"
  | "epargne"
  | "automobile"
  | "beaute"
  | "bar_cafe"
  | "animaux"
  | "maison"
  | "cadeaux"
  | "divers";

// alerte generee par le moteur d'analyse
export interface Alerte {
  id: string;
  type: TypeAlerte;
  severite: "info" | "attention" | "critique";
  message: string;
  categorie?: CategorieTransaction;
  marchand?: string;
  variation?: number;
}

// types d'alertes possibles
export type TypeAlerte =
  | "subscription_creep"
  | "depassement_moyenne"
  | "anomalie_montant"
  | "tendance_hausse";

// donnees pour les kpi cards
export interface KpiData {
  solde: number;
  revenus: number;
  depenses: number;
  variationSolde: number;
  variationRevenus: number;
  variationDepenses: number;
}
