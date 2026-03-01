import { faker } from "@faker-js/faker/locale/fr";
import type { Transaction, CategorieTransaction } from "@/types";

// seed fixe pour reproductibilite des donnees
faker.seed(42);

// nombre total de transactions a generer
const NOMBRE_TRANSACTIONS = 550;

// plage temporelle : 12 derniers mois
const DATE_FIN = new Date(2026, 2, 1);
const DATE_DEBUT = new Date(2025, 2, 1);

// marchands par categorie avec montants min/max typiques
const MARCHANDS_PAR_CATEGORIE: Record<
  CategorieTransaction,
  { noms: string[]; min: number; max: number }
> = {
  alimentation: {
    noms: [
      "carrefour", "leclerc", "auchan", "lidl", "monoprix", "picard",
      "franprix", "intermarche", "grand frais", "biocoop", "naturalia",
      "boulangerie paul", "marche couvert", "primeur du coin",
    ],
    min: 3,
    max: 180,
  },
  transport: {
    noms: ["uber", "bolt", "ratp", "sncf", "navigo", "blablacar", "lime", "tier", "indigo parking"],
    min: 1.5,
    max: 120,
  },
  automobile: {
    noms: [
      "totalenergies", "shell", "bp", "esso", "avia",
      "norauto", "feu vert", "speedy", "midas",
      "controle technique", "peage autoroute", "lavage auto",
    ],
    min: 15,
    max: 120,
  },
  logement: {
    noms: ["loyer mensuel", "edf", "engie", "veolia", "free box", "orange fibre", "sfr box", "taxe fonciere"],
    min: 30,
    max: 950,
  },
  loisirs: {
    noms: [
      "fnac", "cultura", "ugc", "pathe", "decathlon", "canal+",
      "bowling", "musee du louvre", "parc asterix", "escape game",
      "cinema mk2", "laser game",
    ],
    min: 8,
    max: 150,
  },
  sante: {
    noms: [
      "pharmacie lafayette", "doctolib", "optical center",
      "allianz", "axa", "maif", "macif", "matmut", "groupama",
      "alan", "harmonie mutuelle", "dentiste", "kine",
    ],
    min: 10,
    max: 200,
  },
  restauration: {
    noms: [
      "uber eats", "deliveroo", "just eat",
      "mcdonald's", "sushi shop", "domino's", "le bistrot",
      "kebab du coin", "brasserie du marche", "la pizzeria",
      "five guys", "flunch", "buffalo grill",
    ],
    min: 5,
    max: 85,
  },
  bar_cafe: {
    noms: [
      "starbucks", "columbus cafe", "cafe de flore", "paul",
      "bar le comptoir", "pub o'malley", "le zinc",
    ],
    min: 3,
    max: 35,
  },
  abonnements: {
    noms: [
      "netflix", "spotify", "amazon prime", "disney+",
      "apple music", "chatgpt plus", "adobe cc", "github copilot",
      "salle de sport", "deezer", "youtube premium", "crunchyroll",
      "canal+", "free mobile", "orange", "sfr", "bouygues telecom",
      "icloud", "google one", "le monde", "mediapart",
      "basic fit", "fitness park", "n26", "revolut",
    ],
    min: 5,
    max: 55,
  },
  shopping: {
    noms: ["amazon", "zalando", "zara", "h&m", "ikea", "apple store", "action", "gifi", "primark"],
    min: 10,
    max: 500,
  },
  beaute: {
    noms: [
      "sephora", "yves rocher", "nocibe", "coiffeur",
      "institut de beaute", "barber shop", "manucure",
    ],
    min: 10,
    max: 120,
  },
  animaux: {
    noms: ["veterinaire", "jardiland", "truffaut", "animalis", "zooplus"],
    min: 10,
    max: 200,
  },
  maison: {
    noms: [
      "leroy merlin", "castorama", "boulanger", "darty",
      "bricomarche", "but", "conforama", "maisons du monde",
    ],
    min: 15,
    max: 400,
  },
  cadeaux: {
    noms: ["fleuriste", "bijouterie", "jouets club", "nature et decouvertes", "la chaise longue"],
    min: 15,
    max: 200,
  },
  education: {
    noms: ["udemy", "coursera", "openclassrooms", "librairie", "papeterie"],
    min: 10,
    max: 100,
  },
  voyage: {
    noms: ["booking.com", "airbnb", "air france", "flixbus", "blablacar", "ouigo", "easyjet"],
    min: 30,
    max: 600,
  },
  revenus: {
    noms: [
      "salaire entreprise", "freelance",
      "remboursement secu", "virement recu", "caf", "prime employeur",
    ],
    min: 500,
    max: 3200,
  },
  epargne: {
    noms: ["livret a", "assurance vie", "pea", "crypto", "boursorama banque"],
    min: 50,
    max: 500,
  },
  divers: {
    noms: ["retrait dab", "virement", "paypal", "lydia", "tabac presse", "pressing", "serrurier", "la poste"],
    min: 5,
    max: 200,
  },
};

// poids de probabilite pour chaque categorie (influence la frequence)
const POIDS_CATEGORIES: Record<CategorieTransaction, number> = {
  alimentation: 22,
  transport: 8,
  automobile: 8,
  logement: 5,
  loisirs: 6,
  sante: 4,
  restauration: 14,
  bar_cafe: 7,
  abonnements: 8,
  shopping: 5,
  beaute: 3,
  animaux: 2,
  maison: 3,
  cadeaux: 2,
  education: 2,
  voyage: 2,
  revenus: 3,
  epargne: 2,
  divers: 3,
};

