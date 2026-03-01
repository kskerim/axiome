import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { faker } from "@faker-js/faker";
import { toast } from "sonner";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Repeat,
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
} from "lucide-react";
import type { CategorieTransaction } from "@/types";
import { useAxiomeStore } from "@/store";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

// types visuels de transaction
const TYPES_TRANSACTION = [
  {
    value: "depense_ponctuelle" as const,
    label: "Dépense",
    description: "Achat unique",
    icon: ArrowDownCircle,
    couleur: "text-red-400 bg-red-500/10 border-red-500/20",
    couleurActive: "text-red-400 bg-red-500/15 border-red-500/40 ring-1 ring-red-500/20",
  },
  {
    value: "depense_recurrente" as const,
    label: "Abonnement",
    description: "Paiement mensuel",
    icon: Repeat,
    couleur: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
    couleurActive: "text-indigo-400 bg-indigo-500/15 border-indigo-500/40 ring-1 ring-indigo-500/20",
  },
  {
    value: "revenu" as const,
    label: "Revenu",
    description: "Salaire, virement...",
    icon: ArrowUpCircle,
    couleur: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    couleurActive: "text-emerald-400 bg-emerald-500/15 border-emerald-500/40 ring-1 ring-emerald-500/20",
  },
];

// categories avec icones et couleurs
const CATEGORIES_CONFIG: {
  value: CategorieTransaction;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
  types: string[];
}[] = [
  { value: "alimentation", label: "Alimentation", icon: ShoppingBag, types: ["depense_ponctuelle", "depense_recurrente"] },
  { value: "transport", label: "Transport", icon: Car, types: ["depense_ponctuelle", "depense_recurrente"] },
  { value: "automobile", label: "Automobile", icon: Fuel, types: ["depense_ponctuelle", "depense_recurrente"] },
  { value: "logement", label: "Logement", icon: Home, types: ["depense_ponctuelle", "depense_recurrente"] },
  { value: "loisirs", label: "Loisirs", icon: Gamepad2, types: ["depense_ponctuelle", "depense_recurrente"] },
  { value: "sante", label: "Santé", icon: HeartPulse, types: ["depense_ponctuelle", "depense_recurrente"] },
  { value: "restauration", label: "Restauration", icon: UtensilsCrossed, types: ["depense_ponctuelle", "depense_recurrente"] },
  { value: "bar_cafe", label: "Bar / Café", icon: Coffee, types: ["depense_ponctuelle"] },
  { value: "abonnements", label: "Abonnements", icon: CreditCard, types: ["depense_recurrente"] },
  { value: "shopping", label: "Shopping", icon: ShoppingBag, types: ["depense_ponctuelle"] },
  { value: "beaute", label: "Beauté", icon: Scissors, types: ["depense_ponctuelle", "depense_recurrente"] },
  { value: "animaux", label: "Animaux", icon: PawPrint, types: ["depense_ponctuelle", "depense_recurrente"] },
  { value: "maison", label: "Maison", icon: Wrench, types: ["depense_ponctuelle"] },
  { value: "cadeaux", label: "Cadeaux", icon: Gift, types: ["depense_ponctuelle"] },
  { value: "education", label: "Éducation", icon: GraduationCap, types: ["depense_ponctuelle", "depense_recurrente"] },
  { value: "voyage", label: "Voyage", icon: Plane, types: ["depense_ponctuelle"] },
  { value: "divers", label: "Divers", icon: CircleDot, types: ["depense_ponctuelle", "depense_recurrente"] },
  { value: "revenus", label: "Revenus", icon: Banknote, types: ["revenu"] },
  { value: "epargne", label: "Épargne", icon: PiggyBank, types: ["revenu"] },
];

// schema de validation zod
const schemaTransaction = z.object({
  type: z.enum(["revenu", "depense_ponctuelle", "depense_recurrente"]),
  marchand: z.string().min(1, "le nom est requis").max(50),
  montant: z
    .number({ error: "montant invalide" })
    .positive("le montant doit etre positif")
    .max(100000, "montant trop eleve"),
  categorie: z.string().min(1, "la categorie est requise"),
  date: z.string().min(1, "la date est requise"),
});

type FormTransaction = z.infer<typeof schemaTransaction>;

// props du formulaire
interface FormulaireTransactionProps {
  onSucces?: () => void;
}

