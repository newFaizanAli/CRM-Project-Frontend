import { useEffect, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  ColumnDef,
} from "@tanstack/react-table";
import { PurchaseReturn } from "../../utilities/types";
import usePurchaseReturnStore from "../../store/purchase-returns";
import PurchaseReturnForm from "../../components/PurchaseReturnForm";

const columnHelper = createColumnHelper<PurchaseReturn>();

const columns: ColumnDef<PurchaseReturn, any>[] = [
  columnHelper.accessor((row) => row.purchaseReceipt?.ID || "-", {
    id: "purchaseReceiptId",
    header: "Purchase Receipt",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor((row) => row.supplier?.name || "-", {
    id: "supplierName",
    header: "Supplier",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("returnDate", {
    header: "Return Date",
    cell: (info) => new Date(info.getValue()).toLocaleDateString(),
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: (info) => info.getValue(),
  }),
];

const PurchaseReturns = () => {
  const {
    purchaseReturns,
    deletePurchaseReturn,
    fetchPurchaseReturns,
    isFetched,
  } = usePurchaseReturnStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReturn, setSelectedReturn] = useState<
    PurchaseReturn | undefined
  >();

  useEffect(() => {
    if (!isFetched) {
      fetchPurchaseReturns();
    }
  }, [fetchPurchaseReturns, isFetched]);

  const table = useReactTable({
    data: purchaseReturns,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleDelete = (id: string) => {
    if (
      window.confirm("Are you sure you want to delete this purchase return?")
    ) {
      deletePurchaseReturn(String(id));
    }
  };

  const handleEdit = (pur_inv: PurchaseReturn) => {
    setSelectedReturn(pur_inv);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedReturn(undefined);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setSelectedReturn(undefined);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Purchase Receipts</h1>
        <button onClick={handleAdd} className="btn btn-primary">
          Add Purchase Invoice
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-h-screen overflow-y-auto w-full max-w-3xl p-6">
            <h2 className="text-xl font-semibold mb-4">
              {setSelectedReturn
                ? "Edit Purchase Return"
                : "Add Purchase Return"}
            </h2>
            <PurchaseReturnForm
              pur_return={selectedReturn}
              onClose={handleClose}
            />
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

export default PurchaseReturns;
