import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useAxiomeStore } from "@/store";
import { analyserTransactions } from "@/engine/analyse";

// hook qui affiche des toasts pour les subscription creep detectees au chargement
export function useAlerteAbonnements() {
  const transactions = useAxiomeStore((s) => s.transactions);
  const dejaNotifie = useRef(false);

  useEffect(() => {
    // ne notifie qu'une seule fois au montage
    if (dejaNotifie.current) return;
    dejaNotifie.current = true;

    // petit delai pour que l'app soit chargee visuellement
    const timer = setTimeout(() => {
      const alertes = analyserTransactions(transactions);
      const creep = alertes.filter((a) => a.type === "subscription_creep");

      for (const alerte of creep) {
        toast.warning(
          `${alerte.marchand} a augmente de +${alerte.variation?.toFixed(0)}%`,
          {
            description: alerte.message,
            duration: 6000,
          }
        );
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [transactions]);
}
