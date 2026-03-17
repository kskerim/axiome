import { useState, useRef, useEffect, useCallback } from "react";
import { HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

// props de la bulle informative
interface InfoBulleProps {
  texte: string;
  className?: string;
}

// bulle informative d'aide avec icone "?" et popup au clic/hover
// se repositionne automatiquement si elle depasse de l'ecran
export function InfoBulle({ texte, className }: InfoBulleProps) {
  const [ouvert, setOuvert] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const bulleRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<"haut" | "bas">("haut");
  const [decalageX, setDecalageX] = useState(0);

  // recalcule la position pour eviter les depassements
  const recalculerPosition = useCallback(() => {
    if (!bulleRef.current || !ref.current) return;

    const bouton = ref.current.getBoundingClientRect();
    const bulle = bulleRef.current.getBoundingClientRect();

    // si pas assez de place en haut, affiche en bas
    if (bouton.top - bulle.height - 8 < 0) {
      setPosition("bas");
    } else {
      setPosition("haut");
    }

    // decalage horizontal pour rester dans l'ecran
    const centreX = bouton.left + bouton.width / 2;
    const demiLargeur = bulle.width / 2;

    if (centreX - demiLargeur < 8) {
      setDecalageX(8 - (centreX - demiLargeur));
    } else if (centreX + demiLargeur > window.innerWidth - 8) {
      setDecalageX(window.innerWidth - 8 - (centreX + demiLargeur));
    } else {
      setDecalageX(0);
    }
  }, []);

  // ferme la bulle quand on clique en dehors
  useEffect(() => {
    if (!ouvert) return;

    recalculerPosition();

    function handleClickExterieur(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOuvert(false);
      }
    }

    document.addEventListener("mousedown", handleClickExterieur);
    return () => document.removeEventListener("mousedown", handleClickExterieur);
  }, [ouvert, recalculerPosition]);

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
        <div
          ref={bulleRef}
          className={cn(
            "absolute left-1/2 z-50 w-52 rounded-lg border border-white/10 bg-[#151518] px-3 py-2 text-xs leading-relaxed text-white/70 shadow-xl sm:w-64 sm:px-3.5 sm:py-2.5 sm:text-sm",
            position === "haut" ? "bottom-full mb-2" : "top-full mt-2"
          )}
          style={{ transform: `translateX(calc(-50% + ${decalageX}px))` }}
        >
          {texte}
          {/* fleche */}
          <div
            className={cn(
              "absolute left-1/2 -translate-x-1/2 border-4 border-transparent",
              position === "haut"
                ? "top-full border-t-[#151518]"
                : "bottom-full border-b-[#151518]"
            )}
            style={{ marginLeft: -decalageX }}
          />
        </div>
      )}
    </div>
  );
}
