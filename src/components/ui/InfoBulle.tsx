import { useState, useRef, useEffect } from "react";
import { HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

// props de la bulle informative
interface InfoBulleProps {
  texte: string;
  className?: string;
}

// bulle informative d'aide avec icone "?" et popup au clic/hover
export function InfoBulle({ texte, className }: InfoBulleProps) {
  const [ouvert, setOuvert] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // ferme la bulle quand on clique en dehors
  useEffect(() => {
    if (!ouvert) return;

    function handleClickExterieur(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOuvert(false);
      }
    }

    document.addEventListener("mousedown", handleClickExterieur);
    return () => document.removeEventListener("mousedown", handleClickExterieur);
  }, [ouvert]);

  return (
    <div ref={ref} className={cn("relative inline-flex", className)}>
      <button
        type="button"
        onClick={() => setOuvert((v) => !v)}
        onMouseEnter={() => setOuvert(true)}
        onMouseLeave={() => setOuvert(false)}
        className="rounded-full p-0.5 text-white/25 transition-colors hover:text-white/50 focus:outline-none focus:text-white/50"
        aria-label="aide"
      >
        <HelpCircle size={15} />
      </button>

      {ouvert && (
        <div className="absolute bottom-full left-1/2 z-50 mb-2 w-64 -translate-x-1/2 rounded-lg border border-white/10 bg-[#151518] px-3.5 py-2.5 text-sm leading-relaxed text-white/70 shadow-xl">
          {texte}
          {/* fleche vers le bas */}
          <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-[#151518]" />
        </div>
      )}
    </div>
  );
}
