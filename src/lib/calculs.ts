import type { Transaction } from "@/types";

// point de donnee pour le graphique d'evolution du solde
export interface PointSolde {
  mois: string;
  solde: number;
  revenus: number;
  depenses: number;
}

// calcule les kpi a partir des transactions
export function calculerKpi(transactions: Transaction[]) {
  const maintenant = new Date();
  const moisActuel = maintenant.getMonth();
  const anneeActuelle = maintenant.getFullYear();

  // filtre les transactions du mois en cours
  const txMoisActuel = transactions.filter((t) => {
    const d = new Date(t.date);
    return d.getMonth() === moisActuel && d.getFullYear() === anneeActuelle;
  });

  // filtre les transactions du mois precedent
  const moisPrec = moisActuel === 0 ? 11 : moisActuel - 1;
  const anneePrec = moisActuel === 0 ? anneeActuelle - 1 : anneeActuelle;
  const txMoisPrec = transactions.filter((t) => {
    const d = new Date(t.date);
    return d.getMonth() === moisPrec && d.getFullYear() === anneePrec;
  });

  const revenusMois = txMoisActuel
    .filter((t) => t.montant > 0)
    .reduce((acc, t) => acc + t.montant, 0);

  const depensesMois = Math.abs(
    txMoisActuel
      .filter((t) => t.montant < 0)
      .reduce((acc, t) => acc + t.montant, 0)
  );

  const revenusPrec = txMoisPrec
    .filter((t) => t.montant > 0)
    .reduce((acc, t) => acc + t.montant, 0);

  const depensesPrec = Math.abs(
    txMoisPrec
      .filter((t) => t.montant < 0)
      .reduce((acc, t) => acc + t.montant, 0)
  );

  // solde = somme de toutes les transactions
  const solde = transactions.reduce((acc, t) => acc + t.montant, 0);
  const soldePrec = solde - txMoisActuel.reduce((acc, t) => acc + t.montant, 0);

  // variation en pourcentage
  const variation = (actuel: number, precedent: number) =>
    precedent === 0 ? 0 : ((actuel - precedent) / precedent) * 100;

  return {
    solde,
    revenus: revenusMois,
    depenses: depensesMois,
    variationSolde: variation(solde, soldePrec),
    variationRevenus: variation(revenusMois, revenusPrec),
    variationDepenses: variation(depensesMois, depensesPrec),
  };
}

// genere les points de donnees mensuels pour le graphique
export function calculerEvolutionMensuelle(
  transactions: Transaction[]
): PointSolde[] {
  const points: PointSolde[] = [];
  const noms = [
    "jan", "fev", "mar", "avr", "mai", "jun",
    "jul", "aou", "sep", "oct", "nov", "dec",
  ];

  // regroupe par mois sur les 12 derniers mois
  let soldeCumulatif = 0;

  for (let i = 0; i < 12; i++) {
    const date = new Date(2025, 2 + i, 1);
    const mois = date.getMonth();
    const annee = date.getFullYear();

    const txMois = transactions.filter((t) => {
      const d = new Date(t.date);
      return d.getMonth() === mois && d.getFullYear() === annee;
    });

    const revenus = txMois
      .filter((t) => t.montant > 0)
      .reduce((acc, t) => acc + t.montant, 0);

    const depenses = Math.abs(
      txMois
        .filter((t) => t.montant < 0)
        .reduce((acc, t) => acc + t.montant, 0)
    );

    soldeCumulatif += revenus - depenses;

    const nomMois = noms[mois] ?? "?";
    points.push({
      mois: `${nomMois} ${annee.toString().slice(2)}`,
      solde: Math.round(soldeCumulatif),
      revenus: Math.round(revenus),
      depenses: Math.round(depenses),
    });
  }

  return points;
}

// categories considerees comme charges fixes
const CATEGORIES_FIXES = ["logement", "abonnements", "epargne"] as const;

// categories considerees comme revenus
const CATEGORIES_REVENUS = ["revenus"] as const;

