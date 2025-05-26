import { useEffect, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  ColumnDef,
} from "@tanstack/react-table";
import { Department } from "../utilities/types";
import useDepartmentsStore from "../store/departments";
import DepartmentForm from "../components/DepartmentForm";

const columnHelper = createColumnHelper<Department>();

const columns: ColumnDef<Department, any>[] = [
  columnHelper.accessor("ID", {
    header: "Department ID",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("name", {
    header: "Name",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor((row) => row.parentDepartment, {
    id: "parentDepartment",
    header: "Parent Department",
    cell: (info) => info.getValue()?.name ?? "-",
  }),
  columnHelper.accessor((row) => row.manager, {
    id: "manager",
    header: "Manager",
    cell: (info) => info.getValue()?.name ?? "-",
  }),
  columnHelper.accessor("isActive", {
    header: "Status",
    cell: (info) => (info.getValue() ? "Active" : "Inactive"),
  }),
];

const DepartmentPage = () => {
  const { departments, fetchDepartments, deleteDepartment, isFetched } =
    useDepartmentsStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<
    Department | undefined
  >();

  useEffect(() => {
    if (!isFetched) {
      fetchDepartments();
    }
  }, [fetchDepartments, isFetched]);

  const table = useReactTable({
    data: departments,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleEdit = (dep: Department) => {
    setSelectedDepartment(dep);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this department?")) {
      deleteDepartment(id);
    }
  };

  const handleAdd = () => {
    setSelectedDepartment(undefined);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setSelectedDepartment(undefined);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Departments</h1>
        <button onClick={handleAdd} className="btn btn-primary">
          Add Department
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-h-screen overflow-y-auto w-full max-w-3xl p-6">
            <h2 className="text-xl font-semibold mb-4">
              {selectedDepartment ? "Edit Department" : "Add Department"}
            </h2>
            <DepartmentForm
              department={selectedDepartment}
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

export default DepartmentPage;
