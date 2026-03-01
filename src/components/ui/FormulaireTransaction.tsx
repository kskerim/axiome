import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { faker } from "@faker-js/faker";
import { toast } from "sonner";
import type { CategorieTransaction } from "@/types";
import { useAxiomeStore } from "@/store";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";

// types de transaction possibles
const TYPES_TRANSACTION = [
  { value: "revenu", label: "revenu" },
  { value: "depense_ponctuelle", label: "depense ponctuelle" },
  { value: "depense_recurrente", label: "depense recurrente" },
] as const;

// categories disponibles pour les depenses
const CATEGORIES_DEPENSES: CategorieTransaction[] = [
  "alimentation",
  "transport",
  "logement",
  "loisirs",
  "sante",
  "restauration",
  "abonnements",
  "shopping",
  "education",
  "voyage",
  "divers",
];

// categories disponibles pour les revenus
const CATEGORIES_REVENUS: CategorieTransaction[] = ["revenus", "epargne"];

// schema de validation zod pour le formulaire
const schemaTransaction = z.object({
  type: z.enum(["revenu", "depense_ponctuelle", "depense_recurrente"]),
  marchand: z.string().min(1, "le nom du marchand est requis").max(50),
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

// formulaire de saisie manuelle d'une transaction
export function FormulaireTransaction({ onSucces }: FormulaireTransactionProps) {
  const ajouterTransaction = useAxiomeStore((s) => s.ajouterTransaction);

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
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
  const categories =
    typeSelectionne === "revenu" ? CATEGORIES_REVENUS : CATEGORIES_DEPENSES;

  // soumission du formulaire
  const onSubmit = (data: FormTransaction) => {
    const estRevenu = data.type === "revenu";
    const montantFinal = estRevenu ? data.montant : -data.montant;

    ajouterTransaction({
      id: faker.string.uuid(),
      date: new Date(data.date),
      montant: montantFinal,
      categorie: data.categorie as CategorieTransaction,
      marchand: data.marchand,
      isRecurring: data.type === "depense_recurrente",
    });

    toast.success(`transaction "${data.marchand}" ajoutee`);
    reset();
    onSucces?.();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* type de transaction */}
      <div className="space-y-2">
        <Label>type de transaction</Label>
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue placeholder="choisir un type" />
              </SelectTrigger>
              <SelectContent>
                {TYPES_TRANSACTION.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      {/* marchand */}
      <div className="space-y-2">
        <Label htmlFor="marchand">marchand / source</Label>
        <Input
          id="marchand"
          placeholder="ex: carrefour, salaire..."
          {...register("marchand")}
        />
        {errors.marchand && (
          <p className="text-xs text-red-400">{errors.marchand.message}</p>
        )}
      </div>

      {/* montant */}
      <div className="space-y-2">
        <Label htmlFor="montant">montant</Label>
        <Input
          id="montant"
          type="number"
          step="0.01"
          placeholder="0.00"
          {...register("montant", { valueAsNumber: true })}
        />
        {errors.montant && (
          <p className="text-xs text-red-400">{errors.montant.message}</p>
        )}
      </div>

      {/* categorie */}
      <div className="space-y-2">
        <Label>categorie</Label>
        <Controller
          name="categorie"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue placeholder="choisir une categorie" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.categorie && (
          <p className="text-xs text-red-400">{errors.categorie.message}</p>
        )}
      </div>

      {/* date */}
      <div className="space-y-2">
        <Label htmlFor="date">date</Label>
        <Input id="date" type="date" {...register("date")} />
        {errors.date && (
          <p className="text-xs text-red-400">{errors.date.message}</p>
        )}
      </div>

      {/* bouton de soumission */}
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        ajouter la transaction
      </Button>
    </form>
  );
}
