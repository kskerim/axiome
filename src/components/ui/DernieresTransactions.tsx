import type { Transaction } from "@/types";
import { MerchantAvatar } from "./MerchantAvatar";
import { formaterMontant } from "@/lib/calculs";
import { cn } from "@/lib/utils";

// props du composant dernieres transactions
interface DernieresTransactionsProps {
  transactions: Transaction[];
  limite?: number;
}

// affiche les dernieres transactions sous forme de liste compacte
export function DernieresTransactions({
  transactions,
  limite = 8,
}: DernieresTransactionsProps) {
  const recentes = transactions.slice(0, limite);

  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 sm:p-6">
      <h2 className="mb-5 text-base font-medium tracking-widest text-white/40 uppercase sm:mb-6">
        Derni\u00e8res transactions
      </h2>

      <div className="space-y-1">
        {recentes.map((tx) => (
          <div
            key={tx.id}
            className="flex items-center gap-3 rounded-lg px-2 py-3 transition-colors hover:bg-white/[0.03] sm:gap-4"
          >
            <MerchantAvatar
              marchand={tx.marchand}
              categorie={tx.categorie}
              taille={40}
            />

            <div className="flex-1 min-w-0">
              <p className="truncate text-base font-medium text-white/80">
                {tx.marchand}
              </p>
              <p className="text-sm text-white/35">
                {new Date(tx.date).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "short",
                })}
                {" · "}
                {tx.categorie}
              </p>
            </div>

            <p
              className={cn(
                "text-base font-medium tabular-nums",
                tx.montant >= 0 ? "text-emerald-400" : "text-white/70"
              )}
            >
              {tx.montant >= 0 ? "+" : ""}
              {formaterMontant(tx.montant)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
