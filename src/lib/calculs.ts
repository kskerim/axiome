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
