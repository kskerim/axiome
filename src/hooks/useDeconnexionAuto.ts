import { useEffect, useRef, useCallback } from "react";

// duree d'inactivite avant deconnexion (15 minutes en ms)
const DUREE_INACTIVITE = 15 * 60 * 1000;

// evenements qui comptent comme activite utilisateur
const EVENEMENTS_ACTIVITE = [
  "mousedown",
  "keydown",
  "touchstart",
  "scroll",
] as const;

// hook qui deconnecte automatiquement apres 15 minutes sans interaction
export function useDeconnexionAuto(deconnexion: () => void, actif: boolean) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const reinitialiserTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(deconnexion, DUREE_INACTIVITE);
  }, [deconnexion]);

  useEffect(() => {
    if (!actif) return;

    // demarre le timer
    reinitialiserTimer();

    // chaque interaction remet le timer a zero
    for (const evt of EVENEMENTS_ACTIVITE) {
      window.addEventListener(evt, reinitialiserTimer, { passive: true });
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      for (const evt of EVENEMENTS_ACTIVITE) {
        window.removeEventListener(evt, reinitialiserTimer);
      }
    };
  }, [actif, reinitialiserTimer]);
}