// donnees du reste a vivre
export interface ResteAVivreData {
  revenus: number;
  chargesFixes: number;
  depensesVariables: number;
  resteAVivre: number;
  pourcentageConsomme: number;
  budgetDisponible: number;
  detailFixes: { categorie: string; montant: number }[];
}

// calcule le reste a vivre du mois en cours
export function calculerResteAVivre(transactions: Transaction[]): ResteAVivreData {
  const maintenant = new Date();
  const moisActuel = maintenant.getMonth();
  const anneeActuelle = maintenant.getFullYear();

  // transactions du mois en cours
  const txMois = transactions.filter((t) => {
    const d = new Date(t.date);
    return d.getMonth() === moisActuel && d.getFullYear() === anneeActuelle;
  });

  // revenus du mois
  const revenus = txMois
    .filter((t) => (CATEGORIES_REVENUS as readonly string[]).includes(t.categorie))
    .reduce((acc, t) => acc + Math.abs(t.montant), 0);

  // charges fixes du mois (logement, abonnements, epargne)
  const txFixes = txMois.filter(
    (t) => (CATEGORIES_FIXES as readonly string[]).includes(t.categorie) && t.montant < 0
  );
  const chargesFixes = Math.abs(txFixes.reduce((acc, t) => acc + t.montant, 0));

  // detail par categorie fixe
  const detailFixes = (CATEGORIES_FIXES as readonly string[]).map((cat) => ({
    categorie: cat,
    montant: Math.abs(
      txFixes.filter((t) => t.categorie === cat).reduce((acc, t) => acc + t.montant, 0)
    ),
  })).filter((d) => d.montant > 0);

  // depenses variables = toutes les depenses hors charges fixes
  const depensesVariables = Math.abs(
    txMois
      .filter(
        (t) =>
          t.montant < 0 &&
          !(CATEGORIES_FIXES as readonly string[]).includes(t.categorie)
      )
      .reduce((acc, t) => acc + t.montant, 0)
  );

  // budget disponible = revenus - charges fixes
  const budgetDisponible = Math.max(0, revenus - chargesFixes);

  // reste a vivre = budget disponible - depenses variables
  const resteAVivre = budgetDisponible - depensesVariables;

  // pourcentage du budget disponible deja consomme
  const pourcentageConsomme =
    budgetDisponible === 0
      ? 100
      : Math.min(100, Math.round((depensesVariables / budgetDisponible) * 100));

  return {
    revenus,
    chargesFixes,
    depensesVariables,
    resteAVivre,
    pourcentageConsomme,
    budgetDisponible,
    detailFixes,
  };
}

// formate un montant en euros
export function formaterMontant(montant: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(montant);
}

// formate un pourcentage avec signe
export function formaterVariation(variation: number): string {
  const signe = variation >= 0 ? "+" : "";
  return `${signe}${variation.toFixed(1)}%`;
}

// donnees d'un budget par categorie
export interface BudgetCategorie {
  categorie: string;
  budget: number;
  depense: number;
  pourcentage: number;
  restant: number;
  depasse: boolean;
}

// calcule les budgets par categorie pour le mois en cours
export function calculerBudgetsCategorie(
  transactions: Transaction[],
  budgets: Record<string, number>
): BudgetCategorie[] {
  const maintenant = new Date();
  const moisActuel = maintenant.getMonth();
  const anneeActuelle = maintenant.getFullYear();

  // transactions du mois en cours (depenses uniquement)
  const txMois = transactions.filter((t) => {
    const d = new Date(t.date);
    return (
      d.getMonth() === moisActuel &&
      d.getFullYear() === anneeActuelle &&
      t.montant < 0
    );
  });

  // depenses groupees par categorie
  const depensesParCategorie: Record<string, number> = {};
  for (const tx of txMois) {
    const cat = tx.categorie;
    depensesParCategorie[cat] = (depensesParCategorie[cat] ?? 0) + Math.abs(tx.montant);
  }

  // construit les budgets avec pourcentage et statut
  const resultats: BudgetCategorie[] = [];

  for (const [categorie, budget] of Object.entries(budgets)) {
    const depense = depensesParCategorie[categorie] ?? 0;
    if (depense === 0 && budget === 0) continue;

    const pourcentage = budget === 0 ? 100 : Math.round((depense / budget) * 100);
    resultats.push({
      categorie,
      budget,
      depense: Math.round(depense),
      pourcentage,
      restant: Math.round(budget - depense),
      depasse: depense > budget,
    });
  }

  // trie par pourcentage decroissant (les plus consommes en premier)
  return resultats.sort((a, b) => b.pourcentage - a.pourcentage);
}

