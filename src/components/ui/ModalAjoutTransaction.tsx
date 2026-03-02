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
      <Button
        onClick={() => setOuvert(true)}
        className="gap-2 bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-600/20 transition-all hover:bg-violet-500 hover:shadow-violet-500/30 sm:px-6 sm:text-base"
      >
        <Plus size={18} strokeWidth={2.5} />
        Ajouter
      </Button>

      <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto sm:max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.05]">
              <Receipt size={20} className="text-white/50" />
            </div>
            <div>
              <DialogTitle className="text-lg">Nouvelle transaction</DialogTitle>
              <DialogDescription className="text-sm">
                Ajouter un revenu ou une depense
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-4 pb-2">
          <FormulaireTransaction onSucces={() => setOuvert(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
