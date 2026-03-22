import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { Eye, EyeOff, BarChart3, Shield, Brain, Zap } from "lucide-react";

// fond anime avec grille, aurora et particules
function FondAnime() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {/* grille de points subtile */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* nappes aurora avec gradient conique */}
      <div
        className="absolute -left-[20%] -top-[20%] h-[500px] w-[800px] rounded-full opacity-[0.12] blur-[120px] sm:h-[600px] sm:w-[900px]"
        style={{
          background: "conic-gradient(from 45deg, #7c3aed, #6366f1, #8b5cf6, transparent)",
          animation: "nappe-1 20s ease-in-out infinite alternate",
        }}
      />
      <div
        className="absolute -bottom-[15%] -right-[15%] h-[400px] w-[700px] rounded-full opacity-[0.10] blur-[100px] sm:h-[500px] sm:w-[800px]"
        style={{
          background: "conic-gradient(from 200deg, #6366f1, #a78bfa, #7c3aed, transparent)",
          animation: "nappe-2 25s ease-in-out infinite alternate",
        }}
      />
      <div
        className="absolute left-[40%] top-[20%] hidden h-[400px] w-[500px] rounded-full opacity-[0.06] blur-[100px] lg:block"
        style={{
          background: "conic-gradient(from 120deg, #8b5cf6, transparent, #7c3aed, transparent)",
          animation: "nappe-3 18s ease-in-out infinite alternate",
        }}
      />

      {/* 128 particules montantes */}
      {Array.from({ length: 128 }, (_, i) => (
        <div
          key={i}
          className="absolute bottom-0 rounded-full"
          style={{
            left: `${(i * 7.13 + i * i * 0.37) % 100}%`,
            width: `${1 + (i % 3)}px`,
            height: `${1 + (i % 3)}px`,
            background: `rgba(139, 92, 246, ${0.3 + (i % 5) * 0.1})`,
            boxShadow: i % 4 === 0 ? "0 0 4px 1px rgba(139, 92, 246, 0.2)" : "none",
            animation: `monter ${14 + (i % 12) * 3}s linear infinite`,
            animationDelay: `${(i * 0.47) % 20}s`,
          }}
        />
      ))}

      <style>{`
        @keyframes nappe-1 {
          0% { transform: translate(0, 0) rotate(0deg) scale(1); }
          50% { transform: translate(100px, 60px) rotate(15deg) scale(1.15); }
          100% { transform: translate(-40px, 100px) rotate(-8deg) scale(1.05); }
        }
        @keyframes nappe-2 {
          0% { transform: translate(0, 0) rotate(0deg) scale(1); }
          50% { transform: translate(-80px, -50px) rotate(-12deg) scale(1.1); }
          100% { transform: translate(60px, -30px) rotate(8deg) scale(0.95); }
        }
        @keyframes nappe-3 {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(50px, 30px) scale(1.1); }
          100% { transform: translate(-30px, -20px) scale(1.05); }
        }
        @keyframes monter {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          5% { opacity: 0.8; }
          80% { opacity: 0.5; }
          100% { transform: translateY(-110vh) translateX(30px); opacity: 0; }
        }
        @keyframes brillance {
          0%, 20% { background-position: 250% center; }
          80%, 100% { background-position: -250% center; }
        }
        @keyframes ligne-pulse {
          0% { opacity: 0.4; transform: scaleX(1); }
          100% { opacity: 0.7; transform: scaleX(1.2); }
        }
      `}</style>
    </div>
  );
}

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
        "Compte cree avec succes. Verifiez votre boite mail pour confirmer votre adresse."
      );
    }

    setChargement(false);
  };

  return (
    <div className="relative flex min-h-screen bg-[#09090b]">
      <FondAnime />

      {/* colonne gauche : presentation */}
      <div className="relative hidden lg:flex lg:w-1/2 flex-col justify-center px-16 xl:px-24">
        <h1 className="text-5xl font-bold tracking-tight xl:text-6xl">
          <span
            className="bg-clip-text text-transparent tracking-[0.25em] uppercase"
            style={{
              backgroundImage: "linear-gradient(110deg, rgba(255,255,255,0.9) 35%, rgba(167,139,250,1) 50%, rgba(255,255,255,0.9) 65%)",
              backgroundSize: "250% 100%",
              animation: "brillance 8s ease-in-out infinite",
            }}
          >
            Axiome
          </span>
        </h1>
        <div
          className="mt-5 h-px w-20 origin-left rounded-full"
          style={{
            background: "linear-gradient(90deg, #7c3aed, #6366f1, transparent)",
            animation: "ligne-pulse 3s ease-in-out infinite alternate",
          }}
        />
        <p className="mt-4 text-xl text-white/50 leading-relaxed max-w-lg">
          Prenez le controle de vos finances personnelles avec des analyses intelligentes.
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
                Solde, revenus, depenses et budgets en un coup d'oeil.
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
                Detection d'anomalies, tendances et hausse d'abonnements.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/10">
              <Shield size={20} className="text-amber-400" />
            </div>
            <div>
              <p className="font-medium text-white/80">Donnees securisees</p>
              <p className="text-sm text-white/40">
                Mots de passe haches, donnees isolees par utilisateur.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* colonne droite : formulaire */}
      <div className="relative flex w-full items-center justify-center px-6 lg:w-1/2 lg:px-16">
        <div className="w-full max-w-md">
          {/* logo mobile */}
          <div className="mb-8 lg:hidden">
            <h1 className="text-3xl font-bold">
              <span
                className="bg-clip-text text-transparent tracking-[0.25em] uppercase"
                style={{
                  backgroundImage: "linear-gradient(110deg, rgba(255,255,255,0.9) 35%, rgba(167,139,250,1) 50%, rgba(255,255,255,0.9) 65%)",
                  backgroundSize: "250% 100%",
                  animation: "brillance 8s ease-in-out infinite",
                }}
              >
                Axiome
              </span>
            </h1>
            <div
              className="mt-3 h-px w-16 rounded-full opacity-50"
              style={{ background: "linear-gradient(90deg, #7c3aed, #6366f1, transparent)" }}
            />
            <p className="mt-3 text-base text-white/40">
              Gerez vos finances en toute simplicite.
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
                "rounded-lg py-2.5 text-sm font-semibold transition-colors",
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
                "rounded-lg py-2.5 text-sm font-semibold transition-colors",
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
                  placeholder={mode === "inscription" ? "minimum 6 caracteres" : "votre mot de passe"}
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
                  : "Creer mon compte"}
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
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/[0.08] py-3.5 text-sm font-medium text-white/50 transition-colors hover:border-white/15 hover:bg-white/[0.03] hover:text-white/70"
          >
            <Zap size={16} />
            Essayer en mode simulation
          </button>
          <p className="mt-3 text-center text-xs text-white/25">
            Testez l'interface avec des donnees fictives, sans creer de compte.
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
    return "Un compte existe deja avec cette adresse email.";
  }
  if (message.includes("Password should be at least")) {
    return "Le mot de passe doit contenir au moins 6 caracteres.";
  }
  if (message.includes("Unable to validate email")) {
    return "L'adresse email n'est pas valide.";
  }
  if (message.includes("Email rate limit exceeded")) {
    return "Trop de tentatives. Reessayez dans quelques minutes.";
  }
  return message;
}
