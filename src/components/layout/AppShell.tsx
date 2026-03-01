import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

// shell principal de l'application avec sidebar et topbar
export function AppShell() {
  const [sidebarOuvert, setSidebarOuvert] = useState(false);

  return (
    <div className="flex h-screen bg-[#09090b] text-white antialiased">
      {/* sidebar fixe sur desktop, tiroir sur mobile */}
      <Sidebar
        ouvert={sidebarOuvert}
        onFermer={() => setSidebarOuvert(false)}
      />

      {/* zone de contenu principale */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar onOuvrirMenu={() => setSidebarOuvert(true)} />

        {/* contenu de la page active */}
        <main className="flex-1 overflow-y-auto px-6 py-8 lg:px-10 lg:py-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
