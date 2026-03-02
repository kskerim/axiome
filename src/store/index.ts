import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Transaction, CategorieTransaction } from "@/types";
import { transactions as mockTransactions } from "@/data/mock-data";

// budgets par defaut pour chaque categorie de depense
const BUDGETS_DEFAUT: Record<string, number> = {
  alimentation: 400,
  transport: 150,
  automobile: 200,
  logement: 900,
  loisirs: 150,
  sante: 100,
  restauration: 200,
  bar_cafe: 80,
  abonnements: 100,
  shopping: 200,
  beaute: 80,
  animaux: 60,
  maison: 100,
  cadeaux: 50,
  education: 80,
  voyage: 300,
  divers: 100,
};

// etat global de l'application
interface AxiomeState {
  transactions: Transaction[];
  budgets: Record<string, number>;
  filtreCategorie: CategorieTransaction | "toutes";
  setFiltreCategorie: (categorie: CategorieTransaction | "toutes") => void;
  transactionsFiltrees: () => Transaction[];
  ajouterTransaction: (transaction: Transaction) => void;
  supprimerTransaction: (id: string) => void;
  setBudget: (categorie: string, montant: number) => void;
  reinitialiser: () => void;
}

// store principal zustand avec persistence localStorage
export const useAxiomeStore = create<AxiomeState>()(
  persist(
    (set, get) => ({
      transactions: mockTransactions,
      budgets: BUDGETS_DEFAUT,
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

      // met a jour le budget d'une categorie
      setBudget: (categorie, montant) =>
        set((state) => ({
          budgets: { ...state.budgets, [categorie]: montant },
        })),

      // reinitialise avec les donnees mock
      reinitialiser: () =>
        set({ transactions: mockTransactions, budgets: BUDGETS_DEFAUT, filtreCategorie: "toutes" }),
    }),
    {
      name: "axiome-store",
      // persiste les transactions et les budgets
      partialize: (state) => ({ transactions: state.transactions, budgets: state.budgets }),
      // deserialization des dates depuis json
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          const parsed = JSON.parse(str) as {
            state: { transactions: (Transaction & { date: string | Date })[] };
            version?: number;
          };
          // reconvertit les dates string en objets Date
          if (parsed.state?.transactions) {
            parsed.state.transactions = parsed.state.transactions.map((t) => ({
              ...t,
              date: new Date(t.date),
            }));
          }
          return parsed as unknown as { state: { transactions: Transaction[] }; version?: number };
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          localStorage.removeItem(name);
        },
      },
    }
  )
);
