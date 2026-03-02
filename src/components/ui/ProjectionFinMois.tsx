import { TrendingDown, TrendingUp, CalendarClock, Repeat, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { formaterMontant } from "@/lib/calculs";
import type { ProjectionFinMois as ProjectionData } from "@/lib/calculs";

// props du composant
interface ProjectionFinMoisProps {
  projection: ProjectionData;
}

// affiche la projection du solde en fin de mois
export function ProjectionFinMois({ projection }: ProjectionFinMoisProps) {
  const {
    soldeActuel,
    depensesRecurrentesAVenir,
    soldeProjecte,
    joursRestants,
    depensesMoyennesJour,
    depensesEstimeesRestantes,
  } = projection;

  const tendancePositive = soldeProjecte >= 0;
  const TrendIcon = tendancePositive ? TrendingUp : TrendingDown;

  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 sm:p-6">
      {/* titre */}
      <div className="flex items-center gap-2.5 mb-5 sm:mb-6">
        <CalendarClock size={20} className="text-white/40" />
        <h2 className="text-base font-medium tracking-widest text-white/40 uppercase">
          Projection fin de mois
        </h2>
      </div>

      {/* solde projete */}
      <div className="flex items-end gap-3 mb-6">
        <p
          className={cn(
            "text-3xl font-semibold tracking-tight sm:text-4xl",
            tendancePositive ? "text-emerald-400" : "text-red-400"
          )}
        >
          {formaterMontant(soldeProjecte)}
        </p>
        <TrendIcon
          size={24}
          className={cn(
            "mb-1",
            tendancePositive ? "text-emerald-400/50" : "text-red-400/50"
          )}
        />
      </div>

      {/* detail des calculs */}
      <div className="space-y-3">
        {/* solde actuel */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-white/40">Solde actuel</span>
          <span className="font-medium tabular-nums text-white/70">
            {formaterMontant(soldeActuel)}
          </span>
        </div>

        {/* recurrentes a venir */}
        {depensesRecurrentesAVenir > 0 && (
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Repeat size={14} className="text-indigo-400/60" />
              <span className="text-white/40">Recurrentes a venir</span>
            </div>
            <span className="font-medium tabular-nums text-red-400/70">
              -{formaterMontant(depensesRecurrentesAVenir)}
            </span>
          </div>
        )}

        {/* depenses variables estimees */}
        {depensesEstimeesRestantes > 0 && (
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <ShoppingCart size={14} className="text-amber-400/60" />
              <span className="text-white/40">Variables estimees</span>
            </div>
            <span className="font-medium tabular-nums text-amber-400/70">
              -{formaterMontant(depensesEstimeesRestantes)}
            </span>
          </div>
        )}

        {/* ligne de separation */}
        <div className="border-t border-white/[0.06] pt-3">
          <div className="flex items-center justify-between text-xs text-white/30">
            <span>{joursRestants} jours restants</span>
            <span>~{formaterMontant(depensesMoyennesJour)} / jour</span>
          </div>
        </div>
      </div>
    </div>
  );
}
