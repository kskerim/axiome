import { Menu } from "lucide-react";
import { ModalAjoutTransaction } from "@/components/ui/ModalAjoutTransaction";

// props de la topbar
interface TopbarProps {
  onOuvrirMenu: () => void;
}

// barre superieure avec bouton menu mobile, bouton ajout et indicateur
export function Topbar({ onOuvrirMenu }: TopbarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-white/[0.06] bg-[#09090b]/80 px-6 backdrop-blur-xl">
      {/* bouton menu mobile */}
      <button
        onClick={onOuvrirMenu}
        className="rounded-md p-2 text-white/40 hover:text-white/80 lg:hidden"
      >
        <Menu size={20} strokeWidth={1.5} />
      </button>

      {/* spacer */}
      <div className="flex-1" />

      {/* bouton d'ajout de transaction */}
      <ModalAjoutTransaction />

      {/* indicateur de statut */}
      <div className="flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-emerald-500/80" />
        <span className="text-xs font-light tracking-wide text-white/30">
          live
        </span>
      </div>
    </header>
  );
}
