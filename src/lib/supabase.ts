import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// ces valeurs viennent du fichier .env.local a la racine du projet
// VITE_SUPABASE_URL=https://xxxxx.supabase.co
// VITE_SUPABASE_ANON_KEY=eyJ...
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

// client supabase unique pour toute l'application
// si les variables ne sont pas definies, le client reste null (mode simulation uniquement)
export const supabase: SupabaseClient = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : (null as unknown as SupabaseClient);
