import {
  ShoppingBag,
  Car,
  Home,
  Gamepad2,
  HeartPulse,
  UtensilsCrossed,
  CreditCard,
  GraduationCap,
  Plane,
  CircleDot,
  Fuel,
  Scissors,
  Coffee,
  PawPrint,
  Wrench,
  Gift,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formaterMontant } from "@/lib/calculs";
import type { BudgetCategorie } from "@/lib/calculs";
import { InfoBulle } from "@/components/ui/InfoBulle";

// icone par categorie
const ICONES: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  alimentation: ShoppingBag,
  transport: Car,
  automobile: Fuel,
  logement: Home,
  loisirs: Gamepad2,
  sante: HeartPulse,
  restauration: UtensilsCrossed,
  bar_cafe: Coffee,
  abonnements: CreditCard,
  shopping: ShoppingBag,
  beaute: Scissors,
  animaux: PawPrint,
  maison: Wrench,
  cadeaux: Gift,
  education: GraduationCap,
  voyage: Plane,
  divers: CircleDot,
};

// labels en francais
const LABELS: Record<string, string> = {
  alimentation: "Alimentation",
  transport: "Transport",
  automobile: "Automobile",
  logement: "Logement",
  loisirs: "Loisirs",
  sante: "Santé",
  restauration: "Restauration",
  bar_cafe: "Bar / Café",
  abonnements: "Abonnements",
  shopping: "Shopping",
  beaute: "Beauté",
  animaux: "Animaux",
  maison: "Maison",
  cadeaux: "Cadeaux",
  education: "Éducation",
  voyage: "Voyage",
  divers: "Divers",
};

// props du composant
interface JaugesCategoriesProps {
  budgets: BudgetCategorie[];
}

// couleur de la barre selon le pourcentage
function couleurJauge(pourcentage: number): string {
  if (pourcentage >= 100) return "bg-red-500";
  if (pourcentage >= 80) return "bg-amber-500";
  if (pourcentage >= 50) return "bg-yellow-500";
  return "bg-emerald-500";
}

// couleur du texte selon le pourcentage
function couleurTexte(pourcentage: number): string {
  if (pourcentage >= 100) return "text-red-400";
  if (pourcentage >= 80) return "text-amber-400";
  return "text-white/60";
}

// affiche les jauges de budget par categorie
export function JaugesCategories({ budgets }: JaugesCategoriesProps) {
  // ne montre que les categories avec de l'activite
  const budgetsActifs = budgets.filter((b) => b.depense > 0);

  if (budgetsActifs.length === 0) {
    return (
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 sm:p-6">
        <div className="flex items-center gap-2.5 mb-4">
          <BarChart3 size={20} className="text-white/40" />
          <h2 className="text-base font-medium tracking-widest text-white/40 uppercase">
            Budgets
          </h2>
          <InfoBulle texte="Suivi de vos dépenses par catégorie par rapport au budget mensuel que vous avez défini. La jauge change de couleur quand vous approchez ou dépassez la limite." />
        </div>
        <p className="text-sm text-white/30">Aucune dépense ce mois</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 sm:p-6">
      {/* titre */}
      <div className="flex items-center gap-2.5 mb-5 sm:mb-6">
        <BarChart3 size={20} className="text-white/40" />
        <h2 className="text-base font-medium tracking-widest text-white/40 uppercase">
          Budgets
        </h2>
        <InfoBulle texte="Suivi de vos dépenses par catégorie par rapport au budget mensuel que vous avez défini. La jauge change de couleur quand vous approchez ou dépassez la limite." />
      </div>

      {/* liste des jauges */}
      <div className="space-y-4">
        {budgetsActifs.map((b) => {
          const Icon = ICONES[b.categorie] ?? CircleDot;
          const label = LABELS[b.categorie] ?? b.categorie;
          const pct = Math.min(b.pourcentage, 100);

          return (
            <div key={b.categorie} className="space-y-2">
              {/* ligne du haut : icone + label + montants */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Icon
                    size={16}
                    className={cn(
                      b.depasse ? "text-red-400" : "text-white/40"
                    )}
                  />
                  <span className="text-sm font-medium text-white/70">
                    {label}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-sm tabular-nums">
                  <span className={couleurTexte(b.pourcentage)}>
                    {formaterMontant(b.depense)}
                  </span>
                  <span className="text-white/20">/</span>
                  <span className="text-white/30">
                    {formaterMontant(b.budget)}
                  </span>
                </div>
              </div>

              {/* barre de progression */}
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-500 ease-out",
                    couleurJauge(b.pourcentage)
                  )}
                  style={{ width: `${pct}%` }}
                />
              </div>

              {/* indicateur de depassement */}
              {b.depasse && (
                <p className="text-xs text-red-400/70">
                  Dépassement de {formaterMontant(Math.abs(b.restant))}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
