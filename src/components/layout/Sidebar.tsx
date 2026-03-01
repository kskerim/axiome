import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Brain,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

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
        <div className="border-t border-white/[0.06] px-6 py-4">
          <p className="text-[10px] font-light tracking-widest text-white/20 uppercase">
            v1.0.0
          </p>
        </div>
      </aside>
    </>
  );
}
