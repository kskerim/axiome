import { supabase } from "@/lib/supabase";
import type { Transaction } from "@/types";
import type { CategorieTransaction } from "@/types";

// type d'une ligne supabase
interface TransactionRow {
  id: string;
  user_id: string;
  date: string;
  marchand: string;
  montant: number;
  categorie: string;
  recurrente: boolean;
  created_at: string;
}

// convertit une ligne supabase en objet Transaction front
function versTransaction(row: TransactionRow): Transaction {
  return {
    id: row.id,
    date: new Date(row.date),
    montant: row.montant,
    categorie: row.categorie as CategorieTransaction,
    marchand: row.marchand,
    isRecurring: row.recurrente,
  };
}

// charge toutes les transactions de l'utilisateur connecte
export async function chargerTransactions(): Promise<Transaction[]> {
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .order("date", { ascending: false });

  if (error) {
    console.error("erreur chargement transactions:", error.message);
    return [];
  }

  return (data as TransactionRow[]).map(versTransaction);
}

// insere une transaction en base
export async function insererTransaction(
  userId: string,
  transaction: Transaction
): Promise<boolean> {
  const { error } = await supabase.from("transactions").insert({
    id: transaction.id,
    user_id: userId,
    date: transaction.date.toISOString().split("T")[0],
    marchand: transaction.marchand,
    montant: transaction.montant,
    categorie: transaction.categorie,
    recurrente: transaction.isRecurring,
  });

  if (error) {
    console.error("erreur insertion transaction:", error.message);
    return false;
  }
  return true;
}

// supprime une transaction en base
export async function supprimerTransactionDb(id: string): Promise<boolean> {
  const { error } = await supabase
    .from("transactions")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("erreur suppression transaction:", error.message);
    return false;
  }
  return true;
}

// supprime toutes les transactions d'un utilisateur en base
export async function supprimerToutesTransactions(userId: string): Promise<boolean> {
  const { error } = await supabase
    .from("transactions")
    .delete()
    .eq("user_id", userId);

  if (error) {
    console.error("erreur suppression toutes transactions:", error.message);
    return false;
  }
  return true;
}
