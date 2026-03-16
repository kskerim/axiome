import { toast } from "sonner";
import { useAxiomeStore } from "@/store";
import { calculerBudgetsCategorie } from "@/lib/calculs";

// labels en francais pour les categories
const LABELS_CATEGORIES: Record<string, string> = {
  alimentation: "Alimentation",
  transport: "Transport",
  automobile: "Automobile",
  logement: "Logement",
  loisirs: "Loisirs",
  sante: "Santé",
  restauration: "Restauration",
  bar_cafe: "Bar / Café",
  abonnements: "Abonnements",
  shopping: "Shopping",
  beaute: "Beauté",
  animaux: "Animaux",
  maison: "Maison",
  cadeaux: "Cadeaux",
  education: "Éducation",
  voyage: "Voyage",
  divers: "Divers",
};

// verifie si une categorie a depasse son budget et affiche un toast
export function verifierDepassementBudget(categorie: string): void {
  const { transactions, budgets } = useAxiomeStore.getState();
  const resultats = calculerBudgetsCategorie(transactions, budgets);

  const budgetCat = resultats.find((b) => b.categorie === categorie);
  if (!budgetCat) return;

  const label = LABELS_CATEGORIES[categorie] ?? categorie;

  // alerte si le budget est depasse
  if (budgetCat.depasse) {
    toast.error(
      `Budget "${label}" dépassé`,
      {
        description: `${budgetCat.depense} EUR dépensés sur ${budgetCat.budget} EUR prévus (+${Math.abs(budgetCat.restant)} EUR)`,
        duration: 5000,
      }
    );
    return;
  }

  // avertissement si plus de 90% consomme
  if (budgetCat.pourcentage >= 90) {
    toast.warning(
      `Budget "${label}" presque épuisé`,
      {
        description: `${budgetCat.pourcentage}% consommé (${budgetCat.restant} EUR restants)`,
        duration: 4000,
      }
    );
  }
}
