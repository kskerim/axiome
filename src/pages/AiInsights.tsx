import { useMemo } from "react";
import { useAxiomeStore } from "@/store";
import { analyserTransactions } from "@/engine/analyse";
import type { Alerte } from "@/types";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  TrendingUp,
  Repeat,
  Zap,
  Brain,
  ShieldAlert,
  Info,
} from "lucide-react";

// icone selon le type d'alerte
function IconeAlerte({ type }: { type: Alerte["type"] }) {
  switch (type) {
    case "subscription_creep":
      return <Repeat size={16} className="text-indigo-400" />;
    case "depassement_moyenne":
      return <AlertTriangle size={16} className="text-amber-400" />;
    case "anomalie_montant":
      return <Zap size={16} className="text-orange-400" />;
    case "tendance_hausse":
      return <TrendingUp size={16} className="text-red-400" />;
  }
}

// badge de severite
function BadgeSeverite({ severite }: { severite: Alerte["severite"] }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold uppercase tracking-wider",
        severite === "critique" && "bg-red-500/15 text-red-400",
        severite === "attention" && "bg-amber-500/15 text-amber-400",
        severite === "info" && "bg-blue-500/10 text-blue-400"
      )}
    >
      {severite === "critique" && <ShieldAlert size={12} />}
      {severite === "info" && <Info size={12} />}
      {severite}
    </span>
  );
}

// label lisible pour le type d'alerte
function labelType(type: Alerte["type"]): string {
  switch (type) {
    case "subscription_creep":
      return "subscription creep";
    case "depassement_moyenne":
      return "depassement moyenne";
    case "anomalie_montant":
      return "anomalie montant";
    case "tendance_hausse":
      return "tendance hausse";
  }
}

// carte d'alerte individuelle
function CarteAlerte({ alerte }: { alerte: Alerte }) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-white/[0.02] p-4 transition-colors hover:bg-white/[0.04] sm:p-6",
        alerte.severite === "critique"
          ? "border-red-500/20"
          : alerte.severite === "attention"
            ? "border-amber-500/10"
            : "border-white/[0.06]"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/[0.04] sm:h-11 sm:w-11">
            <IconeAlerte type={alerte.type} />
          </div>
          <div>
            <p className="text-sm font-medium tracking-wide text-white/45">
              {labelType(alerte.type)}
            </p>
            {alerte.marchand && (
              <p className="text-base font-medium text-white/75">
                {alerte.marchand}
              </p>
            )}
          </div>
        </div>
        <BadgeSeverite severite={alerte.severite} />
      </div>

      <p className="mt-4 text-base leading-relaxed text-white/60">
        {alerte.message}
      </p>

      {alerte.variation !== undefined && (
        <div className="mt-3 flex items-center gap-2">
          <div className="h-1.5 flex-1 rounded-full bg-white/[0.04] overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all",
                alerte.severite === "critique"
                  ? "bg-red-500/60"
                  : alerte.severite === "attention"
                    ? "bg-amber-500/50"
                    : "bg-blue-500/40"
              )}
              style={{
                width: `${Math.min(Math.abs(alerte.variation), 100)}%`,
              }}
            />
          </div>
          <span className="text-sm font-medium tabular-nums text-white/35">
            {alerte.variation > 0 ? "+" : ""}
            {alerte.variation.toFixed(1)}%
          </span>
        </div>
      )}
    </div>
  );
}

// vue principale des insights generes par le moteur d'analyse
function AiInsights() {
  const transactions = useAxiomeStore((s) => s.transactions);
  const alertes = useMemo(
    () => analyserTransactions(transactions),
    [transactions]
  );

  const critiques = alertes.filter((a) => a.severite === "critique");
  const attentions = alertes.filter((a) => a.severite === "attention");
  const infos = alertes.filter((a) => a.severite === "info");

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* titre */}
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.04] sm:h-12 sm:w-12">
          <Brain size={22} className="text-violet-400" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white/90 lg:text-3xl">
            ai insights
          </h1>
          <p className="text-base text-white/35">
            {alertes.length} alerte{alertes.length > 1 ? "s" : ""} detectee
            {alertes.length > 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* compteurs par severite */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-red-500/10 bg-red-500/[0.03] p-5 text-center sm:p-6">
          <p className="text-3xl font-semibold text-red-400">
            {critiques.length}
          </p>
          <p className="mt-1 text-xs font-medium tracking-widest text-red-400/60 uppercase">
            critiques
          </p>
        </div>
        <div className="rounded-xl border border-amber-500/10 bg-amber-500/[0.03] p-5 text-center sm:p-6">
          <p className="text-3xl font-semibold text-amber-400">
            {attentions.length}
          </p>
          <p className="mt-1 text-xs font-medium tracking-widest text-amber-400/60 uppercase">
            attention
          </p>
        </div>
        <div className="rounded-xl border border-blue-500/10 bg-blue-500/[0.03] p-5 text-center sm:p-6">
          <p className="text-3xl font-semibold text-blue-400">{infos.length}</p>
          <p className="mt-1 text-xs font-medium tracking-widest text-blue-400/60 uppercase">
            info
          </p>
        </div>
      </div>

      {/* liste des alertes */}
      <div className="space-y-4">
        {alertes.map((alerte) => (
          <CarteAlerte key={alerte.id} alerte={alerte} />
        ))}
      </div>

      {alertes.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-white/25">
          <Brain size={48} strokeWidth={1} />
          <p className="mt-4 text-base">aucune anomalie detectee</p>
        </div>
      )}
    </div>
  );
}

export default AiInsights;
