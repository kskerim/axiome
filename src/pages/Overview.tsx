import { useAxiomeStore } from "@/store";
import { calculerKpi, calculerEvolutionMensuelle, calculerResteAVivre } from "@/lib/calculs";
import { KpiCard } from "@/components/ui/KpiCard";
import { SoldeChart } from "@/components/ui/SoldeChart";
import { DernieresTransactions } from "@/components/ui/DernieresTransactions";
import { ResteAVivre } from "@/components/ui/ResteAVivre";

// page principale avec kpi, graphique, reste a vivre et dernieres transactions
function Overview() {
  const transactions = useAxiomeStore((s) => s.transactions);
  const kpi = calculerKpi(transactions);
  const evolution = calculerEvolutionMensuelle(transactions);
  const resteAVivre = calculerResteAVivre(transactions);

  return (
    <div className="space-y-8">
      {/* titre de page */}
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-white/90 lg:text-2xl">
          overview
        </h1>
        <p className="mt-1 text-sm text-white/30">
          synthese de vos finances personnelles
        </p>
      </div>

      {/* kpi cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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

      {/* graphique + reste a vivre + dernieres transactions */}
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <SoldeChart donnees={evolution} />
        </div>
        <div className="lg:col-span-2 space-y-6">
          <ResteAVivre donnees={resteAVivre} />
          <DernieresTransactions transactions={transactions} />
        </div>
      </div>
    </div>
  );
}

export default Overview;
