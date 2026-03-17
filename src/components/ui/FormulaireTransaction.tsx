import { memo } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  ShoppingBag,
  Car,
  Home,
  Gamepad2,
  HeartPulse,
  UtensilsCrossed,
  CreditCard,
  GraduationCap,
  Plane,
  Banknote,
  PiggyBank,
  CircleDot,
  Euro,
  Fuel,
  Scissors,
  Coffee,
  PawPrint,
  Wrench,
  Gift,
  Check,
  Repeat,
  Smartphone,
  Wifi,
  Zap,
  Droplets,
  Flame,
  Shield,
} from "lucide-react";
import type { CategorieTransaction } from "@/types";
import { useAxiomeStore } from "@/store";
import { verifierDepassementBudget } from "@/hooks/useAlerteBudget";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

// categories pour les depenses
const CATEGORIES_DEPENSES: {
  value: CategorieTransaction;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
}[] = [
  { value: "alimentation", label: "Alimentation", icon: ShoppingBag },
  { value: "restauration", label: "Restauration", icon: UtensilsCrossed },
  { value: "bar_cafe", label: "Bar / Cafe", icon: Coffee },
  { value: "transport", label: "Transport", icon: Car },
  { value: "automobile", label: "Automobile", icon: Fuel },
  { value: "loyer", label: "Loyer", icon: Home },
  { value: "electricite", label: "Electricite", icon: Zap },
  { value: "eau", label: "Eau", icon: Droplets },
  { value: "gaz", label: "Gaz", icon: Flame },
  { value: "forfait_tel", label: "Forfait tel", icon: Smartphone },
  { value: "box_internet", label: "Box internet", icon: Wifi },
  { value: "assurances", label: "Assurances", icon: Shield },
  { value: "abonnements", label: "Abonnements", icon: CreditCard },
  { value: "shopping", label: "Shopping", icon: ShoppingBag },
  { value: "loisirs", label: "Loisirs", icon: Gamepad2 },
  { value: "sante", label: "Sante", icon: HeartPulse },
  { value: "beaute", label: "Beaute", icon: Scissors },
  { value: "animaux", label: "Animaux", icon: PawPrint },
  { value: "maison", label: "Maison", icon: Wrench },
  { value: "cadeaux", label: "Cadeaux", icon: Gift },
  { value: "education", label: "Education", icon: GraduationCap },
  { value: "voyage", label: "Voyage", icon: Plane },
  { value: "divers", label: "Divers", icon: CircleDot },
];

// categories pour les revenus
const CATEGORIES_REVENUS: {
  value: CategorieTransaction;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
}[] = [
  { value: "revenus", label: "Revenus", icon: Banknote },
  { value: "epargne", label: "Epargne", icon: PiggyBank },
];

