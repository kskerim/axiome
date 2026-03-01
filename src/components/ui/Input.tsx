import * as React from "react";
import { cn } from "@/lib/utils";

// composant input stylise pour les formulaires

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => (
  <input
    type={type}
    className={cn(
      "flex h-11 w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3.5 py-2.5 text-base text-white/80 placeholder:text-white/25 focus:border-white/20 focus:outline-none focus:ring-1 focus:ring-white/10 disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    ref={ref}
    {...props}
  />
));
Input.displayName = "Input";

export { Input };
