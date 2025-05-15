import { useEffect, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  type ColumnDef
} from "@tanstack/react-table";

import useLeadsStore from "../store/leads";
import LeadForm from "../components/LeadForm";
import { Lead } from "../utilities/types";

const columnHelper = createColumnHelper<Lead>();

const columns: ColumnDef<Lead, any>[] = [
  columnHelper.accessor("name", { header: "Name", cell: (info) => info.getValue() }),
  columnHelper.accessor("email", { header: "Email", cell: (info) => info.getValue() }),
  columnHelper.accessor("phone", { header: "Phone", cell: (info) => info.getValue() }),
  columnHelper.accessor("company", { header: "Company", cell: (info) => info.getValue() }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: (info) => {
      const status = info.getValue();
      const color = {
        new: "bg-blue-100 text-blue-800",
        contacted: "bg-yellow-100 text-yellow-800",
        qualified: "bg-green-100 text-green-800",
        lost: "bg-red-100 text-red-800",
      }[status];
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>
          {status}
        </span>
      );
    },
  }),
  columnHelper.accessor("source", { header: "Source", cell: (info) => info.getValue() }),
  columnHelper.accessor("value", {
    header: "Value",
    cell: (info) => `$${info.getValue().toLocaleString()}`,
  }),
];

const Leads = () => {
  const { leads, deleteLead, fetchLeads, isFetched } = useLeadsStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | undefined>();

  useEffect(() => {
    if (!isFetched) {
      fetchLeads();
    }
  }, [fetchLeads, isFetched]);

  const table = useReactTable({
    data: leads,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this lead?")) {
      deleteLead(id);
    }
  };

  const handleEdit = (lead: Lead) => {
    setSelectedLead(lead);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedLead(undefined);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setSelectedLead(undefined);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Leads</h2>
        <button onClick={handleAdd} className="bg-blue-500 text-white px-4 py-2 rounded">
          Add Lead
        </button>
      </div>

      <table className="w-full border-collapse">
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id} className="bg-gray-100">
              {headerGroup.headers.map(header => (
                <th key={header.id} className="p-2 text-left border-b">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
              <th className="p-2 text-left border-b">Actions</th>
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id} className="hover:bg-gray-50">
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className="p-2 border-b">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
              <td className="p-2 border-b">
                <button onClick={() => handleEdit(row.original)} className="text-blue-500 mr-2">
                  Edit
                </button>
                <button onClick={() => handleDelete(row.original._id)} className="text-red-500">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-[400px]">
            <LeadForm lead={selectedLead} onClose={handleClose} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Leads;