// donnees de la projection fin de mois
export interface ProjectionFinMois {
  soldeActuel: number;
  revenusRestants: number;
  depensesRecurrentesAVenir: number;
  soldeProjecte: number;
  joursRestants: number;
  depensesMoyennesJour: number;
  depensesEstimeesRestantes: number;
}

// projette le solde en fin de mois
export function calculerProjectionFinMois(
  transactions: Transaction[]
): ProjectionFinMois {
  const maintenant = new Date();
  const moisActuel = maintenant.getMonth();
  const anneeActuelle = maintenant.getFullYear();
  const jourActuel = maintenant.getDate();

  // dernier jour du mois
  const dernierJour = new Date(anneeActuelle, moisActuel + 1, 0).getDate();
  const joursRestants = Math.max(0, dernierJour - jourActuel);
  const joursPasses = jourActuel;

  // transactions du mois en cours
  const txMois = transactions.filter((t) => {
    const d = new Date(t.date);
    return d.getMonth() === moisActuel && d.getFullYear() === anneeActuelle;
  });

  // solde total actuel
  const soldeActuel = transactions.reduce((acc, t) => acc + t.montant, 0);

  // depenses variables du mois (hors recurrentes)
  const depensesVariables = Math.abs(
    txMois
      .filter((t) => t.montant < 0 && !t.isRecurring)
      .reduce((acc, t) => acc + t.montant, 0)
  );

  // moyenne journaliere des depenses variables
  const depensesMoyennesJour = joursPasses > 0 ? depensesVariables / joursPasses : 0;

  // estimation des depenses variables restantes
  const depensesEstimeesRestantes = depensesMoyennesJour * joursRestants;

  // depenses recurrentes du mois deja passees
  const recurrentesPassees = txMois.filter((t) => t.montant < 0 && t.isRecurring);

  // on cherche les recurrentes qui n'ont pas encore ete debitees ce mois
  // on se base sur les recurrentes historiques du mois precedent
  const moisPrec = moisActuel === 0 ? 11 : moisActuel - 1;
  const anneePrec = moisActuel === 0 ? anneeActuelle - 1 : anneeActuelle;
  const recurrentesPrec = transactions.filter((t) => {
    const d = new Date(t.date);
    return (
      d.getMonth() === moisPrec &&
      d.getFullYear() === anneePrec &&
      t.montant < 0 &&
      t.isRecurring
    );
  });

  // marchands recurrents deja debites ce mois
  const marchandsDebites = new Set(
    recurrentesPassees.map((t) => t.marchand.toLowerCase())
  );

  // montant des recurrentes attendues mais pas encore debitees
  const depensesRecurrentesAVenir = Math.abs(
    recurrentesPrec
      .filter((t) => !marchandsDebites.has(t.marchand.toLowerCase()))
      .reduce((acc, t) => acc + t.montant, 0)
  );

  // projection : solde actuel - recurrentes a venir - depenses variables estimees
  const soldeProjecte = soldeActuel - depensesRecurrentesAVenir - depensesEstimeesRestantes;

  return {
    soldeActuel: Math.round(soldeActuel),
    revenusRestants: 0,
    depensesRecurrentesAVenir: Math.round(depensesRecurrentesAVenir),
    soldeProjecte: Math.round(soldeProjecte),
    joursRestants,
    depensesMoyennesJour: Math.round(depensesMoyennesJour),
    depensesEstimeesRestantes: Math.round(depensesEstimeesRestantes),
  };
}
