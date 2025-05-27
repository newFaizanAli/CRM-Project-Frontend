import { useEffect, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  ColumnDef,
} from "@tanstack/react-table";
import DealForm from "../components/DealForm";
import useDealsStore from "../store/deal";
import { Deal } from "../utilities/types";

const columnHelper = createColumnHelper<Deal>();

const columns: ColumnDef<Deal, any>[] = [
  columnHelper.accessor("name", {
    header: "Name",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor((row) => row.company, {
    header: "Company",
    cell: (info) => info.getValue()?.name ?? "-",
  }),

  columnHelper.accessor("value", {
    header: "Value",
    cell: (info) => `$${info.getValue().toLocaleString()}`,
  }),
  columnHelper.accessor("stage", {
    header: "Stage",
    cell: (info) => {
      const stage = info.getValue();
      const color = {
        proposal: "bg-blue-100 text-blue-800",
        negotiation: "bg-yellow-100 text-yellow-800",
        contract: "bg-purple-100 text-purple-800",
        closed: "bg-green-100 text-green-800",
        lost: "bg-red-100 text-red-800",
      }[stage];
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>
          {stage}
        </span>
      );
    },
  }),
  columnHelper.accessor("probability", {
    header: "Probability",
    cell: (info) => `${info.getValue()}%`,
  }),
  columnHelper.accessor("expectedCloseDate", {
    header: "Expected Close",
    cell: (info) => new Date(info.getValue()).toLocaleDateString(),
  }),
  columnHelper.accessor("owner", {
    header: "Owner",
    cell: (info) => info.getValue(),
  }),
];

const DealPage = () => {
  const { deals, fetchDeals, deleteDeal, isFetched } = useDealsStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<Deal | undefined>();

  useEffect(() => {
    if (!isFetched) {
      fetchDeals();
    }
  }, [fetchDeals, isFetched]);

  const table = useReactTable({
    data: deals,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleEdit = (deal: Deal) => {
    setSelectedDeal(deal);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this deal?")) {
      deleteDeal(id);
    }
  };

  const handleAdd = () => {
    setSelectedDeal(undefined);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setSelectedDeal(undefined);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Deals</h1>
        <button onClick={handleAdd} className="btn btn-primary">
          Add Deal
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-h-screen overflow-y-auto w-full max-w-3xl p-6">
            <h2 className="text-xl font-semibold mb-4">
              {selectedDeal ? "Edit Deal" : "Add Deal"}
            </h2>
            <DealForm deal={selectedDeal} onClose={handleClose} />
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

export default DealPage;
