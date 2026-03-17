import { useAxiomeStore } from "@/store";
import { DataTable } from "@/components/ui/DataTable";
import { colonnesTransactions } from "@/components/ui/colonnes-transactions";
import { cn } from "@/lib/utils";
import { InfoBulle } from "@/components/ui/InfoBulle";
import { CATEGORIES_FILTRE, labelCategorie } from "@/lib/categories";

// vue principale de la liste des transactions avec filtres et tri
function Transactions() {
  const transactions = useAxiomeStore((s) => s.transactions);
  const filtreCategorie = useAxiomeStore((s) => s.filtreCategorie);
  const setFiltreCategorie = useAxiomeStore((s) => s.setFiltreCategorie);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* titre */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold tracking-tight text-white/90 lg:text-3xl">
            Transactions
          </h1>
          <InfoBulle texte="Liste de toutes vos transactions. Utilisez les filtres par categorie pour affiner la vue. Cliquez sur les colonnes pour trier." />
        </div>
        <p className="mt-1 text-base text-white/35">
          Historique complet de vos operations
        </p>
      </div>

      {/* filtres par categorie */}
      <div className="flex flex-wrap gap-1 sm:gap-1.5">
        {CATEGORIES_FILTRE.map((cat) => (
          <button
            key={cat}
            onClick={() => setFiltreCategorie(cat)}
            className={cn(
              "rounded-full px-2 py-1 text-[11px] font-medium transition-colors sm:px-3.5 sm:py-1.5 sm:text-sm",
              filtreCategorie === cat
                ? "bg-violet-600/20 text-violet-300 ring-1 ring-violet-500/30"
                : "bg-white/[0.03] text-white/40 hover:bg-white/[0.06] hover:text-white/60"
            )}
          >
            {cat === "toutes" ? "Toutes" : labelCategorie(cat)}
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
