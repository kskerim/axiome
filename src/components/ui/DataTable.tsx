import { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
} from "@tanstack/react-table";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

// props generiques du composant datatable
interface DataTableProps<TData> {
  colonnes: ColumnDef<TData, unknown>[];
  donnees: TData[];
  filtreColonne?: string;
  filtreValeur?: string;
}

// composant datatable generique base sur tanstack table
export function DataTable<TData>({
  colonnes,
  donnees,
  filtreColonne,
  filtreValeur,
}: DataTableProps<TData>) {
  const [tri, setTri] = useState<SortingState>([]);
  const [filtresColonnes, setFiltresColonnes] = useState<ColumnFiltersState>(
    filtreColonne && filtreValeur && filtreValeur !== "toutes"
      ? [{ id: filtreColonne, value: filtreValeur }]
      : []
  );

  const table = useReactTable({
    data: donnees,
    columns: colonnes,
    state: {
      sorting: tri,
      columnFilters: filtresColonnes,
    },
    onSortingChange: setTri,
    onColumnFiltersChange: setFiltresColonnes,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: { pageSize: 15 },
    },
  });

  // synchronise le filtre externe avec l'etat interne
  const filtreActuel = filtresColonnes.find((f) => f.id === filtreColonne);
  const valeurFiltreActuel = (filtreActuel?.value as string) ?? "toutes";
  if (filtreColonne && filtreValeur && filtreValeur !== valeurFiltreActuel) {
    if (filtreValeur === "toutes") {
      setFiltresColonnes([]);
    } else {
      setFiltresColonnes([{ id: filtreColonne, value: filtreValeur }]);
    }
  }

  return (
    <div className="space-y-4">
      {/* tableau */}
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b border-white/[0.06]">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-3 text-left text-[11px] font-medium tracking-widest text-white/30 uppercase"
                    >
                      {header.isPlaceholder ? null : (
                        <button
                          className={cn(
                            "flex items-center gap-1.5",
                            header.column.getCanSort()
                              ? "cursor-pointer select-none hover:text-white/60"
                              : ""
                          )}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {header.column.getCanSort() && (
                            <ArrowUpDown size={12} className="text-white/20" />
                          )}
                        </button>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-white/[0.03] transition-colors hover:bg-white/[0.02]"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={colonnes.length}
                    className="px-4 py-12 text-center text-sm text-white/30"
                  >
                    aucune transaction trouvee
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* pagination */}
      <div className="flex items-center justify-between px-1">
        <p className="text-xs text-white/30">
          {table.getFilteredRowModel().rows.length} transaction
          {table.getFilteredRowModel().rows.length > 1 ? "s" : ""}
        </p>

        <div className="flex items-center gap-1">
          <BoutonPagination
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeft size={14} />
          </BoutonPagination>
          <BoutonPagination
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft size={14} />
          </BoutonPagination>

          <span className="px-3 text-xs text-white/50">
            {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
          </span>

          <BoutonPagination
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight size={14} />
          </BoutonPagination>
          <BoutonPagination
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <ChevronsRight size={14} />
          </BoutonPagination>
        </div>
      </div>
    </div>
  );
}

// bouton de pagination stylise
function BoutonPagination({
  onClick,
  disabled,
  children,
}: {
  onClick: () => void;
  disabled: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "rounded-md p-1.5 transition-colors",
        disabled
          ? "text-white/10 cursor-not-allowed"
          : "text-white/40 hover:bg-white/[0.06] hover:text-white/70"
      )}
    >
      {children}
    </button>
  );
}