// grille de categories memoized (evite 22 re-renders inutiles a chaque frappe)
const GrilleCategories = memo(function GrilleCategories({
  categories,
  valeur,
  onChange,
}: {
  categories: typeof CATEGORIES_DEPENSES;
  valeur: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
      {categories.map((cat) => {
        const Icon = cat.icon;
        return (
          <button
            key={cat.value}
            type="button"
            onClick={() => onChange(cat.value)}
            className={
              valeur === cat.value
                ? "flex flex-col items-center gap-1.5 rounded-lg border border-violet-500/40 bg-violet-500/15 p-2.5 text-violet-300"
                : "flex flex-col items-center gap-1.5 rounded-lg border border-white/[0.04] p-2.5 text-white/50 hover:border-white/10 hover:bg-white/[0.03] hover:text-white/70"
            }
          >
            <Icon size={18} />
            <span className="text-center text-[11px] font-medium leading-tight">{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
});

// schema de validation zod
const schemaTransaction = z.object({
  estRevenu: z.boolean(),
  marchand: z
    .string()
    .transform((v) => v.trim().replace(/<[^>]*>/g, ""))
    .pipe(z.string().min(1, "le nom est requis").max(50)),
  montant: z
    .number({ error: "montant invalide" })
    .positive("le montant doit etre positif")
    .max(100000, "montant trop eleve"),
  categorie: z.string().min(1, "la categorie est requise"),
  date: z.string().min(1, "la date est requise"),
  estRecurrente: z.boolean(),
});

type FormTransaction = z.infer<typeof schemaTransaction>;

// props du formulaire
interface FormulaireTransactionProps {
  onSucces?: () => void;
}

// formulaire de saisie d'une transaction
export function FormulaireTransaction({ onSucces }: FormulaireTransactionProps) {
  const ajouterTransaction = useAxiomeStore((s) => s.ajouterTransaction);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormTransaction>({
    resolver: zodResolver(schemaTransaction),
    defaultValues: {
      estRevenu: false,
      marchand: "",
      montant: undefined,
      categorie: "",
      date: new Date().toISOString().split("T")[0],
      estRecurrente: false,
    },
  });

  const estRevenu = useWatch({ control, name: "estRevenu" });
  const estRecurrente = useWatch({ control, name: "estRecurrente" });
  const categoriesDisponibles = estRevenu ? CATEGORIES_REVENUS : CATEGORIES_DEPENSES;

  // soumission du formulaire
  const onSubmit = (data: FormTransaction) => {
    const montantFinal = data.estRevenu ? data.montant : -data.montant;

    ajouterTransaction({
      id: crypto.randomUUID(),
      date: new Date(data.date),
      montant: montantFinal,
      categorie: data.categorie as CategorieTransaction,
      marchand: data.marchand,
      isRecurring: data.estRecurrente,
    });

    const signe = data.estRevenu ? "+" : "-";
    toast.success(
      `${data.estRevenu ? "Revenu" : "Depense"} "${data.marchand}" (${signe}${data.montant.toFixed(2)} EUR)`
    );

    // verifie le depassement de budget pour les depenses
    if (!data.estRevenu) {
      setTimeout(() => verifierDepassementBudget(data.categorie), 300);
    }

    reset();
    onSucces?.();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* toggle revenu / depense */}
      <Controller
        name="estRevenu"
        control={control}
        render={({ field }) => (
          <div className="grid grid-cols-2 gap-2 rounded-xl bg-white/[0.03] p-1.5">
            <button
              type="button"
              onClick={() => {
                field.onChange(false);
                setValue("categorie", "");
                setValue("estRecurrente", false);
              }}
              className={cn(
                "flex items-center justify-center gap-2 rounded-lg py-3 text-sm font-semibold transition-colors",
                !field.value
                  ? "bg-red-500/15 text-red-400 shadow-sm"
                  : "text-white/40 hover:text-white/60"
              )}
            >
              <ArrowDownCircle size={18} />
              Depense
            </button>
            <button
              type="button"
              onClick={() => {
                field.onChange(true);
                setValue("categorie", "");
                setValue("estRecurrente", false);
              }}
              className={cn(
                "flex items-center justify-center gap-2 rounded-lg py-3 text-sm font-semibold transition-colors",
                field.value
                  ? "bg-emerald-500/15 text-emerald-400 shadow-sm"
                  : "text-white/40 hover:text-white/60"
              )}
            >
              <ArrowUpCircle size={18} />
              Revenu
            </button>
          </div>
        )}
      />

      {/* montant en gros */}
      <div className="space-y-2">
        <div className="relative">
          <Euro
            size={22}
            className={cn(
              "absolute left-4 top-1/2 -translate-y-1/2",
              estRevenu ? "text-emerald-400/40" : "text-red-400/40"
            )}
          />
          <Input
            id="montant"
            type="number"
            step="0.01"
            placeholder="0.00"
            className={cn(
              "h-16 pl-12 text-3xl font-semibold tabular-nums tracking-tight",
              estRevenu ? "text-emerald-400" : "text-white/90"
            )}
            {...register("montant", { valueAsNumber: true })}
          />
        </div>
        {errors.montant && (
          <p className="text-sm text-red-400">{errors.montant.message}</p>
        )}
      </div>

      {/* marchand / source */}
      <div className="space-y-2">
        <Label htmlFor="marchand">
          {estRevenu ? "Source" : "Marchand"}
        </Label>
        <Input
          id="marchand"
          placeholder={
            estRevenu
              ? "ex: salaire, freelance..."
              : "ex: carrefour, amazon, uber..."
          }
          {...register("marchand")}
        />
        {errors.marchand && (
          <p className="text-sm text-red-400">{errors.marchand.message}</p>
        )}
      </div>

      {/* date */}
      <div className="space-y-2">
        <Label htmlFor="date">Date</Label>
        <Input id="date" type="date" {...register("date")} />
        {errors.date && (
          <p className="text-sm text-red-400">{errors.date.message}</p>
        )}
      </div>

      {/* grille de categories — composant memoized */}
      <div className="space-y-2">
        <Label>Categorie</Label>
        <Controller
          name="categorie"
          control={control}
          render={({ field }) => (
            <GrilleCategories
              categories={categoriesDisponibles}
              valeur={field.value}
              onChange={field.onChange}
            />
          )}
        />
        {errors.categorie && (
          <p className="text-sm text-red-400 mt-1">{errors.categorie.message}</p>
        )}
      </div>

      {/* checkbox depense recurrente (masquee pour les revenus) */}
      {!estRevenu && (
        <Controller
          name="estRecurrente"
          control={control}
          render={({ field }) => (
            <button
              type="button"
              onClick={() => field.onChange(!field.value)}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl border p-4 transition-colors",
                field.value
                  ? "border-indigo-500/30 bg-indigo-500/[0.06]"
                  : "border-white/[0.06] bg-transparent hover:border-white/10"
              )}
            >
              <div
                className={cn(
                  "flex h-5 w-5 items-center justify-center rounded-md border transition-colors",
                  field.value
                    ? "border-indigo-500 bg-indigo-500"
                    : "border-white/20 bg-transparent"
                )}
              >
                {field.value && <Check size={12} className="text-white" />}
              </div>
              <div className="flex items-center gap-2">
                <Repeat size={16} className={field.value ? "text-indigo-400" : "text-white/35"} />
                <span className={cn(
                  "text-sm font-medium",
                  field.value ? "text-indigo-300" : "text-white/50"
                )}>
                  Depense recurrente (mensuelle)
                </span>
              </div>
            </button>
          )}
        />
      )}

      {/* indicateur recurrence */}
      {estRecurrente && !estRevenu && (
        <div className="flex items-center gap-2 rounded-lg bg-indigo-500/[0.04] px-3 py-2">
          <Repeat size={14} className="text-indigo-400/70" />
          <p className="text-xs text-indigo-300/60">
            sera deduite automatiquement chaque mois pour les previsions
          </p>
        </div>
      )}

      {/* bouton de soumission */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className={cn(
          "w-full text-base font-semibold",
          estRevenu
            ? "bg-emerald-600 hover:bg-emerald-500"
            : "bg-white/90 text-black hover:bg-white/80"
        )}
      >
        {estRevenu ? "Ajouter ce revenu" : "Ajouter cette depense"}
      </Button>
    </form>
  );
}
