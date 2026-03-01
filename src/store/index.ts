import { create } from "zustand";
import type { Transaction, CategorieTransaction } from "@/types";
import { transactions as mockTransactions } from "@/data/mock-data";

// etat global de l'application
interface AxiomeState {
  transactions: Transaction[];
  filtreCategorie: CategorieTransaction | "toutes";
  setFiltreCategorie: (categorie: CategorieTransaction | "toutes") => void;
  transactionsFiltrees: () => Transaction[];
  ajouterTransaction: (transaction: Transaction) => void;
  supprimerTransaction: (id: string) => void;
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

  // ajoute une transaction et retrie par date decroissante
  ajouterTransaction: (transaction) =>
    set((state) => ({
      transactions: [transaction, ...state.transactions].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      ),
    })),

  // supprime une transaction par son id
  supprimerTransaction: (id) =>
    set((state) => ({
      transactions: state.transactions.filter((t) => t.id !== id),
    })),
}));
