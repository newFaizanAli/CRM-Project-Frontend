import { useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  ColumnDef,
} from "@tanstack/react-table";

import { StockLedger } from "../utilities/types";
import useStockLedgerStore from "../store/store_ledger";

const columnHelper = createColumnHelper<StockLedger>();

const columns: ColumnDef<StockLedger, any>[] = [
  columnHelper.accessor("entryRefId", {
    header: "Entry ID",
    cell: (info) => {
      const value = info.getValue();
      if (typeof value === "object" && value !== null && "ID" in value) {
        return value.ID;
      }
      return "-";
    },
  }),
  columnHelper.accessor("direction", {
    header: "Direction",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("quantity", {
    header: "Quantity",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("entryType", {
    header: "Entry Type",
    cell: (info) => info.getValue() || "-",
  }),
  columnHelper.accessor("product", {
    header: "Product",
    cell: (info) => {
      const value = info.getValue();
      return typeof value === "object" ? value?.name ?? "-" : value || "-";
    },
  }),
  columnHelper.accessor("warehouse", {
    header: "Warehouse",
    cell: (info) => {
      const value = info.getValue();
      return typeof value === "object" ? value?.name ?? "-" : value || "-";
    },
  }),

  columnHelper.accessor("balance", {
    header: "Balance",
    cell: (info) => info.getValue(),
  }),

  columnHelper.accessor("date", {
    header: "Date",
    cell: (info) => {
      const date = info.getValue();
      return date ? new Date(date).toLocaleDateString() : "-";
    },
  }),
];

const StockEntryPage = () => {
  const { stockledger, fetchStockLedgers, isFetched } = useStockLedgerStore();

  useEffect(() => {
    if (!isFetched) {
      fetchStockLedgers();
    }
  }, [isFetched, fetchStockLedgers]);

  const table = useReactTable({
    data: stockledger,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Stock Ledger</h1>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockEntryPage;
