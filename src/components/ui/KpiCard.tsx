import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { formaterMontant, formaterVariation } from "@/lib/calculs";

// props d'une carte kpi
interface KpiCardProps {
  label: string;
  montant: number;
  variation: number;
  inverse?: boolean;
}

// carte kpi individuelle avec montant et variation
export function KpiCard({ label, montant, variation, inverse = false }: KpiCardProps) {
  // pour les depenses, une hausse est negative
  const estPositif = inverse ? variation <= 0 : variation >= 0;
  const estNeutre = Math.abs(variation) < 0.5;

  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 transition-colors hover:bg-white/[0.04] sm:p-6 lg:p-7">
      {/* label */}
      <p className="text-xs font-medium tracking-widest text-white/40 uppercase sm:text-sm">
        {label}
      </p>

      {/* montant principal */}
      <p className="mt-3 text-2xl font-semibold tracking-tight text-white/90 sm:text-3xl lg:text-4xl">
        {formaterMontant(montant)}
      </p>

      {/* variation */}
      <div className="mt-3 flex items-center gap-2">
        {estNeutre ? (
          <Minus size={16} className="text-white/30" />
        ) : estPositif ? (
          <TrendingUp size={16} className="text-emerald-400" />
        ) : (
          <TrendingDown size={16} className="text-red-400" />
        )}
        <span
          className={cn(
            "text-sm font-medium",
            estNeutre
              ? "text-white/30"
              : estPositif
                ? "text-emerald-400"
                : "text-red-400"
          )}
        >
          {formaterVariation(variation)}
        </span>
        <span className="text-sm text-white/25">vs mois dernier</span>
      </div>
    </div>
  );
}
