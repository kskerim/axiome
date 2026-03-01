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
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 transition-colors hover:bg-white/[0.04]">
      {/* label */}
      <p className="text-xs font-medium tracking-widest text-white/30 uppercase">
        {label}
      </p>

      {/* montant principal */}
      <p className="mt-3 text-2xl font-semibold tracking-tight text-white/90 lg:text-3xl">
        {formaterMontant(montant)}
      </p>

      {/* variation */}
      <div className="mt-3 flex items-center gap-1.5">
        {estNeutre ? (
          <Minus size={14} className="text-white/30" />
        ) : estPositif ? (
          <TrendingUp size={14} className="text-emerald-400" />
        ) : (
          <TrendingDown size={14} className="text-red-400" />
        )}
        <span
          className={cn(
            "text-xs font-medium",
            estNeutre
              ? "text-white/30"
              : estPositif
                ? "text-emerald-400"
                : "text-red-400"
          )}
        >
          {formaterVariation(variation)}
        </span>
        <span className="text-xs text-white/20">vs mois dernier</span>
      </div>
    </div>
  );
}
