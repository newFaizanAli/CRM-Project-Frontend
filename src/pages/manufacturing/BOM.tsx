import { useEffect, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  ColumnDef,
} from "@tanstack/react-table";
import { BOM } from "../../utilities/types";
import useBOMStore from "../../store/manufacturing/bom";
import BOMForm from "../../components/form/manufacturings/BOMForm";

const columnHelper = createColumnHelper<BOM>();

const columns: ColumnDef<BOM, any>[] = [
  columnHelper.accessor("ID", {
    header: "PO Number",
    cell: (info) => info.getValue(),
  }),

  columnHelper.accessor("product.name", {
    header: "Product",
    cell: (info) => info.getValue(),
  }),

  columnHelper.accessor("isActive", {
    header: "Status",
    cell: (info) => (info.getValue() ? "Active" : "Inactive"),
  }),
  columnHelper.accessor("totalCost", {
    header: "Total Cost",
    cell: (info) => `Rs. ${info.getValue().toLocaleString()}`,
  }),
];

const BillOfMaterials = () => {
  const { bom, deleteBOM, fetchBOM, isFetched } = useBOMStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBOM, setSelectedBOM] = useState<BOM | undefined>();

  useEffect(() => {
    if (!isFetched) {
      fetchBOM();
    }
  }, [fetchBOM, isFetched]);

  const table = useReactTable({
    data: bom,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this bill?")) {
      deleteBOM(String(id));
    }
  };

  const handleEdit = (bom: BOM) => {
    setSelectedBOM(bom);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedBOM(undefined);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setSelectedBOM(undefined);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">BOM</h1>
        <button onClick={handleAdd} className="btn btn-primary">
          Add BOM
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-h-screen overflow-y-auto w-full max-w-3xl p-6">
            <h2 className="text-xl font-semibold mb-4">
              {selectedBOM ? "Edit BOM" : "Add BOM"}
            </h2>
            <BOMForm bom={selectedBOM} onClose={handleClose} />
          </div>
        </div>
      )}

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
                    onClick={() => handleDelete(row.original._id)}
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

export default BillOfMaterials;
