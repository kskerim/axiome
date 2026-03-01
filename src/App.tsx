import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import Overview from "@/pages/Overview";
import Transactions from "@/pages/Transactions";
import AiInsights from "@/pages/AiInsights";

// composant racine avec routing, layout et notifications
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<Overview />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/insights" element={<AiInsights />} />
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
