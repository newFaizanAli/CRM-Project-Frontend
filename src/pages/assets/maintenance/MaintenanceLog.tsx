import { useEffect, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  ColumnDef,
} from "@tanstack/react-table";
import { MaintenanceLog } from "../../../utilities/types";
import useMaintenanceLogStore from "../../../store/asset/maintainance/maintainance-log";
import MaintenanceLogForm from "../../../components/form/assets/maintainance/MaintainanceLogForm";

const columnHelper = createColumnHelper<MaintenanceLog>();

const columns: ColumnDef<MaintenanceLog, any>[] = [
  columnHelper.accessor("ID", {
    header: "Code",
    cell: (info) => info.getValue(),
  }),

  columnHelper.accessor((row) => row.asset, {
    id: "Asset",
    header: "Asset",
    cell: (info) => info.getValue()?.ID ?? "-",
  }),

  columnHelper.accessor((row) => row.performedBy, {
    id: "performedBy",
    header: "Performed-by",
    cell: (info) => info.getValue()?.name ?? "-",
  }),

  columnHelper.accessor((row) => row.type, {
    id: "Type",
    header: "Type",
    cell: (info) => info.getValue() ?? "-",
  }),
];

const MaintenanceLogPage = () => {
  const { logs , deleteLog, fetchLogs, isFetched } =
    useMaintenanceLogStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLog, setselectedLog] = useState<
    MaintenanceLog | undefined
  >();

  useEffect(() => {
    if (!isFetched) {
      fetchLogs();
    }
  }, [fetchLogs, isFetched]);

  const table = useReactTable({
    data: logs,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this log?")) {
      deleteLog(String(id));
    }
  };

  const handleEdit = (req: MaintenanceLog) => {
    setselectedLog(req);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setselectedLog(undefined);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setselectedLog(undefined);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Maintainance Logs
        </h1>
        <button onClick={handleAdd} className="btn btn-primary">
          Add Log
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-h-screen overflow-y-auto w-full max-w-3xl p-6">
            <h2 className="text-xl font-semibold mb-4">
              {selectedLog ? "Edit Log" : "Add Log"}
            </h2>
            <MaintenanceLogForm
              main_log={selectedLog}
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

export default MaintenanceLogPage;
