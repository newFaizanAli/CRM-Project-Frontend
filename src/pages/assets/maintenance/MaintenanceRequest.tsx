import { useEffect, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  ColumnDef,
} from "@tanstack/react-table";
import { MaintenanceRequest } from "../../../utilities/types";
import useMaintenanceRequestStore from "../../../store/asset/maintainance/maintainance-request";
import MaintenanceRequestForm from "../../../components/form/assets/maintainance/MaintainanceRequest";

const columnHelper = createColumnHelper<MaintenanceRequest>();

const columns: ColumnDef<MaintenanceRequest, any>[] = [
  columnHelper.accessor("ID", {
    header: "Code",
    cell: (info) => info.getValue(),
  }),

  columnHelper.accessor((row) => row.asset, {
    id: "Asset",
    header: "Asset",
    cell: (info) => info.getValue()?.ID ?? "-",
  }),

  columnHelper.accessor((row) => row.reportedBy, {
    id: "reportedBy",
    header: "Reported-by",
    cell: (info) => info.getValue()?.name ?? "-",
  }),

  columnHelper.accessor((row) => row.assignedTo, {
    id: "Assigned-To",
    header: "Assigned-to",
    cell: (info) => info.getValue()?.name ?? "-",
  }),

  columnHelper.accessor("priority", {
    header: "Priority",
    cell: (info) => {
      const priority = info.getValue();
      const color = {
        Low: "bg-gray-100 text-gray-800",
        Medium: "bg-orange-100 text-orange-800",
        High: "bg-red-100 text-red-800",
      }[priority];
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>
          {priority}
        </span>
      );
    },
  }),

  columnHelper.accessor((row) => row.status, {
    id: "Status",
    header: "Status",
    cell: (info) => info.getValue() ?? "-",
  }),
];

const MaintenanceRequestPage = () => {
  const { requests, deleteRequest, fetchRequests, isFetched } =
    useMaintenanceRequestStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setselectedRequest] = useState<
    MaintenanceRequest | undefined
  >();

  useEffect(() => {
    if (!isFetched) {
      fetchRequests();
    }
  }, [fetchRequests, isFetched]);

  const table = useReactTable({
    data: requests,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this request?")) {
      deleteRequest(String(id));
    }
  };

  const handleEdit = (req: MaintenanceRequest) => {
    setselectedRequest(req);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setselectedRequest(undefined);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setselectedRequest(undefined);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Maintainance Requests
        </h1>
        <button onClick={handleAdd} className="btn btn-primary">
          Add Request
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-h-screen overflow-y-auto w-full max-w-3xl p-6">
            <h2 className="text-xl font-semibold mb-4">
              {selectedRequest ? "Edit Request" : "Add Request"}
            </h2>
            <MaintenanceRequestForm
              request={selectedRequest}
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

export default MaintenanceRequestPage;
