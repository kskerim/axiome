import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// utilitaire de fusion de classes tailwind
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
