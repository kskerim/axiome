import { createClient } from "@supabase/supabase-js";

// ces valeurs viennent du fichier .env.local a la racine du projet
// VITE_SUPABASE_URL=https://xxxxx.supabase.co
// VITE_SUPABASE_ANON_KEY=eyJ...
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "les variables VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY ne sont pas definies dans .env.local"
  );
}

// client supabase unique pour toute l'application
export const supabase = createClient(supabaseUrl ?? "", supabaseAnonKey ?? "");
