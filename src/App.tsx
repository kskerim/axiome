import { lazy, Suspense, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { useAxiomeStore } from "@/store";
import { Accueil } from "@/pages/Accueil";

// lazy-load des pages pour reduire le bundle initial
const Overview = lazy(() => import("@/pages/Overview"));
const Transactions = lazy(() => import("@/pages/Transactions"));
const AiInsights = lazy(() => import("@/pages/AiInsights"));

// fallback de chargement minimal
function PageLoader() {
  return (
    <div className="flex h-64 items-center justify-center">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/10 border-t-white/50" />
    </div>
  );
}

// loader plein ecran pendant la verification de session
function ChargementInitial() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#09090b]">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-violet-400" />
        <p className="text-sm text-white/30">Chargement...</p>
      </div>
    </div>
  );
}

// contenu de l'app : redirige vers l'accueil si pas connecte
function AppContenu() {
  const { utilisateur, modeSimulation, chargement } = useAuth();
  const setUserId = useAxiomeStore((s) => s.setUserId);
  const chargerDepuisDb = useAxiomeStore((s) => s.chargerDepuisDb);
  const reinitialiser = useAxiomeStore((s) => s.reinitialiser);
  const dernierUserId = useRef<string | null>(null);

  // synchronise le store avec supabase quand l'utilisateur change
  useEffect(() => {
    const uid = utilisateur?.id ?? null;

    // evite de recharger si meme utilisateur
    if (uid === dernierUserId.current) return;
    dernierUserId.current = uid;

    if (uid) {
      // utilisateur connecte : charge ses transactions depuis supabase
      setUserId(uid);
      chargerDepuisDb();
    } else {
      // deconnecte : remet le store a zero
      setUserId(null);
      reinitialiser();
    }
  }, [utilisateur, setUserId, chargerDepuisDb, reinitialiser]);

  // quand le mode simulation demarre, on s'assure que le store est vide
  useEffect(() => {
    if (modeSimulation && !utilisateur) {
      reinitialiser();
    }
  }, [modeSimulation, utilisateur, reinitialiser]);

  // attend la verification de session
  if (chargement) return <ChargementInitial />;

  // pas connecte et pas en simulation : page d'accueil
  if (!utilisateur && !modeSimulation) return <Accueil />;

  // connecte ou en simulation : app principale
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<Suspense fallback={<PageLoader />}><Overview /></Suspense>} />
        <Route path="/transactions" element={<Suspense fallback={<PageLoader />}><Transactions /></Suspense>} />
        <Route path="/insights" element={<Suspense fallback={<PageLoader />}><AiInsights /></Suspense>} />
      </Route>
    </Routes>
  );
}

// composant racine avec auth, routing et notifications
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContenu />
        <Toaster
          theme="dark"
          position="bottom-right"
          richColors
          closeButton
          toastOptions={{
            style: {
              background: "hsl(240 6% 10%)",
              border: "1px solid rgba(255,255,255,0.06)",
              color: "rgba(255,255,255,0.8)",
            },
          }}
        />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