// configuration des abonnements avec subscription creep
interface AbonnementConfig {
  marchand: string;
  montantBase: number;
  creepMontant: number;
  creepFrequenceMois: number;
}

// abonnements qui subissent une augmentation progressive
const ABONNEMENTS_CREEP: AbonnementConfig[] = [
  {
    marchand: "netflix",
    montantBase: 13.49,
    creepMontant: 2,
    creepFrequenceMois: 3,
  },
  {
    marchand: "spotify",
    montantBase: 10.99,
    creepMontant: 1.5,
    creepFrequenceMois: 4,
  },
  {
    marchand: "adobe cc",
    montantBase: 23.99,
    creepMontant: 3,
    creepFrequenceMois: 3,
  },
  {
    marchand: "basic fit",
    montantBase: 29.99,
    creepMontant: 2.5,
    creepFrequenceMois: 3,
  },
  {
    marchand: "canal+",
    montantBase: 21.99,
    creepMontant: 2,
    creepFrequenceMois: 4,
  },
  {
    marchand: "free mobile",
    montantBase: 19.99,
    creepMontant: 1,
    creepFrequenceMois: 4,
  },
  {
    marchand: "chatgpt plus",
    montantBase: 20,
    creepMontant: 2,
    creepFrequenceMois: 4,
  },
];

// selectionne une categorie aleatoire selon les poids definis
function choisirCategorie(): CategorieTransaction {
  const categories = Object.keys(
    POIDS_CATEGORIES
  ) as CategorieTransaction[];
  const totalPoids = Object.values(POIDS_CATEGORIES).reduce(
    (acc, p) => acc + p,
    0
  );
  let random = faker.number.float({ min: 0, max: totalPoids });

  for (const cat of categories) {
    random -= POIDS_CATEGORIES[cat];
    if (random <= 0) return cat;
  }
  return "divers";
}

// choisit un marchand aleatoire dans une categorie
function choisirMarchand(categorie: CategorieTransaction): string {
  const config = MARCHANDS_PAR_CATEGORIE[categorie];
  return faker.helpers.arrayElement(config.noms);
}

// genere un montant realiste pour une categorie donnee
function genererMontant(categorie: CategorieTransaction): number {
  const { min, max } = MARCHANDS_PAR_CATEGORIE[categorie];
  const montant = faker.number.float({
    min,
    max,
    fractionDigits: 2,
  });
  // les revenus sont positifs, le reste est negatif
  return categorie === "revenus" ? montant : -montant;
}

// genere une date aleatoire dans la plage des 12 derniers mois
function genererDate(): Date {
  return faker.date.between({ from: DATE_DEBUT, to: DATE_FIN });
}

// genere les transactions d'abonnements avec subscription creep
function genererAbonnementsCreep(): Transaction[] {
  const transactions: Transaction[] = [];

  for (const abo of ABONNEMENTS_CREEP) {
    let montantCourant = abo.montantBase;

    // genere une transaction par mois sur 12 mois
    for (let mois = 0; mois < 12; mois++) {
      // applique le creep selon la frequence definie
      if (mois > 0 && mois % abo.creepFrequenceMois === 0) {
        montantCourant += abo.creepMontant;
      }

      const date = new Date(2025, 2 + mois, faker.number.int({ min: 1, max: 5 }));

      transactions.push({
        id: faker.string.uuid(),
        date,
        montant: -Number(montantCourant.toFixed(2)),
        categorie: "abonnements",
        marchand: abo.marchand,
        isRecurring: true,
      });
    }
  }

  return transactions;
}

// genere les revenus mensuels recurrents (salaire)
function genererRevenusRecurrents(): Transaction[] {
  const transactions: Transaction[] = [];
  const salaireBase = faker.number.float({
    min: 2400,
    max: 3200,
    fractionDigits: 2,
  });

  for (let mois = 0; mois < 12; mois++) {
    const date = new Date(
      2025,
      2 + mois,
      faker.number.int({ min: 25, max: 28 })
    );
    transactions.push({
      id: faker.string.uuid(),
      date,
      montant: salaireBase,
      categorie: "revenus",
      marchand: "salaire entreprise",
      isRecurring: true,
    });
  }

  return transactions;
}

// genere les transactions aleatoires non recurrentes
function genererTransactionsAleatoires(nombre: number): Transaction[] {
  const transactions: Transaction[] = [];

  for (let i = 0; i < nombre; i++) {
    const categorie = choisirCategorie();
    const marchand = choisirMarchand(categorie);

    transactions.push({
      id: faker.string.uuid(),
      date: genererDate(),
      montant: genererMontant(categorie),
      categorie,
      marchand,
      isRecurring: false,
    });
  }

  return transactions;
}

// genere l'ensemble des transactions mockees
// combine abonnements creep, revenus recurrents et transactions aleatoires
function genererToutesLesTransactions(): Transaction[] {
  const abonnements = genererAbonnementsCreep();
  const revenus = genererRevenusRecurrents();
  const nbAleatoires = NOMBRE_TRANSACTIONS - abonnements.length - revenus.length;
  const aleatoires = genererTransactionsAleatoires(nbAleatoires);

  const toutes = [...abonnements, ...revenus, ...aleatoires];

  // tri par date decroissante (plus recent en premier)
  toutes.sort((a, b) => b.date.getTime() - a.date.getTime());

  return toutes;
}

// transactions generees, exportees pour usage global
export const transactions: Transaction[] = genererToutesLesTransactions();

// nombre total de transactions generees (verification)
export const totalTransactions = transactions.length;
