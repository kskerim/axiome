import { useForm, Controller } from "react-hook-form";
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
  { value: "transport", label: "Transport", icon: Car },
  { value: "automobile", label: "Automobile", icon: Fuel },
  { value: "logement", label: "Logement", icon: Home },
  { value: "loisirs", label: "Loisirs", icon: Gamepad2 },
  { value: "sante", label: "Santé", icon: HeartPulse },
  { value: "restauration", label: "Restauration", icon: UtensilsCrossed },
  { value: "bar_cafe", label: "Bar / Café", icon: Coffee },
  { value: "abonnements", label: "Abonnements", icon: CreditCard },
  { value: "shopping", label: "Shopping", icon: ShoppingBag },
  { value: "beaute", label: "Beauté", icon: Scissors },
  { value: "animaux", label: "Animaux", icon: PawPrint },
  { value: "maison", label: "Maison", icon: Wrench },
  { value: "cadeaux", label: "Cadeaux", icon: Gift },
  { value: "education", label: "Éducation", icon: GraduationCap },
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
  { value: "epargne", label: "Épargne", icon: PiggyBank },
];

// schema de validation zod
const schemaTransaction = z.object({
  estRevenu: z.boolean(),
  marchand: z.string().min(1, "le nom est requis").max(50),
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

// formulaire de saisie d'une transaction facon bankin
export function FormulaireTransaction({ onSucces }: FormulaireTransactionProps) {
  const ajouterTransaction = useAxiomeStore((s) => s.ajouterTransaction);

  const {
    register,
    handleSubmit,
    control,
    watch,
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

  const estRevenu = watch("estRevenu");
  const estRecurrente = watch("estRecurrente");
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
      `${data.estRevenu ? "Revenu" : "Dépense"} "${data.marchand}" (${signe}${data.montant.toFixed(2)} EUR)`
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
                "flex items-center justify-center gap-2 rounded-lg py-3 text-sm font-semibold transition-all duration-200",
                !field.value
                  ? "bg-red-500/15 text-red-400 shadow-sm"
                  : "text-white/40 hover:text-white/60"
              )}
            >
              <ArrowDownCircle size={18} />
              Dépense
            </button>
            <button
              type="button"
              onClick={() => {
                field.onChange(true);
                setValue("categorie", "");
                setValue("estRecurrente", false);
              }}
              className={cn(
                "flex items-center justify-center gap-2 rounded-lg py-3 text-sm font-semibold transition-all duration-200",
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

      {/* montant en gros (facon bankin) */}
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

      {/* grille de categories */}
      <div className="space-y-2">
        <Label>Catégorie</Label>
        <Controller
          name="categorie"
          control={control}
          render={({ field }) => (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {categoriesDisponibles.map((cat) => {
                const actif = field.value === cat.value;
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => field.onChange(cat.value)}
                    className={cn(
                      "flex flex-col items-center gap-1.5 rounded-lg border border-white/[0.06] p-2.5 text-white/50 transition-all duration-200",
                      actif
                        ? "border-white/20 bg-white/[0.08] text-white ring-1 ring-white/10"
                        : "hover:border-white/10 hover:bg-white/[0.03] hover:text-white/70"
                    )}
                  >
                    <Icon size={18} />
                    <span className="text-[11px] font-medium leading-tight">{cat.label}</span>
                  </button>
                );
              })}
            </div>
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
                "flex w-full items-center gap-3 rounded-xl border p-4 transition-all duration-200",
                field.value
                  ? "border-indigo-500/30 bg-indigo-500/[0.06]"
                  : "border-white/[0.06] bg-transparent hover:border-white/10"
              )}
            >
              <div
                className={cn(
                  "flex h-5 w-5 items-center justify-center rounded-md border transition-all",
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
                  Dépense récurrente (mensuelle)
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
            sera déduite automatiquement chaque mois pour les prévisions
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
        {estRevenu ? "Ajouter ce revenu" : "Ajouter cette dépense"}
      </Button>
    </form>
  );
}
