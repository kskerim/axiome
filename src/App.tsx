import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import Overview from "@/pages/Overview";
import Transactions from "@/pages/Transactions";
import AiInsights from "@/pages/AiInsights";

// composant racine avec routing et layout principal
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
    </BrowserRouter>
  );
}

export default App;
