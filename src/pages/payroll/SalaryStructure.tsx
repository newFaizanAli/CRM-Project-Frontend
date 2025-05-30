import { useEffect, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  ColumnDef,
} from "@tanstack/react-table";
import { SalaryStructure } from "../../utilities/types";
import useSalaryStructureStore from "../../store/payroll/salary-structure";
import SalaryStructureForm from "../../components/form/payroll/SalaryStructureForm";

const columnHelper = createColumnHelper<SalaryStructure>();

const columns: ColumnDef<SalaryStructure, any>[] = [
  columnHelper.accessor((row) => row.employee, {
    id: "employeeInfo",
    header: "Employee",
    cell: (info) => {
      const emp = info.getValue();
      return emp ? `${emp.name}` : "-";
    },
  }),
  columnHelper.accessor("effectiveFrom", {
    header: "Effective from",
    cell: (info) =>
      new Date(info.getValue()).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
  }),
];

const SalaryStructurePage = () => {
  const {
    salaryStructures,
    deleteSalaryStructure,
    fetchSalaryStructures,
    isFetched,
  } = useSalaryStructureStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStructure, setselectedStructure] = useState<
    SalaryStructure | undefined
  >();

  useEffect(() => {
    if (!isFetched) {
      fetchSalaryStructures();
    }
  }, [fetchSalaryStructures, isFetched]);


  const table = useReactTable({
    data: salaryStructures,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleDelete = (id: string) => {
    if (
      window.confirm("Are you sure you want to delete this salary structure?")
    ) {
      deleteSalaryStructure(String(id));
    }
  };

  const handleEdit = (struc: SalaryStructure) => {
    setselectedStructure(struc);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setselectedStructure(undefined);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setselectedStructure(undefined);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Salary Structures</h1>
        <button onClick={handleAdd} className="btn btn-primary">
          Add Purchase Order
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-h-screen overflow-y-auto w-full max-w-3xl p-6">
            <h2 className="text-xl font-semibold mb-4">
              {selectedStructure
                ? "Edit Salary Structure"
                : "Add Salary Structure"}
            </h2>
            <SalaryStructureForm
              salary_structure={selectedStructure}
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

export default SalaryStructurePage;
