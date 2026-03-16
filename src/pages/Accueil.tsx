import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { Eye, EyeOff, BarChart3, Shield, Brain, Zap } from "lucide-react";

// page d'accueil avec inscription, connexion et mode simulation
export function Accueil() {
  const { inscription, connexion, activerSimulation } = useAuth();
  const [mode, setMode] = useState<"connexion" | "inscription">("connexion");
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [erreur, setErreur] = useState<string | null>(null);
  const [chargement, setChargement] = useState(false);
  const [motDePasseVisible, setMotDePasseVisible] = useState(false);
  const [messageSucces, setMessageSucces] = useState<string | null>(null);

  // soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErreur(null);
    setMessageSucces(null);
    setChargement(true);

    const resultat =
      mode === "inscription"
        ? await inscription(email, motDePasse)
        : await connexion(email, motDePasse);

    if (resultat.erreur) {
      setErreur(traduireErreur(resultat.erreur));
    } else if (mode === "inscription") {
      setMessageSucces(
        "Compte créé avec succès. Vérifiez votre boîte mail pour confirmer votre adresse."
      );
    }

    setChargement(false);
  };

  return (
    <div className="flex min-h-screen bg-[#09090b]">
      {/* colonne gauche : presentation */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-16 xl:px-24">
        <h1 className="text-5xl font-bold tracking-tight text-white/90 xl:text-6xl">
          <span className="tracking-[0.25em] uppercase">Axiome</span>
        </h1>
        <p className="mt-4 text-xl text-white/50 leading-relaxed max-w-lg">
          Prenez le contrôle de vos finances personnelles avec des analyses intelligentes.
        </p>

        {/* points forts */}
        <div className="mt-12 space-y-6">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-500/10">
              <BarChart3 size={20} className="text-violet-400" />
            </div>
            <div>
              <p className="font-medium text-white/80">Tableau de bord complet</p>
              <p className="text-sm text-white/40">
                Solde, revenus, dépenses, budgets et projections en un coup d'oeil.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10">
              <Brain size={20} className="text-emerald-400" />
            </div>
            <div>
              <p className="font-medium text-white/80">Analyses automatiques</p>
              <p className="text-sm text-white/40">
                Détection d'anomalies, tendances et hausse d'abonnements.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/10">
              <Shield size={20} className="text-amber-400" />
            </div>
            <div>
              <p className="font-medium text-white/80">Données sécurisées</p>
              <p className="text-sm text-white/40">
                Mots de passe hachés, données isolées par utilisateur.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* colonne droite : formulaire */}
      <div className="flex w-full items-center justify-center px-6 lg:w-1/2 lg:px-16">
        <div className="w-full max-w-md">
          {/* logo mobile */}
          <div className="mb-8 lg:hidden">
            <h1 className="text-3xl font-bold tracking-[0.25em] text-white/90 uppercase">
              Axiome
            </h1>
            <p className="mt-2 text-base text-white/40">
              Gérez vos finances en toute simplicité.
            </p>
          </div>

          {/* toggle connexion / inscription */}
          <div className="grid grid-cols-2 gap-2 rounded-xl bg-white/[0.03] p-1.5 mb-8">
            <button
              type="button"
              onClick={() => {
                setMode("connexion");
                setErreur(null);
                setMessageSucces(null);
              }}
              className={cn(
                "rounded-lg py-2.5 text-sm font-semibold transition-all",
                mode === "connexion"
                  ? "bg-white/10 text-white shadow-sm"
                  : "text-white/40 hover:text-white/60"
              )}
            >
              Connexion
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("inscription");
                setErreur(null);
                setMessageSucces(null);
              }}
              className={cn(
                "rounded-lg py-2.5 text-sm font-semibold transition-all",
                mode === "inscription"
                  ? "bg-white/10 text-white shadow-sm"
                  : "text-white/40 hover:text-white/60"
              )}
            >
              Inscription
            </button>
          </div>

          {/* formulaire */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/60">
                Adresse email
              </label>
              <Input
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white/60">
                Mot de passe
              </label>
              <div className="relative">
                <Input
                  type={motDePasseVisible ? "text" : "password"}
                  placeholder={mode === "inscription" ? "minimum 6 caractères" : "votre mot de passe"}
                  value={motDePasse}
                  onChange={(e) => setMotDePasse(e.target.value)}
                  required
                  minLength={6}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setMotDePasseVisible((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
                >
                  {motDePasseVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* message d'erreur */}
            {erreur && (
              <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
                {erreur}
              </div>
            )}

            {/* message de succes */}
            {messageSucces && (
              <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 text-sm text-emerald-400">
                {messageSucces}
              </div>
            )}

            <Button
              type="submit"
              disabled={chargement}
              className="w-full bg-violet-600 font-semibold hover:bg-violet-500 disabled:opacity-50"
            >
              {chargement
                ? "Chargement..."
                : mode === "connexion"
                  ? "Se connecter"
                  : "Créer mon compte"}
            </Button>
          </form>

          {/* separateur */}
          <div className="my-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-white/[0.06]" />
            <span className="text-xs text-white/25">ou</span>
            <div className="h-px flex-1 bg-white/[0.06]" />
          </div>

          {/* mode simulation */}
          <button
            type="button"
            onClick={activerSimulation}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/[0.08] py-3.5 text-sm font-medium text-white/50 transition-all hover:border-white/15 hover:bg-white/[0.03] hover:text-white/70"
          >
            <Zap size={16} />
            Essayer en mode simulation
          </button>
          <p className="mt-3 text-center text-xs text-white/25">
            Testez l'interface avec des données fictives, sans créer de compte.
          </p>
        </div>
      </div>
    </div>
  );
}

// traduit les erreurs supabase en francais
function traduireErreur(message: string): string {
  if (message.includes("Invalid login credentials")) {
    return "Email ou mot de passe incorrect.";
  }
  if (message.includes("User already registered")) {
    return "Un compte existe déjà avec cette adresse email.";
  }
  if (message.includes("Password should be at least")) {
    return "Le mot de passe doit contenir au moins 6 caractères.";
  }
  if (message.includes("Unable to validate email")) {
    return "L'adresse email n'est pas valide.";
  }
  if (message.includes("Email rate limit exceeded")) {
    return "Trop de tentatives. Réessayez dans quelques minutes.";
  }
  return message;
}
