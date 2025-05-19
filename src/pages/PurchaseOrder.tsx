import { useEffect, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  ColumnDef,
} from "@tanstack/react-table";
import { PurchaseOrder } from "../utilities/types";
import usePurchaseOrderStore from "../store/purchase-orders";
import PurchaseOrderForm from "../components/PurchaseOrderForm";

const columnHelper = createColumnHelper<PurchaseOrder>();

const columns: ColumnDef<PurchaseOrder, any>[] = [
  columnHelper.accessor("ID", {
    header: "PO Number",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("supplier.name", {
    header: "Supplier",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("expectedDeliveryDate", {
    header: "Delivery Date",
    cell: (info) => new Date(info.getValue()).toLocaleDateString(),
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: (info) => (
      <span className={`px-2 py-1 rounded-full text-xs ${
        info.getValue() === "Completed" 
          ? "bg-green-100 text-green-800" 
          : info.getValue() === "Cancelled" 
            ? "bg-red-100 text-red-800" 
            : "bg-blue-100 text-blue-800"
      }`}>
        {info.getValue()}
      </span>
    ),
  }),
  columnHelper.accessor("grandTotal", {
    header: "Total Amount",
    cell: (info) => `Rs. ${info.getValue().toLocaleString()}`,
  }),
];

const PurchaseOrders = () => {
  const {
    purchaseOrders,
    deletePurchaseOrder,
    fetchPurchaseOrders,
    isFetched,
  } = usePurchaseOrderStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<
    PurchaseOrder | undefined
  >();

  useEffect(() => {
    if (!isFetched) {
      fetchPurchaseOrders();
    }
  }, [fetchPurchaseOrders, isFetched]);

  const table = useReactTable({
    data: purchaseOrders,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleDelete = (id: string) => {
    if (
      window.confirm("Are you sure you want to delete this purchase order?")
    ) {
      deletePurchaseOrder(String(id));
    }
  };

  const handleEdit = (pur_order: PurchaseOrder) => {
    setSelectedOrder(pur_order);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedOrder(undefined);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setSelectedOrder(undefined);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Purchase Orders</h1>
        <button onClick={handleAdd} className="btn btn-primary">
          Add Purchase Order
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-h-screen overflow-y-auto w-full max-w-3xl p-6">
            <h2 className="text-xl font-semibold mb-4">
              {selectedOrder ? "Edit Purchase Order" : "Add Purchase Order"}
            </h2>
            <PurchaseOrderForm order={selectedOrder} onClose={handleClose} />
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

export default PurchaseOrders;
