import { Wallet, Home, CreditCard, PiggyBank } from "lucide-react";
import { cn } from "@/lib/utils";
import { formaterMontant } from "@/lib/calculs";
import type { ResteAVivreData } from "@/lib/calculs";

// icone par categorie de charge fixe
const ICONES_FIXES: Record<string, React.ReactNode> = {
  logement: <Home size={18} />,
  abonnements: <CreditCard size={18} />,
  epargne: <PiggyBank size={18} />,
};

// props du composant reste a vivre
interface ResteAVivreProps {
  donnees: ResteAVivreData;
}

// affiche le reste a vivre avec barre de progression et detail
export function ResteAVivre({ donnees }: ResteAVivreProps) {
  const { resteAVivre, pourcentageConsomme, budgetDisponible, detailFixes } =
    donnees;

  // couleur de la barre selon le pourcentage consomme
  const couleurBarre =
    pourcentageConsomme >= 90
      ? "bg-red-500"
      : pourcentageConsomme >= 70
        ? "bg-amber-500"
        : "bg-emerald-500";

  const couleurTexte =
    resteAVivre < 0
      ? "text-red-400"
      : resteAVivre < budgetDisponible * 0.15
        ? "text-amber-400"
        : "text-emerald-400";

  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 sm:p-6">
      {/* titre */}
      <div className="mb-5 flex items-center gap-2.5 sm:mb-6">
        <Wallet size={20} className="text-white/40" />
        <h2 className="text-base font-medium tracking-widest text-white/40 uppercase">
          reste a vivre
        </h2>
      </div>

      {/* montant principal */}
      <p className={cn("text-3xl font-semibold tracking-tight sm:text-4xl", couleurTexte)}>
        {formaterMontant(resteAVivre)}
      </p>
      <p className="mt-1.5 text-sm text-white/35">
        sur {formaterMontant(budgetDisponible)} disponible
      </p>

      {/* barre de progression */}
      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-white/45">consomme</span>
          <span className="font-medium text-white/65">
            {pourcentageConsomme}%
          </span>
        </div>

        <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/[0.06] sm:h-3">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-700 ease-out",
              couleurBarre
            )}
            style={{ width: `${Math.min(100, pourcentageConsomme)}%` }}
          />
        </div>
      </div>

      {/* detail des charges fixes */}
      {detailFixes.length > 0 && (
        <div className="mt-6 space-y-3">
          <p className="text-sm font-medium text-white/25 uppercase tracking-wider">
            charges fixes
          </p>
          {detailFixes.map((item) => (
            <div
              key={item.categorie}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <span className="text-white/35">
                  {ICONES_FIXES[item.categorie] ?? <CreditCard size={18} />}
                </span>
                <span className="text-base text-white/55">{item.categorie}</span>
              </div>
              <span className="text-base font-medium tabular-nums text-white/70">
                -{formaterMontant(item.montant)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
