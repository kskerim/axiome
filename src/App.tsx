import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { AppShell } from "@/components/layout/AppShell";

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

// composant racine avec routing, layout et notifications
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<Suspense fallback={<PageLoader />}><Overview /></Suspense>} />
          <Route path="/transactions" element={<Suspense fallback={<PageLoader />}><Transactions /></Suspense>} />
          <Route path="/insights" element={<Suspense fallback={<PageLoader />}><AiInsights /></Suspense>} />
        </Route>
      </Routes>
      <Toaster
        theme="dark"
        position="bottom-right"
        toastOptions={{
          style: {
            background: "hsl(240 6% 10%)",
            border: "1px solid rgba(255,255,255,0.06)",
            color: "rgba(255,255,255,0.8)",
          },
        }}
      />
    </BrowserRouter>
  );
}

export default App;
