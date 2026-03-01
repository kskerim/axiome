// mapping des marchands vers leurs domaines pour recuperer les logos
// utilise le service clearbit logo api : https://logo.clearbit.com/{domain}

// domaines connus des marchands
const DOMAINES_MARCHANDS: Record<string, string> = {
  // abonnements streaming
  netflix: "netflix.com",
  spotify: "spotify.com",
  "amazon prime": "amazon.fr",
  "disney+": "disneyplus.com",
  "apple music": "apple.com",
  "chatgpt plus": "openai.com",
  "adobe cc": "adobe.com",
  "github copilot": "github.com",
  deezer: "deezer.com",
  "youtube premium": "youtube.com",
  crunchyroll: "crunchyroll.com",
  "canal+": "canalplus.com",

  // telecoms / box
  free: "free.fr",
  sfr: "sfr.fr",
  orange: "orange.fr",
  "bouygues telecom": "bouyguestelecom.fr",
  "free box": "free.fr",
  "free mobile": "free.fr",
  "sfr box": "sfr.fr",
  "orange fibre": "orange.fr",

  // sport
  "salle de sport": "basicfit.com",
  "basic fit": "basicfit.com",
  "fitness park": "fitnesspark.fr",

  // alimentation
  carrefour: "carrefour.fr",
  leclerc: "e-leclerc.com",
  auchan: "auchan.fr",
  lidl: "lidl.fr",
  monoprix: "monoprix.fr",
  picard: "picard.fr",

  // transport
  uber: "uber.com",
  bolt: "bolt.eu",
  ratp: "ratp.fr",
  sncf: "sncf.fr",
  totalenergies: "totalenergies.fr",
  shell: "shell.fr",
  navigo: "iledefrance-mobilites.fr",

  // restauration
  "uber eats": "ubereats.com",
  deliveroo: "deliveroo.fr",
  "just eat": "justeat.fr",
  "mcdonald's": "mcdonalds.fr",
  "sushi shop": "sushishop.fr",
  "domino's": "dominos.fr",
  "le bistrot": "",

  // logement / energie
  "loyer mensuel": "",
  edf: "edf.fr",
  engie: "engie.fr",
  veolia: "veolia.fr",

  // shopping
  amazon: "amazon.fr",
  zalando: "zalando.fr",
  zara: "zara.com",
  "h&m": "hm.com",
  ikea: "ikea.com",
  "apple store": "apple.com",

  // sante / assurances
  "pharmacie lafayette": "pharmacielafayette.com",
  doctolib: "doctolib.fr",
  "optical center": "optical-center.fr",
  allianz: "allianz.fr",
  axa: "axa.fr",
  maif: "maif.fr",
  macif: "macif.fr",
  matmut: "matmut.fr",
  groupama: "groupama.fr",
  alan: "alan.com",
  "harmonie mutuelle": "harmonie-mutuelle.fr",

  // banque
  "boursorama banque": "boursorama.com",
  "n26": "n26.com",
  revolut: "revolut.com",

  // education
  udemy: "udemy.com",
  coursera: "coursera.org",
  openclassrooms: "openclassrooms.com",
  librairie: "",

  // voyage
  "booking.com": "booking.com",
  airbnb: "airbnb.fr",
  "air france": "airfrance.fr",
  flixbus: "flixbus.fr",
  blablacar: "blablacar.fr",

  // revenus
  "salaire entreprise": "",
  freelance: "",
  "remboursement secu": "ameli.fr",
  "virement recu": "",

  // epargne
  "livret a": "",
  "assurance vie": "",
  pea: "",
  crypto: "binance.com",

  // divers
  "retrait dab": "",
  virement: "",
  paypal: "paypal.com",
  lydia: "lydia-app.com",

  // presse
  "le monde": "lemonde.fr",
  mediapart: "mediapart.fr",

  // cloud
  icloud: "apple.com",
  "google one": "google.com",
};

// taille par defaut des logos en pixels
const TAILLE_LOGO_DEFAUT = 32;

// retourne l'url du logo pour un marchand donne
export function getLogoUrl(marchand: string, taille = TAILLE_LOGO_DEFAUT): string {
  const cle = marchand.toLowerCase();
  const domaine = DOMAINES_MARCHANDS[cle];

  if (!domaine) {
    // pas de domaine connu, retourne une chaine vide
    return "";
  }

  return `https://logo.clearbit.com/${domaine}?size=${taille}`;
}

// retourne les initiales d'un marchand (fallback quand pas de logo)
export function getInitiales(marchand: string): string {
  return marchand
    .split(" ")
    .map((mot) => mot.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// couleurs de fond pour les initiales par categorie
const COULEURS_CATEGORIES: Record<string, string> = {
  alimentation: "bg-emerald-900/50 text-emerald-400",
  transport: "bg-blue-900/50 text-blue-400",
  logement: "bg-amber-900/50 text-amber-400",
  loisirs: "bg-purple-900/50 text-purple-400",
  sante: "bg-red-900/50 text-red-400",
  restauration: "bg-orange-900/50 text-orange-400",
  abonnements: "bg-indigo-900/50 text-indigo-400",
  shopping: "bg-pink-900/50 text-pink-400",
  education: "bg-cyan-900/50 text-cyan-400",
  voyage: "bg-teal-900/50 text-teal-400",
  revenus: "bg-green-900/50 text-green-400",
  epargne: "bg-yellow-900/50 text-yellow-400",
  divers: "bg-zinc-800/50 text-zinc-400",
};

// retourne les classes tailwind pour le fond des initiales
export function getCouleurCategorie(categorie: string): string {
  return COULEURS_CATEGORIES[categorie] ?? "bg-zinc-800/50 text-zinc-400";
}
