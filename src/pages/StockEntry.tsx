import { useEffect, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  ColumnDef,
} from "@tanstack/react-table";

import useStockEntryStore from "../store/stock_entry";
import StockEntryForm from "../components/StockEntryForm";
import { StockEntry } from "../utilities/types";

const columnHelper = createColumnHelper<StockEntry>();

const columns: ColumnDef<StockEntry, any>[] = [
  columnHelper.accessor("product", {
    header: "Product",
    cell: (info) => {
      const value = info.getValue();
      return typeof value === "object" ? value?.name ?? "-" : value || "-";
    },
  }),
  columnHelper.accessor("entryType", {
    header: "Entry Type",
    cell: (info) => info.getValue() || "-",
  }),
  columnHelper.accessor("entryDate", {
    header: "Expire Date",
    cell: (info) => {
      const date = info.getValue();
      return date ? new Date(date).toLocaleDateString() : "-";
    },
  }),
  columnHelper.accessor("quantity", {
    header: "Quantity",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("rate", {
    header: "Rate",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("total", {
    header: "Total",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("warehouse", {
    header: "Warehouse",
    cell: (info) => {
      const value = info.getValue();
      return typeof value === "object" ? value?.name ?? "-" : value || "-";
    },
  }),
];

const StockEntryPage = () => {
  const {
    stockentry: stockEntries,
    deleteStockEntry,
    fetchStockEntries,
    isFetched,
  } = useStockEntryStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<StockEntry | undefined>();

  useEffect(() => {
    if (!isFetched) {
      fetchStockEntries();
    }
  }, [isFetched, fetchStockEntries]);

  const table = useReactTable({
    data: stockEntries,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleDelete = (id?: string) => {
    if (id && confirm("Are you sure you want to delete this stock entry?")) {
      deleteStockEntry(id.toString());
    }
  };

  const handleEdit = (entry: StockEntry) => {
    setSelectedEntry(entry);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedEntry(undefined);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setSelectedEntry(undefined);
    setIsModalOpen(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Stock Entries</h1>
        <button onClick={handleAdd} className="btn btn-primary">
          Add Stock Entry
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-xl">
            <h2 className="text-xl font-semibold mb-4">
              {selectedEntry ? "Edit Stock Entry" : "Add Stock Entry"}
            </h2>
            <StockEntryForm stockentry={selectedEntry} onClose={handleClose} />
          </div>
        </div>
      )}

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
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
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
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEdit(row.original)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(String(row.original._id))}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockEntryPage;
