import type { ColumnDef } from "@tanstack/react-table";
import type { Transaction } from "@/types";
import { MerchantAvatar } from "@/components/ui/MerchantAvatar";
import { formaterMontant } from "@/lib/calculs";
import { labelCategorie } from "@/lib/categories";
import { cn } from "@/lib/utils";
import { Repeat, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useAxiomeStore } from "@/store";

// definition des colonnes pour la table des transactions
export const colonnesTransactions: ColumnDef<Transaction, unknown>[] = [
  {
    accessorKey: "marchand",
    header: "Marchand",
    cell: ({ row }) => {
      const tx = row.original;
      return (
        <div className="flex items-center gap-3">
          <MerchantAvatar
            marchand={tx.marchand}
            categorie={tx.categorie}
            taille={38}
          />
          <div>
            <p className="text-base font-medium text-white/80">{tx.marchand}</p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const date = new Date(row.original.date);
      return (
        <span className="text-base text-white/55">
          {date.toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "short",
            year: "2-digit",
          })}
        </span>
      );
    },
    sortingFn: (a, b) =>
      new Date(a.original.date).getTime() - new Date(b.original.date).getTime(),
  },
  {
    accessorKey: "categorie",
    header: "Categorie",
    cell: ({ row }) => (
      <span className="rounded-md bg-white/[0.05] px-2.5 py-1 text-sm font-medium text-white/55">
        {labelCategorie(row.original.categorie)}
      </span>
    ),
    filterFn: (row, _columnId, filterValue: string) => {
      if (filterValue === "toutes") return true;
      return row.original.categorie === filterValue;
    },
  },
  {
    accessorKey: "montant",
    header: "Montant",
    cell: ({ row }) => {
      const montant = row.original.montant;
      return (
        <span
          className={cn(
            "text-base font-medium tabular-nums",
            montant >= 0 ? "text-emerald-400" : "text-white/70"
          )}
        >
          {montant >= 0 ? "+" : ""}
          {formaterMontant(montant)}
        </span>
      );
    },
  },
  {
    accessorKey: "isRecurring",
    header: "Type",
    cell: ({ row }) =>
      row.original.isRecurring ? (
        <div className="flex items-center gap-1.5 text-indigo-400/70">
          <Repeat size={15} />
          <span className="text-sm">Recurrent</span>
        </div>
      ) : (
        <span className="text-sm text-white/30">Ponctuel</span>
      ),
    enableSorting: false,
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => <BoutonSuppression transaction={row.original} />,
    enableSorting: false,
  },
];

// bouton de suppression avec toast de confirmation
function BoutonSuppression({ transaction }: { transaction: Transaction }) {
  const supprimer = useAxiomeStore((s) => s.supprimerTransaction);

  const handleClick = () => {
    supprimer(transaction.id);
    toast.success(`Transaction "${transaction.marchand}" supprimée`);
  };

  return (
    <button
      onClick={handleClick}
      className="rounded-md p-2 text-white/20 transition-colors hover:bg-red-500/10 hover:text-red-400"
      title="supprimer"
    >
      <Trash2 size={16} />
    </button>
  );
}
