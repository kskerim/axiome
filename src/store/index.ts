import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Transaction, CategorieTransaction } from "@/types";
import {
  chargerTransactions,
  insererTransaction,
  supprimerTransactionDb,
} from "@/lib/transactions-db";

// version du schema pour les migrations
const STORE_VERSION = 2;

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
  userId: string | null;
  chargementDb: boolean;
  setFiltreCategorie: (categorie: CategorieTransaction | "toutes") => void;
  transactionsFiltrees: () => Transaction[];
  ajouterTransaction: (transaction: Transaction) => void;
  supprimerTransaction: (id: string) => void;
  setBudget: (categorie: string, montant: number) => void;
  reinitialiser: () => void;
  // actions liees a supabase
  setUserId: (id: string | null) => void;
  chargerDepuisDb: () => Promise<void>;
}

// store principal zustand avec persistence localStorage
export const useAxiomeStore = create<AxiomeState>()(
  persist(
    (set, get) => ({
      transactions: [],
      budgets: BUDGETS_DEFAUT,
      filtreCategorie: "toutes",
      userId: null,
      chargementDb: false,

      // met a jour le filtre de categorie actif
      setFiltreCategorie: (categorie) => set({ filtreCategorie: categorie }),

      // retourne les transactions filtrees par categorie
      transactionsFiltrees: () => {
        const { transactions, filtreCategorie } = get();
        if (filtreCategorie === "toutes") return transactions;
        return transactions.filter((t) => t.categorie === filtreCategorie);
      },

      // ajoute une transaction (+ supabase si connecte)
      ajouterTransaction: (transaction) => {
        const { userId } = get();

        // mise a jour locale immediate
        set((state) => ({
          transactions: [transaction, ...state.transactions].sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          ),
        }));

        // si connecte, ecrit aussi en base
        if (userId) {
          insererTransaction(userId, transaction);
        }
      },

      // supprime une transaction (+ supabase si connecte)
      supprimerTransaction: (id) => {
        const { userId } = get();

        // suppression locale immediate
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        }));

        // si connecte, supprime aussi en base
        if (userId) {
          supprimerTransactionDb(id);
        }
      },

      // met a jour le budget d'une categorie
      setBudget: (categorie, montant) =>
        set((state) => ({
          budgets: { ...state.budgets, [categorie]: montant },
        })),

      // reinitialise toutes les donnees a zero
      reinitialiser: () =>
        set({
          transactions: [],
          budgets: BUDGETS_DEFAUT,
          filtreCategorie: "toutes",
        }),

      // definit l'id utilisateur pour activer la sync supabase
      setUserId: (id) => set({ userId: id }),

      // charge les transactions depuis supabase
      chargerDepuisDb: async () => {
        set({ chargementDb: true });
        const transactions = await chargerTransactions();
        set({ transactions, chargementDb: false });
      },
    }),
    {
      name: "axiome-store",
      version: STORE_VERSION,
      // persiste les transactions et les budgets (pas userId ni chargementDb)
      partialize: (state) => ({
        transactions: state.transactions,
        budgets: state.budgets,
      }),
      // migration entre versions du schema
      migrate: (persisted, version) => {
        const state = persisted as Record<string, unknown>;
        // v1 -> v2 : ajout des budgets par categorie
        if (version < 2) {
          state.budgets = BUDGETS_DEFAUT;
        }
        return state as { transactions: Transaction[]; budgets: Record<string, number> };
      },
      // deserialization des dates depuis json avec protection try/catch
      storage: {
        getItem: (name) => {
          try {
            const str = localStorage.getItem(name);
            if (!str) return null;
            const parsed = JSON.parse(str) as {
              state: {
                transactions: (Transaction & { date: string | Date })[];
                budgets?: Record<string, number>;
              };
              version?: number;
            };
            // reconvertit les dates string en objets Date
            if (parsed.state?.transactions) {
              parsed.state.transactions = parsed.state.transactions.map((t) => ({
                ...t,
                date: new Date(t.date),
              }));
            }
            return parsed as unknown as {
              state: { transactions: Transaction[]; budgets: Record<string, number> };
              version?: number;
            };
          } catch {
            // donnees corrompues : on supprime et on repart de zero
            localStorage.removeItem(name);
            return null;
          }
        },
        setItem: (name, value) => {
          try {
            localStorage.setItem(name, JSON.stringify(value));
          } catch {
            // quota depasse : on ne fait rien
          }
        },
        removeItem: (name) => {
          localStorage.removeItem(name);
        },
      },
    }
  )
);

// retourne la taille approximative du store en localStorage (en ko)
export function getTailleStockage(): number {
  try {
    const str = localStorage.getItem("axiome-store");
    if (!str) return 0;
    return Math.round((str.length * 2) / 1024);
  } catch {
    return 0;
  }
}