// formulaire de saisie d'une transaction avec ux amelioree
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
      type: "depense_ponctuelle",
      marchand: "",
      montant: undefined,
      categorie: "",
      date: new Date().toISOString().split("T")[0],
    },
  });

  const typeSelectionne = watch("type");
  const categorieSelectionnee = watch("categorie");

  // categories filtrees par type
  const categoriesDisponibles = CATEGORIES_CONFIG.filter((c) =>
    c.types.includes(typeSelectionne)
  );

  // soumission du formulaire
  const onSubmit = (data: FormTransaction) => {
    const estRevenu = data.type === "revenu";
    const montantFinal = estRevenu ? data.montant : -data.montant;
    const typeLabel = TYPES_TRANSACTION.find((t) => t.value === data.type)?.label ?? "";

    ajouterTransaction({
      id: faker.string.uuid(),
      date: new Date(data.date),
      montant: montantFinal,
      categorie: data.categorie as CategorieTransaction,
      marchand: data.marchand,
      isRecurring: data.type === "depense_recurrente",
    });

    const emoji = estRevenu ? "+" : "-";
    toast.success(
      `${typeLabel} "${data.marchand}" ajout\u00e9e (${emoji}${data.montant.toFixed(2)})`
    );
    reset();
    onSucces?.();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* selecteur de type visuel */}
      <div className="space-y-3">
        <Label className="text-sm text-white/50">Type de transaction</Label>
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <div className="grid grid-cols-3 gap-3">
              {TYPES_TRANSACTION.map((t) => {
                const actif = field.value === t.value;
                const Icon = t.icon;
                return (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => {
                      field.onChange(t.value);
                      // reset la categorie si elle n'est pas compatible
                      const catOk = CATEGORIES_CONFIG.find(
                        (c) => c.value === categorieSelectionnee && c.types.includes(t.value)
                      );
                      if (!catOk) setValue("categorie", "");
                    }}
                    className={cn(
                      "flex flex-col items-center gap-2 rounded-xl border p-3 transition-all duration-200 sm:p-4",
                      actif ? t.couleurActive : t.couleur,
                      !actif && "opacity-60 hover:opacity-80"
                    )}
                  >
                    <Icon size={24} />
                    <span className="text-sm font-semibold">{t.label}</span>
                    <span className="hidden text-[11px] opacity-60 sm:block">
                      {t.description}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        />
      </div>

      {/* nom du marchand / source */}
      <div className="space-y-2">
        <Label htmlFor="marchand">
          {typeSelectionne === "revenu" ? "Source du revenu" : typeSelectionne === "depense_recurrente" ? "Nom de l'abonnement" : "Marchand / commerce"}
        </Label>
        <Input
          id="marchand"
          placeholder={
            typeSelectionne === "revenu"
              ? "ex: salaire, freelance, virement..."
              : typeSelectionne === "depense_recurrente"
                ? "ex: netflix, spotify, salle de sport..."
                : "ex: carrefour, amazon, uber..."
          }
          {...register("marchand")}
        />
        {errors.marchand && (
          <p className="text-sm text-red-400">{errors.marchand.message}</p>
        )}
      </div>

      {/* montant + date cote a cote */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* montant */}
        <div className="space-y-2">
          <Label htmlFor="montant">
            Montant {typeSelectionne === "depense_recurrente" && "/ mois"}
          </Label>
          <div className="relative">
            <Euro size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25" />
            <Input
              id="montant"
              type="number"
              step="0.01"
              placeholder="0.00"
              className="pl-10"
              {...register("montant", { valueAsNumber: true })}
            />
          </div>
          {errors.montant && (
            <p className="text-sm text-red-400">{errors.montant.message}</p>
          )}
        </div>

        {/* date */}
        <div className="space-y-2">
          <Label htmlFor="date">
            {typeSelectionne === "depense_recurrente" ? "D\u00e9but de l'abonnement" : "Date"}
          </Label>
          <Input id="date" type="date" {...register("date")} />
          {errors.date && (
            <p className="text-sm text-red-400">{errors.date.message}</p>
          )}
        </div>
      </div>

      {/* grille de categories visuelles */}
      <div className="space-y-2">
        <Label>Cat\u00e9gorie</Label>
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
                      "flex flex-col items-center gap-1.5 rounded-lg border border-white/[0.06] p-3 text-white/50 transition-all duration-200",
                      actif
                        ? "border-white/20 bg-white/[0.08] text-white ring-1 ring-white/10"
                        : "hover:border-white/10 hover:bg-white/[0.03] hover:text-white/70"
                    )}
                  >
                    <Icon size={20} />
                    <span className="text-xs font-medium">{cat.label}</span>
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

      {/* indicateur visuel recurrent */}
      {typeSelectionne === "depense_recurrente" && (
        <div className="flex items-center gap-3 rounded-lg border border-indigo-500/10 bg-indigo-500/[0.04] p-3.5">
          <Repeat size={18} className="text-indigo-400" />
          <p className="text-sm text-indigo-300/80">
            Cet abonnement sera marqu\u00e9 comme paiement mensuel r\u00e9current
          </p>
        </div>
      )}

      {/* bouton de soumission */}
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {typeSelectionne === "revenu"
          ? "Ajouter ce revenu"
          : typeSelectionne === "depense_recurrente"
            ? "Ajouter cet abonnement"
            : "Ajouter cette d\u00e9pense"}
      </Button>
    </form>
  );
}
