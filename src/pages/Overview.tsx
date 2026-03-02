import { useAxiomeStore } from "@/store";
import {
  calculerKpi,
  calculerEvolutionMensuelle,
  calculerResteAVivre,
  calculerBudgetsCategorie,
  calculerProjectionFinMois,
} from "@/lib/calculs";
import { KpiCard } from "@/components/ui/KpiCard";
import { SoldeChart } from "@/components/ui/SoldeChart";
import { DernieresTransactions } from "@/components/ui/DernieresTransactions";
import { ResteAVivre } from "@/components/ui/ResteAVivre";
import { JaugesCategories } from "@/components/ui/JaugesCategories";
import { ProjectionFinMois } from "@/components/ui/ProjectionFinMois";

// page principale avec kpi, graphique, budgets, projection et dernieres transactions
function Overview() {
  const transactions = useAxiomeStore((s) => s.transactions);
  const budgets = useAxiomeStore((s) => s.budgets);
  const kpi = calculerKpi(transactions);
  const evolution = calculerEvolutionMensuelle(transactions);
  const resteAVivre = calculerResteAVivre(transactions);
  const budgetsCategorie = calculerBudgetsCategorie(transactions, budgets);
  const projection = calculerProjectionFinMois(transactions);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* titre de page */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-white/90 lg:text-3xl">
          Tableau de bord
        </h1>
        <p className="mt-1 text-base text-white/35">
          Synthèse de vos finances personnelles
        </p>
      </div>

      {/* kpi cards */}
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
        <KpiCard
          label="solde"
          montant={kpi.solde}
          variation={kpi.variationSolde}
        />
        <KpiCard
          label="revenus"
          montant={kpi.revenus}
          variation={kpi.variationRevenus}
        />
        <KpiCard
          label="depenses"
          montant={kpi.depenses}
          variation={kpi.variationDepenses}
          inverse
        />
      </div>

      {/* graphique + reste a vivre + projection */}
      <div className="grid gap-6 lg:grid-cols-5 lg:gap-8">
        <div className="lg:col-span-3">
          <SoldeChart donnees={evolution} />
        </div>
        <div className="lg:col-span-2 space-y-6">
          <ResteAVivre donnees={resteAVivre} />
          <ProjectionFinMois projection={projection} />
        </div>
      </div>

      {/* jauges de budget + dernieres transactions */}
      <div className="grid gap-6 lg:grid-cols-5 lg:gap-8">
        <div className="lg:col-span-3">
          <JaugesCategories budgets={budgetsCategorie} />
        </div>
        <div className="lg:col-span-2">
          <DernieresTransactions transactions={transactions} />
        </div>
      </div>
    </div>
  );
}

export default Overview;
