import { create } from "zustand";
import type { Transaction, CategorieTransaction } from "@/types";
import { transactions as mockTransactions } from "@/data/mock-data";

// etat global de l'application
interface AxiomeState {
  transactions: Transaction[];
  filtreCategorie: CategorieTransaction | "toutes";
  setFiltreCategorie: (categorie: CategorieTransaction | "toutes") => void;
  transactionsFiltrees: () => Transaction[];
}

// store principal zustand
export const useAxiomeStore = create<AxiomeState>((set, get) => ({
  transactions: mockTransactions,
  filtreCategorie: "toutes",

  // met a jour le filtre de categorie actif
  setFiltreCategorie: (categorie) => set({ filtreCategorie: categorie }),

  // retourne les transactions filtrees par categorie
  transactionsFiltrees: () => {
    const { transactions, filtreCategorie } = get();
    if (filtreCategorie === "toutes") return transactions;
    return transactions.filter((t) => t.categorie === filtreCategorie);
  },
}));
