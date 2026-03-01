import { useState } from "react";
import { getLogoUrl, getInitiales, getCouleurCategorie } from "@/lib/logos";
import { cn } from "@/lib/utils";

// props du composant avatar marchand
interface MerchantAvatarProps {
  marchand: string;
  categorie: string;
  taille?: number;
  className?: string;
}

// affiche le logo du marchand ou ses initiales en fallback
export function MerchantAvatar({
  marchand,
  categorie,
  taille = 32,
  className,
}: MerchantAvatarProps) {
  const [erreurImage, setErreurImage] = useState(false);
  const logoUrl = getLogoUrl(marchand, taille * 2);
  const initiales = getInitiales(marchand);
  const couleur = getCouleurCategorie(categorie);

  // si pas de logo ou erreur de chargement, affiche les initiales
  if (!logoUrl || erreurImage) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-lg font-medium text-xs",
          couleur,
          className
        )}
        style={{ width: taille, height: taille }}
      >
        {initiales}
      </div>
    );
  }

  return (
    <img
      src={logoUrl}
      alt={marchand}
      width={taille}
      height={taille}
      className={cn("rounded-lg object-contain bg-white/10", className)}
      onError={() => setErreurImage(true)}
      loading="lazy"
    />
  );
}
