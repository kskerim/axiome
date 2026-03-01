import { useState } from "react";
import { Plus, Receipt } from "lucide-react";
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
        <Plus size={16} />
        ajouter
      </Button>

      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.05]">
              <Receipt size={20} className="text-white/50" />
            </div>
            <div>
              <DialogTitle className="text-lg">nouvelle transaction</DialogTitle>
              <DialogDescription className="text-sm">
                ajouter un revenu, une depense ou un abonnement mensuel
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-5">
          <FormulaireTransaction onSucces={() => setOuvert(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
