import type { Transaction, Alerte, CategorieTransaction } from "@/types";

// seuil de variation en % pour declencher une alerte subscription creep
const SEUIL_CREEP_POURCENT = 5;

// seuil de depassement de la moyenne mensuelle en %
const SEUIL_DEPASSEMENT_MOYENNE = 30;

// seuil d'anomalie par rapport a la moyenne du marchand
const SEUIL_ANOMALIE_MONTANT = 2.5;

let compteurId = 0;

// genere un id unique pour chaque alerte
function genId(): string {
  compteurId++;
  return `alerte-${compteurId}`;
}

// regroupe les transactions par marchand
function parMarchand(transactions: Transaction[]): Map<string, Transaction[]> {
  const map = new Map<string, Transaction[]>();
  for (const tx of transactions) {
    const existant = map.get(tx.marchand) ?? [];
    existant.push(tx);
    map.set(tx.marchand, existant);
  }
  return map;
}

// regroupe les transactions par categorie et par mois, retourne les depenses totales
function depensesParCategorieParMois(
  transactions: Transaction[]
): Map<CategorieTransaction, Map<string, number>> {
  const map = new Map<CategorieTransaction, Map<string, number>>();
  for (const tx of transactions) {
    if (tx.montant >= 0) continue;
    const moisMap = map.get(tx.categorie) ?? new Map<string, number>();
    const d = new Date(tx.date);
    const cle = `${d.getFullYear()}-${String(d.getMonth()).padStart(2, "0")}`;
    moisMap.set(cle, (moisMap.get(cle) ?? 0) + Math.abs(tx.montant));
    map.set(tx.categorie, moisMap);
  }
  return map;
}

// detecte les augmentations progressives d'abonnements (subscription creep)
function detecterSubscriptionCreep(transactions: Transaction[]): Alerte[] {
  const alertes: Alerte[] = [];
  const groupes = parMarchand(transactions);

  for (const [marchand, txs] of groupes) {
    // ne garde que les recurrents
    const recurrents = txs.filter((t) => t.isRecurring && t.montant < 0);
    if (recurrents.length < 3) continue;

    // tri par date croissante
    recurrents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const premier = Math.abs(recurrents[0]!.montant);
    const dernier = Math.abs(recurrents[recurrents.length - 1]!.montant);

    if (premier === 0) continue;
    const variationPourcent = ((dernier - premier) / premier) * 100;

    if (variationPourcent > SEUIL_CREEP_POURCENT) {
      const augmentation = (dernier - premier).toFixed(2);

      alertes.push({
        id: genId(),
        type: "subscription_creep",
        severite: variationPourcent > 20 ? "critique" : "attention",
        message: `l'abonnement "${marchand}" est passé de ${premier.toFixed(2)} à ${dernier.toFixed(2)} (+${augmentation}) sur ${recurrents.length} mois`,
        marchand,
        categorie: "abonnements",
        variation: variationPourcent,
      });
    }
  }

  return alertes;
}

// detecte les categories dont les depenses depassent la moyenne
function detecterDepassementMoyenne(transactions: Transaction[]): Alerte[] {
  const alertes: Alerte[] = [];
  const donnees = depensesParCategorieParMois(transactions);

  for (const [categorie, moisMap] of donnees) {
    const valeurs = Array.from(moisMap.values());
    if (valeurs.length < 2) continue;

    const moyenne = valeurs.reduce((a, b) => a + b, 0) / valeurs.length;

    // compare le dernier mois a la moyenne
    const cles = Array.from(moisMap.keys()).sort();
    const derniereCle = cles[cles.length - 1];
    if (!derniereCle) continue;
    const dernierMois = moisMap.get(derniereCle) ?? 0;

    const depassement = ((dernierMois - moyenne) / moyenne) * 100;

    if (depassement > SEUIL_DEPASSEMENT_MOYENNE) {
      alertes.push({
        id: genId(),
        type: "depassement_moyenne",
        severite: depassement > 60 ? "critique" : "attention",
        message: `les dépenses en "${categorie}" dépassent la moyenne de ${depassement.toFixed(0)}% ce mois-ci (${dernierMois.toFixed(0)} vs ${moyenne.toFixed(0)} en moyenne)`,
        categorie,
        variation: depassement,
      });
    }
  }

  return alertes;
}

// detecte les montants anormalement eleves sur un marchand
function detecterAnomaliesMontant(transactions: Transaction[]): Alerte[] {
  const alertes: Alerte[] = [];
  const groupes = parMarchand(transactions);

  for (const [marchand, txs] of groupes) {
    const depenses = txs.filter((t) => t.montant < 0).map((t) => Math.abs(t.montant));
    if (depenses.length < 5) continue;

    const moyenne = depenses.reduce((a, b) => a + b, 0) / depenses.length;
    const ecartType = Math.sqrt(
      depenses.reduce((acc, v) => acc + (v - moyenne) ** 2, 0) / depenses.length
    );

    // cherche les transactions recentes au-dela de n ecarts-types
    const recentes = txs
      .filter((t) => t.montant < 0)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3);

    for (const tx of recentes) {
      const montant = Math.abs(tx.montant);
      if (ecartType > 0 && (montant - moyenne) / ecartType > SEUIL_ANOMALIE_MONTANT) {
        alertes.push({
          id: genId(),
          type: "anomalie_montant",
          severite: "info",
          message: `transaction inhabituelle chez "${marchand}" : ${montant.toFixed(2)} (moyenne habituelle : ${moyenne.toFixed(2)})`,
          marchand,
          categorie: tx.categorie,
          variation: ((montant - moyenne) / moyenne) * 100,
        });
        break;
      }
    }
  }

  return alertes;
}

// detecte les tendances a la hausse sur les categories
function detecterTendancesHausse(transactions: Transaction[]): Alerte[] {
  const alertes: Alerte[] = [];
  const donnees = depensesParCategorieParMois(transactions);

  for (const [categorie, moisMap] of donnees) {
    const cles = Array.from(moisMap.keys()).sort();
    if (cles.length < 4) continue;

    // regarde les 4 derniers mois
    const derniers = cles.slice(-4).map((c) => moisMap.get(c) ?? 0);

    // verifie si c'est en hausse continue
    let enHausse = true;
    for (let i = 1; i < derniers.length; i++) {
      if ((derniers[i] ?? 0) <= (derniers[i - 1] ?? 0)) {
        enHausse = false;
        break;
      }
    }

    if (enHausse) {
      const premier = derniers[0] ?? 0;
      const dernier = derniers[derniers.length - 1] ?? 0;
      const hausse = premier > 0 ? ((dernier - premier) / premier) * 100 : 0;

      alertes.push({
        id: genId(),
        type: "tendance_hausse",
        severite: hausse > 50 ? "attention" : "info",
        message: `les dépenses en "${categorie}" sont en hausse continue depuis 4 mois (+${hausse.toFixed(0)}%)`,
        categorie,
        variation: hausse,
      });
    }
  }

  return alertes;
}

// lance toutes les analyses et retourne les alertes triees par severite
export function analyserTransactions(transactions: Transaction[]): Alerte[] {
  compteurId = 0;

  const alertes = [
    ...detecterSubscriptionCreep(transactions),
    ...detecterDepassementMoyenne(transactions),
    ...detecterAnomaliesMontant(transactions),
    ...detecterTendancesHausse(transactions),
  ];

  // tri par severite (critique > attention > info)
  const ordreSeverite = { critique: 0, attention: 1, info: 2 };
  alertes.sort((a, b) => ordreSeverite[a.severite] - ordreSeverite[b.severite]);

  return alertes;
}
