import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/Dialog";
import { FormulaireTransaction } from "@/components/ui/FormulaireTransaction";

// bouton + modale pour ajouter une transaction
export function ModalAjoutTransaction() {
  const [ouvert, setOuvert] = useState(false);

  return (
    <Dialog open={ouvert} onOpenChange={setOuvert}>
      <Button variant="secondary" size="sm" onClick={() => setOuvert(true)}>
        <Plus size={15} />
        ajouter
      </Button>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>nouvelle transaction</DialogTitle>
          <DialogDescription>
            saisir manuellement un revenu ou une depense
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <FormulaireTransaction onSucces={() => setOuvert(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
