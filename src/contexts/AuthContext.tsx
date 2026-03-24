import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

// types du contexte d'authentification
interface AuthContextType {
  utilisateur: User | null;
  session: Session | null;
  modeSimulation: boolean;
  chargement: boolean;
  inscription: (email: string, motDePasse: string) => Promise<{ erreur: string | null }>;
  connexion: (email: string, motDePasse: string) => Promise<{ erreur: string | null }>;
  deconnexion: () => Promise<void>;
  activerSimulation: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// hook pour acceder au contexte d'authentification
export function useAuth(): AuthContextType {
  const contexte = useContext(AuthContext);
  if (!contexte) {
    throw new Error("useAuth doit etre utilise dans un AuthProvider");
  }
  return contexte;
}

// provider qui gere l'etat d'authentification
export function AuthProvider({ children }: { children: ReactNode }) {
  const [utilisateur, setUtilisateur] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [modeSimulation, setModeSimulation] = useState(false);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    // si supabase n'est pas configure, on passe directement a l'accueil
    if (!supabase) {
      setChargement(false);
      return;
    }

    // verifie s'il y a une session existante
    supabase.auth
      .getSession()
      .then(({ data: { session: s } }) => {
        setSession(s);
        setUtilisateur(s?.user ?? null);
      })
      .catch(() => {
        // echec de connexion a supabase, on continue sans session
      })
      .finally(() => {
        setChargement(false);
      });

    // ecoute les changements d'authentification
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setUtilisateur(s?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // inscription avec email et mot de passe
  const inscription = async (email: string, motDePasse: string) => {
    if (!supabase) return { erreur: "supabase non configure" };
    const { error } = await supabase.auth.signUp({ email, password: motDePasse });
    if (error) return { erreur: error.message };
    return { erreur: null };
  };

  // connexion avec email et mot de passe
  const connexion = async (email: string, motDePasse: string) => {
    if (!supabase) return { erreur: "supabase non configure" };
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: motDePasse,
    });
    if (error) return { erreur: error.message };
    return { erreur: null };
  };

  // deconnexion
  const deconnexion = async () => {
    setModeSimulation(false);
    if (supabase) await supabase.auth.signOut();
  };

  // active le mode simulation (sans compte)
  const activerSimulation = () => {
    // nettoie le localstorage pour demarrer vide
    localStorage.removeItem("axiome-store");
    setModeSimulation(true);
  };

  // nettoie la session simulation quand l'utilisateur quitte la page
  useEffect(() => {
    if (!modeSimulation) return;

    const nettoyerSession = () => {
      localStorage.removeItem("axiome-store");
    };

    window.addEventListener("beforeunload", nettoyerSession);
    return () => window.removeEventListener("beforeunload", nettoyerSession);
  }, [modeSimulation]);

  return (
    <AuthContext.Provider
      value={{
        utilisateur,
        session,
        modeSimulation,
        chargement,
        inscription,
        connexion,
        deconnexion,
        activerSimulation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
