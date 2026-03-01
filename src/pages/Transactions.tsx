import { useAxiomeStore } from "@/store";
import type { CategorieTransaction } from "@/types";
import { DataTable } from "@/components/ui/DataTable";
import { colonnesTransactions } from "@/components/ui/colonnes-transactions";
import { cn } from "@/lib/utils";

// liste des categories pour le filtre
const CATEGORIES: Array<CategorieTransaction | "toutes"> = [
  "toutes",
  "alimentation",
  "transport",
  "logement",
  "loisirs",
  "sante",
  "restauration",
  "abonnements",
  "shopping",
  "education",
  "voyage",
  "revenus",
  "epargne",
  "divers",
];

// vue principale de la liste des transactions avec filtres et tri
function Transactions() {
  const transactions = useAxiomeStore((s) => s.transactions);
  const filtreCategorie = useAxiomeStore((s) => s.filtreCategorie);
  const setFiltreCategorie = useAxiomeStore((s) => s.setFiltreCategorie);

  return (
    <div className="space-y-8">
      {/* titre */}
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-white/90 lg:text-2xl">
          transactions
        </h1>
        <p className="mt-1 text-sm text-white/30">
          historique complet de vos operations
        </p>
      </div>

      {/* filtres par categorie */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setFiltreCategorie(cat)}
            className={cn(
              "rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200",
              filtreCategorie === cat
                ? "bg-white/10 text-white"
                : "text-white/30 hover:bg-white/[0.04] hover:text-white/60"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* table */}
      <DataTable
        colonnes={colonnesTransactions}
        donnees={transactions}
        filtreColonne="categorie"
        filtreValeur={filtreCategorie}
      />
    </div>
  );
}

export default Transactions;
