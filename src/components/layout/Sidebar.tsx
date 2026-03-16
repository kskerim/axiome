import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Brain,
  X,
  RotateCcw,
  HardDrive,
  LogOut,
  Zap,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAxiomeStore, getTailleStockage } from "@/store";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

// liens de navigation principaux
const LIENS_NAV = [
  { to: "/", label: "Tableau de bord", icon: LayoutDashboard },
  { to: "/transactions", label: "Transactions", icon: ArrowLeftRight },
  { to: "/insights", label: "Analyses IA", icon: Brain },
] as const;

// props de la sidebar
interface SidebarProps {
  ouvert: boolean;
  onFermer: () => void;
}

// sidebar de navigation principale
export function Sidebar({ ouvert, onFermer }: SidebarProps) {
  const reinitialiser = useAxiomeStore((s) => s.reinitialiser);
  const tailleKo = getTailleStockage();
  const { utilisateur, modeSimulation, deconnexion } = useAuth();
  const [confirmReset, setConfirmReset] = useState(false);

  // reinitialise les donnees apres confirmation
  const handleReset = () => {
    if (!confirmReset) {
      setConfirmReset(true);
      return;
    }
    reinitialiser();
    setConfirmReset(false);
    toast.success("Toutes les donnees ont ete remises a zero");
  };

  const annulerReset = () => setConfirmReset(false);

  // deconnexion ou sortie du mode simulation
  const handleDeconnexion = async () => {
    await deconnexion();
  };

  return (
    <>
      {/* overlay mobile */}
      {ouvert && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onFermer}
        />
      )}

      {/* sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 flex h-full w-64 flex-col border-r border-white/[0.06] bg-[#09090b] transition-transform duration-300 lg:static lg:translate-x-0",
          ouvert ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* logo / titre */}
        <div className="flex h-16 items-center justify-between px-6">
          <h1 className="text-xl font-semibold tracking-[0.25em] text-white/90 uppercase">
            axiome
          </h1>
          <button
            onClick={onFermer}
            className="rounded-md p-1 text-white/40 hover:text-white/80 lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        {/* indicateur mode simulation */}
        {modeSimulation && (
          <div className="mx-4 mb-2 flex items-center gap-2 rounded-lg bg-amber-500/10 px-3 py-2">
            <Zap size={14} className="text-amber-400" />
            <span className="text-xs font-medium text-amber-400/80">Mode simulation</span>
          </div>
        )}

        {/* separateur subtil */}
        <div className="mx-4 h-px bg-white/[0.06]" />

        {/* liens de navigation */}
        <nav className="flex-1 space-y-1 px-3 pt-6">
          {LIENS_NAV.map((lien) => (
            <NavLink
              key={lien.to}
              to={lien.to}
              onClick={onFermer}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-3 text-[15px] font-medium transition-all duration-200",
                  isActive
                    ? "bg-white/[0.06] text-white"
                    : "text-white/40 hover:bg-white/[0.03] hover:text-white/70"
                )
              }
            >
              <lien.icon size={20} strokeWidth={1.5} />
              <span className="tracking-wide">{lien.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* footer sidebar */}
        <div className="border-t border-white/[0.06] px-4 py-4 space-y-3">
          {/* bouton reinitialiser — bien visible */}
          {!confirmReset ? (
            <button
              onClick={handleReset}
              className="flex w-full items-center gap-2.5 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2.5 text-sm font-medium text-white/50 transition-all hover:border-red-500/20 hover:bg-red-500/[0.05] hover:text-red-400"
            >
              <RotateCcw size={15} />
              <span>Reinitialiser les donnees</span>
            </button>
          ) : (
            <div className="space-y-2 rounded-lg border border-red-500/20 bg-red-500/[0.05] p-3">
              <div className="flex items-center gap-2 text-red-400">
                <AlertTriangle size={14} />
                <span className="text-xs font-medium">Confirmer la reinitialisation ?</span>
              </div>
              <p className="text-[11px] text-white/40">
                Toutes vos transactions et budgets seront supprimes.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleReset}
                  className="flex-1 rounded-md bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-red-500"
                >
                  Confirmer
                </button>
                <button
                  onClick={annulerReset}
                  className="flex-1 rounded-md border border-white/10 px-3 py-1.5 text-xs font-medium text-white/50 transition-colors hover:bg-white/[0.05]"
                >
                  Annuler
                </button>
              </div>
            </div>
          )}

          {/* bouton deconnexion */}
          <button
            onClick={handleDeconnexion}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-white/40 transition-colors hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut size={15} />
            <span>{modeSimulation ? "Quitter la simulation" : "Se deconnecter"}</span>
          </button>

          {/* email utilisateur ou simulation */}
          {utilisateur && (
            <p className="truncate px-2 text-[10px] text-white/20">
              {utilisateur.email}
            </p>
          )}

          {/* indicateur stockage */}
          <div className="flex items-center gap-2 px-2">
            <HardDrive size={12} className="text-white/15" />
            <span className="text-[10px] text-white/15">
              {tailleKo} ko en local
            </span>
          </div>

          <p className="px-2 text-[10px] font-light tracking-widest text-white/20 uppercase">
            v2.0.0
          </p>
        </div>
      </aside>
    </>
  );
}
