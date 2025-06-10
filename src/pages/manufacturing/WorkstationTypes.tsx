import { useEffect, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  ColumnDef,
} from "@tanstack/react-table";
import { WorkstationType } from "../../utilities/types";
import useWorkstationTypeStore from "../../store/manufacturing/workstation-type";
import WorkstationTypeForm from "../../components/form/manufacturings/WorkstationTypeForm";

const columnHelper = createColumnHelper<WorkstationType>();

const columns: ColumnDef<WorkstationType, any>[] = [
  columnHelper.accessor("name", {
    header: "Name",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("defaultCostPerHour", {
    header: "Cost Per Hour",
    cell: (info) => {
      const value = info.getValue();
      return typeof value === "number" ? `${value.toFixed(2)} Rs/hr` : "-";
    },
  }),
  columnHelper.accessor("isActive", {
    header: "Status",
    cell: (info) => (info.getValue() ? "Active" : "Inactive"),
  }),
];

const WorkstationTypes = () => {
  const {
    workstationTypes,
    deleteWorkstationType,
    fetchWorkstationTypes,
    isFetched,
  } = useWorkstationTypeStore();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedWorkstation, setSelectedWorkstation] = useState<
    WorkstationType | undefined
  >();

  useEffect(() => {
    if (!isFetched) {
      fetchWorkstationTypes();
    }
  }, [fetchWorkstationTypes, isFetched]);


  const table = useReactTable({
    data: workstationTypes,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this type?")) {
      deleteWorkstationType(id);
    }
  };

  const handleEdit = (workstation: WorkstationType) => {
    setSelectedWorkstation(workstation);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedWorkstation(undefined);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setSelectedWorkstation(undefined);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Workstation Types</h1>
        <button onClick={handleAdd} className="btn btn-primary">
          Add Type
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-h-screen overflow-y-auto w-full max-w-3xl p-6">
            <h2 className="text-xl font-semibold mb-4">
              {selectedWorkstation ? "Edit Workstation" : "Add Workstation"}
            </h2>
            <WorkstationTypeForm
              work_station={selectedWorkstation}
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

export default WorkstationTypes;
